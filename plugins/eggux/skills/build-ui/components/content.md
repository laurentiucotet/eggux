# Content components: Post Card, Code Block, Table of Contents

Usage guidelines only. Visual specs live in the Figma components.

## Post Card
- Articles, news, case studies, changelog entries. Image 16:9, category + date · reading time,
  title, excerpt (3 lines max), author. The whole card is one link.
- `Layout=horizontal` for the featured post at the top of a list; `vertical` in grids of 3.
- `Layout=compact` for related, most read and up next lists in an aside or under an article:
  title on 2 lines, meta in Date ("Guide · 12 Oct 2026"), optional 1:1 image (Show image) on all
  items or none; 3-5 items.
- Figma: `Post Card` (Card page), Title, Excerpt, Date, Author, Show author, Show excerpt, Show image (compact); Badge
  exposed for the category.

## Code Block
- Commands, snippets, API examples. Language label + Copy; Copy confirms with "Copied" for 2 s.
- No wrapping: long lines scroll horizontally. Syntax colors come from the highlighter theme.
- Inline code inside prose: `code` style on `background/muted`, radius sm, no Code Block.
- Figma: `Code Block` (Code Block page), Language, Code, Show header.

## Table of Contents
- Long articles and docs pages (3+ sections). Built from the h2 / h3 headings; the section in view
  is active (scroll spy); clicking scrolls with an offset for sticky headers.
- Sticky on the right from 1280; below that, a collapsible "On this page" at the top.
- Figma: `TOC Item` Level (1, 2) × State, `Table of Contents` (Items slot), Navigation page.
