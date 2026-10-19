// EGG UX token audit. Read-only. Paste as the `code` of a use_figma call.
// Returns { summary, issues, contrast } for the Semantic and Components collections.

const MIN_TEXT = 4.5;
const MIN_UI = 3;

const cols = await figma.variables.getLocalVariableCollectionsAsync();
const vars = await figma.variables.getLocalVariablesAsync();
const byId = Object.fromEntries(vars.map(v => [v.id, v]));
const col = name => cols.find(c => c.name === name);
const issues = [];

function modeFor(v, modeName) {
  const c = cols.find(x => x.id === v.variableCollectionId);
  return (c.modes.find(m => m.name === modeName) || c.modes[0]).modeId;
}

// Resolves aliases, including the { color: alias, opacity: alias } form.
function resolve(v, modeName, seen = new Set()) {
  if (!v || seen.has(v.id)) return null;
  seen.add(v.id);
  const val = v.valuesByMode[modeFor(v, modeName)];
  if (val && val.type === 'VARIABLE_ALIAS') return resolve(byId[val.id], modeName, seen);
  if (val && val.color && val.color.type === 'VARIABLE_ALIAS') {
    const c = resolve(byId[val.color.id], modeName, new Set(seen));
    let o = val.opacity && val.opacity.type === 'VARIABLE_ALIAS' ? resolve(byId[val.opacity.id], modeName) : val.opacity;
    if (typeof o === 'number' && o > 1) o = o / 100;
    return c ? { r: c.r, g: c.g, b: c.b, a: (c.a ?? 1) * (o ?? 1) } : null;
  }
  return val;
}

const isAlias = val =>
  (val && val.type === 'VARIABLE_ALIAS') || (val && val.color && val.color.type === 'VARIABLE_ALIAS');

// 1. Structure: aliases only, code syntax, scopes.
for (const name of ['Semantic', 'Components']) {
  const c = col(name);
  if (!c) { issues.push(`Missing collection ${name}`); continue; }
  for (const v of vars.filter(x => x.variableCollectionId === c.id)) {
    for (const m of c.modes) {
      if (!isAlias(v.valuesByMode[m.modeId])) issues.push(`${name}/${v.name} [${m.name}]: raw value instead of alias`);
      else if (!resolve(v, m.name)) issues.push(`${name}/${v.name} [${m.name}]: broken alias`);
    }
    if (!v.codeSyntax || !v.codeSyntax.WEB) issues.push(`${name}/${v.name}: missing WEB code syntax`);
    if (v.scopes.includes('ALL_SCOPES')) issues.push(`${name}/${v.name}: ALL_SCOPES`);
  }
}

// 2. Pairing: every background/X has foreground/X.
const sem = col('Semantic');
const semVars = sem ? vars.filter(v => v.variableCollectionId === sem.id) : [];
const S = n => semVars.find(v => v.name === n);
for (const v of semVars.filter(v => v.name.startsWith('background/'))) {
  const role = v.name.split('/')[1];
  if (!S('foreground/' + role)) issues.push(`Semantic/background/${role}: no foreground/${role}`);
}

// 3. Contrast in every mode.
const lin = x => (x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4));
const lum = c => 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b);
const over = (fg, bg) => { const a = fg.a ?? 1; return { r: fg.r * a + bg.r * (1 - a), g: fg.g * a + bg.g * (1 - a), b: fg.b * a + bg.b * (1 - a) }; };
const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };

// [foreground token, background token, minimum, note]
const checks = [];
for (const v of semVars.filter(v => v.name.startsWith('background/'))) {
  const role = v.name.split('/')[1];
  if (S('foreground/' + role)) checks.push([`foreground/${role}`, `background/${role}`, MIN_TEXT, 'text on fill']);
}
checks.push(['foreground/muted', 'background/default', MIN_TEXT, 'secondary text on page']);
checks.push(['foreground/muted', 'background/card', MIN_TEXT, 'secondary text on card']);
for (const s of ['destructive', 'success', 'warning', 'info'])
  if (S('background/' + s)) checks.push([`background/${s}`, 'background/default', MIN_TEXT, 'status color as text on page']);
checks.push(['border/input', 'background/default', MIN_UI, 'input boundary']);
checks.push(['border/ring', 'background/default', MIN_UI, 'focus ring']);
checks.push(['border/default', 'background/default', 0, 'decorative divider, info only']);

const contrast = [];
if (sem) for (const m of sem.modes) {
  const page = resolve(S('background/default'), m.name);
  for (const [f, b, min, note] of checks) {
    const fv = resolve(S(f), m.name), bv = resolve(S(b), m.name);
    if (!fv || !bv || fv.r === undefined || bv.r === undefined) { contrast.push({ mode: m.name, pair: `${f} on ${b}`, result: 'unresolved' }); continue; }
    const bg = over(bv, page);
    const r = ratio(over(fv, bg), bg);
    contrast.push({ mode: m.name, pair: `${f} on ${b}`, note, ratio: +r.toFixed(2), min, pass: r >= min });
  }
}

const failing = contrast.filter(c => c.pass === false);
return {
  summary: {
    collections: cols.map(c => `${c.name} (${c.variableIds.length} vars, modes: ${c.modes.map(m => m.name).join('/')})`),
    structuralIssues: issues.length,
    contrastFailures: failing.length,
  },
  issues,
  contrastFailures: failing,
  contrast,
};
