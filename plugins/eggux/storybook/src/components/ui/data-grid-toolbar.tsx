// EGG UI Data Grid Toolbar. Figma: Data Grid Toolbar (Table page, "Data Grid Toolbar / Component",
// 176:1199). Above a data grid: a Start slot (saved view, a 260 Search Field, Filters with the
// active count) and an End slot (Columns, Group by, Export), 8 apart in each. The End slot wraps
// under the Start slot when both do not fit (8 px between rows); min 512. While rows are selected,
// Table Toolbar (bulk actions) takes its place.
// DataGridFiltersButton: an outline sm Button "Filters" whose name carries the count ("Filters, 3
// active") with a Badge Count after it.
import * as React from 'react';
import { ListFilter } from '@/components/icons';
import { cn } from '@/lib/utils';
import { BadgeCount } from './badge-count';
import { Button, type ButtonProps } from './button';

export interface DataGridToolbarProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  /** Figma Start slot: view switch, search, filters. */
  start?: React.ReactNode;
  /** Figma End slot: columns, group by, export. */
  end?: React.ReactNode;
  'aria-label'?: string;
}

function DataGridToolbar({ start, end, className, ...props }: DataGridToolbarProps) {
  return (
    <div data-slot="data-grid-toolbar" className={cn('flex min-w-[512px] flex-wrap items-center justify-between gap-y-2', className)} {...props}>
      <div data-slot="data-grid-toolbar-start" className="flex shrink-0 items-center gap-2">{start}</div>
      <div data-slot="data-grid-toolbar-end" className="flex shrink-0 items-center gap-2">{end}</div>
    </div>
  );
}

export interface DataGridFiltersButtonProps extends Omit<ButtonProps, 'children'> {
  count?: number;
  label?: string;
}

function DataGridFiltersButton({ count = 0, label = 'Filters', ...props }: DataGridFiltersButtonProps) {
  return (
    <span className="flex items-center gap-1">
      <Button variant="outline" size="sm" {...props}>
        <ListFilter aria-hidden="true" />
        {label}
        {count > 0 ? <span className="sr-only">, {count} active</span> : null}
      </Button>
      {count > 0 ? <BadgeCount variant="secondary" count={count} aria-hidden="true" /> : null}
    </span>
  );
}

export { DataGridFiltersButton, DataGridToolbar };
