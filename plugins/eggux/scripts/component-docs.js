// EGG UX component docs, step 1 of 2. Read-only. Paste as the `code` of a use_figma call on
// the master library. Set PAGES to a few component page names per call (large pages take
// longer); the call returns JSON for those pages. Save each result (the JSON) to a file and
// run `python3 scripts/component-docs.py <json files…>` to write references/components/*.md.
const PAGES = ['Badge'];

figma.skipInvisibleInstanceChildren = false;
const cache = {};
const varName = async id => { if (!(id in cache)) { const v = await figma.variables.getVariableByIdAsync(id); cache[id] = v ? v.name : null; } return cache[id]; };
const styleName = async id => { if (!id || typeof id === 'symbol') return null; if (!(id in cache)) { const s = await figma.getStyleByIdAsync(id); cache[id] = s ? s.name : null; } return cache[id]; };
const inInstance = n => { for (let p = n.parent; p; p = p.parent) if (p.type === 'INSTANCE') return true; return false; };
const mainName = async i => { const m = await i.getMainComponentAsync(); if (!m) return null; return m.parent && m.parent.type === 'COMPONENT_SET' ? m.parent.name : m.name; };

const pages = figma.root.children; const ci = pages.findIndex(p => p.name === 'COMPONENTS'), bi = pages.findIndex(p => p.name === 'BLOCKS');
const out = [];
for (const page of [...pages.slice(ci + 1, bi), ...pages.filter(p => p.name === 'Brand')]) {
  if (!PAGES.includes(page.name)) continue;
  await page.loadAsync();
  const roots = page.findAll(n => (n.type === 'COMPONENT_SET' || (n.type === 'COMPONENT' && n.parent.type !== 'COMPONENT_SET')) && !n.name.startsWith('Icon/'))
    .filter(n => { for (let p = n.parent; p; p = p.parent) if (['INSTANCE', 'COMPONENT', 'COMPONENT_SET'].includes(p.type)) return false; return true; });
  const extras = page.findAll(n => (n.type === 'FRAME' || n.type === 'GROUP' || n.type === 'SECTION') && /^(Stress test|Examples?|Template) \//.test(n.name)).map(n => n.name);
  const comps = [];
  for (const r of roots) {
    const variants = r.type === 'COMPONENT_SET' ? r.children : [r];
    const defs = r.componentPropertyDefinitions || {};
    const variantProps = [], props = [], slots = [];
    for (const [k, d] of Object.entries(defs)) {
      const name = k.split('#')[0];
      if (d.type === 'VARIANT') variantProps.push([name, d.variantOptions]);
      else if (d.type === 'SLOT') slots.push(name);
      else props.push([name, d.type, d.type === 'INSTANCE_SWAP' ? ((await figma.getNodeByIdAsync(d.defaultValue)) || {}).name || '' : String(d.defaultValue)]);
    }
    const colors = new Set(), sizes = new Set(), radii = new Set(), texts = new Set(), effects = new Set(), parts = new Set(), icons = new Set();
    for (const v of variants) for (const n of [v, ...v.findAll(() => true)]) {
      if (n !== v && inInstance(n)) continue;
      if (n.type === 'INSTANCE') { const m = await mainName(n); if (m) (m.startsWith('Icon/') ? icons : parts).add(m.replace('Icon/', '')); continue; }
      const b = n.boundVariables || {};
      for (const key of ['fills', 'strokes']) for (const p of (Array.isArray(n[key]) ? n[key] : [])) if (p.boundVariables && p.boundVariables.color) { const nm = await varName(p.boundVariables.color.id); if (nm) colors.add(nm); }
      for (const key of ['paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom', 'itemSpacing', 'counterAxisSpacing', 'width', 'height', 'strokeWeight']) if (b[key] && b[key].id) { const nm = await varName(b[key].id); if (nm) sizes.add(nm); }
      for (const key of ['topLeftRadius']) if (b[key] && b[key].id) { const nm = await varName(b[key].id); if (nm) radii.add(nm); }
      if (n.type === 'TEXT') { const s = await styleName(n.textStyleId); if (s) texts.add(s); }
      if ('effectStyleId' in n && n.effectStyleId) { const s = await styleName(n.effectStyleId); if (s) effects.add(s); }
    }
    const d0 = variants[0];
    comps.push({
      name: r.name, type: r.type === 'COMPONENT_SET' ? 'set' : 'component', variants: variants.length,
      size: Math.round(d0.width) + 'x' + Math.round(d0.height), description: r.description || '',
      variantProps, props, slots,
      parts: [...parts].filter(p => p !== r.name).sort(), icons: [...icons].sort(),
      tokens: { colors: [...colors].sort(), sizes: [...sizes].sort(), radii: [...radii].sort(), text: [...texts].sort(), effects: [...effects].sort() },
      key: r.key || null
    });
  }
  out.push({ page: page.name, extras, components: comps });
}
return JSON.stringify({ generated: new Date().toISOString().slice(0, 10), pages: out });
