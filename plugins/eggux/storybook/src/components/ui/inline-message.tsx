// EGG UI Inline Message. Figma: Inline Message (Alert page, node 1119:7208). Type (default,
// info, success, warning, error, loading). One line of status text with an icon and no box.
// Built from Spinner (loading). Code mapping: custom, text clamps to 2 lines, max 480 px.
import * as React from 'react';
import { cva } from 'class-variance-authority';
import { CircleAlert, CircleCheck, Clock, Info, TriangleAlert } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Spinner } from './spinner';

const inlineMessageVariants = cva('flex max-w-[480px] items-start gap-2 text-sm leading-5', {
  variants: {
    type: {
      default: 'text-muted-foreground',
      loading: 'text-muted-foreground',
      // Written out in full: Tailwind only generates classes it can read in the source.
      info: 'text-[var(--badge-soft-info-fg)]',
      success: 'text-[var(--badge-soft-success-fg)]',
      warning: 'text-[var(--badge-soft-warning-fg)]',
      error: 'text-[var(--badge-soft-destructive-fg)]',
    },
  },
  defaultVariants: { type: 'default' },
});

export type InlineMessageType = 'default' | 'info' | 'success' | 'warning' | 'error' | 'loading';

const icons = { default: Clock, info: Info, success: CircleCheck, warning: TriangleAlert, error: CircleAlert } as const;

export interface InlineMessageProps extends Omit<React.ComponentProps<'p'>, 'children'> {
  type?: InlineMessageType;
  /** Figma Text. Past tense for results, present with an ellipsis while running. */
  children?: React.ReactNode;
}

function InlineMessage({ type = 'default', className, children = 'Saved 2 minutes ago', ...props }: InlineMessageProps) {
  const Icon = type === 'loading' ? null : icons[type];
  // Errors that block the goal are announced at once; everything else politely.
  const role = type === 'error' ? 'alert' : 'status';
  return (
    <p data-slot="inline-message" data-type={type} role={role} className={cn(inlineMessageVariants({ type }), className)} {...props}>
      <span className="flex h-5 w-4 shrink-0 items-center justify-center">
        {Icon ? <Icon aria-hidden="true" className="size-4" /> : <Spinner size="sm" tone="muted" />}
      </span>
      <span data-slot="inline-message-text" className="line-clamp-2 min-w-0 flex-1 break-words">{children}</span>
    </p>
  );
}

export { InlineMessage, inlineMessageVariants };
