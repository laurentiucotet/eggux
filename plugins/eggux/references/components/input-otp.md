# Input OTP

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [OTP Slot](#otp-slot) | 12 | - |
| [Input OTP](#input-otp) | 2 | - |

## OTP Slot

Component set · 12 variants · default size 40 × 40

One character box of Input OTP. Boxes join into groups: first (left radius + left border), middle, last (right radius). active = caret + focus ring; error marks all boxes of the code.

| Variant property | Values |
|---|---|
| Position | first, middle, last |
| State | empty, filled, active, error |

| Property | Type | Default |
|---|---|---|
| Digit | text | 4 |

Tokens and styles:
- Colors: `background/default`, `background/destructive`, `border/input`, `border/ring`, `foreground/default`
- Spacing and size: `border-width/DEFAULT`, `spacing/10`, `spacing/4`
- Radius: `radius/md`
- Text styles: `body/large`

Guides: [input](../../skills/build-ui/components/input.md)

## Input OTP

Component set · 2 variants · default size 160 × 40

One-time code input (shadcn Input OTP / input-otp). 6 digits as 3 + 3, or 4. Set each OTP Slot state in the instance. Paste fills all boxes; autocomplete="one-time-code"; inputmode="numeric".

| Variant property | Values |
|---|---|
| Length | 4, 6 |

Built from: `OTP Slot`. Icons: minus

Tokens and styles:
- Spacing and size: `spacing/2`

Guides: [input](../../skills/build-ui/components/input.md)

Code: shadcn `InputOTP`
