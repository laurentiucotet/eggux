# Content (strings)

Names and labels that repeat across the product live in the Figma variable collection
`Content` (STRING variables), so a client name, a renamed action or a language changes in one
place. Long copy (descriptions, help text, marketing) stays in the components and blocks.

## Collection
- Modes: `English` (default) and `Română`. Add a mode per language the client ships; set the
  mode on a frame to see the screen in that language and catch text that no longer fits.
- Scope `TEXT_CONTENT`; code syntax is the i18n key: `brand/company` → `t('brand.company')`.
- Bound today: 382 texts in the master library (button and menu labels, statuses, filter and
  table labels, footer copyright, logo name, AI label and disclaimer). The Brand page shows
  the brand strings and an English / Română comparison of the invoices example.

| Group | Variables | Rules |
|---|---|---|
| `brand/*` | company, legal-name, product, domain, support-email, copyright | `company` everywhere in the UI; `legal-name` only in footers, invoices and legal pages; never abbreviate or translate the name |
| `action/*` | save, cancel, delete, edit, add, remove, close, back, continue, submit, send, apply, confirm, done, open, copy, share, invite, upload, download, export, import, search, sort, columns, clear-all, clear-filters, try-again, retry, undo, approve, reject, deny, accept, dismiss, stop, next, previous, skip, view-all, learn-more, sign-in, sign-out, get-started | One label per action everywhere. When a button needs the object ("Create invoice"), write it in the component; keep the verb from this list |
| `status/*` | draft, sent, paid, overdue, pending, active, inactive, archived, approved, rejected, failed, in-progress, needs-approval, on-track, at-risk, off-track | Same word in the Badge, the filter value and the table; match the statuses in `objects.md` |
| `feedback/*`, `field/*` | saved, copied, error, no-results, loading; required, optional | Success says object + result; errors say what happened and how to fix (`writing.md`) |
| `ai/*` | label, disclaimer, ask | Same words on every AI surface |
| `legal/*`, `nav/*` | privacy, terms, cookies, security; dashboard, settings, help, notifications, profile | |

## How to bind
- A plain text: `text.setBoundVariable('characters', variable)`.
- A component's TEXT property on an instance: `instance.setProperties({ [key]: figma.variables.createVariableAlias(variable) })`.
- Never bind the text inside a main component when it is bound to a component property: the
  binding replaces the property reference. Bind the instances instead.
- Instances whose slot content was edited own a copy of it; bind those copies too
  (`page.findAll(n => n.type === 'INSTANCE')` reaches them, `findAllWithCriteria` may not).

## For a client
- `/eggux:brand-intake` sets `brand/*` to the client's names and adds a mode for each language
  the product ships (copy the English values, then translate).
- A terminology decision (`decisions.md`, "Use / Don't use") changes the matching `action/*`
  or `status/*` value, and the Terminology table names the variable.
- New repeated label: add it to the right group, bind every place it appears, and add the key
  to the code's message file.
- Code: one message file per language (`en.json`, `ro.json`) with the same keys; components
  never hardcode these strings.
