# Record page (detail view)

The page of one object: customer, order, invoice, project. Built from the App shell.

## Structure
1. Top Bar breadcrumb: list → object ("Customers > Ana Popescu").
2. `Block / Record Header`: avatar or icon, name, status Badge, key facts on one line, 1 primary
   action + secondary actions + overflow menu, section Tabs.
3. `Block / Record Detail`: main column (details card with Description List, related lists) and
   side column 384 (Activity timeline, notes, related people).

## Rules
- One primary action: the most frequent next step for this object (Create order, Send invoice).
- Destructive actions (archive, delete) live in the overflow menu, never as a visible primary.
- Tabs split sections the user switches between; each tab keeps the header visible.
- Status changes and important events appear in Activity with who and when.
- Loading: Skeleton in the shape of the cards; missing data: "Not set" + action.
- Tablet: side column moves under the main column. Mobile: tabs scroll horizontally, primary
  action in a sticky bottom bar.

## Figma
Example "record page" on the App blocks page.
