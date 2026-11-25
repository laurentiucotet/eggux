#!/usr/bin/env node
// EGG UX board: a local web interface for eggux/decisions.md, eggux/tasks.md and eggux/notes/.
// No dependencies. Usage: node server.js [--root <project dir>] [--port 4317]
// Listens on 127.0.0.1 only. The markdown files stay the source of truth.
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const { Project, HttpError } = require('./lib/store');
const W = require('./lib/workspace');
const { execFileSync } = require('child_process');

// Commits that mention a task or its decisions (T-003, D-006) in their message, with the files they
// touched: how the board shows where the work of a task landed.
function taskChanges(id) {
  const t = project.tasks().find(x => x.id === id);
  if (!t) throw new HttpError(404, `${id} not found`);
  const ids = [id, ...t.links.filter(l => /^F?D-\d+$/.test(l))];
  const git = args => execFileSync('git', ['-C', project.root, ...args], { encoding: 'utf8', timeout: 8000, windowsHide: true, stdio: ['ignore', 'pipe', 'ignore'] });
  try { git(['rev-parse', '--is-inside-work-tree']); } catch { return { git: false, ids, commits: [] }; }
  let web = '';
  try {
    const u = git(['config', '--get', 'remote.origin.url']).trim();
    const m = /github\.com[:/]([^/]+\/[^/.]+?)(?:\.git)?$/.exec(u);
    if (m) web = 'https://github.com/' + m[1];
  } catch { /* no remote */ }
  let top = project.root;
  try { top = git(['rev-parse', '--show-toplevel']).trim(); } catch { /* keep */ }
  const out = git(['log', '-n', '30', '--date=short', '--name-only', '--format=%x1e%H%x1f%h%x1f%ad%x1f%an%x1f%s', '--fixed-strings', ...ids.flatMap(x => ['--grep', x])]);
  const commits = out.split('\x1e').map(b => b.trim()).filter(Boolean).map(b => {
    const [headLine, ...files] = b.split('\n');
    const [hash, short, date, author, subject] = headLine.split('\x1f');
    return { hash, short, date, author, subject, url: web ? `${web}/commit/${hash}` : '', files: files.map(f => f.trim()).filter(Boolean).slice(0, 40) };
  });
  const rel = path.relative(top, project.root).replace(/\\/g, '/');
  return { git: true, ids, web, prefix: rel ? rel + '/' : '', commits };
}

const args = process.argv.slice(2);
const arg = (name, def) => { const i = args.indexOf(name); return i >= 0 && args[i + 1] ? args[i + 1] : def; };
const root = arg('--root', process.env.CLAUDE_PROJECT_DIR || process.cwd());
const wantPort = parseInt(arg('--port', process.env.EGGUX_BOARD_PORT || '4317'), 10);
const project = new Project(root);
const PUBLIC = path.join(__dirname, 'public');
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml' };

function send(res, code, body, type = 'application/json; charset=utf-8') {
  res.writeHead(code, { 'Content-Type': type, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
  res.end(typeof body === 'string' || Buffer.isBuffer(body) ? body : JSON.stringify(body));
}
function readBody(req, limit = 2e6) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', c => { data += c; if (data.length > limit) { reject(new HttpError(413, 'Too large')); req.destroy(); } });
    req.on('end', () => { try { resolve(data ? JSON.parse(data) : {}); } catch { reject(new HttpError(400, 'Bad JSON')); } });
  });
}

// Live updates: one signature check per second, pushed to open pages as server-sent events.
const clients = new Set();
// Everything the board shows, including the work files and Claude jobs, so outside edits refresh it.
function signature() {
  const parts = [project.signature(), W.jobsSignature()];
  for (const rel of W.workFiles(project)) { try { const s = fs.statSync(project.p(rel)); parts.push(rel + ':' + s.mtimeMs + ':' + s.size); } catch { /* gone */ } }
  return parts.join('|');
}
try { W.recover(project); } catch { /* no eggux/ yet */ }
let lastSig = signature();
setInterval(() => {
  const sig = signature();
  if (sig !== lastSig) { lastSig = sig; for (const c of clients) c.write('event: change\ndata: {}\n\n'); }
}, 1000).unref();

