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

If a skill needs a file that does not exist yet, it tells the user which skill creates it
(`/eggux:init`, `/eggux:discovery`, `/eggux:brand-intake`) instead of guessing the content.
