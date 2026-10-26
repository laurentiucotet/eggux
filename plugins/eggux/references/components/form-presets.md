# Form Presets

Generated from the EGG UI master library on 2026-10-26 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Field Preset](#field-preset) | 10 | - |

On the Figma page: "Example / in forgot password", "Stress test / Field Preset"

## Field Preset

Component set · 10 variants · default size 320 × 64

Ready-made fields built from Field + Input/Select (they follow every change to those). In code set the matching type, inputmode and autocomplete: email, current-password, new-password, tel, cc-number, cc-exp, cc-csc, postal-code, country-name, address-level1. The nested Field is exposed for states and errors. country shows the placeholder "Select a country" until a value is picked (set the nested Select to Content=filled and its Value).

**Use for**

- Sign in, sign up, payment and address forms
- Any field whose data matches one of the 10 Types
- Checkout and billing details: card, postal code, country, region

**Not for**

- Data that matches no preset: use Field with Input
- One-time codes: use Input OTP

**Anatomy**

1. Field label
2. Control: Input or Select for the Type
3. Hint and Error: each Type has its own default text (nested Field exposed)

**Content and behavior**

- Type: email, password, new-password, phone, card-number, card-expiry, card-cvc, postal-code, country, region
- Each Type sets its own Error and Hint defaults (password "Enter your password", new-password "Use at least 8 characters", phone with the country code, card fields, postal code, country, county); rewrite them in the client's words, never leave another type's text
- country shows the placeholder "Select a country" by default; for a filled form set the nested Select to Content=filled with the country as Value
- In code set the matching type, inputmode and autocomplete (email, tel, cc-number, postal-code...)
- Change the label to the client's terminology; keep the preset behavior
- password never blocks paste; new-password pairs with Password Strength
- card-number groups digits by 4; card-expiry formats MM / YY as the user types

**Accessibility**

- Correct autocomplete lets browsers and password managers fill the field
- inputmode opens the right mobile keyboard
- Errors and states come from the nested Field

| Variant property | Values |
|---|---|
| Type | email, password, new-password, phone, card-number, card-expiry, card-cvc, postal-code, country, region |

Built from: `Field`

Guides: [form-presets](../../skills/build-ui/patterns/form-presets.md)

Code: `Field` (`FormItem`) + shadcn `Input` or `Select` with `type`, `inputmode` and `autocomplete` set per preset (See `skills/build-ui/patterns/form-presets.md`)
