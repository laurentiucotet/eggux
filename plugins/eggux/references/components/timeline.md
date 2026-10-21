# Timeline

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Timeline Item](#timeline-item) | 5 | Content |

On the Figma page: "Example / activity"

## Timeline Item

Component set · 5 variants · default size 480 × 70

One event in an activity history (record history, audit log, order tracking). Newest first. Tone marks the outcome, not decoration. Connector off on the last item. Time relative under 24 h, absolute after ("22 Oct, 10:30"); full timestamp in a tooltip.

| Variant property | Values |
|---|---|
| Tone | default, primary, success, warning, destructive |

| Property | Type | Default |
|---|---|---|
| Title | text | Order placed |
| Time | text | 2 h ago |
| Description | text | Maria Ilie · Order #1042 · 22 Oct, 10:30 |
| Show description | boolean | true |
| Connector | boolean | true |
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
