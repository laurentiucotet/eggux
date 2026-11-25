// EGG UX board client. Plain JS, no build step. State comes from /api/state and refreshes
// whenever a file in eggux/ changes (server-sent events), so edits made by Claude show up live.
'use strict';

const ICONS = {
  decisions: '<path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>',
  tasks: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="m9 12 2 2 4-4"/>',
  notes: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
  plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  inbox: '<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
  moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
  monitor: '<rect width="20" height="14" x="2" y="3" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/>',
  calendar: '<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/>',
  arrow: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  expand: '<path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/>',
  figma: '<path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z"/><path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z"/><path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z"/><path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z"/><path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z"/>',
  zoomin: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="M11 8v6"/><path d="M8 11h6"/>',
  zoomout: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="M8 11h6"/>',
  sparkles: '<path d="M9.94 14.06 12 21l2.06-6.94L21 12l-6.94-2.06L12 3 9.94 9.94 3 12z"/>',
  pencil: '<path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>',
  trash: '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5"/><path d="M12 3v12"/>',
  sliders: '<path d="M4 21v-7"/><path d="M4 10V3"/><path d="M12 21v-9"/><path d="M12 8V3"/><path d="M20 21v-5"/><path d="M20 12V3"/><path d="M2 14h4"/><path d="M10 8h4"/><path d="M18 16h4"/>',
  up: '<path d="m18 15-6-6-6 6"/>',
  down: '<path d="m6 9 6 6 6-6"/>',
  right: '<path d="m9 18 6-6-6-6"/>',
  thumbup: '<path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"/>',
  thumbdown: '<path d="M17 14V2"/><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z"/>',
  bulb: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  context: '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
  docs: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/>',
  understand: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="M11 8v6"/><path d="M8 11h6"/>',
  decide: '<path d="M16 3h5v5"/><path d="M8 3H3v5"/><path d="M12 22v-8.3a4 4 0 0 0-1.17-2.83L3 3"/><path d="m15 9 6-6"/>',
  flows: '<rect width="8" height="8" x="3" y="3" rx="2"/><path d="M7 11v4a2 2 0 0 0 2 2h4"/><rect width="8" height="8" x="13" y="13" rx="2"/>',
};
const icon = (n, cls = '') => `<svg class="i ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n]}</svg>`;
const code = s => esc(s).replace(/`([^`]+)`/g, '<code>$1</code>');
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const $ = (sel, el = document) => el.querySelector(sel);
const store = {
  get(k, d) { try { const v = localStorage.getItem('eggux-board:' + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem('eggux-board:' + k, JSON.stringify(v)); } catch { /* private mode */ } },
};
const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };

let S = null;                // last /api/state
const ui = {
  dq: '', dStatus: 'open', dType: '', dSource: '', dTab: 'decisions',
  tq: '', tStage: '',
  nq: '', note: null, noteDirty: false, notePreview: false, noteSaving: false, noteConflict: false,
};

// ---------- api ----------
async function api(method, url, body) {
  const r = await fetch(url, { method, headers: body ? { 'Content-Type': 'application/json' } : {}, body: body ? JSON.stringify(body) : undefined });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw Object.assign(new Error(data.error || r.statusText), { status: r.status });
  return data;
}
function toast(msg, err) {
  const t = document.createElement('div');
  t.className = 'toast' + (err ? ' err' : '');
  t.textContent = msg;
  $('#toasts').append(t);
  setTimeout(() => t.remove(), err ? 6000 : 3200);
}
async function act(fn, ok) {
  try { const r = await fn(); if (ok) toast(ok); await load(); return r; } catch (e) { toast(e.message, true); return null; }
}

// ---------- routing ----------
function route() {
  const [, view = 'context', a, b] = location.hash.split('/');
  return { view: ['context', 'docs', 'understand', 'decide', 'decisions', 'tasks', 'flows', 'notes'].includes(view) ? view : 'context', a: a ? decodeURIComponent(a) : '', b: b ? decodeURIComponent(b) : '' };
}
window.addEventListener('hashchange', () => { render(); $('#main').focus({ preventScroll: true }); });

// ---------- helpers on state ----------
function allDecisions() {
  if (!S || !S.decisions.product) return [];
  return [S.decisions.product, ...S.decisions.features].flatMap(f => f.decisions);
}
function allInbox() {
  if (!S || !S.decisions.product) return [];
  return [S.decisions.product, ...S.decisions.features].flatMap(f => f.inbox.map(x => ({ ...x, source: f.source })));
}
function sources() { return S && S.decisions.product ? ['product', ...S.decisions.features.map(f => f.source)] : []; }
const srcLabel = s => s === 'product' ? 'Product' : s;
const openTasks = () => (S ? S.tasks.filter(t => t.status !== 'done') : []);
function linkChip(l) {
  if (/^F?D-\d+$/.test(l)) {
    const d = allDecisions().find(x => x.id === l);
    return `<a class="badge outline" href="#/decisions/${esc(d ? d.source : 'product')}/${esc(l)}" title="${esc(d ? d.title : 'Decision')}">${esc(l)}</a>`;
  }
  if (/^feature:/.test(l)) return `<a class="badge outline" href="#/flows/${esc(l.slice(8))}">${esc(l)}</a>`;
  if (/^note:/.test(l)) return `<a class="badge outline" href="#/notes/${esc(l.slice(5))}">${esc(l)}</a>`;
  if (/^https?:\/\//.test(l)) return `<a class="badge outline" href="${esc(l)}" target="_blank" rel="noopener">${esc(/figma\.com/.test(l) ? 'Figma' : 'Link')}</a>`;
  return `<span class="badge outline">${esc(l)}</span>`;
}
function linkify(text) {
  return esc(text).replace(/https?:\/\/[^\s<)]+/g, u => `<a href="${u}" target="_blank" rel="noopener">${/figma\.com/.test(u) ? 'Figma link' : u}</a>`)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\b(F?D-\d{2,3})\b/g, (m) => { const d = allDecisions().find(x => x.id === m); return d ? `<a href="#/decisions/${esc(d.source)}/${m}">${m}</a>` : m; });
}

// ---------- shell ----------
function renderNav() {
  const r = route();
  const w = S && S.work;
  const cur = r.view === 'notes' ? 'context' : r.view;
  const inboxN = allInbox().length;
  const openQ = w ? w.questions.filter(q => !/^decided/.test(q.status)) : [];
  const groups = [
    ['Project', [['context', 'Context', w ? w.context.length : 0], ['docs', 'Documents', w ? w.docs.length : 0]]],
    ['Discover', [['understand', 'Understand', w ? w.research.length : 0], ['decide', 'Decide', openQ.length]]],
    ['Deliver', [['flows', 'Flows', S && S.flows ? S.flows.length : 0], ['tasks', 'Working board', openTasks().length]]],
    ['Record', [['decisions', 'Decision log', inboxN ? `${inboxN} new` : allDecisions().length]]],
  ];
  // The open section lists its items under it, so you can jump between them.
  const sub = () => {
    if (!S) return [];
    if (cur === 'context') return [...(w ? w.context.map(x => [`#/context/${encodeURIComponent(x.id)}`, x.name, r.view === 'context' && (r.a === x.id || (!r.a && x === w.context[0]))]) : []),
      ['#/context/terminology', 'Terminology', r.a === 'terminology'], ['#/notes', 'Notes', r.view === 'notes']];
    if (cur === 'understand') return w ? w.research.map((x, i) => [`#/understand/${x.slug}`, x.title, r.a === x.slug || (!r.a && i === 0)]) : [];
    if (cur === 'decide') return openQ.map((x, i) => [`#/decide/${x.id}`, x.title, r.a === x.id || (!r.a && i === 0)]);
    if (cur === 'flows') return (S.flows || []).map((x, i) => [`#/flows/${x.slug}`, (x.group ? x.group + ' · ' : '') + x.name, r.a === x.slug || (!r.a && i === 0)]);
    return [];
  };
  $('#nav').innerHTML = groups.map(([g, items]) => `<div class="nav-group"><div class="nav-label">${g}</div>${items.map(([k, label, n]) => {
    const on = cur === k;
    const kids = on ? sub() : [];
    return `<a href="#/${k}" ${on ? 'aria-current="page"' : ''}>${icon(k)}<span class="lbl">${label}</span><span class="count">${esc(n)}</span></a>
      ${kids.length ? `<div class="nav-sub">${kids.map(([href, l, active]) => `<a href="${href}" ${active ? 'aria-current="true"' : ''} title="${esc(l)}">${esc(l)}</a>`).join('')}</div>` : ''}`;
  }).join('')}</div>`).join('');
  $('#project-name').textContent = S ? S.project.name : 'Loading';
  document.title = `${({ context: 'Context', docs: 'Documents', understand: 'Understand', decide: 'Decide', decisions: 'Decision log', tasks: 'Working board', flows: 'Flows', notes: 'Notes' })[r.view]} · ${S ? S.project.name : 'EGG UX Board'}`;
}
function setupState() {
  if (!S.project.hasFolder) return `<div class="card"><div class="empty"><strong>No eggux/ folder in this project</strong>Run <code>/eggux:init</code> in Claude Code in <code>${esc(S.project.root)}</code>. The board shows its decisions, tasks and notes as soon as the folder exists.</div></div>`;
  return '';
}

