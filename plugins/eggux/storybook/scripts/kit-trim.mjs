// Trims the component kit to the components a new project needs.
// It reads the imports between files in src/components/ui, keeps the components you name plus
// everything they import (and what their stories import, so the stories still run), and lists
// the rest. Nothing is deleted without --apply.
//
//   npm run kit -- --list                          every component, size, and what uses it
//   npm run kit -- button card table-examples      what stays, what is pulled in, what goes
//   npm run kit -- button card --apply             delete the rest (files and COMPONENTS.md rows)
//   npm run kit -- button card --no-stories        ignore what the stories import: stories that
//                                                  need a removed component are removed too
//
// Names are file names without extension (`table`, `date-picker`). A stories-only file such as
// `table-examples` is a name too, and helper files (`calendar-date.ts`) follow their importers. Run `npm run typecheck` and `npm test` after --apply.
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const ui = path.join(root, 'src', 'components', 'ui');
const args = process.argv.slice(2);
const flag = name => args.includes(`--${name}`);
const names = args.filter(a => !a.startsWith('--'));

if (!fs.existsSync(ui)) {
  console.error(`No ${ui}. Run this from the Storybook folder.`);
  process.exit(2);
}

const files = fs.readdirSync(ui);
const entries = new Map();
for (const f of files) {
  const m = f.match(/^(.*?)(\.stories)?\.tsx?$/);
  if (!m) continue;
  const name = m[1];
  const e = entries.get(name) ?? { name, component: null, stories: null };
  if (m[2]) e.stories = f;
  else e.component = f;
  entries.set(name, e);
}

const importsOf = file => {
  const text = fs.readFileSync(path.join(ui, file), 'utf8');
  const found = new Set();
  for (const m of text.matchAll(/from\s+['"](?:\.\/|@\/components\/ui\/)([\w-]+)['"]/g)) found.add(m[1]);
  return found;
};

const withStories = !flag('no-stories');
const deps = new Map();
for (const [name, e] of entries) {
  const set = new Set();
  if (e.component) for (const d of importsOf(e.component)) set.add(d);
  if (withStories && e.stories) for (const d of importsOf(e.stories)) set.add(d);
  set.delete(name);
  deps.set(name, [...set].filter(d => entries.has(d)));
}

const usedBy = new Map([...entries.keys()].map(n => [n, []]));
for (const [name, list] of deps) for (const d of list) usedBy.get(d).push(name);

if (flag('list')) {
  const rows = [...entries.values()]
    .map(e => ({ name: e.name, lines: e.component ? fs.readFileSync(path.join(ui, e.component), 'utf8').split('\n').length : 0, uses: deps.get(e.name).length, usedBy: usedBy.get(e.name).length, stories: !!e.stories }))
    .sort((a, b) => a.name.localeCompare(b.name));
  console.log('name'.padEnd(34), 'lines', 'imports', 'used by', 'stories');
  for (const r of rows) console.log(r.name.padEnd(34), String(r.lines).padStart(5), String(r.uses).padStart(7), String(r.usedBy).padStart(7), r.stories ? '  yes' : '  -');
  console.log(`\n${rows.length} entries. Pick names and run: npm run kit -- <name> <name> ...`);
  process.exit(0);
}

if (!names.length) {
  console.error('Name the components to keep, or use --list.');
  process.exit(2);
}
const unknown = names.filter(n => !entries.has(n));
if (unknown.length) {
  console.error(`Unknown: ${unknown.join(', ')}. See npm run kit -- --list`);
  process.exit(2);
}

const keep = new Map(); // name -> why
const visit = (name, why) => {
  if (keep.has(name)) return;
  keep.set(name, why);
  for (const d of deps.get(name)) visit(d, `used by ${name}`);
};
for (const n of names) visit(n, 'you asked for it');

const pulled = [...keep].filter(([, why]) => why !== 'you asked for it');
const removed = [...entries.keys()].filter(n => !keep.has(n)).sort();

console.log(`Keep (${names.length} asked): ${names.join(', ')}`);
console.log(`\nPulled in because something you keep imports it (${pulled.length}):`);
for (const [n, why] of pulled) console.log(`  ${n.padEnd(34)} ${why}`);
console.log(`\nRemoved (${removed.length} of ${entries.size}).`);
if (!flag('apply')) {
  console.log('Dry run. Add --apply to delete them.');
  process.exit(0);
}

let deleted = 0;
for (const n of removed) {
  const e = entries.get(n);
  for (const f of [e.component, e.stories]) {
    if (!f) continue;
    fs.rmSync(path.join(ui, f));
    deleted += 1;
  }
}
// Drop the COMPONENTS.md rows of removed files.
const registry = path.join(root, 'COMPONENTS.md');
let rows = 0;
if (fs.existsSync(registry)) {
  const gone = removed.flatMap(n => [`src/components/ui/${n}.tsx`, `src/components/ui/${n}.ts`]);
  const text = fs.readFileSync(registry, 'utf8');
  const crlf = text.includes('\r\n');
  const kept = text.replace(/\r\n/g, '\n').split('\n').filter(line => {
    const hit = line.startsWith('|') && gone.some(g => line.includes(`\`${g}\``));
    if (hit) rows += 1;
    return !hit;
  });
  fs.writeFileSync(registry, kept.join(crlf ? '\r\n' : '\n'));
}
console.log(`Deleted ${deleted} files and ${rows} COMPONENTS.md rows. Next: npm run typecheck && npm test`);
