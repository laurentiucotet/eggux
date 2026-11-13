// EGG UI Coupon Input. Code only (no Figma component yet); Checkout family.
// State (idle, loading, applied, error). Idle: a labelled code field with an Apply button; Enter in
// the field applies, Apply stays disabled while the field is empty. Loading: the button shows a
// spinner and the field is read-only. Error: the field is aria-invalid and the message is linked
// with aria-describedby (and spoken: role="alert"). Applied: the field is replaced by a status
// line with the code, what it does ("20% off your order") and Remove; focus returns to the field
// after Remove. The parent owns the check: it calls onApply(code) and sets `applied` or `error`.
import * as React from 'react';
import { CircleAlert, CircleCheck } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Input } from './input';

export interface CouponInputProps extends Omit<React.ComponentProps<'form'>, 'children' | 'onSubmit'> {
  /** Label of the field. Default "Discount code". */
  label?: string;
  /** Applied state: the code that is applied. */
  applied?: string;
  /** Applied state: what it does, "20% off your order". */
  appliedDescription?: string;
  /** Error state: why the code failed, "This code has expired." */
  error?: string;
  loading?: boolean;
  disabled?: boolean;
  /** Starting text of the field. */
  defaultValue?: string;
  placeholder?: string;
  onApply?: (code: string) => void;
  onRemove?: () => void;
  /** Called on every edit of the field, so the parent can clear a previous error. */
  onValueChange?: (value: string) => void;
}

function CouponInput({
  label = 'Discount code',
  applied,
  appliedDescription,
  error,
  loading = false,
  disabled = false,
  defaultValue = '',
  placeholder = 'Enter code',
  onApply,
  onRemove,
  onValueChange,
  className,
  ...props
}: CouponInputProps) {
  const id = React.useId();
  const errorId = `${id}-error`;
  const [value, setValue] = React.useState(defaultValue);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const wasApplied = React.useRef(Boolean(applied));
  const code = value.trim();

  React.useEffect(() => {
    // Back from applied to the field: put focus where the user can type the next code.
    if (wasApplied.current && !applied) inputRef.current?.focus();
    wasApplied.current = Boolean(applied);
  }, [applied]);

  if (applied) {
    return (
      <div data-slot="coupon-input" data-state="applied" className={cn('flex w-full min-w-0 max-w-96 flex-col gap-2', className)}>
        <span className="text-sm font-medium text-foreground">{label}</span>
        <div role="status" className="flex min-w-0 items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-card-foreground">
          <CircleCheck aria-hidden="true" className="size-4 shrink-0 text-success" />
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-sm leading-5 font-medium">{applied}<span className="sr-only"> applied</span></span>
            {appliedDescription ? <span className="truncate text-xs leading-4 text-muted-foreground">{appliedDescription}</span> : null}
          </div>
          <Button type="button" variant="ghost" size="sm" disabled={disabled} onClick={onRemove} aria-label={`Remove code ${applied}`}>Remove</Button>
        </div>
      </div>
    );
  }

  return (
    <form
      data-slot="coupon-input"
      data-state={loading ? 'loading' : error ? 'error' : 'idle'}
      noValidate
      onSubmit={e => {
        e.preventDefault();
        if (code && !loading && !disabled) onApply?.(code);
      }}
      className={cn('flex w-full min-w-0 max-w-96 flex-col gap-2', className)}
      {...props}
    >
      <label htmlFor={id} className={cn('text-sm font-medium', error ? 'text-destructive' : 'text-foreground')}>{label}</label>
      <div className="flex min-w-0 items-start gap-2">
        <Input
          ref={inputRef}
          id={id}
          value={value}
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={loading}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          onChange={e => {
            setValue(e.target.value);
            onValueChange?.(e.target.value);
          }}
          className="min-w-0 flex-1"
        />
        <Button type="submit" variant="outline" disabled={disabled || !code} loading={loading} className="shrink-0">Apply</Button>
      </div>
      {error ? (
        <p id={errorId} role="alert" className="flex items-start gap-1.5 text-xs text-destructive">
          <span className="flex h-4 shrink-0 items-center"><CircleAlert className="size-3.5" aria-hidden="true" /></span>
          <span className="min-w-0 flex-1">{error}</span>
        </p>
      ) : null}
    </form>
  );
}

export { CouponInput };
