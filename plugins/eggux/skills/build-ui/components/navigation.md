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
