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
- Label = verb + object when ambiguous ("Save customer"). Use the client's terminology.
- Order in dialogs and forms: secondary left, primary right.
- `destructive` appears inside the confirmation step; the trigger in a list can be `ghost` or a menu item.
- Icon-only buttons need an accessible label and a tooltip.
- Loading: keep the width, show a spinner, block repeat clicks.
- Disabled only when the action is truly unavailable, with a reason nearby. Never as form validation.

## Figma
- `Button`: `Variant` × `Size` (sm, default, lg) × `State` (default, hover, focus, disabled).
  Properties: `Label`, `Leading icon`, `Trailing icon` (boolean + swap).
- `Button Icon`: icon-only, 36 × 36, `Variant` × `State`, `Icon` swap. Pair it with a tooltip.

## Client overrides
Check `eggux/brand.md` → Overrides (for example "buttons never show icons"). In Figma, the icon
is a boolean property; turn it off in the client file rather than detaching instances.

## Button Group and Split Button
- Button Group: 2-5 related actions of equal weight joined in one control (Edit / Duplicate /
  Archive, previous / next, zoom − / +). Choosing a value is a Toggle Group, not a Button Group.
- Split Button: one main action that runs the most common choice + a chevron that opens a Menu of
  variants of the same action (Save / Save as draft / Save and close). Never hide unrelated or
  destructive actions in it.
- Figma: `Button Group Item` Position (first, middle, last) × State, Icon-only via Show label off;
  `Button Group` (Items slot); `Split Button` Variant (default, outline). Example "split button open".
