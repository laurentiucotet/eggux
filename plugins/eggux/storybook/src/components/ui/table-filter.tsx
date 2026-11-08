// EGG UI Table Column Filter: a filter button in a table header that opens the column's filter in a
// Popover. Not a separate Figma component: the Table Header Label menu lists "Filter", and the
// popover reuses the Filters page parts (Faceted Filter for a list of values, 240 wide).
// - Table Column Filter: a 24 px ghost button with the list-filter icon after the label. Inactive it
//   is muted; active it turns primary and shows the count of active values ("2"). Its name is
//   "Filter Status" or "Filter Status, 2 active". Filters apply at once (no Apply button).
// - Table Range Filter: Min and Max number fields for a number or amount column, and Clear.
// - Table Text Filter: a "contains" search for a text column, and Clear.
// Faceted Filter (filters.tsx) is the content for a column with a few known values.
import * as React from 'react';
import { ListFilter } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Input } from './input';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { SearchField } from './search-field';
import { Separator } from './separator';

/* Table Column Filter */

export interface TableColumnFilterProps {
  /** The column name: "Status". */
  label: string;
  /** How many values are active; 0 or undefined when the column is not filtered. */
  active?: number;
  /** The filter content: FacetedFilter, TableRangeFilter or TableTextFilter. */
  children: React.ReactNode;
  /** Popover edge lined up with the button; end for right-aligned (number) columns. */
  align?: 'start' | 'end';
  className?: string;
}

function TableColumnFilter({ label, active = 0, children, align = 'start', className }: TableColumnFilterProps) {
  const on = active > 0;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          data-slot="table-column-filter"
          data-active={on || undefined}
          aria-label={on ? `Filter ${label}, ${active} active` : `Filter ${label}`}
          className={cn(
            'inline-flex h-6 min-w-6 shrink-0 cursor-pointer items-center justify-center gap-0.5 rounded-sm px-1 text-xs leading-4 font-medium outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring data-[state=open]:bg-accent [&_svg]:size-3.5',
            on ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
            className,
          )}
        >
          <ListFilter aria-hidden="true" />
          {on ? <span>{active}</span> : null}
        </button>
      </PopoverTrigger>
      <PopoverContent align={align} aria-label={`Filter ${label}`} className="w-auto overflow-hidden p-0">
        {children}
      </PopoverContent>
    </Popover>
  );
}

/* Table Range Filter */

export interface TableRange {
  min?: number;
  max?: number;
}

export interface TableRangeFilterProps extends Omit<React.ComponentProps<'div'>, 'onChange'> {
  /** The column name: "Amount". */
  label: string;
  value: TableRange;
  onValueChange: (value: TableRange) => void;
  /** Shown after the field labels: "EUR". */
  unit?: string;
}

const toNumber = (s: string) => (s.trim() === '' || Number.isNaN(Number(s)) ? undefined : Number(s));

function TableRangeFilter({ label, value, onValueChange, unit, className, ...props }: TableRangeFilterProps) {
  const id = React.useId();
  const suffix = unit ? ` (${unit})` : '';
  const invalid = value.min !== undefined && value.max !== undefined && value.min > value.max;
  return (
    <div data-slot="table-range-filter" className={cn('flex w-60 flex-col', className)} {...props}>
      <div className="flex gap-2 p-3">
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <label htmlFor={`${id}-min`} className="text-xs leading-4 font-medium text-foreground">Min{suffix}</label>
          <Input id={`${id}-min`} inputMode="decimal" value={value.min ?? ''} placeholder="Any" aria-invalid={invalid || undefined} aria-describedby={invalid ? `${id}-error` : undefined} onChange={e => onValueChange({ ...value, min: toNumber(e.target.value) })} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <label htmlFor={`${id}-max`} className="text-xs leading-4 font-medium text-foreground">Max{suffix}</label>
          <Input id={`${id}-max`} inputMode="decimal" value={value.max ?? ''} placeholder="Any" aria-invalid={invalid || undefined} aria-describedby={invalid ? `${id}-error` : undefined} onChange={e => onValueChange({ ...value, max: toNumber(e.target.value) })} />
        </div>
      </div>
      {invalid ? <p id={`${id}-error`} className="m-0 px-3 pb-2 text-xs leading-4 text-destructive">Min is higher than Max.</p> : null}
      <Separator />
      <div className="p-1">
        <Button variant="ghost" size="sm" className="w-full" disabled={value.min === undefined && value.max === undefined} onClick={() => onValueChange({})}>
          Clear {label.toLowerCase()} filter
        </Button>
      </div>
    </div>
  );
}

/** Count of active bounds of a range: 0, 1 or 2. */
const rangeCount = (r: TableRange) => (r.min !== undefined ? 1 : 0) + (r.max !== undefined ? 1 : 0);

/* Table Text Filter */

export interface TableTextFilterProps extends Omit<React.ComponentProps<'div'>, 'onChange'> {
  /** The column name: "Customer". */
  label: string;
  value: string;
  onValueChange: (value: string) => void;
}

function TableTextFilter({ label, value, onValueChange, className, ...props }: TableTextFilterProps) {
  return (
    <div data-slot="table-text-filter" className={cn('flex w-60 flex-col', className)} {...props}>
      <div className="p-3">
        <SearchField placeholder={`${label} contains…`} label={`${label} contains`} value={value} onValueChange={onValueChange} showShortcut={false} debounce={0} className="w-full" />
      </div>
      <Separator />
      <div className="p-1">
        <Button variant="ghost" size="sm" className="w-full" disabled={!value} onClick={() => onValueChange('')}>
          Clear {label.toLowerCase()} filter
        </Button>
      </div>
    </div>
  );
}

export { TableColumnFilter, TableRangeFilter, TableTextFilter, rangeCount };
