// EGG UI Response Feedback. Figma: Response Feedback (AI Chat / Response Feedback / Component).
// Title, Show details and Note match the Figma properties. Inline card under an answer after Bad
// response: reasons are toggle chips (aria-pressed, one or more), details are optional, the Note
// says what is shared, Send needs a reason. Focus moves to the first reason on open; Escape and
// the close button call onClose so the caller returns focus to Bad response.
import * as React from 'react';
import { X } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button } from './button';

export const defaultFeedbackReasons = ['Not accurate', 'Not helpful', 'Incomplete', 'Wrong format', 'Too slow', 'Other'];

export interface ResponseFeedbackValue {
  reasons: string[];
  details: string;
}

export interface ResponseFeedbackProps extends Omit<React.ComponentProps<'form'>, 'onSubmit' | 'title'> {
  /** Figma Title. */
  title?: string;
  /** Figma Show details: the optional Textarea. */
  showDetails?: boolean;
  /** Figma Note: what is shared on Send. */
  note?: string;
  /** Reason chips. */
  reasons?: string[];
  /** Reasons selected at start. */
  defaultReasons?: string[];
  /** Placeholder of the details field. */
  detailsPlaceholder?: string;
  /** Accessible label of the details field. */
  detailsLabel?: string;
  /** Called on Send with the chosen reasons and details; the caller adds the message id. */
  onSubmit?: (value: ResponseFeedbackValue) => void;
  /** Close button, Cancel and Escape. */
  onClose?: () => void;
  /** Move focus into the form when it opens. */
  autoFocus?: boolean;
}

function ResponseFeedback({
  title = 'What went wrong?',
  showDetails = true,
  note = 'Sends this conversation to the Acme team.',
  reasons = defaultFeedbackReasons,
  defaultReasons = [],
  detailsPlaceholder = 'What should the answer have said? (optional)',
  detailsLabel = 'Details (optional)',
  onSubmit,
  onClose,
  autoFocus = true,
  className,
  ...props
}: ResponseFeedbackProps) {
  const id = React.useId();
  const [selected, setSelected] = React.useState<string[]>(defaultReasons);
  const [details, setDetails] = React.useState('');
  const reasonsRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (autoFocus) reasonsRef.current?.querySelector('button')?.focus();
  }, [autoFocus]);

  const toggle = (reason: string) =>
    setSelected(current => (current.includes(reason) ? current.filter(r => r !== reason) : [...current, reason]));

  return (
    <form
      data-slot="response-feedback"
      aria-labelledby={`${id}-title`}
      onSubmit={e => {
        e.preventDefault();
        if (selected.length === 0) return;
        onSubmit?.({ reasons: reasons.filter(r => selected.includes(r)), details: details.trim() });
      }}
      onKeyDown={e => {
        if (e.key === 'Escape') {
          e.stopPropagation();
          onClose?.();
        }
      }}
      className={cn('flex w-full max-w-[480px] flex-col gap-3 rounded-lg border border-border bg-card p-4 text-card-foreground', className)}
      {...props}
    >
      <div className="flex w-full items-center gap-2">
        <p id={`${id}-title`} className="min-w-0 flex-1 text-sm font-medium">{title}</p>
        <Button type="button" variant="ghost" size="icon" aria-label="Close" title="Close" onClick={onClose}>
          <X aria-hidden="true" />
        </Button>
      </div>

      <div ref={reasonsRef} role="group" aria-label="Reasons" className="flex w-full flex-wrap items-start gap-2">
        {reasons.map(reason => {
          const pressed = selected.includes(reason);
          return (
            <button
              key={reason}
              type="button"
              aria-pressed={pressed}
              onClick={() => toggle(reason)}
              className={cn(
                'inline-flex h-8 max-w-80 min-w-0 items-center rounded-full border px-3 text-sm font-medium outline-none transition-[color,background-color,border-color,box-shadow] duration-[var(--duration-fast)] focus-visible:ring-[3px] focus-visible:ring-ring/50',
                pressed ? 'border-primary bg-primary text-primary-foreground hover:bg-[var(--button-primary-hover)]' : 'border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground',
              )}
            >
              <span className="truncate">{reason}</span>
            </button>
          );
        })}
      </div>

      {showDetails ? (
        <>
          <label htmlFor={`${id}-details`} className="sr-only">{detailsLabel}</label>
          <textarea
            id={`${id}-details`}
            rows={2}
            value={details}
            placeholder={detailsPlaceholder}
            onChange={e => setDetails(e.target.value)}
            className="field-sizing-content max-h-40 min-h-16 w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-xs outline-none transition-[border-color,box-shadow] duration-[var(--duration-fast)] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
          />
        </>
      ) : null}

      <div className="flex w-full items-center gap-2">
        <p className="min-w-0 flex-1 text-xs text-muted-foreground">{note}</p>
        <Button type="button" variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
        <Button type="submit" size="sm" disabled={selected.length === 0}>Send</Button>
      </div>
    </form>
  );
}

export { ResponseFeedback };
