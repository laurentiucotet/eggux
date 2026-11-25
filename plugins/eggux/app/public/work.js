// Context, Documents, Understand and Decide views. Loaded after app.js and uses its helpers
// (S, ui, api, act, toast, esc, icon, head, md, route, render, setupState). The files stay the
// source of truth; Claude runs through the local `claude` command when asked.
'use strict';

const W = () => (S && S.work) || { context: [], research: [], questions: [], docs: [], working: [], errors: {}, fieldTypes: ['text', 'long', 'list'], categories: [] };
const busy = key => W().working.includes(key);
const spin = `<span class="spin" aria-hidden="true"></span>`;
const enc = encodeURIComponent;
const wui = { cache: {}, editing: null, chooser: false, showDecided: false, rTab: 'findings', fFilter: 'all', tpl: null };

// Fetch a detail once per state load (S changes on every file change).
function cached(key, url) {
  const c = wui.cache[key];
  if (c && c.S === S) return c.data;
  if (!c || !c.loading) {
    wui.cache[key] = { ...(c || {}), loading: true };
    api('GET', url).then(d => { wui.cache[key] = { S, data: d }; render(); })
      .catch(e => { wui.cache[key] = { S, data: { error: e.message } }; render(); });
  }
  return c ? c.data : null;
}
const empty = (title, text) => `<div class="empty"><strong>${title}</strong>${text || ''}</div>`;
const SEC_ICON = { 'actors.md': 'users', 'stakeholders.md': 'users', 'objects.md': 'box', 'workflows.md': 'flows', 'brand.md': 'palette' };
const PRESETS = {
  Actors: [['Name'], ['Who', 'long'], ['Goals', 'list', 3], ['Constraints', 'list', 3]],
  Stakeholders: [['Name and role'], ['Goals', 'list', 3], ['Constraints', 'list', 3], ['Approves']],
  Screens: [['Screen'], ['Purpose', 'long'], ['Actors', 'list'], ['Figma or Storybook link']],
  Competitors: [['Name'], ['What they do well', 'list'], ['Where they fall short', 'list'], ['Link']],
  Constraints: [['Constraint'], ['Details', 'long']],
};

