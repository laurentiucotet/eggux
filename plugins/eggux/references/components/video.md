# Video

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Video Player](#video-player) | 3 | - |

## Video Player

Component set · 3 variants · default size 720 × 405

Inline video (tutorials, product demos, lessons). poster: frame, play button, duration; playing: controls appear on hover or tap and hide after 3 s; buffering: spinner over the frame. Colors use video/* tokens (same in Light and Dark). Captions available for every video with speech; never autoplay with sound.

| Variant property | Values |
|---|---|
| State | poster, playing, buffering |

| Property | Type | Default |
|---|---|---|
| Duration | text | 4:05 |
| Time | text | 1:24 / 4:05 |
| Show subtitles | boolean | false |

Built from: `Image Placeholder`. Icons: captions, loader-circle, maximize, pause, play, settings, volume-2

Tokens and styles:
- Colors: `video/background`, `video/foreground`, `video/scrim`, `video/track`
- Spacing and size: `spacing/0_5`, `spacing/1`, `spacing/16`, `spacing/1_5`, `spacing/2`, `spacing/3`, `spacing/8`
- Radius: `radius/full`, `radius/md`, `radius/sm`, `radius/xl`
- Text styles: `body/default`, `ui/caption`

Guides: [video-player](../../skills/build-ui/components/video-player.md)

Code: native `video` or Vidstack
