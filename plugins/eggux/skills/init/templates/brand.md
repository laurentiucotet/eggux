---
client: "{{client}}"
figma_file: "{{figma_url}}"
updated: "{{date}}"
---

# Brand

## Identity
- Logo: (path or link)
- Personality: (3 adjectives, e.g. calm, precise, warm)
- Voice: (how the product talks: formal/informal, "tu"/"dumneavoastră", tone in errors)

## Color
| Role | Value | Primitive alias |
|---|---|---|
| Primary | | `color/brand/600` |
| Primary foreground | | |
| Ring | | |
| Neutral base | | `color/neutral/*` |

## Typography
- Sans: (family)
- Serif: (family or none)
- Mono: (family)

## Shape
- Radius base: (px) → `radius/base`
- Shadows: (none / subtle / pronounced)

## Overrides
Client-specific deviations from the plugin's base rules and components. Each line wins over
the base rule. Keep them short and concrete.

- (example) Buttons never show icons.
- (example) Cards have no shadow, border only.
