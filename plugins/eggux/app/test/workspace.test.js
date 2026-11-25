// node --test plugins/eggux/app/test/store.test.js plugins/eggux/app/test/workspace.test.js
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');
const { Project } = require('../lib/store');
const W = require('../lib/workspace');

const DEMO = path.join(__dirname, '..', '..', '..', '..', 'examples', 'shop-demo');
const norm = s => s.replace(/\r\n/g, '\n');
const noUpdated = s => norm(s).replace(/^updated: .*$/m, 'updated: X');

function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const e of fs.readdirSync(from, { withFileTypes: true })) {
    const a = path.join(from, e.name), b = path.join(to, e.name);
    if (e.isDirectory()) copyDir(a, b); else fs.copyFileSync(a, b);
  }
}
function demo() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'eggux-ws-'));
  copyDir(path.join(DEMO, 'eggux'), path.join(root, 'eggux'));
  return new Project(root);
}
const read = (p, rel) => norm(fs.readFileSync(p.p(rel), 'utf8'));

test('editing one context entry leaves the rest of the file byte for byte', () => {
  const p = demo();
  for (const rel of ['actors.md', 'objects.md', 'workflows.md']) {
    const before = read(p, rel);
    const sec = W.readSection(p, rel);
    const e = sec.entries[1] || sec.entries[0];
    const field = sec.fields.find(f => f.type !== 'list' && f.label !== sec.fields[0].label);
    W.writeEntry(p, rel, e.index, { title: e.title, values: { [field.label]: 'Changed by the test' }, version: sec.version, expectTitle: e.title });
    const after = read(p, rel);
    const start = before.indexOf(`## ${e.title}`);
    const next = before.indexOf('\n## ', start + 3);
    assert.equal(noUpdated(after.slice(0, start)), noUpdated(before.slice(0, start)), `${rel}: text before the entry changed`);
    if (next > 0) assert.ok(after.endsWith(before.slice(next)), `${rel}: text after the entry changed`);
    assert.ok(after.includes(`- **${field.label}:** Changed by the test`), `${rel}: the edit is missing`);
  }
});

test('a stale version or a moved entry is refused with 409', () => {
  const p = demo();
  const sec = W.readSection(p, 'actors.md');
  const e = sec.entries[0];
  // Someone else adds a line to the file after the page loaded it.
  fs.appendFileSync(p.p('actors.md'), '\n## Late addition\n- **Who:** added elsewhere\n');
  assert.throws(() => W.writeEntry(p, 'actors.md', e.index, { title: e.title, values: {}, version: sec.version }), x => x.code === 409);
  const fresh = W.readSection(p, 'actors.md');
  assert.throws(() => W.writeEntry(p, 'actors.md', e.index, { title: e.title, values: {}, version: fresh.version, expectTitle: 'Somebody else' }), x => x.code === 409);
  assert.doesNotThrow(() => W.writeEntry(p, 'actors.md', e.index, { title: e.title, values: {}, version: fresh.version, expectTitle: e.title }));
});

test('questions.md and research files round-trip without losing lines', () => {
  const p = demo();
  const q0 = read(p, 'questions.md');
  const withNote = q0.replace('- Recommended: A\n', '- Recommended: A\nA note someone wrote by hand.\n');
  assert.notEqual(withNote, q0, 'the demo has no Recommended line to annotate');
  fs.writeFileSync(p.p('questions.md'), withNote);
  W.addOption(p, 'Q-002', { title: 'Both, by screen size', pros: ['Flexible'], cons: [] });
  const q1 = read(p, 'questions.md');
  assert.ok(q1.includes('A note someone wrote by hand.'), 'a hand-written line was dropped');
  assert.ok(q1.includes('### C · Both, by screen size'));

  const rel = 'research/checkout-patterns-on-mobile.md';
  const r0 = read(p, rel);
  const r = W.parseResearch(p, 'checkout-patterns-on-mobile.md');
  const annotated = r0.replace(/(- Vote: \w+\n)/, '$1- Checked against: Q3 analytics\n');
  assert.notEqual(annotated, r0, 'the demo research has no Vote line to annotate');
  fs.writeFileSync(p.p(rel), annotated);
  W.voteFinding(p, 'checkout-patterns-on-mobile', 'F-04', 'rejected');
  const r1 = read(p, rel);
  assert.ok(r1.includes('- Checked against: Q3 analytics'), 'an unknown finding line was dropped');
  assert.ok(r1.includes(r.report.split('\n')[0]), 'the report changed');
});

test('deleted files go to eggux/.trash', () => {
  const p = demo();
  fs.mkdirSync(p.p('notes'), { recursive: true });
  fs.writeFileSync(p.p('notes/2026-11-25-kickoff.md'), '---\ntitle: "Kickoff"\ndate: "2026-11-25"\ntags: []\n---\n\nBody\n');
  p.deleteNote('2026-11-25-kickoff.md');
  assert.ok(!fs.existsSync(p.p('notes/2026-11-25-kickoff.md')));
  const trashed = fs.readdirSync(p.p('.trash'));
  assert.equal(trashed.length, 1);
  assert.match(trashed[0], /notes__2026-11-25-kickoff\.md$/);
});

test('JSON from Claude is found even with prose and braces in strings', () => {
  const { extractJson } = require('../lib/claude');
  assert.deepEqual(extractJson('Sure. {"a": "x}y", "b": [1, 2]} Done {"c": 3}'), { a: 'x}y', b: [1, 2] });
  assert.deepEqual(extractJson('```json\n{"ok": true}\n```'), { ok: true });
  assert.throws(() => extractJson('no json here'));
});

