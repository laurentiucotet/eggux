# Background

Generated from the EGG UI master library on 2026-10-26 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Background / Grid](#background-grid) | 1 | - |
| [Background / Dots](#background-dots) | 1 | - |
| [Background / Glow](#background-glow) | 3 | - |
| [Background / Beam](#background-beam) | 1 | - |

On the Figma page: "Example / hero with background", "Stress test / Background / Beam", "Stress test / Background / Dots", "Stress test / Background / Glow", "Stress test / Background / Grid"

## Background / Grid

Component · 1 variant · default size 1440 × 800

Background / Grid: square grid of 1 px lines (40 px cells, border/default at 60%) behind a hero or feature section. Fade (on by default) masks the lines to a soft ellipse so they disappear toward the edges; off shows the full grid. Cells stay square up to 1920 x 1080 (the lines are centered and clipped). Place it as the back (first) layer of the section frame: Absolute position, constraints Left and right + Top and bottom (or Scale), so it stretches with the section; decorative only, no text, hide it from screen readers (aria-hidden). One decorative device per page. Text keeps its contrast between the lines; a muted text line that crosses a grid line drops to 4.3:1 on that pixel row (Light), so keep body copy short or in foreground/default. Usage: eggux build-ui/patterns/marketing-pages.md

**Use for**

- Behind a centered hero headline (with Background / Glow)
- Behind a feature or developer-tool section that needs a technical feel
- Behind a CTA band

**Not for**

- More than one decorative device on a page: pick Grid, Dots, Glow or Beam
- Behind dense content, tables or forms
- Inside cards or app screens

**Anatomy**

1. Lines: one vector of 1 px lines in border/default at 60%, 40 px cells, 1920 x 1080, centered and clipped
2. Fade mask (Fade): an alpha mask with a radial fade, scales with the frame; off shows the full grid

**Content and behavior**

- Put it at the back of the section: first child, Absolute position, constraints Left and right + Top (or Scale)
- Default size 1440 x 800; stretch it up to 1920 x 1080 and the cells stay square
- No text or meaning inside; it is decoration only
- Keep body copy short over it; muted text crossing a line reads 4.3:1 on that pixel row in Light

**Accessibility**

- Decorative: aria-hidden, no role
- Text over it keeps 4.5:1 against the plain page between the lines
- Respect forced colors: hide it in high contrast mode

| Property | Type | Default |
|---|---|---|
| Fade | boolean | true |

Tokens and styles:
- Colors: `border/default`

Guides: [marketing-pages](../../skills/build-ui/patterns/marketing-pages.md)

Code: custom absolutely positioned `div` (`absolute inset-0 -z-10 pointer-events-none`, `aria-hidden`) (`bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:40px_40px] opacity-60`; `Fade` = `[mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]`)

## Background / Dots

Component · 1 variant · default size 1440 × 800

Background / Dots: dot pattern (1.5 px dots, 24 px pitch, foreground/muted at 50%) behind a hero, feature or CTA section. Fade (on by default) masks the dots to a soft ellipse toward the edges. The pattern stays even up to 1920 x 1080. Place it as the back (first) layer of the section frame: Absolute position, constraints Left and right + Top and bottom (or Scale), so it stretches with the section; decorative only, no text, hide it from screen readers (aria-hidden). One decorative device per page. Usage: eggux build-ui/patterns/marketing-pages.md

**Use for**

- Behind a hero or a feature section as a quieter alternative to the grid
- Behind a CTA band or a testimonial highlight

**Not for**

- More than one decorative device on a page
- Behind dense content, tables or forms
- Inside cards or app screens

**Anatomy**

1. Dots: one vector of round dots in foreground/muted at 50%, 24 px pitch, 1920 x 1080, centered and clipped
2. Fade mask (Fade): an alpha mask with a radial fade; off shows the full pattern

**Content and behavior**

- Put it at the back of the section: first child, Absolute position, constraints Left and right + Top (or Scale)
- Default size 1440 x 800; the pitch stays even up to 1920 x 1080
- No text inside; decoration only

**Accessibility**

- Decorative: aria-hidden, no role
- Text over it keeps 4.5:1: the dots are 1.5 px and low contrast

| Property | Type | Default |
|---|---|---|
| Fade | boolean | true |

Tokens and styles:
- Colors: `foreground/muted`

Code: custom absolutely positioned `div` (`aria-hidden`) (`bg-[radial-gradient(var(--muted-foreground)_0.75px,transparent_0.75px)] bg-[size:24px_24px] opacity-50`; `Fade` = same radial mask as Grid)

## Background / Glow

Component set · 3 variants · default size 1440 × 800

Background / Glow: one large blurred ellipse filled with gradient/brand-glow (background/primary at 35% fading out, blur/3xl). Position: top (default, a soft light above the headline), center (behind a product shot or card) or bottom-right (corner accent for a CTA band). Recolors with the theme: violet in Showcase, gray in Default, blue in Corporate. Place it as the back (first) layer of the section frame: Absolute position, constraints Left and right + Top and bottom (or Scale), so it stretches with the section; decorative only, no text, hide it from screen readers (aria-hidden). One decorative device per page. Never put body text on the glow core: muted text needs the background within about 6% of background/default; top keeps the subtitle zone clean. Usage: eggux build-ui/patterns/marketing-pages.md

**Use for**

- Position=top: a soft light above a hero headline
- Position=center: behind a product screenshot, a pricing card or a device frame
- Position=bottom-right: a corner accent in a CTA band or footer lead-in

**Not for**

- Body text on the glow core: muted text needs a background within about 6% of the page
- More than one glow per page (Grid + Glow together count as one hero treatment)
- App screens and dashboards

**Anatomy**

1. Glow: one ellipse with the gradient/brand-glow style (background/primary 35% to transparent) and blur/3xl, constraints Scale
2. Position: top (default), center, bottom-right

**Content and behavior**

- Put it at the back of the section, above Grid or Dots if you combine them, Absolute position, constraints Left and right + Top (or Scale)
- The color follows the theme: violet in Showcase, gray in Default, blue in Corporate
- Keep the subtitle and body copy outside the bright part; top is tuned so a centered hero subtitle sits on the plain page

**Accessibility**

- Decorative: aria-hidden
- Measured in the hero example: subtitle on the plain page (4.74:1 Showcase Light, 7.85:1 Showcase Dark); headline 14:1 or more

| Variant property | Values |
|---|---|
| Position | top, center, bottom-right |

Tokens and styles:
- Effects: `blur/3xl`

Code: custom absolutely positioned `div` (`aria-hidden`) (`rounded-full blur-3xl bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--primary)_35%,transparent),transparent)]`; Position: top `left-1/2 -top-[560px] w-[1240px] h-[800px] -translate-x-1/2`, center centered `w-[1000px] h-[640px]`, bottom-right `-right-[200px] -bottom-[340px] w-[1000px] h-[760px]`)

## Background / Beam

Component · 1 variant · default size 1440 × 800

Background / Beam: three thin diagonal light beams (background/primary to transparent, 12-22% alpha, blur/2xl) entering from the top. Subtle; the beams sit in the middle and right, so pair it with left-aligned content (Hero Split) or a CTA band. Place it as the back (first) layer of the section frame: Absolute position, constraints Left and right + Top and bottom (or Scale), so it stretches with the section; decorative only, no text, hide it from screen readers (aria-hidden). One decorative device per page. Keep body text off the bright upper end of a beam. Usage: eggux build-ui/patterns/marketing-pages.md

**Use for**

- Behind a left-aligned hero (Hero Split): the beams sit in the middle and right
- Behind a CTA band or a launch announcement

**Not for**

- Behind centered body text
- With another decorative device on the same page
- App screens

**Anatomy**

1. Beam 1-3: rectangles rotated 35 degrees, linear background/primary to gradient/primary-transparent at 12-22% alpha, blur/2xl, constraints Scale

**Content and behavior**

- Put it at the back of the section: Absolute position, constraints Left and right + Top (or Scale)
- Keep body text off the bright upper end of a beam
- The color follows the theme

**Accessibility**

- Decorative: aria-hidden

Tokens and styles:
- Effects: `blur/2xl`

Code: custom `overflow-hidden` wrapper with 3 rotated `div`s (`aria-hidden`) (Each beam `rotate-[35deg] bg-linear-to-b from-primary/20 to-transparent blur-2xl`, widths 64-160 px, opacity 12-22%)
