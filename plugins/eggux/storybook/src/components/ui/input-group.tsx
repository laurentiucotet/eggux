// EGG UI Input Group. Figma: Input Group (Input page, "Input Group / Component", set 112:58).
// State (default, focus, error, disabled), Value (default "egg-ux"), Show start + Start slot,
// Show end + End slot (Input Addon by default: "https://" and ".com"), Show loading (Spinner sm
// after the value). shadcn InputGroup with the EGG changes from references/code-mapping.md:
// pill radius through --input-radius, density height, overflow-hidden so the addons follow the
// radius, the input min-w-0 flex-1 truncate, addons shrink-0.
//
// The props are the input's: Field passes id, aria-describedby, aria-invalid, required and disabled
// straight to the <input>, so `<Field label="Website"><InputGroup start="https://" /></Field>` works.
// `start` and `end` take a string (rendered as an Input Addon and added to the input's accessible
// description) or any node (a Select trigger for Currency Input or Phone Input, a Button for Copy or
// Generate). Both slots sit in a fieldset that a disabled group disables, so slotted controls are
// disabled too (and axe treats the faded addon text as disabled text).
// Focus: the whole group gets the Figma focus ring (2 px background gap + 2 px border/ring band).
import * as React from 'react';
import { cn } from '@/lib/utils';
import { InputAddon } from './input-addon';
import { Spinner } from './spinner';

/**
 * The visible box of Input Group: border, radius, height, shadow, focus ring around the whole
 * group, error and disabled from the input inside. Exported so composed fields (Number Input,
 * Search Field, Currency Input, Phone Input) draw the same box.
 */
export const inputGroupFrame = cn(
  'relative flex h-[var(--control-height)] w-full min-w-0 items-stretch overflow-hidden rounded-input border border-input bg-background text-foreground shadow-xs',
  'transition-[border-color,box-shadow] duration-[var(--duration-fast)]',
  'focus-within:border-ring focus-within:shadow-[0_0_0_2px_var(--background),0_0_0_4px_var(--ring)]',
  'has-[input[aria-invalid=true]]:border-destructive',
  'has-[input:disabled]:cursor-not-allowed has-[input:disabled]:opacity-50',
);

/** The bare input that fills an Input Group between its slots. */
export const inputGroupInput =
  'h-full w-full min-w-0 flex-1 truncate border-0 bg-transparent px-3 text-base text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed md:text-sm';

export interface InputGroupProps extends Omit<React.ComponentProps<'input'>, 'size'> {
  /** Figma Show start + Start slot. A string renders an Input Addon ("https://", "EUR", "@"). */
  start?: React.ReactNode;
  /** Figma Show end + End slot. A string renders an Input Addon (".com", "kg", "%"). */
  end?: React.ReactNode;
  /** Figma Show loading: Spinner sm after the value while an async check runs; aria-busy on the input. */
  loading?: boolean;
  /** Announced politely while loading. */
  loadingLabel?: string;
  /** Class of the input (className goes to the group box). */
  inputClassName?: string;
}

function Slot({ node, position, id, disabled }: { node: React.ReactNode; position: 'start' | 'end'; id: string; disabled?: boolean }) {
  if (node === undefined || node === null || node === false) return null;
  const text = typeof node === 'string' || typeof node === 'number';
  return (
    <fieldset data-slot={`input-group-${position}`} disabled={disabled} className="m-0 flex min-w-0 shrink-0 items-stretch border-0 p-0">
      {text ? <InputAddon id={id} position={position}>{node}</InputAddon> : node}
    </fieldset>
  );
}

function InputGroup({
  start,
  end,
  loading = false,
  loadingLabel = 'Checking',
  className,
  inputClassName,
  id: idProp,
  disabled,
  'aria-describedby': describedByProp,
  ...props
}: InputGroupProps) {
  const autoId = React.useId();
  const id = idProp ?? autoId;
  const startId = `${id}-start`;
  const endId = `${id}-end`;
  const isText = (n: React.ReactNode) => typeof n === 'string' || typeof n === 'number';
  const describedBy = [describedByProp, isText(start) ? startId : null, isText(end) ? endId : null].filter(Boolean).join(' ') || undefined;

  return (
    <div data-slot="input-group" data-disabled={disabled ? '' : undefined} className={cn(inputGroupFrame, className)}>
      <Slot node={start} position="start" id={startId} disabled={disabled} />
      <input
        data-slot="input-group-input"
        id={id}
        disabled={disabled}
        aria-describedby={describedBy}
        aria-busy={loading || undefined}
        className={cn(inputGroupInput, inputClassName)}
        {...props}
      />
      {loading ? (
        <span data-slot="input-group-loading" className="flex shrink-0 items-center pr-3">
          <Spinner size="sm" tone="muted" />
        </span>
      ) : null}
      <Slot node={end} position="end" id={endId} disabled={disabled} />
      <span role="status" aria-live="polite" className="sr-only">{loading ? loadingLabel : ''}</span>
    </div>
  );
}

export { InputGroup };
