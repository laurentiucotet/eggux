# Avatar

Usage guidelines only. Visual specs live in the Figma component.

## Rules
- Always next to the person's name, or with the name as accessible label; never the only identifier.
- Photo when available, initials (two letters) as fallback, user icon only when there is no name.
- Size by density: sm in tables and dense lists, default in lists and sidebars, lg / xl on
  profile cards and headers.
- Status dot only when presence matters to the task (available, online), with text elsewhere.

## Figma
`Avatar` Type (initials, image) × Size (sm, default, lg, xl). For a photo, put an image fill on
the `image` layer of the instance. `Status` shows the online dot.
- Shape: circle for people, square for companies, workspaces and apps (one shape per list).
  Size xs (20) for inline mentions and dense table cells.

## Avatar Group
- For assignees, participants, "shared with". Show 3-5 avatars, then "+N".
- The full list goes in a Tooltip (names) or Popover (names + actions).
- Same size inside a group. Figma: `Avatar Group` Size (sm, default, lg) with an `Avatars` slot;
  each avatar has a 2 px `background/default` ring on its `fallback` layer. Show label adds a
  muted line after the stack ("Maintained by 3 analysts"); it says who they are or how many, not
  the names already shown.

## Byline (one person, named)
- Who wrote, said or owns something: Avatar, name, one detail line (role and company, or date ·
  reading time). The name links to the profile when there is one.
- `Size=sm` in dense grids and list rows, `default` under article titles and on cards, `lg` under
  testimonials and quotes.
- Several people: Avatar Group with a Label ("Maintained by 3 analysts"). A full profile with
  contact and actions: Person Card.
- Figma: `Byline` Size; Name, Detail, Show detail, Show avatar; Avatar exposed (Type, Initials).
  Used in the Article, Blog Post Header and Testimonial blocks.
