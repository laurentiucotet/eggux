// EGG UX component page layout. Paste as the `code` of a use_figma call on the file that holds
// the component. Fill CONFIG, run, then screenshot the row. Safe to run again: it rebuilds the
// Docs frame and re-lays out the row in place.
//
// One row per component, left to right, four Figma sections:
//   <Name> / Docs         generated doc frame (summary, use / avoid, anatomy, variants,
//                         properties, slots, rules, accessibility, tokens, code, guides)
//   <Name> / Component    the component set and its helper components
//   <Name> / Stress test  every "Stress test / ..." frame that uses the component
//   <Name> / Examples     every "Example / ..." frame that uses the component (real screens)
// Rows stack top to bottom on the page, in the order the components were tidied.

const CONFIG = {
  component: '277:971',   // the component or component set
  helpers: [],            // ids of components used only by this one (Menubar Trigger for Menubar)
  stress: [],             // ids of stress test frames; empty = find "Stress test / ..." frames using it
  examples: [],           // ids of example frames; empty = find "Example / ..." frames using it
  status: 'Ready',        // Draft, In review, Ready, Ready for dev
  docs: {
    summary: '',          // one or two sentences; empty = the first sentence of the description
    use: [],              // when to use
    avoid: [],            // when not to use, and what to use instead
    anatomy: [],          // numbered parts; empty = the components it is built from
    rules: [],            // content and behavior rules (truncation, min width, defaults)
    a11y: [],             // keyboard, screen reader, contrast
    code: '',             // code mapping (from references/code-mapping.md)
    guides: []            // repo paths of the usage guides
  }
};

const GAP = 120, PAD = 80, DOC_W = 720;
const comp = await figma.getNodeByIdAsync(CONFIG.component);
let pg = comp; while (pg && pg.type !== 'PAGE') pg = pg.parent;
await pg.loadAsync(); await figma.setCurrentPageAsync(pg);
if (!comp || !['COMPONENT', 'COMPONENT_SET'].includes(comp.type)) throw new Error('CONFIG.component is not a component or component set');
const name = comp.name;

const all = await figma.variables.getLocalVariablesAsync();
const N = n => { const v = all.find(v => v.name === n); if (!v) throw new Error('Missing variable ' + n); return v; };
const styles = await figma.getLocalTextStylesAsync();
for (const s of styles) await figma.loadFontAsync(s.fontName);
const TS = n => { const s = styles.find(x => x.name === n); if (!s) throw new Error('Missing text style ' + n); return s.id; };
const paint = n => { const v = N(n); const c = v.resolveForConsumer(pg).value; return figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: { r: c.r, g: c.g, b: c.b } }, 'color', v); };
const sp = (f, k, v) => f.setBoundVariable(k, N('spacing/' + v));
const pad = (f, x, y) => { sp(f, 'paddingLeft', x); sp(f, 'paddingRight', x); sp(f, 'paddingTop', y); sp(f, 'paddingBottom', y); };
const rad = (f, v) => { for (const k of ['topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius']) f.setBoundVariable(k, N('radius/' + v)); };
const un = s => s.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const inInstance = n => { for (let p = n.parent; p; p = p.parent) if (p.type === 'INSTANCE') return true; return false; };

// ---------- what belongs to this component ----------
const helpers = [];
for (const id of CONFIG.helpers) { const h = await figma.getNodeByIdAsync(id); if (h) helpers.push(h); }
const own = new Set([comp, ...helpers].flatMap(c => c.type === 'COMPONENT_SET' ? [c.id, ...c.children.map(v => v.id)] : [c.id]));
const uses = f => !!f.findOne(n => n.type === 'INSTANCE' && n.mainComponent && own.has(n.mainComponent.id));
const pick = async (ids, prefix) => {
  if (ids.length) return (await Promise.all(ids.map(id => figma.getNodeByIdAsync(id)))).filter(Boolean);
  return pg.findAll(n => n.type === 'FRAME' && n.name.startsWith(prefix) && uses(n));
};
const stress = await pick(CONFIG.stress, 'Stress test /');
const examples = await pick(CONFIG.examples, 'Example /');

// ---------- the four sections ----------
const titles = ['Docs', 'Component', 'Stress test', 'Examples'];
const secName = t => `${name} / ${t}`;
const oldParents = new Set([comp, ...helpers, ...stress, ...examples].map(n => n.parent));
const moving = new Set([comp, ...helpers, ...stress, ...examples]);
let secs = titles.map(t => pg.children.find(n => n.type === 'SECTION' && n.name === secName(t)));
let rowX = PAD, rowY;
if (secs[0]) { rowX = secs[0].x; rowY = secs[0].y; }
else {
  const others = pg.children.filter(n => !moving.has(n) && !secs.includes(n) && !(n.type === 'SECTION' && n.children.every(c => moving.has(c))));
  rowY = others.length ? Math.max(...others.map(n => n.y + n.height)) + 240 : PAD;
}
secs = secs.map((s, i) => { if (s) return s; const n = figma.createSection(); pg.appendChild(n); n.name = secName(titles[i]); return n; });
for (const s of secs) s.fills = [paint('background/muted')];
const [docSec, compSec, stressSec, exSec] = secs;

