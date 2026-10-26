# UX rules

Universal rules for every client. Short and absolute. A client override in `brand.md` or a
decision in `decisions.md` can change a rule for that client only.

This file grows: when a project teaches something that applies everywhere, add it here.
When a rule needs explanation, move the detail into a pattern and keep one line here.

## Actions
- Every destructive action asks for confirmation. See `patterns/delete-confirmation.md`.
- One primary button per view or dialog. Other actions are secondary, outline or ghost.
- Button labels are verbs that say what happens ("Save changes", not "OK").
- Irreversible actions say they are irreversible.
- Leaving a form with unsaved changes asks first. See `patterns/unsaved-changes.md`.

## Feedback
- Every user action gets visible feedback within 100 ms. When the result is visible where the
  user is, the change is the feedback; a toast only when the result is out of view or can be
  undone. See `patterns/action-feedback.md`.
- Operations over 1 s show progress or a loading state.
- Success after a meaningful action is confirmed; errors explain what happened and what to do.
- Each kind of message has one channel (inline, toast, alert, dialog). See `patterns/feedback-messages.md`.
- Loading indicators match the wait and the scope. See `patterns/loading-states.md`.

- Bulk actions report counts and failures, never only "Done". See `patterns/bulk-actions.md`.
- Notify people only about what involves them, on the channel that fits. See `patterns/notifications.md`.

## Safety and recovery
- Never lose the user's input: expired sessions re-authenticate in place, offline work is kept,
  conflicting edits are shown, not overwritten. See `patterns/errors-and-recovery.md`.
- Prefer Undo or Trash to confirmation for restorable actions.
- Hide what a role can never do; disable with a reason what is temporarily unavailable; a
  forbidden page offers Request access. See `patterns/permissions-and-access.md`.

## Forms
- Labels are always visible. Placeholders are examples, never labels.
- Validate on blur or submit, not on every keystroke. See `patterns/form-validation.md`.
- Required fields are marked consistently; mark optional ones instead when most are required.
- Never clear what the user typed after an error.
- Email, password, phone, card and address fields use the presets. See `patterns/form-presets.md`.
- Long forms with an order are split into steps. See `patterns/multi-step-form.md`.

## Content
- Labels, messages, dates and numbers follow `patterns/writing.md`: verb + object buttons,
  sentence case, locale formats, relative dates only for recent events.
- Use the client's terminology from `decisions.md`. A "Don't use" term is a defect.
- Every list and table has an empty state. See `patterns/empty-state.md`.
- Every error page gives a next step; no dead ends. See `patterns/result-pages.md`.
- Search, filters and sort are visible, clearable and kept in the URL. See `patterns/search-and-filter.md`.
- Dates, numbers and currency follow the client's locale.
- Charts never carry meaning by color alone and always have a table view. See `components/charts.md`.

## Layout and motion
- Start from a Page Shell; which shell, blocks and patterns fit which screen: `index.md`.
- Data-dense desktop screens may use Density Compact (`references/tokens.md` § Density), never mobile.
- Motion uses the `motion/*` tokens; exits faster than entries; respect reduced motion.
- On muted surfaces (cards and panels on `background/muted`), Badge and Button use outline or
  default, never secondary: secondary has the same color as the surface. Image Placeholder is
  muted too: on a muted card, use the real image or put the card on `background/accent`.
- Accent text (a highlighted headline word, inline links) uses `foreground/brand`, never a
  `background/*` token.
- Imagery: sample photos and logos in the library are placeholders for real content; replace them before shipping, give every meaningful image alt text, and keep 4.5:1 for text over images.

## Enterprise
- Lists people work in all day use the data grid: saved views, filters with counts, bulk
  actions, export of the current view. See `patterns/enterprise-apps.md`.
- Approvals, permission changes, exports and deletions are logged and visible in an audit log.
- Records and reports show who changed them last and when the data was updated.

## AI features
- The assistant shows what it can do, what data it uses, and when it is working; Stop is always there.
- Facts get sources; actions that change data, contact people or spend money wait for approval.
  See `patterns/ai-chat.md`.

## Accessibility
- Text contrast at least 4.5:1. Icons, input borders, focus rings and other boundaries that
  identify a control at least 3:1. Decorative dividers are exempt.
- Every interactive element is reachable and visible with keyboard focus (`border/ring`).
- Touch targets at least 44 x 44 px on mobile. Mobile layouts follow `patterns/mobile.md`.
- Icons without text have an accessible label.
- Color is never the only carrier of meaning (add icon or text to status colors).
