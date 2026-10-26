# Pattern: form presets

**Problem:** common fields (email, phone, card) are rebuilt slightly differently in every
project, with missing input types, autocomplete and formats, which costs users time and errors.
**Heuristic:** consistency and standards, error prevention.

## Presets
| Preset | Code | Rules |
|---|---|---|
| email | `type="email"` `autocomplete="email"` | Example placeholder; validate on blur |
| password | `type="password"` `autocomplete="current-password"` | "Show" toggle; never block paste |
| new-password | `autocomplete="new-password"` | Strength meter + what is missing, in text |
| phone | `type="tel"` `autocomplete="tel"` | Country code select + number; accept spaces |
| card-number | `inputmode="numeric"` `autocomplete="cc-number"` | Group digits by 4; show the brand |
| card-expiry | `autocomplete="cc-exp"` | Format MM / YY as the user types |
| card-cvc | `inputmode="numeric"` `autocomplete="cc-csc"` | 3 or 4 digits; say where to find it |
| postal-code | `autocomplete="postal-code"` | Width fits the format; format hint below |
| country | `autocomplete="country-name"` | Select (Combobox for long lists); preselect the user's country. Figma shows "Select a country" until filled; set the nested Select to Content=filled for a filled form |
| region | `autocomplete="address-level1"` | Options depend on the country |

## Rules
- Use the preset instead of a plain Input whenever the data matches; change the label to the
  client's terminology.
- Order address fields the way the country writes addresses.
- Blocks (sign in, sign up, payment, address) are starting points: remove what the workflow
  does not need rather than adding fields.

## Figma
`Field Preset` on the Form Presets page, `Block / *` on the Blocks page.
