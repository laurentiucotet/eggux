// EGG UX component snapshot. Read-only. Paste as the `code` of a use_figma call.
// ROOT: id of the component set or component.
// ONLY: variant names to include (empty = all). Use it for large sets (Button, Input).
// BASELINE: paste the `flat` object of an earlier snapshot to get a diff; null for a plain snapshot.
// Values bound to a variable read "$token (value)"; raw values are plain numbers or hex.
const ROOT = '';
const ONLY = [];
const BASELINE = null;

figma.skipInvisibleInstanceChildren = false;
const root = await figma.getNodeByIdAsync(ROOT);
if (!root || !['COMPONENT_SET', 'COMPONENT'].includes(root.type)) throw new Error('ROOT must be a component set or a component');

const cache = {};
const vn = async id => { if (!(id in cache)) { const v = await figma.variables.getVariableByIdAsync(id); cache[id] = v ? v.name : 'missing:' + id; } return cache[id]; };
const sn = async id => { if (!id) return null; if (typeof id === 'symbol') return 'mixed'; if (!(id in cache)) { const s = await figma.getStyleByIdAsync(id); cache[id] = s ? s.name : 'missing style'; } return cache[id]; };
const r2 = v => typeof v === 'symbol' ? 'mixed' : (typeof v === 'number' ? Math.round(v * 100) / 100 : v);
const hex = c => '#' + [c.r, c.g, c.b].map(x => Math.round(x * 255).toString(16).padStart(2, '0')).join('');
const paints = async ps => {
  if (ps === figma.mixed) return 'mixed';
  if (!Array.isArray(ps)) return undefined;
  const out = [];
  for (const p of ps) {
    if (p.visible === false) continue;
    if (p.type !== 'SOLID') { out.push(p.type); continue; }
    out.push(p.boundVariables && p.boundVariables.color ? '$' + await vn(p.boundVariables.color.id) : hex(p.color) + (p.opacity < 1 ? '@' + r2(p.opacity) : ''));
  }
  return out.join(' + ') || 'none';
};
const num = async (n, k) => {
  const raw = n[k]; const b = n.boundVariables && n.boundVariables[k];
  return b && b.id ? '$' + await vn(b.id) + ' (' + r2(raw) + ')' : r2(raw);
};

const flat = {};
const put = (k, v) => { if (v !== undefined && v !== null && v !== '' && v !== 'none') flat[k] = v; };

