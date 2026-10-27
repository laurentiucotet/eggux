# Surveys

Generated from the EGG UI master library on 2026-10-27 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Feedback Widget](#feedback-widget) | 3 | - |
| [NPS Survey](#nps-survey) | 2 | - |
| [CSAT Rating](#csat-rating) | 2 | - |

On the Figma page: "Example / quarterly customer survey", "Stress test / CSAT Rating", "Stress test / Feedback Widget", "Stress test / NPS Survey"

## Feedback Widget

Component set · 3 variants · default size 320 × 106

A one-tap question at the end of a help article, an AI answer or a finished task: Yes or No, then an optional comment, then thanks. Never blocks the page; one question; ask once per page per person. Send with the page and version so the answer can be acted on.

**Use for**

- The end of a help or docs article
- After a finished task (an import, a setup step)
- Under an AI summary or answer outside chat

**Not for**

- Feedback on one chat answer, with reasons: use Response Feedback
- Loyalty over time: use NPS Survey
- Satisfaction after one interaction: use CSAT Rating
- Rating a product: use Rating

**Anatomy**

1. Question: ui/label
2. Answers: Yes and No Buttons
3. Comment (State=comment): Textarea and Send
4. Thanks (State=thanks): a short confirmation in place

**Content and behavior**

- One question; it never blocks the page
- Ask once per page per person and remember the answer
- After an answer, the comment is optional; after No it asks what was missing
- Send the answer with the page and version so it can be acted on
- Thanks replaces the widget in place; no dialog
- Resize: question and thanks texts fill and wrap to 2 lines with an ellipsis; the answer buttons hug

**Accessibility**

- Answers are a group labelled by the question; buttons use aria-pressed
- Focus moves to the comment field after an answer
- Thanks is in a role="status" element

| Variant property | Values |
|---|---|
| State | ask, comment, thanks |

| Property | Type | Default |
|---|---|---|
| Question | text | Was this page helpful? |
| Thanks | text | Thanks for the feedback. |

Built from: `Button`, `Textarea`. Icons: circle-check

Tokens and styles:
- Colors: `background/card`, `border/default`, `foreground/card`
- Spacing and size: `spacing/2`, `spacing/3`, `spacing/5`
- Radius: `radius/xl`
- Text styles: `ui/label`

Guides: [rating](../../skills/build-ui/components/rating.md)

Code: shadcn `Button`, `ToggleGroup` (or `RadioGroup`) + `Textarea` (Send with page or ticket id, version and date; throttle per person)

## NPS Survey

Component set · 2 variants · default size 600 × 158

Net Promoter Score: 0-10 with anchors, then one optional open question. In-app as a dismissible card or by email, at most every 90 days per person, never during onboarding or right after an error. The scale reads as numbers, not colors.

**Use for**

- A relationship survey every few months
- In-app as a dismissible card
- In an email with one link per score

**Not for**

- Satisfaction with one interaction: use CSAT Rating
- "Was this helpful?": use Feedback Widget
- Rating a product or a review: use Rating

**Anatomy**

1. Question: ui/label
2. Scale: 11 score buttons, 0-10
3. Anchors: "Not likely" and "Very likely", ui/caption, muted
4. Follow-up (State=answered): one open question with a Textarea

**Content and behavior**

- At most every 90 days per person; never during onboarding or right after an error
- The scale reads as numbers, not colors: all scores look the same until one is picked
- One tap records the score; the follow-up is optional ("What is the main reason for your score?")
- Dismissing counts as asked
- On narrow screens the scale wraps to two rows (0-5, 6-10)

**Accessibility**

- The scale is a radiogroup labelled by the question; arrow keys move
- The ends include the anchors in their names ("0, Not likely")
- Dismiss has aria-label "Dismiss survey"

| Variant property | Values |
|---|---|
| State | unanswered, answered |

| Property | Type | Default |
|---|---|---|
| Question | text | How likely are you to recommend Acme to a colleague? |

Built from: `Button`, `Textarea`

Tokens and styles:
- Colors: `background/card`, `background/primary`, `border/default`, `border/input`, `foreground/card`, `foreground/default`, `foreground/muted`, `foreground/primary`
- Spacing and size: `spacing/1`, `spacing/2`, `spacing/4`, `spacing/5`
- Radius: `radius/md`, `radius/xl`
- Text styles: `body/large`, `ui/caption`, `ui/label`

Guides: [rating](../../skills/build-ui/components/rating.md)

Code: shadcn `Button`, `ToggleGroup` (or `RadioGroup`) + `Textarea` (Send with page or ticket id, version and date; throttle per person)

## CSAT Rating

Component set · 2 variants · default size 420 × 144

Customer satisfaction after one interaction (a support ticket, a delivery, an onboarding call): five faces with words under them. One tap sends it; a comment is optional after. Words carry the meaning, faces support it. Ask within a day of the interaction, once.

**Use for**

- After a support ticket is closed
- After a delivery
- After an onboarding call

**Not for**

- Loyalty over time: use NPS Survey
- "Was this page helpful?": use Feedback Widget
- Stars for a product: use Rating

**Anatomy**

1. Question: ui/label
2. Faces: 5 options, emoji over a word (Very poor, Poor, OK, Good, Very good)
3. Comment (State=answered): optional Textarea

**Content and behavior**

- Words carry the meaning, faces support it
- One tap sends the rating; a comment is optional after it
- A low rating asks what went wrong
- Ask within a day of the interaction, once
- Same order everywhere: worst on the left, best on the right

**Accessibility**

- The faces are a radiogroup labelled by the question; each option is named by its word; the emoji is aria-hidden
- Arrow keys move between options
- The confirmation is in a role="status" element

| Variant property | Values |
|---|---|
| State | unanswered, answered |

| Property | Type | Default |
|---|---|---|
| Question | text | How was your support experience? |

Tokens and styles:
- Colors: `background/accent`, `background/card`, `border/default`, `foreground/card`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/1`, `spacing/2`, `spacing/4`, `spacing/5`
- Radius: `radius/md`, `radius/xl`
- Text styles: `body/lead`, `body/small`, `ui/caption`, `ui/label`

Guides: [rating](../../skills/build-ui/components/rating.md)

Code: shadcn `Button`, `ToggleGroup` (or `RadioGroup`) + `Textarea` (Send with page or ticket id, version and date; throttle per person)
