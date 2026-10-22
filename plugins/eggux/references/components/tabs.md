# Tabs

Generated from the EGG UI master library on 2026-10-22 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Tab](#tab) | 12 | - |
| [Tabs](#tabs) | 3 | Tabs |

On the Figma page: "Example / settings with vertical tabs", "Example / tabs with counts", "Stress test / Tabs"

## Tab

Component set · 12 variants · default size 88 × 28

Tab trigger. Put inside Tabs, with the same Variant as the Tabs. "default" is shadcn TabsTrigger (inactive text uses foreground/default: muted on muted fails contrast). "line" for page-level sections. Show count adds a Badge Count (exposed) after the label for the number of items behind the tab ("Guides 64"); write the number in the badge, never in the label. "vertical": full-width rows for Tabs Variant=vertical. Show icon adds a 16 px icon before the label. Usage: eggux build-ui/components/tabs.md

| Variant property | Values |
|---|---|
| Variant | line, vertical, default |
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

Code: shadcn `Tabs` (`TabsList`, `TabsTrigger`) (Variant=line: `TabsList` with a bottom border (`border-b`); Variant=vertical: `orientation="vertical"`, `TabsList` as `flex-col`, a `Select` of sections on mobile)

## Tabs

Component set · 3 variants · default size 263 × 36

Tab list with a Tabs slot of Tab instances. Variant=default is the pill style for switching views in a card or a toolbar; line for page-level sections under a header; vertical for settings pages with many sections (use Tab Variant=vertical inside). One Tab active at a time; arrow keys move between tabs. More than 6 tabs or long labels on mobile: use a Select.

**Use for**

- Views inside a card or panel (Variant=default)
- Sections of a record page under its header (Variant=line)
- Settings and long forms with 4-10 sections (Variant=vertical)

**Not for**

- Steps in a sequence: use Stepper
- Navigation between pages of the app: use Sidebar
- Setting a value (view mode, period): use Toggle Group

**Anatomy**

1. Tabs slot: Tab instances with the matching Tab Variant (default, line, vertical)
2. Active Tab: background and shadow (default), underline in background/primary (line), background/muted (vertical)
3. Count: Show count on Tab adds a Badge Count after the label

**Content and behavior**

- 2-6 tabs horizontally, up to 10 vertically; labels are one or two words, nouns
- Exactly one active tab, matching the content shown
- Variant=line spans the full width with a bottom border; vertical is 200 wide with the content on the right
- More tabs than fit on mobile: switch to a Select

**Accessibility**

- Tab list role; arrow keys move between tabs, Tab moves into the panel
- The active tab has aria-selected; each panel is labeled by its tab
- Focus ring visible on Tab State=focus

| Variant property | Values |
|---|---|
| Variant | default, line, vertical |

Slots (fill them in the instance, never detach): `Tabs`

Built from: `Tab`

Tokens and styles:
- Colors: `background/muted`, `border/default`
- Spacing and size: `spacing/1`, `spacing/4`
- Radius: `radius/lg`

Guides: [tabs](../../skills/build-ui/components/tabs.md)

Code: shadcn `Tabs` (`TabsList`, `TabsTrigger`) (Variant=line: `TabsList` with a bottom border (`border-b`); Variant=vertical: `orientation="vertical"`, `TabsList` as `flex-col`, a `Select` of sections on mobile)