// ---------- docs frame ----------
for (const old of docSec.children.filter(n => n.name === 'Docs / ' + name)) old.remove();
const F = (parent, nm, dir, gap) => { const f = figma.createFrame(); parent.appendChild(f); f.name = nm; f.clipsContent = false; f.fills = []; if (dir) { f.layoutMode = dir; f.primaryAxisSizingMode = 'AUTO'; f.counterAxisSizingMode = 'AUTO'; if (gap) sp(f, 'itemSpacing', gap); } return f; };
const T = async (parent, chars, style, color, fill) => { const t = figma.createText(); parent.appendChild(t); await t.setTextStyleIdAsync(TS(style)); t.characters = chars || ' '; t.fills = [paint(color)]; if (fill) { t.layoutSizingHorizontal = 'FILL'; t.textAutoResize = 'HEIGHT'; } return t; };
const fillW = f => { f.layoutSizingHorizontal = 'FILL'; return f; };
const line = (f, side) => { f.strokes = [paint('border/default')]; f.strokeAlign = 'INSIDE'; for (const s of ['Top', 'Bottom', 'Left', 'Right']) f['stroke' + s + 'Weight'] = 0; f.setBoundVariable('stroke' + side + 'Weight', N('border-width/DEFAULT')); };

const doc = F(docSec, 'Docs / ' + name, 'VERTICAL', '10');
doc.resize(DOC_W, 100); doc.counterAxisSizingMode = 'FIXED'; doc.primaryAxisSizingMode = 'AUTO';
pad(doc, '12', '12'); rad(doc, 'xl'); doc.fills = [paint('background/default')];
doc.strokes = [paint('border/default')]; doc.strokeAlign = 'INSIDE'; doc.setBoundVariable('strokeWeight', N('border-width/DEFAULT'));

const variants = comp.type === 'COMPONENT_SET' ? comp.children : [comp];
const desc = un(comp.description || '');
const defs = comp.componentPropertyDefinitions || {};
const vProps = [], props = [], slots = [];
for (const [k, d] of Object.entries(defs)) {
  const n = k.split('#')[0];
  if (d.type === 'VARIANT') vProps.push([n, d.variantOptions.join(', ')]);
  else if (d.type === 'SLOT') slots.push(n);
  else props.push([n, d.type.toLowerCase().replace('_', ' '), d.type === 'INSTANCE_SWAP' ? (((await figma.getNodeByIdAsync(d.defaultValue)) || {}).name || '') : String(d.defaultValue)]);
}
const parts = new Set(), colors = new Set(), texts = new Set(), effects = new Set();
for (const v of variants) for (const n of [v, ...v.findAll(() => true)]) {
  if (n !== v && inInstance(n)) continue;
  if (n.type === 'INSTANCE') { const m = n.mainComponent; if (m) { const nm = m.parent && m.parent.type === 'COMPONENT_SET' ? m.parent.name : m.name; if (!nm.startsWith('Icon/')) parts.add(nm); } continue; }
  for (const key of ['fills', 'strokes']) for (const p of (Array.isArray(n[key]) ? n[key] : [])) if (p.boundVariables && p.boundVariables.color) { const v2 = all.find(x => x.id === p.boundVariables.color.id); if (v2) colors.add(v2.name); }
  if (n.type === 'TEXT' && typeof n.textStyleId === 'string' && n.textStyleId) { const s = styles.find(x => x.id === n.textStyleId); if (s) texts.add(s.name); }
  if ('effectStyleId' in n && typeof n.effectStyleId === 'string' && n.effectStyleId) { const e = await figma.getStyleByIdAsync(n.effectStyleId); if (e) effects.add(e.name); }
}

// header
const head = fillW(F(doc, 'header', 'VERTICAL', '3'));
await T(head, 'EGG UI · COMPONENT · ' + pg.name.toUpperCase(), 'ui/overline', 'foreground/muted');
await T(head, name, 'heading/h1', 'foreground/default', true);
await T(head, CONFIG.docs.summary || desc.split(/(?<=\.)\s/)[0], 'body/lead', 'foreground/muted', true);
const today = new Date(); const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
await T(head, `${CONFIG.status} · ${variants.length} variant${variants.length === 1 ? '' : 's'} · updated ${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`, 'ui/caption', 'foreground/muted', true);

