# Pattern: writing and formats

**Problem:** labels, messages and numbers are written differently on every screen.
**Heuristic:** consistency and standards, match between system and the real world.

## Voice
- Plain, short, active; say what the user gets, not what the system does.
- Use the client's words (`eggux/decisions.md` terminology); one name per concept.
- Sentence case for everything: titles, buttons, menu items, labels.

## Labels
- Buttons: verb + object ("Create invoice", "Send reminder"); the same action has the same
  label everywhere. Cancel and Close mean "nothing changes".
- Destructive buttons name what they destroy ("Delete project").
- Links say where they go; never "click here".
- Fields: noun label, example as placeholder, rules as hint ("At least 12 characters").

## Messages
- Success: object + result, past tense ("Invoice sent").
- Error: what happened + how to fix ("Card declined. Try another card or contact your bank.").
- Empty: why it is empty + the next step (`empty-state.md`).
- No "Oops", no blame, no exclamation marks, no codes alone.

## Numbers, dates, time
- Locale formats for numbers, currency and dates; currency always with its symbol or code.
- Same decimals in a column; right-align numbers.
- Dates: relative for recent ("2 h ago", full date on hover), absolute for anything older than
  a week or legally relevant (invoices, contracts).
- Times with the time zone when users or data span zones.
- Durations human: "3 days", "1 h 20 min".
