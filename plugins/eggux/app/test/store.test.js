// node --test plugins/eggux/app/test/store.test.js
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { Project } = require('../lib/store');

const TPL = path.join(__dirname, '..', '..', 'skills');
function fresh() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'eggux-board-'));
  fs.mkdirSync(path.join(root, 'eggux', 'features', 'approvals'), { recursive: true });
  const fill = s => s.replace(/\{\{client\}\}/g, 'Acme').replace(/\{\{date\}\}/g, '2026-11-01').replace(/\{\{name\}\}/g, 'Approvals');
  fs.writeFileSync(path.join(root, 'eggux', 'decisions.md'), fill(fs.readFileSync(path.join(TPL, 'init', 'templates', 'decisions.md'), 'utf8')));
  fs.writeFileSync(path.join(root, 'eggux', 'features', 'approvals', 'decisions.md'), fill(fs.readFileSync(path.join(TPL, 'new-feature', 'templates', 'feature', 'decisions.md'), 'utf8')));
  return new Project(root);
}

test('reads the init templates', () => {
  const p = fresh();
  const s = p.state();
  assert.equal(s.project.name, 'Acme');
  assert.equal(s.decisions.product.decisions.length, 1);
  assert.equal(s.decisions.product.decisions[0].id, 'D-001');
  assert.equal(s.decisions.product.decisions[0].statusWord, 'verified');
  assert.equal(s.decisions.product.inbox.length, 0, 'the example comment is not an Inbox line');
  assert.equal(s.decisions.features[0].decisions[0].id, 'FD-01');
  assert.deepEqual(s.tasks, []);
});

test('Inbox: add, record as decision, dismiss', () => {
  const p = fresh();
  const line = p.addInbox('product', 'Andrei (manager)', 'cards with 12 px padding instead of 24');
  let d = p.decisionsOf('product');
  assert.equal(d.inbox.length, 1);
  assert.equal(d.inbox[0].who, 'Andrei (manager)');
  const id = p.addDecision('product', { title: 'Cards use 12 px padding', type: 'design', decision: 'Card padding 24 px (spacing/6) → 12 px (spacing/3)', scope: 'Card', from: 'Andrei (manager)', status: 'approved', inboxRaw: line });
  assert.equal(id, 'D-002');
  d = p.decisionsOf('product');
  assert.equal(d.inbox.length, 0, 'recorded line leaves the Inbox');
  assert.equal(d.decisions[0].id, 'D-002', 'newest first');
  assert.equal(d.decisions[0].fields.Scope, 'Card');
  assert.match(d.decisions[0].fields.Reason, /Source: Andrei/);
  p.addInbox('approvals', 'Maria', 'approvers add a reason when they reject');
  const raw = p.decisionsOf('approvals').inbox[0].raw;
  p.removeInbox('approvals', raw);
  assert.equal(p.decisionsOf('approvals').inbox.length, 0);
  assert.throws(() => p.removeInbox('approvals', raw), /changed or is gone/);
});

test('decision status and supersede', () => {
  const p = fresh();
  const a = p.addDecision('product', { title: 'Primary button says Start', type: 'terminology' });
  p.setDecisionStatus('product', a, 'applied');
  assert.match(p.decisionsOf('product').decisions.find(x => x.id === a).status, /^applied \d{4}-\d{2}-\d{2}$/);
  const b = p.addDecision('product', { title: 'Primary button says Get started', type: 'terminology', replaces: a });
  const all = p.decisionsOf('product').decisions;
  assert.equal(all.find(x => x.id === a).status, `superseded by ${b}`);
  assert.equal(all.find(x => x.id === b).fields.Replaces, a);
  const f = p.addDecision('approvals', { title: 'Reject needs a reason', type: 'behavior', scope: 'Approval Inbox' });
  assert.equal(f, 'FD-02');
  assert.equal(p.decisionsOf('approvals').decisions[0].fields.Affects, 'Approval Inbox');
});

test('multi-line fields survive a status change', () => {
  const p = fresh();
  const file = path.join(p.dir, 'decisions.md');
  fs.writeFileSync(file, fs.readFileSync(file, 'utf8').replace('### D-001', `### D-002 · 2026-10-21 09:15 · Cards use 12 px padding
- Type: design
- Implementation: Density token density/card-padding → spacing/3 (Comfortable), bound in
  Card, Stat Card; code: var(--card-padding) = 12px.
- Status: approved

### D-001`));
  p.setDecisionStatus('product', 'D-002', 'verified');
  const text = fs.readFileSync(file, 'utf8');
  assert.match(text, /bound in\n {2}Card, Stat Card/);
  const d = p.decisionsOf('product').decisions.find(x => x.id === 'D-002');
  assert.equal(d.statusWord, 'verified');
  assert.match(d.fields.Implementation, /bound in Card, Stat Card/);
});

test('terminology rows', () => {
  const p = fresh();
  p.addTerm({ use: 'Request access', dont: 'Demo', context: 'navbar' });
  p.addTerm({ use: 'Workspace', dont: 'Org | team', context: '' });
  const t = p.decisionsOf('product').terminology;
  assert.equal(t.length, 2);
  assert.equal(t[1].dont, 'Org / team');
});

test('tasks: create file, add, move, edit', () => {
  const p = fresh();
  const a = p.addTask({ title: 'Design approvals inbox', stage: 'design', links: 'D-001, feature:approvals', due: '2026-11-20' });
  assert.equal(a, 'T-002', 'the template holds T-001');
  let t = p.tasks().find(x => x.id === a);
  assert.deepEqual(t.links, ['D-001', 'feature:approvals']);
  assert.equal(t.status, 'todo');
  p.updateTask(a, { status: 'doing', stage: 'review', due: '', notes: 'waiting for copy' });
  t = p.tasks().find(x => x.id === a);
  assert.equal(t.status, 'doing'); assert.equal(t.stage, 'review'); assert.equal(t.due, ''); assert.equal(t.notes, 'waiting for copy');
  p.updateTask(a, { title: 'Design the approvals inbox' });
  assert.equal(p.tasks().find(x => x.id === a).title, 'Design the approvals inbox');
  assert.throws(() => p.updateTask(a, { status: 'blocked' }), /Unknown status/);
  assert.match(fs.readFileSync(path.join(p.dir, 'tasks.md'), 'utf8'), /^client: "Acme"/m);
});

test('notes: create, save, conflict, path safety', () => {
  const p = fresh();
  const f = p.addNote('Kickoff meeting, Acme');
  assert.match(f, /^\d{4}-\d{2}-\d{2}-kickoff-meeting-acme\.md$/);
  let n = p.readNote(f);
  const m = p.saveNote(f, { title: 'Kickoff', tags: 'meeting, client', body: '# Kickoff\n\n- [ ] send recap', baseMtime: n.mtime });
  n = p.readNote(f);
  assert.equal(n.title, 'Kickoff'); assert.equal(n.tags, 'meeting, client'); assert.match(n.body, /send recap/);
  assert.equal(p.notes()[0].tags.length, 2);
  assert.throws(() => p.saveNote(f, { body: 'x', baseMtime: m - 5000 }), /changed on disk/);
  assert.throws(() => p.readNote('../decisions.md'), /Bad note name/);
  assert.throws(() => p.sourceFile('../x'), /Bad feature slug/);
});
