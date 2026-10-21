# Separator

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Separator](#separator) | 6 | - |

On the Figma page: "Example / in notifications", "Stress test / Separator"

## Separator

Component set · 6 variants · default size 224 × 1

shadcn Separator. Horizontal fills its parent width; vertical fills its parent height (default 24). Spacing adds padding on both sides: sm = 4 (menus), md = 8. Use anywhere: menus, cards, sidebars, toolbars.

**Use for**

- Between groups inside cards, sidebars and popovers
- Vertical, between button groups in a toolbar
- Between sections of a Command Dialog or People Picker

**Not for**

- Inside a Menu: use Menu Separator
- Between every list item or every section of a page: use spacing or headings

**Anatomy**

1. Spacing before the line (Spacing: none, sm, md)
2. Line: border/default, 1 px (Orientation: horizontal, vertical)
3. Same spacing after the line

**Content and behavior**

- Horizontal fills its parent width; vertical fills its parent height (default 24)
- Spacing sm = 4 (menus), md = 8
- Separate groups, not single items
- Never nest cards to group content; use spacing or a Separator inside one card

**Accessibility**

- Decorative by default and hidden from screen readers
- Use the semantic separator role only between real sections
- Decorative dividers are exempt from the contrast rules

| Variant property | Values |
|---|---|
| Orientation | horizontal, vertical |
| Spacing | none, sm, md |

Tokens and styles:
- Colors: `border/default`
- Spacing and size: `border-width/DEFAULT`, `spacing/1`, `spacing/2`, `spacing/6`

Guides: [card](../../skills/build-ui/components/card.md), [dropdown-menu](../../skills/build-ui/components/dropdown-menu.md)

Code: shadcn `Separator`
