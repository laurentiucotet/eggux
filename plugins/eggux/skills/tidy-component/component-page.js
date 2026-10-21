// EGG UX component page layout. Paste as the `code` of a use_figma call on the file that holds
// the components. Fill JOBS (page and rows), run, then screenshot the rows. Safe to run again: it
// rebuilds the Docs frames and re-lays out the rows in place. JOBS can hold several pages.
//
// One row per main component, left to right, four Figma sections:
//   <Name> / Docs         generated doc frame: summary, use / avoid, anatomy, variants,
//                         properties, slots, parts (helpers), rules, accessibility, tokens, code
//   <Name> / Component    the main component, then its helpers (parts only it uses)
//   <Name> / Stress test  "Stress test / ..." frames; a basic one is generated when none exists
//   <Name> / Examples     "Example / ..." and "Template / ..." frames; when none exists and
//                         `block` is set, an "Example / in <block>" frame with that block
// Existing stress and example frames go to the row whose components they use most.
// Rows stack top to bottom in ROWS order.

const JOBS = [
  {
    page: 'Cookie Consent',
    rows: [
      {
        main: 'Cookie Consent',   // component or component set name on the page
        helpers: [],              // names of parts shown in the same row (Menu Item for Menu)
        status: 'Ready',          // Draft, In review, Ready, Ready for dev
        block: null,              // id of a block or shell that uses it, for a generated example
        examples: [],             // names of frames to force into this row (they use nothing on the page)
        docs: { summary: '', use: [], avoid: [], anatomy: [], rules: [], a11y: [], code: '', guides: [] }
      }
    ]
  }
];
const AUTO_STRESS = true;         // generate a basic stress test for rows without one

const GAP = 120, PAD = 80, ROW_GAP = 240, DOC_W = 720;
let PAGE, ROWS, pg;