test('the server refuses other Host headers (DNS rebinding)', async () => {
  const p = demo();
  const port = 4400 + Math.floor(Math.random() * 400);
  const srv = spawn(process.execPath, [path.join(__dirname, '..', 'server.js'), '--root', p.root, '--port', String(port)], { stdio: ['ignore', 'pipe', 'pipe'] });
  try {
    await new Promise((resolve, reject) => { srv.stdout.on('data', resolve); srv.on('error', reject); setTimeout(resolve, 1500); });
    const get = host => new Promise((resolve, reject) => {
      http.get({ host: '127.0.0.1', port, path: '/api/state', headers: { Host: host } }, res => { res.resume(); resolve(res.statusCode); }).on('error', reject);
    });
    assert.equal(await get(`127.0.0.1:${port}`), 200);
    assert.equal(await get(`localhost:${port}`), 200);
    assert.equal(await get('evil.example.com'), 403);
  } finally { srv.kill(); }
});

test('choosing an option logs a proposed decision with scope and a task with a deliverable', () => {
  const p = demo();
  const q = W.parseQuestions(p).find(x => x.status === 'open' && x.options.length);
  assert.ok(q, 'the demo has no open question with options');
  const o = q.options[0];
  const r = W.chooseOption(p, q.id, o.key, { decision: 'Exact decision text', scope: 'Product page', verify: 'Check the product page' });
  const d = read(p, 'decisions.md');
  const entry = d.slice(d.indexOf(`### ${r.decision} · `)).split('\n### ')[0];
  assert.ok(entry.includes(`· ${o.title}`), 'the title is not the chosen option');
  assert.ok(entry.includes('- Decision: Exact decision text'));
  assert.ok(entry.includes('- Scope: Product page'));
  assert.ok(entry.includes('- Verify: Check the product page'));
  assert.ok(entry.includes('- Status: proposed'));
  assert.ok(entry.includes(`Answers ${q.id}`));
  const t = read(p, 'tasks.md');
  assert.ok(t.includes(`${r.decision} applied and verified with /eggux:decision-log`));
  assert.equal(W.parseQuestions(p).find(x => x.id === q.id).status, `decided ${o.key} (${r.decision})`);
});

test('feature questions live in questions.md and show on the feature', () => {
  const p = demo();
  const [a, b] = W.addFeatureQuestions(p, 'forgot-password', [
    { question: 'Lock the account after five resets?', blocks: 'backend', default: 'No' },
    'Who signs off the email copy?',
  ]);
  const q = W.parseQuestions(p);
  const qa = q.find(x => x.id === a.id), qb = q.find(x => x.id === b.id);
  assert.equal(qa.source, 'feature:forgot-password');
  assert.equal(qa.recommended, 'A');
  assert.equal(qa.options[0].title, 'No');
  assert.ok(qa.extra.includes('- Blocks: backend'));
  assert.equal(qb.options.length, 0);
  const f = p.flows().find(x => x.slug === 'forgot-password');
  assert.ok(f.questions.some(x => x.id === a.id) && f.questions.some(x => x.id === b.id));
  W.chooseOption(p, a.id, 'A', { scope: 'Reset password' });
  const f2 = p.flows().find(x => x.slug === 'forgot-password');
  assert.equal(f2.openQuestions, f.openQuestions - 1);
});

test('screens are gathered from the handoff and scenarios; components know where they are used', () => {
  const L = require('../lib/library');
  const p = demo();
  const screens = L.featureScreens(p, 'forgot-password');
  const fp = screens.find(s => s.name === 'Forgot password');
  assert.ok(fp, 'no Forgot password screen');
  assert.match(fp.route, /\/forgot-password/);
  assert.ok(fp.states.includes('default'));
  assert.ok(fp.components.some(c => c.name === 'Button' && c.story));
  assert.ok(fp.copy.some(c => /title/.test(c.where)));
  assert.ok(fp.scenarios.some(s => s.id === 'S-01'));
  assert.deepEqual(L.featureScreens(p, '../etc'), []);
  const pages = L.componentUsage(p, p.flows());
  const button = pages.find(x => x.file === 'button');
  assert.ok(button.used.find(u => u.component === 'Button').uses.some(u => u.screen === 'Forgot password'));
  assert.ok(L.componentPage('button').startsWith('# Button'));
  assert.throws(() => L.componentPage('../../README'), e => e.code === 404);
});

test('any section can be deleted to the trash, and a base section comes back from the init template', () => {
  const p = demo();
  const sec = W.readSection(p, 'workflows.md');
  W.deleteSection(p, 'workflows.md', sec.version);
  assert.equal(p.read('workflows.md'), null);
  assert.ok(fs.readdirSync(p.p('.trash')).some(n => n.endsWith('workflows.md')));
  assert.ok(!W.workState(p).context.some(s => s.id === "workflows.md"));
  const r = W.createSection(p, { core: 'workflows.md' });
  assert.equal(r.id, 'workflows.md');
  const back = read(p, 'workflows.md');
  assert.match(back, /^# Workflows$/m);
  assert.match(back, /client: "Shop demo/);
  assert.ok(!/\{\{/.test(back), 'placeholders left in the file');
  assert.throws(() => W.createSection(p, { core: 'workflows.md' }), x => x.code === 409);
  assert.throws(() => W.createSection(p, { core: '../decisions.md' }), x => x.code === 400);
  assert.throws(() => W.deleteSection(p, 'decisions.md'), x => x.code === 404);
});
