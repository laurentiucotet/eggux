# Rich Text Editor

Usage guidelines only. Visual specs live in the Figma component (Editor page).

## When
| Need | Use |
|---|---|
| Plain text, one or a few lines (name, short note) | `Input` or `Textarea` |
| Formatting matters: descriptions, notes, docs, emails, long comments | `Rich Text Editor` |
| Code or config | `Code Block` (read) or a code editor (Monaco, CodeMirror) |

## Rules
- Toolbar shows only the formats the content needs. Order: heading, bold, italic, underline,
  separator, lists, quote, separator, link. Add more (tables, images, mentions) only on request.
- The formatting bar is a `Toolbar` (Style default) of `Toggle`s sm in groups with
  `Separator`s; narrow editors move the last groups into the overflow (see `button.md`).
- Every toolbar button has a tooltip with its shortcut (⌘B, ⌘I, ⌘U, ⌘K). Active formats use
  `Toggle` State=pressed.
- Markdown shortcuts work (`**bold**`, `- ` for a list, `> ` for a quote); say so in the footer
  hint the first time.
- Paste keeps structure (headings, lists, links) and drops foreign styling (fonts, colors).
- Footer: hint on the left, character counter on the right when there is a limit. Warn at 90%,
  block at 100% with an error message, never cut the text silently.
- Content uses the text styles of the product (`body/default`, `heading/h4`), not the editor's
  own. What you see in the editor is what readers see.
- Autosave long content (every few seconds or on blur) and show "Saved" / "Saving…"; otherwise
  follow `patterns/unsaved-changes.md`.
- Minimum height ~5 lines; grows with content up to a max, then scrolls inside.
- Selected text shows a `Selection Toolbar` with the most used formats and Comment; it never
  replaces the main toolbar.
- Commented runs use the `Comment Highlight` recipe (text decoration, 100% thick, -80% offset,
  `comment/*` tokens) so they stay editable text; never draw rectangles behind text.

## Figma
`Rich Text Editor`: State default, focus; Content (native slot); Show footer. Put it in a
`Field` when it has a label. Comments use `Comment Composer`, chat uses `Chat Composer`.
- Comments on selected text: `Block / Document with Comments` (Content page) and SCREENS /
  Documents.

## Code
Tiptap (or Lexical) with a toolbar of shadcn `Toggle` buttons. Store HTML or JSON, never render
user HTML without sanitizing.
