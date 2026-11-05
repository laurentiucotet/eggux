---
name: init
description: Set up a new client project for the EGG UX workflow. Creates the eggux/ folder with empty brand, objects, actors, workflows and decisions files, and records the client's Figma file. Use when starting work for a new client or when a project has no eggux/ folder yet.
---

# Init a client project

Read `${CLAUDE_PLUGIN_ROOT}/references/project-files.md` for the folder convention.

## Steps

1. Check whether `eggux/` already exists at the project root. If it does, list what is there
   and stop unless the user asks to reset a specific file. Never overwrite existing files.
2. Ask only for what you cannot find:
   - client name
   - the client's Figma file URL (a copy of the EGG UI library). If they have not made one yet,
     tell them to open the Community file `https://www.figma.com/community/file/1694044412384019384`, click "Open in Figma" to duplicate it into
     their workspace, and send the new link.
   - If the link is the EGG UI master library itself (file key `BufvaVkSh9vMWPye117Ucd`), say so
     before going on: skills that write to Figma (build-ui, brand-intake, new-component) would
     change the master library every client is copied from. Ask for a copy, or for a clear yes
     that this is plugin development or a test, and record that in `brand.md` notes.
3. Copy every file from the `templates/` folder next to this SKILL.md into `eggux/`, filling
   the client name, the Figma URL and today's date in the frontmatter.
4. Create an empty `eggux/notes/` folder for meeting and research notes.
5. Finish with the next step in one line: run `/eggux:discovery` with interview notes, or
   `/eggux:brand-intake` with the client's brand assets. Either order works. `/eggux:board` opens
   decisions, tasks and notes in the browser.
