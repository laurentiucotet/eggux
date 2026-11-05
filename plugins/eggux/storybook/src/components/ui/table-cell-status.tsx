// EGG UI Table Cell Status. Figma: Table page / Table Cell Status (304:3298, node 245:2327).
// A Badge (Variant and Label exposed) and an optional muted note. One status per row; the label
// names the state, color supports it. The note truncates so the cell never grows past its column.
import * as React from 'react';
import { Badge, type BadgeProps } from './badge';
import { cn } from '@/lib/utils';

export interface TableCellStatusProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  /** The Badge label: names the state ("Overdue"). */
  label: string;
  /** Badge variant. Figma default: warning. */
  variant?: BadgeProps['variant'];
  /** Figma "Show dot": a dot in the label color before the label. */
  dot?: boolean;
  /** Figma "Note": a muted detail after the badge ("12 days"). */
  note?: string;
  /** Figma "Show note". */
  showNote?: boolean;
}

function TableCellStatus({ label, variant = 'warning', dot = true, note = '12 days', showNote = true, className, ...props }: TableCellStatusProps) {
  return (
    <div data-slot="table-cell-status" className={cn('flex min-w-0 items-center gap-2', className)} {...props}>
      <Badge variant={variant} dot={dot}>{label}</Badge>
      {showNote && note ? <span data-slot="table-cell-status-note" className="min-w-0 flex-1 truncate text-sm text-muted-foreground">{note}</span> : null}
    </div>
  );
}

export { TableCellStatus };
