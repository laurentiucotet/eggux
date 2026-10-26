# Breadcrumb, Top Bar, Page Header, Navbar

Usage guidelines only. Visual specs live in the Figma components.

## Breadcrumb
- Shows where the page sits in the hierarchy; every item but the last is a link.
- Start at a meaningful root (not "Home" when the sidebar already does that job), collapse the
  middle into an ellipsis item past 4 levels, never wrap.
- The last item matches the page title.
- Style=background (a light pill track) on marketing, docs and help pages, on `background/default`,
  never on muted sections. Style=default elsewhere.

## Top Bar (app)
- Sidebar trigger, Breadcrumb, then global actions on the right: search, notifications, help,
  user menu. Page-specific actions belong in the Page Header, not here.
- Style=floating (inset 12, rounded bar with a small shadow) for product headers on a muted
  canvas; Style=default elsewhere.

## Page Header (app)
- One per page: title (heading/h3, the only h3 at that level), one-sentence description, page
  actions with the primary last. Tabs for sub-views go right under it.
- Turn Show actions off when the page has no page action; never leave an empty Actions slot.

## Navbar (marketing)
- Logo, 4-6 links (chevron when it opens a menu), sign in + one primary CTA.
- The brand is `Logo` (Type full; wordmark or mark where space is tight, mark in a collapsed
  Sidebar). Its symbol lives once in `Logo Mark` on the Brand page; every Logo follows.
- On mobile the links move into a Sheet; the CTA stays visible.

## Figma
Navigation page: `Breadcrumb Item` (Show separator off on the last), `Breadcrumb` (Style), `Top
Bar` (Style; Show sidebar trigger), `Page Header` (Show description, Show actions), `Nav Link`
(Show chevron when it opens a menu). Blocks / Navigation: Navbar (Style default, on-image; Show
cart), Footer. Page Shells use them.

## Navigation Menu (mega menu)
- For marketing sites with more than ~5 destinations under one top-level item (Product, Solutions).
- Panel: 2 columns of `Navigation Menu Link` (icon, title, one-line benefit) + optional featured
  card. Up to ~8 links; group by what visitors want to do.
- Opens on hover with a short delay and on click/Enter; Escape closes; the top item stays a link
  to an overview page. Mobile: the same links in the full-screen menu, grouped.
- Figma: `Navigation Menu Link` (State; Title, Description, Icon), `Navigation Menu Panel` (Links,
  Featured slots). Example "navbar with mega menu" on the Navigation components page.

## Split View (list + detail)
- For mail, chat, tickets, files and contacts: users go through many items in a row.
- `Page Shell / Split View`: List slot 384 (resizable 280-560), divider with grip, Detail slot.
- ↑ ↓ move the selection; the list keeps its scroll; the URL holds the selected id.
- Below 1024 the detail is its own page with a back button.
- Example "inbox" on the Page Shells page.

## Related components
- `Back Link` ("All invoices") sits above the title of a record page opened from a list; deeper
  hierarchies use Breadcrumb. Every page starts with a `Skip Link`; long docs and articles get a
  scroll to top button: `Button Icon` outline, Size lg, arrow-up, fixed bottom right (example
  "scroll to top" on the Button page). List pages put `Page Toolbar` (search, Filters, a
  `Toggle Group` view switch, primary action) between the title and the list.
