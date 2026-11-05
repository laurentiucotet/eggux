// EGG UX token export. Read-only. Paste as the `code` of a use_figma call on the master library
// or a client file. Returns every variable of the Semantic, Components and Density collections
// with its WEB code-syntax name and one resolved value per mode (aliases followed to the end).
// Save the JSON and run: node scripts/tokens-to-css.js <json> > <app>/src/styles/tokens.css
const COLLECTIONS = ['Semantic', 'Components', 'Density'];

const collections = await figma.variables.getLocalVariableCollectionsAsync();
const byId = new Map();
const getVar = async id => { if (!byId.has(id)) byId.set(id, await figma.variables.getVariableByIdAsync(id)); return byId.get(id); };
const colById = new Map(collections.map(c => [c.id, c]));
const hex = n => Math.round(n * 255).toString(16).padStart(2, '0');
const fmtColor = c => (c.a === undefined || c.a >= 0.999) ? `#${hex(c.r)}${hex(c.g)}${hex(c.b)}` : `rgb(${Math.round(c.r * 255)} ${Math.round(c.g * 255)} ${Math.round(c.b * 255)} / ${Math.round(c.a * 1000) / 1000})`;
const UNITLESS = ['FONT_WEIGHT', 'OPACITY', 'LINE_HEIGHT'];

async function resolve(v, modeName, depth = 0) {
  const col = colById.get(v.variableCollectionId);
  const mode = col.modes.find(m => m.name === modeName) || col.modes.find(m => m.modeId === col.defaultModeId);
  const val = v.valuesByMode[mode.modeId];
  // A color alias with an opacity modifier: { color: alias or RGB, opacity: alias or number }.
  if (val && typeof val === 'object' && 'color' in val && 'opacity' in val) {
    const base = await resolveRaw(val.color, modeName, depth);
    let op = await resolveRaw(val.opacity, modeName, depth);
    if (!base || typeof op !== 'number') return null;
    if (op > 1) op = op / 100;
    return fmtColor({ r: base.r, g: base.g, b: base.b, a: (base.a === undefined ? 1 : base.a) * op });
  }
  if (val && typeof val === 'object' && val.type === 'VARIABLE_ALIAS') {
    const t = await getVar(val.id);
    if (!t || depth > 10) return null;
    return resolve(t, modeName, depth + 1);
  }
  if (v.resolvedType === 'COLOR') return fmtColor(val);
  if (v.resolvedType === 'FLOAT') {
    if (/duration/i.test(v.name)) return `${val}ms`;
    const unitless = (v.scopes || []).some(s => UNITLESS.includes(s)) || /weight|opacity|leading|z-index/i.test(v.name);
    return unitless ? String(Math.round(val * 1000) / 1000) : `${Math.round(val * 100) / 100}px`;
  }
  if (v.resolvedType === 'STRING') return /family|font/i.test(v.name) ? `"${val}"` : String(val);
  return null; // BOOLEAN has no CSS value
}
// Raw value of an alias or a literal (used inside color + opacity values).
async function resolveRaw(x, modeName, depth) {
  if (x && typeof x === 'object' && x.type === 'VARIABLE_ALIAS') {
    const t = await getVar(x.id);
    if (!t || depth > 10) return null;
    const col = colById.get(t.variableCollectionId);
    const mode = col.modes.find(m => m.name === modeName) || col.modes.find(m => m.modeId === col.defaultModeId);
    return resolveRaw(t.valuesByMode[mode.modeId], modeName, depth + 1);
  }
  return x;
}
// The CSS name comes from the WEB code syntax when it is a plain var(--name). A WEB syntax that is
// an expression (color-mix(...)) means code computes the value itself: such variables are skipped.
const cssName = v => {
  const web = v.codeSyntax && v.codeSyntax.WEB;
  if (!web) return '--' + v.name.replace(/[^\w]+/g, '-').replace(/^-|-$/g, '').toLowerCase();
  const m = /^var\((--[\w-]+)\)$/.exec(web.trim());
  return m ? m[1] : null;
};

const out = [];
const dupes = [];       // a second variable with the same code name is skipped and reported
const expressions = []; // variables whose code syntax is an expression
for (const name of COLLECTIONS) {
  const col = collections.find(c => c.name === name);
  if (!col) continue;
  const modes = col.modes.map(m => m.name);
  const vars = {};
  for (const id of col.variableIds) {
    const v = await getVar(id);
    if (!v || v.resolvedType === 'BOOLEAN') continue;
    const vals = [];
    for (const m of modes) vals.push(await resolve(v, m));
    const key = cssName(v);
    if (!key) { expressions.push(`${v.name}: ${v.codeSyntax.WEB}`); continue; }
    if (vars[key] || (name !== COLLECTIONS[0] && out[0] && out[0].vars[key])) dupes.push(`${name}/${v.name} -> ${key}`);
    else vars[key] = vals;
  }
  out.push({ name, modes, vars });
}
return { file: figma.root.name, collections: out, dupes, expressions };
