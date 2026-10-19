# Video player

Usage guidelines only. Visual specs live in the Figma component (Video page).

## Rules
- Poster first: a meaningful frame, a large play button and the duration. Never autoplay
  with sound; muted autoplay only for short decorative loops, with a pause control.
- Controls: play / pause, progress with buffered and played parts, time ("1:24 / 4:05"),
  volume, captions, settings (speed, quality), fullscreen. They appear on hover or tap and
  hide after ~3 s of playback; always visible with keyboard focus.
- Captions for every video with speech; subtitles sit above the controls on `video/scrim`.
  Offer a transcript for tutorials and long videos.
- Buffering shows a spinner over the frame; errors keep the poster with a message and Retry.
- Keyboard: Space or K play / pause, arrows seek 5 s, M mute, F fullscreen, C captions.
- Ratio 16:9 unless the content is vertical (9:16 for mobile stories). Rounded corners
  `radius/xl` inside cards and pages.
- Colors use `video/*` tokens: the player stays dark in Light and Dark mode.

## Figma
`Video Player`: State poster, playing, buffering; Duration, Time, Show subtitles. Put the
poster or frame as image fill on the `frame` layer.

## Code
Native `<video>` with custom controls, or a player (Vidstack, Plyr) for HLS and captions.
`<track kind="captions">` for every language.
