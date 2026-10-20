# Client project files

Everything specific to one client lives in an `eggux/` folder at the root of the client's
project. The plugin holds the method; this folder holds the client's answers.

| File | Written by | Read by |
|---|---|---|
| `eggux/brand.md` | brand-intake | build-ui, review |
| `eggux/objects.md` | discovery | build-ui |
| `eggux/actors.md` | discovery | build-ui, review |
| `eggux/workflows.md` | discovery | build-ui, review |
| `eggux/decisions.md` | decision-log (and anyone deciding something) | build-ui, review |
| `eggux/features/<slug>/feature.md` | new-feature, update-feature | build-ui, review |
| `eggux/features/<slug>/scenarios.md` (S-xx, E-xx) | new-feature, update-feature, build-ui (statuses) | build-ui, review |
| `eggux/features/<slug>/workflows.md` (F-xx) | new-feature, update-feature | build-ui, review |
| `eggux/features/<slug>/decisions.md` (Inbox, FD-xx) | anyone (Inbox), update-feature | build-ui, review |
| `eggux/components/<name>.md` | new-component, update-component (client components) | build-ui, review |
| `eggux/components/<name>.snapshot.json` | new-component, update-component (after approval) | update-component (baseline for the next diff) |

Precedence when rules conflict: `decisions.md` > `brand.md` overrides > plugin base rules.
The newest dated decision wins over an older one.

`decisions.md` has three parts: an Inbox where anyone writes a request in one line (date, time,
who), the Terminology table, and numbered decisions (`D-001`) with type, scope, implementation,
how to verify and a status (proposed, approved, applied, verified, superseded). The
`decision-log` skill turns Inbox lines into decisions, applies them and verifies the work.
A SessionStart hook in the plugin tells Claude, at the start of every session, that the file
exists and what is waiting in the Inbox, including the Inbox of each feature's `decisions.md`.

Each feature has a folder and a Figma page (after the `FEATURES` divider) with the same IDs:
F-xx flows, S-xx scenarios and E-xx edge cases as sections, screens named `<ID> / <n> <screen>`,
FD-xx feature decisions. A feature decision that changes the whole product is also a D-xxx in
`eggux/decisions.md`; product decisions win. `/eggux:update-feature` keeps the folder, the
product files and the Figma page in sync.

If a skill needs a file that does not exist yet, it tells the user which skill creates it
(`/eggux:init`, `/eggux:discovery`, `/eggux:brand-intake`) instead of guessing the content.