// ---------- decisions ----------
function renderDecisions(r) {
  const setup = setupState();
  if (setup) return head('Decisions', 'What the client and the team decided, from the Inbox to verified.') + setup;
  if (!S.decisions.product) return head('Decisions', '') + `<div class="card"><div class="empty"><strong>No decisions.md yet</strong>Run <code>/eggux:init</code> to create <code>eggux/decisions.md</code>.</div></div>`;
  const all = allDecisions();
  const counts = Object.fromEntries(S.decisionStatuses.map(s => [s, all.filter(d => d.statusWord === s).length]));
  const open = all.filter(d => !['verified', 'superseded'].includes(d.statusWord)).length;
  let html = head('Decision log', `${all.length} decisions in <code>eggux/decisions.md</code> and the flows' <code>decisions.md</code>. The newest wins.`,
    `<button class="btn" type="button" data-act="new-decision">${icon('plus')}New decision</button>`);
  html += renderInbox();
  const q = ui.dq.toLowerCase();
  const list = all.filter(d => !q || (d.id + ' ' + d.title + ' ' + Object.values(d.fields).join(' ')).toLowerCase().includes(q));
  const sel = r.b ? all.find(d => d.id === r.b && d.source === r.a) : null;
  html += `<div class="toolbar">
    <label class="search"><span class="sr-only">Search decisions</span>${icon('search')}<input class="input" id="dq" type="search" placeholder="Search decisions" value="${esc(ui.dq)}"></label>
  </div>`;
  html += `<div class="split ${sel ? '' : 'single'}"><div class="card">${list.length ? `<ul class="list">${list.map(d => `<li><button type="button" class="item" data-open-decision="${esc(d.source)}/${esc(d.id)}" ${sel && sel.id === d.id && sel.source === d.source ? 'aria-current="true"' : ''}>
      <span class="id">${esc(d.id)}</span><span class="title">${esc(d.title)}</span><span class="badge s-${esc(d.statusWord)}">${esc(d.statusWord || 'no status')}</span>
      <span class="sub">${d.type ? `<span>${esc(d.type)}</span>·` : ''}<span>${esc(d.date)}${d.time ? ' ' + esc(d.time) : ''}</span>${d.source !== 'product' ? `·<span>${esc(d.source)}</span>` : ''}</span></button></li>`).join('')}</ul>`
    : `<div class="empty"><strong>No decisions match</strong>Change the filters or record a new decision.</div>`}</div>
    ${sel ? renderDecisionDetail(sel) : ''}</div>`;
  return html;
}
function renderInbox() {
  const items = allInbox();
  const who = store.get('who', '');
  return `<details class="card inbox-box" style="margin-bottom:16px" ${items.length ? 'open' : ''}>
    <summary class="card-head">${icon('inbox')}<h2 id="inbox-h">Inbox</h2><span class="badge ${items.length ? 's-proposed' : ''}">${items.length} new</span>
      <span class="muted" style="font-size:13px">Requests in one line, waiting to become decisions.</span></summary>
    ${items.length ? `<ul class="inbox-list">${items.map((x, i) => `<li><div class="txt">${linkify(x.text)}<div class="meta">${x.who ? `<span>${esc(x.who)}</span>·` : ''}<span>${esc(x.date)} ${esc(x.time)}</span>${x.source !== 'product' ? `<span class="badge outline">${esc(x.source)}</span>` : ''}</div></div>
      <button class="btn outline sm" type="button" data-record="${i}">Record</button><button class="btn ghost sm" type="button" data-dismiss="${i}">Dismiss</button></li>`).join('')}</ul>` : ''}
    <form class="inbox-add" id="inbox-form">
      <label class="sr-only" for="ib-src">Where</label><select class="input" id="ib-src">${sources().map(s => `<option value="${esc(s)}">${esc(srcLabel(s))}</option>`).join('')}</select>
      <label class="sr-only" for="ib-who">Who asked</label><input class="input" id="ib-who" placeholder="Who asked" value="${esc(who)}">
      <label class="sr-only" for="ib-text">Request</label><input class="input text" id="ib-text" placeholder="Cards with 12 px padding instead of 24" required>
      <button class="btn" type="submit">Add to Inbox</button>
    </form></details>`;
}
function renderDecisionDetail(d) {
  const tasks = S.tasks.filter(t => t.links.includes(d.id));
  const skip = ['Status'];
  return `<aside class="card detail" aria-labelledby="dd-title"><div class="card-body stack">
    <div class="row"><span class="badge s-${esc(d.statusWord)}">${esc(d.status || 'no status')}</span><span class="id muted" style="font:600 12px var(--mono)">${esc(d.id)}</span>
      <a class="btn ghost icon sm" style="margin-left:auto" href="#/decisions" aria-label="Close">${icon('x')}</a></div>
    <h2 id="dd-title">${esc(d.title)}</h2>
    <dl class="kv"><dt>Date</dt><dd>${esc(d.date)} ${esc(d.time)}</dd><dt>Where</dt><dd>${esc(srcLabel(d.source))}</dd>
      ${Object.entries(d.fields).filter(([k]) => !skip.includes(k)).map(([k, v]) => `<dt>${esc(k)}</dt><dd>${linkify(v)}</dd>`).join('')}</dl>
    <form class="row" id="status-form" data-key="${esc(d.source)}/${esc(d.id)}">
      <label class="sr-only" for="dd-status">Status</label>
      <select class="input" id="dd-status" style="width:auto">${S.decisionStatuses.filter(s => s !== 'superseded').map(s => `<option ${d.statusWord === s ? 'selected' : ''}>${s}</option>`).join('')}</select>
      <button class="btn outline sm" type="submit">Set status</button>
      <button class="btn ghost sm" type="button" data-task-from="${esc(d.id)}">${icon('plus', 'sm')}Task</button>
    </form>
    <div><div class="muted" style="font-size:12px;font-weight:600;margin-bottom:6px">TASKS</div>${tasks.length ? tasks.map(t => `<div class="row" style="margin-bottom:6px"><span class="badge t-${t.status}">${t.status}</span><a href="#/tasks/${esc(t.id)}">${esc(t.id)} ${esc(t.title)}</a></div>`).join('') : '<span class="muted">No task links to this decision.</span>'}</div>
  </div></aside>`;
}
function renderTerms() {
  const t = S.decisions.product.terminology;
  return `<div class="card"><table class="terms"><thead><tr><th>Use</th><th>Don't use</th><th>Context</th><th>Since</th></tr></thead><tbody>
    ${t.length ? t.map(x => `<tr><td><strong>${esc(x.use)}</strong></td><td class="muted">${esc(x.dont)}</td><td>${esc(x.context)}</td><td class="muted">${esc(x.since)}</td></tr>`).join('') : `<tr><td colspan="4" class="empty">No terms yet.</td></tr>`}
  </tbody></table>
  <form class="inbox-add" id="term-form" style="grid-template-columns:repeat(3,minmax(0,1fr)) auto">
    <label class="sr-only" for="tm-use">Use</label><input class="input" id="tm-use" placeholder="Use: Request access" required>
    <label class="sr-only" for="tm-dont">Don't use</label><input class="input" id="tm-dont" placeholder="Don't use: Demo">
    <label class="sr-only" for="tm-ctx">Context</label><input class="input" id="tm-ctx" placeholder="Context: navbar, pricing">
    <button class="btn" type="submit">Add term</button></form></div>`;
}

