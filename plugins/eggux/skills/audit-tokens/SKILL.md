---
name: audit-tokens
description: Audit the variables of the EGG UI master library or a client's Figma file: alias integrity, WEB code syntax, scopes, background/foreground pairing and WCAG contrast in Light and Dark. Use after brand intake, before publishing library changes, or when the user asks to check tokens, contrast or accessibility of the theme.
---

# Audit tokens

Read `${CLAUDE_PLUGIN_ROOT}/references/tokens.md` first. This audit is read-only; it never
changes variables.

## Run
1. Get the file key: the client's `figma_file` from `eggux/brand.md`, or the master library
   (`BufvaVkSh9vMWPye117Ucd`) when the user asks about the library itself.
2. Load the Figma `figma-use` skill, then call `use_figma` with the full contents of `audit.js`
   (next to this file) as `code`. Do not edit the script inline; if a check is wrong, fix `audit.js`.
3. The script returns `summary`, `issues` (structure) and `contrastFailures` (plus the full `contrast` list).

## What it checks
| Check | Rule |
|---|---|
| Aliases | Every Semantic, Components and Density value is an alias (plain or color + opacity), none broken |
| Code syntax | Every Semantic, Components and Density variable has a WEB code syntax |
| Scopes | No variable uses `ALL_SCOPES` |
| Pairing | Every `background/X` has a `foreground/X` |
| Text contrast 4.5:1 | `foreground/X` on `background/X`; `foreground/muted` on page and card; status colors used as text on the page; `foreground/X` on Components state tokens (`button/X-hover`) |
| UI contrast 3:1 | `border/input` and `border/ring` on the page; `chart/1..8` on page and card |
| Info only | `border/default` (decorative dividers are exempt from 3:1) |

Translucent values are composited over `background/default` of the same mode before measuring.

The base theme has 4 known failures, kept on purpose and documented in `tokens.md` § Known
contrast exceptions (warning as text, muted on muted, `border/input` in Light and Dark; only
warning as text in Corporate Light and Corporate Dark). Report them
as known, not as new findings; any other failure is real.

## Report
A table of failures, most severe first:

| Mode | Pair | Ratio | Needed | Proposed fix |
|---|---|---|---|---|

For each failure, propose the nearest primitive step that passes (for example `color/green/600`
→ `color/green/700`) and give its ratio. Then list structural issues.

## Fixing
Only with the user's approval, and only by changing aliases (never renaming tokens):
- In a client file, apply the fixes and record each one in `eggux/brand.md` overrides.
- In the master library, apply them only when the user explicitly asks to change the library,
  then note the change in the plugin's `references/tokens.md` if it changes a documented default.

Re-run the audit after fixing and report the before/after ratios.

## Component scan
`scan-components.js` (next to this file) checks components or frames instead of variables: raw
fills, strokes, spacing and radius, text without a style, slots that clip, frames that clip
without a reason (`clippingFrame`: empty frames, focus variants and crop layers listed in
`CROP_NAMES` are skipped), empty icon instances, SLOT properties with no slot node
(`brokenSlot`). Each list returns at most `MAX_ITEMS` entries; the counts cover everything.
Set `ROOTS` to the node ids to scan, or leave it empty for every component on the current page.
