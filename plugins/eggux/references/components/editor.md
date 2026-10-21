# Editor

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Rich Text Editor](#rich-text-editor) | 2 | Content |
| [Comment](#comment) | 4 | - |
| [Comment Composer](#comment-composer) | 1 | - |

## Rich Text Editor

Component set · 2 variants · default size 640 × 219

Formatted text input for descriptions, notes, comments and emails (Tiptap / Lexical in code). Toolbar with only the formats the content needs: heading, bold, italic, underline, lists, quote, link. Active format = toggle on. Keyboard shortcuts and Markdown shortcuts; paste keeps structure, strips styles.

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

Built from: `Avatar`, `Button`, `Button Icon`, `Kbd Group`, `Textarea`

Tokens and styles:
- Spacing and size: `spacing/2`, `spacing/3`

Guides: [comments-and-chat](../../skills/build-ui/components/comments-and-chat.md), [rich-text-editor](../../skills/build-ui/components/rich-text-editor.md)

Code: custom + `Textarea`
