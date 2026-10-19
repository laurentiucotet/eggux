# Changelog

Versions of the EGG UX plugin (`plugins/eggux/.claude-plugin/plugin.json`). The Figma library
EGG UI v2 changes in the same PRs; its own version is on the Intro page.

## 0.30.0
- Figma Intro page: getting started, what is inside with counts, how to use, file organization,
  conventions, credits and license, changelog (library version 2.4).
- 6 navigation blocks: Navbar Centered, Navbar Search, Navbar Mega Menu; Footer Newsletter,
  Footer Corporate, Footer Centered.
- New Help center family (Content page), 8 blocks: Help Hero, Help Categories, Help Popular
  Articles, Help Article List, Support Options, Docs Page Footer, Changelog, Status Page; plus
  `Example / Help center`. 109 blocks in total.
- Guides: navbar and footer picks in marketing-pages; help center, changelog and status page
  rules in content-and-docs; index rows; code mapping; Community checklist (Intro done).

## 0.29.0
- 13 blocks: Pricing Single, Pricing Calculator; FAQ Grid, FAQ Centered; Stats Cards, Stats
  Split; Team Grid, Team List; Careers List, Careers Benefits, Job Header; Gallery Grid,
  Gallery Mosaic. New families Careers and Gallery.
- Charts: Gauge (on track, at risk, off track), Treemap.
- Gantt: `Gantt Bar`, `Gantt Milestone`, `Block / Gantt` with dependencies and a today line.
- Guides: chart picks, Gantt rules, marketing block families; code mapping; API notes on vector
  strokes and duplicate page names.

## 0.28.0
- `add-component` becomes `new-component`: from a screenshot or description, reuse map,
  proposal, build, stress test, review, approval; after approval the component doc
  (`eggux/components/<name>.md` for clients, `components/<name>.md` in the plugin for the
  library), a decision or library records, code with stories for the stress cases, Ready for dev.
- `references/stress-test.md`: cases (text length, counts, missing data, numbers, dates, states,
  themes, widths, translation), test content, Figma layout, breaks and the rules they become.
- `templates/component.md` for component docs.

## 0.27.0
- New skill `new-feature`: plays back the idea, interviews in rounds (purpose, access, flow,
  data, states, edge cases, feedback, scope) with defaults from the patterns and the client
  files, writes `eggux/features/<slug>.md` with acceptance criteria and updates objects,
  actors, workflows and decisions.
- build-ui reads the feature spec; review checks its acceptance criteria, states and edge cases.

## 0.26.0
- Generic patterns: action-feedback (when a toast, when the visible change is enough, per action),
  bulk-actions, permissions-and-access, errors-and-recovery (sessions, offline, conflicts,
  undo, trash, history), notifications, sharing-and-invites, writing (labels, messages,
  dates, numbers).
- `common-flows.md`: 14 reusable flows (create, edit, delete, bulk, find, invite, share,
  onboard, sign in, approve, import, export, change plan, act on a notification); discovery
  and the workflows template refer to them ("Based on").
- ux-rules: feedback rule rewritten, new Safety and recovery section, writing rule; review
  checks action feedback and access, offline and error states.

## 0.25.0
- Block pages organized in Figma sections: `Blocks` with one sub-section per family, `Examples`
  next to it; add-component places new blocks in their family.
- 19 new blocks: Contact Cards, Contact with Map, Offices, Map Section; Testimonial Single,
  Grid, Split, Carousel; CTA Split, CTA Card; Features Split, Bento Grid; Hero with Screenshot;
  Blog Grid, Blog Featured, Blog Post Header, News List; Announcement Banner, Footer Simple.
- `Map` component; marketing and content patterns list which block fits which need.

## 0.24.0
- Decisions workflow: `decisions.md` with Inbox, numbered decisions (type, scope,
  implementation, verify, status); `decision-log` records, applies design decisions at the
  source (Components or Semantic tokens, code component) and verifies the work.
- SessionStart hook (`plugins/eggux/hooks/`) reminds Claude of the decisions file and new
  Inbox lines; build-ui reads decisions first and verifies them before finishing; review
  checks every applied decision; brand-intake records brand changes as decisions.
- Skill audit fixes: external validator reference replaced by `/eggux:audit-tokens`;
  add-component updates code-mapping and the changelog.

## 0.23.0
- Charts: Donut Chart (donut, pie), Bar Chart Horizontal, Heatmap.
- Enterprise: Import Mapping block and import rules.
- `references/code-mapping.md` (Figma component → code), this changelog.

## 0.22.0
- Corporate theme: Corporate Light / Corporate Dark modes (blue primary, slate, 4 px radius,
  firmer input borders).
- Enterprise pack: data grid template with saved views, groups and totals, Filter Builder,
  Approvals, Audit Log, Roles & Permissions, Report, Record Form, Save Bar, Org Switcher.
- Dense "enterprise invoices" example and a Default vs Corporate comparison.
- 180 leftover domain texts neutralized; patterns enterprise-apps, approvals, audit-log, reports.

## 0.21.0
- Tour (Coachmark, Hotspot), Video Player with `video/*` tokens.
- Community preparation: Cover, Intro, Foundations pages, listing copy.

## 0.20.0
- AI chat kit (Prompt Input, messages, Reasoning, Tool Call with approval, Sources, Citation,
  Suggestion) and AI blocks; `ai-chat` pattern.

## 0.19.0
- Rich Text Editor, comments, chat, month view, Rating, Carousel, Color Picker.

## 0.18.0 and earlier
- Foundations (variables, Light and Dark, density, motion, chart palette), core components,
  field presets, blocks for app, marketing, auth, commerce and content, seven page shells,
  charts, Kanban, Scheduler, skills for discovery, brand intake, build, review and audits.
