# Button

Generated from the EGG UI master library on 2026-10-26 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Button](#button) | 105 | - |
| [Button Icon](#button-icon) | 72 | - |
| [Button Group](#button-group) | 1 | Items |
| [Button Group Item](#button-group-item) | 12 | - |
| [Split Button](#split-button) | 2 | - |
| [Action Bar](#action-bar) | 3 | Leading, Actions |
| [Social Share](#social-share) | 1 | - |

On the Figma page: "Example / AI action", "Example / Button styles", "Example / form footer", "Example / record actions", "Example / scroll to top", "Example / share row at the end of an article", "Example / sign-in providers", "Example / split button open", "Example / wishlist", "Stress test / Action Bar", "Stress test / Button", "Stress test / Button Group", "Stress test / Button Icon", "Stress test / Social Share", "Stress test / Split Button"

## Button

Component set · 105 variants · default size 78 × 36

shadcn Button. One "default" (primary) per view; "destructive" only inside a confirmation step. Label is a verb.


Variant=soft: a primary tint (button/soft-bg, hover button/soft-hover) with foreground/brand text. Use it for brand-colored secondary actions that must not compete with the one default button: Add line item, Import CSV, a call to action on a card. Quieter than default, louder than secondary.


State=loading: spinner instead of the leading icon, same width; blocks repeat clicks. Variant=link has no side padding in every Size, so its text lines up with the text column; the focus ring stays.


Usage: eggux build-ui/components/button.md

**Use for**

- The single main action of a view or dialog: Variant=default
- A brand-colored action that must not compete with the main one (Add line item, Import CSV, a call to action on a card): Variant=soft
- Alternative actions: secondary; Cancel and back: outline
- Toolbar and low-emphasis actions in dense UI: ghost
- The confirming action of a destructive flow: destructive; text-like navigation in content: link

**Not for**

- Icon-only actions: use Button Icon with a tooltip
- Related actions of equal weight: use Button Group
- One main action with variants: use Split Button
- Choosing a value: use Toggle Group

**Anatomy**

1. Leading icon (optional, Leading icon)
2. Label
3. Trailing icon (optional, Trailing icon)
4. State=loading: a spinning loader replaces the leading icon; width stays
5. Variant=link: label, icons and hover underline use foreground/brand; no fill and no side padding in every Size, so the text lines up with the text column above it
6. Variant=soft: fill button/soft-bg (background/primary at 10%, 20% in dark), hover button/soft-hover (one step stronger); label and icons foreground/brand; no shadow

**Content and behavior**

- One Variant=default per view or dialog
- Label is a verb; verb + object when ambiguous ("Save customer")
- Dialogs and forms: secondary left, primary right
- destructive only inside the confirmation step; the trigger in a list is ghost or a menu item
- Loading (State=loading) keeps the width and the label ("Saving…" when it helps), shows the spinner and blocks repeat clicks
- Disabled only when truly unavailable, with a reason nearby; never as form validation
- Variant=link text and icons are foreground/brand (text-brand), never background/primary
- soft is quieter than default and louder than secondary: use it for the second most important action, or several equal brand actions in one card
- Never two soft Buttons next to one default Button in the same group; pick soft or secondary for the group
- soft text and icons are foreground/brand, never background/primary
- Variant=link has no side padding: place it in the text column, never add padding back by hand; the focus ring hugs the label

**Accessibility**

- Reachable with Tab; Enter and Space activate; State=focus shows the border/ring focus ring
- Touch target at least 44 x 44 px on mobile
- Loading is announced ("Saving…")
- Text meets 4.5:1 in every Variant; link (foreground/brand) passes 4.5:1 on background/default, muted and card in every theme
- soft: foreground/brand on button/soft-bg is 5.8:1 Light, 6.7:1 Dark, 5.7:1 Corporate Light; on hover 5.1, 5.9, 4.9. The fill boundary is about 1.2:1, so the label carries the meaning, as for ghost

| Variant property | Values |
|---|---|
| Variant | default, secondary, outline, ghost, destructive, link, soft |
| Size | sm, default, lg |
| State | default, hover, focus, disabled, loading |

| Property | Type | Default |
|---|---|---|
| Label | text | Button |
| Show leading icon | boolean | false |
| Leading icon | instance swap | Icon/plus |
| Show trailing icon | boolean | false |
| Trailing icon | instance swap | Icon/chevron-right |

Icons: chevron-right, loader-circle, plus

Tokens and styles:
- Colors: `background/accent`, `background/default`, `background/destructive`, `background/primary`, `background/secondary`, `border/input`, `button/destructive-hover`, `button/primary-hover`, `button/secondary-hover`, `button/soft-bg`, `button/soft-hover`, `foreground/accent`, `foreground/brand`, `foreground/default`, `foreground/destructive`, `foreground/primary`, `foreground/secondary`
- Spacing and size: `density/control-height`, `spacing/0`, `spacing/10`, `spacing/1_5`, `spacing/2`, `spacing/3`, `spacing/4`, `spacing/6`, `spacing/8`
- Radius: `button/radius`
- Text styles: `ui/label`
- Effects: `shadow/xs`

Guides: [button](../../skills/build-ui/components/button.md), [action-feedback](../../skills/build-ui/patterns/action-feedback.md), [ai-chat](../../skills/build-ui/patterns/ai-chat.md), [auth](../../skills/build-ui/patterns/auth.md), [loading-states](../../skills/build-ui/patterns/loading-states.md)

Code: shadcn `Button` (`variant`, `size`) (`Show leading icon` → icon child before the label; State=loading → spinner + `disabled`)

## Button Icon

Component set · 72 variants · default size 36 × 36

Icon-only button, 36x36 (shadcn size="icon"). Always needs an accessible label in code and a tooltip with the same text. Size: sm 32 (tables, dense toolbars), default 36, lg 40 (next to lg Buttons). Variant=soft (button/soft-bg, foreground/brand icon) next to soft Buttons or for a brand-colored icon action without a solid fill.


Usage: eggux build-ui/components/button.md, tooltip.md

**Use for**

- Toolbars, row actions and card menus (ellipsis)
- Message actions: Copy, Regenerate, Good response
- Carousel arrows, Calendar previous and next

**Not for**

- An action the icon does not explain: use Button with a Label
- The main action of a view: use Button Variant=default with a Label

**Anatomy**

1. Icon (instance swap, default ellipsis)
2. Container in the chosen Variant (default, secondary, outline, ghost, destructive, soft): Size sm 32, default 36, lg 40
3. Tooltip with the same text as the accessible label

**Content and behavior**

- Always a tooltip with the same text as the accessible label
- Variant rules match Button: one default per view, destructive only in a confirmation
- ghost in toolbars and dense UI
- Copy turns the icon into a check for 2 s with the label "Copied"; no toast
- Size matches the Buttons next to it: sm in tables and dense toolbars, lg next to lg Buttons in heroes
- Variant=soft (button/soft-bg, foreground/brand icon) next to soft Buttons, or for a brand-colored icon action without a solid fill

**Accessibility**

- aria-label in code, same text as the tooltip
- The tooltip shows on hover and on keyboard focus
- Icon meets 3:1; touch target at least 44 x 44 px on mobile
- soft icon: foreground/brand on button/soft-bg meets 3:1 in every theme (5.7:1 or more)

| Variant property | Values |
|---|---|
| Variant | default, secondary, outline, ghost, destructive, soft |
| Size | default, sm, lg |
| State | default, hover, focus, disabled |

| Property | Type | Default |
|---|---|---|
| Icon | instance swap | Icon/ellipsis |

Icons: ellipsis

Tokens and styles:
- Colors: `background/accent`, `background/default`, `background/destructive`, `background/primary`, `background/secondary`, `border/input`, `button/destructive-hover`, `button/primary-hover`, `button/secondary-hover`, `button/soft-bg`, `button/soft-hover`
- Spacing and size: `density/control-height`, `spacing/10`, `spacing/8`
- Radius: `button/radius`
- Effects: `shadow/xs`

Guides: [button](../../skills/build-ui/components/button.md), [carousel](../../skills/build-ui/components/carousel.md), [navigation](../../skills/build-ui/components/navigation.md), [commerce](../../skills/build-ui/patterns/commerce.md)

Code: shadcn `Button size="icon"` with `aria-label`, wrapped in `Tooltip` (Same `variant` values as Button; tooltip text = aria-label)

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
| Show icon | boolean | false |
| Icon | instance swap | Icon/pencil |

Icons: pencil

Tokens and styles:
- Colors: `background/accent`, `background/default`, `border/input`, `foreground/accent`, `foreground/default`
- Spacing and size: `density/control-height`, `spacing/2`, `spacing/3`
- Radius: `button/radius`
- Text styles: `ui/label`

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
- Radius: `button/radius`
- Text styles: `ui/label`

Guides: [button](../../skills/build-ui/components/button.md)

Code: shadcn `ButtonGroup` or custom flex + `DropdownMenu`

## Action Bar

Component set · 3 variants · default size 560 × 36

The row of buttons that ends a form, a dialog body, a step or a hero: Actions slot (primary and secondary), optional Leading slot (Back, Delete) and divider above. end for forms and steps (secondary left of primary: Cancel, Save); start for heroes and page headers (primary first: Get started, Talk to sales); center under centered heroes and CTAs. One primary per bar. Dialog footers use the Dialog's own footer; a sticky bar for unsaved changes is Save Bar.

**Use for**

- The end of a form or a settings section (Align=end)
- The buttons of a hero or a page header (Align=start)
- Under a centered hero, CTA or empty state (Align=center)
- Back on the left and Next on the right in a wizard step (Show leading)

**Not for**

- The footer of a Dialog: use the Dialog's own footer
- Unsaved changes that follow the scroll: use Save Bar
- Related actions joined in one control: use Button Group

**Anatomy**

1. Divider above (Show divider)
2. Leading slot (Show leading): Back, Delete, Remove
3. Actions slot: secondary and primary Buttons
4. Align: end, start, center

**Content and behavior**

- One primary button per bar
- end: secondary left of primary (Cancel, Save); start and center: primary first
- Destructive actions go in Leading, away from the primary
- Same button Size inside one bar

**Accessibility**

- Tab order follows the visual order
- The primary action is the submit button of the form
- Disabled buttons explain why in a hint or a Tooltip

| Variant property | Values |
|---|---|
| Align | end, start, center |

| Property | Type | Default |
|---|---|---|
| Show divider | boolean | false |
| Show leading | boolean | false |

Slots (fill them in the instance, never detach): `Leading`, `Actions`

Built from: `Button`

Tokens and styles:
- Colors: `border/default`
- Spacing and size: `spacing/2`, `spacing/4`

Guides: [button](../../skills/build-ui/components/button.md)

Code: `<div class="flex gap-2 justify-end">` of shadcn `Button` (justify-start, justify-center) (Leading button with `mr-auto`; one primary)

## Social Share

Component · 1 variant · default size 279 × 32

Share buttons for a public page: copy link, email, the system share sheet, and up to three networks your audience uses. Copy link confirms with a Toast. Replace the letter marks with the networks' official logos in product. Inside the app, sharing with people uses the Sharing page components.

**Use for**

- Articles, blog posts and changelog entries
- Public event, job or product pages
- The end of a public report or case study

**Not for**

- Sharing a record with people in the workspace: use Share Link Row
- A link people copy and paste: use Copy Field
- Inviting teammates: use Invite Row

**Anatomy**

1. Label (Show label): "Share", body/small, muted
2. Copy link: Button Icon
3. Email: Button Icon
4. Share: Button Icon (system share sheet)
5. Networks (Show networks): up to three network marks

**Content and behavior**

- Copy link first; it confirms with a Toast ("Link copied")
- Up to three networks the audience uses
- Replace the letter marks with the networks' official logos in product
- The system share button shows only where the browser supports it
- Shared links open with a title, description and image (Open Graph)

**Accessibility**

- Each button has an aria-label: "Copy link", "Share by email", "Share on LinkedIn"
- Network links that open a new window say so ("opens in a new tab")
- Icons meet 3:1 against the background

| Property | Type | Default |
|---|---|---|
| Label | text | Share |
| Show label | boolean | true |
| Show networks | boolean | true |

Built from: `Button Icon`

Tokens and styles:
- Colors: `border/default`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/2`
- Radius: `radius/md`
- Text styles: `ui/label`

Guides: [sharing-and-invites](../../skills/build-ui/patterns/sharing-and-invites.md)

Code: shadcn `Button size="icon"`; `navigator.clipboard`, `mailto:`, `navigator.share`, network share URLs (Copy link confirms with Sonner; official network logos)
