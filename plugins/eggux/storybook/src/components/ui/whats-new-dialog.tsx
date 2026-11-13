// EGG UI What's New Dialog. Code only (no Figma component yet); family Onboarding.
// A release note in a Dialog: a Sparkles header with the title and the version and date, a list of
// changes each with a type badge (New, Improved, Fixed) and one sentence, and a "Got it" button.
// Opens from a trigger (any element passed as `trigger`) or controlled with `open`.
// A11y: Radix Dialog (focus trap, Escape closes, focus returns to the trigger or to whatever had it);
// focus lands on "Got it" because the dialog has nothing to fill in; the dialog is named by its
// title and described by the version line; the type is the badge text read before each change, a
// date is a <time>; a long list scrolls inside the body, which is then focusable.
import * as React from 'react';
import { Sparkles } from '@/components/icons';
import { Badge } from './badge';
import { Button } from './button';
import { Dialog, DialogBody, DialogContent, DialogTrigger } from './dialog';
import { DialogFooter } from './dialog-footer';
import { DialogHeader, DialogHeaderIcon } from './dialog-header';

export type ChangeType = 'new' | 'improved' | 'fixed';

export interface WhatsNewChange {
  id: string;
  type: ChangeType;
  text: string;
}

const typeLabel: Record<ChangeType, string> = { new: 'New', improved: 'Improved', fixed: 'Fixed' };
const typeVariant = { new: 'soft-success', improved: 'soft-info', fixed: 'soft-warning' } as const;

export interface WhatsNewDialogProps {
  title?: string;
  version: string;
  /** ISO date (2026-03-12). */
  date: string;
  changes: WhatsNewChange[];
  /** The element that opens the dialog (a Button). Omit it when you control `open`. */
  trigger?: React.ReactElement;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  gotItLabel?: string;
  /** Called when "Got it" is pressed, after the dialog closes. */
  onGotIt?: () => void;
}

function formatDate(iso: string) {
  const d = new Date(`${iso}T12:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}

function WhatsNewDialog({ title = "What's new", version, date, changes, trigger, open, defaultOpen, onOpenChange, gotItLabel = 'Got it', onGotIt }: WhatsNewDialogProps) {
  const gotIt = React.useRef<HTMLButtonElement>(null);
  const [inner, setInner] = React.useState(defaultOpen ?? false);
  const isOpen = open ?? inner;
  const setOpen = (next: boolean) => {
    if (open === undefined) setInner(next);
    onOpenChange?.(next);
  };
  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent
        size="default"
        data-slot="whats-new-dialog"
        onOpenAutoFocus={event => {
          event.preventDefault();
          gotIt.current?.focus({ preventScroll: true });
        }}
      >
        <DialogHeader
          media={<DialogHeaderIcon><Sparkles /></DialogHeaderIcon>}
          title={title}
          description={
            <>
              Version {version} <span aria-hidden="true">·</span> <time dateTime={date}>{formatDate(date)}</time>
            </>
          }
        />
        <DialogBody>
          <ul data-slot="whats-new-changes" className="m-0 flex list-none flex-col gap-3 p-0">
            {changes.map(change => (
              <li key={change.id} data-type={change.type} className="flex min-w-0 items-start gap-3">
                <Badge variant={typeVariant[change.type]} className="mt-0.5 w-[4.75rem] shrink-0">{typeLabel[change.type]}</Badge>
                <span className="min-w-0 flex-1 break-words text-sm leading-5 text-foreground">{change.text}</span>
              </li>
            ))}
          </ul>
        </DialogBody>
        <DialogFooter>
          <Button
            ref={gotIt}
            type="button"
            onClick={() => {
              setOpen(false);
              onGotIt?.();
            }}
          >
            {gotItLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { WhatsNewDialog };
