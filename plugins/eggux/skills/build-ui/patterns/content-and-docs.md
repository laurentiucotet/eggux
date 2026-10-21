# Content, blog and docs pages

Blocks on the Content page (Blog family: Blog Grid, Blog Featured, Blog Post Header, News List,
Blog List, Article; Help center family: Help Hero, Help Categories, Help Popular Articles, Help
Article List, Support Options, Docs Page Footer, Changelog, Status Page) and `Page Shell / Docs`.
Example: `Example / Help center` on the Content page. Page tops for hubs, topics, search,
people and events: the Page Headers page (`marketing-pages.md` § Page headers). Related links:
`Post Card` Layout=compact.

## Rules
- Reading column ≈ 672 px (65-75 characters per line), `body/default` 16/28 for prose.
- Hierarchy: one h1 per page; h2 for sections, h3 below; more space above headings than below.
- Article top: category, date and reading time, title, lead (one or two sentences), author.
- Images have captions or alt text; code in Code Blocks; notes and warnings as inline Alerts.
- Long pages: Table of Contents on the right; docs pages end with previous / next links and
  "Was this page helpful?".
- Blog lists: newest first, featured post on top, categories as Tabs or Chips, pagination or
  "Load more"; RSS and newsletter signup at the end.
- Docs: left navigation by section with the current page selected, search with ⌘K, version
  switcher when several versions exist, "Edit this page" link for public docs.

## Help center
Order: `Block / Navbar Search` → Help Hero → Help Categories → Help Popular Articles → Support
Options → Footer. Category page: Help Article List. Article: `Page Shell / Docs` reading column,
ending with `Block / Docs Page Footer`.

- Search first: one field in the hero and the navbar (⌘K). Results show articles first, then
  "Contact support" when nothing matches; log searches with no results and write those articles.
- Topics by task and object people know (Invoices, Approvals), never by internal team. 6-9 topics,
  each with an article count.
- Articles: title as a question or a task ("Export invoices to CSV"), steps numbered, one task per
  article, screenshots that match the current UI, last-updated date visible.
- Support is never hidden: show channels with hours and expected reply time. Enterprise plans name
  their response time.
- Feedback: "Was this page helpful?" Yes / No; after No, one optional question. Thank with a toast.

## Changelog
- Newest first; date and version on the left; one title per release that states the benefit.
- Tag each line New, Improved or Fixed (Badge info / secondary / success). Link to the help
  article; offer email or RSS.

## Status page
- Overall state in one sentence on top (Alert), "Updated N minutes ago", subscribe button.
- One row per component people recognize (Web app, API, Payments), uptime % as text plus 90 daily
  bars; color is never the only signal.
- Incidents in plain language: what happened, impact, duration, what changed. Keep at least 90 days.
