# Tabs

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Tabs](#tabs) | 1 | Tabs |
| [Tab](#tab) | 12 | - |
| [Tabs Line](#tabs-line) | 1 | Tabs |
| [Tabs Vertical](#tabs-vertical) | 1 | Tabs |

On the Figma page: "Example / in record header", "Example / settings with vertical tabs", "Example / tabs with counts", "Stress test / Tabs", "Stress test / Tabs Line", "Stress test / Tabs Vertical"

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
4. Count: Show count on Tab adds a Badge Count (exposed) after the label
5. Show icon on Tab adds a 16 px icon before the label (Icon swap)

**Content and behavior**

- Labels are one or two words, nouns; counts in the Tab's Badge Count (Show count), never in the label
- Exactly one Tab is active
- The selected tab is in the URL; switching back keeps filters and scroll
- Inactive text uses foreground/default: muted text on the muted list fails contrast
- Never hide what the main task needs behind a non-default tab
- Mobile: tabs scroll horizontally, never wrap
- Icons on all tabs or none

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

## Tab

Component set · 12 variants · default size 88 × 28

Tab trigger. Put inside Tabs. "pill" is shadcn TabsTrigger (inactive text uses foreground/default: muted on muted fails contrast). "line" for page-level sections. Show count adds a Badge Count (exposed) after the label for the number of items behind the tab ("Guides 64"); write the number in the badge, never in the label. Usage: eggux build-ui/components/tabs.md vertical: full-width rows for Tabs Vertical. Show icon adds a 16 px icon before the label.

| Variant property | Values |
|---|---|
| Style | pill, line, vertical |
| State | default, active, focus, disabled |

| Property | Type | Default |
|---|---|---|
| Label | text | Overview |
| Show count | boolean | false |
| Icon | instance swap | Icon/house |
| Show icon | boolean | false |

Built from: `Badge Count`. Icons: house

Tokens and styles:
- Colors: `background/default`, `background/muted`, `background/primary`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/1`, `spacing/1_5`, `spacing/3`, `spacing/7`, `spacing/8`, `spacing/9`
- Radius: `radius/md`
- Text styles: `ui/label`
- Effects: `shadow/sm`

Guides: [tabs](../../skills/build-ui/components/tabs.md)

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
- Counts per tab with Show count on Tab ("Guides 64") on search results and lists

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

## Tabs Vertical

Component · 1 variant · default size 200 × 140

Tabs stacked in a column for settings and long forms with 4-10 sections: Tab Style=vertical in the Tabs slot, 200 wide. The active tab has a muted fill. Use when the section names are long or there are more than 5; on mobile it becomes a Select or a list that opens each section.

**Use for**

- Settings with 4-10 sections
- Long forms split into sections
- Section names too long for horizontal tabs

**Not for**

- 2-5 short sections: use Tabs
- Navigation between pages of the app: use Sidebar
- Steps that must be done in order: use Stepper

**Anatomy**

1. Tabs slot: Tab Style=vertical, full width
2. Active tab: background/muted
3. Optional icon and count on each Tab

**Content and behavior**

- Exactly one active tab, matching the section shown
- 200 wide; the content sits on the right with a 48 gap
- The selected section is in the URL
- Mobile: a Select or a list that opens each section

**Accessibility**

- role=tablist with aria-orientation=vertical
- Arrow up and down move between tabs
- The active tab has aria-selected=true

Slots (fill them in the instance, never detach): `Tabs`

Built from: `Tab`

Tokens and styles:
- Spacing and size: `spacing/1`
