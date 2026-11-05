// EGG UI Field Counter. Figma: Field Counter (Input page). Status (default, near, over). Character
// counter at the right of a Field label ("142 / 160"). Status follows value and limit: near from
// 90 % of the limit, over past it. Never blocks typing; the Field shows the error.
import * as React from 'react';
import { cn } from '@/lib/utils';

export type FieldCounterStatus = 'default' | 'near' | 'over';

export function counterStatus(value: number, limit: number): FieldCounterStatus {
  if (value > limit) return 'over';
  if (value >= Math.ceil(limit * 0.9)) return 'near';
  return 'default';
}

export interface FieldCounterProps extends React.ComponentProps<'span'> {
  /** Characters used. */
  value: number;
  /** The limit. */
  limit: number;
  /** Figma Status; computed from value and limit when not set. */
  status?: FieldCounterStatus;
}

function FieldCounter({ value, limit, status, className, ...props }: FieldCounterProps) {
  const s = status ?? counterStatus(value, limit);
  return (
    <span
      data-slot="field-counter"
      data-status={s}
      // Announced politely only near and over the limit, never on every key.
      aria-live={s === 'default' ? 'off' : 'polite'}
      className={cn(
        'inline-flex h-4 shrink-0 items-center whitespace-nowrap text-xs tabular-nums',
        s === 'default' && 'text-muted-foreground',
        s === 'near' && 'font-medium text-foreground',
        s === 'over' && 'font-medium text-destructive',
        className,
      )}
      {...props}
    >
      {value} / {limit}
      <span className="sr-only"> characters</span>
    </span>
  );
}

export { FieldCounter };
