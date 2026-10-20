// EGG UX feature page. Paste as the `code` of a use_figma call in the client's Figma file.
// Fill CONFIG from the feature folder (feature.md, workflows.md, scenarios.md). Creates the page
// "<name>" after a "FEATURES" divider page, with one Figma section per part:
// Overview, Flows, one per scenario (S-xx), one per edge case (E-xx), States, Archive.
// Screens are placeholders named "<ID> / <n> <screen>"; build-ui replaces them with real screens.
// Everything is bound to the library's variables and text styles. Stops if the page exists
// (use update-feature for an existing page).
const CONFIG = {
  name: 'Invoice approval',
  status: 'draft', // draft, ready, in design, in review, ready for dev, built, verified
  spec: 'eggux/features/invoice-approval/',
  updated: '2026-10-20',
  summary: 'Invoices over a limit need approval before payment. Approvers act from the invoice or from email.',
  actors: ['Requester', 'Approver', 'Finance admin'],
  frame: { w: 1440, h: 900 }, // 390 x 844 for a mobile-first feature
  flows: [
    { id: 'F-01', name: 'Submit and approve', steps: [
      { label: 'Open invoice', actor: 'Requester' },
      { label: 'Submit for approval', actor: 'Requester' },
      { label: 'Amount over €5,000?', type: 'decision', yes: 'Second approver', no: 'Approver decides' },
      { label: 'Approve or reject with a reason', actor: 'Approver' },
      { label: 'Requester notified', actor: 'System' },
    ] },
  ],
  scenarios: [
    { id: 'S-01', title: 'Approver approves an invoice', given: 'An invoice of €3,200 waiting for Ana', when: 'Ana opens it and selects Approve', then: 'The invoice is Approved, the requester gets a notification, the audit log has the entry', screens: ['Invoice detail', 'Approve dialog', 'Invoice approved'] },
  ],
  edgeCases: [
    { id: 'E-01', title: 'Approver is away', given: 'Ana is on leave with a delegate set', when: 'An invoice needs her approval', then: 'It goes to the delegate; both see who approved', screens: ['Invoice detail, delegated'] },
  ],
  states: ['Empty', 'Loading', 'Error', 'No access'],
};

const all = await figma.variables.getLocalVariablesAsync();
const N = n => { const v = all.find(v => v.name === n); if (!v) throw new Error('Missing variable ' + n + '. Is this a copy of EGG UI?'); return v; };
const paint = n => figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }, 'color', N(n));
const styles = await figma.getLocalTextStylesAsync();
const TS = n => { const s = styles.find(x => x.name === n); if (!s) throw new Error('Missing text style ' + n); return s; };
for (const n of ['display', 'heading/h1', 'heading/h2', 'heading/h3', 'body/lead', 'body/default', 'body/small', 'ui/label', 'ui/caption', 'ui/overline']) await figma.loadFontAsync(TS(n).fontName);
const txt = async (parent, chars, style, fill, w) => { const t = figma.createText(); parent.appendChild(t); await t.setTextStyleIdAsync(TS(style).id); t.characters = chars; t.fills = [paint(fill)]; if (w) { t.textAutoResize = 'HEIGHT'; t.resize(w, t.height); } return t; };
const sp = (f, k, v) => f.setBoundVariable(k, N('spacing/' + v));
const pad = (f, x, y) => { sp(f, 'paddingLeft', x); sp(f, 'paddingRight', x); sp(f, 'paddingTop', y); sp(f, 'paddingBottom', y); };
const rad = (f, v) => { for (const k of ['topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius']) f.setBoundVariable(k, N('radius/' + v)); };
const box = (name, dir, parent, gap) => { const f = figma.createFrame(); f.name = name; if (parent) parent.appendChild(f); f.layoutMode = dir; f.fills = []; f.clipsContent = false; f.primaryAxisSizingMode = 'AUTO'; f.counterAxisSizingMode = 'AUTO'; if (gap) sp(f, 'itemSpacing', gap); return f; };
const border = f => { f.strokes = [paint('border/default')]; f.strokeAlign = 'INSIDE'; f.setBoundVariable('strokeWeight', N('border-width/DEFAULT')); };
const pill = async (parent, label) => { const p = box('status', 'HORIZONTAL', parent); pad(p, '2', '0_5'); rad(p, 'full'); p.fills = [paint('background/muted')]; await txt(p, label, 'ui/caption', 'foreground/default'); return p; };
const fixW = (f, w) => { f.resize(w, 10); f.counterAxisSizingMode = 'FIXED'; f.primaryAxisSizingMode = 'AUTO'; return f; };

