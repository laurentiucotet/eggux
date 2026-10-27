# Editor

Generated from the EGG UI master library on 2026-10-27 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Rich Text Editor](#rich-text-editor) | 2 | Content |
| [Comment](#comment) | 4 | - |
| [Comment Composer](#comment-composer) | 1 | - |
| [Selection Toolbar](#selection-toolbar) | 1 | - |
| [Comment Highlight](#comment-highlight) | 4 | - |
| [Comment Thread](#comment-thread) | 3 | Replies |
| [Comments Panel](#comments-panel) | 2 | Threads |

On the Figma page: "Example / comment on a contract clause", "Example / in comments", "Example / in document with comments", "Example / project brief", "Stress test / Comment", "Stress test / Comment Composer", "Stress test / Comment Highlight", "Stress test / Comment Thread", "Stress test / Comments Panel", "Stress test / Rich Text Editor", "Stress test / Selection Toolbar"

## Rich Text Editor

Component set · 2 variants · default size 640 × 219

Formatted text input for descriptions, notes, comments and emails (Tiptap / Lexical in code). Toolbar with only the formats the content needs: heading, bold, italic, underline, lists, quote, link. Active format = toggle on. Keyboard shortcuts and Markdown shortcuts; paste keeps structure, strips styles.

**Use for**

- Descriptions and notes where formatting matters
- Email bodies and long comments
- Docs and help articles written in the product

**Not for**

- Plain text, one or a few lines: use Input or Textarea
- Code or config: use Code Block (read) or a code editor
- Comments in a thread: use Comment Composer; chat: use Chat Composer

**Anatomy**

1. Toolbar of Toggle Group Items: heading, bold, italic, underline
2. Separator, then lists and quote
3. Separator, then link
4. Content slot
5. Footer (Show footer): hint left, character counter right

**Content and behavior**

- Toolbar shows only the formats the content needs; tables, images, mentions only on request
- Active format uses the on state of Toggle Group Item
- Paste keeps structure (headings, lists, links) and drops foreign styles
- With a limit: warn at 90%, block at 100% with an error, never cut text silently
- Min height ~5 lines; grows with content to a max, then scrolls
- Autosave long content and show "Saved" / "Saving…"
- Resize: the footer hint fills and wraps to 2 lines with ellipsis; the character count hugs and never shrinks

**Accessibility**

- Every toolbar button has a label and a tooltip with its shortcut (⌘B, ⌘I, ⌘U, ⌘K)
- Toolbar toggles expose their pressed state
- Put it in a Field so the editor has a visible label
- Focus state shows border/ring

| Variant property | Values |
|---|---|
| State | default, focus |

| Property | Type | Default |
|---|---|---|
| Show footer | boolean | true |

Slots (fill them in the instance, never detach): `Content`

Built from: `Separator`, `Toggle Group Item`

Tokens and styles:
- Colors: `background/default`, `border/default`, `border/input`, `border/ring`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/0_5`, `spacing/1`, `spacing/2`, `spacing/3`
- Radius: `radius/md`
- Text styles: `body/small`, `ui/caption`, `ui/label`

Guides: [rich-text-editor](../../skills/build-ui/components/rich-text-editor.md)

Code: footer `flex gap-2`; hint `min-w-0 flex-1 line-clamp-2`; count `shrink-0 tabular-nums`

## Comment

Component set · 4 variants · default size 640 × 100

One comment in a thread (records, documents, tasks, designs). Name, relative time (full date on hover), text with @mentions and links, actions (Reply, Edit, Delete in a menu for own comments, Resolve for the thread). Replies indent one level only.

**Use for**

- Discussion attached to an object, read later
- Review threads that get resolved
- Type=reply for answers under a parent comment
- Inside Comment Thread for comments on selected text

**Not for**

- Real-time conversation: use Chat Message
- History of changes made by the system: use Timeline Item

**Anatomy**

1. Avatar
2. Name
3. Time, relative ("2 h ago"), full date on hover
4. Text with @mentions and links
5. Actions (Show actions): Reply, Resolve; Edit and Delete in a menu for own comments
6. Resolved Badge (State=resolved)

**Content and behavior**

- Replies indent one level only
- Newest at the bottom, composer under the thread, count in the section title
- Edit in place and show "edited" after the time
- Delete asks for confirmation or offers Undo
- Resolved comments collapse or fade and stay reachable with "Show resolved"
- Resize: the header wraps: Name hugs up to 200 (160 in Type=reply) and Time up to 160, each 1 line with ellipsis; Time drops under the name in narrow threads; the text fills and wraps. Fits a 280 wide Comment Thread

**Accessibility**

- New comments are announced with aria-live="polite"
- The full date is in a time element, not only on hover
- The actions menu button has an accessible label

| Variant property | Values |
|---|---|
| Type | comment, reply |
| State | default, resolved |

| Property | Type | Default |
|---|---|---|
| Name | text | Sofia Barbu |
| Time | text | 2 h ago |
| Text | text | Can we split the rollout in two phases? Support needs a week to get trained before everyone sees it. |
| Show actions | boolean | true |

Built from: `Avatar`, `Badge`, `Button`

Tokens and styles:
- Colors: `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/0_5`, `spacing/1`, `spacing/11`, `spacing/2`, `spacing/3`
- Text styles: `body/small`, `ui/caption`, `ui/label`

Guides: [comments-and-chat](../../skills/build-ui/components/comments-and-chat.md)

Code: custom + `Textarea`

## Comment Composer

Component · 1 variant · default size 640 × 108

New comment or reply: current user avatar, Textarea (grows), attach, ⌘↵ to send, Comment button (disabled while empty). Keep drafts per thread.

**Use for**

- Under a comment thread on a record or document
- Reply box under a parent comment
- Review notes on tasks or designs

**Not for**

- Real-time chat: use Chat Composer
- Long formatted text: use Rich Text Editor

**Anatomy**

1. Current user Avatar
2. Textarea, grows with the text
3. Attach Button Icon
4. Shortcut hint ⌘↵ (Kbd Group)
5. Comment Button, disabled while empty

**Content and behavior**

- ⌘↵ sends
- Comment is disabled while the field is empty
- @ opens a people list; mentions notify
- Keep drafts per thread

**Accessibility**

- The Textarea has a label
- Attach is an icon button with an accessible label
- The shortcut is shown as text, never the only way to send

Built from: `Avatar`, `Button`, `Button Icon`, `Kbd Group`, `Textarea`

Tokens and styles:
- Spacing and size: `spacing/2`, `spacing/3`

Guides: [comments-and-chat](../../skills/build-ui/components/comments-and-chat.md), [rich-text-editor](../../skills/build-ui/components/rich-text-editor.md)

Code: custom + `Textarea`

## Selection Toolbar

Component · 1 variant · default size 249 × 46

Floating toolbar over selected text in a Rich Text Editor or a read-only document: quick formats (Bold, Italic, Link) and a primary Comment action.


Use when text is selected in a document people format or comment on. The full set of formats stays in the Rich Text Editor toolbar.


Rules
Appears 8 px above the selection, centered on it; flips below when there is no room above.
Show formatting off for readers who can only comment; Show comment off where comments are off.
Comment opens a new Comment Thread at the top of the Comments Panel with the selection as its quote, and the selection becomes a Comment Highlight (State=active).
Hides on Escape, on click outside and when the selection collapses. ⌘⌥M adds a comment from the keyboard.


Usage: eggux build-ui/components/comments-and-chat.md

**Use for**

- Text selected in a Rich Text Editor or a read-only document that people comment on
- Quick formatting without moving to the editor toolbar
- Read-only reviewers: Show formatting off, Comment only

**Not for**

- The full list of formats: use the Rich Text Editor toolbar
- Actions on a whole record or row: use a Menu or Action Bar
- AI rewrites of a selection: use Block / Inline AI

**Anatomy**

1. Formatting (Show formatting): Toggle Group Items Bold, Italic, Link and a vertical Separator
2. Comment (Show comment): Button default sm with message-square icon
3. Surface: background/popover, border/default, radius/lg, shadow/md

**Content and behavior**

- Appears 8 px above the selection, at its start or centered on it; flips below when there is no room above
- Hides on Escape, on click outside and when the selection collapses
- Comment opens a new Comment Thread at the top of the Comments Panel with the selection as its Quote; the run turns into a Comment Highlight State=active
- Show comment off where comments are disabled; Show formatting off for readers who can only comment
- Resize: hugs its content, never stretches; on phones it fits 390 with both groups

**Accessibility**

- role="toolbar" with aria-label="Text actions"; arrow keys move between buttons
- Toggle buttons expose aria-pressed and have tooltips with shortcuts (⌘B, ⌘I, ⌘K)
- A keyboard shortcut adds a comment without the mouse (⌘⌥M); focus moves to the new composer

| Property | Type | Default |
|---|---|---|
| Show formatting | boolean | true |
| Show comment | boolean | true |

Built from: `Button`, `Separator`, `Toggle Group Item`

Tokens and styles:
- Colors: `background/popover`, `border/default`
- Spacing and size: `spacing/0_5`, `spacing/1`
- Radius: `radius/lg`
- Effects: `shadow/md`

Guides: [comments-and-chat](../../skills/build-ui/components/comments-and-chat.md), [rich-text-editor](../../skills/build-ui/components/rich-text-editor.md)

Code: Tiptap `BubbleMenu` (`@tiptap/react`, shown when `!selection.empty`) or a Lexical floating toolbar, positioned with Floating UI (`offset(8)`, `flip()`, `shift()`); shadcn `Toggle` for Bold / Italic / Link and a shadcn `Button size="sm"` with lucide `MessageSquare` (or `MessageSquarePlus`) for Comment; container `rounded-lg border bg-popover shadow-md p-1 flex items-center gap-0.5` (`role="toolbar"`; Show formatting / Show comment map to permissions (`canEdit`, `canComment`); Comment calls `editor.chain().setComment(threadId).run()` and opens the new thread)

## Comment Highlight

Component set · 4 variants · default size 226 × 28

Highlighter tint on a run of commented text, drawn as a text decoration so the words stay editable and the tint wraps with the paragraph.


Use on the commented words inside the Rich Text Editor Content slot: select the run, then Decoration: Underline, thickness 100%, offset -80%, skip ink off, color comment/highlight (open thread), comment/highlight-active (thread in focus or being written), comment/selection (selected, no comment yet). Remove it when the thread is resolved. This component shows the states and works on its own for short single-line runs.


Rules
One active highlight at a time, matching the active Comment Thread in the Comments Panel.
Overlapping comments: the most recent one draws on top; clicking the run cycles through its threads.
Body text only; never on muted text.


Usage: eggux build-ui/components/comments-and-chat.md

**Use for**

- Commented words inside the Rich Text Editor Content slot
- The run behind the active Comment Thread (State=active)
- A selection before the comment is posted (State=selected)

**Not for**

- Marking search results: use a find highlight in code (mark element), not the comment colors
- AI changes to review: use AI Suggestion
- Pins on images or designs: use Annotation Pin

**Anatomy**

1. Text: the commented run, body/default
2. State: open (comment/highlight), active (comment/highlight-active), selected (comment/selection), resolved (no tint)
3. Recipe on any text run: Decoration Underline, thickness 100%, offset -80%, skip ink off, color = the State token

**Content and behavior**

- Every open thread has exactly one highlight; resolving the thread removes it
- One active highlight at a time, the same thread as the active Comment Thread
- Overlapping comments: the most recent draws on top; clicking the run cycles through its threads
- Body text only, never on muted text (contrast)
- Resize: it is part of the text run, so it wraps and reflows with the paragraph at every width

**Accessibility**

- Text contrast on the tint: 12.5:1 or more in Light, 6.3:1 or more in Dark (active on card)
- The run is a mark element with aria-describedby pointing to its thread, or announced as "commented"
- Never rely on the tint alone: the panel lists the same quote

| Variant property | Values |
|---|---|
| State | open, active, selected, resolved |

| Property | Type | Default |
|---|---|---|
| Text | text | payment is due within 30 days |

Tokens and styles:
- Colors: `foreground/default`
- Text styles: `body/default`

Guides: [comments-and-chat](../../skills/build-ui/components/comments-and-chat.md), [rich-text-editor](../../skills/build-ui/components/rich-text-editor.md)

Code: Tiptap custom `Mark` (`comment`, attrs `threadId`, `resolved`) rendering `<mark data-thread-id>`; CSS `bg-[var(--comment-highlight)]`, active `bg-[var(--comment-highlight-active)]`, selection `::selection { background: var(--comment-selection) }`; resolved threads drop the class (or the mark) (Tokens `--comment-highlight`, `--comment-highlight-active`, `--comment-selection`; Liveblocks `@liveblocks/react-tiptap` and Velt provide the same mark plus storage; keep `text-foreground` on the run)

## Comment Thread

Component set · 3 variants · default size 320 × 338

One comment thread in the Comments Panel, anchored to a run of text: the quoted excerpt, the first Comment, Replies and a reply Comment Composer, with Resolve and a menu in the header.


Use for comments on selected text in a document (contracts, briefs, specs). For comments on a whole record use Comment and Comment Composer under it; for pins on a design use Annotation Pin.


Rules
Quote: the commented words, 2 lines at most with ellipsis; clicking the thread scrolls to its Comment Highlight and makes both active.
State=active for the thread in focus (border/ring and shadow), only one at a time; its highlight uses comment/highlight-active.
Resolve collapses the thread to State=resolved ("Resolved by" and Reopen) and removes the highlight; it moves under the Resolved filter.
A new thread starts with Show comments off and the composer focused; Show reply off for readers without comment rights.
Width 320, works from 280 to 400; the quote and comments wrap, the header actions never shrink.


Usage: eggux build-ui/components/comments-and-chat.md

**Use for**

- Comments on selected text in documents, contracts, briefs and specs
- The thread list in Comments Panel, or a bottom Drawer on mobile
- A new thread being written (Show comments off, composer focused)

**Not for**

- Comments on a whole record (task, invoice): use Comment and Comment Composer
- Real-time conversation: use Chat Message
- Pins on images or designs: use Annotation Pin with a comment list

**Anatomy**

1. Quote: the commented words with a warning bar, body/small muted, 2 lines with ellipsis (1 line when resolved)
2. Resolve (Button Icon ghost sm, check) and More (Button Icon ghost sm, ellipsis); Reopen (Button outline sm) when resolved
3. Comment (Show comments): exposed Comment Type=comment
4. Replies (Show replies): native slot of Comment Type=reply
5. Comment Composer (Show reply)
6. Resolved by: check icon and "Resolved by Ana Popescu · 2 d ago" (State=resolved)
7. State: default, active, resolved

**Content and behavior**

- Clicking a thread scrolls to its Comment Highlight and makes both active; only one active thread
- State=active: border/ring and shadow/md; the highlight uses comment/highlight-active
- Resolve collapses the thread to State=resolved, removes the highlight and moves it under the Resolved filter; Reopen brings both back
- A new thread starts with Show comments off and the composer focused; posting turns on Show comments
- Show reply off for readers without comment rights; Show replies off when there are no replies
- Resize: width 320, works from 280 to 400; the quote and comments wrap, header actions hug and never shrink; comment names cap at 200 (replies 160) with ellipsis

**Accessibility**

- The thread is an article labelled by its quote; Resolve and More have aria-labels ("Resolve thread", "Thread actions")
- New replies from others are announced with aria-live="polite"
- Resolved state is in text ("Resolved by"), not only color

| Variant property | Values |
|---|---|
| State | default, active, resolved |

| Property | Type | Default |
|---|---|---|
| Quote | text | payment is due within 30 days of the invoice date |
| Show comments | boolean | true |
| Show reply | boolean | true |
| Resolved by | text | Resolved by Ana Popescu · 2 d ago |
| Show replies | boolean | true |

Slots (fill them in the instance, never detach): `Replies`

Built from: `Button`, `Button Icon`, `Comment`, `Comment Composer`. Icons: check

Tokens and styles:
- Colors: `background/card`, `background/warning`, `border/default`, `border/ring`, `card/muted-background`, `foreground/muted`
- Spacing and size: `spacing/0_5`, `spacing/1_5`, `spacing/2`, `spacing/3`
- Radius: `radius/full`, `radius/lg`
- Text styles: `body/small`, `ui/caption`
- Effects: `shadow/md`

Guides: [comments-and-chat](../../skills/build-ui/components/comments-and-chat.md)

Code: custom card (`rounded-lg border bg-card p-3 flex flex-col gap-3`, active `border-ring shadow-md`, resolved `bg-card-muted`) with a `<blockquote className="border-l-2 border-warning pl-2 text-sm text-muted-foreground line-clamp-2">`, `Comment` list, `Comment Composer`; header actions shadcn `Button variant="ghost" size="icon"` (Check, Ellipsis in a `DropdownMenu`) (Keyed by the mark's `threadId`; click sets the active thread and scrolls the mark into view (`editor.commands.setTextSelection`); resolve sets `resolved` on the mark; Liveblocks `Thread` or Velt `VeltCommentsSidebar` are drop-in alternatives)

## Comments Panel

Component set · 2 variants · default size 360 × 900

Right sidebar that keeps the comment threads of a document: title with the open count, Open / Resolved filter, Threads (native slot of Comment Thread) and an empty state.


Use next to a Rich Text Editor or a read-only document when people comment on selected text (Block / Document with Comments). On mobile put the same Comment Threads in a bottom Drawer opened from a comment count button.


Rules
360 wide, full height, border on the left; the list scrolls inside, the header stays.
Threads follow document order; the active one lines up with its highlight when there is room.
The count and the filter labels count open and resolved threads; Resolved shows State=resolved threads only.
Content=empty: "No comments yet. Select text to comment."
Close hides the panel; a comment count button in the page header opens it again.


Usage: eggux build-ui/components/comments-and-chat.md

**Use for**

- Next to a document people comment on (Block / Document with Comments)
- Review of contracts, briefs and policies inside the product
- Content=empty before the first comment

**Not for**

- Comments under a record: use Block / Comments
- Notifications across the product: use Notification Center
- Mobile: put the Comment Threads in a bottom Drawer opened from a comment count button

**Anatomy**

1. Title ("Comments") and Count (exposed Badge Count)
2. Filter (Show filter) and Close (Show close): Button Icon ghost sm
3. Filter tabs: exposed Toggle Group segmented, "Open 3" and "Resolved 1"
4. Threads: native slot of Comment Thread
5. Content: threads, empty (Empty State sm: "No comments yet", "Select text to comment.")

**Content and behavior**

- 360 wide, full height, border on the left; the list scrolls inside, the header stays
- Threads follow document order; the active one lines up with its highlight when there is room
- Count, the Open / Resolved labels and the comment count button in the page header show the same numbers
- Resolved shows State=resolved threads only; Open never shows resolved ones
- Close hides the panel; the comment count button in the header opens it again
- Resize: fixed 360; below 1024 it overlays the document as a Sheet, on phones it becomes a bottom Drawer

**Accessibility**

- complementary landmark labelled "Comments"; the filter is a radio group
- Focus moves to the new thread composer after Comment in the Selection Toolbar
- Escape closes the panel and returns focus to the comment count button

| Variant property | Values |
|---|---|
| Content | threads, empty |

| Property | Type | Default |
|---|---|---|
| Title | text | Comments |
| Show filter | boolean | true |
| Show close | boolean | true |

Slots (fill them in the instance, never detach): `Threads`

Built from: `Badge Count`, `Button Icon`, `Comment Thread`, `Empty State`, `Toggle Group`

Tokens and styles:
- Colors: `background/default`, `border/default`, `foreground/default`
- Spacing and size: `spacing/0`, `spacing/2`, `spacing/3`, `spacing/4`, `spacing/6`
- Text styles: `heading/h4`

Guides: [comments-and-chat](../../skills/build-ui/components/comments-and-chat.md)

Code: `<aside className="w-[360px] h-full border-l bg-background flex flex-col">` with header (`h4`, shadcn `Badge`), shadcn `ToggleGroup type="single"` (Open / Resolved), shadcn `ScrollArea` holding `Comment Thread`s, shadcn empty state when none (Threads sorted by mark position (`editor.state.doc.descendants`); optional anchoring: each thread `top` = its mark's `getBoundingClientRect().top`, pushed down to avoid overlap; below `lg` render in shadcn `Sheet`, on phones in a `Drawer` (vaul) opened from a count `Button`)
