# Separator

Generated from the EGG UI master library on 2026-10-29 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Separator](#separator) | 6 | Label |

On the Figma page: "Example / Separator styles", "Stress test / Separator"

## Separator

Component set · 6 variants · default size 224 × 1

shadcn Separator. Horizontal fills its parent width; vertical fills its parent height (default 24). Spacing adds padding on both sides: sm = 4 (menus), md = 8. Use anywhere: menus, cards, sidebars, toolbars.


Show label (horizontal): puts the Label slot in the middle of the line, with "or continue with" (ui/caption, foreground/muted) by default. Replace it with a date ("Today"), a marker ("New messages") or a ghost sm Button ("Show 3 more"). Show start line off puts the label at the start: a group heading inside a card or a thread ("Earlier"). Labels are short, one line.


Usage: eggux build-ui/components/card.md

**Use for**

- Between groups inside cards, sidebars and popovers
- Vertical, between button groups in a toolbar
- Between sections of a Command Dialog or People Picker
- With a label: "or continue with" in sign in, "Today" and "New messages" in threads, "Show 3 more" in lists (Show label)

**Not for**

- Inside a Menu: use Menu Separator
- Between every list item or every section of a page: use spacing or headings

**Anatomy**

1. Spacing before the line (Spacing: none, sm, md)
2. Line: border/default, 1 px (Orientation: horizontal, vertical)
3. Label slot (Show label, horizontal only): "or continue with" in ui/caption, foreground/muted, or a ghost sm Button
4. Start line (Show start line): off puts the label at the start
5. Same spacing after the line

**Content and behavior**

- Horizontal fills its parent width; vertical fills its parent height (default 24)
- Spacing sm = 4 (menus), md = 8
- Separate groups, not single items
- Never nest cards to group content; use spacing or a Separator inside one card
- Labels are short and one line; one label per separator
- Show start line off only with Show label on, for a heading at the start of a group ("Earlier")
- A button in the label ("Show 3 more") is a ghost sm Button; a date in a thread is plain text

**Accessibility**

- Decorative by default and hidden from screen readers
- Use the semantic separator role only between real sections
- Decorative dividers are exempt from the contrast rules
- A labelled separator between sections reads its text; a button inside it is a normal button

| Variant property | Values |
|---|---|
| Orientation | horizontal, vertical |
| Spacing | none, sm, md |

| Property | Type | Default |
|---|---|---|
| Show label | boolean | false |
| Show start line | boolean | true |

Slots (fill them in the instance, never detach): `Label`

Tokens and styles:
- Colors: `border/default`, `foreground/muted`
- Spacing and size: `border-width/DEFAULT`, `spacing/1`, `spacing/2`, `spacing/3`, `spacing/6`
- Text styles: `ui/caption`

Guides: [button](../../skills/build-ui/components/button.md), [card](../../skills/build-ui/components/card.md), [dropdown-menu](../../skills/build-ui/components/dropdown-menu.md), [rich-text-editor](../../skills/build-ui/components/rich-text-editor.md)

Code: shadcn `Separator`