const walk = async (n, path, inLayout) => {
  put(path + '#type', n.type);
  if (n.visible === false) put(path + '#visible', false);
  if (n.componentPropertyReferences) for (const [k, v] of Object.entries(n.componentPropertyReferences)) put(path + '#prop.' + k, v);
  put(path + '.size', Math.round(n.width) + 'x' + Math.round(n.height));
  if (n.boundVariables && n.boundVariables.width) put(path + '.width', await num(n, 'width'));
  if (n.boundVariables && n.boundVariables.height) put(path + '.height', await num(n, 'height'));
  if (inLayout && 'layoutSizingHorizontal' in n) put(path + '.sizing', n.layoutSizingHorizontal + '/' + n.layoutSizingVertical);
  if (n.layoutPositioning === 'ABSOLUTE') put(path + '.positioning', 'ABSOLUTE');
  if ('layoutMode' in n && n.layoutMode && n.layoutMode !== 'NONE') {
    put(path + '.layout', n.layoutMode + (n.layoutWrap === 'WRAP' ? ' wrap' : '') + ' main ' + n.primaryAxisAlignItems + ' cross ' + n.counterAxisAlignItems);
    for (const k of ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'itemSpacing', 'counterAxisSpacing']) {
      if (!(k in n) || n[k] === undefined || n[k] === null) continue;
      if (n[k] === 0 && !(n.boundVariables && n.boundVariables[k])) continue;
      put(path + '.' + k, await num(n, k));
    }
  }
  if ('cornerRadius' in n) {
    if (n.cornerRadius === figma.mixed) put(path + '.radius', [await num(n, 'topLeftRadius'), await num(n, 'topRightRadius'), await num(n, 'bottomRightRadius'), await num(n, 'bottomLeftRadius')].join(' '));
    else if (n.cornerRadius > 0 || (n.boundVariables && n.boundVariables.topLeftRadius)) put(path + '.radius', await num(n, 'topLeftRadius'));
  }
  if ('fills' in n) put(path + '.fill', await paints(n.fills));
  if ('strokes' in n && n.strokes.length) {
    put(path + '.stroke', await paints(n.strokes));
    put(path + '.strokeWeight', n.strokeWeight === figma.mixed ? [n.strokeTopWeight, n.strokeRightWeight, n.strokeBottomWeight, n.strokeLeftWeight].join(' ') : await num(n, 'strokeWeight'));
  }
  if ('opacity' in n && n.opacity < 1) put(path + '.opacity', await num(n, 'opacity'));
  if ('effectStyleId' in n && n.effectStyleId) put(path + '.effect', await sn(n.effectStyleId));
  else if ('effects' in n && n.effects.length) put(path + '.effect', n.effects.map(e => e.type).join(' + ') + ' (no style)');
  if ('clipsContent' in n && n.clipsContent) put(path + '.clips', true);
  if (n.type === 'TEXT') {
    put(path + '.style', n.textStyleId ? await sn(n.textStyleId) : 'NO STYLE ' + (n.fontSize === figma.mixed ? 'mixed' : n.fontSize));
    put(path + '.text', n.characters.slice(0, 80));
    put(path + '.resize', n.textAutoResize + (n.textTruncation === 'ENDING' ? ' ellipsis' : '') + (n.maxLines ? ' max ' + n.maxLines : ''));
    if (n.textAlignHorizontal !== 'LEFT') put(path + '.align', n.textAlignHorizontal);
    return;
  }
  if (n.type === 'INSTANCE') {
    const m = await n.getMainComponentAsync();
    put(path + '.of', m ? (m.parent && m.parent.type === 'COMPONENT_SET' ? m.parent.name + ' / ' + m.name : m.name) : 'missing main component');
    for (const [k, p] of Object.entries(n.componentProperties)) {
      if (p.type === 'VARIANT') continue;
      put(path + '.prop.' + k.split('#')[0], p.type === 'INSTANCE_SWAP' ? ((await figma.getNodeByIdAsync(p.value)) || {}).name : p.value);
    }
    return;
  }
  if ('children' in n) {
    const seen = {};
    for (const c of n.children) {
      seen[c.name] = (seen[c.name] || 0) + 1;
      const name = seen[c.name] > 1 ? c.name + '[' + seen[c.name] + ']' : c.name;
      await walk(c, path + '/' + name, 'layoutMode' in n && n.layoutMode && n.layoutMode !== 'NONE');
    }
  }
};

if (root.type === 'COMPONENT_SET') {
  for (const [k, d] of Object.entries(root.componentPropertyDefinitions)) put('props.' + k.split('#')[0], d.type + (d.type === 'VARIANT' ? ' ' + d.variantOptions.join('|') : ' = ' + (d.type === 'INSTANCE_SWAP' ? ((await figma.getNodeByIdAsync(d.defaultValue)) || {}).name : d.defaultValue)));
  for (const v of root.children) if (!ONLY.length || ONLY.includes(v.name)) await walk(v, v.name, false);
} else {
  for (const [k, d] of Object.entries(root.componentPropertyDefinitions)) put('props.' + k.split('#')[0], d.type + ' = ' + d.defaultValue);
  await walk(root, '(root)', false);
}
put('description', (root.description || '').slice(0, 200));

const result = { component: root.name, id: root.id, variants: root.type === 'COMPONENT_SET' ? root.children.length : 1, keys: Object.keys(flat).length };
if (BASELINE) {
  const added = {}, removed = {}, changed = {};
  for (const k of Object.keys(flat)) if (!(k in BASELINE)) added[k] = flat[k]; else if (BASELINE[k] !== flat[k]) changed[k] = [BASELINE[k], flat[k]];
  for (const k of Object.keys(BASELINE)) if (!(k in flat)) removed[k] = BASELINE[k];
  result.diff = { added, removed, changed };
}
result.flat = flat;
return result;
