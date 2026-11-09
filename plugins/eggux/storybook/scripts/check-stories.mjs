// Opens every story of the static Storybook build in a fresh page and reports the ones whose
// render or play function throws. It reproduces how Chromatic captures: the production build (not
// the dev server), a new page per story, 1200 x 900, en-US, UTC, and a "Chromatic capture" user
// agent, which makes preview.tsx switch CSS transitions off. A play function starts right after
// the first render here, before effects have run: a test that passes in `npm test` (dev build,
// slower start) and fails here reads state too early.
//
//   npm run build-storybook && npm run check:stories
//   npm run check:stories -- --filter table --workers 4 --out failures.json --full
//
// Options: --dir <storybook-static>  --filter <substring of the story id>  --workers <n>
//          --out <file.json>  --full (whole error message)  --timeout <ms per story>
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : fallback;
};
const dir = path.resolve(opt('dir', 'storybook-static'));
const filter = opt('filter', '');
const workers = Number(opt('workers', '6'));
const outFile = opt('out', '');
const full = args.includes('--full');
const timeout = Number(opt('timeout', '15000'));

if (!fs.existsSync(path.join(dir, 'index.json'))) {
  console.error(`No ${path.join(dir, 'index.json')}. Run "npm run build-storybook" first.`);
  process.exit(2);
}

const types = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.woff': 'font/woff', '.png': 'image/png', '.ico': 'image/x-icon', '.map': 'application/json' };
const server = http.createServer((req, res) => {
  const p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  const file = path.join(dir, p === '/' ? 'index.html' : p);
  if (!file.startsWith(dir) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404);
    return res.end();
  }
  res.writeHead(200, { 'content-type': types[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});
await new Promise(resolve => server.listen(0, resolve));
const base = `http://localhost:${server.address().port}`;

const index = JSON.parse(fs.readFileSync(path.join(dir, 'index.json'), 'utf8'));
// Stories tagged !test are skipped by Chromatic and by `npm test`; so are they here.
const stories = Object.values(index.entries).filter(e => e.type === 'story' && e.tags.includes('test') && e.id.includes(filter));
console.log(`${stories.length} stories`);

const browser = await chromium.launch();
const userAgent = `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${browser.version()} Safari/537.36 (Chromatic capture)`;
const failures = [];
const queue = [...stories];
let done = 0;

async function worker() {
  const context = await browser.newContext({ viewport: { width: 1200, height: 900 }, locale: 'en-US', timezoneId: 'UTC', userAgent });
  while (queue.length) {
    const story = queue.shift();
    const page = await context.newPage();
    let result = 'timeout';
    try {
      await page.addInitScript(() => {
        window.__sb = [];
        const hook = () => {
          const channel = window.__STORYBOOK_ADDONS_CHANNEL__;
          if (!channel) return setTimeout(hook, 5);
          for (const event of ['storyRendered', 'playFunctionThrewException', 'storyThrewException', 'storyErrored', 'storyMissing', 'storyUnchanged']) {
            channel.on(event, arg => window.__sb.push([event, arg && (arg.message || arg.title || JSON.stringify(arg).slice(0, 300))]));
          }
        };
        hook();
      });
      await page.goto(`${base}/iframe.html?id=${story.id}&viewMode=story`, { waitUntil: 'domcontentloaded' });
      const first = await page
        .waitForFunction(() => window.__sb && window.__sb.find(e => e[0] !== 'storyUnchanged'), null, { timeout, polling: 50 })
        .catch(() => null);
      if (first) {
        await page.waitForTimeout(50);
        const events = await page.evaluate(() => window.__sb);
        const bad = events.find(e => e[0] !== 'storyRendered' && e[0] !== 'storyUnchanged');
        result = bad ? String(bad[1]) : 'ok';
      }
    } catch (error) {
      result = `runner: ${String(error).slice(0, 200)}`;
    }
    if (result !== 'ok') failures.push({ id: story.id, name: `${story.title} / ${story.name}`, result: full ? result : result.split('\n')[0].slice(0, 260) });
    await page.close();
    done += 1;
    if (done % 250 === 0) console.log(`${done} done, ${failures.length} failing`);
  }
  await context.close();
}

await Promise.all(Array.from({ length: workers }, worker));
await browser.close();
server.close();

failures.sort((a, b) => a.id.localeCompare(b.id));
if (outFile) fs.writeFileSync(outFile, JSON.stringify(failures, null, 2));
for (const f of failures) console.log(`${f.id.padEnd(60)} | ${f.result}`);
console.log(`${done} stories, ${failures.length} failing`);
process.exit(failures.length ? 1 : 0);
