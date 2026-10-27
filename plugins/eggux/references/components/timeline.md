# Timeline

Generated from the EGG UI master library on 2026-10-27 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Timeline Item](#timeline-item) | 20 | Content |

On the Figma page: "Example / Timeline Item styles", "Example / activity", "Stress test / Timeline Item"

## Timeline Item

Component set · 20 variants · default size 480 × 70

One event in an activity history (record history, audit log, order tracking). Newest first. Tone marks the outcome, not decoration. Connector off on the last item. Time relative under 24 h, absolute after ("22 Oct, 10:30"); full timestamp in a tooltip. Layout=default: compact list for record pages. Layout=card: title, time, description and Content in a bordered card, for events with notes or attachments. Layout=alternating-left / alternating-right: content on one side of a center line and the time on the other; alternate them item by item for milestones and company history on marketing pages (768 and up). Layout=card: the Time moves under the Title when the card is narrower than about 200 px, so the title keeps at least 120 px. Usage: eggux build-ui/components/description-list.md

**Use for**

- Activity column on a record page
- Order or shipment tracking
- Changes made by the system, listed in order
- Layout=card: events with a note, attachment or diff in the Content slot
- Layout=alternating-left / alternating-right: milestones and company history on marketing pages

**Not for**

- Conversations between people: use Comment
- Filterable change history: use the Audit Log with Change Item
- Steps the user still has to complete: use Stepper
- Alternating layouts in apps or below 768: use Layout=default

**Anatomy**

1. Layout: default, card, alternating-left, alternating-right. Tone: default, primary, success, warning, destructive
2. Icon in a circle colored by Tone (Icon)
3. Connector line to the next item (Show connector)
4. Title: what happened
5. Time: "2 h ago" (in alternating layouts on the other side of the line)
6. Description: who and where (Show description)
7. Content slot: note excerpt, attachment or diff (Show content)
8. card: Title, Time, Description and Content in a bordered card (radius/base, padding spacing/4); the header wraps, so Time moves under the Title when the card is narrower than about 200 px (Title keeps at least 120 px)

**Content and behavior**

- Newest first; one event per item
- Tone marks the outcome: success, destructive (failed), primary (created), default (info)
- Time is relative under 24 h, then absolute ("22 Oct, 10:30"); full timestamp in a tooltip
- Connector off on the last item
- Long histories: the last 5-10 with "View all"; group by day
- Alternating: switch alternating-left and alternating-right item by item, starting with left
- One Layout per timeline (alternating counts as one)
- Layout=card in narrow columns (5 per row on a 1152 container): keep titles to 2 or 3 words per line; never resize the title layer
- Resize: the title fills (at least 96, 2 lines with an ellipsis); the time hugs up to 128 with an ellipsis; the description 3 lines

**Accessibility**

- The timeline is an ordered list
- The outcome is in the Title text, not only in the Tone color
- The time element carries the full timestamp in its datetime attribute

| Variant property | Values |
|---|---|
| Tone | default, primary, success, warning, destructive |
| Layout | default, card, alternating-left, alternating-right |

| Property | Type | Default |
|---|---|---|
| Title | text | Order placed |
| Time | text | 2 h ago |
| Description | text | Maria Ilie · Order #1042 · 22 Oct, 10:30 |
| Show description | boolean | true |
| Show connector | boolean | true |
| Show content | boolean | false |
| Icon | instance swap | Icon/clock |

Slots (fill them in the instance, never detach): `Content`

Icons: clock

Tokens and styles:
- Colors: `background/default`, `background/destructive`, `background/muted`, `background/primary`, `background/success`, `background/warning`, `border/default`, `foreground/default`, `foreground/muted`
- Spacing and size: `border-width/DEFAULT`, `spacing/0_5`, `spacing/1`, `spacing/2`, `spacing/3`, `spacing/4`, `spacing/6`
- Radius: `radius/base`, `radius/full`
- Text styles: `body/small`, `ui/caption`, `ui/label`

Guides: [comments-and-chat](../../skills/build-ui/components/comments-and-chat.md), [description-list](../../skills/build-ui/components/description-list.md)

Code: custom `dl` with `dt` / `dd` and a Tailwind grid; custom `ol` (No shadcn component)
