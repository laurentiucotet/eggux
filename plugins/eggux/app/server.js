#!/usr/bin/env node
// EGG UX board: a local web interface for eggux/decisions.md, eggux/tasks.md and eggux/notes/.
// No dependencies. Usage: node server.js [--root <project dir>] [--port 4317]
// Listens on 127.0.0.1 only. The markdown files stay the source of truth.
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const { Project, HttpError } = require('./lib/store');

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
function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', c => { data += c; if (data.length > 2e6) { reject(new HttpError(413, 'Too large')); req.destroy(); } });
    req.on('end', () => { try { resolve(data ? JSON.parse(data) : {}); } catch { reject(new HttpError(400, 'Bad JSON')); } });
  });
}

// Live updates: one signature check per second, pushed to open pages as server-sent events.
const clients = new Set();
let lastSig = project.signature();
setInterval(() => {
  const sig = project.signature();
  if (sig !== lastSig) { lastSig = sig; for (const c of clients) c.write('event: change\ndata: {}\n\n'); }
}, 1000).unref();

const routes = [
  ['GET', /^\/api\/state$/, () => project.state()],
  ['POST', /^\/api\/inbox$/, (m, b) => ({ line: project.addInbox(b.source, b.who, b.text) })],
  ['DELETE', /^\/api\/inbox$/, (m, b) => { project.removeInbox(b.source, b.raw); return { ok: true }; }],
  ['POST', /^\/api\/decisions$/, (m, b) => ({ id: project.addDecision(b.source, b) })],
  ['PATCH', /^\/api\/decisions\/(F?D-\d+)$/, (m, b) => { project.setDecisionStatus(b.source, m[1], b.status); return { ok: true }; }],
  ['POST', /^\/api\/terms$/, (m, b) => { project.addTerm(b); return { ok: true }; }],
  ['POST', /^\/api\/tasks$/, (m, b) => ({ id: project.addTask(b) })],
  ['PATCH', /^\/api\/tasks\/(T-\d+)$/, (m, b) => { project.updateTask(m[1], b); return { ok: true }; }],
  ['POST', /^\/api\/notes$/, (m, b) => ({ file: project.addNote(b.title) })],
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
      const body = req.method === 'GET' ? {} : await readBody(req);
      const out = r[2](r[1].exec(url.pathname), body);
      if (req.method !== 'GET') { // a write: tell every open page
        lastSig = project.signature();
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
