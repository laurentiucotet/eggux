# Tour and coachmarks

Usage guidelines only. Visual specs live in the Figma components (Tour page).

## When
| Need | Use |
|---|---|
| Point out one new or hidden feature | `Hotspot` on the element, opens one `Coachmark` |
| Explain a workflow the first time (3-5 steps) | Product tour: `Coachmark` per step + spotlight |
| Get a new account set up | `Block / Onboarding Checklist` (tasks the user does), not a tour |
| Explain a field or icon | `Tooltip` or a hint under the field |

## Rules
- Tours are opt-in or start once, after the user reached the screen they explain. Never on
  first load of the app before anything is visible.
- 3-5 steps. Each step: title that says the benefit ("Clear every filter at once"), one or two
  lines of description, step counter, Back / Next; the last step says Done.
- Always closable (close and Escape). Closing ends the tour; offer "Restart tour" in Help.
- Point at the real element: the arrow faces the target, the target sits in a spotlight
  (overlay `dialog/overlay` with a cut-out and a `border/ring` outline). The rest of the page
  is dimmed but the spotlight stays clickable when the step asks the user to try it.
- Side follows the space: bottom by default, top near the end of the page, left or right in
  narrow columns. Never cover the target.
- Media (a short GIF or image) only when a picture explains faster than words.
- Hotspots: one per screen at most, removed once opened. The pulse stops with reduced motion.
- Remember progress per user; do not repeat a finished tour.
- Mobile: coachmarks become a bottom `Drawer` step or a full-screen intro; no arrows.

## Figma
- `Coachmark`: Side bottom, top, right, left; Title, Description, Step, Show media (Media
  slot), Show close, Show back.
- `Hotspot`: 24 px beacon in `background/primary`.
- Example "product tour" on the Tour page: a block dimmed with a spotlight around the target.
- Each Annotation Pin number matches its comment in the side list.

## Code
A small tour library (Driver.js, Shepherd, Reactour) or Radix `Popover` anchored to the
target. Focus moves into the coachmark and returns to the target after it closes.