// ---------- Context ----------
function renderContext(r) {
  const setup = setupState(); if (setup) return head('Context', '') + setup;
  const secs = W().context;
  const terms = r.a === 'terminology';
  const cur = terms ? null : secs.find(s => s.id === r.a) || secs[0];
  let html = head('Context', 'The project context: one set of sections for the whole project. Understand, Decide and the skills read it.',
    `<button class="btn" type="button" data-w="toggle-chooser">${icon('plus')}New section</button>`);
  if (wui.chooser) html += `<div class="card card-body chooser">
      <p class="muted" style="margin:0 0 10px">Start from a template or from scratch. It becomes <code>eggux/context/&lt;name&gt;.md</code>.</p>
      <div class="row" style="margin-bottom:10px">${Object.keys(PRESETS).filter(p => !secs.some(s => s.name === p)).map(p => `<button class="btn outline sm" type="button" data-w="preset" data-name="${esc(p)}">${esc(p)}</button>`).join('')}</div>
      <form class="row" id="w-newsec"><label class="sr-only" for="w-secname">Section name</label><input class="input" id="w-secname" placeholder="Another section, e.g. Pricing rules" style="flex:1;min-width:200px"><button class="btn outline">Create empty</button></form></div>`;
  const sec = cur ? cached('ctx:' + cur.id, '/api/context/' + enc(cur.id)) : null;
  const nTerms = S.decisions.product ? S.decisions.product.terminology.length : 0;
  html += `<div class="notes"><div class="card"><ul class="note-list">${secs.map(s => `<li><a href="#/context/${enc(s.id)}" ${cur && s.id === cur.id ? 'aria-current="true"' : ''}>
      <div class="t">${esc(s.name)}</div>
      <div class="x">${s.kind === 'document' ? 'Document' : `${s.count} ${s.count === 1 ? 'entry' : 'entries'} · ${s.fields} fields`}${s.suggested ? ` · ${s.suggested} to review` : ''}</div></a></li>`).join('')}
      <li class="sep"><a href="#/context/terminology" ${terms ? 'aria-current="true"' : ''}><div class="t">Terminology</div><div class="x">${nTerms} terms · words to use and to avoid</div></a></li>
      <li><a href="#/notes"><div class="t">Notes</div><div class="x">${S.notes.length} notes · meetings, research, ideas</div></a></li></ul></div>
    <div class="card flow-card">${terms ? termsPanel() : !cur ? empty('No sections yet', 'Add one with New section, or run <code>/eggux:init</code>.') : sec ? sectionDetail(cur, sec) : '<div class="empty">Loading</div>'}</div></div>`;
  return html;
}
function termsPanel() {
  if (!S.decisions.product) return empty('No decisions.md yet', 'Terminology lives in <code>eggux/decisions.md</code>; run <code>/eggux:init</code>.');
  return `<div class="flow-head"><div><h2>Terminology</h2><div class="flow-meta">The words the product uses, and the ones it avoids. Stored in <code>eggux/decisions.md</code>.</div></div></div>${renderTerms()}`;
}
function sectionDetail(meta, sec) {
  if (sec.error) return empty('Could not read this section', esc(sec.error));
  const file = `<p class="file-path">eggux/${esc(sec.id)}</p>`;
  if (sec.kind === 'document') return `<div class="flow-head"><div><h2>${esc(sec.name)}</h2><div class="flow-meta">A document section, written as free text.</div></div>
      ${wui.editDoc === sec.id ? '' : `<button class="btn outline sm" type="button" data-w="edit-doc" data-id="${esc(sec.id)}">${icon('pencil', 'sm')}Edit</button>`}</div>
    ${wui.editDoc === sec.id ? `<form class="card-body stack" id="w-doc" data-id="${esc(sec.id)}" style="gap:10px"><label class="sr-only" for="w-doc-body">${esc(sec.name)}</label>
      <textarea class="input doc-edit" id="w-doc-body" rows="22">${esc(sec.body.replace(/^\n+/, ''))}</textarea>
      <div class="row" style="justify-content:flex-end"><button class="btn outline sm" type="button" data-w="cancel-doc">Cancel</button><button class="btn sm">${icon('check', 'sm')}Save</button></div></form>`
      : `<div class="prose">${md(sec.body)}</div>`}${file}`;
  const err = W().errors['entry:' + sec.id];
  const asking = busy('entry:' + sec.id);
  return `<div class="flow-head"><div><h2>${esc(sec.name)}</h2><div class="flow-meta">Fields: ${sec.fields.map(f => esc(f.label) + (f.type === 'list' ? ' (list)' : '')).join(' · ')}</div></div>
      <div class="row"><button class="btn outline sm" type="button" data-w="template" data-id="${esc(sec.id)}">${icon('sliders', 'sm')}Edit template</button>
      ${sec.custom ? `<button class="btn ghost sm danger" type="button" data-w="del-section" data-id="${esc(sec.id)}">${icon('trash', 'sm')}Delete</button>` : ''}</div></div>
    <div class="card-body" style="padding-top:0">
      <form class="row ask" id="w-ask" data-id="${esc(sec.id)}">
        <button class="btn sm" type="button" data-w="new-entry">${icon('plus', 'sm')}Add</button>
        <label class="sr-only" for="w-asktext">Ask Claude</label>
        <input class="input" id="w-asktext" placeholder="Ask Claude, e.g. “an actor for corporate buyers”" style="flex:1;min-width:200px">
        <button class="btn outline sm" ${asking ? 'disabled' : ''}>${asking ? spin : icon('sparkles', 'sm')}Ask Claude</button>
      </form>
      ${err && !asking ? `<p class="err-line">${esc(err)}</p>` : ''}
      <div class="entries">
        ${wui.editing === 'new' ? entryForm(sec, null) : ''}
        ${sec.entries.map(e => wui.editing === e.index ? entryForm(sec, e) : entryCard(sec, e)).join('')}
        ${!sec.entries.length && wui.editing !== 'new' ? empty('No entries yet', 'Add one, or ask Claude.') : ''}
      </div>
    </div>${file}`;
}
function fieldView(f, v) {
  if (Array.isArray(v)) return v.length ? `<ul>${v.map(x => `<li>${code(x)}</li>`).join('')}</ul>` : '<span class="muted">empty</span>';
  return v ? code(v) : '<span class="muted">empty</span>';
}
function entryCard(sec, e) {
  const rest = sec.fields.slice(1).filter(f => e.values[f.label] != null);
  return `<article class="entry ${e.suggested ? 'suggested' : ''}">
    <div class="entry-head"><h3>${esc(e.title)}</h3>
      ${e.suggested ? `<span class="badge s-applied">${icon('sparkles', 'sm')}Suggested by Claude</span><button class="btn outline sm" type="button" data-w="keep" data-i="${e.index}">${icon('check', 'sm')}Keep</button>` : ''}
      <button class="btn ghost icon sm" type="button" data-w="edit" data-i="${e.index}" aria-label="Edit ${esc(e.title)}">${icon('pencil', 'sm')}</button>
      <button class="btn ghost icon sm" type="button" data-w="del-entry" data-i="${e.index}" aria-label="Delete ${esc(e.title)}">${icon('trash', 'sm')}</button></div>
    ${rest.length ? `<dl>${rest.map(f => `<dt>${esc(f.label)}</dt><dd>${fieldView(f, e.values[f.label])}</dd>`).join('')}</dl>` : ''}
  </article>`;
}
function entryForm(sec, e) {
  return `<form class="entry editing" id="w-entry" data-i="${e ? e.index : ''}">
    ${sec.fields.map((f, i) => {
      const v = e ? (i === 0 ? e.title : e.values[f.label]) : '';
      const id = 'w-f-' + i;
      const hint = f.type === 'list' ? ` <span class="muted">· one per line${f.max ? ', at most ' + f.max : ''}</span>` : '';
      const input = f.type === 'text' ? `<input class="input" id="${id}" data-label="${esc(f.label)}" value="${esc(Array.isArray(v) ? v.join(', ') : v || '')}" ${i === 0 ? 'required' : ''}>`
        : `<textarea class="input" id="${id}" data-label="${esc(f.label)}" data-list="${f.type === 'list' ? 1 : ''}" rows="${f.type === 'list' ? 3 : 2}">${esc(Array.isArray(v) ? v.join('\n') : v || '')}</textarea>`;
      return `<label class="field" for="${id}"><span>${esc(f.label)}${hint}</span>${input}</label>`;
    }).join('')}
    <div class="row" style="justify-content:flex-end"><button class="btn outline sm" type="button" data-w="cancel-entry">Cancel</button><button class="btn sm">${icon('check', 'sm')}Save</button></div>
  </form>`;
}

