// EGG UI AI Suggestion. Figma: AI Suggestion (AI Chat / AI Suggestion / Component).
// State (suggested, accepted), Label, Value, Reason and Note match the Figma properties.
// Suggested: dashed tinted box with the value, the reason, Accept and Dismiss; nothing is saved
// until Accept. Accepted: the field with the value, an "AI generated" label and Undo, until edited.
import * as React from 'react';
import { Check, Sparkles } from '@/components/icons';
import { cn } from '@/lib/utils';
import { AiNotice } from './ai-summary';
import { Button } from './button';

export type AiSuggestionState = 'suggested' | 'accepted';

export interface AiSuggestionProps extends Omit<React.ComponentProps<'div'>, 'onChange'> {
  /** Figma State. The component also moves between states itself on Accept, Dismiss and Undo. */
  state?: AiSuggestionState;
  /** Figma Label: the field. */
  label?: string;
  /** Figma Value: what the AI proposes. */
  value?: string;
  /** Figma Reason. Low confidence says so here. */
  reason?: React.ReactNode;
  /** Figma Note (State=accepted), followed by the Undo button. */
  note?: string;
  /** Accept saves the value: store who accepted it and when. */
  onAccept?: (value: string) => void;
  onDismiss?: () => void;
  onUndo?: () => void;
  /** The field changed after accepting (the AI label goes away). */
  onValueChange?: (value: string) => void;
}

const fieldClass =
  'flex w-full min-w-0 rounded-md border border-input bg-background px-3 py-2 text-sm leading-5 text-foreground outline-none transition-[box-shadow,border-color] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50';

function AiSuggestion({
  state = 'suggested',
  label = 'Expense category',
  value = 'Office supplies',
  reason = 'Based on 12 earlier invoices from this vendor.',
  note = 'Suggested by AI and accepted by you.',
  onAccept,
  onDismiss,
  onUndo,
  onValueChange,
  className,
  ...props
}: AiSuggestionProps) {
  const id = React.useId();
  const [current, setCurrent] = React.useState<AiSuggestionState | 'dismissed'>(state);
  const [fieldValue, setFieldValue] = React.useState(value);
  const [edited, setEdited] = React.useState(false);
  const fieldRef = React.useRef<HTMLInputElement>(null);
  const acceptRef = React.useRef<HTMLButtonElement>(null);
  const focusNext = React.useRef<'field' | 'accept' | null>(null);

  React.useEffect(() => setCurrent(state), [state]);
  React.useEffect(() => setFieldValue(value), [value]);
  // After Accept or Dismiss focus moves to the field; after Undo back to Accept.
  React.useEffect(() => {
    if (focusNext.current === 'field') fieldRef.current?.focus();
    if (focusNext.current === 'accept') acceptRef.current?.focus();
    focusNext.current = null;
  }, [current]);

  const accept = () => {
    focusNext.current = 'field';
    setFieldValue(value);
    setEdited(false);
    setCurrent('accepted');
    onAccept?.(value);
  };
  const dismiss = () => {
    focusNext.current = 'field';
    setFieldValue('');
    setCurrent('dismissed');
    onDismiss?.();
  };
  const undo = () => {
    focusNext.current = 'accept';
    setCurrent('suggested');
    onUndo?.();
  };

  const fieldId = `${id}-field`;
  const reasonId = `${id}-reason`;
  const aiValue = current === 'accepted' && !edited;

  return (
    <div data-slot="ai-suggestion" data-state={current} className={cn('flex w-full min-w-0 flex-col items-start gap-1.5', className)} {...props}>
      <div className="flex w-full items-center gap-2">
        <label htmlFor={current === 'suggested' ? undefined : fieldId} id={`${id}-label`} className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
          {label}
        </label>
        {aiValue ? <AiNotice /> : null}
      </div>

      {current === 'suggested' ? (
        <>
          {/* The dashed border is not the only signal: the reason and buttons say it is a suggestion. */}
          <div
            data-slot="ai-suggestion-value"
            role="group"
            aria-labelledby={`${id}-label`}
            aria-describedby={reasonId}
            className="flex w-full items-center gap-2 rounded-md border border-dashed border-input bg-accent px-3 py-2 text-sm text-foreground"
          >
            <Sparkles className="size-3.5 shrink-0" aria-hidden="true" />
            <span className="sr-only">Suggested by AI:</span>
            <span className="min-w-0 flex-1 [overflow-wrap:anywhere]">{value}</span>
          </div>
          <p id={reasonId} className="w-full text-xs text-muted-foreground [overflow-wrap:anywhere]">{reason}</p>
          <div className="flex flex-wrap items-start gap-2">
            <Button ref={acceptRef} variant="outline" size="sm" leadingIcon={<Check aria-hidden="true" />} aria-label={`Accept ${label}`} onClick={accept}>
              Accept
            </Button>
            <Button variant="ghost" size="sm" aria-label={`Dismiss ${label}`} onClick={dismiss}>
              Dismiss
            </Button>
          </div>
        </>
      ) : (
        <>
          <input
            ref={fieldRef}
            id={fieldId}
            data-slot="ai-suggestion-field"
            value={fieldValue}
            aria-describedby={aiValue ? `${id}-note` : undefined}
            onChange={e => {
              setFieldValue(e.target.value);
              setEdited(true);
              onValueChange?.(e.target.value);
            }}
            className={fieldClass}
          />
          {aiValue ? (
            <p id={`${id}-note`} className="flex w-full flex-wrap items-center gap-x-1 text-xs text-muted-foreground">
              <span>{note}</span>
              <Button variant="link" size="xs" className="h-4 text-xs" onClick={undo}>Undo</Button>
            </p>
          ) : null}
        </>
      )}
    </div>
  );
}

export { AiSuggestion };
