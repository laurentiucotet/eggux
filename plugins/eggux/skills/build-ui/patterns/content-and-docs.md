# Content, blog and docs pages

Blocks on the Content page (Blog family: Blog Grid, Blog Featured, Blog Post Header, News List,
Blog List, Article; Help center family: Help Hero, Help Categories, Help Popular Articles, Help
Article List, Help Topic, Help Article, Help Search Results, Contact Support, Help Requests,
Support Options, Docs Page Footer, Changelog, Status Page; Prose family: Legal Page,
Content with Image) and `Page Shell / Docs`. Examples: `Example / Help center` and
`Example / Legal page` on the Content page, `Example / Blog index page` on the Sections page.
Page tops for hubs, topics, search, people and events: the Page Headers page (`marketing-pages.md`
§ Page headers). Related links: `Post Card` Layout=compact.

## Rules
- Reading column ≈ 672 px (65-75 characters per line), `body/default` 16/28 for prose.
- Hierarchy: one h1 per page; h2 for sections, h3 below; more space above headings than below.
- Article top: category, date and reading time, title, lead (one or two sentences), author
  (Byline, default: name and "12 Oct 2026 · 6 min read"). Tags under the title: `Badge List`.
- Images have captions or alt text; code in Code Blocks; notes and warnings as inline Alerts.
- Long pages: Table of Contents on the right; docs pages end with previous / next links and
  "Was this page helpful?".
- Blog lists: newest first, featured post on top, categories as Tabs or Chips, pagination or
  "Load more"; RSS and newsletter signup at the end.
- Docs: left navigation by section with the current page selected, search with ⌘K, version
  switcher when several versions exist, "Edit this page" link for public docs.
- Previous / next links at the end of a docs page are two `Pager Link`s (Direction=previous, next) in equal columns.
- Images with a caption use `Image Figure` (set the ratio on its nested Image Placeholder; Show credit for the source).
- To explain one idea with a picture inside a long page use `Block / Content with Image`: at most
  one pull Quote, caption every image.

## Paid content
- Paid articles: `Block / Article Paywall` after the preview (headline, lead, author and two
  paragraphs fading into the page), `Meter Banner` pinned to the bottom while free reads are left;
  Type metered, registration or hard as in `monetization.md`. Screens: SCREENS / Paywalls.
- Locked documents and reports inside the app use `Gate Overlay` Style=fade over the first part of
  the real content; public articles use the content paywall blocks.

## Legal and policy pages
Navbar, `Block / Legal Page`, Footer (`Example / Legal page`). The block holds Header Simple, a
Table of Contents on the left and a 720 reading column with numbered h3 sections; put a
short-version Alert first, and keep the date and the contact always visible.

## Help center
Start from SCREENS / Help Center (Browse topics, Search, Contact support, each Desktop and Mobile).
Pages: home (`Block / Navbar Search` → Help Hero → Help Categories → Help Popular Articles →
Support Options → Footer), topic (`Block / Help Topic`), subtopic list (`Block / Help Article
List`), article (`Block / Help Article`), search (`Block / Help Search Results`), contact
(`Block / Contact Support`), my requests (`Block / Help Requests`).

- Navigation: topic tree on the left (current topic expanded, current article selected),
  Breadcrumb Help center > topic > subtopic, "On this page" on the right from the h2s. Below 1024
  hide the TOC; below 768 swap the tree for a Topics button (Sheet) and the TOC for an On this
  page menu.
- Typeahead: Search Suggestions under the field with recent searches, suggested articles and
  topics; the typed part is highlighted; Enter opens the results page.
- Results: keep the query in the field, say how many results, highlight matched words, filter by
  type (chips) and topic (facets, a Sheet on phones). An AI answer goes first only with sources.
- No results is never a dead end: the query stays, "Did you mean", popular articles and Contact
  support.
- Contact support: show the reply time before the form; suggest 3 articles from the subject as
  people type; after sending show the request number, where the copy went and a link to My
  requests.

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
- Newest first; version and date in the entry's meta line; one title per release that states the benefit.
- Tag each line New, Improved or Fixed (Badge info / secondary / success). Link to the help
  article; offer email or RSS.
- A release with several changes is one `Release Note Item` with Show changes: one `Release Note Line` per change; Show text off when the lines say it all (Block / Changelog).

## Status page
- Overall state in one sentence on top (Alert), "Updated N minutes ago", subscribe button.
- One row per component people recognize (Web app, API, Payments), uptime % as text plus 90 daily
  bars; color is never the only signal.
- Incidents in plain language: what happened, impact, duration, what changed. Keep at least 90 days.
- Each row is `Service Status Row` with Show bars: `Uptime Bars` holds 90 `Uptime Day` bars; select a day to set its State (operational, degraded, outage, maintenance, no-data).

## Related components
- Changelog and in-app What's new entries use `Release Note Item`. Developer docs use
  `Command Snippet` for one copyable command, `Endpoint Row` for API reference lists and
  `JSON Viewer` for request and response payloads.
- Status page rows use `Service Status Row`: service name, 90-day uptime as text and status in words
  with a Status Dot, linked to the incident when not operational.
