// EGG UI Tip Card. Code only (no Figma component yet); family Onboarding.
// A dismissible tip: a lightbulb tile, a title and a sentence, a link ("Learn more") and two ways out:
// an X ("Dismiss tip", hides it now) and "Don't show again" (hides it and calls onNeverShow so the
// product can remember). Both call onDismiss; onNeverShow is extra.
// A11y: a labelled region (heading = title); focus never falls to <body> when the card goes away: it
// moves to `returnFocusRef` when given, else to the next focusable element after the card, else the
// previous one; a polite status says what happened ("Tip dismissed"); the link is a real <a>; both
// buttons have text names; the icon is decorative. Under 276 px the actions wrap.
import * as React from 'react';
import { Lightbulb, X } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Card } from './card';
import { IconTile } from './icon-tile';

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Moves focus out of `card` before it is removed: to the next focusable after it, else the previous. */
export function moveFocusAwayFrom(card: HTMLElement | null, preferred?: HTMLElement | null) {
  if (!card) return;
  if (preferred && preferred.isConnected && !card.contains(preferred)) {
    preferred.focus();
    return;
  }
  const all = Array.from(document.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(el => !card.contains(el) && el.offsetParent !== null && el.getAttribute('aria-hidden') !== 'true');
  const after = all.find(el => card.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING);
  const before = [...all].reverse().find(el => card.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_PRECEDING);
  (after ?? before)?.focus();
}

export interface TipCardProps extends Omit<React.ComponentProps<'section'>, 'title' | 'children'> {
  title?: string;
  /** The tip itself: one or two sentences. */
  children?: React.ReactNode;
  /** Empty string hides the link. */
  linkLabel?: string;
  linkHref?: string;
  /** Empty string hides the Don't show again button. */
  neverShowLabel?: string;
  dismissLabel?: string;
  /** Called when the tip is dismissed by either way out. */
  onDismiss?: () => void;
  /** Called when "Don't show again" is pressed (after onDismiss). */
  onNeverShow?: () => void;
  /** Where focus goes when the tip goes away; default is the next focusable element. */
  returnFocusRef?: React.RefObject<HTMLElement | null>;
  headingLevel?: 2 | 3 | 4;
}

function TipCard({
  title = 'Tip: pay faster with a link',
  children = 'Add a payment link to any invoice and customers can pay by card or bank transfer in two clicks.',
  linkLabel = 'Learn more',
  linkHref = '#payment-links',
  neverShowLabel = "Don't show again",
  dismissLabel = 'Dismiss tip',
  onDismiss,
  onNeverShow,
  returnFocusRef,
  headingLevel = 3,
  className,
  ...props
}: TipCardProps) {
  const [gone, setGone] = React.useState<null | 'dismissed' | 'never'>(null);
  const ref = React.useRef<HTMLElement>(null);
  const titleId = React.useId();
  const Heading = `h${headingLevel}` as 'h3';
  const close = (kind: 'dismissed' | 'never') => {
    moveFocusAwayFrom(ref.current, returnFocusRef?.current);
    setGone(kind);
    onDismiss?.();
    if (kind === 'never') onNeverShow?.();
  };
  if (gone) {
    return (
      <p data-slot="tip-card-status" role="status" className="sr-only">
        {gone === 'never' ? "Tip hidden. You won't see it again." : 'Tip dismissed.'}
      </p>
    );
  }
  return (
    <section ref={ref} data-slot="tip-card" aria-labelledby={titleId} className={cn('w-full min-w-0 max-w-[480px]', className)} {...props}>
      <Card size="sm" variant="muted" className="flex-row items-start gap-3 px-4">
        <IconTile icon={<Lightbulb />} tileStyle="brand" size="sm" />
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex flex-col gap-1">
            <Heading id={titleId} className="min-w-0 [overflow-wrap:anywhere] text-sm font-semibold leading-5 text-foreground">{title}</Heading>
            <p className="[overflow-wrap:anywhere] text-sm leading-5 text-muted-foreground">{children}</p>
          </div>
          <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1 empty:hidden">
            {linkLabel ? (
              <Button asChild variant="link" size="sm" className="h-auto min-h-8 max-w-full whitespace-normal py-1 text-left">
                <a href={linkHref}>{linkLabel}</a>
              </Button>
            ) : null}
            {neverShowLabel ? (
              <Button type="button" variant="ghost" size="sm" className="h-auto min-h-8 max-w-full whitespace-normal py-1 text-left" onClick={() => close('never')}>
                {neverShowLabel}
              </Button>
            ) : null}
          </div>
        </div>
        <Button type="button" variant="ghost" size="icon-sm" aria-label={dismissLabel} onClick={() => close('dismissed')}>
          <X aria-hidden="true" />
        </Button>
      </Card>
    </section>
  );
}

export { TipCard };
