# Spinner, Status Dot and Kbd

Usage guidelines only. Visual specs live in the Figma components.

## Spinner
- Indeterminate waits under ~3 s, inside buttons ("Saving…" + disabled) and small areas.
- Content loading uses Skeleton; known progress uses Progress (`loading-states.md`).
- Show it after ~300 ms to avoid flicker; one spinner per region, never several at once.
- Sizes: sm 16 (inline, buttons), default 20, lg 32 (empty region). `role="status"` + hidden text.
- Figma: `Spinner` Size × Tone; "button loading" example (Button disabled + loader icon).

## Status Dot
- State of a system, service, integration or person: Online, Degraded, Down, Syncing, Offline.
- Always with a label (color is never the only signal); dot alone only next to an avatar.
- Inside a pill, use `Badge` with `Dot` instead.
- Figma: `Status Dot` Status (success, warning, error, info, neutral) on the Badge page.

## Kbd
- Show shortcuts in menus, tooltips, command palette and help ("⌘ K").
- Platform-aware: ⌘ ⌥ ⇧ ⌃ on Mac, "Ctrl" / "Alt" on Windows and Linux.
- Do not teach shortcuts that are not implemented; never rely on a shortcut as the only way.
- Figma: `Kbd` (Key) and `Kbd Group` (Keys slot) on the Kbd page; "search with shortcut" example.

## Related components
- The keyboard shortcuts dialog (opened with ?) lists `Shortcut Row`s grouped by area: the action,
  then the keys as Kbd.
