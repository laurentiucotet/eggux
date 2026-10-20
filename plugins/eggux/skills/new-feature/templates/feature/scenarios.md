---
feature: "{{name}}"
updated: "{{date}}"
---

# Scenarios and edge cases: {{name}}

One scenario per path an actor takes to reach the goal; one edge case per unusual condition
the feature must handle. Each has a Figma section with the same ID and title, and screens named
`<ID> / <n> <screen>`. IDs are never reused: a removed item keeps its ID with status `removed`.
Statuses: draft → in design → in review → ready for dev → built → verified; removed.

## Scenarios

### S-01 · {{title}}
- Actor:
- Flow: F-01, steps 1-4
- Given:
- When:
- Then:
- Screens: S-01 / 1 …, S-01 / 2 …
- Figma: section "S-01 {{title}}"
- Status: draft

## Edge cases

### E-01 · {{title}}
- Condition: what is unusual (duplicate, limit, conflict, partial failure, no data, offline…)
- Given:
- When:
- Then:
- Screens: E-01 / 1 …
- Figma: section "E-01 {{title}}"
- Status: draft
