# Booking (pick a day and a time)

## Structure
`Block / Booking`: Card with title (service), description (who, how long, where), Calendar on the
left, time slots for the chosen day on the right, footer with the chosen slot and the confirm button.

## Rules
- Start on the first day with free slots, not on today when today is full.
- Fully booked or closed days are disabled; say why under the slots ("Grey days are fully booked").
- Slots are buttons (outline), the chosen one primary; show the time zone when users may travel.
- No free slots on a day: say so and offer the next free day as a link.
- The footer repeats the choice ("Tue, 22 Oct · 10:30") and the cancellation policy next to
  "Confirm booking". After confirming: confirmation screen + email/SMS, add-to-calendar.
- Hold the slot for a few minutes during checkout and say so; if it is taken meanwhile, explain
  and show the nearest alternatives.
- Mobile: Calendar full width, slots under it, sticky footer.

## Related components
- Slots are `Time Slot` instances in a grid of 3-4 per row (selected primary, taken disabled with a
  strikethrough). Booking settings list working hours with seven `Availability Row`s, the time zone
  said once above them.
