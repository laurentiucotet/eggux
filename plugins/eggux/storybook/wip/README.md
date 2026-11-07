# Handoff: EGG UI components into Storybook

Status on 2026-11-07, branch `claude/zealous-planck-j9rsnj`.

**418 of the 427 Figma components are in code** with stories and passing tests. The list with
what each test checks is in `../COMPONENTS.md`. The differences found between Figma, the
references and code are in its "Design findings" section; the ones that need a decision in
Figma are marked there.

## How the work runs
One Figma page (or part of one) per agent, several agents in parallel, following
`skills/code-component/SKILL.md` ("A whole Figma page"). Every agent gets `wip/agent-brief.md`
(rules, lessons learned, report format) plus its scope: page name, page id, the components in
order and what already exists to reuse. The orchestrator alone edits shared files
(COMPONENTS.md, existing components, icons, tokens), reruns each agent's story files, records the
rows and commits only the files it names.

Figma file: `BufvaVkSh9vMWPye117Ucd` (EGG UI). Page ids are in the table below.

## Unfinished files in this folder
None. The Select and Navigation files that were here are finished and in `src/` (2026-11-07).

## What is left (9 components)
Page ids: run `get_metadata` on the file without a node id, or see the inventory in the session
that made this file. Next in line:
Only the pages on hold. Mobile, Form Presets and Kanban are on hold (the user's choice, 2026-11-07).

| Figma page | In code | Missing |
|---|---|---|
| AI Chat | 25/25 | done (Attachment in `ai-attachment.tsx`, built from the docs: no Figma component any more) |
| Admin | 5/5 | done (`admin.tsx`) |
| Automation | 3/3 | done (`automation.tsx`) |
| Background | 4/4 | done (`backgrounds.tsx`) |
| Carousel | 8/8 | done (`carousel.tsx`) |
| Chart | 27/27 | done (`charts.tsx`, `charts-more.tsx`, `charts-extra.tsx`, `charts-flow.tsx`) |
| Chat | 8/8 | done (`chat.tsx`) |
| Color Picker | 4/4 | done (`color-picker.tsx`) |
| Commerce | 8/8 | done (`commerce.tsx`) |
| Editor | 7/7 | done (`editor.tsx`) |
| Email | 16/16 | done (`email.tsx`) |
| Filters | 8/8 | done (`filters.tsx`) |
| Form Presets | 0/1 | Field Preset (on hold) |
| Image | 8/8 | done (`imagery.tsx`; Placeholder and Thumbnail have their own files) |
| Kanban | 0/2 | Kanban Card, Kanban Column (on hold) |
| Mobile | 0/7 | Mobile Header, Bottom Nav Item, Bottom Nav, FAB, Action Sheet, Store Badge, QR Code (on hold) |
| Prose | 6/6 | done (`prose.tsx`) |
| Scheduler | 7/7 | done (`scheduler.tsx`; Time Slot in `time-slot.tsx`) |
| Video | 3/3 | done (`media.tsx`) |

Blocks built outside the 427 count (`site-navigation.tsx`): Block / Navbar (default, on-image, mobile, Centered, Search, Flyout, Mega Menu, dropdown menus), Block / Footer, Footer Simple, Footer Newsletter, Footer Corporate, Footer Centered; `site-banners.tsx`: Announcement Banner, Banner with Action, Banner Countdown, Banner Floating, with Countdown (Style=default; boxed and inline not built). The Navigation blocks page is complete.

Extra types built on request (not in Figma): Sidebar types (`sidebar-variants.tsx`), more cards (`cards-more.tsx`), more avatars (`avatar-more.tsx`).

## Notes
- The full suite (`npm test`) is slow (well over 10 minutes for ~1,000 stories). Run story files
  in groups while building; run the full suite before a release.
- Transitions are off in tests (`.storybook/vitest.setup.ts`). Day labels are built without the
  browser comma (`formatFullDate`).
- Shared changes still open: DropdownMenuItem asChild (real links in menus), item options on
  sub/radio/checkbox menu items, Sheet and Drawer switching to the shared Scrim / Dialog Header /
  Dialog Footer, Range and Duration Input switching to Input Addon, Setting Row stories using
  Select, Badge icon and count options, Board icon (Columns2) for Toggle Group.
