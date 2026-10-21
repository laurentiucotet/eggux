# Button

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Button](#button) | 72 | - |
| [Button Icon](#button-icon) | 20 | - |
| [Button Group Item](#button-group-item) | 12 | - |
| [Button Group](#button-group) | 1 | Items |
| [Split Button](#split-button) | 2 | - |

On the Figma page: "Example / in navbar", "Example / in navbar mobile", "Example / record actions", "Example / split button open", "Stress test / Button", "Stress test / Button Group", "Stress test / Button Icon", "Stress test / Split Button"

## Button

Component set · 72 variants · default size 69 × 32

shadcn Button. One "default" (primary) per view; "destructive" only inside a confirmation step. Label is a verb. Usage: eggux build-ui/components/button.md

**Use for**

- The single main action of a view or dialog: Variant=default
- Alternative actions: secondary; Cancel and back: outline
- Toolbar and low-emphasis actions in dense UI: ghost
- The confirming action of a destructive flow: destructive; text-like navigation in content: link

**Not for**

- Icon-only actions: use Button Icon with a tooltip
- Related actions of equal weight: use Button Group
- One main action with variants: use Split Button
- Choosing a value: use Toggle Group

**Anatomy**

1. Leading icon (optional, Leading icon type)
2. Label
3. Trailing icon (optional, Trailing icon type)

**Content and behavior**

- One Variant=default per view or dialog
- Label is a verb; verb + object when ambiguous ("Save customer")
- Dialogs and forms: secondary left, primary right
- destructive only inside the confirmation step; the trigger in a list is ghost or a menu item
- Loading keeps the width, shows a Spinner and blocks repeat clicks
- Disabled only when truly unavailable, with a reason nearby; never as form validation

**Accessibility**

- Reachable with Tab; Enter and Space activate; State=focus shows the border/ring focus ring
- Touch target at least 44 x 44 px on mobile
- Loading is announced ("Saving…")
- Text meets 4.5:1 in every Variant

| Variant property | Values |
|---|---|
| Variant | default, secondary, outline, ghost, destructive, link |
| Size | sm, default, lg |
| State | default, hover, focus, disabled |

| Property | Type | Default |
|---|---|---|
| Label | text | Button |
| Leading icon | boolean | false |
| Leading icon type | instance swap | Icon/plus |
| Trailing icon | boolean | false |
| Trailing icon type | instance swap | Icon/chevron-right |

Icons: chevron-right, plus

Tokens and styles:
- Colors: `background/accent`, `background/default`, `background/destructive`, `background/primary`, `background/secondary`, `border/input`, `button/destructive-hover`, `button/primary-hover`, `button/secondary-hover`, `foreground/accent`, `foreground/default`, `foreground/destructive`, `foreground/primary`, `foreground/secondary`
- Spacing and size: `density/control-height`, `spacing/10`, `spacing/1_5`, `spacing/2`, `spacing/3`, `spacing/4`, `spacing/6`, `spacing/8`
- Radius: `radius/md`
- Text styles: `ui/label`
- Effects: `shadow/xs`

Guides: [button](../../skills/build-ui/components/button.md), [action-feedback](../../skills/build-ui/patterns/action-feedback.md), [ai-chat](../../skills/build-ui/patterns/ai-chat.md), [loading-states](../../skills/build-ui/patterns/loading-states.md)

Code: shadcn `Button` (`size="icon"`) (`Leading icon` → icon child before the label)

## Button Icon

Component set · 20 variants · default size 36 × 36

Icon-only button, 36x36 (shadcn size="icon"). Always needs an accessible label in code and a tooltip with the same text. Usage: eggux build-ui/components/button.md, tooltip.md

**Use for**

- Toolbars, row actions and card menus (ellipsis)
- Message actions: Copy, Regenerate, Good response
- Carousel arrows, Calendar previous and next

**Not for**

- An action the icon does not explain: use Button with a Label
- The main action of a view: use Button Variant=default with a Label

**Anatomy**

1. Icon (instance swap, default ellipsis)
2. Container in the chosen Variant, 36 x 36
3. Tooltip with the same text as the accessible label

**Content and behavior**

- Always a tooltip with the same text as the accessible label
- Variant rules match Button: one default per view, destructive only in a confirmation
- ghost in toolbars and dense UI
- Copy turns the icon into a check for 2 s with the label "Copied"; no toast

**Accessibility**

- aria-label in code, same text as the tooltip
- The tooltip shows on hover and on keyboard focus
- Icon meets 3:1; touch target at least 44 x 44 px on mobile

| Variant property | Values |
|---|---|
| Variant | default, secondary, outline, ghost, destructive |
| State | default, hover, focus, disabled |

| Property | Type | Default |
|---|---|---|
| Icon | instance swap | Icon/ellipsis |

Icons: ellipsis

Tokens and styles:
- Colors: `background/accent`, `background/default`, `background/destructive`, `background/primary`, `background/secondary`, `border/input`, `button/destructive-hover`, `button/primary-hover`, `button/secondary-hover`
- Spacing and size: `density/control-height`
- Radius: `radius/md`
- Effects: `shadow/xs`

Guides: [button](../../skills/build-ui/components/button.md), [carousel](../../skills/build-ui/components/carousel.md)

Code: shadcn `Button` (`size="icon"`) (`Leading icon` → icon child before the label)

## Button Group Item

Component set · 12 variants · default size 80 × 36

One segment of a Button Group: first (left radius), middle, last (right radius). active = pressed/selected (bg accent). Icon-only: Show label off + Icon on, with a tooltip.

| Variant property | Values |
|---|---|
| Position | first, middle, last |
| State | default, hover, focus, disabled |

| Property | Type | Default |
|---|---|---|
| Label | text | Edit |
| Show label | boolean | true |
| Icon | boolean | false |
| Icon type | instance swap | Icon/pencil |

Icons: pencil

Tokens and styles:
- Colors: `background/accent`, `background/default`, `border/input`, `foreground/accent`, `foreground/default`
- Spacing and size: `density/control-height`, `spacing/2`, `spacing/3`
- Radius: `radius/md`
- Text styles: `ui/label`

Guides: [button](../../skills/build-ui/components/button.md)

## Button Group

Component · 1 variant · default size 240 × 36

Related actions joined in one control (shadcn Button Group): Edit / Duplicate / Archive, prev / next, zoom - / +. For choosing a value use Toggle Group; for one main action + options use Split Button.

**Use for**

- 2-5 related actions of equal weight
- Previous / next pairs
- Zoom out / zoom in

**Not for**

- Choosing a value or a view mode: use Toggle Group
- One main action plus variants: use Split Button
- Unrelated actions: use separate Buttons

**Anatomy**

1. Items slot of Button Group Items
2. Position: first (left radius), middle, last (right radius)
3. Label and optional Icon on each item; icon-only with Show label off

**Content and behavior**

- 2-5 items of equal weight
- Positions follow the order: first, middle, last
- Icon-only items always have a tooltip
- Never use it to set a value

**Accessibility**

- Wrap in role="group" with a label ("Invoice actions")
- Each item is its own tab stop with a visible focus ring
- Icon-only items have an aria-label matching the tooltip

Slots (fill them in the instance, never detach): `Items`

Built from: `Button Group Item`

Guides: [button](../../skills/build-ui/components/button.md)

Code: shadcn `ButtonGroup` or custom flex + `DropdownMenu`

## Split Button

Component set · 2 variants · default size 98 × 36

One main action + a menu of variants (Save / Save as draft, Save and close). The main part runs the most common choice; the chevron opens a Menu. Do not hide unrelated actions here.

**Use for**

- Save / Save as draft / Save and close
- A frequent default with less common variants of the same action
- Send now with Schedule send in the menu

**Not for**

- Unrelated or destructive actions: use separate Buttons or a Menu
- Actions of equal weight: use Button Group
- A single action: use Button

**Anatomy**

1. Main part with Label: runs the most common choice
2. Divider between the two parts
3. Chevron-down part: opens a Menu of variants of the same action

**Content and behavior**

- The main part runs the most common choice
- The menu holds variants of the same action only
- Never hide unrelated or destructive actions in it
- Variant=default when it is the primary action of the view; outline otherwise

**Accessibility**

- Two buttons: the action and a menu button with its own label ("More save options")
- The chevron has aria-haspopup and aria-expanded
- Enter, Space or arrow down opens the menu; Esc closes it and returns focus

| Variant property | Values |
|---|---|
| Variant | default, outline |

| Property | Type | Default |
|---|---|---|
| Label | text | Save |

Icons: chevron-down

Tokens and styles:
- Colors: `background/default`, `background/primary`, `border/input`, `foreground/default`, `foreground/primary`
- Spacing and size: `border-width/DEFAULT`, `density/control-height`, `spacing/3`, `spacing/4`, `spacing/9`
- Radius: `radius/md`
- Text styles: `ui/label`

Guides: [button](../../skills/build-ui/components/button.md)

Code: shadcn `ButtonGroup` or custom flex + `DropdownMenu`