// ---------- tasks ----------
function renderTasks(r) {
  const setup = setupState();
  if (setup) return head('Tasks', 'Work in pipeline stages, each with a deliverable.') + setup;
  const tasks = S.tasks;
  const q = ui.tq.toLowerCase();
  const shown = tasks.filter(t => !q || (t.id + ' ' + t.title + ' ' + t.deliverable + ' ' + t.links.join(' ') + ' ' + t.notes).toLowerCase().includes(q));
  let html = head('Working board', `${openTasks().length} open, ${tasks.length - openTasks().length} done. Each task names what it delivers.${S.project.hasTasks ? '' : ' The first task creates eggux/tasks.md.'}`,
    `<button class="btn" type="button" data-act="new-task">${icon('plus')}New task</button>`);
  html += `<div class="toolbar"><label class="search"><span class="sr-only">Search tasks</span>${icon('search')}<input class="input" id="tq" type="search" placeholder="Search tasks" value="${esc(ui.tq)}"></label>
    <span class="muted" style="font-size:13px">Drag cards between columns.</span></div>`;
  html += `<div class="board three">${['todo', 'doing', 'done'].map(st => {
    const col = shown.filter(t => st === 'doing' ? ['doing', 'review'].includes(t.status) : t.status === st);
    return `<section class="col" data-col="${st}" aria-label="${STATUS_LABEL[st]}"><div class="col-head"><span>${STATUS_LABEL[st]}</span><span class="n">${col.length}</span>${st === 'todo' ? `<button class="btn ghost icon sm" type="button" data-act="new-task" aria-label="New task">${icon('plus')}</button>` : ''}</div>
      ${col.map(t => taskCard(t)).join('') || `<div class="muted" style="font-size:13px;padding:4px">Nothing here.</div>`}</section>`;
  }).join('')}</div>`;
  const sel = r.a && S.tasks.find(x => x.id === r.a);
  if (sel) html += taskDrawer(sel);
  return html;
}
const STAGE_LABEL = { discovery: 'Discovery', decisions: 'Decisions', design: 'Design', review: 'Review', handoff: 'Handoff', build: 'Build', qa: 'QA', release: 'Release', feedback: 'Feedback' };
const STATUS_LABEL = { todo: 'To do', doing: 'Doing', review: 'Review', done: 'Done' };
// Paths in task text become links to where the work lives in the board.
function linkPaths(text) {
  return code(text)
    .replace(/(?:eggux\/)?features\/([a-z0-9-]+)\/(handoff|feature|scenarios|workflows|decisions)\.md/g, (m, s, f) => `<a href="#/flows/${s}/${f}">${m}</a>`)
    .replace(/(?:eggux\/)?research\/([a-z0-9-]+)\.md/g, (m, s) => `<a href="#/understand/${s}">${m}</a>`)
    .replace(/(?<![\w/])(?:eggux\/)?(actors|objects|workflows|brand)\.md/g, (m, s) => `<a href="#/context/${s}.md">${m}</a>`)
    .replace(/\b(F?D-\d{2,3})\b/g, m => { const d = allDecisions().find(x => x.id === m); return d ? `<a href="#/decisions/${esc(d.source)}/${m}">${m}</a>` : m; })
    .replace(/(^|\s)(https?:\/\/[^\s<]+)/g, '$1<a href="$2" target="_blank" rel="noopener">$2</a>');
}
const changesCache = {};
function taskChanges(id) {
  const c = changesCache[id];
  if (c && c.S === S) return c.data;
  if (!c || !c.loading) {
    changesCache[id] = { ...(c || {}), loading: true };
    api('GET', `/api/tasks/${id}/changes`).then(d => { changesCache[id] = { S, data: d }; if (route().view === 'tasks') render(); })
      .catch(e => { changesCache[id] = { S, data: { error: e.message } }; if (route().view === 'tasks') render(); });
  }
  return c ? c.data : null;
}
function taskDrawer(t) {
  const decs = t.links.filter(l => /^F?D-\d+$/.test(l)).map(id => allDecisions().find(d => d.id === id)).filter(Boolean);
  const ch = taskChanges(t.id);
  const fileLink = (c, f) => {
    const local = ch.prefix && f.startsWith(ch.prefix) ? f.slice(ch.prefix.length) : null;
    const inBoard = local ? linkPaths(local) : '';
    return `<li>${inBoard && inBoard !== code(local) ? inBoard : `<code>${esc(f)}</code>`}${c.url ? ` <a class="muted" href="${esc(ch.web)}/blob/${c.hash}/${esc(f)}" target="_blank" rel="noopener">view</a>` : ''}</li>`;
  };
  return `<aside class="drawer" aria-labelledby="td-title">
    <div class="drawer-head"><span class="id">${esc(t.id)}</span>
      <form id="td-status" data-id="${esc(t.id)}" class="row"><label class="sr-only" for="td-st">Status</label><select class="input" id="td-st" style="width:auto;height:30px">${['todo', 'doing', 'review', 'done'].map(s => `<option value="${s}" ${t.status === s ? 'selected' : ''}>${STATUS_LABEL[s]}</option>`).join('')}</select></form>
      <button class="btn outline sm" type="button" data-task-edit="${esc(t.id)}">${icon('pencil', 'sm')}Edit</button>
      <a class="btn ghost icon sm" href="#/tasks" aria-label="Close">${icon('x')}</a></div>
    <div class="drawer-body">
      <h2 id="td-title">${esc(t.title)}</h2>
      ${t.deliverable ? `<section><h3>Delivers</h3><p>${linkPaths(t.deliverable)}</p></section>` : ''}
      ${decs.length ? `<section><h3>Decision</h3>${decs.map(d => `<div class="td-dec"><a href="#/decisions/${esc(d.source)}/${esc(d.id)}">${esc(d.id)}</a> <span class="badge s-${esc(d.statusWord)}">${esc(d.statusWord)}</span><div>${esc(d.title)}</div>${d.fields.Decision ? `<div class="muted small">${esc(d.fields.Decision)}</div>` : ''}</div>`).join('')}</section>` : ''}
      ${t.links.filter(l => !/^F?D-\d+$/.test(l)).length ? `<section><h3>Links</h3><div class="row">${t.links.filter(l => !/^F?D-\d+$/.test(l)).map(linkChip).join(' ')}</div></section>` : ''}
      <section><h3>Result</h3>
        <form id="td-result" data-id="${esc(t.id)}" class="stack" style="gap:8px">
          ${t.result ? `<p class="td-result">${linkPaths(t.result)}</p>` : '<p class="muted small">What changed and where: files, Figma frames, links. Claude writes it when it finishes the task; you can too.</p>'}
          <label class="sr-only" for="td-res">Result</label><textarea class="input" id="td-res" rows="3" placeholder="features/forgot-password/handoff.md updated to v3; Figma frame S-01 / 3">${esc(t.result)}</textarea>
          <div><button class="btn outline sm">Save result</button></div></form></section>
      <section><h3>Changes in git</h3>${!ch ? '<p class="muted small">Looking for commits…</p>' : ch.error ? `<p class="err-line">${esc(ch.error)}</p>` : !ch.git ? '<p class="muted small">This project is not a git repository.</p>'
        : ch.commits.length ? `<ul class="commits">${ch.commits.map(c => `<li><div class="c-head"><span class="muted">${esc(c.date)}</span> ${c.url ? `<a href="${esc(c.url)}" target="_blank" rel="noopener"><code>${esc(c.short)}</code></a>` : `<code>${esc(c.short)}</code>`} ${esc(c.subject)}</div>${c.files.length ? `<ul class="files">${c.files.map(f => fileLink(c, f)).join('')}</ul>` : ''}</li>`).join('')}</ul>`
        : `<p class="muted small">No commit mentions ${esc(ch.ids.join(', '))} yet. Commits whose message names the task or its decision show up here, with the files they changed.</p>`}</section>
    </div></aside>`;
}
function taskCard(t) {
  const overdue = t.due && t.status !== 'done' && t.due < today();
  return `<button type="button" class="task" draggable="true" data-task="${esc(t.id)}" ${route().a === t.id ? 'aria-current="true"' : ''}>
    <span class="top"><span class="id">${esc(t.id)}</span>${t.status === 'review' ? '<span class="badge t-review">Review</span>' : ''}${t.due ? `<span class="badge due ${overdue ? 'overdue' : 'outline'}">${overdue ? 'Overdue ' : ''}${esc(t.due)}</span>` : ''}</span>
    <span class="title">${esc(t.title)}</span>
    ${t.deliverable ? `<span class="deliv">${code(t.deliverable)}</span>` : ''}
    ${t.result ? `<span class="deliv result">${icon('check', 'sm')}${code(t.result)}</span>` : ''}
    ${t.links.length ? `<span class="tags">${t.links.map(l => `<span class="badge outline">${esc(/^https?:/.test(l) ? (/figma/.test(l) ? 'Figma' : 'Link') : l.replace(/^feature:/, 'flow: '))}</span>`).join('')}</span>` : ''}
  </button>`;
}