const block = async title => { const b = fillW(F(doc, title, 'VERTICAL', '3')); line(b, 'Top'); sp(b, 'paddingTop', '6'); await T(b, title, 'heading/h4', 'foreground/default'); return b; };
const bullets = async (parent, items) => { for (const it of items) await T(parent, '•  ' + it, 'body/small', 'foreground/default', true); };
const table = async (parent, header, rows, widths) => {
  const t = fillW(F(parent, 'table', 'VERTICAL'));
  for (const [i, cells] of [header, ...rows].entries()) {
    const r = fillW(F(t, i ? 'row' : 'header', 'HORIZONTAL', '4')); pad(r, '0', '2'); line(r, 'Bottom');
    for (const [j, c] of cells.entries()) {
      const tx = await T(r, c, i ? (j ? 'body/small' : 'ui/label') : 'ui/caption', i ? 'foreground/default' : 'foreground/muted');
      tx.textAutoResize = 'HEIGHT';
      if (j === cells.length - 1) tx.layoutSizingHorizontal = 'FILL'; else tx.resize(widths[j], tx.height);
    }
  }
  return t;
};

if (CONFIG.docs.use.length || CONFIG.docs.avoid.length) {
  const b = await block('When to use');
  const cols = fillW(F(b, 'columns', 'HORIZONTAL', '8'));
  for (const [title, items] of [['Use for', CONFIG.docs.use], ['Not for', CONFIG.docs.avoid]]) {
    const c = F(cols, title, 'VERTICAL', '2'); c.layoutGrow = 1; c.layoutSizingHorizontal = 'FILL';
    await T(c, title, 'ui/label', 'foreground/muted'); await bullets(c, items);
  }
}
{ const b = await block('Anatomy');
  const items = CONFIG.docs.anatomy.length ? CONFIG.docs.anatomy : [...parts].sort().map(p => 'Uses ' + p);
  for (const [i, it] of items.entries()) await T(b, `${i + 1}  ${it}`, 'body/small', 'foreground/default', true); }
if (vProps.length) { const b = await block('Variants'); await table(b, ['Property', 'Values'], vProps, [180]); }
if (props.length) { const b = await block('Properties'); await table(b, ['Property', 'Type', 'Default'], props, [180, 120]); }
if (slots.length) { const b = await block('Slots'); await bullets(b, slots.map(s => s + ': fill it in the instance, never detach')); }
if (CONFIG.docs.rules.length) { const b = await block('Content and behavior'); await bullets(b, CONFIG.docs.rules); }
if (CONFIG.docs.a11y.length) { const b = await block('Accessibility'); await bullets(b, CONFIG.docs.a11y); }
{ const b = await block('Tokens and styles');
  const rows = [['Colors', [...colors].sort().join(', ')], ['Text', [...texts].sort().join(', ')], ['Effects', [...effects].sort().join(', ') || '-']].filter(r => r[1]);
  await table(b, ['Kind', 'Used'], rows, [120]); }
if (CONFIG.docs.code || CONFIG.docs.guides.length) {
  const b = await block('Code and guides');
  if (CONFIG.docs.code) { const c = fillW(F(b, 'code', 'VERTICAL')); pad(c, '4', '3'); rad(c, 'md'); c.fills = [paint('background/muted')]; await T(c, CONFIG.docs.code, 'code', 'foreground/default', true); }
  for (const g of CONFIG.docs.guides) await T(b, g, 'code', 'foreground/muted', true);
}

// ---------- move and lay out ----------
const place = (sec, nodes, cols) => {
  let x = PAD, y = PAD, rowH = 0, col = 0;
  for (const n of nodes) {
    if (n.parent !== sec) sec.appendChild(n);
    if (col === cols) { col = 0; x = PAD; y += rowH + PAD; rowH = 0; }
    n.x = x; n.y = y; x += n.width + PAD; rowH = Math.max(rowH, n.height); col++;
  }
  const w = nodes.length ? Math.max(...nodes.map(n => n.x + n.width)) + PAD : 640;
  const h = nodes.length ? Math.max(...nodes.map(n => n.y + n.height)) + PAD : 320;
  sec.resizeWithoutConstraints(w, h);
};
const note = async (sec, text) => { let t = sec.children.find(n => n.name === 'empty note'); if (!t) { t = figma.createText(); sec.appendChild(t); t.name = 'empty note'; await t.setTextStyleIdAsync(TS('body/small')); t.fills = [paint('foreground/muted')]; } t.characters = text; return t; };
for (const s of [stressSec, exSec]) for (const n of s.children.filter(n => n.name === 'empty note')) n.remove();
place(docSec, [doc], 1);
place(compSec, [comp, ...helpers], 1);
place(stressSec, stress.length ? stress : [await note(stressSec, 'No stress test yet. Build one from references/stress-test.md.')], 1);
place(exSec, examples.length ? examples : [await note(exSec, 'No examples yet. Add 2-4 real screens (page shells, blocks) that use the component.')], 2);
let x = rowX;
for (const s of secs) { s.x = x; s.y = rowY; x += s.width + GAP; }

// remove sections left empty by the move (the old "Stress tests" section, for example)
for (const p of oldParents) if (p && p.type === 'SECTION' && !secs.includes(p) && p.children.length === 0) p.remove();

return { page: pg.name, row: secs.map(s => `${s.name} ${s.id} ${Math.round(s.width)}x${Math.round(s.height)}`), stress: stress.map(n => n.name), examples: examples.map(n => n.name), parts: [...parts] };
