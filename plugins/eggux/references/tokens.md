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

Naming: `<component>/<property>`,
for example `button/radius`, `card/padding`. CSS: `--<component>-<property>`.

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
- A client brand that changes the palette re-runs the validator (dataviz skill
  `validate_palette.js`) in both modes before shipping.

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

Compact keeps touch targets ≥ 44 only on desktop: never use Compact on mobile.
Code: `[data-density="compact"]` sets the CSS variables.

## Text styles

Contextual, bound to `font/*` and type primitives. Use these, never raw size/weight combinations.

| Style | Use |
|---|---|
| `display` | Hero, marketing headline |
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
