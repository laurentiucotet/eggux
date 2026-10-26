# Token architecture

The single source of truth for visual values is the Figma master library **EGG UI v2**
(`https://www.figma.com/design/BufvaVkSh9vMWPye117Ucd/EGG-UI---v2`). Every client project
starts from a duplicate of it. Never hardcode a hex, pixel or font value in a design or in
code when a token exists for it.

## Three tiers

| Tier | Figma collection | Modes | Who uses it |
|---|---|---|---|
| 1. Primitives | `Primitives` | Value | Only other variables. Colors are hidden from pickers |
| 2. Semantic | `Semantic` | Light, Dark | Designs and components. This is the brand layer |
| 3. Components | `Components` | Light, Dark | One component that must deviate from the semantic rule |

Rules:
- A Semantic value is always an alias to a Primitive (optionally color alias + `opacity/*`). No raw values.
- A Component token is always an alias to a Semantic token, unless it truly needs its own value.
- Component tokens are created only when a component needs them, never in advance.
- Rebranding a client means changing Semantic aliases (and adding brand Primitives), never renaming tokens.

## Primitives (`Primitives`)

| Group | Content |
|---|---|
| `color/<hue>/<50-950>`, `color/white`, `color/black` | Tailwind palette. Brand ramps go in `color/brand/<50-950>` |
| `spacing/<0..96>` | Tailwind spacing scale in px (`spacing/4` = 16) |
| `radius/<none,sm,DEFAULT,md,lg,xl,2xl,3xl,full>` | Only `none` and `full` are visible in pickers |
| `type/family/<sans,serif,mono>` | Font family names |
| `type/weight/*`, `type/size/*`, `type/leading/*`, `type/tracking/*` | Type scales |
| `shadow/*` | Tailwind shadow values, bound to the `shadow/*` effect styles |
| `layout/breakpoint/*`, `layout/container/*` | Breakpoints and container widths |
| `opacity/*`, `blur/*`, `border-width/*` | Remaining scales |

## Semantic (`Semantic`)

Figma names are grouped by role. The WEB code syntax keeps the shadcn CSS variable name, so
Figma and code map 1:1.

| Figma variable | CSS variable | Notes |
|---|---|---|
| `background/default` | `--background` | Page surface |
| `background/card` | `--card` | |
| `background/popover` | `--popover` | |
| `background/primary` | `--primary` | Main brand color |
| `background/secondary` | `--secondary` | |
| `background/muted` | `--muted` | |
| `background/accent` | `--accent` | Hover and selected surfaces |
| `background/destructive` | `--destructive` | |
| `background/success` | `--success` | Extension, not in default shadcn |
| `background/warning` | `--warning` | Extension |
| `background/info` | `--info` | Extension |
| `foreground/<same names>` | `--foreground`, `--<name>-foreground` | Text and icons on the matching background |
| `foreground/brand` | `--brand` | Text and icons in the brand color on the page: accent words in a headline, inline links, `Button` link. Never put `background/primary` on text. Light `neutral/900`, Dark `neutral/200`, Corporate Light `blue/700`, Corporate Dark `blue/400`; at least 4.5:1 on default, muted and card. Tailwind v4: `--color-brand: var(--brand)` in `@theme inline`, then `text-brand` |
| `border/default` | `--border` | |
| `border/input` | `--input` | |
| `border/ring` | `--ring` | Focus ring, usually follows the brand |
| `radius/base` | `--radius` | Brand roundness. `sm`, `md`, `xl` step around it, `lg` = base |
| `radius/sm`, `radius/md`, `radius/lg`, `radius/xl` | `--radius-sm` ... | |
| `font/sans`, `font/serif`, `font/mono` | `--font-sans` ... | Aliases to `type/family/*` |

Every `background/X` has a `foreground/X` partner. When you add a background role, add its
foreground and check contrast (4.5:1 for text, 3:1 for icons and borders) in both modes.

Status roles (`destructive`, `success`, `warning`, `info`) work two ways:
- As a fill: `background/X` with `foreground/X` on top (destructive button, success badge).
- As text or icon on a normal surface: `background/X` itself (`text-destructive` for an error
  message). That is why these tokens have the `TEXT_FILL` scope. `foreground/X` is never the
  error text color; it is the text on the filled background.

Both uses must pass 4.5:1. Run `/eggux:audit-tokens` to check all pairs.

### Themes (Semantic and Components modes)
| Mode | Look | Use |
|---|---|---|
| `Light`, `Dark` | shadcn neutral, primary near black, 8 px radius | Consumer, marketing, startup SaaS |
| `Corporate Light`, `Corporate Dark` | `color/blue/700` primary (`blue/600` in Dark), slate neutrals, `radius/base` 4 px, `border/input` slate/500, `foreground/muted` slate/600 | Enterprise, internal tools, finance, regulated industries |

