# Storybook structure and where a variation goes

One page for two questions: where does a story live in the sidebar, and what is a story, a
control, a toolbar choice or a hidden check. `code-component`, `storybook-publish` and `kit-trim`
point here.

## The sidebar

| Section | What it holds | Rule |
|---|---|---|
| Foundations | Colors, Typography, Shape and spacing, Motion and elevation, Breakpoints, Themes and looks, Icons | Read from tokens; one story each |
| Components | One part of the interface: Button, Table Cell Status, Prompt Input | `Components/<Family>/<Component>`; `Components/<Component>` when it has no family |
| Blocks | A composition of components: a navbar, a footer, a table with filters, a conversation | `Blocks/<Family>/<Name>`; stories with real content, no play function |
| Pages | A whole screen, at its breakpoints (the Mobile pages go here) | `Pages/<Area>/<Screen>`; a page component lives in `src/pages/<name>.tsx` and is built only from library components |

Order is fixed in `preview.tsx` (`pinned`): Introduction, Foundations, Components, Blocks, Pages.
Inside a section, groups and components are A to Z.

- A level is one `/` in the title. Three levels under the section at most.
- A family is a folder when it has two or more components. A family of one is not a folder.
- A product area such as AI Chat is a family inside Components, not a section. Its whole-conversation
  examples are Blocks (`Blocks/AI Chat/Examples`).
- Back office and platform are not folders: they are the **Look** in the toolbar.
- Not atoms, molecules, organisms. The boundary between them is a matter of opinion and a
  component moved between them gets a new address. Components, Blocks and Pages say how big a thing
  is without the argument.
- Changing a title changes the story id and every link to it. Decide the title before the first link
  goes out; after that, move only with a reason.

## Where a variation goes

Ask in this order. The first yes decides.

| Question | It is | Goes to |
|---|---|---|
| Is it the environment the component sits in (light or dark, platform or back office, the screen width)? | A global | **Toolbar**: Scheme, Look, Size. Never a story per theme or per width for looking |
| Is it a value of a prop (variant, size, show icon, disabled, count, a text)? | A control | **Controls** of the `Default` playground |
| Is it a text of a different length? | A control | A text control (the label, the message). Never a "long text" and a "short text" story |
| Is it a set people compare at a glance (all variants, all sizes)? | A gallery | One story that renders them side by side (`Variants`, `Sizes`) |
| Is it a state or a flow that needs setup (open, loading, empty, error, typing, a keyboard path)? | A scenario | A story **only if** someone opens it by name; otherwise a hidden check |
| Is it long text, a narrow column (276, 368), many items, a missing part, a dark copy for contrast? | A check | **Hidden** story (`tags: ['!dev']`): runs in `npm test` and Chromatic, absent from the sidebar |
| Is it a real composition with data (a filtered table, a conversation)? | A block | `Blocks/...`, no play function |
| Is it a whole screen? | A page | `Pages/...` |

Test for a visible story: *would a designer, a developer or a manager open it by name, and learn
something the Default with its Controls and the toolbar cannot show?* If not, it is a control, a
toolbar choice or a hidden check.

Consequences:
- A component has few visible stories: `Default` (the playground), the galleries, the scenarios people
  need. Typically two to six. A component with twenty visible stories has put controls and checks
  in the sidebar.
- Theme and Look copies are hidden, one per theme of the main visual story, only so axe checks
  contrast in each. They are not for looking: the toolbar is.
- Stress cases are hidden, one `Stress` story per component, several cases side by side.
- The playground has no play function; its checks sit in a hidden `DefaultCheck`.
- Examples and demo stories (Blocks, Pages) carry no play function: a manager opening one must not
  find it already filtered or half clicked. Their checks live in a hidden twin.

## Density

One density: the sizes in `:root` (Comfortable). There is no Density toolbar and no Compact story. The
Figma Density collection and the `.density-compact` block in `tokens.css` stay as generated from
Figma and are not used by Storybook; a product that needs a compact surface can switch it on in its
own app.
