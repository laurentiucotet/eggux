# Form Presets

Generated from the EGG UI master library on 2026-10-29 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Field Preset](#field-preset) | 17 | - |

On the Figma page: "Example / Field Preset styles", "Stress test / Field Preset"

## Field Preset

Component set · 17 variants · default size 320 × 64

Ready-made fields built from Field + Input, Select, Input Group or Date Input (they follow every change to those). In code set the matching type, inputmode and autocomplete: email, current-password, new-password, tel, cc-number, cc-exp, cc-csc, postal-code, country-name, address-level1, url, bday; time-zone, currency and language are Selects or Comboboxes with the full list; tax-id and iban are text with inputmode and a format check. The nested Field is exposed for states, errors, Show required, Show optional and Show info. country, time-zone, currency and language show a placeholder until a value is picked (set the nested Select to Content=filled and its Value). url uses an Input Group with "https://"; date-of-birth uses Date Input (typed day, month, year, never a calendar); tax-id shows Show info for a short definition.


Usage: eggux build-ui/patterns/form-presets.md

**Use for**

- Sign in, sign up, payment and address forms
- Any field whose data matches one of the 10 Types
- Checkout and billing details: card, postal code, country, region
- Workspace setup, account settings, billing and B2B checkout: url, time-zone, currency, language, tax-id, iban
- Profile and age checks: date-of-birth

**Not for**

- Data that matches no preset: use Field with Input
- One-time codes: use Input OTP

**Anatomy**

1. Field label
2. Control: Input, Select, Input Group (url) or Date Input (date-of-birth) for the Type
3. Hint and Error: each Type has its own default text (nested Field exposed; Show required, Show optional, Show info there)

**Content and behavior**

- Type: email, password, new-password, phone, card-number, card-expiry, card-cvc, postal-code, country, region, url, time-zone, currency, language, date-of-birth, tax-id, iban
- Each Type sets its own Error and Hint defaults (password "Enter your password", new-password "Use at least 8 characters", phone with the country code, card fields, postal code, country, county); rewrite them in the client's words, never leave another type's text
- country shows the placeholder "Select a country" by default; for a filled form set the nested Select to Content=filled with the country as Value
- In code set the matching type, inputmode and autocomplete (email, tel, cc-number, postal-code...)
- Change the label to the client's terminology; keep the preset behavior
- password never blocks paste; new-password pairs with Password Strength
- card-number groups digits by 4; card-expiry formats MM / YY as the user types
- url: Input Group with "https://"; accept an address typed without it
- time-zone, currency, language: placeholder until picked; use a Combobox in code when the list is long (time zones, currencies)
- date-of-birth: typed day, month and year (Date Input), never a calendar
- tax-id: Show info on by default with a one-line definition; validate the format per country
- iban: group in blocks of 4 as people type; accept spaces and lowercase

**Accessibility**

- Correct autocomplete lets browsers and password managers fill the field
- inputmode opens the right mobile keyboard
- Errors and states come from the nested Field

| Variant property | Values |
|---|---|
| Type | email, password, new-password, phone, card-number, card-expiry, card-cvc, postal-code, country, region, url, time-zone, currency, language, date-of-birth, tax-id, iban |

Built from: `Field`

Guides: [form-presets](../../skills/build-ui/patterns/form-presets.md)

Code: `Field` (`FormItem`) + shadcn `Input` or `Select` with `type`, `inputmode` and `autocomplete` set per preset (See `skills/build-ui/patterns/form-presets.md`)
