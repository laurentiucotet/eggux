# Tabs

Generated from the EGG UI master library on 2026-10-29 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Tab](#tab) | 40 | - |
| [Tabs](#tabs) | 5 | Tabs, Panel |

On the Figma page: "Example / Tabs overflow and sizes", "Example / Tabs styles", "Example / settings with vertical tabs", "Example / tabs with counts", "Stress test / Tabs"

## Tab

Component set · 40 variants · default size 89 × 28

Tab trigger. Put inside Tabs, with the same Variant as the Tabs. "default" is shadcn TabsTrigger (inactive text uses foreground/default: muted on muted fails contrast). "line" for page-level sections. "vertical": full-width rows for Tabs Variant=vertical. "pills": 32 high, active background/primary with foreground/primary, inactive foreground/muted. "boxed": folder tab, active has border/default on three sides and background/default and covers the panel line. Show count adds a Badge Count (exposed) after the label; write the number in the badge, never in the label. Show icon adds a 16 px icon before the label.


Size: default, sm (4 px lower, tighter side padding) for card headers, side panels, comments panels and toolbars. Use one Size for every Tab in a Tabs.


Usage: eggux build-ui/components/tabs.md

| Variant property | Values |
|---|---|
| Variant | line, vertical, default, pills, boxed |
| State | default, active, focus, disabled |
| Size | default, sm |

| Property | Type | Default |
|---|---|---|
| Label | text | Overview |
| Show count | boolean | false |
| Icon | instance swap | Icon/house |
| Show icon | boolean | false |

Built from: `Badge Count`. Icons: house

Tokens and styles:
- Colors: `background/default`, `background/muted`, `background/primary`, `border/default`, `foreground/default`, `foreground/muted`, `foreground/primary`
- Spacing and size: `spacing/1`, `spacing/1_5`, `spacing/2_5`, `spacing/3`, `spacing/4`, `spacing/6`, `spacing/7`, `spacing/8`, `spacing/9`
- Radius: `button/radius`, `radius/md`
- Text styles: `ui/label`
- Effects: `shadow/sm`

Guides: [tabs](../../skills/build-ui/components/tabs.md)

Code: shadcn `Tabs` (`TabsList`, `TabsTrigger`) (Variant=line: `TabsList` with a bottom border (`border-b`); Variant=vertical: `orientation="vertical"`, `TabsList` as `flex-col`, a `Select` of sections on mobile)

## Tabs

Component set · 5 variants · default size 266 × 36

Tab list with a Tabs slot of Tab instances (same Variant inside). default: pill tabs in a muted track for views in a card or toolbar; line: page-level sections under a header; vertical: settings pages with many sections; pills: bare pill tabs without a track, active filled with background/primary, for list filters on background or card; boxed: folder tabs on a bordered panel, put the content in the Panel slot. One Tab active at a time; arrow keys move between tabs. More than 6 tabs or long labels on mobile: use a Select.


Show overflow (default, line, pills, boxed) adds a "More" Tab with an ellipsis after the tabs; it opens a Menu with the tabs that do not fit. Use it when a page has more than 5 to 6 tabs or the Tabs sit in a narrow column; the active tab always stays visible, so move it out of the menu when it is picked. For dense headers set Size=sm on every Tab.


Usage: eggux build-ui/components/tabs.md

**Use for**

- Views inside a card or panel (Variant=default)
- Sections of a record page under its header (Variant=line)
- Settings and long forms with 4-10 sections (Variant=vertical)
- Filters of one list shown as tabs on a page without a card (Variant=pills): All, Paid, Overdue
- Content that should read as one bordered unit with its tabs, such as code samples or a settings panel (Variant=boxed)

**Not for**

- Steps in a sequence: use Stepper
- Navigation between pages of the app: use Sidebar
- Setting a value (view mode, period): use Toggle Group

**Anatomy**

1. Tabs slot: Tab instances with the matching Tab Variant (default, line, vertical, pills, boxed)
2. Active Tab: background and shadow (default), underline in background/primary (line), background/muted (vertical), background/primary fill with foreground/primary text (pills), border/default on three sides and background/default (boxed)
3. Count: Show count on Tab adds a Badge Count after the label
4. Variant=boxed: header row (Tabs slot + a rest line in border/default) and a Panel slot with border/default on the sides and bottom, padding density/card-padding-sm
5. Show overflow (default, line, pills, boxed): a "More" Tab with an ellipsis after the tabs; it opens a Menu with the tabs that do not fit
6. Tab Size: default, sm (4 px lower, tighter side padding) set on every Tab in the slot

**Content and behavior**

- 2-6 tabs horizontally, up to 10 vertically; labels are one or two words, nouns
- Exactly one active tab, matching the content shown
- Variant=line spans the full width with a bottom border; vertical is 200 wide with the content on the right
- pills: no track; use on background/default or background/card, never on muted surfaces (inactive text is foreground/muted)
- boxed: the active tab covers the panel's top line; put the panel content in the Panel slot, not under the component
- More tabs than fit: Show overflow with the rest in a Menu; on mobile switch to a Select
- The active tab is always visible; when it is picked from the menu it moves into the row
- Size=sm for card headers, side panels, comments panels and toolbars; one Size per Tabs

**Accessibility**

- Tab list role; arrow keys move between tabs, Tab moves into the panel
- The active tab has aria-selected; each panel is labeled by its tab
- Focus ring visible on Tab State=focus
- pills: active text 5.2:1 Light, 5.2:1 Dark, 6.7:1 Corporate Light; inactive foreground/muted 4.7:1 or more on the page
- More is a menu button (aria-haspopup="menu") labelled "More tabs"

| Variant property | Values |
|---|---|
| Variant | default, line, vertical, pills, boxed |

| Property | Type | Default |
|---|---|---|
| Show overflow | boolean | false |

Slots (fill them in the instance, never detach): `Tabs`, `Panel`

Built from: `Tab`

Tokens and styles:
- Colors: `background/default`, `background/muted`, `border/default`, `foreground/muted`
- Spacing and size: `density/card-padding-sm`, `spacing/1`, `spacing/2`, `spacing/4`
- Radius: `button/radius`
- Text styles: `body/small`

Guides: [tabs](../../skills/build-ui/components/tabs.md)

Code: shadcn `Tabs` (`TabsList`, `TabsTrigger`) (Variant=line: `TabsList` with a bottom border (`border-b`); Variant=vertical: `orientation="vertical"`, `TabsList` as `flex-col`, a `Select` of sections on mobile)
