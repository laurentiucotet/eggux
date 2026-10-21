# List & Tree

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [List Item](#list-item) | 5 | Leading, Trailing |
| [Tree Item](#tree-item) | 36 | - |
| [Sortable List Item](#sortable-list-item) | 4 | Trailing, Leading |
| [Checklist Item](#checklist-item) | 3 | - |
| [Job Listing](#job-listing) | 1 | - |

On the Figma page: "Example / in notifications", "Example / navigation tree", "Example / permissions tree", "Example / table columns", "Stress test / Checklist Item", "Stress test / Job Listing", "Stress test / List Item", "Stress test / Sortable List Item", "Stress test / Tree Item"

## List Item

Component set · 5 variants · default size 384 × 58

Row in a content list (people, files, appointments). Different from Menu Item (an action in a popover) and Sidebar Item (navigation). Leading and Trailing are native slots. Show leading and Show trailing hide the slots for text-only rows.

**Use for**

- Lists of people, files, customers or orders
- Tables on mobile: one List Item per row with 2-3 fields
- Search results, recent items and notifications

**Not for**

- Actions in a popover: use Menu Item
- Navigation destinations: use Sidebar Item
- Comparing items across several attributes: use Table
- Hierarchies: use Tree Item

**Anatomy**

1. Leading slot: Avatar or icon
2. Title
3. Description (Show description)
4. Trailing slot: meta, Badge, chevron or one action
5. Show leading and Show trailing hide the slots for text-only rows

**Content and behavior**

- State: default, hover, selected, focus, disabled
- The whole row opens the item when it has one destination; otherwise only the title links
- Trailing holds at most one action plus meta; more actions go in a Button Icon with a Menu
- Every list has an empty state
- Text-only lists (settings, links) turn Show leading off; compact lists turn Show description off

**Accessibility**

- The row is one link or button with an accessible name from the title
- Focus state uses border/ring
- Selected is shown with more than color (check or aria-selected)

| Variant property | Values |
|---|---|
| State | default, hover, selected, focus, disabled |

| Property | Type | Default |
|---|---|---|
| Title | text | Ana Popescu |
| Description | text | Last order: 12 Nov, 09:30 |
| Show description | boolean | true |
| Show leading | boolean | true |
| Show trailing | boolean | true |

Slots (fill them in the instance, never detach): `Leading`, `Trailing`

Built from: `Avatar`, `Badge`. Icons: chevron-right

Tokens and styles:
- Colors: `background/accent`, `background/default`, `background/muted`, `foreground/accent`, `foreground/default`, `foreground/muted`
- Spacing and size: `density/list-padding-y`, `spacing/0_5`, `spacing/2`, `spacing/3`, `spacing/96`
- Radius: `radius/md`
- Text styles: `body/small`, `ui/label`

Guides: [list-and-tree](../../skills/build-ui/components/list-and-tree.md)

## Tree Item

Component set · 36 variants · default size 256 × 32

Row of a tree (navigation, folders, permissions). Type: collapsed, expanded, leaf. Level 0-3 sets the indent (16 px per level). Checkbox (exposed) for multi-select trees: a parent shows indeterminate when some children are checked.

**Use for**

- Folders and nested navigation
- Permission trees with checkboxes
- Locations or categories with levels

**Not for**

- Flat lists: use List Item
- Deeper than 4 levels: use a different structure, such as drill-down pages

**Anatomy**

1. Indent (16 px per Level)
2. Chevron (Type collapsed or expanded; none for leaf)
3. Checkbox (Checkbox)
4. Icon (Icon, Icon type)
5. Label
6. Count (Count)

**Content and behavior**

- Type: collapsed, expanded, leaf; State: default, hover, selected; Level 0-3
- Chevron toggles expansion; clicking the label selects
- With checkboxes a parent is checked when all children are, indeterminate when some are
- Counts only where they help the task (unread, items to review)

**Accessibility**

- Role tree / treeitem with aria-expanded and aria-level
- Keyboard: up and down move, right expands, left collapses
- Checkbox state includes indeterminate (aria-checked="mixed")

| Variant property | Values |
|---|---|
| Type | collapsed, expanded, leaf |
| State | default, hover, selected |
| Level | 0, 1, 2, 3 |

| Property | Type | Default |
|---|---|---|
| Label | text | Design |
| Checkbox | boolean | false |
| Icon | boolean | true |
| Icon type | instance swap | Icon/file-text |
| Count | boolean | false |

Built from: `Badge Count`, `Checkbox`. Icons: chevron-down, chevron-right, file-text

Tokens and styles:
- Colors: `background/accent`, `background/muted`, `foreground/accent`, `foreground/default`
- Spacing and size: `spacing/1`, `spacing/10`, `spacing/14`, `spacing/2`, `spacing/6`, `spacing/8`
- Radius: `radius/md`
- Text styles: `body/small`, `ui/label`

Guides: [list-and-tree](../../skills/build-ui/components/list-and-tree.md)

## Sortable List Item

Component set · 4 variants · default size 480 × 58

A row people reorder (columns, form fields, steps, priorities): drag handle, Leading slot (Show leading: a 1:1 image, 48 px, for items told apart by their picture), label, description, Trailing slot (switch, remove, menu). dragging = lifted with shadow; drop-target = primary line where it will land. Keyboard: focus the handle, Space to pick up, arrows to move, Space to drop; announce the new position. Offer Move up / Move down in the menu too. Label truncates on one line, description on two.

**Use for**

- Columns of a view, fields of a form, steps of a process
- Priorities and the Selected side of a Transfer List
- Ordering of navigation items or dashboard widgets

**Not for**

- Order that does not matter: use List Item
- Moving cards between stages: use Kanban

**Anatomy**

1. Drag handle (grip-vertical)
2. Leading slot: 1:1 image, 48 px, or an icon (Show leading)
3. Label
4. Description (Show description)
5. Trailing slot: Switch, remove or menu

**Content and behavior**

- State: default, hover, dragging (lifted with shadow), drop-target (primary line where it lands)
- Drag by the handle only, so the row stays clickable
- Save on drop and allow Undo
- Label truncates on one line, Description on two
- Show the order number when it matters
- Leading image only when the picture tells items apart (products, media); keep it 1:1 at 48 px, crop, never stretch

**Accessibility**

- Focus the handle, Space picks up, arrows move, Space drops, Escape cancels
- Announce the new position: "Invoice number moved to position 2 of 6"
- Offer Move up and Move down in the row menu
- A Leading image is decorative (empty alt) when the Label already names the item

| Variant property | Values |
|---|---|
| State | default, hover, dragging, drop-target |

| Property | Type | Default |
|---|---|---|
| Label | text | Invoice number |
| Description | text | Shown in the table and in exports |
| Show description | boolean | true |
| Show leading | boolean | false |

Slots (fill them in the instance, never detach): `Trailing`, `Leading`

Built from: `Button Icon`, `Image Placeholder`. Icons: grip-vertical

Tokens and styles:
- Colors: `background/card`, `background/muted`, `background/primary`, `border/default`, `foreground/default`, `foreground/muted`
- Spacing and size: `border-width/2`, `spacing/0_5`, `spacing/2`, `spacing/3`
- Radius: `radius/md`
- Text styles: `body/small`, `ui/label`
- Effects: `shadow/lg`

Guides: [list-and-tree](../../skills/build-ui/components/list-and-tree.md), [select](../../skills/build-ui/components/select.md)

Code: `@dnd-kit/sortable` with keyboard sensor and announcements (Drag handle = `useSortable` listeners)

## Checklist Item

Component set · 3 variants · default size 480 × 54

One task in a checklist (onboarding, a project, a record's to-dos): checkbox, title, due date, assignee. done is struck through and moves to the end; overdue says it in destructive. Ticking it saves at once and can be undone. Several steps people must do in order: Stepper.

**Use for**

- An onboarding checklist
- To-dos of a project or a record
- Steps before a close or a launch

**Not for**

- Steps people must do in order: use Stepper
- A choice in a form: use Checkbox
- Cards on a board: use Kanban Card

**Anatomy**

1. Checkbox
2. Title: ui/label
3. Due (Show due): ui/caption, muted; destructive when overdue
4. Assignee (Show assignee): Avatar xs

**Content and behavior**

- Ticking saves at once and can be undone (toast with Undo)
- Done is struck through and moves to the end
- Overdue says it in destructive ("Overdue · 12 Oct")
- Open items sort by due date; the title wraps to two lines at most
- The row opens the task; the Checkbox only ticks

**Accessibility**

- The Checkbox is labelled by the title
- Overdue and done are in text, not color or strikethrough alone
- The assignee Avatar has the person's name as alt

| Variant property | Values |
|---|---|
| State | open, done, overdue |

| Property | Type | Default |
|---|---|---|
| Title | text | Send Q4 forecast to Northwind |
| Show due | boolean | true |
| Show assignee | boolean | true |

Built from: `Avatar`, `Checkbox`

Tokens and styles:
- Colors: `background/destructive`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/0_5`, `spacing/2`, `spacing/3`
- Radius: `radius/md`
- Text styles: `body/small`, `ui/caption`

Guides: [list-and-tree](../../skills/build-ui/components/list-and-tree.md), [settings-and-admin](../../skills/build-ui/patterns/settings-and-admin.md)

Code: custom row: shadcn `Checkbox` + `Avatar` (Optimistic save with an Undo toast (Sonner))

## Job Listing

Component · 1 variant · default size 720 × 113

One open role in a careers list: title, team, type and work mode, location, posted date, salary range, Apply. The whole row links to the role page. Show the salary range when you can; candidates filter on it. Sort newest first; group by team with Section Heading.

**Use for**

- A careers page
- Open roles on a company profile
- Internal job openings

**Not for**

- A background export or import: use Job Item
- A generic row: use List Item
- A blog post or article: use Post Card

**Anatomy**

1. Title: ui/label, with a Badge (Show badge: "New")
2. Meta: team, type, work mode ("Finance · Full-time · Hybrid")
3. Details: location and posted date
4. Salary (Show salary): range with currency and period
5. Apply: Button

**Content and behavior**

- The whole row links to the role page
- Show the salary range when you can; candidates filter on it
- Sort newest first; group by team with Section Heading and counts
- "New" only for roles posted in the last 7 days
- On mobile, salary and Apply move under the details

**Accessibility**

- The row is a list item with one main link named by the title
- Apply is named with the role ("Apply for Senior Accountant")
- The posted date is in a <time> element

| Property | Type | Default |
|---|---|---|
| Title | text | Senior Accountant |
| Meta | text | Finance · Full-time · Hybrid |
| Location | text | Bucharest, Romania |
| Posted | text | Posted 3 days ago |
| Salary | text | EUR 3,800-4,600 / month |
| Show badge | boolean | true |
| Show salary | boolean | true |

Built from: `Badge`, `Button`. Icons: clock, map-pin

Tokens and styles:
- Colors: `border/default`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/1`, `spacing/2`, `spacing/4`
- Text styles: `body/small`, `heading/h4`, `ui/caption`, `ui/label`

Code: custom `<li>` with a stretched `<a>` + `Badge` + `Button asChild` (Salary range with currency and period)
