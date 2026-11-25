---
name: start
description: Jump-start a new client project in one go - set up eggux/, draft the context (actors, objects, workflows) from whatever the client sent, turn every unknown into a question, apply the brand to the client's Figma copy of EGG UI, set up EGG UI in code when there is a codebase, plan the first tasks and open the board with an agenda for the next client call. Use when the user starts or joins a project ("proiect nou", "am intrat pe un proiect", "start", "jump start", "/eggux:start"), drops a brief, notes or a folder of client documents into a project without eggux/, or asks where to begin.
---

# Start a project

The goal: within the first session, the designer has a map of the product, a list of questions
for the client and a design system ready in Figma and, when needed, in code. This skill runs the
other skills in order; follow each one's own rules. Stages: `references/pipeline.md`.

## 1. Gather (one round of questions, then work)
Find what you can before asking:
- Is there an `eggux/` folder? If yes, this is not a new project: say what exists, then continue
  from the first step below that is missing (no context yet, no brand, no code setup).
- Client material: files the user named or attached, a `docs/`, `brief`, `notes` or similar
  folder, README, screenshots, a live URL.
- A codebase: `package.json` with React, an existing `components/ui`, Tailwind, Storybook.
Then ask, in one message (AskUserQuestion when available), only what is missing: client name,
the client's Figma file URL (a copy of the EGG UI Community file), where the client material
is, brand assets (logo, colors, fonts) if any, and whether you will build in code on this
project.

## 2. Set up
Run `init` (folder, templates, Figma link, `questions.md`, `research/`, `docs/`, `context/`).
Copy the client material into `eggux/docs/` (keep the original names) so the board lists it.

## 3. Draft the context
Run `discovery` on the material: actors, objects and workflows, inferences marked, and every
unknown as a Q-xxx in `eggux/questions.md` (`Source: discovery:<file>`). Add terminology the
client uses to the Terminology section of `decisions.md`. Material you cannot read (images
without text, links behind sign-in) goes into the summary as "not read".

## 4. Brand
With brand assets: run `brand-intake` (brand.md and the Semantic variables in the client's
Figma file). Without: leave the EGG UI Default theme, add a Q-xxx "Brand assets: logo, colors,
fonts" and say so.

## 5. Code (only when there is a codebase or the user will build)
Run `code-setup`: EGG UI components in the client codebase, tokens from the client's Figma
variables, Storybook with themes. When the project will use only part of the kit, offer
`kit-trim`. Skip this step otherwise and say it can run later.

## 6. Plan
Add the first tasks to `eggux/tasks.md` (format: `skills/board/SKILL.md`), each with a stage
and a deliverable:
- Discovery: "Client call: answer the open questions" with the Q-xxx IDs in Links.
- Discovery: one research request per big unknown the material raised (run them from the
  board's Understand view).
- Design: one `new-feature` task per feature the material describes.

## 7. Open and hand over
Run `board` to open the board. End with a short summary:
- What was set up (files, Figma, code) and what was skipped and why.
- The product in five lines: actors, main objects, main workflows.
- **Agenda for the next client call:** the open questions, most blocking first, each with its
  Q-xxx ID.
- The next step: answer the questions in Decide, or start the first feature with
  `/eggux:new-feature`.
