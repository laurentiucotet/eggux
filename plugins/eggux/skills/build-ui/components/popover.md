# Popover and Command

Usage guidelines only. Visual specs live in the Figma components (Popover page).

## Which one
| Component | Use |
|---|---|
| `Tooltip` | A label or short hint, no interaction inside |
| `Menu` (Dropdown) | A list of actions or one choice from a short list |
| `Popover` | Rich, interactive content tied to a trigger: quick edit, details, share link, filters with few options |
| `Command` | Searchable list: Combobox, command palette (⌘K), mention picker |
| `Sheet` / `Dialog` | Content that needs more room or blocks the page |

## Rules
- Opens on click, never on hover. Closes on outside click, Escape and after the action is done.
- Focus moves into the popover and returns to the trigger on close.
- Keep it small (width 288, up to ~400). More content belongs in a Sheet.
- Never nest popovers. A Select or Combobox inside a Popover is fine.
- Command lists: show recent or suggested items before typing, group with `Menu Label`, highlight
  the first match, show "No results found." with a next step when possible.

## Figma
- `Popover`: Content (native slot), popover tokens, `shadow/md`.
- `Command`: `Command Input` (exposed, Value) + `Items` slot + `Empty` state.
- `Combobox`: trigger (State × Content); see `select.md`.

## Code
shadcn `Popover`, `Command` (cmdk), Combobox = `Popover` + `Command`.

## Hover Card
- Preview of a linked person, item or link on hover or keyboard focus, after ~500 ms.
- Read-only. Anything actionable must also be reachable on the target page.
- Not on touch devices: a tap opens the target.
- Figma: `Hover Card` (Content slot, 320 wide) on the Popover page.

## Command Dialog (⌘K) and search with suggestions
- Command Dialog: global shortcut ⌘K / Ctrl K, also a visible search button in the Top Bar.
  Before typing: recent items and suggested actions. Results grouped (Pages, Records, Actions,
  Settings), shortcuts on the right, footer with ↑ ↓ ↵ esc.
- Search with suggestions: dropdown under a search Input; recent searches, then matches grouped
  by type; Enter on the text searches everything. Highlight the matched part in code.
- No results: say so and offer "Search everywhere for …" or a create action.
- Figma: `Command Dialog` (Items slot, Command Input exposed); example "search with suggestions".

## Related components
- `Confirm Popover` asks a short question next to the trigger for actions with some cost (archive,
  remove, discard); irreversible loss uses `Alert Dialog`. `Emoji Picker` and `App Launcher` are
  ready-made Popover contents for emoji and for switching apps in a suite of 4 or more.