const all = await figma.variables.getLocalVariablesAsync();
const cols = await figma.variables.getLocalVariableCollectionsAsync();
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
const F = (parent, nm, dir, gap) => { const f = figma.createFrame(); parent.appendChild(f); f.name = nm; f.clipsContent = false; f.fills = []; if (dir) { f.layoutMode = dir; f.primaryAxisSizingMode = 'AUTO'; f.counterAxisSizingMode = 'AUTO'; if (gap) sp(f, 'itemSpacing', gap); } return f; };
const T = async (parent, chars, style, color, fill) => { const t = figma.createText(); parent.appendChild(t); await t.setTextStyleIdAsync(TS(style)); t.characters = chars || ' '; t.fills = [paint(color)]; if (fill) { t.layoutSizingHorizontal = 'FILL'; t.textAutoResize = 'HEIGHT'; } return t; };
const fillW = f => { f.layoutSizingHorizontal = 'FILL'; return f; };
const line = (f, side) => { f.strokes = [paint('border/default')]; f.strokeAlign = 'INSIDE'; for (const s of ['Top', 'Bottom', 'Left', 'Right']) f['stroke' + s + 'Weight'] = 0; f.setBoundVariable('stroke' + side + 'Weight', N('border-width/DEFAULT')); };
const firstSentence = s => (un(s || '').split(/(?<=\.)\s/)[0] || '').trim();
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const today = new Date(); const dateStr = `${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;

const results = [];
for (const job of JOBS) {
PAGE = job.page; ROWS = job.rows;
pg = figma.root.children.find(p => p.name === PAGE);
if (!pg) throw new Error('No page ' + PAGE);
await pg.loadAsync(); await figma.setCurrentPageAsync(pg);
// ---------- components on the page ----------
const roots = pg.findAll(n => (n.type === 'COMPONENT_SET' || (n.type === 'COMPONENT' && n.parent.type !== 'COMPONENT_SET')) && !n.name.startsWith('Icon/'))
  .filter(n => { for (let p = n.parent; p; p = p.parent) if (['INSTANCE', 'COMPONENT', 'COMPONENT_SET'].includes(p.type)) return false; return true; });
const byName = nm => { const r = roots.find(r => r.name === nm); if (!r) throw new Error('No component ' + nm + ' on ' + PAGE); return r; };
const keyOf = m => m ? (m.parent && m.parent.type === 'COMPONENT_SET' ? m.parent.id : m.id) : null;
const rows = ROWS.map(R => { const main = byName(R.main); const helpers = (R.helpers || []).map(byName); return { R, main, helpers, own: new Set([main, ...helpers].map(n => n.id)), stress: [], examples: [] }; });

// ---------- assign existing stress and example frames ----------
const isDemo = n => ['FRAME', 'GROUP', 'INSTANCE'].includes(n.type) && /^(Stress test|Examples?|Template) \//.test(n.name);
// generated stress tests and examples are rebuilt on every run
for (const g of pg.findAll(n => isDemo(n) && n.type === 'FRAME' && n.children.some(c => c.name === 'generated note' || c.name === 'generated caption'))) g.remove();
const demos = pg.findAll(isDemo).filter(n => { for (let p = n.parent; p; p = p.parent) if (isDemo(p)) return false; return true; });
const unassigned = [];
for (const d of demos) {
  let row = rows.find(r => (r.R.examples || []).includes(d.name));
  if (!row) {
    const keys = d.findAll ? d.findAll(n => n.type === 'INSTANCE' && !inInstance(n)).map(i => keyOf(i.mainComponent)) : [];
    if (d.type === 'INSTANCE') keys.push(keyOf(d.mainComponent));
    let best = 0;
    for (const r of rows) { const score = keys.filter(k => r.own.has(k)).length; if (score > best || (score && score === best && r.examples.length + r.stress.length < row.examples.length + row.stress.length)) { best = score; row = r; } }
  }
  if (!row) { const inRow = rows.find(r => d.parent && d.parent.type === 'SECTION' && d.parent.name.startsWith(r.main.name + ' / ')); row = inRow; }
  if (!row) { unassigned.push(d.name); row = rows[0]; }
  (d.name.startsWith('Stress test') ? row.stress : row.examples).push(d);
}

// ---------- docs frame ----------
const table = async (parent, header, rws, widths) => {
  const t = fillW(F(parent, 'table', 'VERTICAL'));
  for (const [i, cells] of [header, ...rws].entries()) {
    const r = fillW(F(t, i ? 'row' : 'header', 'HORIZONTAL', '4')); pad(r, '0', '2'); line(r, 'Bottom');
    for (const [j, c] of cells.entries()) {
      const tx = await T(r, c, i ? (j ? 'body/small' : 'ui/label') : 'ui/caption', i ? 'foreground/default' : 'foreground/muted');
      tx.textAutoResize = 'HEIGHT';
      if (j === cells.length - 1) tx.layoutSizingHorizontal = 'FILL'; else tx.resize(widths[j], tx.height);
    }
  }
  return t;
};
const propsOf = async c => {
  const v = [], p = [], s = [];
  for (const [k, d] of Object.entries(c.componentPropertyDefinitions || {})) {
    const n = k.split('#')[0];
    if (d.type === 'VARIANT') v.push([n, d.variantOptions.join(', ')]);
    else if (d.type === 'SLOT') s.push(n);
    else p.push([n, d.type.toLowerCase().replace('_', ' '), d.type === 'INSTANCE_SWAP' ? (((await figma.getNodeByIdAsync(d.defaultValue)) || {}).name || '') : String(d.defaultValue).replace(/\n/g, ' ')]);
  }
  return { v, p, s };
};
const buildDoc = async (row, sec) => {
  const { R, main, helpers } = row; const D = R.docs || {};
  for (const old of sec.children.filter(n => n.name.startsWith('Docs / '))) old.remove();
  const doc = F(sec, 'Docs / ' + main.name, 'VERTICAL', '10');
  doc.resize(DOC_W, 100); doc.counterAxisSizingMode = 'FIXED'; doc.primaryAxisSizingMode = 'AUTO';
  pad(doc, '12', '12'); rad(doc, 'xl'); doc.fills = [paint('background/default')];
  doc.strokes = [paint('border/default')]; doc.strokeAlign = 'INSIDE'; doc.setBoundVariable('strokeWeight', N('border-width/DEFAULT'));
  const variants = main.type === 'COMPONENT_SET' ? main.children : [main];
  const { v: vProps, p: props, s: slots } = await propsOf(main);
  const parts = new Set(), colors = new Set(), texts = new Set(), effects = new Set();
  for (const c of [main, ...helpers]) for (const vv of (c.type === 'COMPONENT_SET' ? c.children : [c])) for (const n of [vv, ...vv.findAll(() => true)]) {
    if (n !== vv && inInstance(n)) continue;
    if (n.type === 'INSTANCE') { const m = n.mainComponent; if (m) { const nm = m.parent && m.parent.type === 'COMPONENT_SET' ? m.parent.name : m.name; if (!nm.startsWith('Icon/') && c === main) parts.add(nm); } continue; }
    for (const key of ['fills', 'strokes']) for (const p of (Array.isArray(n[key]) ? n[key] : [])) if (p.boundVariables && p.boundVariables.color) { const v2 = all.find(x => x.id === p.boundVariables.color.id); if (v2) colors.add(v2.name); }
    if (n.type === 'TEXT' && typeof n.textStyleId === 'string' && n.textStyleId) { const s = styles.find(x => x.id === n.textStyleId); if (s) texts.add(s.name); }
    if ('effectStyleId' in n && typeof n.effectStyleId === 'string' && n.effectStyleId) { const e = await figma.getStyleByIdAsync(n.effectStyleId); if (e) effects.add(e.name); }
  }
  const head = fillW(F(doc, 'header', 'VERTICAL', '3'));
  await T(head, 'EGG UI · COMPONENT · ' + PAGE.toUpperCase(), 'ui/overline', 'foreground/muted');
  await T(head, main.name, 'heading/h1', 'foreground/default', true);
  await T(head, D.summary || firstSentence(main.description), 'body/lead', 'foreground/muted', true);
  await T(head, `${R.status || 'Ready'} · ${variants.length} variant${variants.length === 1 ? '' : 's'}${helpers.length ? ' · ' + helpers.length + ' part' + (helpers.length === 1 ? '' : 's') : ''} · updated ${dateStr}`, 'ui/caption', 'foreground/muted', true);
  const block = async title => { const b = fillW(F(doc, title, 'VERTICAL', '3')); line(b, 'Top'); sp(b, 'paddingTop', '6'); await T(b, title, 'heading/h4', 'foreground/default'); return b; };
  const bullets = async (parent, items) => { for (const it of items) await T(parent, '•  ' + it, 'body/small', 'foreground/default', true); };
  if ((D.use || []).length || (D.avoid || []).length) {
    const b = await block('When to use');
    const cl = fillW(F(b, 'columns', 'HORIZONTAL', '8'));
    for (const [title, items] of [['Use for', D.use || []], ['Not for', D.avoid || []]]) {
      const c = F(cl, title, 'VERTICAL', '2'); c.layoutGrow = 1; c.layoutSizingHorizontal = 'FILL';
      await T(c, title, 'ui/label', 'foreground/muted'); await bullets(c, items);
    }
  }
  { const b = await block('Anatomy');
    const items = (D.anatomy || []).length ? D.anatomy : [...parts].sort().map(p => 'Uses ' + p);
    if (!items.length) items.push('A single layer: see Variants and Properties');
    for (const [i, it] of items.entries()) await T(b, `${i + 1}  ${it}`, 'body/small', 'foreground/default', true); }
  if (vProps.length) { const b = await block('Variants'); await table(b, ['Property', 'Values'], vProps, [180]); }
  if (props.length) { const b = await block('Properties'); await table(b, ['Property', 'Type', 'Default'], props, [180, 120]); }
  if (slots.length) { const b = await block('Slots'); await bullets(b, slots.map(s => s + ': fill it in the instance, never detach')); }
  if (helpers.length) {
    const b = await block('Parts');
    for (const h of helpers) {
      const hp = fillW(F(b, h.name, 'VERTICAL', '2')); sp(hp, 'paddingTop', '2');
      await T(hp, h.name, 'ui/label', 'foreground/default', true);
      const fs = firstSentence(h.description); if (fs) await T(hp, fs, 'body/small', 'foreground/muted', true);
      const { v, p, s } = await propsOf(h);
      const rws = [...v.map(x => [x[0], 'variant: ' + x[1]]), ...p.map(x => [x[0], x[1] + ': ' + x[2]]), ...s.map(x => [x, 'slot'])];
      if (rws.length) await table(hp, ['Property', 'Values or default'], rws, [180]);
    }
  }
  if ((D.rules || []).length) { const b = await block('Content and behavior'); await bullets(b, D.rules); }
  if ((D.a11y || []).length) { const b = await block('Accessibility'); await bullets(b, D.a11y); }
  { const b = await block('Tokens and styles');
    const rws = [['Colors', [...colors].sort().join(', ')], ['Text', [...texts].sort().join(', ')], ['Effects', [...effects].sort().join(', ')]].filter(r => r[1]);
    if (rws.length) await table(b, ['Kind', 'Used'], rws, [120]); else await T(b, 'None of its own: see its parts.', 'body/small', 'foreground/muted', true); }
  if (D.code || (D.guides || []).length) {
    const b = await block('Code and guides');
    if (D.code) { const c = fillW(F(b, 'code', 'VERTICAL')); pad(c, '4', '3'); rad(c, 'md'); c.fills = [paint('background/muted')]; await T(c, D.code, 'code', 'foreground/default', true); }
    for (const g of D.guides || []) await T(b, g, 'code', 'foreground/muted', true);
  }
  return doc;
};

// ---------- generated stress test ----------
const longOf = d => { d = String(d || ''); if (/^[\d\s.,€$%+−\-/:]+$/.test(d) && d.trim()) return '€1,234,567.89'; if (d.length <= 4) return 'Extra long value 1234567'; if (d.length <= 24) return d + ' with a much longer label than planned'; return d + ' ' + d; };
const shortOf = d => /^[\d\s.,€$%+−\-]+$/.test(String(d)) ? '0' : 'A';
const buildStress = async (row, sec) => {
  const { main } = row;
  const v0 = main.type === 'COMPONENT_SET' ? (main.defaultVariant || main.children[0]) : main;
  const defs = main.componentPropertyDefinitions || {};
  const textKeys = Object.keys(defs).filter(k => defs[k].type === 'TEXT'), boolKeys = Object.keys(defs).filter(k => defs[k].type === 'BOOLEAN');
  const big = v0.width > 800;
  const f = F(sec, 'Stress test / ' + main.name, 'VERTICAL', '10'); pad(f, '10', '10'); f.fills = [paint('background/default')]; rad(f, 'xl');
  await T(f, 'Generated cases: default, long and short text, options on and off, narrow, each variant with long text, Dark. Replace with real content cases when you review the component.', 'body/small', 'foreground/muted').then(t => { t.name = 'generated note'; t.resize(Math.max(480, Math.min(1200, v0.width * 2)), t.height); t.textAutoResize = 'HEIGHT'; });
  const grid = F(f, 'cases', 'HORIZONTAL', '8'); grid.layoutWrap = 'WRAP'; grid.counterAxisSpacing = 32; grid.primaryAxisSizingMode = 'FIXED'; grid.resize(big ? Math.max(1600, v0.width * 2 + 64) : 1600, 10); grid.counterAxisSizingMode = 'AUTO';
  const cell = async (label, mk) => { const c = F(grid, label, 'VERTICAL', '2'); await T(c, label, 'ui/caption', 'foreground/muted'); const n = await mk(); c.appendChild(n); return c; };
  const inst = (variant, opts = {}) => { const i = (variant || v0).createInstance(); const pr = {}; for (const k of textKeys) { if (opts.text === 'long') pr[k] = longOf(defs[k].defaultValue); if (opts.text === 'short') pr[k] = shortOf(defs[k].defaultValue); } for (const k of boolKeys) if (opts.bool !== undefined) pr[k] = opts.bool; if (Object.keys(pr).length) { try { i.setProperties(pr); } catch (e) {} } return i; };
  await cell('Default', () => inst());
  if (textKeys.length) { await cell('Long text', () => inst(null, { text: 'long' })); if (!big) await cell('Short text', () => inst(null, { text: 'short' })); }
  if (boolKeys.length && !big) { await cell('All options on', () => inst(null, { bool: true, text: 'long' })); await cell('All options off', () => inst(null, { bool: false })); }
  if (v0.width >= 160) await cell('Narrow (50%)', () => { const i = inst(null, { text: 'long' }); i.resize(Math.max(120, Math.round(v0.width / 2)), i.height); return i; });
  if (main.type === 'COMPONENT_SET' && !big) {
    const vp = Object.entries(defs).find(([k, d]) => d.type === 'VARIANT' && !/^(state|size)$/i.test(k) && d.variantOptions.length > 1) || Object.entries(defs).find(([k, d]) => d.type === 'VARIANT' && d.variantOptions.length > 1);
    if (vp) for (const opt of vp[1].variantOptions.slice(0, 6)) {
      const want = main.children.find(c => c.variantProperties && c.variantProperties[vp[0]] === opt && Object.entries(v0.variantProperties || {}).every(([k, val]) => k === vp[0] || c.variantProperties[k] === val)) || main.children.find(c => c.variantProperties && c.variantProperties[vp[0]] === opt);
      if (want && want !== v0) await cell(`${vp[0]}=${opt}, long text`, () => inst(want, { text: textKeys.length ? 'long' : undefined }));
    }
  }
  const dark = await cell('Dark, long text', () => inst(null, { text: textKeys.length ? 'long' : undefined }));
  dark.fills = [paint('background/default')]; pad(dark, '4', '4');
  for (const c of cols) { const m = c.modes.find(m => m.name === 'Dark'); if (m) dark.setExplicitVariableModeForCollection(c, m.modeId); }
  dark.fills = [paint('background/default')];
  grid.primaryAxisSizingMode = 'AUTO'; grid.layoutWrap = 'NO_WRAP';
  if (grid.width > 1600) { grid.layoutWrap = 'WRAP'; grid.primaryAxisSizingMode = 'FIXED'; grid.resize(big ? Math.max(1600, v0.width * 2 + 64) : 1600, grid.height); grid.counterAxisSizingMode = 'AUTO'; }
  return f;
};

// ---------- generated example from a block ----------
const buildExample = async (row, sec) => {
  const b = await figma.getNodeByIdAsync(row.R.block); if (!b) return null;
  const comp = b.type === 'COMPONENT_SET' ? (b.defaultVariant || b.children[0]) : b;
  const name = (b.type === 'COMPONENT' && b.parent.type === 'COMPONENT_SET') ? b.parent.name : b.name;
  const f = F(sec, 'Example / in ' + name.replace(/^Block \/ /, '').toLowerCase(), 'VERTICAL', '4'); pad(f, '10', '10'); f.fills = [paint('background/default')]; rad(f, 'xl');
  (await T(f, `${row.main.name} inside ${name}`, 'ui/label', 'foreground/muted')).name = 'generated caption';
  f.appendChild(comp.createInstance());
  return f;
};

// ---------- loose labels next to a component move with it ----------
const used = new Set(rows.flatMap(r => [r.main, ...r.helpers]));
const loose = pg.children.filter(n => ['TEXT', 'VECTOR', 'RECTANGLE', 'LINE'].includes(n.type));
const wrapWithLabels = c => {
  if (c.parent.type === 'FRAME' && c.parent.name === c.name + ' with labels') return c.parent;
  if (c.parent.type !== 'PAGE') return c;
  const bx = c.absoluteBoundingBox, m = 160;
  const near = loose.filter(n => { const b = n.absoluteBoundingBox; return b && b.x < bx.x + bx.width + m && b.x + b.width > bx.x - m && b.y < bx.y + bx.height + m && b.y + b.height > bx.y - m; });
  if (!near.length) return c;
  const g = figma.createFrame(); pg.appendChild(g); g.name = c.name + ' with labels'; g.fills = []; g.clipsContent = false;
  const items = [c, ...near]; const x0 = Math.min(...items.map(n => n.absoluteBoundingBox.x)), y0 = Math.min(...items.map(n => n.absoluteBoundingBox.y));
  g.x = x0; g.y = y0; g.resize(Math.max(...items.map(n => n.absoluteBoundingBox.x + n.absoluteBoundingBox.width)) - x0, Math.max(...items.map(n => n.absoluteBoundingBox.y + n.absoluteBoundingBox.height)) - y0);
  for (const n of items) { const ax = n.absoluteBoundingBox.x, ay = n.absoluteBoundingBox.y; g.appendChild(n); n.x = ax - x0; n.y = ay - y0; loose.splice(loose.indexOf(n), 1); }
  return g;
};

// ---------- lay out ----------
// resize() sets both axes of an auto-layout frame to FIXED, so a frame built with resize() stops
// growing with its content and the section is sized to the clipped height. Before placing,
// every auto-layout frame inside a stress test or example whose content runs past its edge
// goes back to hug on that axis (innermost first). Component internals are left alone.
const inComp = n => { for (let p = n; p; p = p.parent) if (p.type === 'COMPONENT' || p.type === 'COMPONENT_SET') return true; return false; };
const viewport = n => n.clipsContent && /^Examples? \//.test(n.name); // screens clip on purpose
const fitHug = root => {
  if (!root.findAll || viewport(root)) return 0;
  const depth = n => { let d = 0; for (let p = n; p; p = p.parent) d++; return d; };
  const frames = [root, ...root.findAll(n => n.type === 'FRAME')].filter(f => f.type === 'FRAME' && f.layoutMode && f.layoutMode !== 'NONE' && f.layoutMode !== 'GRID' && !inInstance(f) && !inComp(f)).sort((a, b) => depth(b) - depth(a));
  let n = 0;
  for (const f of frames) {
    const kids = f.children.filter(c => c.layoutPositioning !== 'ABSOLUTE'); if (!kids.length) continue;
    const bottom = Math.max(...kids.map(c => c.y + c.height)) + (f.paddingBottom || 0), right = Math.max(...kids.map(c => c.x + c.width)) + (f.paddingRight || 0);
    const h = f.layoutMode === 'HORIZONTAL';
    if (bottom > f.height + 1 && (h ? f.counterAxisSizingMode : f.primaryAxisSizingMode) === 'FIXED') { if (h) f.counterAxisSizingMode = 'AUTO'; else f.primaryAxisSizingMode = 'AUTO'; n++; }
    if (right > f.width + 1 && f.layoutWrap !== 'WRAP' && (h ? f.primaryAxisSizingMode : f.counterAxisSizingMode) === 'FIXED') { if (h) f.primaryAxisSizingMode = 'AUTO'; else f.counterAxisSizingMode = 'AUTO'; n++; }
  }
  return n;
};
const place = (sec, nodes, colsN) => {
  let x = PAD, y = PAD, rowH = 0, col = 0;
  for (const n of nodes) {
    if (n.parent !== sec) sec.appendChild(n);
    if (col === colsN) { col = 0; x = PAD; y += rowH + PAD; rowH = 0; }
    n.x = x; n.y = y; x += n.width + PAD; rowH = Math.max(rowH, n.height); col++;
  }
  sec.resizeWithoutConstraints(nodes.length ? Math.max(...nodes.map(n => n.x + n.width)) + PAD : 640, nodes.length ? Math.max(...nodes.map(n => n.y + n.height)) + PAD : 320);
};
const note = async (sec, text) => { const t = figma.createText(); sec.appendChild(t); t.name = 'empty note'; await t.setTextStyleIdAsync(TS('body/small')); t.fills = [paint('foreground/muted')]; t.characters = text; return t; };
const titles = ['Docs', 'Component', 'Stress test', 'Examples'];
const oldParents = new Set(demos.map(d => d.parent).concat(rows.flatMap(r => [r.main, ...r.helpers]).map(n => n.parent)));
const report = [];
for (const row of rows) {
  const nm = row.main.name;
  const secs = titles.map(t => { let s = pg.children.find(n => n.type === 'SECTION' && n.name === `${nm} / ${t}`); if (!s) { s = figma.createSection(); pg.appendChild(s); s.name = `${nm} / ${t}`; } s.fills = [paint('background/muted')]; return s; });
  row.secs = secs;
  for (const s of secs.slice(2)) for (const n of s.children.filter(n => n.name === 'empty note')) n.remove();
  const doc = await buildDoc(row, secs[0]);
  place(secs[0], [doc], 1);
  place(secs[1], [row.main, ...row.helpers].map(wrapWithLabels), 1);
  let generated = '';
  if (!row.stress.length && AUTO_STRESS) { row.stress.push(await buildStress(row, secs[2])); generated += 'stress '; }
  for (const d of [...row.stress, ...row.examples]) fitHug(d);
  place(secs[2], row.stress.length ? row.stress : [await note(secs[2], 'No stress test yet. Build one from references/stress-test.md.')], 1);
  if (!row.examples.length && row.R.block) { const e = await buildExample(row, secs[3]); if (e) { row.examples.push(e); generated += 'example'; } }
  place(secs[3], row.examples.length ? row.examples : [await note(secs[3], 'No examples yet. Add 2-4 real screens (page shells, blocks) that use the component.')], 2);
  report.push(`${nm}: ${row.stress.length} stress, ${row.examples.length} examples${generated ? ' (generated ' + generated.trim() + ')' : ''}`);
}

// rows of this run in ROWS order, then rows from earlier runs, stacked
const rowNames = [...new Set(pg.children.filter(n => n.type === 'SECTION' && / \/ Docs$/.test(n.name)).map(n => n.name.replace(/ \/ Docs$/, '')))];
const order = [...rows.map(r => r.main.name), ...rowNames.filter(n => !rows.some(r => r.main.name === n)).sort((a, b) => pg.children.find(s => s.name === a + ' / Docs').y - pg.children.find(s => s.name === b + ' / Docs').y)];
let y = PAD;
for (const nm of order) {
  const secs = titles.map(t => pg.children.find(n => n.type === 'SECTION' && n.name === `${nm} / ${t}`)).filter(Boolean);
  let x = PAD; for (const s of secs) { s.x = x; s.y = y; x += s.width + GAP; }
  y += Math.max(...secs.map(s => s.height)) + ROW_GAP;
}
for (const p of oldParents) if (p && p.type === 'SECTION' && !/ \/ (Docs|Component|Stress test|Examples)$/.test(p.name) && p.children.length === 0) p.remove();
const leftovers = pg.children.filter(n => !(n.type === 'SECTION' && / \/ (Docs|Component|Stress test|Examples)$/.test(n.name))).map(n => n.type + ' ' + n.name);
// anything still running past its frame or section is reported, never left silently
const overflow = [];
for (const sct of pg.children.filter(n => n.type === 'SECTION')) for (const ch of sct.children) {
  if (ch.y + ch.height > sct.height + 1 || ch.x + ch.width > sct.width + 1) overflow.push(sct.name);
  if (ch.type === 'FRAME' && ch.layoutMode && ch.layoutMode !== 'NONE' && ch.layoutMode !== 'GRID' && !viewport(ch) && ch.children.length && Math.max(...ch.children.map(k => k.y + k.height)) > ch.height + 1) overflow.push(ch.name);
}
results.push({ page: PAGE, rows: report, unassigned, leftovers, overflow });
}
return results;