// ---------- Template dialog ----------
function openTemplate(sec) {
  wui.tpl = { id: sec.id, name: sec.name, fields: sec.fields.map(f => ({ ...f, from: f.label })) };
  drawTemplate(); $('#work-dlg').showModal();
}
function drawTemplate() {
  const t = wui.tpl;
  $('#work-dlg').innerHTML = `<form method="dialog" id="w-tpl-form">
    <div class="dlg-head"><h2>Template: ${esc(t.name)}</h2><button class="btn ghost icon sm" value="cancel" formnovalidate aria-label="Close">${icon('x')}</button></div>
    <div class="dlg-body">
      <label class="field"><span>Section name</span><input class="input" id="w-tpl-name" value="${esc(t.name)}"></label>
      <div class="field"><span>Fields. The first one is the entry title.</span></div>
      <div class="tpl-fields">${t.fields.map((f, i) => `<div class="tpl-row">
        <span class="muted">${i + 1}</span>
        <input class="input" data-tf="${i}" value="${esc(f.label)}" aria-label="Field name">
        <select class="input" data-tt="${i}" aria-label="Field type">${W().fieldTypes.map(x => `<option value="${x}" ${f.type === x ? 'selected' : ''}>${({ text: 'Short text', long: 'Long text', list: 'List' })[x]}</option>`).join('')}</select>
        ${f.type === 'list' ? `<input class="input" type="number" min="0" data-tm="${i}" value="${f.max || ''}" placeholder="max" aria-label="Maximum items" style="width:72px">` : '<span></span>'}
        <button class="btn ghost icon sm" type="button" data-w="tpl-up" data-i="${i}" ${i ? '' : 'disabled'} aria-label="Move up">${icon('up', 'sm')}</button>
        <button class="btn ghost icon sm" type="button" data-w="tpl-del" data-i="${i}" ${t.fields.length > 1 ? '' : 'disabled'} aria-label="Delete field">${icon('trash', 'sm')}</button></div>`).join('')}</div>
      <button class="btn outline sm" type="button" data-w="tpl-add">${icon('plus', 'sm')}Field</button>
    </div>
    <div class="dlg-foot"><button class="btn outline" value="cancel" formnovalidate>Cancel</button><button class="btn" value="ok">Save template</button></div></form>`;
}

// ---------- Documents ----------
function renderDocs() {
  const setup = setupState(); if (setup) return head('Documents', '') + setup;
  const docs = W().docs;
  const size = n => n > 1e6 ? (n / 1e6).toFixed(1) + ' MB' : Math.max(1, Math.round(n / 1e3)) + ' KB';
  return head('Documents', 'Files in <code>eggux/docs/</code>. Claude reads each one and suggests entries in your Context sections, which you review there.') +
    `<div class="card card-body"><label class="dropzone" id="w-drop" for="w-file">${icon('upload')}<span><strong>Drop documents here</strong> or click to choose · PDF, images, text, CSV · up to 10 MB</span></label>
      <input type="file" id="w-file" multiple hidden></div>
    <div class="card">${docs.length ? `<div class="table-wrap"><table class="terms"><thead><tr><th>Document</th><th>Size</th><th>Went to</th><th>Status</th><th><span class="sr-only">Actions</span></th></tr></thead><tbody>${docs.map(d => {
      const st = busy('doc:' + d.name) ? `<span class="badge s-approved">${spin}Claude is reading</span>` : d.status === 'error' ? `<span class="badge overdue" title="${esc(d.error)}">Error</span>` : d.status === 'done' ? '<span class="badge s-verified">Read</span>' : '<span class="badge s-superseded">Not read</span>';
      return `<tr><td><strong>${esc(d.name)}</strong>${d.status === 'error' ? `<div class="muted small">${esc(d.error)}</div>` : ''}</td><td class="muted">${size(d.size)}</td>
        <td>${d.to.length ? d.to.map(x => `<span class="badge outline">${esc(x)}</span>`).join(' ') : '<span class="muted">nothing yet</span>'}</td><td>${st}</td>
        <td class="row" style="justify-content:flex-end"><button class="btn ghost sm" type="button" data-w="doc-read" data-name="${esc(d.name)}" ${busy('doc:' + d.name) ? 'disabled' : ''}>${icon('sparkles', 'sm')}Read again</button>
        <button class="btn ghost icon sm" type="button" data-w="doc-del" data-name="${esc(d.name)}" aria-label="Delete ${esc(d.name)}">${icon('trash', 'sm')}</button></td></tr>`; }).join('')}</tbody></table></div>`
      : empty('No documents yet', 'Briefs, interview notes, brand books, analytics exports.')}</div>`;
}
function uploadFiles(files) {
  [...files].forEach(f => {
    if (f.size > 10e6) return toast(`${f.name} is larger than 10 MB`, true);
    const rd = new FileReader();
    rd.onload = () => act(() => api('POST', '/api/docs', { name: f.name, data: String(rd.result).split(',')[1] || '' }), `${f.name} uploaded. Claude is reading it.`);
    rd.readAsDataURL(f);
  });
}

