// EGG UX board: read and edit the markdown files in a client's eggux/ folder.
// The files stay the source of truth: every write is a small, targeted edit of the text,
// so Claude, git and the plugin skills keep working on the same files.
'use strict';
const fs = require('fs');
const path = require('path');

const STAGES = ['discovery', 'decisions', 'design', 'review', 'handoff', 'build', 'qa', 'release', 'feedback'];
const TASK_STATUSES = ['todo', 'doing', 'review', 'done'];
const DECISION_STATUSES = ['proposed', 'approved', 'applied', 'verified', 'superseded'];
const DECISION_TYPES = ['terminology', 'design', 'component', 'behavior', 'content', 'process'];

const pad = n => String(n).padStart(2, '0');
function now() {
  const d = new Date();
  return { date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`, time: `${pad(d.getHours())}:${pad(d.getMinutes())}` };
}
const oneLine = s => String(s == null ? '' : s).replace(/\s*\n\s*/g, ' ').trim();

// ---------- generic markdown helpers ----------
function splitFrontmatter(text) {
  const m = /^---\n([\s\S]*?)\n---\n?/.exec(text);
  if (!m) return { meta: {}, body: text, raw: '' };
  const meta = {};
  for (const line of m[1].split('\n')) {
    const kv = /^([A-Za-z_][\w-]*):\s*(.*)$/.exec(line);
    if (kv) meta[kv[1]] = kv[2].replace(/^"(.*)"$/, '$1');
  }
  return { meta, body: text.slice(m[0].length), raw: m[0] };
}
function setUpdated(text, date) {
  if (/^---\n[\s\S]*?\nupdated:/.test(text)) return text.replace(/^(---\n[\s\S]*?\nupdated:\s*).*$/m, `$1"${date}"`);
  return text;
}
// Line range [start, end) of a "## Name" section (start = heading line).
function sectionRange(lines, name) {
  const start = lines.findIndex(l => l.trim() === `## ${name}`);
  if (start < 0) return null;
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) if (/^## /.test(lines[i])) { end = i; break; }
  return { start, end };
}
// Entries "### ID · date · title" followed by "- Key: value" fields (continuation lines indented).
function parseEntries(lines, from, to, idPattern) {
  const out = [];
  let cur = null, field = null;
  for (let i = from; i < to; i++) {
    const line = lines[i];
    const h = new RegExp(`^### (${idPattern}) · ([^·]+?)(?: · (.*))?$`).exec(line);
    if (h) {
      cur = { id: h[1], when: h[3] !== undefined ? h[2].trim() : '', title: (h[3] !== undefined ? h[3] : h[2]).trim(), fields: {}, line: i, end: i + 1 };
      out.push(cur); field = null; continue;
    }
    if (/^#{1,3} /.test(line)) { cur = null; field = null; continue; }
    if (!cur) continue;
    const f = /^- ([A-Z][\w ]*?):\s?(.*)$/.exec(line);
    if (f) { field = f[1]; cur.fields[field] = f[2]; cur.end = i + 1; continue; }
    if (field && /^\s{2,}\S/.test(line)) { cur.fields[field] += ' ' + line.trim(); cur.end = i + 1; continue; }
    if (line.trim() === '') field = null;
  }
  return out;
}
function statusWord(s) { return String(s || '').trim().split(/\s+/)[0].toLowerCase(); }

// ---------- project ----------
class Project {
  constructor(root) {
    this.root = path.resolve(root);
    this.dir = path.join(this.root, 'eggux');
  }
  p(...parts) {
    const full = path.resolve(this.dir, ...parts);
    if (full !== this.dir && !full.startsWith(this.dir + path.sep)) throw new HttpError(400, 'Path outside eggux/');
    return full;
  }
  exists() { return fs.existsSync(this.dir); }
  read(rel) { try { return fs.readFileSync(this.p(rel), 'utf8'); } catch { return null; } }
  write(rel, text) {
    const full = this.p(rel);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    const tmp = full + '.tmp-' + process.pid;
    fs.writeFileSync(tmp, text);
    fs.renameSync(tmp, full);
  }
  // Signature of every file the board shows, to notice outside edits (Claude, git, an editor).
  signature() {
    const parts = [];
    const add = f => { try { const s = fs.statSync(f); parts.push(f + ':' + s.mtimeMs + ':' + s.size); } catch { /* missing */ } };
    add(this.p('decisions.md')); add(this.p('tasks.md'));
    for (const dir of ['features', 'notes']) {
      let names = [];
      try { names = fs.readdirSync(this.p(dir)); } catch { /* none */ }
      for (const n of names.sort()) add(dir === 'features' ? this.p(dir, n, 'decisions.md') : this.p(dir, n));
    }
    return parts.join('|');
  }
  features() {
    try { return fs.readdirSync(this.p('features')).filter(n => fs.existsSync(this.p('features', n, 'decisions.md'))).sort(); } catch { return []; }
  }
  sourceFile(source) {
    if (!source || source === 'product') return 'decisions.md';
    if (!/^[a-z0-9][a-z0-9-]*$/.test(source)) throw new HttpError(400, 'Bad feature slug');
    return path.join('features', source, 'decisions.md');
  }
  clientName() {
    for (const f of ['decisions.md', 'brand.md']) {
      const t = this.read(f);
      if (t) { const { meta } = splitFrontmatter(t); if (meta.client && !meta.client.includes('{{')) return meta.client; }
    }
    return path.basename(this.root);
  }

  // ---------- decisions ----------
  decisionsOf(source) {
    const rel = this.sourceFile(source);
    const text = this.read(rel);
    if (text == null) return null;
    const lines = text.split('\n');
    const inbox = [];
    const ib = sectionRange(lines, 'Inbox');
    if (ib) {
      let inComment = false;
      for (let i = ib.start + 1; i < ib.end; i++) {
        const l = lines[i];
        if (l.includes('<!--')) inComment = !l.includes('-->');
        else if (inComment) { if (l.includes('-->')) inComment = false; continue; }
        if (!/^- \S/.test(l)) continue;
        const m = /^- (\d{4}-\d{2}-\d{2})(?: (\d{1,2}:\d{2}))? · ([^:]+?): (.*)$/.exec(l);
        inbox.push(m ? { raw: l, date: m[1], time: m[2] || '', who: m[3], text: m[4] } : { raw: l, date: '', time: '', who: '', text: l.slice(2) });
      }
    }
    const terminology = [];
    const tr = sectionRange(lines, 'Terminology');
    if (tr) {
      for (let i = tr.start + 1; i < tr.end; i++) {
        const l = lines[i];
        if (!/^\|/.test(l) || /^\|\s*-/.test(l) || /^\|\s*Use\s*\|/.test(l)) continue;
        const c = l.split('|').slice(1, -1).map(s => s.trim());
        terminology.push({ use: c[0] || '', dont: c[1] || '', context: c[2] || '', since: c[3] || '' });
      }
    }
    const dr = sectionRange(lines, 'Decisions');
    const entries = dr ? parseEntries(lines, dr.start + 1, dr.end, 'F?D-\\d+') : [];
    const decisions = entries.map(e => {
      const [date, time] = e.when.split(' ');
      return {
        id: e.id, source: source || 'product', date: date || '', time: time || '', title: e.title,
        type: (e.fields.Type || '').toLowerCase(), status: e.fields.Status || '', statusWord: statusWord(e.fields.Status),
        fields: e.fields, raw: lines.slice(e.line, e.end).join('\n'),
      };
    });
    const { meta } = splitFrontmatter(text);
    return { source: source || 'product', file: rel, updated: meta.updated || '', name: meta.feature || null, inbox, terminology, decisions };
  }

  addInbox(source, who, text) {
    const rel = this.sourceFile(source);
    let t = this.read(rel);
    if (t == null) throw new HttpError(404, `${rel} does not exist. Run /eggux:init first.`);
    const { date, time } = now();
    const line = `- ${date} ${time} · ${oneLine(who) || 'me'}: ${oneLine(text)}`;
    if (!oneLine(text)) throw new HttpError(400, 'Empty line');
    const lines = t.split('\n');
    const ib = sectionRange(lines, 'Inbox');
    if (!ib) throw new HttpError(400, 'No ## Inbox section');
    let at = ib.end;
    while (at - 1 > ib.start && lines[at - 1].trim() === '') at--;
    lines.splice(at, 0, line);
    this.write(rel, setUpdated(lines.join('\n'), date));
    return line;
  }
  removeInbox(source, raw) {
    const rel = this.sourceFile(source);
    const t = this.read(rel);
    if (t == null) throw new HttpError(404, 'File not found');
    const lines = t.split('\n');
    const ib = sectionRange(lines, 'Inbox');
    const i = ib ? lines.findIndex((l, k) => k > ib.start && k < ib.end && l === raw) : -1;
    if (i < 0) throw new HttpError(409, 'That Inbox line changed or is gone. Reload.');
    lines.splice(i, 1);
    this.write(rel, setUpdated(lines.join('\n'), now().date));
  }

  addDecision(source, d) {
    const rel = this.sourceFile(source);
    const t = this.read(rel);
    if (t == null) throw new HttpError(404, `${rel} does not exist. Run /eggux:init first.`);
    if (!oneLine(d.title)) throw new HttpError(400, 'Title is required');
    const data = this.decisionsOf(source);
    const feature = source && source !== 'product';
    const prefix = feature ? 'FD-' : 'D-';
    const max = data.decisions.reduce((m, x) => Math.max(m, parseInt(x.id.split('-')[1], 10) || 0), 0);
    const id = prefix + String(max + 1).padStart(feature ? 2 : 3, '0');
    const { date, time } = now();
    const out = [`### ${id} · ${date} ${time} · ${oneLine(d.title)}`];
    const type = DECISION_TYPES.includes(d.type) ? d.type : 'process';
    out.push(`- Type: ${type}`);
    out.push(`- Decision: ${oneLine(d.decision) || oneLine(d.title)}`);
    if (oneLine(d.scope)) out.push(`${feature ? '- Affects' : '- Scope'}: ${oneLine(d.scope)}`);
    const reason = [oneLine(d.reason), oneLine(d.from) ? `Source: ${oneLine(d.from)}, ${date} ${time}.` : ''].filter(Boolean).join(' ');
    if (reason) out.push(`- Reason: ${reason}`);
    if (oneLine(d.replaces)) out.push(`- Replaces: ${oneLine(d.replaces)}`);
    if (oneLine(d.verify)) out.push(`- Verify: ${oneLine(d.verify)}`);
    const st = DECISION_STATUSES.includes(d.status) && d.status !== 'superseded' ? d.status : 'proposed';
    out.push(`- Status: ${st === 'applied' || st === 'verified' ? `${st} ${date}` : st}`);
    const lines = t.split('\n');
    const dr = sectionRange(lines, 'Decisions');
    if (!dr) throw new HttpError(400, 'No ## Decisions section');
    let at = lines.findIndex((l, k) => k > dr.start && k < dr.end && /^### /.test(l));
    if (at < 0) { at = dr.end; while (at - 1 > dr.start && lines[at - 1].trim() === '') at--; lines.splice(at, 0, ''); at++; }
    lines.splice(at, 0, ...out, '');
    let text = lines.join('\n');
    if (d.inboxRaw) {
      const l2 = text.split('\n'); const ib = sectionRange(l2, 'Inbox');
      const i = ib ? l2.findIndex((l, k) => k > ib.start && k < ib.end && l === d.inboxRaw) : -1;
      if (i >= 0) { l2.splice(i, 1); text = l2.join('\n'); }
    }
    // The old decision this one replaces is marked superseded.
    if (oneLine(d.replaces)) for (const old of oneLine(d.replaces).split(/[\s,]+/).filter(x => /^F?D-\d+$/.test(x))) text = setEntryField(text, 'Decisions', old, 'Status', `superseded by ${id}`) || text;
    this.write(rel, setUpdated(text, date));
    return id;
  }
  setDecisionStatus(source, id, status) {
    const rel = this.sourceFile(source);
    const t = this.read(rel);
    if (t == null) throw new HttpError(404, 'File not found');
    const word = statusWord(status);
    if (!DECISION_STATUSES.includes(word)) throw new HttpError(400, 'Unknown status');
    const { date } = now();
    const value = word === 'applied' || word === 'verified' ? `${word} ${date}` : oneLine(status);
    const text = setEntryField(t, 'Decisions', id, 'Status', value);
    if (!text) throw new HttpError(404, `${id} not found`);
    this.write(rel, setUpdated(text, date));
  }
  addTerm(row) {
    const t = this.read('decisions.md');
    if (t == null) throw new HttpError(404, 'decisions.md does not exist. Run /eggux:init first.');
    if (!oneLine(row.use)) throw new HttpError(400, 'Use is required');
    const lines = t.split('\n');
    const tr = sectionRange(lines, 'Terminology');
    if (!tr) throw new HttpError(400, 'No ## Terminology section');
    let last = -1;
    for (let i = tr.start + 1; i < tr.end; i++) if (/^\|/.test(lines[i])) last = i;
    const cell = s => oneLine(s).replace(/\|/g, '/');
    const r = `| ${cell(row.use)} | ${cell(row.dont)} | ${cell(row.context)} | ${cell(row.since) || now().date} |`;
    if (last < 0) lines.splice(tr.start + 1, 0, '| Use | Don\'t use | Context | Since |', '|---|---|---|---|', r);
    else lines.splice(last + 1, 0, r);
    this.write('decisions.md', setUpdated(lines.join('\n'), now().date));
  }

  // ---------- tasks ----------
  tasks() {
    const t = this.read('tasks.md');
    if (t == null) return [];
    const lines = t.split('\n');
    const tr = sectionRange(lines, 'Tasks');
    const from = tr ? tr.start + 1 : 0, to = tr ? tr.end : lines.length;
    return parseEntries(lines, from, to, 'T-\\d+').map(e => {
      const f = e.fields;
      const st = statusWord(f.Status);
      const stage = statusWord(f.Stage);
      return {
        id: e.id, title: e.title, status: TASK_STATUSES.includes(st) ? st : 'todo', stage: STAGES.includes(stage) ? stage : '',
        deliverable: f.Deliverable || '', links: (f.Links || '').split(',').map(s => s.trim()).filter(Boolean),
        due: f.Due || '', created: f.Created || e.when || '', notes: f.Notes || '',
      };
    });
  }
  ensureTasksFile() {
    if (this.read('tasks.md') != null) return;
    const tpl = fs.readFileSync(path.join(__dirname, '..', '..', 'skills', 'init', 'templates', 'tasks.md'), 'utf8');
    this.write('tasks.md', tpl.replace(/\{\{client\}\}/g, this.clientName()).replace(/\{\{date\}\}/g, now().date));
  }
  addTask(d) {
    if (!this.exists()) throw new HttpError(404, 'No eggux/ folder. Run /eggux:init first.');
    if (!oneLine(d.title)) throw new HttpError(400, 'Title is required');
    this.ensureTasksFile();
    const t = this.read('tasks.md');
    const max = this.tasks().reduce((m, x) => Math.max(m, parseInt(x.id.slice(2), 10) || 0), 0);
    const id = 'T-' + String(max + 1).padStart(3, '0');
    const { date } = now();
    const out = [`### ${id} · ${oneLine(d.title)}`, `- Status: ${TASK_STATUSES.includes(d.status) ? d.status : 'todo'}`];
    out.push(`- Stage: ${STAGES.includes(d.stage) ? d.stage : 'design'}`);
    if (oneLine(d.deliverable)) out.push(`- Deliverable: ${oneLine(d.deliverable)}`);
    const links = Array.isArray(d.links) ? d.links.join(', ') : oneLine(d.links);
    if (oneLine(links)) out.push(`- Links: ${oneLine(links)}`);
    if (/^\d{4}-\d{2}-\d{2}$/.test(d.due || '')) out.push(`- Due: ${d.due}`);
    out.push(`- Created: ${date}`);
    if (oneLine(d.notes)) out.push(`- Notes: ${oneLine(d.notes)}`);
    const lines = t.split('\n');
    const tr = sectionRange(lines, 'Tasks');
    if (!tr) throw new HttpError(400, 'No ## Tasks section in tasks.md');
    let at = lines.findIndex((l, k) => k > tr.start && k < tr.end && /^### /.test(l));
    if (at < 0) { at = tr.end; while (at - 1 > tr.start && lines[at - 1].trim() === '') at--; lines.splice(at, 0, ''); at++; }
    lines.splice(at, 0, ...out, '');
    this.write('tasks.md', setUpdated(lines.join('\n'), date));
    return id;
  }
  updateTask(id, d) {
    const t = this.read('tasks.md');
    if (t == null) throw new HttpError(404, 'tasks.md not found');
    let text = t;
    const set = (k, v) => { const r = setEntryField(text, 'Tasks', id, k, v, true); if (!r) throw new HttpError(404, `${id} not found`); text = r; };
    if (d.status !== undefined) { if (!TASK_STATUSES.includes(d.status)) throw new HttpError(400, 'Unknown status'); set('Status', d.status); }
    if (d.stage !== undefined) { if (!STAGES.includes(d.stage)) throw new HttpError(400, 'Unknown stage'); set('Stage', d.stage); }
    for (const [key, field] of [['deliverable', 'Deliverable'], ['links', 'Links'], ['due', 'Due'], ['notes', 'Notes']]) {
      if (d[key] === undefined) continue;
      const v = Array.isArray(d[key]) ? d[key].join(', ') : oneLine(d[key]);
      if (key === 'due' && v && !/^\d{4}-\d{2}-\d{2}$/.test(v)) throw new HttpError(400, 'Due must be YYYY-MM-DD');
      set(field, v);
    }
    if (d.title !== undefined) {
      if (!oneLine(d.title)) throw new HttpError(400, 'Title is required');
      const lines = text.split('\n');
      const i = lines.findIndex(l => l.startsWith(`### ${id} · `));
      if (i < 0) throw new HttpError(404, `${id} not found`);
      lines[i] = `### ${id} · ${oneLine(d.title)}`; text = lines.join('\n');
    }
    this.write('tasks.md', setUpdated(text, now().date));
  }

  // ---------- notes ----------
  notes() {
    let names = [];
    try { names = fs.readdirSync(this.p('notes')).filter(n => /\.md$/.test(n) && n !== 'README.md'); } catch { return []; }
    return names.map(n => {
      const text = this.read(path.join('notes', n)) || '';
      const { meta, body } = splitFrontmatter(text);
      const plain = body.replace(/^#.*$/gm, '').replace(/[*_`>#-]/g, '').replace(/\s+/g, ' ').trim();
      return { file: n, title: meta.title || n.replace(/\.md$/, ''), date: meta.date || '', tags: (meta.tags || '').replace(/[[\]]/g, '').split(',').map(s => s.trim()).filter(Boolean), excerpt: plain.slice(0, 140), mtime: fs.statSync(this.p('notes', n)).mtimeMs };
    }).sort((a, b) => (b.date + b.mtime).localeCompare(a.date + a.mtime));
  }
  noteFile(file) { if (!/^[a-z0-9][a-z0-9-]*\.md$/.test(file)) throw new HttpError(400, 'Bad note name'); return path.join('notes', file); }
  readNote(file) {
    const rel = this.noteFile(file);
    const text = this.read(rel);
    if (text == null) throw new HttpError(404, 'Note not found');
    const { meta, body } = splitFrontmatter(text);
    return { file, title: meta.title || '', date: meta.date || '', tags: (meta.tags || '').replace(/[[\]]/g, ''), body: body.replace(/^\n/, ''), mtime: fs.statSync(this.p(rel)).mtimeMs };
  }
  addNote(title) {
    if (!this.exists()) throw new HttpError(404, 'No eggux/ folder. Run /eggux:init first.');
    const { date } = now();
    const t = oneLine(title) || 'Untitled note';
    const slug = t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48) || 'note';
    let file = `${date}-${slug}.md`, n = 2;
    while (fs.existsSync(this.p('notes', file))) file = `${date}-${slug}-${n++}.md`;
    this.write(path.join('notes', file), noteText(t, date, '', ''));
    return file;
  }
  saveNote(file, d) {
    const rel = this.noteFile(file);
    const full = this.p(rel);
    if (!fs.existsSync(full)) throw new HttpError(404, 'Note not found');
    if (d.baseMtime && Math.abs(fs.statSync(full).mtimeMs - d.baseMtime) > 1) throw new HttpError(409, 'This note changed on disk. Reload it before saving.');
    const cur = this.readNote(file);
    this.write(rel, noteText(oneLine(d.title) || cur.title || 'Untitled note', cur.date || now().date, d.tags !== undefined ? d.tags : cur.tags, d.body !== undefined ? d.body : cur.body));
    return fs.statSync(full).mtimeMs;
  }

  state() {
    const product = this.decisionsOf('product');
    const features = this.features().map(s => this.decisionsOf(s)).filter(Boolean);
    return {
      project: { name: this.clientName(), root: this.root, hasFolder: this.exists(), hasDecisions: !!product, hasTasks: this.read('tasks.md') != null },
      stages: STAGES, taskStatuses: TASK_STATUSES, decisionStatuses: DECISION_STATUSES, decisionTypes: DECISION_TYPES,
      decisions: { product, features }, tasks: this.tasks(), notes: this.notes(),
    };
  }
}

function noteText(title, date, tags, body) {
  const tagList = String(tags || '').split(',').map(s => oneLine(s)).filter(Boolean).join(', ');
  return `---\ntitle: "${oneLine(title).replace(/"/g, "'")}"\ndate: "${date}"\ntags: [${tagList}]\n---\n\n${String(body || '').replace(/\s+$/, '')}\n`;
}

// Replace (or add, or with an empty value remove) one "- Key: value" field of an entry.
function setEntryField(text, section, id, key, value, removeIfEmpty) {
  const lines = text.split('\n');
  const sr = sectionRange(lines, section);
  const from = sr ? sr.start + 1 : 0, to = sr ? sr.end : lines.length;
  const e = parseEntries(lines, from, to, id.split('-')[0] + '-\\d+').find(x => x.id === id);
  if (!e) return null;
  let k = -1, kEnd = -1;
  for (let i = e.line + 1; i < e.end; i++) {
    if (lines[i].startsWith(`- ${key}:`)) { k = i; kEnd = i + 1; while (kEnd < e.end && /^\s{2,}\S/.test(lines[kEnd])) kEnd++; break; }
  }
  const v = oneLine(value);
  if (k >= 0) {
    if (!v && removeIfEmpty) lines.splice(k, kEnd - k);
    else lines.splice(k, kEnd - k, `- ${key}: ${v}`);
  } else if (v) {
    lines.splice(e.end, 0, `- ${key}: ${v}`);
  }
  return lines.join('\n');
}

class HttpError extends Error { constructor(code, msg) { super(msg); this.code = code; } }

module.exports = { Project, HttpError, STAGES, TASK_STATUSES, DECISION_STATUSES, DECISION_TYPES, splitFrontmatter, setEntryField };
