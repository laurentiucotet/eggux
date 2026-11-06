# Brief for EGG UI component agents (read fully)

You build EGG UI components in code (React 19 + Tailwind 4 + Storybook 10) from the Figma library,
in a wave where other agents build other components in parallel.

- Repo: the repo root. Code library: the repo root/plugins/eggux/storybook.
- Follow the repo root/plugins/eggux/skills/code-component/SKILL.md exactly (read it fully
  first), including the "A whole Figma page" rules for agents.
- Figma file key BufvaVkSh9vMWPye117Ucd. Load the Figma MCP tools with ToolSearch
  ("select:mcp__Figma__get_metadata,mcp__Figma__get_screenshot,mcp__Figma__get_design_context,mcp__Figma__use_figma").
  Call create_session for the file first and pass its sessionId on every Figma call. Load skill
  figma:figma-design-to-code before get_design_context and figma:figma-use before use_figma.
  READ ONLY: never write to the Figma file. A read-only use_figma dump of every variant (sizes,
  paddings, gaps, radius, bound variables/tokens, text styles) is the fastest way to exact values.
  Screenshots come as URLs: curl them into your scratchpad folder and view them with Read.
- Style references (done): button.tsx, input.tsx, input-group.tsx, field.tsx, switch.tsx,
  chip.tsx, toggle-group.tsx, popover.tsx, dropdown-menu.tsx, tooltip.tsx and their stories.
  Import any existing component from src/components/ui; icons only from '@/components/icons'
  (if an icon is missing, use the closest existing one and report it).
- Lessons from earlier waves:
  * A Field label cannot name a div: for group components look up label[for=id], give it an id
    and point aria-labelledby at it (see range-input.tsx / date-input.tsx).
  * Field passes a ref through its Slot: put your own ref after {...props} and forward the outer
    ref with useImperativeHandle (see copy-field.tsx, search-field.tsx).
  * Transitions are off during tests (.storybook/vitest.setup.ts); never call a DOM-mutating
    probe() inside waitFor (it re-triggers the callback and hangs the file).
  * userEvent.hover does not trigger CSS :hover in Chromium; test hover styles another way.
  * Dates: formatFullDate from calendar-date.ts; stories use fixed dates, never today.
  * Faded disabled text (opacity 50) fails axe contrast: fade the control, keep descriptions
    readable, report the difference as a design finding.
  * Overlays (dialog, sheet, popover) render in a portal: query them from
    within(document.body) / screen, and check focus trap, Escape and focus return.

RULES
- You own only the new files src/components/ui/<name>.tsx and <name>.stories.tsx for your
  components. Do NOT edit shared files: existing components, icons/, globals.css, tokens.css,
  package.json, COMPONENTS.md, .storybook/, vitest.config.ts. Report needed shared changes.
- Run only your own story files, one or two at a time, always with a timeout:
  `npx vitest run --project=storybook src/components/ui/<name>.stories.tsx`
  (cloud sessions: prefix `PW_CHROMIUM=/opt/pw-browsers/chromium timeout 300`)
  and `npm run typecheck` (from the storybook dir).
- Do not run build-storybook, the full suite or the screenshot script. Do not commit or push.
  Do not edit files outside your scope even to fix unrelated failures; report them.

FINAL REPORT (short, plain text): per component: file, stories, what the tests check, status
(done/partial with what is missing); then shared changes needed, missing icons, design findings
(Figma vs reference vs accessibility), the final test result lines, and one COMPONENTS.md row per
component: | Component | Figma page | File | Stories | Tests | Status |.