const dec = s => decodeURIComponent(s);
const routes = [
  ['GET', /^\/api\/state$/, () => ({ ...project.state(), work: W.workState(project) })],
  // Context
  ['GET', /^\/api\/context\/([^/]+)$/, m => W.readSection(project, dec(m[1]))],
  ['POST', /^\/api\/context$/, (m, b) => W.createSection(project, b)],
  ['DELETE', /^\/api\/context\/([^/]+)$/, m => W.deleteSection(project, dec(m[1]))],
  ['PUT', /^\/api\/context\/([^/]+)\/document$/, (m, b) => W.saveDocument(project, dec(m[1]), b.body)],
  ['PUT', /^\/api\/context\/([^/]+)\/template$/, (m, b) => W.saveTemplate(project, dec(m[1]), b)],
  ['POST', /^\/api\/context\/([^/]+)\/entries$/, (m, b) => W.writeEntry(project, dec(m[1]), null, b)],
  ['PUT', /^\/api\/context\/([^/]+)\/entries\/(\d+)$/, (m, b) => W.writeEntry(project, dec(m[1]), +m[2], b)],
  ['DELETE', /^\/api\/context\/([^/]+)\/entries\/(\d+)$/, m => W.writeEntry(project, dec(m[1]), +m[2], { delete: true })],
  ['POST', /^\/api\/context\/([^/]+)\/suggest$/, (m, b) => W.suggestEntry(project, dec(m[1]), b.hint)],
  // Understand
  ['GET', /^\/api\/research\/([a-z0-9-]+)$/, m => W.parseResearch(project, m[1] + '.md')],
  ['POST', /^\/api\/research$/, (m, b) => W.createResearch(project, b.title)],
  ['POST', /^\/api\/research\/([a-z0-9-]+)\/retry$/, m => { W.runResearch(project, m[1]); return { ok: true }; }],
  ['PATCH', /^\/api\/research\/([a-z0-9-]+)\/findings\/(F-\d+)$/, (m, b) => W.voteFinding(project, m[1], m[2], b.vote)],
  ['DELETE', /^\/api\/research\/([a-z0-9-]+)$/, m => W.deleteResearch(project, m[1])],
  // Decide
  ['POST', /^\/api\/questions$/, (m, b) => W.addQuestion(project, b)],
  ['POST', /^\/api\/questions\/(Q-\d+)\/options$/, (m, b) => W.addOption(project, m[1], b)],
  ['POST', /^\/api\/questions\/(Q-\d+)\/another$/, m => { W.runOptions(project, m[1], true); return { ok: true }; }],
  ['POST', /^\/api\/questions\/(Q-\d+)\/choose$/, (m, b) => W.chooseOption(project, m[1], b.key)],
  ['GET', /^\/api\/tasks\/(T-\d+)\/changes$/, m => taskChanges(m[1])],
  // Flows
  ['POST', /^\/api\/flows$/, (m, b) => W.createFlow(project, b)],
  ['PATCH', /^\/api\/flows\/([a-z0-9-]+)$/, (m, b) => W.updateFlowMeta(project, m[1], b)],
  // Documents
  ['POST', /^\/api\/docs$/, (m, b) => W.uploadDoc(project, b)],
  ['DELETE', /^\/api\/docs\/([^/]+)$/, m => W.deleteDoc(project, dec(m[1]))],
  ['POST', /^\/api\/docs\/([^/]+)\/read$/, m => { W.readDoc(project, dec(m[1])); return { ok: true }; }],
  ['POST', /^\/api\/inbox$/, (m, b) => ({ line: project.addInbox(b.source, b.who, b.text) })],
  ['DELETE', /^\/api\/inbox$/, (m, b) => { project.removeInbox(b.source, b.raw); return { ok: true }; }],
  ['POST', /^\/api\/decisions$/, (m, b) => ({ id: project.addDecision(b.source, b) })],
  ['PATCH', /^\/api\/decisions\/(F?D-\d+)$/, (m, b) => { project.setDecisionStatus(b.source, m[1], b.status); return { ok: true }; }],
  ['POST', /^\/api\/terms$/, (m, b) => { project.addTerm(b); return { ok: true }; }],
  ['PUT', /^\/api\/terms\/(\d+)$/, (m, b) => { project.updateTerm(+m[1], b); return { ok: true }; }],
  ['DELETE', /^\/api\/terms\/(\d+)$/, m => { project.deleteTerm(+m[1]); return { ok: true }; }],
  ['DELETE', /^\/api\/tasks\/(T-\d+)$/, m => { project.deleteTask(m[1]); return { ok: true }; }],
  ['DELETE', /^\/api\/notes\/([^/]+)$/, m => { project.deleteNote(decodeURIComponent(m[1])); return { ok: true }; }],
  ['POST', /^\/api\/tasks$/, (m, b) => ({ id: project.addTask(b) })],
  ['PATCH', /^\/api\/tasks\/(T-\d+)$/, (m, b) => { project.updateTask(m[1], b); return { ok: true }; }],
  ['POST', /^\/api\/notes$/, (m, b) => ({ file: project.addNote(b.title) })],
  ['GET', /^\/api\/flows\/([a-z0-9-]+)\/([a-z]+)$/, m => project.readFlowFile(m[1], m[2])],
  ['GET', /^\/api\/notes\/([^/]+)$/, m => project.readNote(decodeURIComponent(m[1]))],
  ['PUT', /^\/api\/notes\/([^/]+)$/, (m, b) => ({ mtime: project.saveNote(decodeURIComponent(m[1]), b) })],
];

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  // Only this machine may write: refuse requests from other origins (a page on another site).
  const origin = req.headers.origin;
  if (req.method !== 'GET' && origin && !/^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/.test(origin)) return send(res, 403, { error: 'Forbidden origin' });
  if (url.pathname === '/api/events') {
    res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-store', Connection: 'keep-alive' });
    res.write('retry: 2000\n\n');
    clients.add(res);
    req.on('close', () => clients.delete(res));
    return;
  }
  if (url.pathname.startsWith('/api/')) {
    const r = routes.find(([m, re]) => m === req.method && re.test(url.pathname));
    if (!r) return send(res, 404, { error: 'Not found' });
    try {
      const body = req.method === 'GET' ? {} : await readBody(req, url.pathname === '/api/docs' ? 15e6 : 2e6);
      const out = r[2](r[1].exec(url.pathname), body);
      if (req.method !== 'GET') { // a write: tell every open page
        lastSig = signature();
        for (const c of clients) c.write('event: change\ndata: {}\n\n');
      }
      return send(res, 200, out);
    } catch (e) {
      return send(res, e.code && e.code >= 400 ? e.code : 500, { error: e.message });
    }
  }
  const rel = url.pathname === '/' ? 'index.html' : url.pathname.slice(1);
  const file = path.resolve(PUBLIC, rel);
  if (!file.startsWith(PUBLIC + path.sep) || !fs.existsSync(file)) return send(res, 404, 'Not found', 'text/plain');
  send(res, 200, fs.readFileSync(file), TYPES[path.extname(file)] || 'application/octet-stream');
});

function listen(port, tries) {
  server.once('error', e => {
    if (e.code === 'EADDRINUSE' && tries > 0) return listen(port + 1, tries - 1);
    console.error(e.message); process.exit(1);
  });
  server.listen(port, '127.0.0.1', () => {
    console.log(`EGG UX board for ${project.root}`);
    console.log(project.exists() ? `Reading ${project.dir}` : `No eggux/ folder yet in ${project.root}: run /eggux:init`);
    console.log(`Open http://127.0.0.1:${port}`);
  });
}
listen(wantPort, 10);
