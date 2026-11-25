// Runs Claude Code headless (`claude -p`) for the board: research, options, suggested entries.
// Uses the person's own Claude Code sign-in, so no API key is needed. Read-only tools only:
// the board writes the files itself from the JSON Claude returns.
'use strict';
const { spawn } = require('child_process');

const BIN = process.env.EGGUX_CLAUDE_BIN || 'claude';

class ClaudeError extends Error {}

function extractJson(text) {
  const t = String(text || '').trim();
  const fence = /```(?:json)?\s*([\s\S]*?)```/.exec(t);
  const src = fence ? fence[1] : t;
  const start = src.search(/[[{]/);
  if (start < 0) throw new ClaudeError('Claude did not answer in the expected format. Try again.');
  const open = src[start], close = open === '{' ? '}' : ']';
  const end = src.lastIndexOf(close);
  try { return JSON.parse(src.slice(start, end + 1)); }
  catch { throw new ClaudeError('Claude did not answer in the expected format. Try again.'); }
}

function friendly(msg) {
  if (/authenticat|oauth|log ?in|sign ?in|api key/i.test(msg)) return 'Claude Code is not signed in on this computer. Run `claude` in a terminal, sign in, then try again.';
  if (/rate|limit|overload/i.test(msg)) return 'Claude is busy or you reached a usage limit. Try again in a few minutes.';
  return msg || 'Claude could not answer. Try again.';
}

// Ask Claude for JSON. cwd is the project root, so Claude can read eggux/ files itself.
function askJson(cwd, prompt, { timeoutMs = 5 * 60 * 1000, maxTurns = 6 } = {}) {
  return new Promise((resolve, reject) => {
    let out = '', err = '', done = false;
    let child;
    try {
      child = spawn(BIN, ['-p', '--output-format', 'json', '--max-turns', String(maxTurns), '--allowedTools', 'Read,Glob,Grep'],
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
