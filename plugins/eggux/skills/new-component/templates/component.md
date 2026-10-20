---
component: "{{name}}"
status: approved          # proposed → in review → approved → ready for dev
figma: "{{figma_url_with_node_id}}"
updated: "{{date}}"
---

# {{name}}

## When to use
One or two lines; and when to use something else instead.

## Anatomy
| Part | Built from | Notes |
|---|---|---|

## Variants and properties
| Property | Values | Default |
|---|---|---|

## States
| State | What changes |
|---|---|

## Content rules
Limits found in the stress test.
| Content | Rule |
|---|---|
| Title | up to 2 lines, then ellipsis |
| Tags | up to 3, then "+N" with the rest in a tooltip |

## Behavior and accessibility
- Click, keyboard, focus order, role and label.

## Stress test
| Case | Result | Rule added |
|---|---|---|

## Code
Component, props, where it lives; stories or tests for the stress cases.

## Changelog
One line per change: date, what changed, why. Hand edits are reviewed with
`/eggux:update-component`; the snapshot next to this doc (`<name>.snapshot.json`) is the
baseline for the next diff.
- {{date}}: approved.
