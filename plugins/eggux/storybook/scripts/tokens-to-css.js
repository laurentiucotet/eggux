#!/usr/bin/env node
// Turn the JSON from plugins/eggux/scripts/export-tokens.js (run through use_figma) into CSS
// variables, one block per Figma mode. Usage:
//   node scripts/tokens-to-css.js tokens/egg-ui.tokens.json > src/styles/tokens.css
// Modes map to selectors: Light -> :root, Dark -> .dark, Corporate Light -> .theme-corporate,
// Corporate Dark -> .theme-corporate.dark, Showcase ... -> .theme-showcase(.dark),
// Density Comfortable -> :root, Compact -> .density-compact. Unknown modes become
// .theme-<mode-name> so a client theme added in Figma still comes through.
'use strict';
const fs = require('fs');

const file = process.argv[2];
if (!file) { console.error('Usage: node scripts/tokens-to-css.js <tokens.json>'); process.exit(1); }
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
function selector(mode) {
  const m = /^(.*?)\s*(Light|Dark)$/.exec(mode);
  if (mode === 'Comfortable') return ':root';
  if (mode === 'Compact') return '.density-compact';
  if (!m) return `.theme-${slug(mode)}`;
  const theme = m[1] ? `.theme-${slug(m[1])}` : '';
  const dark = m[2] === 'Dark' ? '.dark' : '';
  return (theme + dark) || ':root';
}

const blocks = new Map(); // selector -> Map(name -> value)
for (const col of data.collections) {
  col.modes.forEach((mode, i) => {
    const sel = selector(mode);
    if (!blocks.has(sel)) blocks.set(sel, new Map());
    const b = blocks.get(sel);
    for (const [name, values] of Object.entries(col.vars)) if (values[i] != null) b.set(name, values[i]);
  });
}

// Single-class blocks (.dark, .theme-corporate, .density-compact) keep only what differs from
// :root. Combined blocks (.theme-corporate.dark) win over both of their parts, so they carry
// their full set.
const root = blocks.get(':root') || new Map();
const order = [...blocks.keys()].sort((a, b) => (a === ':root' ? -1 : b === ':root' ? 1 : a.split('.').length - b.split('.').length || a.localeCompare(b)));
const out = [`/* Generated from ${data.file} variables (${data.exported || 'export'}) by scripts/tokens-to-css.js. Do not edit by hand: change the variable in Figma, export, regenerate. */`];
for (const sel of order) {
  const combined = sel.split('.').length > 2;
  const lines = [];
  for (const [name, value] of blocks.get(sel)) if (sel === ':root' || combined || root.get(name) !== value) lines.push(`  ${name}: ${value};`);
  if (lines.length) out.push(`${sel} {\n${lines.join('\n')}\n}`);
}
process.stdout.write(out.join('\n\n') + '\n');
