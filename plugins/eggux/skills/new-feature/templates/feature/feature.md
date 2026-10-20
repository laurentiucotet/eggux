---
feature: "{{name}}"
slug: "{{slug}}"
status: draft            # draft → ready → in design → in review → ready for dev → built → verified
figma: "{{figma_page_url}}"
created: "{{date}}"
updated: "{{date}}"
---

# {{name}}

The spec. Scenarios and edge cases are in `scenarios.md`, flows in `workflows.md`, decisions and
new input in `decisions.md`. Change any of them with `/eggux:update-feature`, which keeps all
files and the Figma page in sync.

## Summary
One paragraph: what it is, for whom, why now.

## Goal
- Actor goal:
- Business goal:
- Success metric:

## Actors and access
| Actor | Can see | Can do | Notes |
|---|---|---|---|

## Data
| Object | Attributes shown | Attributes entered | Rules |
|---|---|---|---|

## States
| State | What the user sees | Figma frame |
|---|---|---|
| Empty / first use | | States / Empty |
| Loading | | States / Loading |
| Error | | States / Error |
| No access | | States / No access |
| Offline | | |
| Large data | | |

## Feedback, notifications, audit
| Action | Feedback | Notified | Logged |
|---|---|---|---|

## Screens
| Screen | Used in | Shell | Blocks and components | Figma frames | Status |
|---|---|---|---|---|---|

## Acceptance criteria
Every scenario and edge case in `scenarios.md` is an acceptance criterion (Given / When / Then).
Criteria that are not a scenario (permissions, performance, accessibility, analytics):
- Given …, when …, then …

## Impact on the product
Changes this feature makes outside its folder, so they can be found and undone.
| File or place | Change | Since |
|---|---|---|
| `eggux/objects.md` | | |

## Out of scope

## Open questions
| # | Question | Blocks | Asked | Answer |
|---|---|---|---|---|

## Changelog
Newest first. One entry per update: date and time, source, what changed, files and Figma
sections touched.
- {{date}} · created with /eggux:new-feature.
