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

## Components (`Components`)

Current tokens: `sidebar/*` (from shadcn) and `chart/1..5`. Naming: `<component>/<property>`,
for example `button/radius`, `card/padding`. CSS: `--<component>-<property>`.

When a component needs a token:
1. Create it in `Components`, aliased to the Semantic token it currently uses.
2. Bind the component in Figma to the new token.
3. In code, replace the Tailwind class with the variable (`rounded-md` → `rounded-[var(--button-radius)]`).
4. Note the deviation in the client's `eggux/brand.md` overrides if it is client-specific.

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
| `ui/caption` | Hints, metadata, timestamps |
| `ui/overline` | Uppercase eyebrow above a title |
| `code` | Inline code, IDs, technical values |

## Writing variables through Figma MCP

- Plain aliases (`{ type: 'VARIABLE_ALIAS', id }`) can be written with `use_figma`.
- Color alias combined with an opacity variable is stored as `{ color: alias, opacity: alias }`.
  Writing it through the API may be rejected; if so, ask the user to set it in the Figma UI.
- Always set `scopes` and the WEB code syntax on new variables.
