// EGG UI Table Cell Check. Figma: Table page / Table Cell Check (304:3298, 3 variants, node 550:82575).
// Plan comparison value in a table cell: included (check), excluded (dash) or a text value such as
// "Unlimited", with an optional muted note ("per seat"). Screen readers get "Included" or "Not
// included", never the icon. Excluded shows a dash, never a blank cell.
// TableCellSelect is the row-select / select-all companion built from Checkbox (named, with an
// indeterminate state for the header). Guide: eggux build-ui/components/table.md
import * as React from 'react';
import { Check, Minus } from '@/components/icons';
import { Checkbox, type CheckboxProps } from './checkbox';
import { cn } from '@/lib/utils';

export type TableCellCheckValue = 'included' | 'excluded' | 'text';

export interface TableCellCheckProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  /** Figma Value. */
  value?: TableCellCheckValue;
  /** Figma Text (Value=text): "100 GB", "Unlimited". */
  text?: string;
  /** Figma Note (Show note): muted text after the value, max 96 px. */
  note?: string;
  /** Figma Show note. */
  showNote?: boolean;
}

function TableCellCheck({ value = 'included', text = 'Unlimited', note = 'per seat', showNote = false, className, ...props }: TableCellCheckProps) {
  return (
    <div data-slot="table-cell-check" data-value={value} className={cn('flex min-h-5 items-center gap-2 text-sm leading-5', className)} {...props}>
      {value === 'text' ? (
        <span data-slot="table-cell-check-text" className="shrink-0 whitespace-nowrap text-foreground">{text}</span>
      ) : (
        <>
          <span data-slot="table-cell-check-icon" aria-hidden="true" className={cn('flex size-4 shrink-0 items-center justify-center [&_svg]:size-4', value === 'included' ? 'text-foreground' : 'text-muted-foreground in-data-[state=selected]:text-[var(--input-filled-muted-foreground)]')}>
            {value === 'included' ? <Check /> : <Minus />}
          </span>
          <span className="sr-only">{value === 'included' ? 'Included' : 'Not included'}</span>
        </>
      )}
      {showNote && <span data-slot="table-cell-check-note" className="max-w-24 shrink-0 truncate whitespace-nowrap text-muted-foreground in-data-[state=selected]:text-[var(--input-filled-muted-foreground)]">{note}</span>}
    </div>
  );
}

export interface TableCellSelectProps extends Omit<CheckboxProps, 'label' | 'description' | 'aria-label'> {
  /** What is selected: "INV-1024" gives "Select INV-1024"; for the header use `all` = "invoices". */
  name: string;
  /** Header checkbox: the name becomes "Select all <name>", indeterminate when some rows are selected. */
  all?: boolean;
}

function TableCellSelect({ name, all = false, ...props }: TableCellSelectProps) {
  return <Checkbox data-slot="table-cell-select" aria-label={all ? `Select all ${name}` : `Select ${name}`} {...props} />;
}

export { TableCellCheck, TableCellSelect };
