# Changelog

Versions of the EGG UX plugin (`plugins/eggux/.claude-plugin/plugin.json`). The Figma library
EGG UI v2 changes in the same PRs; its own version is on the Intro page.

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
