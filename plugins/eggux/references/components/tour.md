# Tour

Generated from the EGG UI master library on 2026-10-22 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Coachmark](#coachmark) | 4 | Media |
| [Hotspot](#hotspot) | 1 | - |
| [Annotation Pin](#annotation-pin) | 3 | - |

On the Figma page: "Example / filter panel", "Example / new feature hint", "Example / product tour", "Stress test / Annotation Pin", "Stress test / Coachmark", "Stress test / Hotspot"

## Coachmark

Component set · 4 variants · default size 320 × 165

One step of a product tour or a single feature tip, anchored to the element it explains. Side = where it sits relative to the target; the arrow points at the target. Title says the benefit, description one or two lines, step counter, Back / Next (last step: Done). Always closable.

**Use for**

- Explaining a workflow the first time, in 3-5 steps
- A single tip opened from a Hotspot
- A tip that asks the user to try the element in the spotlight

**Not for**

- Setting up a new account: use Block / Onboarding Checklist
- Explaining a field or icon: use Tooltip or a hint under the field
- Information people need again later: put it on the page

**Anatomy**

1. Arrow pointing at the target (Side)
2. Media slot: short GIF or image (Show media)
3. Title: the benefit
4. Description: one or two lines
5. Step: "2 of 4"
6. Back (Show back) and Next; Done on the last step
7. Close (Show close)

**Content and behavior**

- Tours are opt-in or start once, after the user reached the screen they explain
- Always closable; closing ends the tour, and Help offers "Restart tour"
- Point at the real element in a spotlight; never cover the target
- Side bottom by default, top near the page end, left or right in narrow columns
- Media only when a picture explains faster than words
- Remember progress per user; never repeat a finished tour
- Mobile: a bottom Drawer step, no arrow

**Accessibility**

- Focus moves into the coachmark and returns to the target after it closes
- Escape closes it
- The step count is in text: "Step 2 of 4"

| Variant property | Values |
|---|---|
| Side | bottom, top, right, left |

| Property | Type | Default |
|---|---|---|
| Title | text | Save this filter as a view |
| Description | text | Views keep your filters and columns. Find them again in the sidebar under Projects. |
| Step | text | 2 of 4 |
| Show media | boolean | false |
| Show close | boolean | true |
| Show back | boolean | true |

Slots (fill them in the instance, never detach): `Media`

Built from: `Button`, `Image Placeholder`. Icons: x

Tokens and styles:
- Colors: `background/popover`, `border/default`, `foreground/muted`, `foreground/popover`
- Spacing and size: `border-width/DEFAULT`, `spacing/2`, `spacing/3`, `spacing/4`, `spacing/6`
- Radius: `radius/md`
- Text styles: `body/large`, `body/small`, `ui/caption`

Guides: [tour](../../skills/build-ui/components/tour.md)

Code: Driver.js, Shepherd or `Popover` anchored to the target

## Hotspot

Component · 1 variant · default size 24 × 24

Beacon on a new or unused feature. Click opens its Coachmark. The ring pulses (motion/duration/slow, stops with reduced motion). One hotspot per screen at most; remove it after it was opened.

**Use for**

- Pointing out one new or hidden feature
- Starting a single Coachmark without a full tour
- A feature people have not used yet, placed on that element

**Not for**

- Explaining a workflow: use a product tour of Coachmarks
- Unread or pending counts: use Badge Count

**Anatomy**

1. Target element it sits on
2. Dot: background/primary, 24 px
3. Pulsing ring (border-width/2)

**Content and behavior**

- One hotspot per screen at most
- Click opens its Coachmark
- Remove it once it was opened
- The pulse uses motion/duration/slow and stops with reduced motion

**Accessibility**

- A button with an accessible label that names the feature: "New: saved views"
- Reachable with the keyboard; Enter opens the Coachmark

Tokens and styles:
- Colors: `background/default`, `background/primary`
- Spacing and size: `border-width/2`

Guides: [tour](../../skills/build-ui/components/tour.md)

Code: Driver.js, Shepherd or `Popover` anchored to the target

## Annotation Pin

Component set · 3 variants · default size 28 × 28

A numbered marker placed on a design, document or screenshot where a comment lives. The point (bottom-left corner) marks the spot. Click opens the thread in a Popover or the side panel; active is the open one; resolved pins fade and show a check. Numbers match the comment list order.

**Use for**

- Comments on a design, a PDF or a screenshot
- Review feedback tied to a spot on an image
- Numbered callouts that match a comment list

**Not for**

- Pointing out a feature in the product: use Hotspot
- A tour step: use Coachmark
- Comments on a whole record: use Comment

**Anatomy**

1. Pin: round with the point at the bottom-left corner
2. Number: the comment's position in the list

**Content and behavior**

- The point (bottom-left corner) marks the spot
- Numbers match the comment list order
- Click opens the thread in a Popover or the side panel; State=active is the open one
- Resolved pins fade and show a check
- Pins that overlap move apart and stay clickable

**Accessibility**

- Each pin is a button: "Comment 3 by Elena Popa"
- Tab order follows the numbers; Enter opens the thread
- Pins are also reachable from the comment list, which is the main way for screen readers

| Variant property | Values |
|---|---|
| State | default, active, resolved |

| Property | Type | Default |
|---|---|---|
| Number | text | 3 |

Icons: check

Tokens and styles:
- Colors: `background/default`, `background/muted`, `background/primary`, `foreground/primary`
- Text styles: `ui/caption`
- Effects: `shadow/lg`, `shadow/md`

Guides: [comments-and-chat](../../skills/build-ui/components/comments-and-chat.md)

Code: custom absolutely positioned `Button` + shadcn `Popover` (Store positions as percentages of the image)
