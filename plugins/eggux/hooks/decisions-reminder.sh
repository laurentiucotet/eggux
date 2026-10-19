#!/bin/sh
# EGG UX SessionStart hook. Prints a short note that becomes context for Claude when the
# project has eggux/decisions.md. Silent otherwise.
f="${CLAUDE_PROJECT_DIR:-$PWD}/eggux/decisions.md"
[ -f "$f" ] || exit 0

total=$(grep -c '^### D-' "$f")
open=$(grep '^- Status:' "$f" | grep -vci 'verified\|superseded')
inbox=$(awk '/^## Inbox/{s=1;next} /^## /{s=0} s && /^- [^ ]/' "$f")
n_inbox=$(printf '%s\n' "$inbox" | grep -c '^- ')

echo "EGG UX: this project has eggux/decisions.md ($total decisions, $open not verified, $n_inbox new in the Inbox)."
echo "Read the whole file before any design, code or review work. Decisions override eggux/brand.md and the plugin rules; the newest decision wins."
if [ "$n_inbox" -gt 0 ]; then
  echo "New requests in the Inbox, process them with the decision-log skill before building:"
  printf '%s\n' "$inbox"
fi
exit 0
