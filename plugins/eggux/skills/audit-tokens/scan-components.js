// EGG UX component scan. Read-only. Paste as the `code` of a use_figma call.
// Set ROOTS to the ids of the components, component sets or frames to scan,
// or leave it empty to scan every component and component set on the current page.
const ROOTS = [];

// Load hidden instance children too, or hidden icons look empty.
figma.skipInvisibleInstanceChildren = false;

const ok = p => p.type !== 'SOLID' || (p.boundVariables && p.boundVariables.color);
let roots = [];
if (ROOTS.length) for (const id of ROOTS) { const n = await figma.getNodeByIdAsync(id); if (n) roots.push(n); }
else roots = figma.currentPage.findAllWithCriteria({ types: ['COMPONENT_SET', 'COMPONENT'] }).filter(n => n.type === 'COMPONENT_SET' || n.parent.type !== 'COMPONENT_SET');

const findings = { rawFill: [], rawStroke: [], rawSpacing: [], rawRadius: [], unstyledText: [], clippingSlot: [], emptyIcon: [], brokenSlot: [] };
let checked = 0;
for (const r of roots) {
  // A SLOT property must be used by a SLOT node in every variant. Overwriting a slot's
  // componentPropertyReferences (e.g. to bind visibility) drops slotContentId and leaves a FRAME.
  if (r.type === 'COMPONENT_SET' || r.type === 'COMPONENT') {
    const defs = r.componentPropertyDefinitions;
    const slotKeys = Object.keys(defs).filter(k => defs[k].type === 'SLOT');
    for (const v of r.type === 'COMPONENT_SET' ? r.children : [r]) {
      const used = new Set(v.findAll(n => n.type === 'SLOT').map(s => s.componentPropertyReferences && s.componentPropertyReferences.slotContentId));
      for (const k of slotKeys) if (!used.has(k)) findings.brokenSlot.push(`${r.name} / ${v.name}: ${k}`);
    }
  }
  for (const n of [r, ...r.findAll(() => true)]) {
    if (n.type === 'COMPONENT_SET') continue;
    checked++;
    if (n.type === 'SLOT' && n.clipsContent) findings.clippingSlot.push(`${r.name} > ${n.name}`);
    if (n.type === 'INSTANCE' && n.mainComponent && n.mainComponent.name.startsWith('Icon/') && n.children.length === 0) findings.emptyIcon.push(`${r.name} > ${n.name}`);
    let inInstance = false;
    for (let p = n.parent; p; p = p.parent) if (p.type === 'INSTANCE') { inInstance = true; break; }
    if (inInstance) continue;
    if ('fills' in n && Array.isArray(n.fills) && n.fills.some(p => !ok(p))) findings.rawFill.push(`${r.name} > ${n.name}`);
    if ('strokes' in n && Array.isArray(n.strokes) && n.strokes.some(p => !ok(p))) findings.rawStroke.push(`${r.name} > ${n.name}`);
    if (n.type === 'INSTANCE') continue;
    if ('layoutMode' in n && n.layoutMode && !['NONE', 'GRID'].includes(n.layoutMode))
      for (const k of ['paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom', 'itemSpacing'])
        if (n[k] > 0 && !(n.boundVariables && n.boundVariables[k])) findings.rawSpacing.push(`${r.name} > ${n.name} ${k}=${n[k]}`);
    if (['COMPONENT', 'FRAME', 'RECTANGLE'].includes(n.type) && typeof n.cornerRadius === 'number' && n.cornerRadius > 0 && !(n.boundVariables && n.boundVariables.topLeftRadius))
      findings.rawRadius.push(`${r.name} > ${n.name} ${n.cornerRadius}`);
    if (n.type === 'TEXT' && !n.textStyleId) findings.unstyledText.push(`${r.name} > ${n.name}`);
  }
}
const counts = Object.fromEntries(Object.entries(findings).map(([k, v]) => [k, v.length]));
return { roots: roots.length, checked, counts, findings: Object.fromEntries(Object.entries(findings).map(([k, v]) => [k, v.slice(0, 25)])) };
