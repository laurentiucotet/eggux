# Tabs

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Tab](#tab) | 8 | - |
| [Tabs](#tabs) | 1 | Tabs |
| [Tabs Line](#tabs-line) | 1 | Tabs |

On the Figma page: "Example / in record header", "Stress test / Tabs", "Stress test / Tabs Line"

## Tab

Component set · 8 variants · default size 88 × 28

Tab trigger. Put inside Tabs. "pill" is shadcn TabsTrigger (inactive text uses foreground/default: muted on muted fails contrast). "line" for page-level sections. Usage: eggux build-ui/components/tabs.md

| Variant property | Values |
|---|---|
| Style | pill, line |
| State | default, active, focus, disabled |

| Property | Type | Default |
|---|---|---|
| Label | text | Overview |

Tokens and styles:
- Colors: `background/default`, `background/primary`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/1`, `spacing/3`, `spacing/7`, `spacing/9`
- Radius: `radius/md`
- Text styles: `ui/label`
- Effects: `shadow/sm`

Guides: [tabs](../../skills/build-ui/components/tabs.md)

## Tabs

Component · 1 variant · default size 263 × 36

shadcn TabsList. "Tabs" is a native slot of Tab instances. 2-6 tabs, selected tab in the URL. Usage: eggux build-ui/components/tabs.md

**Use for**

- Switching views inside a card or panel
- Views of the same object: Overview, Orders, Invoices
- 2-6 tabs

**Not for**

- Page-level sections: use Tabs Line
- Steps in a sequence: use Stepper
- Primary navigation: use Sidebar
- Setting a value (view mode, period): use Toggle Group

**Anatomy**

1. List: background/muted, radius/lg
2. Tabs slot: Tab instances (Style=pill)
3. Active Tab: background and shadow

**Content and behavior**

- Labels are one or two words, nouns; counts in a badge when useful ("Invoices 3")
- Exactly one Tab is active
- The selected tab is in the URL; switching back keeps filters and scroll
- Inactive text uses foreground/default: muted text on the muted list fails contrast
- Never hide what the main task needs behind a non-default tab
- Mobile: tabs scroll horizontally, never wrap

**Accessibility**

- Tab list role; arrow keys move between tabs, Tab moves into the panel
- The active tab has aria-selected; each panel is labeled by its tab
- Focus ring visible on Tab State=focus

Slots (fill them in the instance, never detach): `Tabs`

Built from: `Tab`

Tokens and styles:
- Colors: `background/muted`
- Spacing and size: `spacing/1`
- Radius: `radius/lg`

Guides: [tabs](../../skills/build-ui/components/tabs.md)

Code: shadcn `Tabs`, `ToggleGroup`

## Tabs Line

Component · 1 variant · default size 231 × 37

Underlined tabs for page-level sections. "Tabs" is a native slot of Tab instances. 2-6 tabs, selected tab in the URL. Usage: eggux build-ui/components/tabs.md

**Use for**

- Sections of a record page under its header
- Sub-views right under the page header
- Settings sections when there is no sidebar group

**Not for**

- Views inside a card or panel: use Tabs (pill)
- Steps in a sequence: use Stepper
- Primary navigation: use Sidebar

**Anatomy**

1. Tabs slot: Tab instances (Style=line)
2. Active Tab: underline in background/primary
3. Bottom border: border/default across the full width

**Content and behavior**

- 2-6 tabs; labels are one or two words, nouns
- Exactly one Tab is active
- The selected tab is in the URL; switching back keeps filters and scroll
- The page header stays visible on every tab
- Mobile: tabs scroll horizontally, never wrap

**Accessibility**

- Tab list role; arrow keys move between tabs, Tab moves into the panel
- The active tab has aria-selected; each panel is labeled by its tab
- Focus ring visible on Tab State=focus

Slots (fill them in the instance, never detach): `Tabs`

Built from: `Tab`

Tokens and styles:
- Colors: `border/default`
- Spacing and size: `spacing/4`

Guides: [tabs](../../skills/build-ui/components/tabs.md)
