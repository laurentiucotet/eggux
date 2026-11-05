# Components in code

Coverage of the EGG UI Figma library in code. `/eggux:code-component` adds a row per component;
`/eggux:code-qa` checks it. Status: done (stories and tests green, matches Figma), partial
(some variants or states missing), todo.

| Component | Figma page | File | Stories | Tests | Status |
|---|---|---|---|---|---|
| Button | Button | `src/components/ui/button.tsx` | Default, Variants, Sizes, WithIcons, Loading, Disabled, AsLink, LongLabel, VariantsDark, VariantsCorporate | click, keyboard, sizes 28/32/36/40/48, loading blocks clicks and Enter, disabled, link, one line at 276, axe in Light, Dark, Corporate | done |
| Badge | Badge | `src/components/ui/badge.tsx` | Default, Solid, Soft, Categories, Sizes, LongLabel, SoftDark, CategoriesDark | sizes 16/20/24, truncation at 256, axe in Light and Dark | partial: icon and count options not built |
| Input | Input | `src/components/ui/input.tsx` | Default, Filled, Sizes, Invalid, ReadOnly, Disabled, LongValue, FilledDark | typing, sizes 32/36/40, invalid with description, read-only keeps value, one line at 276, axe in Light and Dark | partial: floating style, loading and clear not built |
