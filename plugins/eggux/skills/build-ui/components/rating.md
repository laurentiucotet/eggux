# Rating

Usage guidelines only. Visual specs live in the Figma component (Rating page).

## Rules
- Display (product, review summary): stars plus the number and count, "4.7 (128)". Color alone
  is never the signal. Use `Show value` and `Show count`.
- Half stars only when displaying averages; input is whole stars.
- Input (feedback, review form): a radio group of 5 with labels for screen readers ("4 of 5
  stars"); hover previews the value; a second click on the same star does not clear it, offer
  a Clear link if zero is allowed.
- Ask for a comment after a low rating, not before.
- For satisfaction surveys, thumbs up / down or a 1-5 scale with labels often reads better than
  stars; NPS uses 0-10 buttons.
- Sizes: `sm` in cards and lists, `default` in detail pages and forms.

## Figma
`Rating`: Size sm, default × Value 0-5; Show value, Show count, Count. Stars use
`background/warning`; empty stars `border/input`.
- Reviews section: Rating Summary on the left, Review Items on the right (`Block / Reviews`).

## Code
Display: a `span` with `aria-label="Rated 4.7 out of 5"`. Input: `RadioGroup` with star icons.

## Related components
- Above a review list, `Rating Summary` shows the average and the 1-5 split; each row filters the
  list. Each review is a `Review Item` (verified, date, stars, title, text, Helpful). Marketing
  quotes use `Testimonial Card`.
- Surveys have their own components: `Feedback Widget` (Yes/No at the end of an article or task),
  `NPS Survey` (0-10, at most every 90 days) and `CSAT Rating` (five faces with words, after one
  interaction).
