# Editor

Generated from the EGG UI master library on 2026-10-22 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Rich Text Editor](#rich-text-editor) | 2 | Content |
| [Comment](#comment) | 4 | - |
| [Comment Composer](#comment-composer) | 1 | - |

On the Figma page: "Example / in comments", "Example / project brief", "Stress test / Comment", "Stress test / Comment Composer", "Stress test / Rich Text Editor"

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

Code: Tiptap (or Lexical) + shadcn `Toggle` toolbar

## Comment

Component set · 4 variants · default size 640 × 100

One comment in a thread (records, documents, tasks, designs). Name, relative time (full date on hover), text with @mentions and links, actions (Reply, Edit, Delete in a menu for own comments, Resolve for the thread). Replies indent one level only.

**Use for**

- Discussion attached to an object, read later
- Review threads that get resolved
- Type=reply for answers under a parent comment

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
- Spacing and size: `spacing/1`, `spacing/11`, `spacing/2`, `spacing/3`
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
