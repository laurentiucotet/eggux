# Video

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Video Player](#video-player) | 3 | - |

On the Figma page: "Example / getting started video", "Stress test / Video Player"

## Video Player

Component set · 3 variants · default size 720 × 405

Inline video (tutorials, product demos, lessons). poster: frame, play button, duration; playing: controls appear on hover or tap and hide after 3 s; buffering: spinner over the frame. Colors use video/* tokens (same in Light and Dark). Captions available for every video with speech; never autoplay with sound.

**Use for**

- Tutorials and product demos inside a page or card
- Lessons and long help videos, with a transcript
- Feature demos on a marketing or help page

**Not for**

- A sequence of images: use Carousel
- A short visual in a tour step: use the Coachmark Media slot

**Anatomy**

1. Frame: poster or video image
2. Play button and Duration (State=poster)
3. Progress track with buffered and played parts
4. Time: "1:24 / 4:05"
5. Controls: play / pause, volume, captions, settings, fullscreen
6. Subtitles above the controls on video/scrim (Show subtitles)
7. Spinner over the frame (State=buffering)

**Content and behavior**

- Poster first: a meaningful frame, a large play button and the duration
- Never autoplay with sound; muted autoplay only for short loops, with a pause control
- Controls show on hover or tap and hide after ~3 s of playback
- Captions for every video with speech; transcript for tutorials and long videos
- Errors keep the poster, with a message and Retry
- Ratio 16:9 unless the content is vertical; radius/xl in cards and pages
- video/* tokens: the player stays dark in Light and Dark mode

**Accessibility**

- Space or K play / pause, arrows seek 5 s, M mute, F fullscreen, C captions
- Controls stay visible while one of them has keyboard focus
- Every control has an accessible label; a captions track for every language

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
