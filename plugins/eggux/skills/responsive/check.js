// EGG UX responsive check. Read-only. Paste as the `code` of a use_figma call on the library or a
// client file. Measures every instance inside "Stress test / ..." frames (or the ROOTS you give)
// and reports resize breaks: text squeezed to a few letters per line, text that runs past its
// component or a clipping parent, and instances that grow much taller than the component itself.
// Set PAGES to a few page names per call (or [] with ROOTS ids). Returns JSON per component.
const PAGES = ['Admin'];
const ROOTS = [];            // optional node ids to check instead of the stress frames
const MAX_EXAMPLES = 3;      // examples kept per component and kind

const out = {};
const add = (comp, kind, detail) => {
  const c = out[comp] || (out[comp] = { count: 0, kinds: {} });
  c.count++;
  const k = c.kinds[kind] || (c.kinds[kind] = { count: 0, examples: [] });
  k.count++;
  if (k.examples.length < MAX_EXAMPLES) k.examples.push(detail);
};
const box = n => n.absoluteBoundingBox || { x: n.x, y: n.y, width: n.width, height: n.height };
const visible = n => { for (let p = n; p && p.type !== 'PAGE'; p = p.parent) if (p.visible === false) return false; return true; };
const clipAncestor = (n, stop) => { for (let p = n.parent; p && p !== stop.parent; p = p.parent) if ('clipsContent' in p && p.clipsContent) return p; return null; };
const fontSizeOf = t => typeof t.fontSize === 'number' ? t.fontSize : 14;
const lineHeightOf = t => {
  const lh = t.lineHeight;
  if (lh && typeof lh === 'object' && lh.unit === 'PIXELS') return lh.value;
  if (lh && typeof lh === 'object' && lh.unit === 'PERCENT') return fontSizeOf(t) * lh.value / 100;
  return fontSizeOf(t) * 1.4;
};
const mainName = async i => {
  const m = await i.getMainComponentAsync();
  if (!m) return null;
  return { name: m.parent && m.parent.type === 'COMPONENT_SET' ? m.parent.name : m.name, main: m };
};

async function checkInstance(inst, cellLabel) {
  const mn = await mainName(inst);
  if (!mn || mn.name.startsWith('Icon/')) return;
  const comp = mn.name;
  const ib = box(inst);
  const label = `${cellLabel || inst.parent.name} (${Math.round(ib.width)} wide)`;
  // 1. Instance much taller than its main component at a narrower width.
  if (mn.main.height > 0 && ib.height > Math.max(2.5 * mn.main.height, mn.main.height + 160)) {
    add(comp, 'tall', `${label}: ${Math.round(ib.height)} px tall vs ${Math.round(mn.main.height)} in the component`);
  }
  for (const t of inst.findAll(n => n.type === 'TEXT')) {
    if (!visible(t) || !t.characters || !t.characters.trim()) continue;
    if (Math.abs(t.rotation || 0) > 1) continue; // rotated labels (collapsed panels) are measured on the wrong axis
    const tb = box(t);
    const fs = fontSizeOf(t), lh = lineHeightOf(t);
    const lines = Math.max(1, Math.round(tb.height / lh));
    const chars = t.characters.replace(/\s+/g, ' ').trim().length;
    const snippet = t.characters.replace(/\s+/g, ' ').trim().slice(0, 40);
    // 2. Squeezed text: a few letters per line.
    if (lines >= 3 && chars / lines < 6) {
      add(comp, 'squeezed', `${label}: "${snippet}" is ${Math.round(tb.width)} px wide, ${lines} lines`);
      continue;
    }
    // 3. Text far taller than planned without a line limit.
    if (lines > 6 && !(t.maxLines > 0) && t.textTruncation !== 'ENDING') {
      add(comp, 'runaway', `${label}: "${snippet}" wraps to ${lines} lines with no line limit`);
    }
    // 4. Text running past the instance or a clipping parent.
    const right = tb.x + tb.width, bottom = tb.y + tb.height;
    if (right > ib.x + ib.width + 1 || tb.x < ib.x - 1) {
      add(comp, 'overflow', `${label}: "${snippet}" runs ${Math.round(Math.max(right - ib.x - ib.width, ib.x - tb.x))} px past the component`);
      continue;
    }
    const clip = clipAncestor(t, inst);
    if (clip) {
      const cb = box(clip);
      if (right > cb.x + cb.width + 1 || bottom > cb.y + cb.height + 1) {
        add(comp, 'clipped', `${label}: "${snippet}" is cut by ${clip.name}`);
      }
    }
  }
}

const pages = figma.root.children.filter(p => PAGES.includes(p.name));
let checked = 0;
if (ROOTS.length) {
  for (const id of ROOTS) {
    const n = await figma.getNodeByIdAsync(id);
    if (!n) continue;
    const insts = n.type === 'INSTANCE' ? [n] : n.findAll(x => x.type === 'INSTANCE' && !(x.parent && x.parent.type === 'INSTANCE'));
    for (const i of insts) { await checkInstance(i); checked++; }
  }
} else {
  for (const page of pages) {
    await page.loadAsync();
    const frames = page.findAll(n => /^Stress test \//.test(n.name) && n.type !== 'INSTANCE');
    for (const f of frames) {
      // Top-level instances inside the stress frame: the cases. Nested instances are parts.
      const insts = f.findAll(x => x.type === 'INSTANCE' && !(() => { for (let p = x.parent; p && p !== f; p = p.parent) if (p.type === 'INSTANCE') return true; return false; })());
      for (const i of insts) {
        let cell = i.parent;
        const lbl = cell && cell.children ? cell.children.find(c => c.type === 'TEXT') : null;
        await checkInstance(i, lbl ? lbl.characters : (cell ? cell.name : ''));
        checked++;
      }
    }
  }
}
const components = Object.entries(out).sort((a, b) => b[1].count - a[1].count).map(([name, v]) => ({ name, ...v }));
return { pages: PAGES, checked, failing: components.length, components };