// ---------- Understand ----------
function renderUnderstand(r) {
  const setup = setupState(); if (setup) return head('Understand', '') + setup;
  const list = W().research;
  const cur = list.find(x => x.slug === r.a) || list[0];
  let html = head('Understand', 'What you want to learn. Claude researches it with the project context and lists the findings; accepted findings become questions in Decide.');
  html += `<div class="notes"><div class="card"><form class="card-body row" id="w-newres"><label class="sr-only" for="w-restitle">New research</label>
      <input class="input" id="w-restitle" placeholder="Research checkout patterns on mobile" style="flex:1;min-width:0"><button class="btn sm">${icon('sparkles', 'sm')}Ask Claude</button></form>
    ${list.length ? `<ul class="note-list">${list.map(x => `<li><a href="#/understand/${esc(x.slug)}" ${cur && x.slug === cur.slug ? 'aria-current="true"' : ''}><div class="t">${esc(x.title)}</div>
      <div class="x">${x.status === 'running' ? 'Claude is working' : x.status === 'error' ? 'Error' : `${esc(x.kind)} · ${x.findings} findings${x.accepted ? `, ${x.accepted} accepted` : ''}`}</div></a></li>`).join('')}</ul>` : empty('No research yet', 'Ask Claude above.')}</div>
    <div class="card flow-card">${cur ? researchDetail(cur) : empty('Pick a research', '')}</div></div>`;
  return html;
}
function researchDetail(meta) {
  const r = cached('res:' + meta.slug, '/api/research/' + meta.slug);
  if (!r) return '<div class="empty">Loading</div>';
  if (r.error && !r.title) return empty('Could not read it', esc(r.error));
  const working = r.status === 'running' || busy('research:' + r.slug);
  let items = r.findings;
  if (wui.fFilter !== 'all') items = items.filter(f => f.vote === wui.fFilter);
  const head2 = `<div class="flow-head"><div><h2>${esc(r.title)}</h2><div class="flow-meta">${working ? `<span class="badge s-approved">${spin}Claude is working</span>` : r.status === 'error' ? '<span class="badge overdue">Error</span>' : `<span>${esc(r.kind)}</span>`}${r.created ? `<span>Created ${esc(r.created)}</span>` : ''}</div></div>
    <div class="row">${r.status === 'error' ? `<button class="btn sm" type="button" data-w="res-retry" data-slug="${esc(r.slug)}">Try again</button>` : ''}
    <button class="btn ghost icon sm" type="button" data-w="res-del" data-slug="${esc(r.slug)}" aria-label="Delete research">${icon('trash', 'sm')}</button></div></div>`;
  if (r.status === 'error') return head2 + `<div class="card-body"><p class="err-line">${esc(r.error)}</p></div>`;
  if (working && !r.findings.length) return head2 + `<div class="empty">${spin}Claude is researching. This usually takes a minute or two; the page updates by itself.</div>`;
  const tabs = `<div class="tabs" role="tablist" aria-label="Research views"><button role="tab" type="button" aria-selected="${wui.rTab === 'findings'}" data-w="rtab" data-tab2="findings">Findings · ${r.findings.length}</button><button role="tab" type="button" aria-selected="${wui.rTab === 'report'}" data-w="rtab" data-tab2="report">Full report</button></div>`;
  if (wui.rTab === 'report') return head2 + tabs + `<div class="prose">${md(r.report) || '<p class="muted">No report.</p>'}</div><p class="file-path">eggux/research/${esc(r.slug)}.md</p>`;
  const filters = `<div class="row" style="padding:0 20px 12px">${[['all', 'All'], ['open', 'Unvoted'], ['accepted', 'Accepted'], ['rejected', 'Rejected']].map(([k, l]) => `<button class="btn ${wui.fFilter === k ? '' : 'outline'} sm" type="button" data-w="ffilter" data-f="${k}">${l}</button>`).join('')}</div>`;
  return head2 + tabs + filters + `<div class="card-body" style="padding-top:0"><div class="entries">${items.length ? items.map(f => `<article class="entry finding ${f.vote}">
      <div class="entry-head"><div style="flex:1;min-width:0"><h3>${esc(f.title)}</h3><div class="muted small">${esc(f.source)}${f.question ? ` · <a href="#/decide/${esc(f.question)}">${esc(f.question)} in Decide</a>` : ''}</div></div>
      <button class="btn ${f.vote === 'accepted' ? '' : 'outline'} icon sm" type="button" data-w="vote" data-slug="${esc(r.slug)}" data-fid="${f.id}" data-vote="${f.vote === 'accepted' ? 'open' : 'accepted'}" aria-pressed="${f.vote === 'accepted'}" aria-label="Accept, send to Decide">${icon('thumbup', 'sm')}</button>
      <button class="btn ${f.vote === 'rejected' ? 'danger-solid' : 'outline'} icon sm" type="button" data-w="vote" data-slug="${esc(r.slug)}" data-fid="${f.id}" data-vote="${f.vote === 'rejected' ? 'open' : 'rejected'}" aria-pressed="${f.vote === 'rejected'}" aria-label="Reject">${icon('thumbdown', 'sm')}</button></div></article>`).join('')
    : empty('Nothing here', '')}</div></div><p class="file-path">eggux/research/${esc(r.slug)}.md</p>`;
}

