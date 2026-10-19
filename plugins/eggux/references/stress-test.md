# Stress test for components and blocks

Every new component is tested with realistic extremes before review. The goal is rules, not
pictures: each break found becomes a content rule in the component and its doc.

## Cases
Pick the ones that apply to the component's content.

| Dimension | Cases |
|---|---|
| Text length | Minimum (shortest real value), typical, maximum (2-3× typical), long unbroken word, email or URL |
| Lists and counts | 0, 1, typical, many (tags, avatars, actions, list items); decide where "+N" starts |
| Missing data | No image, no avatar (initials), optional fields empty, no description |
| Numbers | 0, 1, negative, 999,999,999.99, many decimals, currency with long symbols (CHF) |
| Dates | Today, relative ("2 h ago"), far past, far future, different time zone |
| States | Default, hover, focus, active or selected, disabled, loading, error, empty |
| Themes and density | Light, Dark, Corporate Light, Compact |
| Width | Narrowest container it lives in (mobile 360, sidebar 280, grid column), widest (full 1152) |
| Translation | German or Romanian at +35% length; right-to-left only when the client needs it |

## Test content
- Names: "Al", "Maximilian Alexander von Hohenzollern-Sigmaringen"
- Companies: "3M", "Northwind Traders International Holding GmbH & Co. KG"
- Unbroken: "Rechnungsprüfungsverfahrensbeschleunigung", "anna.popescu-ionescu@subsidiary.example-company.com"
- Titles: "Q3", "Quarterly revenue reconciliation for all European entities including the recently acquired subsidiaries"
- Amounts: "€0.00", "−€1,250.00", "€1,234,567,890.99", "CHF 12,450.50"
- Tags: 0, 1, 3, 10 (with one 30-character tag)

## Layout in Figma
- One frame `Stress test / <Component>` on the component's page, inside a `Stress tests` section.
- A grid: one column per case of the main dimension, one row per secondary dimension
  (for example text length × tag count), each cell labeled above with `ui/caption` muted.
- A last row in Dark and Corporate, and one at the narrowest width.
- Instances only; overrides through properties and slots. A case you can only show by detaching
  is itself a finding: the component needs a property or slot.

## What counts as a break
- Text clipped without ellipsis, text overlapping, one-letter-wide text.
- The component grows past its container or pushes siblings out of alignment.
- Empty gaps when optional parts are missing.
- A row of items wrapping into an unplanned second line.
- Contrast or focus lost in a theme.

## Turning breaks into rules
| Break | Typical rule |
|---|---|
| Long text | `maxLines` 1-2 with ellipsis, full text in a tooltip or on the detail page |
| Too many items | Show N, then a "+M" item that opens the rest (tooltip, popover) |
| Unbroken strings | Truncate in the middle for emails and ids, or allow breaking anywhere |
| Missing image | Placeholder with initials or an icon, same size |
| Optional fields | Hide the row, never leave its gap |
| Big numbers | Compact format (1.2M) with the exact value on hover; numbers never wrap |
| Narrow width | Stack parts vertically below a breakpoint, or hide secondary parts |
