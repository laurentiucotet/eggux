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

Precedence when rules conflict: `decisions.md` > `brand.md` overrides > plugin base rules.
The newest dated decision wins over an older one.

`decisions.md` has three parts: an Inbox where anyone writes a request in one line (date, time,
who), the Terminology table, and numbered decisions (`D-001`) with type, scope, implementation,
how to verify and a status (proposed, approved, applied, verified, superseded). The
`decision-log` skill turns Inbox lines into decisions, applies them and verifies the work.
A SessionStart hook in the plugin tells Claude, at the start of every session, that the file
exists and what is waiting in the Inbox.

If a skill needs a file that does not exist yet, it tells the user which skill creates it
(`/eggux:init`, `/eggux:discovery`, `/eggux:brand-intake`) instead of guessing the content.