// ---------- Decide ----------
const TYPE_LABEL = { finding: 'From finding', unknown: 'Unknown', blindspot: 'Blindspot' };
const typeBadge = q => /^decided/.test(q.status) ? '<span class="badge s-verified">Decided</span>' : `<span class="badge ${q.type === 'blindspot' ? 'overdue' : q.type === 'finding' ? 's-applied' : 's-proposed'}">${TYPE_LABEL[q.type] || q.type}</span>`;
function renderDecide(r) {
  const setup = setupState(); if (setup) return head('Decide', '') + setup;
  const qs = W().questions;
  const open = qs.filter(q => !/^decided/.test(q.status)), done = qs.filter(q => /^decided/.test(q.status));
  const cur = qs.find(q => q.id === r.a) || open[0] || done[0];
  const row = q => `<li><a href="#/decide/${q.id}" ${cur && q.id === cur.id ? 'aria-current="true"' : ''}><div class="t">${esc(q.title)}</div><div class="x">${q.id} · ${/^decided/.test(q.status) ? esc(q.status) : q.preparing || q.status === 'preparing options' ? 'Claude is preparing options' : q.options.length + ' options'}</div><div class="flow-badges">${typeBadge(q)}</div></a></li>`;
  return head('Decide', 'Questions from accepted findings, unknowns and blindspots. Claude proposes options, you choose. A choice becomes a decision and a task.') +
    `<div class="notes"><div class="card">
      <form class="card-body stack" id="w-newq" style="gap:8px"><label class="sr-only" for="w-qtitle">New question</label><input class="input" id="w-qtitle" placeholder="What needs to be decided?">
        <div class="row"><select class="input" id="w-qtype" style="flex:1" aria-label="Type"><option value="unknown">Unknown</option><option value="blindspot">Blindspot</option><option value="finding">From finding</option></select><button class="btn sm">${icon('sparkles', 'sm')}Get options</button></div></form>
      <h3 class="list-title">To decide · ${open.length}</h3>
      ${open.length ? `<ul class="note-list">${open.map(row).join('')}</ul>` : empty('Nothing to decide right now', '')}
      <button class="btn ghost sm list-toggle" type="button" data-w="toggle-decided" aria-expanded="${wui.showDecided}">${icon(wui.showDecided ? 'down' : 'right', 'sm')}Decided · ${done.length}</button>
      ${wui.showDecided ? `<ul class="note-list">${done.map(row).join('')}</ul>` : ''}
    </div><div class="card flow-card">${cur ? questionDetail(cur) : empty('Pick a question', '')}</div></div>`;
}
function questionDetail(q) {
  const decided = /^decided/.test(q.status);
  const chosen = decided ? (/^decided ([A-Z])/.exec(q.status) || [])[1] : '';
  const did = (/\((D-\d+)\)/.exec(q.status) || [])[1];
  const preparing = q.preparing || q.status === 'preparing options';
  return `<div class="flow-head"><div><h2>${esc(q.title)}</h2><div class="flow-meta">${typeBadge(q)}<span>Category: ${esc(q.category)}</span><span>${q.id}</span></div></div></div>
    <div class="card-body" style="padding-top:0">
      <p class="source-line"><strong>Source:</strong> ${q.source.startsWith('research:') ? `<a href="#/understand/${esc(q.source.split(' ')[0].slice(9))}">${esc(q.source)}</a>` : esc(q.source)}</p>
      ${q.error && !preparing ? `<p class="err-line">${esc(q.error)}</p>` : ''}
      ${preparing && !q.options.length ? `<div class="empty">${spin}Claude is preparing options.</div>` : `<div class="options">${q.options.map(o => `<article class="option ${o.by === 'you' ? 'mine' : ''} ${q.recommended === o.key && !decided ? 'recommended' : ''} ${chosen === o.key ? 'chosen' : chosen ? 'lost' : ''}" data-key="${o.key}">
        <div class="muted small">Option ${o.key}${q.recommended === o.key && !decided ? ' · <span class="rec">recommended by Claude</span>' : ''}${o.by === 'you' ? ' · your option' : ''}</div>
        <h3>${esc(o.title)}</h3>
        <ul>${o.pros.map(p => `<li class="pro">${esc(p)}</li>`).join('')}${o.cons.map(c => `<li class="con">${esc(c)}</li>`).join('')}</ul>
        ${decided ? '' : `<button class="btn sm" type="button" data-w="choose" data-id="${q.id}" data-key="${o.key}">${icon('check', 'sm')}Choose ${o.key}</button>`}</article>`).join('')}</div>`}
      ${decided ? `<p class="outcome">Decided: option ${chosen}. Logged as <a href="#/decisions/product/${esc(did)}">${esc(did)}</a>, with a task on the board.</p>`
        : `<div class="row"><button class="btn outline" type="button" data-w="my-option" data-id="${q.id}">${icon('bulb', 'sm')}My option</button>
           <button class="btn outline" type="button" data-w="another" data-id="${q.id}" ${preparing ? 'disabled' : ''}>${preparing ? spin : icon('sparkles', 'sm')}Ask for another option</button></div>`}
    </div><p class="file-path">eggux/questions.md</p>`;
}
function openMyOption(id) {
  const q = W().questions.find(x => x.id === id);
  $('#work-dlg').innerHTML = `<form method="dialog" id="w-opt-form" data-id="${esc(id)}">
    <div class="dlg-head"><h2>My option</h2><button class="btn ghost icon sm" value="cancel" formnovalidate aria-label="Close">${icon('x')}</button></div>
    <div class="dlg-body"><p class="muted" style="margin:0">${esc(q ? q.title : '')}</p>
      <label class="field"><span>Option</span><input class="input" name="title" required placeholder="Address on the same screen, collapsed"></label>
      <label class="field"><span>Pros, one per line</span><textarea class="input" name="pros" rows="3"></textarea></label>
      <label class="field"><span>Cons, one per line</span><textarea class="input" name="cons" rows="3"></textarea></label></div>
    <div class="dlg-foot"><button class="btn outline" value="cancel" formnovalidate>Cancel</button><button class="btn" value="ok">Add option</button></div></form>`;
  $('#work-dlg').showModal(); $('#work-dlg input[name=title]').focus();
}

