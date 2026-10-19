---
name: brand-intake
description: Turn a client's brand assets (logo, colors, fonts, brand guidelines, website) into the client's brand.md and the Semantic variables of their Figma file. Use when a new client shares brand materials, or when brand colors, fonts or radius change.
---

# Brand intake

Read `${CLAUDE_PLUGIN_ROOT}/references/tokens.md` (token architecture) and
`${CLAUDE_PLUGIN_ROOT}/references/project-files.md` before starting.

## Inputs
Logo, color codes, fonts, brand guidelines PDF, website URL, or screenshots. Work with what is
provided; list what is missing instead of inventing it.

## Steps

1. **Extract** primary and secondary colors, neutrals, fonts, roundness and shadow style.
   From a website, read the real CSS values, not approximations from screenshots.
2. **Build the brand ramp.** If the brand color is not in the Tailwind palette, generate a
   50-950 ramp around it (brand color at 500 or 600 depending on lightness) in OKLCH, keeping
   hue constant and stepping lightness.
3. **Check contrast** for every background/foreground pair you will change, in Light and Dark:
   4.5:1 for text, 3:1 for UI borders and icons. If the brand color fails as a button
   background with white text, pick the nearest ramp step that passes and note it.
4. **Write `eggux/brand.md`** from the template: identity, color table with primitive aliases,
   typography, shape. Ask the user about voice and any overrides they already know.
5. **Update the client's Figma file** (the `figma_file` in brand.md, never the master library):
   - Create `color/brand/50..950` in `Primitives` (scopes `[]`, hidden).
   - Re-alias in `Semantic`: `background/primary`, `foreground/primary`, `border/ring`, and
     `background/accent` if the brand uses a tinted accent. Light and Dark separately.
   - Set `type/family/sans` (and serif/mono if given). Confirm the font exists in Figma with
     `listAvailableFontsAsync`; if it does not, tell the user to install it.
   - Set `radius/base` to the closest radius primitive.
   - Change aliases only. Do not rename or delete tokens.
6. **Code (if the project has a codebase):** update the CSS variables in the shadcn theme file
   (`globals.css` or equivalent) with the same values, keeping variable names.
7. **Verify:** run `/eggux:audit-tokens` on the client file, fix what fails (aliases only),
   then screenshot a few components in Light and Dark.

End with: what changed, contrast results, and anything the user still has to provide.