// ---------- notes ----------
function renderNotes(r) {
  const setup = setupState();
  if (setup) return head('Notes', 'Meeting notes, research and ideas.') + setup;
  const q = ui.nq.toLowerCase();
  const list = S.notes.filter(n => !q || (n.title + ' ' + n.tags.join(' ') + ' ' + n.excerpt).toLowerCase().includes(q));
  let html = head('Notes', `${S.notes.length} notes in eggux/notes/. Turn a selected line into an Inbox request or a task.`,
    `<a class="btn outline" href="#/context">Context</a><button class="btn" type="button" data-act="new-note">${icon('plus')}New note</button>`);
  const cur = r.a && ui.note && ui.note.file === r.a ? ui.note : null;
  html += `<div class="notes"><div class="card"><div class="card-body" style="padding:12px"><label class="search" style="max-width:none"><span class="sr-only">Search notes</span>${icon('search')}<input class="input" id="nq" type="search" placeholder="Search notes" value="${esc(ui.nq)}"></label></div>
    ${list.length ? `<ul class="note-list">${list.map(n => `<li><a href="#/notes/${esc(n.file)}" ${r.a === n.file ? 'aria-current="true"' : ''}><div class="t">${esc(n.title)}</div><div class="x">${esc(n.date)}${n.tags.length ? ' · ' + esc(n.tags.join(', ')) : ''}${n.excerpt ? ' · ' + esc(n.excerpt) : ''}</div></a></li>`).join('')}</ul>`
      : `<div class="empty"><strong>${S.notes.length ? 'No notes match' : 'No notes yet'}</strong>${S.notes.length ? 'Try another word.' : 'Write meeting notes here; decisions go to the Inbox.'}</div>`}</div>
    <div class="card" id="editor">${cur ? editorHtml(cur) : r.a ? '<div class="empty">Loading note</div>' : `<div class="empty"><strong>Pick a note</strong>or create one.</div>`}</div></div>`;
  if (r.a && (!ui.note || ui.note.file !== r.a)) loadNote(r.a);
  return html;
}
function editorHtml(n) {
  const st = ui.noteConflict ? '<span class="status warn">Changed on disk. Reload to see the new version.</span>' : `<span class="status">${ui.noteSaving ? 'Saving' : ui.noteDirty ? 'Unsaved' : 'Saved to eggux/notes/' + esc(n.file)}</span>`;
  return `<div class="editor-head"><label class="sr-only" for="n-title">Title</label><input class="input title-input" id="n-title" value="${esc(n.title)}" placeholder="Title">
    <label class="sr-only" for="n-tags">Tags</label><input class="input" id="n-tags" value="${esc(n.tags)}" placeholder="Tags: meeting, client"></div>
    <div class="editor-bar"><div class="tabs" role="tablist" aria-label="Mode" style="margin:0"><button role="tab" type="button" aria-selected="${!ui.notePreview}" data-mode="edit">Write</button><button role="tab" type="button" aria-selected="${ui.notePreview}" data-mode="preview">Preview</button></div>
      <button class="btn outline sm" type="button" data-sel="inbox" ${ui.notePreview ? 'disabled' : ''}>${icon('inbox', 'sm')}Selection to Inbox</button>
      <button class="btn outline sm" type="button" data-sel="task" ${ui.notePreview ? 'disabled' : ''}>${icon('plus', 'sm')}Selection to task</button>
      ${ui.noteConflict ? '<button class="btn sm" type="button" data-act="reload-note">Reload</button>' : ''}${st}</div>
    ${ui.notePreview ? `<div class="prose">${md(n.body) || '<p class="muted">Empty note.</p>'}</div>` : `<label class="sr-only" for="n-body">Note</label><textarea class="note-body" id="n-body" placeholder="# Kickoff meeting&#10;&#10;- Who was there&#10;- What was decided&#10;- [ ] Follow-ups">${esc(n.body)}</textarea>`}`;
}
async function loadNote(file) {
  try { ui.note = await api('GET', '/api/notes/' + encodeURIComponent(file)); ui.noteDirty = false; ui.noteConflict = false; }
  catch (e) { toast(e.message, true); ui.note = null; }
  if (route().view === 'notes') { const ed = $('#editor'); if (ed && ui.note) ed.innerHTML = editorHtml(ui.note); }
}
let saveTimer = null;
function queueSave() {
  ui.noteDirty = true; setStatus();
  clearTimeout(saveTimer); saveTimer = setTimeout(saveNote, 700);
}
async function saveNote() {
  if (!ui.note || !ui.noteDirty || ui.noteConflict) return;
  ui.noteSaving = true; setStatus();
  const n = ui.note;
  try {
    const r = await api('PUT', '/api/notes/' + encodeURIComponent(n.file), { title: n.title, tags: n.tags, body: n.body, baseMtime: n.mtime });
    n.mtime = r.mtime; ui.noteDirty = false;
  } catch (e) { if (e.status === 409) ui.noteConflict = true; else toast(e.message, true); }
  ui.noteSaving = false; setStatus();
}
function setStatus() {
  const bar = $('.editor-bar'); if (!bar || !ui.note) return;
  const old = $('.status', bar);
  const tmp = document.createElement('div'); tmp.innerHTML = editorHtml(ui.note);
  const fresh = $('.status', tmp); if (old && fresh) old.replaceWith(fresh);
  if (ui.noteConflict && !$('[data-act="reload-note"]', bar)) { const b = $('[data-act="reload-note"]', tmp); if (b) $('.status', bar).before(b); }
}