// ---------- Flows: new flow ----------
function openNewFlow() {
  const groups = [...new Set((S.flows || []).map(f => f.group).filter(Boolean))];
  $('#work-dlg').innerHTML = `<form method="dialog" id="w-flow-form">
    <div class="dlg-head"><h2>New flow</h2><button class="btn ghost icon sm" value="cancel" formnovalidate aria-label="Close">${icon('x')}</button></div>
    <div class="dlg-body">
      <label class="field"><span>Name</span><input class="input" name="name" required placeholder="Register"></label>
      <label class="field"><span>Group (optional)</span><input class="input" name="group" list="w-flow-groups" placeholder="Account"><datalist id="w-flow-groups">${groups.map(g => `<option value="${esc(g)}">`).join('')}</datalist></label>
      <label class="field"><span>The idea, in a few lines</span><textarea class="input" name="idea" rows="4" placeholder="Shoppers can save their details as an account right after a guest checkout."></textarea><small>Claude uses it, with the project context, to draft the flows, scenarios and edge cases. Facts it cannot know become open questions.</small></label>
    </div>
    <div class="dlg-foot"><button class="btn outline" value="cancel" formnovalidate>Cancel</button><button class="btn outline" value="empty">Create empty</button><button class="btn" value="claude">${icon('sparkles', 'sm')}Draft with Claude</button></div></form>`;
  $('#work-dlg').showModal(); $('#work-dlg input[name=name]').focus();
}
let zoom = 1;
function openDiagram(fig) {
  const svg = fig.querySelector('svg'); if (!svg) return;
  const stage = $('#diagram-stage');
  stage.innerHTML = svg.outerHTML;
  zoom = 1; applyZoom();
  const dlg = $('#diagram-dlg'); dlg.showModal();
}
function applyZoom() {
  const s = $('#diagram-stage svg'); if (!s) return;
  s.removeAttribute('height'); s.style.maxWidth = 'none';
  s.style.width = zoom === 1 ? '100%' : (zoom * 100) + '%';
  s.style.height = zoom === 1 ? '100%' : 'auto';
}

