# Video

Generated from the EGG UI master library on 2026-10-29 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Video Player](#video-player) | 6 | - |
| [Video Thumbnail](#video-thumbnail) | 1 | - |
| [Audio Player](#audio-player) | 4 | - |

On the Figma page: "Example / Audio Player styles", "Example / getting started video", "Example / help center videos and podcast", "Stress test / Audio Player", "Stress test / Video Player", "Stress test / Video Thumbnail"

## Video Player

Component set · 6 variants · default size 720 × 405

Video player for marketing pages, docs and help articles: poster image (16:9 Image Placeholder, swap the photo), centered play button, Duration chip; playing and buffering states show the control bar with progress and Time. Size=default (64 px play button) up to about 800 wide; Size=lg (96 px play button, 1152 x 648) for hero and full-width players. Dark in both modes (video/* tokens).


Usage: eggux build-ui/components/video-player.md

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
8. Size: default (64 px play button and spinner, up to about 800 wide), lg (96 px play button, 1152 x 648)

**Content and behavior**

- Poster first: a meaningful frame, a large play button and the duration
- Never autoplay with sound; muted autoplay only for short loops, with a pause control
- Controls show on hover or tap and hide after ~3 s of playback
- Captions for every video with speech; transcript for tutorials and long videos
- Errors keep the poster, with a message and Retry
- Size=lg for hero and full-width players (960 wide and up), Size=default in cards, docs and dialogs
- Ratio 16:9 unless the content is vertical; radius/xl in cards and pages
- video/* tokens: the player stays dark in Light and Dark mode

**Accessibility**

- Space or K play / pause, arrows seek 5 s, M mute, F fullscreen, C captions
- Controls stay visible while one of them has keyboard focus
- Every control has an accessible label; a captions track for every language

| Variant property | Values |
|---|---|
| State | poster, playing, buffering |
| Size | default, lg |

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

Code: native `video` or Vidstack (Size=lg: play button `size-24` (96 px) for hero and full-width players)

## Video Thumbnail

Component · 1 variant · default size 360 × 203

A video before it plays: poster frame, play button, duration. Click opens the Video Player in place or in a Lightbox. Title and description go under it in the card or list. The poster shows something from the video, never only a logo.

**Use for**

- Video cards in a resource hub
- Tutorial lists
- A demo link in a Hero or a feature section

**Not for**

- Playing the video: use Video Player
- Images that open large: use Lightbox
- Audio only: use Audio Player

**Anatomy**

1. Image Placeholder 16:9 (poster)
2. Play button: play icon
3. Duration Badge (Show duration)

**Content and behavior**

- Click opens the Video Player in place or in a Lightbox
- Title and description go under it in the card or list
- The poster shows something from the video, never only a logo
- Duration in m:ss; same ratio across a list

**Accessibility**

- A button named by the video and its length ("Play: Closing the books faster, 4 minutes")
- The play icon is aria-hidden; the duration is text
- Visible focus ring over the image

| Property | Type | Default |
|---|---|---|
| Show duration | boolean | true |

Built from: `Badge`, `Image Placeholder`. Icons: play

Tokens and styles:
- Colors: `background/default`, `background/muted`
- Radius: `radius/full`, `radius/lg`
- Effects: `shadow/md`

Guides: [video-player](../../skills/build-ui/components/video-player.md)

Code: `<button>` + `<img>` poster, lucide `Play`, `Badge` (Opens `Video Player` in place or in a `Dialog`)

## Audio Player

Component set · 4 variants · default size 480 × 68

Plays one audio file: podcast episode, voice message, recorded call. Play/pause, title, position and length, a seek bar, volume. Space toggles play; arrows seek 5 s. Offer a transcript link next to it. Video uses Video Player.


Variant: default (title, seek bar, times, volume) for episodes, recordings and files; compact (280, pill: play, waveform, duration) for voice messages in Chat, Team Chat and Inbox. State: paused (play icon) or playing (pause icon, played part in background/primary). Played waveform bars use background/primary, the rest foreground/muted.


Usage: eggux build-ui/components/video-player.md

**Use for**

- Podcast episodes
- Voice messages in chat
- Recorded calls in a record
- Variant=compact: voice messages in Chat, Team Chat and Inbox

**Not for**

- Video: use Video Player
- Recording audio: use Voice Recorder
- A list of episodes to pick from: use List Item

**Anatomy**

1. Play: Button Icon (play, pause)
2. Title
3. Progress: current time, seek bar, length
4. Volume: Button Icon
5. Variant: default or compact (280 pill: play sm, waveform, duration; no title or volume)
6. State: paused (play icon) or playing (pause icon, played part in background/primary)
7. Waveform: 28 bars, played in background/primary, the rest foreground/muted

**Content and behavior**

- Space toggles play; arrows seek 5 s
- Offer a transcript link next to it
- One player plays at a time; never autoplay
- Times in m:ss, h:mm:ss past an hour
- Title in one line
- Compact shows the remaining or total time in Duration
- Resize: default title 1 line with ellipsis; compact waveform fills, min 200

**Accessibility**

- The play button name follows the state ("Play", "Pause")
- The seek bar is role="slider" with aria-valuetext ("4 minutes 12 seconds of 14 minutes 30 seconds")
- The volume button is named "Mute" or "Unmute"
- The waveform is decorative; the slider carries the position

| Variant property | Values |
|---|---|
| Variant | default, compact |
| State | paused, playing |

| Property | Type | Default |
|---|---|---|
| Title | text | Episode 12: Closing the books faster |
| Time | text | 04:12 |
| Duration | text | 14:30 |

Built from: `Button Icon`

Tokens and styles:
- Colors: `background/card`, `background/muted`, `background/primary`, `border/default`, `foreground/card`, `foreground/muted`
- Spacing and size: `spacing/1_5`, `spacing/2`, `spacing/3`, `spacing/4`
- Radius: `radius/full`, `radius/lg`
- Text styles: `ui/caption`, `ui/label`

Guides: [comments-and-chat](../../skills/build-ui/components/comments-and-chat.md), [video-player](../../skills/build-ui/components/video-player.md)

Code: native `<audio>` + custom controls (shadcn `Button`, `Slider`), or Vidstack (Space play / pause, arrows seek 5 s)