// Page, after a FEATURES divider (created at the end when missing)
if (figma.root.children.some(p => p.name === CONFIG.name)) throw new Error('A page named "' + CONFIG.name + '" exists. Use update-feature.');
let div = figma.root.children.find(p => p.name === 'FEATURES');
if (!div) { div = figma.createPage(); div.name = 'FEATURES'; }
const pages = figma.root.children; const di = pages.indexOf(div);
let at = di + 1; while (at < pages.length && pages[at].name.localeCompare(CONFIG.name) < 0) at++;
const page = figma.createPage(); page.name = CONFIG.name; figma.root.insertChild(at, page);
await figma.setCurrentPageAsync(page);

const sections = [];
const section = name => { const s = figma.createSection(); s.name = name; page.appendChild(s); sections.push(s); return s; };
const place = (sec, nodes, gap = 80) => { let x = 80, y = 120, h = 0; for (const n of nodes) { sec.appendChild(n); n.x = x; n.y = y; x += n.width + gap; h = Math.max(h, n.height); } sec.resizeWithoutConstraints(Math.max(x - gap + 80, 800), y + h + 80); };

// Overview
const ov = fixW(box('Overview', 'VERTICAL', null, '6'), 1440); pad(ov, '16', '12'); ov.fills = [paint('background/card')]; border(ov); rad(ov, 'xl');
await txt(ov, 'FEATURE', 'ui/overline', 'foreground/muted');
await txt(ov, CONFIG.name, 'heading/h1', 'foreground/card');
await txt(ov, CONFIG.summary, 'body/lead', 'foreground/muted', 1000);
const meta = box('meta', 'VERTICAL', ov, '2');
for (const [k, v] of [['Status', CONFIG.status], ['Actors', CONFIG.actors.join(', ')], ['Spec', CONFIG.spec], ['Updated', CONFIG.updated]]) { const r = box(k, 'HORIZONTAL', meta, '4'); const l = await txt(r, k, 'ui/label', 'foreground/muted'); l.resize(120, l.height); l.textAutoResize = 'HEIGHT'; k === 'Status' ? await pill(r, v) : await txt(r, v, 'body/default', 'foreground/card'); }
await txt(ov, 'IDs: F = flow, S = scenario, E = edge case. Screens are named "<ID> / <n> <screen>". Superseded frames move to Archive with the date.', 'body/small', 'foreground/muted', 1000);
place(section('Overview'), [ov]);

