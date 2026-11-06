// EGG UI Textarea. Figma: Textarea (Input page, "Textarea / Component", set 84:53).
// State (default, focus, error via aria-invalid, disabled, read-only) x Content (placeholder,
// filled). shadcn Textarea: 64 min height, 12 / 8 px padding, body/small, radius/md (Textarea keeps
// rounded-md while Input is a pill, references/code-mapping.md), border/input, shadow/xs. Grows with
// its content (field-sizing: content) up to a max height (240 by default, set with max-h-*), then
// scrolls. Focus: the Figma ring (2 px background gap + 2 px border/ring band). Read-only: muted
// fill, no shadow, full-contrast value, placeholder in input/filled-muted-foreground. Use it in a
// Field for the label, hint, error and counter.
import * as React from 'react';
import { cn } from '@/lib/utils';

export type TextareaProps = React.ComponentProps<'textarea'>;

function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'flex field-sizing-content min-h-16 max-h-60 w-full min-w-0 resize-y rounded-md border border-input bg-background px-3 py-2 text-base text-foreground shadow-xs outline-none md:text-sm',
        'transition-[border-color,box-shadow] duration-[var(--duration-fast)] placeholder:text-muted-foreground',
        'focus-visible:border-ring focus-visible:shadow-[0_0_0_2px_var(--background),0_0_0_4px_var(--ring)]',
        'aria-invalid:border-destructive',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'read-only:enabled:bg-muted read-only:enabled:shadow-none read-only:enabled:placeholder:text-[var(--input-filled-muted-foreground)] read-only:enabled:focus-visible:shadow-none',
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
