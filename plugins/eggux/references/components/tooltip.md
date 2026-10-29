# Tooltip

Generated from the EGG UI master library on 2026-10-29 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Tooltip](#tooltip) | 8 | - |
| [Info Tip](#info-tip) | 2 | - |
| [Info Tip Trigger](#info-tip-trigger) | 4 | - |

On the Figma page: "Example / Info Tip", "Example / Tooltip styles", "Example / icon button with tooltip", "Example / rich tooltip and shortcut", "Stress test / Info Tip", "Stress test / Tooltip"

## Tooltip

Component set · 8 variants · default size 115 × 33

shadcn Tooltip. Side = where the tooltip sits relative to its trigger. Plain text, one line (or a title and up to three lines when rich); same text as the accessible label of icon-only buttons. Rich: Show title adds a title, text wraps at 280. Show shortcut adds a Kbd (exposed) after the text.


Variant: default (primary fill, the standard), light (popover surface with border and shadow/md, bordered arrow; for dense data screens, charts and editors where a filled tooltip is too loud, and on dark or colored areas). Use one Variant per product.


Usage: eggux build-ui/components/tooltip.md

**Use for**

- Name of every icon-only button
- A one-line hint on a control
- Full timestamp on a relative time, or the full text of a truncated label
- Reason a control is disabled and how to fix it
- Variant=light: dense data screens, charts and editors where a filled tooltip is too loud, and over dark or colored areas

**Not for**

- Interactive content: use Popover
- Preview of a person or record: use Hover Card
- Help for a field: hint text under the field
- Pointing out a new feature: use Coachmark

**Anatomy**

1. Trigger
2. Title (Show title): ui/label, for a rich tooltip
3. Label: plain text, wraps at 280
4. Kbd (Show shortcut, exposed): the keyboard shortcut
5. Arrow pointing at the trigger (Side)
6. Variant: default (background/primary fill) or light (background/popover, border/default 1 px, shadow/md, bordered arrow; text foreground/popover)

**Content and behavior**

- Same text as the accessible label of the icon-only button
- Plain text: one line, or a title and up to three lines in a rich tooltip; never links or buttons
- Appears on hover and on keyboard focus, after a short delay
- Never holds information needed to finish the task
- Touch has no hover: the content must also be reachable another way
- Show the shortcut when the action has one (Search ⌘K)
- One Variant per product

**Accessibility**

- Shows on keyboard focus; Escape hides it
- Tied to the trigger with aria-describedby, or its text is the button's aria-label
- Text on background/primary (default) and on background/popover (light) meets 4.5:1
- The shortcut Kbd uses foreground/default text on background/muted (4.5:1 or more) in both Variants

| Variant property | Values |
|---|---|
| Side | top, bottom, left, right |
| Variant | default, light |

| Property | Type | Default |
|---|---|---|
| Label | text | Add to calendar |
| Title | text | Schedule |
| Show title | boolean | false |
| Show shortcut | boolean | false |

Built from: `Kbd`

Tokens and styles:
- Colors: `background/popover`, `background/primary`, `border/default`, `foreground/popover`, `foreground/primary`
- Spacing and size: `border-width/DEFAULT`, `spacing/0_5`, `spacing/1_5`, `spacing/2`, `spacing/3`
- Radius: `radius/md`
- Text styles: `ui/caption`, `ui/label`
- Effects: `shadow/md`

Guides: [popover](../../skills/build-ui/components/popover.md), [tooltip](../../skills/build-ui/components/tooltip.md), [tour](../../skills/build-ui/components/tour.md), [permissions-and-access](../../skills/build-ui/patterns/permissions-and-access.md)

Code: shadcn `Tooltip`, `Popover`, `HoverCard`

## Info Tip

Component set · 2 variants · default size 280 × 138

A small popover with one or two sentences and an optional link, opened by clicking an Info Tip Trigger (works on touch, unlike Tooltip). Use it for definitions next to field labels, table headers, stat labels and plan features: what a tax ID, an SLA or a metric means. Side: bottom (below the trigger, the default) or top. Title (Show title), Text, Link (Show link). Wraps at 280. Never put the only way to finish a task in it; keep actions out except one link.


Usage: eggux build-ui/components/tooltip.md

**Use for**

- Definitions next to field labels (Field Show info): tax ID, SLA, webhook URL, role names
- Metric definitions on Table Header Label, Stat Card and Metric Strip labels, Chart Card titles
- Feature explanations in Comparison Table rows and Plan Cards

**Not for**

- The name of an icon button or a one-line hint on hover: use Tooltip
- Format help needed to fill a field: use the Field hint
- Forms, lists or several actions: use Popover
- Pointing out a new feature: use Coachmark

**Anatomy**

1. Info Tip Trigger: 20 px info icon button (State: default, hover, focus, open)
2. Panel: background/popover, border/default, radius/md, shadow/md, 280 wide, 12 padding
3. Title (Show title): ui/label, foreground/popover
4. Text: body/small, foreground/muted
5. Link (Show link): ui/label, foreground/brand
6. Arrow pointing at the trigger (Side: bottom, top)

**Content and behavior**

- Opens on click or tap, never on hover alone; closes on Escape, outside click or a second click
- One or two sentences; at most one link, no other actions
- Side=bottom by default; top when there is no room below
- The trigger shows State=open while the tip is open
- Resize: fixed 280 wide; text wraps, height hugs

**Accessibility**

- The trigger is a button with aria-label "More about <label>" and aria-expanded
- Focus stays on the trigger; the content is announced (aria-describedby or a live region), Escape closes
- Hit area 24 px in code around the 20 px trigger; icon 3:1 or more (foreground/muted 4.7:1 Light)
- Text 4.7:1 Light, 7.1:1 Dark on background/popover; link 6.7:1

| Variant property | Values |
|---|---|
| Side | bottom, top |

| Property | Type | Default |
|---|---|---|
| Title | text | What is a tax ID? |
| Show title | boolean | true |
| Text | text | The number your tax authority gives your business. It appears on every invoice you send. |
| Link | text | Learn more |
| Show link | boolean | true |

Tokens and styles:
- Colors: `background/popover`, `border/default`, `foreground/brand`, `foreground/muted`, `foreground/popover`
- Spacing and size: `border-width/DEFAULT`, `spacing/1`, `spacing/3`
- Radius: `radius/md`
- Text styles: `body/small`, `ui/label`
- Effects: `shadow/md`

Guides: [tooltip](../../skills/build-ui/components/tooltip.md)

Code: shadcn `Popover` + ghost icon `Button` trigger (`Info` size-4); `PopoverContent side="bottom" className="w-70 p-3 text-sm"` with title, muted text and one link (Click and touch, never hover only. Trigger `aria-label="More about <label>"`, `aria-expanded` from Radix)

## Info Tip Trigger

Component set · 4 variants · default size 20 × 20

The 20 px info icon button that opens an Info Tip. Put it right after a field label, a table header or a stat label. State: default (foreground/muted icon), hover, focus (ring), open (foreground/brand on a muted fill while the Info Tip is open). In code it is a button with aria-label "More about <label>" and a 24 px hit area.


Usage: eggux build-ui/components/tooltip.md

**Use for**

- After a field label (Field Show info), a table header, a stat label or a plan feature

**Not for**

- Alone without an Info Tip
- As a general help button: use a Button with a label

**Anatomy**

1. Icon/info 16 (stroke 1.33)
2. State: default (foreground/muted), hover (background/muted, foreground/default), focus (2 px border/ring outside), open (background/muted, foreground/brand)

**Content and behavior**

- Sits 4 px after the label, centered on the label line
- Resize: fixed 20 x 20

**Accessibility**

- button with aria-label "More about <label>", aria-expanded
- 24 px hit area in code
- Focus ring 5.2:1

| Variant property | Values |
|---|---|
| State | default, hover, focus, open |

Icons: info

Tokens and styles:
- Colors: `background/default`, `background/muted`, `border/ring`
- Spacing and size: `spacing/5`
- Radius: `radius/full`

Guides: [input](../../skills/build-ui/components/input.md), [tooltip](../../skills/build-ui/components/tooltip.md)

Code: `Button variant="ghost" size="icon" className="size-5 rounded-full text-muted-foreground data-[state=open]:bg-muted data-[state=open]:text-brand"` (24 px hit area (`after:absolute after:-inset-0.5`))
