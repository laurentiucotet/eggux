// EGG UI Inline Form. Figma: Inline Form (Input page, "Inline Form / Component", set 430:2290).
// State (default, error, success), Tone (default, on-primary), Hint, Error, Success message, Show
// hint. One field and one button on a line (newsletter sign-up, coupon code, invite by email, add a
// tag): a form with the Input (fills, default size) and the Button (hugs, default size) 8 px apart,
// and under the row, 6 px below, the hint, the error or the success message in body/small.
// Tone=on-primary for primary bands and cards: secondary Button, hint and messages in
// foreground/primary (text-primary-foreground); the input keeps its own surface.
// Behavior: it is a form, Enter submits; onSubmit gets the value (the app validates and sets
// `error` or `success`). The error keeps the value. The message replaces the hint, is linked to the
// input with aria-describedby and is announced in a polite live region. Below 320 px (container
// width) the button goes full width under the input.
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Input } from './input';

export type InlineFormTone = 'default' | 'on-primary';

export interface InlineFormProps
  extends Omit<React.ComponentProps<'form'>, 'onSubmit' | 'children'> {
  /** Accessible name of the input when there is no visible label ("Email address"). */
  label: string;
  /** Figma Input placeholder: an example value. */
  placeholder?: string;
  /** Figma Button label: the verb ("Subscribe", "Apply", "Invite"), never "Submit". */
  buttonLabel: string;
  /** Figma Hint (Show hint). */
  hint?: React.ReactNode;
  /** Figma State=error + Error: says how to fix it; keeps the value. */
  error?: React.ReactNode;
  /** Figma State=success + Success message: what happens next. */
  success?: React.ReactNode;
  /** Figma Tone: default, or on-primary for primary bands and cards. */
  tone?: InlineFormTone;
  /** Controlled value of the input. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Enter or the button. The event's default is prevented. */
  onSubmit?: (value: string, event: React.FormEvent<HTMLFormElement>) => void;
  /** The submit is running: the button shows its spinner and blocks repeats. */
  pending?: boolean;
  disabled?: boolean;
  /** Props of the input (type, name, autoComplete, required...). */
  inputProps?: Omit<React.ComponentProps<'input'>, 'value' | 'defaultValue' | 'placeholder' | 'disabled' | 'size'>;
}

function InlineForm({
  label,
  placeholder,
  buttonLabel,
  hint,
  error,
  success,
  tone = 'default',
  value: valueProp,
  defaultValue = '',
  onValueChange,
  onSubmit,
  pending = false,
  disabled = false,
  inputProps,
  className,
  ...props
}: InlineFormProps) {
  const [inner, setInner] = React.useState(defaultValue);
  const value = valueProp ?? inner;
  const id = React.useId();
  const messageId = `${id}-message`;
  const state = error ? 'error' : success ? 'success' : 'default';
  const message = error || success || hint;
  const onPrimary = tone === 'on-primary';

  return (
    <form
      data-slot="inline-form"
      data-state={state}
      data-tone={tone}
      noValidate
      className={cn('@container flex w-100 min-w-0 max-w-full flex-col gap-1.5', className)}
      onSubmit={e => {
        e.preventDefault();
        if (!pending) onSubmit?.(value, e);
      }}
      {...props}
    >
      <div data-slot="inline-form-row" className="flex w-full min-w-0 gap-2 @max-[320px]:flex-col">
        <Input
          aria-label={label}
          aria-describedby={message ? messageId : undefined}
          aria-invalid={error ? true : undefined}
          placeholder={placeholder}
          disabled={disabled}
          {...inputProps}
          value={value}
          onChange={e => {
            if (valueProp === undefined) setInner(e.target.value);
            onValueChange?.(e.target.value);
            inputProps?.onChange?.(e);
          }}
          className={cn('min-w-0 flex-1 truncate', inputProps?.className)}
        />
        <Button type="submit" variant={onPrimary ? 'secondary' : 'default'} loading={pending} disabled={disabled} className="@max-[320px]:w-full">
          {buttonLabel}
        </Button>
      </div>
      <p
        id={messageId}
        data-slot={`inline-form-${state === 'default' ? 'hint' : state}`}
        aria-live="polite"
        className={cn(
          'text-sm leading-5',
          !message && 'sr-only',
          onPrimary
            ? 'text-primary-foreground'
            : state === 'error' ? 'text-destructive' : state === 'success' ? 'text-success' : 'text-muted-foreground',
        )}
      >
        {message}
      </p>
    </form>
  );
}

export { InlineForm };
