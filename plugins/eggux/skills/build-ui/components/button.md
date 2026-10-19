# Button

Usage guidelines only. Visual specs (sizes, padding, colors) live in the Figma component and
its variables; read them through Figma MCP, do not copy them here.

## Variants
| Variant | Use |
|---|---|
| `default` (primary) | The single main action of the view or dialog |
| `secondary` | Alternative actions with some weight |
| `outline` | Cancel, back, secondary actions next to a primary |
| `ghost` | Toolbar actions, low-emphasis actions in dense UI |
| `destructive` | The confirming action of a destructive flow, inside a confirmation |
| `link` | Navigation that looks like text, inside content |

## Rules
- One `default` button per view or dialog.
- Label = verb + object when ambiguous ("Save patient"). Use the client's terminology.
- Order in dialogs and forms: secondary left, primary right.
- `destructive` appears inside the confirmation step; the trigger in a list can be `ghost` or a menu item.
- Icon-only buttons need an accessible label and a tooltip.
- Loading: keep the width, show a spinner, block repeat clicks.
- Disabled only when the action is truly unavailable, with a reason nearby. Never as form validation.

## Client overrides
Check `eggux/brand.md` → Overrides (for example "buttons never show icons"). In Figma, the icon
is a boolean property; turn it off in the client file rather than detaching instances.
