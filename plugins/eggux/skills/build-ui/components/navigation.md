# Breadcrumb, Top Bar, Page Header, Navbar

Usage guidelines only. Visual specs live in the Figma components.

## Breadcrumb
- Shows where the page sits in the hierarchy; every item but the last is a link.
- Start at a meaningful root (not "Home" when the sidebar already does that job), collapse the
  middle into an ellipsis item past 4 levels, never wrap.
- The last item matches the page title.

## Top Bar (app)
- Sidebar trigger, Breadcrumb, then global actions on the right: search, notifications, help,
  user menu. Page-specific actions belong in the Page Header, not here.

## Page Header (app)
- One per page: title (heading/h3, the only h3 at that level), one-sentence description, page
  actions with the primary last. Tabs for sub-views go right under it.

## Navbar (marketing)
- Logo, 4-6 links (chevron when it opens a menu), sign in + one primary CTA.
- On mobile the links move into a Sheet; the CTA stays visible.

## Figma
Navigation page: Breadcrumb Item, Breadcrumb, Top Bar, Page Header, Nav Link. Blocks /
Navigation: Navbar, Footer. Page Shells use them.

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
  hierarchies use Breadcrumb. Every page starts with a `Skip Link`; long docs and articles get
  `Scroll To Top`. List pages put `Page Toolbar` (search, Filters, View Switcher, primary action)
  between the title and the list.
