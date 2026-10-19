---
name: add-component
description: Add or change a component, field preset, block or page shell in the EGG UI master library (or a client file) in Figma, the EGG way - tokens only, shadcn-aligned variants, native slots, Light/Dark QA, scan, docs. Use when the user asks to build a new component, a block, a page template, or to extend an existing one in the library.
---

# Add a component to the library

Read first:
- `${CLAUDE_PLUGIN_ROOT}/references/figma-library.md` (what exists, conventions, slots, layers)
- `${CLAUDE_PLUGIN_ROOT}/references/figma-api-notes.md` (Plugin API pitfalls)
- `${CLAUDE_PLUGIN_ROOT}/references/tokens.md`
- the Figma `figma-use` and `figma-generate-library` skills

Write to the master library (`BufvaVkSh9vMWPye117Ucd`) only when the user asked to change the
library; otherwise work in the client's file.

## 1. Decide the layer
| Layer | When | Page |
|---|---|---|
| Component | A reusable UI part with no business meaning (Breadcrumb, Accordion) | its own page |
| Field Preset | A field with a purpose seen in 2+ projects (IBAN, CNP) | Form Presets |
| Block | A composed section seen in 2+ projects (hero, pricing, sign in) | `Blocks / <category>` |
| Page Shell | A full page frame with a replaceable content slot | Page Shells |

Check `figma-library.md` and search the file first: extend an existing component (new variant,
slot or property) before creating a new one.

## 2. Build
- Map variants and props to shadcn names and values (`Variant=outline`, `Size=sm`).
- Bind every fill, stroke, padding, gap, radius, size and text style to a token. If a value
  has no token, create a `Components` token aliased to Semantic (with `opacity/*` if needed),
  with scopes and WEB code syntax, and document it in `tokens.md`.
- States: default, hover, focus (2 px gap + 4 px ring, `clipsContent` on), disabled
  (`opacity/50`), plus error or selected when they exist.
- Content that varies per use is a native slot (clipsContent off, sensible default content).
  Fixed variation is a boolean or TEXT property.
- Layers 2-4 are built only from instances of layer 1, never redrawn.
- Lay variants out in a grid on a dashed `background/default` frame; write the component
  description (when to use, rules) and a documentation link.

## 3. Check
1. Screenshot the set and an example instance with props and slots filled.
2. Light and Dark: a temporary frame with explicit Dark modes on Semantic and Components.
3. Run `${CLAUDE_PLUGIN_ROOT}/skills/audit-tokens/scan-components.js` on the new roots: zero raw
   values, unstyled text, clipping slots or empty icons. Run `/eggux:audit-tokens` when tokens
   changed.
4. Remove temporary QA frames.

## 4. Document
- `references/figma-library.md`: inventory row, conventions or slot rules learned.
- `skills/build-ui/components/<name>.md` (usage rules) or a pattern for presets and blocks.
- Bump `version` in `plugins/eggux/.claude-plugin/plugin.json`, run `claude plugin validate .`,
  commit.

End with what was built, the QA evidence, and what is still missing.