Set Semantic and Components to the same mode on a frame. Corporate also sets the sidebar
(`sidebar/*`) and `button/destructive-hover`. Pair Corporate with Density `Compact` for
data-heavy screens. Corporate passes 4.5:1 for muted text on muted surfaces and 3:1 for input
borders, so the base exceptions below do not apply to it (warning as text stays an exception).
A client brand re-aliases the same tokens in the mode it starts from (`/eggux:brand-intake`).

### Known contrast exceptions in the base theme
The master library keeps these shadcn defaults on purpose. Build around them; a client can
fix them in its own file.

| Pair | Ratio | How to work with it |
|---|---|---|
| `background/warning` as text on the page (Light) | 2.15 | Never use warning as text color. Warning messages use the filled style (`background/warning` + `foreground/warning`) |
| `foreground/muted` on `background/muted` (Light) | 4.35 | Do not put muted text on muted surfaces; use `foreground/default` there |
| `border/input` on the page (Light 1.26, Dark 1.77) | below 3:1 | The input is still identified by its label and shadow. Clients with strict WCAG 1.4.11 needs re-alias it to `color/neutral/400`+ |

## Components (`Components`)

Current tokens:

| Token | Value | Why |
|---|---|---|
| `sidebar/*` | From shadcn | Sidebar surfaces |
| `chart/1..8` | Tailwind steps, same in Light and Dark (see Data visualization) | Chart series, fixed order |
| `button/primary-hover` | `background/primary` at `opacity/90` | shadcn `hover:bg-primary/90` |
| `button/secondary-hover` | `background/secondary` at `opacity/80` | shadcn `hover:bg-secondary/80` |
| `button/destructive-hover` | Light `color/red/700`, Dark `background/destructive` at `opacity/90` | 90% opacity failed 4.5:1 in Light |
| `dialog/overlay` | `color/black` at `opacity/50` | shadcn `bg-black/50` behind Dialog and Alert Dialog |
| `table/row-hover` | `background/muted` at `opacity/50` | shadcn `hover:bg-muted/50` |
| `table/row-expanded` | `background/muted` at `opacity/30` | Detail row under an expanded table row |
| `switch/thumb-unchecked` | Light `background/default`, Dark `foreground/default` | Thumb stays visible on the dark track |
| `badge/soft-{success,warning,destructive,info}-bg` | `background/{tone}` at `opacity/10` (Light, Corporate Light), `opacity/20` (Dark, Corporate Dark) | Badge soft fill |
| `badge/soft-neutral-bg` | `foreground/default` at `opacity/10` | Badge soft-neutral fill |
| `badge/soft-success-fg` | Light `color/green/800`, Dark `color/green/400` (Corporate same) | 6.2 / 7.2 : 1 on the soft fill |
| `badge/soft-warning-fg` | Light `color/amber/800`, Dark `color/amber/300` | 6.6 / 7.9 : 1 |
| `badge/soft-destructive-fg` | Light `color/red/700`, Dark `color/red/300` | 5.5 / 6.9 : 1 |
| `badge/soft-info-fg` | Light `color/blue/700`, Dark `color/blue/300` | 5.7 / 7.6 : 1 |
| `badge/soft-neutral-fg` | Light `color/neutral/700`, Dark `color/neutral/300`; Corporate `color/slate/700` / `color/slate/300` | 8.4 / 9.2 : 1 |
| `video/background` | `color/black`, same in Light and Dark | Video Player surface behind the frame |
| `video/foreground` | `color/white` | Icons, time and subtitles over video |
| `video/track` | `color/white` at `opacity/30` | Unplayed part of the progress bar |
| `video/scrim` | `color/black` at `opacity/60` | Play button, duration and subtitle backgrounds |
| `card/muted-background` | Light `color/neutral/50`; Dark, Corporate `background/muted` | Card Variant=muted; neutral/50 keeps muted text at 4.5:1 in Light |

Naming: `<component>/<property>`,
for example `button/radius`, `card/muted-background`. Sizes that change with density live in
the Density collection (`density/card-padding`). CSS: `--<component>-<property>`.

When a component needs a token:
1. Create it in `Components`, aliased to the Semantic token it currently uses.
2. Bind the component in Figma to the new token.
3. In code, replace the Tailwind class with the variable (`rounded-md` → `rounded-[var(--button-radius)]`).
4. Note the deviation in the client's `eggux/brand.md` overrides if it is client-specific.

## Data visualization

`chart/1..8` (CSS `--chart-1..8`), assigned in this order and never cycled:

| Slot | Primitive | Hex |
|---|---|---|
| 1 | `color/blue/600` | `#2563eb` |
| 2 | `color/orange/700` | `#c2410c` |
| 3 | `color/cyan/600` | `#0891b2` |
| 4 | `color/amber/700` | `#b45309` |
| 5 | `color/fuchsia/500` | `#d946ef` |
| 6 | `color/green/600` | `#16a34a` |
| 7 | `color/violet/500` | `#8b5cf6` |
| 8 | `color/rose/500` | `#f43f5e` |

