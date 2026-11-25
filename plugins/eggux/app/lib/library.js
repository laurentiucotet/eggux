// Screens and components for the board, read from files that already exist: each feature's
// handoff.md and scenarios.md, and the generated component reference in references/components/.
// Nothing here writes; the markdown files stay the source of truth.
'use strict';
const fs = require('fs');
const path = require('path');

const COMP_DIR = path.join(__dirname, '..', '..', 'references', 'components');

// Rows of the first markdown table under "## <heading>", as objects keyed by lower-case header.
function mdTable(text, heading) {
  const lines = String(text || '').replace(/\r\n/g, '\n').split('\n');
  const start = lines.findIndex(l => new RegExp(`^## ${heading}\\s*$`, 'i').test(l));
  if (start < 0) return [];
  const cells = l => l.trim().replace(/^\||\|$/g, '').split('|').map(c => c.trim());
  let i = start + 1;
  while (i < lines.length && !/^## /.test(lines[i]) && !/^\|/.test(lines[i])) i++;
  if (i >= lines.length || !/^\|/.test(lines[i])) return [];
  const head = cells(lines[i]).map(h => h.toLowerCase());
  const rows = [];
  for (i += 2; i < lines.length && /^\|/.test(lines[i]); i++) {
    const c = cells(lines[i]); const row = {};
    head.forEach((h, k) => { row[h] = c[k] || ''; });
    rows.push(row);
  }
  return rows;
}
const norm = s => String(s || '').toLowerCase().replace(/[`*_]/g, '').replace(/\s+/g, ' ').trim();
// "Field, Input, Button (sm), `Alert`" -> ["Field", "Input", "Button", "Alert"]
const names = s => String(s || '').split(/,|·|;/).map(x => x.replace(/[`*]/g, '').replace(/\(.*?\)/g, '').trim()).filter(x => x && x !== '-' && !/^\?+$/.test(x));

function scenarioBlocks(text) {
  return String(text || '').replace(/\r\n/g, '\n').split(/^(?=### [SE]-\d+ · )/m).map(b => {
    const h = /^### ([SE]-\d+) · (.+)$/m.exec(b); if (!h) return null;
    const f = k => ((new RegExp(`^- ${k}:\\s*(.*)$`, 'm').exec(b) || [])[1] || '').trim();
    return { id: h[1], title: h[2].trim(), screens: f('Screens'), then: f('Then'), status: f('Status') };
  }).filter(Boolean);
}

// One entry per screen of a feature, gathered from the handoff and the scenarios.
function featureScreens(project, slug) {
  if (!/^[a-z0-9][a-z0-9-]*$/.test(slug)) return [];
  const ho = project.read(path.join('features', slug, 'handoff.md')) || '';
  const scen = scenarioBlocks(project.read(path.join('features', slug, 'scenarios.md')) || '');
  const routes = mdTable(ho, 'Routes and state');
  const copy = mdTable(ho, 'Copy');
  const comps = mdTable(ho, 'Components');
  return mdTable(ho, 'Screens and states').map(row => {
    const name = row.screen || Object.values(row)[0] || '';
    const n = norm(name);
    const rt = routes.find(r => norm(r.screen) === n) || {};
    const used = names(row.components);
    return {
      name,
      states: names(row['states to build'] || row.states),
      figma: row['figma frame'] || row.figma || '',
      route: rt.route || '', data: rt['gets data from'] || '', refresh: rt['on refresh'] || '',
      components: used.map(c => {
        const spec = comps.find(x => norm(x.component) === norm(c)) || {};
        return { name: c, props: spec.props || '', story: spec.storybook || '' };
      }),
      copy: copy.filter(r => { const w = norm(r.where); return w === n || w.startsWith(n + ' ·') || w.startsWith(n + ' -') || /\(all screens\)/.test(w); })
        .map(r => ({ where: r.where, text: r.text })),
      scenarios: scen.filter(s => norm(s.screens).includes(n)).map(({ id, title, then, status }) => ({ id, title, then, status })),
    };
  });
}

// The component pages of the library, from references/components/README.md.
let indexCache = null;
function componentIndex() {
  if (indexCache) return indexCache;
  let text = '';
  try { text = fs.readFileSync(path.join(COMP_DIR, 'README.md'), 'utf8'); } catch { return (indexCache = []); }
  indexCache = mdTable(text, 'Pages').map(r => {
    const m = /\[(.+?)\]\(([a-z0-9-]+)\.md\)/.exec(r.page || '');
    return m ? { page: m[1], file: m[2], components: names(r.components) } : null;
  }).filter(Boolean);
  return indexCache;
}
function componentPage(file) {
  if (!componentIndex().some(p => p.file === file)) { const e = new Error('Component page not found'); e.code = 404; throw e; }
  return fs.readFileSync(path.join(COMP_DIR, file + '.md'), 'utf8').replace(/\r\n/g, '\n');
}

// Which screens of which features use each component, from the handoffs.
function componentUsage(project, flows) {
  const byName = new Map();
  const add = (comp, use) => {
    const k = norm(comp); if (!k) return;
    if (!byName.has(k)) byName.set(k, []);
    const list = byName.get(k);
    if (!list.some(u => u.slug === use.slug && u.screen === use.screen)) list.push(use);
  };
  for (const f of flows) {
    const screens = featureScreens(project, f.slug);
    for (const s of screens) for (const c of s.components) add(c.name, { slug: f.slug, feature: f.name, screen: s.name });
    const ho = project.read(path.join('features', f.slug, 'handoff.md')) || '';
    for (const r of mdTable(ho, 'Components')) for (const c of names(r.component)) add(c, { slug: f.slug, feature: f.name, screen: '', story: r.storybook || '' });
  }
  // Prefer screen-level rows; keep a feature-level row only when no screen of it uses the component.
  for (const [k, list] of byName) byName.set(k, list.filter(u => u.screen || !list.some(o => o.screen && o.slug === u.slug)));
  return componentIndex().map(p => ({
    ...p,
    used: p.components.map(c => ({ component: c, uses: byName.get(norm(c)) || [] })).filter(x => x.uses.length),
  }));
}

module.exports = { mdTable, featureScreens, componentIndex, componentPage, componentUsage };