// Flows
const flowFrames = [];
for (const f of CONFIG.flows) {
  const fr = fixW(box('Flow / ' + f.id + ' ' + f.name, 'VERTICAL', null, '6'), 1440); pad(fr, '10', '10'); fr.fills = [paint('background/default')]; border(fr); rad(fr, 'xl');
  const h = box('header', 'VERTICAL', fr, '1'); await txt(h, 'FLOW ' + f.id, 'ui/overline', 'foreground/muted'); await txt(h, f.name, 'heading/h3', 'foreground/default');
  const row = box('steps', 'HORIZONTAL', fr, '3'); row.layoutWrap = 'WRAP'; sp(row, 'counterAxisSpacing', '4'); row.counterAxisAlignItems = 'CENTER'; row.layoutSizingHorizontal = 'FILL';
  for (let i = 0; i < f.steps.length; i++) {
    const s = f.steps[i]; const dec = s.type === 'decision';
    const c = fixW(box((i + 1) + ' ' + s.label, 'VERTICAL', row, '1'), 200); pad(c, '4', '3'); rad(c, 'lg'); border(c); c.fills = [paint(dec ? 'background/muted' : 'background/card')];
    await txt(c, dec ? 'DECISION' : (s.actor || 'Step ' + (i + 1)).toUpperCase(), 'ui/overline', 'foreground/muted', 168);
    await txt(c, s.label, 'ui/label', 'foreground/card', 168);
    if (dec) await txt(c, 'Yes → ' + s.yes + '\nNo → ' + s.no, 'ui/caption', 'foreground/muted', 168);
    if (i < f.steps.length - 1) await txt(row, '→', 'heading/h3', 'foreground/muted');
  }
  flowFrames.push(fr);
}
if (flowFrames.length) { const s = section('Flows'); let y = 120; for (const fr of flowFrames) { s.appendChild(fr); fr.x = 80; fr.y = y; y += fr.height + 80; } s.resizeWithoutConstraints(1600, y); }

// Scenarios and edge cases
const placeholder = async (name, label) => { const p = figma.createFrame(); p.clipsContent = false; p.name = name; p.resize(CONFIG.frame.w, CONFIG.frame.h); p.fills = [paint('background/muted')]; border(p); p.dashPattern = [8, 8]; p.layoutMode = 'VERTICAL'; p.primaryAxisSizingMode = 'FIXED'; p.counterAxisSizingMode = 'FIXED'; p.primaryAxisAlignItems = 'CENTER'; p.counterAxisAlignItems = 'CENTER'; await txt(p, label, 'heading/h3', 'foreground/muted'); return p; };
const caseSection = async (c, kind) => {
  const s = section(c.id + ' ' + c.title);
  const hd = fixW(box('About ' + c.id, 'VERTICAL', null, '4'), 640); pad(hd, '8', '8'); hd.fills = [paint('background/card')]; border(hd); rad(hd, 'xl');
  await txt(hd, kind + ' ' + c.id, 'ui/overline', 'foreground/muted');
  await txt(hd, c.title, 'heading/h2', 'foreground/card', 576);
  await pill(hd, CONFIG.status);
  for (const [k, v] of [['Given', c.given], ['When', c.when], ['Then', c.then]]) { const r = box(k, 'VERTICAL', hd, '1'); await txt(r, k, 'ui/label', 'foreground/card'); await txt(r, v || '(open question)', 'body/default', 'foreground/muted', 576); }
  const nodes = [hd];
  for (let i = 0; i < c.screens.length; i++) nodes.push(await placeholder(c.id + ' / ' + (i + 1) + ' ' + c.screens[i], 'To design: ' + c.screens[i]));
  place(s, nodes);
};
for (const c of CONFIG.scenarios) await caseSection(c, 'SCENARIO');
for (const c of CONFIG.edgeCases) await caseSection(c, 'EDGE CASE');

// States and Archive
if (CONFIG.states.length) { const ns = []; for (const st of CONFIG.states) ns.push(await placeholder('States / ' + st, 'To design: ' + st)); place(section('States'), ns); }
const ar = section('Archive'); const an = box('About archive', 'VERTICAL', null, '1'); await txt(an, 'ARCHIVE', 'ui/overline', 'foreground/muted'); await txt(an, 'Superseded frames, newest first. Each keeps its ID and gets "(superseded <date>)" in its name.', 'body/small', 'foreground/muted', 600); place(ar, [an]);

// Stack sections
let y = 0; for (const s of sections) { s.x = 0; s.y = y; y += s.height + 200; }
return { page: page.id, sections: sections.map(s => s.name + ' ' + s.id) };