Validated (OKLCH lightness band, chroma floor, CVD ΔE under protanopia/deuteranopia, normal-vision
ΔE, contrast) on `background/default` and `background/card` in Light and Dark: worst adjacent
CVD ΔE 20.0, normal-vision 26.1, every slot ≥ 3:1. The first 3 slots also pass all-pairs (ΔE 14.7),
so scatter plots and maps use at most 3 series. The shadcn defaults it replaced failed (two
adjacent ambers, ΔE 8.0).

Rules:
- Color follows the entity, never its rank; filtering must not repaint the remaining series.
- More than 8 series: fold into "Other" (`foreground/muted`) or use small multiples.
- Status in charts (good / bad) uses `background/success`, `warning`, `destructive` with an icon
  and a label, never a chart slot.
- Sequential (magnitude): one Tailwind ramp light to dark (`color/blue/100..900`). Diverging:
  `color/blue/*` and `color/red/*` arms with `color/neutral/200` (Dark `neutral/700`) in the middle.
- Text never takes the series color; grid `border/default`, baseline `border/input`, axis text
  `foreground/muted`, area wash = series at `opacity/10`.
- A client brand that changes the palette re-runs `/eggux:audit-tokens` (every `chart/N` at 3:1
  on page and card, in every mode) and checks that neighbours stay distinguishable for color
  blindness before shipping.

## Motion

Primitives `duration/0..1000` (ms) and `ease/linear|in|out|in-out` (Tailwind). Semantic:

| Token | Value | Use |
|---|---|---|
| `motion/duration/instant` | 75 ms | Hover, press, focus color changes |
| `motion/duration/fast` | 150 ms | Tooltips, menus, switches, checkboxes; exits |
| `motion/duration/normal` | 200 ms | Popovers, accordions, tabs, toasts |
| `motion/duration/slow` | 300 ms | Dialogs, sheets, drawers entering |
| `motion/duration/deliberate` | 500 ms | Large layout changes; rarely |
| `motion/ease/enter` | ease-out | Elements appearing |
| `motion/ease/exit` | ease-in | Elements leaving |
| `motion/ease/standard` | ease-in-out | Moving or resizing on screen |
| `motion/ease/linear` | linear | Spinners, progress, opacity loops |

Exits are faster than entries. Respect `prefers-reduced-motion`: replace movement with opacity or
no animation. Figma prototypes use the same durations; the tokens have no Figma scope (code only).

## Density

Collection `Density`, modes `Comfortable` (default) and `Compact`. Set the mode on a frame to
tighten a whole screen (data tables, admin tools, power users).

| Token | Comfortable | Compact | Bound to |
|---|---|---|---|
| `density/control-height` | 36 | 32 | Button (default size), Button Icon, Input, Select, Combobox, Date/Time Picker, Toggle Group Item |
| `density/table-header-height` | 40 | 32 | Table Cell header |
| `density/cell-padding-y` | 8 | 4 | Table Cell body |
| `density/list-padding-y` | 8 | 4 | List Item |
| `density/menu-padding-y` | 6 | 4 | Menu Item |
| `density/card-padding` | 24 | 16 | Card (Size=default): top and bottom on the card, left and right on each slot; Stat Card |
| `density/card-padding-sm` | 16 | 12 | Card (Size=sm), Option Card |
| `density/card-gap` | 24 | 16 | Space between Card Header, Content and Footer |
| `density/card-gap-sm` | 16 | 12 | Same, Size=sm |

Compact keeps touch targets ≥ 44 only on desktop: never use Compact on mobile.
Code: `[data-density="compact"]` sets the CSS variables.

## Content (strings)

Collection `Content`, STRING variables, modes `English` and `Română`: `brand/*` (company, legal
name, product, domain, support email, copyright), `action/*`, `status/*`, `feedback/*`,
`field/*`, `ai/*`, `legal/*`, `nav/*`. Code syntax is the i18n key (`t('action.save')`).
Rules and binding: `references/content.md`.

## Text styles

Contextual, bound to `font/*` and type primitives. Use these, never raw size/weight combinations.

| Style | Use |
|---|---|
| `display` | Marketing section headline, page hero inside an app (48) |
| `display/lg` | Hero headline on marketing pages (60); one per page |
| `display/xl` | Oversized hero or cover headline (72); rarely, one per page |
| `heading/h1` ... `heading/h4` | Page and section titles. One `h1` per screen |
| `body/lead` | Intro paragraph under a page title |
| `body/large` | Emphasized short text |
| `body/default` | Paragraphs |
| `body/small` | Secondary text, table cells |
| `ui/label` | Form labels, buttons, tabs |
| `ui/label-small` | Badges, compact labels (12/16 Medium) |
| `ui/caption` | Hints, metadata, timestamps |
| `ui/overline` | Uppercase eyebrow above a title |
| `code` | Inline code, IDs, technical values |

## Writing variables through Figma MCP

- Plain aliases (`{ type: 'VARIABLE_ALIAS', id }`) can be written with `use_figma`.
- Color alias combined with an opacity variable is stored as `{ color: alias, opacity: alias }`.
  Writing it through the API may be rejected; if so, ask the user to set it in the Figma UI.
- Always set `scopes` and the WEB code syntax on new variables.
