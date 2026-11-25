// Runs Claude Code headless (`claude -p`) for the board: research, options, suggested entries.
// Uses the person's own Claude Code sign-in, so no API key is needed. Read-only tools only:
// the board writes the files itself from the JSON Claude returns.
'use strict';
const { spawn } = require('child_process');

const BIN = process.env.EGGUX_CLAUDE_BIN || 'claude';

class ClaudeError extends Error {}

// The first complete JSON value in Claude's text: the whole answer, a ```json fence, or the first
// balanced {...} or [...] (strings and escapes respected), so prose around it does not break parsing.
function extractJson(text) {
  const t = String(text || '').trim();
  const tryParse = s => { try { return { ok: true, v: JSON.parse(s) }; } catch { return { ok: false }; } };
  let r = tryParse(t); if (r.ok) return r.v;
  const fence = /```(?:json)?\s*([\s\S]*?)```/.exec(t);
  if (fence) { r = tryParse(fence[1].trim()); if (r.ok) return r.v; }
  for (let start = t.search(/[[{]/); start >= 0; start = t.slice(start + 1).search(/[[{]/) < 0 ? -1 : start + 1 + t.slice(start + 1).search(/[[{]/)) {
    let depth = 0, inStr = false, esc = false;
    for (let i = start; i < t.length; i++) {
      const c = t[i];
      if (inStr) { if (esc) esc = false; else if (c === '\\') esc = true; else if (c === '"') inStr = false; continue; }
      if (c === '"') inStr = true;
      else if (c === '{' || c === '[') depth++;
      else if (c === '}' || c === ']') { depth--; if (depth === 0) { r = tryParse(t.slice(start, i + 1)); if (r.ok) return r.v; break; } }
    }
  }
  throw new ClaudeError('Claude did not answer in the expected format. Try again.');
}

function friendly(msg) {
  if (/authenticat|oauth|log ?in|sign ?in|api key/i.test(msg)) return 'Claude Code is not signed in on this computer. Run `claude` in a terminal, sign in, then try again.';
  if (/rate|limit|overload/i.test(msg)) return 'Claude is busy or you reached a usage limit. Try again in a few minutes.';
  return msg || 'Claude could not answer. Try again.';
}

// Ask Claude for JSON. cwd is the project root, so Claude can read eggux/ files itself.
function askJson(cwd, prompt, { timeoutMs = 5 * 60 * 1000, maxTurns = 6, tools = 'Read,Glob,Grep' } = {}) {
  return new Promise((resolve, reject) => {
    let out = '', err = '', done = false;
    let child;
    try {
      child = spawn(BIN, ['-p', '--output-format', 'json', '--max-turns', String(maxTurns), '--allowedTools', tools, '--disallowedTools', 'Bash,Write,Edit,NotebookEdit,WebFetch,WebSearch'],
        { cwd, shell: process.platform === 'win32', windowsHide: true, env: process.env });
    } catch (e) { return reject(new ClaudeError('Claude Code (the `claude` command) was not found. Install Claude Code, or set EGGUX_CLAUDE_BIN.')); }
    const timer = setTimeout(() => { if (!done) { done = true; child.kill(); reject(new ClaudeError('Claude took too long. Try a narrower request.')); } }, timeoutMs);
    child.stdout.on('data', d => { out += d; });
    child.stderr.on('data', d => { err += d; });
    child.on('error', () => { if (done) return; done = true; clearTimeout(timer); reject(new ClaudeError('Claude Code (the `claude` command) was not found. Install Claude Code, or set EGGUX_CLAUDE_BIN.')); });
    child.on('close', code => {
      if (done) return; done = true; clearTimeout(timer);
      let res;
      try { res = JSON.parse(out); } catch { return reject(new ClaudeError(friendly(err.trim().split('\n').pop() || `claude exited with code ${code}`))); }
      if (res.is_error) return reject(new ClaudeError(friendly(String(res.result || res.subtype || ''))));
      try { resolve(extractJson(res.result)); } catch (e) { reject(e); }
    });
    child.stdin.end(prompt);
  });
}

module.exports = { askJson, extractJson, ClaudeError };
