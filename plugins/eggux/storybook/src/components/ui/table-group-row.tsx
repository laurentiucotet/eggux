// EGG UI Table Group Row. Figma: Table page / Table Group Row (304:4493, 2 variants, node 906:4440).
// Content of a group header row: put it in a cell that spans all columns. State=expanded (chevron
// down) or collapsed (chevron right). The chevron is a button with aria-expanded and a name
// ("Collapse Overdue" / "Expand Paid"); the label fills (min 48, one line with an ellipsis), the
// count (Badge Count) hugs, the subtotal hugs up to 160 with an ellipsis.
import * as React from 'react';
import { ChevronDown, ChevronRight } from '@/components/icons';
import { BadgeCount } from './badge-count';
import { cn } from '@/lib/utils';

export type TableGroupRowState = 'expanded' | 'collapsed';

export interface TableGroupRowProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  /** Figma State. */
  state?: TableGroupRowState;
  /** Called with the new state when the chevron is clicked. */
  onExpandedChange?: (expand: boolean) => void;
  /** Figma Label. */
  label?: string;
  /** Rows in the group (Badge Count). */
  count?: number;
  /** Text equivalent of the count for assistive technology: "3 invoices". */
  countLabel?: string;
  /** Figma Subtotal: "Subtotal €5,620.00". */
  subtotal?: string;
  /** Figma Show subtotal. */
  showSubtotal?: boolean;
}

function TableGroupRow({ state = 'expanded', onExpandedChange, label = 'Overdue', count = 3, countLabel, subtotal = 'Subtotal €5,620.00', showSubtotal = true, className, ...props }: TableGroupRowProps) {
  const expanded = state === 'expanded';
  return (
    <div data-slot="table-group-row" data-state={state} className={cn('flex w-full items-center gap-2', className)} {...props}>
      <button
        type="button"
        data-slot="table-group-row-toggle"
        aria-expanded={expanded}
        aria-label={`${expanded ? 'Collapse' : 'Expand'} ${label}`}
        onClick={() => onExpandedChange?.(!expanded)}
        className="-mx-0.5 flex size-5 shrink-0 items-center justify-center rounded-sm text-foreground outline-none hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        {expanded ? <ChevronDown className="size-4" aria-hidden="true" /> : <ChevronRight className="size-4" aria-hidden="true" />}
      </button>
      <span data-slot="table-group-row-label" className="min-w-12 flex-1 truncate text-sm font-medium leading-5 text-foreground">{label}</span>
      <BadgeCount variant="secondary" count={count} label={countLabel ?? `${count} ${count === 1 ? 'row' : 'rows'}`} />
      {showSubtotal && <span data-slot="table-group-row-subtotal" className="max-w-40 shrink-0 truncate text-sm font-medium leading-5 text-foreground">{subtotal}</span>}
    </div>
  );
}

export { TableGroupRow };
