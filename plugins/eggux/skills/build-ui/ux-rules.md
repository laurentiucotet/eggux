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
- Every user action gets visible feedback within 100 ms (state change, spinner or toast).
- Operations over 1 s show progress or a loading state.
- Success after a meaningful action is confirmed; errors explain what happened and what to do.
- Each kind of message has one channel (inline, toast, alert, dialog). See `patterns/feedback-messages.md`.
- Loading indicators match the wait and the scope. See `patterns/loading-states.md`.

## Forms
- Labels are always visible. Placeholders are examples, never labels.
- Validate on blur or submit, not on every keystroke. See `patterns/form-validation.md`.
- Required fields are marked consistently; mark optional ones instead when most are required.
- Never clear what the user typed after an error.
- Email, password, phone, card and address fields use the presets. See `patterns/form-presets.md`.
- Long forms with an order are split into steps. See `patterns/multi-step-form.md`.

## Content
- Use the client's terminology from `decisions.md`. A "Don't use" term is a defect.
- Every list and table has an empty state. See `patterns/empty-state.md`.
- Search, filters and sort are visible, clearable and kept in the URL. See `patterns/search-and-filter.md`.
- Dates, numbers and currency follow the client's locale.
- Charts follow `components/charts.md`; data-dense desktop screens may use Density Compact
  (`references/tokens.md` § Density), never on mobile.
- Motion uses the `motion/*` tokens; exits faster than entries; respect reduced motion.
- A single object has a record page (header, details, activity). See `patterns/record-page.md`.
- Picking a day and a time follows `patterns/booking.md`.

## Accessibility
- Text contrast at least 4.5:1. Icons, input borders, focus rings and other boundaries that
  identify a control at least 3:1. Decorative dividers are exempt.
- Every interactive element is reachable and visible with keyboard focus (`border/ring`).
- Touch targets at least 44 x 44 px on mobile. Mobile layouts follow `patterns/mobile.md`.
- Icons without text have an accessible label.
- Color is never the only carrier of meaning (add icon or text to status colors).
