#!/bin/sh
# EGG UX SessionStart hook. Prints a short note that becomes context for Claude when the
# project has eggux/decisions.md or feature folders. Silent otherwise.
root="${CLAUDE_PROJECT_DIR:-$PWD}/eggux"
f="$root/decisions.md"

inbox_of() { awk '/^## Inbox/{s=1;next} /^## /{s=0} s && /^- [^ ]/' "$1"; }

if [ -f "$f" ]; then
  total=$(grep -c '^### D-' "$f")
  open=$(grep '^- Status:' "$f" | grep -vci 'verified\|superseded')
  inbox=$(inbox_of "$f")
  n_inbox=$(printf '%s\n' "$inbox" | grep -c '^- ')

  echo "EGG UX: this project has eggux/decisions.md ($total decisions, $open not verified, $n_inbox new in the Inbox)."
  echo "Read the whole file before any design, code or review work. Decisions override eggux/brand.md and the plugin rules; the newest decision wins."
  if [ "$n_inbox" -gt 0 ]; then
    echo "New requests in the Inbox, process them with the decision-log skill before building:"
    printf '%s\n' "$inbox"
  fi
fi

for fd in "$root"/features/*/decisions.md; do
  [ -f "$fd" ] || continue
  lines=$(inbox_of "$fd")
  n=$(printf '%s\n' "$lines" | grep -c '^- ')
  if [ "$n" -gt 0 ]; then
    slug=$(basename "$(dirname "$fd")")
    echo "Feature $slug has $n new line(s) in its decisions.md Inbox; apply them with the update-feature skill before working on it:"
    printf '%s\n' "$lines"
  fi
done
exit 0
