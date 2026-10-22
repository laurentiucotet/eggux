# Timeline

Generated from the EGG UI master library on 2026-10-22 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Timeline Item](#timeline-item) | 5 | Content |

On the Figma page: "Example / activity", "Stress test / Timeline Item"

## Timeline Item

Component set · 5 variants · default size 480 × 70

One event in an activity history (record history, audit log, order tracking). Newest first. Tone marks the outcome, not decoration. Connector off on the last item. Time relative under 24 h, absolute after ("22 Oct, 10:30"); full timestamp in a tooltip.

**Use for**

- Activity column on a record page
- Order or shipment tracking
- Changes made by the system, listed in order

**Not for**

- Conversations between people: use Comment
- Filterable change history: use the Audit Log with Change Item
- Steps the user still has to complete: use Stepper

**Anatomy**

1. Icon in a circle colored by Tone (Icon)
2. Connector line to the next item
3. Title: what happened
4. Time: "2 h ago"
5. Description: who and where (Show description)
6. Content slot: note excerpt, attachment or diff (Show content)

**Content and behavior**

- Newest first; one event per item
- Tone marks the outcome: success, destructive (failed), primary (created), default (info)
- Time is relative under 24 h, then absolute ("22 Oct, 10:30"); full timestamp in a tooltip
- Connector off on the last item
- Long histories: the last 5-10 with "View all"; group by day

**Accessibility**

- The timeline is an ordered list
- The outcome is in the Title text, not only in the Tone color
- The time element carries the full timestamp in its datetime attribute

| Variant property | Values |
|---|---|
| Tone | default, primary, success, warning, destructive |

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
- Colors: `background/destructive`, `background/muted`, `background/primary`, `background/success`, `background/warning`, `border/default`, `foreground/default`, `foreground/muted`
- Spacing and size: `border-width/DEFAULT`, `spacing/0_5`, `spacing/1`, `spacing/2`, `spacing/3`, `spacing/6`
- Radius: `radius/full`
- Text styles: `body/small`, `ui/caption`, `ui/label`

Guides: [comments-and-chat](../../skills/build-ui/components/comments-and-chat.md), [description-list](../../skills/build-ui/components/description-list.md)

Code: custom `dl` with `dt` / `dd` and a Tailwind grid; custom `ol` (No shadcn component)