// ---------- flows ----------
// Read-only view of eggux/features/<slug>/: the deliverable (handoff.md) first, then the source files.
const FLOW_TABS = [['handoff', 'Handoff'], ['feature', 'Spec'], ['scenarios', 'Scenarios'], ['workflows', 'Flows'], ['decisions', 'Decisions']];
function flowBadge(s) {
  const w = String(s || 'draft').toLowerCase();
  const cls = /verified|built|ready for dev/.test(w) ? 's-verified' : /review/.test(w) ? 's-applied' : /design|ready/.test(w) ? 's-approved' : 's-proposed';
  return `<span class="badge ${cls}">${esc(s || 'draft')}</span>`;
}
function renderFlows(r) {
  const setup = setupState();
  if (setup) return head('Flows', 'Features and their developer handoff.') + setup;
  const flows = S.flows || [];
  let html = head('Flows', `${flows.length} ${flows.length === 1 ? 'flow' : 'flows'} in <code>eggux/features/</code>. The handoff is what goes to the developers.`,
    `<button class="btn" type="button" data-w="new-flow">${icon('plus')}New flow</button>`);
  if (!flows.length) return html + `<div class="card"><div class="empty"><strong>No features yet</strong>Run <code>/eggux:new-feature</code> in Claude Code. Each feature gets a folder with its spec, scenarios, flows and a <code>handoff.md</code> for developers.</div></div>`;
  const cur = flows.find(f => f.slug === r.a) || flows[0];
  const file = FLOW_TABS.some(([k]) => k === r.b) && cur.files.includes(r.b) ? r.b : (cur.files.includes('handoff') ? 'handoff' : cur.files[0]);
  const key = cur.slug + '/' + file;
  const tasks = S.tasks.filter(t => (t.links || []).includes('feature:' + cur.slug));
  const groups = [...new Set(flows.map(f => f.group || ''))].sort((a, b) => (a === '') - (b === '') || a.localeCompare(b));
  const writing = f => S.work && S.work.working.includes('flow:' + f.slug);
  const item = f => `<li><a href="#/flows/${esc(f.slug)}" ${f.slug === cur.slug ? 'aria-current="true"' : ''}>
      <div class="t">${esc(f.name)}</div>
      <div class="x">${writing(f) ? 'Claude is drafting it' : `${f.scenarios} scenarios · ${f.edgeCases} edge cases${f.openQuestions ? ` · ${f.openQuestions} open questions` : ''}`}</div>
      <div class="flow-badges">${f.handoff ? `<span class="x">Handoff v${esc(f.handoff.version)}</span> ${flowBadge(f.handoff.status)}` : '<span class="badge outline">no handoff</span>'}</div></a></li>`;
  html += `<div class="notes"><div class="card">${groups.map(g => `${groups.length > 1 || g ? `<h3 class="list-title">${esc(g || 'No group')}</h3>` : ''}<ul class="note-list">${flows.filter(f => (f.group || '') === g).map(item).join('')}</ul>`).join('')}</div>
    <div class="card flow-card">
      <div class="flow-head"><div><h2>${esc(cur.name)}</h2>
        <div class="flow-meta">Spec ${flowBadge(cur.status)}${cur.handoff ? ` <span>Handoff v${esc(cur.handoff.version)}</span> ${flowBadge(cur.handoff.status)}` : ''}${cur.updated ? ` <span>Updated ${esc(cur.updated)}</span>` : ''}</div></div>
        <div class="row"><button class="btn ghost sm" type="button" data-act="flow-props" aria-expanded="${!!ui.flowProps}">${icon('pencil', 'sm')}Group and link</button>
          ${tasks.map(t => `<a class="badge outline" href="#/tasks/${esc(t.id)}" title="${esc(t.title)}">${esc(t.id)} · ${esc(t.status)}</a>`).join(' ')}</div></div>
      ${writing(cur) ? `<p class="drafting">${'<span class="spin" aria-hidden="true"></span>'}Claude is drafting this flow from your idea. The tabs fill in when it is done.</p>` : ''}
      ${S.work && S.work.errors['flow:' + cur.slug] && !writing(cur) ? `<p class="err-line" style="margin:0 20px 12px">${esc(S.work.errors['flow:' + cur.slug])}</p>` : ''}
      <form class="flow-props" id="flow-props" data-slug="${esc(cur.slug)}" ${ui.flowProps ? '' : 'hidden'}>
        <label><span>Group</span><input class="input" name="group" list="flow-groups" value="${esc(cur.group || '')}" placeholder="Account, Checkout…"></label>
        <datalist id="flow-groups">${groups.filter(Boolean).map(g => `<option value="${esc(g)}">`).join('')}</datalist>
        <label class="grow"><span>Figma link</span><input class="input" name="figma" type="url" value="${esc(cur.figma || '')}" placeholder="https://www.figma.com/design/…"></label>
        <button class="btn outline sm">Save</button></form>
      <div class="tab-row"><div class="tabs" role="tablist" aria-label="Feature files">${FLOW_TABS.filter(([k]) => cur.files.includes(k)).map(([k, l]) => `<a role="tab" href="#/flows/${esc(cur.slug)}/${k}" aria-selected="${k === file}">${l}</a>`).join('')}</div>
        ${cur.figma ? `<a class="btn outline sm" href="${esc(cur.figma)}" target="_blank" rel="noopener">${icon('figma', 'sm')}Figma</a>` : `<button class="btn ghost sm" type="button" data-act="flow-props">${icon('figma', 'sm')}Add Figma link</button>`}</div>
      ${ui.flowDoc && ui.flowDoc.key === key ? `<div class="prose">${['scenarios', 'decisions'].includes(file) ? accordion(ui.flowDoc.body) : md(ui.flowDoc.body)}</div><p class="file-path">eggux/features/${esc(cur.slug)}/${esc(file)}.md</p>` : '<div class="empty">Loading</div>'}
    </div></div>`;
  if (!ui.flowDoc || ui.flowDoc.key !== key || ui.flowDoc.sig !== S.flowSig) loadFlowDoc(cur.slug, file, key);
  return html;
}
// Each "### " block (a scenario, an edge case, a decision) becomes a collapsible row.
function accordion(src) {
  const parts = String(src || '').split(/^(?=#{2,3} )/m);
  return parts.map((p, i) => {
    if (!/^### /.test(p)) return md(p);
    const [h, ...rest] = p.split('\n');
    return `<details class="acc"><summary>${code(h.slice(4))}</summary><div class="acc-body">${md(rest.join('\n'))}</div></details>`;
  }).join('');
}
async function loadFlowDoc(slug, file, key) {
  if (ui.flowLoading === key) return;
  ui.flowLoading = key;
  const sig = S.flowSig;
  try { const d = await api('GET', `/api/flows/${encodeURIComponent(slug)}/${file}`); ui.flowDoc = { key, sig, body: d.body }; }
  catch (e) { ui.flowDoc = { key, sig, body: '_Could not read this file: ' + e.message + '_' }; }
  ui.flowLoading = null;
  if (route().view === 'flows') render();
}

// Minimal markdown for the preview: headings, lists, checkboxes, quotes, code, bold, italic, links.
function md(src) {
  const inline = s => esc(s).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>')
    .replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>').replace(/(^|\s)(https?:\/\/[^\s<]+)/g, '$1<a href="$2" target="_blank" rel="noopener">$2</a>');
  const out = []; let list = null, para = [], code = null;
  const flushP = () => { if (para.length) { out.push(`<p>${inline(para.join(' '))}</p>`); para = []; } };
  const flushL = () => { if (list) { out.push(`<${list.tag}${list.check ? ' class="check"' : ''}>${list.items.join('')}</${list.tag}>`); list = null; } };
  let table = null;
  const isRow = l => /^\s*\|.*\|\s*$/.test(l);
  const isSep = l => /^\s*\|[\s:|-]+\|\s*$/.test(l);
  const cells = l => l.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(c => c.trim());
  const flushT = () => {
    if (!table) return;
    const [h, ...rows] = table;
    out.push(`<div class="table-wrap"><table><thead><tr>${h.map(c => `<th>${inline(c)}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td>${inline(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`);
    table = null;
  };
  for (const line of String(src || '').split('\n')) {
    if (!code && isRow(line)) { flushP(); flushL(); if (isSep(line)) continue; (table = table || []).push(cells(line)); continue; }
    flushT();
    if (code) { if (/^```/.test(line)) { out.push(codeBlock(code)); code = null; } else code.push(line); continue; }
    if (/^```/.test(line)) { flushP(); flushL(); code = []; code.lang = line.slice(3).trim().toLowerCase(); continue; }
    let m;
    if ((m = /^(#{1,3}) (.*)$/.exec(line))) { flushP(); flushL(); out.push(`<h${m[1].length}>${inline(m[2])}</h${m[1].length}>`); continue; }
    if ((m = /^\s*[-*] \[( |x)\] (.*)$/i.exec(line))) { flushP(); if (!list || list.tag !== 'ul') { flushL(); list = { tag: 'ul', items: [], check: true }; } list.items.push(`<li><input type="checkbox" disabled ${m[1] !== ' ' ? 'checked' : ''} aria-label="${m[1] !== ' ' ? 'Done' : 'Open'}"> ${inline(m[2])}</li>`); continue; }
    if ((m = /^\s*[-*] (.*)$/.exec(line))) { flushP(); if (!list || list.tag !== 'ul') { flushL(); list = { tag: 'ul', items: [] }; } list.items.push(`<li>${inline(m[1])}</li>`); continue; }
    if ((m = /^\s*\d+\. (.*)$/.exec(line))) { flushP(); if (!list || list.tag !== 'ol') { flushL(); list = { tag: 'ol', items: [] }; } list.items.push(`<li>${inline(m[1])}</li>`); continue; }
    if ((m = /^> ?(.*)$/.exec(line))) { flushP(); flushL(); out.push(`<blockquote>${inline(m[1])}</blockquote>`); continue; }
    if (!line.trim()) { flushP(); flushL(); continue; }
    flushL(); para.push(line.trim());
  }
  if (code) out.push(codeBlock(code));
  flushP(); flushL(); flushT();
  return out.join('\n');
}
// Mermaid blocks become diagrams (mermaidPass runs after each render); the source stays as a fallback.
function codeBlock(lines) {
  const src = lines.join('\n');
  if (lines.lang === 'mermaid') return `<figure class="diagram" data-mermaid="${esc(src)}"><pre><code>${esc(src)}</code></pre></figure>`;
  return `<pre><code>${esc(src)}</code></pre>`;
}
let mermaidLib = null;
function loadMermaid() {
  if (!mermaidLib) mermaidLib = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/mermaid@11.4.1/dist/mermaid.min.js';
    s.onload = () => resolve(window.mermaid); s.onerror = () => { mermaidLib = null; reject(new Error('Mermaid did not load (offline?)')); };
    document.head.appendChild(s);
  });
  return mermaidLib;
}
let mermaidSeq = 0;
async function mermaidPass() {
  const figs = [...document.querySelectorAll('figure.diagram[data-mermaid]:not([data-done])')];
  if (!figs.length) return;
  let mm;
  try { mm = await loadMermaid(); } catch { return; } // keep the source visible
  const dark = document.documentElement.dataset.theme === 'dark' || (!document.documentElement.dataset.theme && matchMedia('(prefers-color-scheme: dark)').matches);
  mm.initialize({ startOnLoad: false, securityLevel: 'strict', theme: dark ? 'dark' : 'neutral', fontFamily: 'inherit' });
  for (const f of figs) {
    f.dataset.done = '1';
    try { const { svg } = await mm.render('mmd-' + (++mermaidSeq), f.dataset.mermaid); f.innerHTML = svg + `<button class="btn outline sm diagram-full" type="button" data-diagram-full aria-label="Show this diagram full screen">${icon('expand', 'sm')}Full screen</button>`; }
    catch { f.dataset.error = '1'; } // invalid diagram: leave the source
  }
}

// ---------- render ----------
function head(title, sub, actions = '') {
  return `<div class="page-head"><div><h1>${esc(title)}</h1>${sub ? `<p>${sub}</p>` : ''}</div>${actions ? `<div class="actions">${actions}</div>` : ''}</div>`;
}
function render() {
  renderNav();
  if (!S) { $('#main').innerHTML = '<div class="empty">Loading</div>'; return; }
  const r = route();
  // Keep focus and caret on re-render (live updates while typing in a filter).
  const a = document.activeElement, id = a && a.id, s = a && a.selectionStart, e = a && a.selectionEnd;
  if (r.view === 'notes' && ui.note && r.a === ui.note.file && $('#n-body')) {
    // Live refresh must not wipe the note being typed: refresh only the list.
    const list = document.createElement('div'); list.innerHTML = renderNotes(r);
    const oldList = $('.notes > .card'); const newList = $('.notes > .card', list);
    if (oldList && newList) oldList.replaceWith(newList);
    $('.page-head').replaceWith($('.page-head', list));
  } else {
    const extra = window.WORK_VIEWS && window.WORK_VIEWS[r.view];
    $('#main').innerHTML = extra ? extra(r) : r.view === 'tasks' ? renderTasks(r) : r.view === 'notes' ? renderNotes(r) : r.view === 'flows' ? renderFlows(r) : renderDecisions(r);
  }
  if (id && document.getElementById(id) && document.getElementById(id) !== a) {
    const el = document.getElementById(id); el.focus({ preventScroll: true });
    try { if (s != null) el.setSelectionRange(s, e); } catch { /* not a text field */ }
  }
  mermaidPass();
}
async function load() {
  try { S = await api('GET', '/api/state'); render(); } catch (e) { toast('Board server unreachable: ' + e.message, true); }
}

// ---------- dialogs ----------
function fillSelect(sel, values, labels = {}) { sel.innerHTML = values.map(v => `<option value="${esc(v)}">${esc(labels[v] || v)}</option>`).join(''); }
function openDecision(prefill = {}) {
  const f = $('#decision-form'); f.reset();
  fillSelect(f.type, S.decisionTypes);
  fillSelect(f.source, sources(), { product: 'Product (decisions.md)' });
  for (const [k, v] of Object.entries(prefill)) if (f[k]) f[k].value = v;
  $('#decision-dlg-title').textContent = prefill.inboxRaw ? 'Record Inbox request' : 'New decision';
  $('#decision-dlg').showModal(); f.title.focus();
}
$('#decision-dlg').addEventListener('close', async () => {
  const dlg = $('#decision-dlg'); if (dlg.returnValue !== 'ok') return;
  const f = $('#decision-form'); const b = Object.fromEntries(new FormData(f));
  const r = await act(() => api('POST', '/api/decisions', b));
  if (r) { toast(`${r.id} recorded`); location.hash = `#/decisions/${b.source}/${r.id}`; }
});
function openTask(t, prefill = {}) {
  const f = $('#task-form'); f.reset();
  fillSelect(f.status, S.taskStatuses, STATUS_LABEL); fillSelect(f.stage, S.stages, STAGE_LABEL);
  f.stage.value = ui.tStage || 'design';
  if (t) { f.id.value = t.id; f.title.value = t.title; f.status.value = t.status; f.stage.value = t.stage || 'design'; f.deliverable.value = t.deliverable; f.links.value = t.links.join(', '); f.due.value = t.due; f.notes.value = t.notes; }
  for (const [k, v] of Object.entries(prefill)) if (f[k]) f[k].value = v;
  $('#task-dlg-title').textContent = t ? `${t.id} · Edit task` : 'New task';
  $('#task-ok').textContent = t ? 'Save task' : 'Add task';
  $('#task-dlg').showModal(); f.title.focus();
}
$('#task-dlg').addEventListener('close', async () => {
  const dlg = $('#task-dlg'); const f = $('#task-form');
  if (dlg.returnValue !== 'ok') return;
  const b = Object.fromEntries(new FormData(f));
  const id = b.id; delete b.id;
  if (id) await act(() => api('PATCH', '/api/tasks/' + id, b), `${id} saved`);
  else { const r = await act(() => api('POST', '/api/tasks', b)); if (r) toast(`${r.id} added`); }
});

// ---------- events ----------
document.addEventListener('click', async ev => {
  const t = ev.target.closest('button, a'); if (!t) return;
  const d = t.dataset;
  if (d.act === 'new-decision') return openDecision();
  if (d.act === 'new-task') return openTask(null);
  if (d.act === 'new-note') {
    const r = await act(() => api('POST', '/api/notes', { title: 'Untitled note' }));
    if (r) { ui.note = null; location.hash = '#/notes/' + r.file; setTimeout(() => { const x = $('#n-title'); if (x) { x.focus(); x.select(); } }, 150); }
    return;
  }
  if (d.act === 'reload-note' && ui.note) { await loadNote(ui.note.file); return; }
  if (d.act === 'flow-props') { ui.flowProps = !ui.flowProps; render(); if (ui.flowProps) setTimeout(() => { const x = $('#flow-props input[name=figma]'); if (x) x.focus(); }, 30); return; }
  if (d.tab) { ui.dTab = d.tab; return render(); }
  if (d.dstatus) { ui.dStatus = d.dstatus; return render(); }
  if (d.openDecision) { location.hash = '#/decisions/' + d.openDecision; return; }
  if (d.record !== undefined) {
    const x = allInbox()[+d.record];
    if (x) openDecision({ title: x.text.length > 90 ? x.text.slice(0, 87) + '...' : x.text, decision: x.text, from: x.who, source: x.source, inboxRaw: x.raw });
    return;
  }
  if (d.dismiss !== undefined) {
    const x = allInbox()[+d.dismiss];
    if (x && confirm(`Remove this line from the Inbox without recording it?\n\n${x.text}`)) await act(() => api('DELETE', '/api/inbox', { source: x.source, raw: x.raw }), 'Removed from the Inbox');
    return;
  }
  if (d.taskFrom) { location.hash = '#/tasks'; setTimeout(() => openTask(null, { links: d.taskFrom, stage: 'design' }), 50); return; }
  if (d.stage) { ui.tStage = ui.tStage === d.stage ? '' : d.stage; return render(); }
  if (d.taskEdit) { const x = S.tasks.find(k => k.id === d.taskEdit); if (x) openTask(x); return; }
  if (d.task) { location.hash = '#/tasks/' + d.task; return; }
  if (d.mode) { ui.notePreview = d.mode === 'preview'; const ed = $('#editor'); if (ed && ui.note) ed.innerHTML = editorHtml(ui.note); return; }
  if (d.sel && ui.note) {
    const ta = $('#n-body'); const text = ta ? ta.value.slice(ta.selectionStart, ta.selectionEnd).trim().replace(/^[-*]\s*(\[.\]\s*)?/, '') : '';
    if (!text) return toast('Select a line in the note first', true);
    if (d.sel === 'inbox') await act(() => api('POST', '/api/inbox', { source: 'product', who: store.get('who', '') || 'me', text: `${text} (note: ${ui.note.file})` }), 'Added to the Inbox');
    else openTask(null, { title: text.slice(0, 140), links: 'note:' + ui.note.file });
  }
});
document.addEventListener('submit', async ev => {
  const f = ev.target;
  if (f.id === 'inbox-form') {
    ev.preventDefault();
    const who = $('#ib-who').value.trim(); store.set('who', who);
    const r = await act(() => api('POST', '/api/inbox', { source: $('#ib-src').value, who, text: $('#ib-text').value }), 'Added to the Inbox');
    if (r) setTimeout(() => { const x = $('#ib-text'); if (x) x.focus(); }, 50);
  }
  if (f.id === 'status-form') {
    ev.preventDefault();
    const [source, id] = f.dataset.key.split('/');
    await act(() => api('PATCH', '/api/decisions/' + id, { source, status: $('#dd-status').value }), `${id} is ${$('#dd-status').value}`);
  }
  if (f.id === 'td-result') { ev.preventDefault(); await act(() => api('PATCH', '/api/tasks/' + f.dataset.id, { result: $('#td-res').value }), 'Result saved'); }
  if (f.id === 'term-form') {
    ev.preventDefault();
    await act(() => api('POST', '/api/terms', { use: $('#tm-use').value, dont: $('#tm-dont').value, context: $('#tm-ctx').value }), 'Term added');
  }
});
document.addEventListener('input', ev => {
  const t = ev.target;
  if (t.id === 'dq') { ui.dq = t.value; render(); }
  if (t.id === 'tq') { ui.tq = t.value; render(); }
  if (t.id === 'nq') { ui.nq = t.value; render(); }
  if (ui.note && ['n-title', 'n-tags', 'n-body'].includes(t.id)) { ui.note[{ 'n-title': 'title', 'n-tags': 'tags', 'n-body': 'body' }[t.id]] = t.value; queueSave(); }
});
document.addEventListener('change', ev => {
  if (ev.target.id === 'td-st') { const id = ev.target.closest('form').dataset.id; act(() => api('PATCH', '/api/tasks/' + id, { status: ev.target.value }), `${id} is ${STATUS_LABEL[ev.target.value]}`); }
  if (ev.target.id === 'dtype') { ui.dType = ev.target.value; render(); }
  if (ev.target.id === 'dsource') { ui.dSource = ev.target.value; render(); }
});
// Drag and drop between task columns (the edit dialog changes status from the keyboard).
let dragId = null;
document.addEventListener('dragstart', ev => { const c = ev.target.closest && ev.target.closest('.task'); if (!c) return; dragId = c.dataset.task; c.classList.add('dragging'); ev.dataTransfer.effectAllowed = 'move'; ev.dataTransfer.setData('text/plain', dragId); });
document.addEventListener('dragend', ev => { const c = ev.target.closest && ev.target.closest('.task'); if (c) c.classList.remove('dragging'); document.querySelectorAll('.col.drop').forEach(x => x.classList.remove('drop')); });
document.addEventListener('dragover', ev => { const col = ev.target.closest && ev.target.closest('.col'); if (!col || !dragId) return; ev.preventDefault(); document.querySelectorAll('.col.drop').forEach(x => x !== col && x.classList.remove('drop')); col.classList.add('drop'); });
document.addEventListener('drop', async ev => {
  const col = ev.target.closest && ev.target.closest('.col'); if (!col || !dragId) return;
  ev.preventDefault(); col.classList.remove('drop');
  const id = dragId; dragId = null;
  const t = S.tasks.find(x => x.id === id);
  if (t && t.status !== col.dataset.col) await act(() => api('PATCH', '/api/tasks/' + id, { status: col.dataset.col }), `${id} moved to ${STATUS_LABEL[col.dataset.col]}`);
});
window.addEventListener('beforeunload', ev => { if (ui.noteDirty) { saveNote(); ev.preventDefault(); } });

// ---------- theme ----------
const THEMES = ['system', 'light', 'dark'];
function applyTheme(t) {
  if (t === 'system') document.documentElement.removeAttribute('data-theme'); else document.documentElement.dataset.theme = t;
  const next = THEMES[(THEMES.indexOf(t) + 1) % 3];
  $('#theme-btn').innerHTML = `${icon(t === 'dark' ? 'moon' : t === 'light' ? 'sun' : 'monitor')}<span class="lbl">${t[0].toUpperCase() + t.slice(1)}</span>`;
  $('#theme-btn').setAttribute('aria-label', `Theme: ${t}. Switch to ${next}`);
}
let theme = store.get('theme', 'system'); applyTheme(theme);
$('#theme-btn').addEventListener('click', () => { theme = THEMES[(THEMES.indexOf(theme) + 1) % 3]; store.set('theme', theme); applyTheme(theme); });

// ---------- live updates ----------
function connect() {
  const es = new EventSource('/api/events');
  es.addEventListener('open', () => { const l = $('#live'); l.className = 'live'; l.textContent = 'Live: files in eggux/'; });
  es.addEventListener('change', async () => {
    await load();
    // A note open in the editor changed on disk (Claude or another editor): reload it if clean.
    if (ui.note && route().view === 'notes') {
      const meta = S.notes.find(n => n.file === ui.note.file);
      if (meta && Math.abs(meta.mtime - ui.note.mtime) > 1 && !ui.noteSaving) { if (ui.noteDirty) { ui.noteConflict = true; setStatus(); } else loadNote(ui.note.file); }
    }
  });
  es.addEventListener('error', () => { const l = $('#live'); l.className = 'live off'; l.textContent = 'Reconnecting'; });
}
render(); load().then(connect);
