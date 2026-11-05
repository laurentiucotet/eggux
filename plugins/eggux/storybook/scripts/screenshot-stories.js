#!/usr/bin/env node
// Screenshot stories from a built Storybook (storybook-static) for a side-by-side check against
// Figma. Usage: node scripts/screenshot-stories.js <out dir> [story-id ...]
// Story ids look like components-button--variants (see storybook-static/index.json).
// Without ids it shoots every story. Uses the preinstalled Playwright Chromium.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { chromium } from 'playwright';

const [out = 'screenshots', ...ids] = process.argv.slice(2);
const root = path.resolve('storybook-static');
if (!fs.existsSync(root)) { console.error('Run npm run build-storybook first.'); process.exit(1); }
const index = JSON.parse(fs.readFileSync(path.join(root, 'index.json'), 'utf8'));
const stories = Object.values(index.entries).filter(e => e.type === 'story' && (!ids.length || ids.includes(e.id)));
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
const server = http.createServer((req, res) => {
  const p = path.join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  const f = fs.existsSync(p) && fs.statSync(p).isDirectory() ? path.join(p, 'index.html') : p;
  if (!f.startsWith(root) || !fs.existsSync(f)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': types[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
}).listen(0, '127.0.0.1');
await new Promise(r => server.once('listening', r));
const base = `http://127.0.0.1:${server.address().port}`;
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 900, height: 600 }, deviceScaleFactor: 2 });
for (const s of stories) {
  await page.goto(`${base}/iframe.html?id=${s.id}&viewMode=story`);
  await page.waitForSelector('#storybook-root > *', { timeout: 10000 }).catch(() => {});
  await page.evaluate(() => document.fonts.ready);
  const el = await page.$('#storybook-root');
  // Theme and density classes are set in an effect; transitions would catch the switch halfway.
  await page.addStyleTag({ content: '*,*::before,*::after{transition:none!important;animation:none!important}' });
  await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
  await (el || page).screenshot({ path: path.join(out, `${s.id}.png`) });
  console.log(`${s.id}.png`);
}
await browser.close();
server.close();