// ---------- wiring ----------
window.WORK_VIEWS = { context: renderContext, docs: renderDocs, understand: renderUnderstand, decide: renderDecide };
document.body.insertAdjacentHTML('beforeend', '<dialog id="work-dlg" aria-label="Dialog"></dialog>');
const lines = s => String(s || '').split('\n').map(x => x.trim()).filter(Boolean);
const secId = () => decodeURIComponent((route().a) || '') || (W().context[0] || {}).id;

document.addEventListener('click', async ev => {
  const t = ev.target.closest('[data-w]'); if (!t) return;
  const d = t.dataset;
  const id = secId();
  switch (d.w) {
    case 'toggle-chooser': wui.chooser = !wui.chooser; return render();
    case 'preset': { const r = await act(() => api('POST', '/api/context', { name: d.name, fields: PRESETS[d.name].map(([label, type, max]) => ({ label, type, max })) }), `${d.name} added`); if (r) { wui.chooser = false; location.hash = '#/context/' + enc(r.id); } return; }
    case 'new-entry': wui.editing = 'new'; render(); setTimeout(() => { const x = $('#w-f-0'); if (x) x.focus(); }, 30); return;
    case 'cancel-entry': wui.editing = null; return render();
    case 'edit': wui.editing = +d.i; return render();
    case 'keep': return act(() => api('PUT', `/api/context/${enc(id)}/entries/${d.i}`, { suggested: false }), 'Kept');
    case 'del-entry': if (confirm('Delete this entry?')) await act(() => api('DELETE', `/api/context/${enc(id)}/entries/${d.i}`), 'Entry deleted'); return;
    case 'template': { const sec = wui.cache['ctx:' + d.id] && wui.cache['ctx:' + d.id].data; if (sec) openTemplate(sec); return; }
    case 'del-section': if (confirm('Delete this section and all its entries? The file eggux/' + d.id + ' is removed.')) { await act(() => api('DELETE', '/api/context/' + enc(d.id)), 'Section deleted'); location.hash = '#/context'; } return;
    case 'tpl-add': wui.tpl.fields.push({ label: 'New field', type: 'text' }); return drawTemplate();
    case 'tpl-del': wui.tpl.fields.splice(+d.i, 1); return drawTemplate();
    case 'tpl-up': { const i = +d.i, f = wui.tpl.fields; [f[i - 1], f[i]] = [f[i], f[i - 1]]; return drawTemplate(); }
    case 'doc-read': return act(() => api('POST', `/api/docs/${enc(d.name)}/read`), 'Claude is reading it');
    case 'doc-del': if (confirm(`Delete ${d.name}?`)) await act(() => api('DELETE', '/api/docs/' + enc(d.name)), 'Document deleted'); return;
    case 'rtab': wui.rTab = d.tab2; return render();
    case 'ffilter': wui.fFilter = d.f; return render();
    case 'vote': { const r = await act(() => api('PATCH', `/api/research/${d.slug}/findings/${d.fid}`, { vote: d.vote })); if (r && r.question) toast(`Accepted. ${r.question} is now a question in Decide.`); return; }
    case 'res-retry': return act(() => api('POST', `/api/research/${d.slug}/retry`), 'Asked Claude again');
    case 'res-del': if (confirm('Delete this research and its findings?')) { await act(() => api('DELETE', '/api/research/' + d.slug), 'Deleted'); location.hash = '#/understand'; } return;
    case 'toggle-decided': wui.showDecided = !wui.showDecided; return render();
    case 'choose': { const r = await act(() => api('POST', `/api/questions/${d.id}/choose`, { key: d.key })); if (r) toast(`${r.decision} logged, ${r.task} added to the board`); return; }
    case 'another': return act(() => api('POST', `/api/questions/${d.id}/another`), 'Claude is looking for another option');
    case 'my-option': return openMyOption(d.id);
    case 'new-flow': return openNewFlow();
    case 'edit-doc': wui.editDoc = d.id; return render();
    case 'cancel-doc': wui.editDoc = null; return render();
  }
});
document.addEventListener('submit', async ev => {
  const f = ev.target;
  if (f.id === 'w-newsec') { ev.preventDefault(); const name = $('#w-secname').value.trim(); if (!name) return toast('Enter a name', true);
    const r = await act(() => api('POST', '/api/context', { name }), `${name} added`); if (r) { wui.chooser = false; location.hash = '#/context/' + enc(r.id); setTimeout(() => { const s = wui.cache['ctx:' + r.id]; if (s && s.data) openTemplate(s.data); }, 600); } }
  if (f.id === 'w-ask') { ev.preventDefault(); await act(() => api('POST', `/api/context/${enc(f.dataset.id)}/suggest`, { hint: $('#w-asktext').value }), 'Claude is writing a suggestion'); }
  if (f.id === 'w-entry') {
    ev.preventDefault();
    const sec = wui.cache['ctx:' + secId()] && wui.cache['ctx:' + secId()].data; if (!sec) return;
    const values = {}; let title = '';
    f.querySelectorAll('[data-label]').forEach((el, i) => { const v = el.dataset.list ? lines(el.value) : el.value.trim(); if (i === 0) title = v; else values[el.dataset.label] = v; });
    if (!title) return toast('Fill in the first field', true);
    const i = f.dataset.i;
    const ok = await act(() => i === '' ? api('POST', `/api/context/${enc(sec.id)}/entries`, { title, values }) : api('PUT', `/api/context/${enc(sec.id)}/entries/${i}`, { title, values, suggested: false }), 'Saved');
    if (ok) { wui.editing = null; render(); }
  }
  if (f.id === 'w-doc') { ev.preventDefault(); const ok = await act(() => api('PUT', `/api/context/${enc(f.dataset.id)}/document`, { body: $('#w-doc-body').value }), 'Saved'); if (ok) { wui.editDoc = null; render(); } }
  if (f.id === 'flow-props') { ev.preventDefault(); const b = Object.fromEntries(new FormData(f)); const ok = await act(() => api('PATCH', '/api/flows/' + f.dataset.slug, b), 'Saved'); if (ok) { ui.flowProps = false; render(); } }
  if (f.id === 'w-newres') { ev.preventDefault(); const title = $('#w-restitle').value.trim(); if (!title) return toast('Write what you want to learn', true);
    const r = await act(() => api('POST', '/api/research', { title }), 'Sent to Claude'); if (r) location.hash = '#/understand/' + r.slug; }
  if (f.id === 'w-newq') { ev.preventDefault(); const title = $('#w-qtitle').value.trim(); if (!title) return toast('Write the question', true);
    const r = await act(() => api('POST', '/api/questions', { title, type: $('#w-qtype').value }), 'Claude is preparing options'); if (r) location.hash = '#/decide/' + r.id; }
});
$('#work-dlg').addEventListener('close', async () => {
  const dlg = $('#work-dlg');
  const ffm = $('#w-flow-form', dlg);
  if (ffm && ['empty', 'claude'].includes(dlg.returnValue)) {
    const b = Object.fromEntries(new FormData(ffm));
    if (!String(b.name || '').trim()) return toast('Name the flow', true);
    const r = await act(() => api('POST', '/api/flows', { ...b, withClaude: dlg.returnValue === 'claude' }), dlg.returnValue === 'claude' ? 'Claude is drafting the flow' : 'Flow created');
    if (r) location.hash = '#/flows/' + r.slug;
    return;
  }
  if (dlg.returnValue !== 'ok') return;
  const tf = $('#w-tpl-form', dlg), of = $('#w-opt-form', dlg), ff = $('#w-flow-form', dlg);
  if (tf) await act(() => api('PUT', `/api/context/${enc(wui.tpl.id)}/template`, { name: $('#w-tpl-name').value, fields: wui.tpl.fields }), 'Template saved');
  if (of) { const b = Object.fromEntries(new FormData(of)); await act(() => api('POST', `/api/questions/${of.dataset.id}/options`, { title: b.title, pros: lines(b.pros), cons: lines(b.cons) }), 'Your option was added'); }
});
document.addEventListener('change', ev => {
  const el = ev.target;
  if (el.id === 'w-file' && el.files.length) uploadFiles(el.files);
  if (!wui.tpl) return;
  if (el.dataset.tf !== undefined) wui.tpl.fields[+el.dataset.tf].label = el.value.trim() || 'Field';
  if (el.dataset.tt !== undefined) { wui.tpl.fields[+el.dataset.tt].type = el.value; drawTemplate(); }
  if (el.dataset.tm !== undefined) wui.tpl.fields[+el.dataset.tm].max = parseInt(el.value, 10) || undefined;
});
document.addEventListener('dragover', ev => { const z = ev.target.closest && ev.target.closest('#w-drop'); if (z) { ev.preventDefault(); z.classList.add('over'); } });
document.addEventListener('dragleave', ev => { const z = ev.target.closest && ev.target.closest('#w-drop'); if (z) z.classList.remove('over'); });
document.addEventListener('drop', ev => { const z = ev.target.closest && ev.target.closest('#w-drop'); if (z) { ev.preventDefault(); z.classList.remove('over'); uploadFiles(ev.dataTransfer.files); } });
window.addEventListener('hashchange', () => { wui.editing = null; });
document.addEventListener('click', ev => {
  const full = ev.target.closest('[data-diagram-full]'); if (full) return openDiagram(full.closest('figure'));
  const z = ev.target.closest('[data-zoom]'); if (z) { const v = +z.dataset.zoom; zoom = v === 0 ? 1 : Math.max(1, Math.min(4, zoom + v * 0.5)); return applyZoom(); }
  if (ev.target.closest('[data-diagram-close]')) return $('#diagram-dlg').close();
  const fig = ev.target.closest('.prose figure.diagram[data-done]'); if (fig && !ev.target.closest('button')) openDiagram(fig);
});
