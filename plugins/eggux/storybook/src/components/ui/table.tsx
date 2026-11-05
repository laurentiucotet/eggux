// EGG UI Table. Figma: Table page, "Table Cell / Component" section. Table Cell (Type header,
// body, expanded, footer x State default, hover, selected, resizing, dragging, editing, error x
// Style default, striped) and Table Header Label (Sort off, sortable, ascending, descending x
// Align left, right; Show info, Show menu). shadcn Table with the EGG changes from
// references/code-mapping.md. Built from Button (menu), InfoTip (info), icons ArrowUpDown,
// ChevronUp, ChevronDown, Ellipsis. Density comes from --table-header-height and
// --cell-padding-y, which the `.density-compact` class changes.
// The table is semantic: <table>, <th scope>, <td>. Sorting: the header is a button inside <th>
// and the <th> carries aria-sort (TableHead `sort`).
import * as React from 'react';
import { ArrowUpDown, ChevronDown, ChevronUp, Ellipsis } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { InfoTip } from './info-tip';

export type TableCellType = 'header' | 'body' | 'expanded' | 'footer';
export type TableCellState = 'default' | 'hover' | 'selected' | 'resizing' | 'dragging' | 'editing' | 'error';
export type TableSort = 'off' | 'sortable' | 'ascending' | 'descending';

export interface TableProps extends React.ComponentProps<'table'> {
  /** Fixed column layout: columns share the width and long text truncates (Figma resize contract). */
  fixed?: boolean;
  /** Classes of the scroll container around the table. */
  containerClassName?: string;
}

function Table({ className, containerClassName, fixed = false, ...props }: TableProps) {
  return (
    <div data-slot="table-container" className={cn('relative w-full overflow-x-auto', containerClassName)}>
      <table
        data-slot="table"
        className={cn('w-full border-separate border-spacing-0 text-sm', fixed && 'table-fixed', className)}
        {...props}
      />
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<'thead'>) {
  return <thead data-slot="table-header" className={className} {...props} />;
}

function TableBody({ className, ...props }: React.ComponentProps<'tbody'>) {
  return <tbody data-slot="table-body" className={className} {...props} />;
}

function TableFooter({ className, ...props }: React.ComponentProps<'tfoot'>) {
  return <tfoot data-slot="table-footer" className={className} {...props} />;
}

export interface TableRowProps extends React.ComponentProps<'tr'> {
  /** Figma State=selected on every cell of the row. Sets aria-selected. */
  selected?: boolean;
}

/** Every cell of a row shares the State: the row carries hover and selected, the cells follow it. */
function TableRow({ className, selected, ...props }: TableRowProps) {
  return (
    <tr
      data-slot="table-row"
      data-state={selected ? 'selected' : undefined}
      aria-selected={selected || undefined}
      className={cn('group/row', className)}
      {...props}
    />
  );
}

// Every class name is written in full so Tailwind can generate it.
const stateClasses: Record<TableCellState, string> = {
  default: '',
  hover: 'bg-[var(--table-row-hover)]',
  selected: 'bg-muted',
  resizing: '',
  dragging: 'bg-muted shadow-md',
  editing: 'border-2 border-ring bg-background',
  error: 'border-2 border-destructive bg-background',
};

// Rows follow hover and selected for body cells of the row.
const rowFollow = 'group-hover/row:bg-[var(--table-row-hover)] group-data-[state=selected]/row:bg-muted';

interface CellOptions {
  type: TableCellType;
  state: TableCellState;
  striped: boolean;
}

function cellClasses({ type, state, striped }: CellOptions) {
  const forced = state !== 'default';
  return cn(
    'min-w-0 px-2 align-middle',
    type === 'header' && 'h-[var(--table-header-height)] border-b border-border py-0.5 text-left font-medium',
    type === 'body' && 'border-b border-border py-[var(--cell-padding-y)]',
    type === 'expanded' && 'border-b border-border bg-[var(--table-row-expanded)] p-4',
    type === 'footer' && 'border-t border-border bg-[var(--card-muted)] py-[var(--cell-padding-y)]',
    type === 'body' && striped && 'bg-[var(--card-muted)]',
    // The state of the row applies unless the cell forces its own state (Figma State on the cell).
    !forced && type !== 'footer' && type !== 'expanded' && rowFollow,
    stateClasses[state],
    state === 'dragging' && 'relative z-10',
  );
}

export interface TableCellProps extends React.ComponentProps<'td'> {
  /** Figma Type: body (default), expanded (one detail cell spanning all columns) or footer (totals row). */
  type?: Exclude<TableCellType, 'header'>;
  /** Figma State. Rows normally supply hover and selected; set it to show a state on one cell (editing, error). */
  state?: TableCellState;
  /** Figma Style=striped: muted fill for every second row of a wide read-only table. */
  striped?: boolean;
}

function TableCell({ className, type = 'body', state = 'default', striped = false, ...props }: TableCellProps) {
  return (
    <td
      data-slot="table-cell"
      data-type={type}
      data-state={state === 'default' ? undefined : state}
      className={cn(cellClasses({ type, state, striped }), className)}
      {...props}
    />
  );
}

export interface TableHeadProps extends React.ComponentProps<'th'> {
  /** Figma State of the header cell: hover (row-hover fill), resizing (primary handle), dragging (lifted). */
  state?: Extract<TableCellState, 'default' | 'hover' | 'resizing' | 'dragging'>;
  /** The sort order of the column: sets aria-sort on the <th>. Leave undefined for columns that cannot be sorted. */
  sort?: Exclude<TableSort, 'off' | 'sortable'> | 'none';
  /** Show the 2 px resize handle on the right edge (Figma shows it on State=hover as the --input color). */
  resizeHandle?: boolean;
}

function TableHead({ className, state = 'default', sort, resizeHandle = false, scope = 'col', children, ...props }: TableHeadProps) {
  return (
    <th
      data-slot="table-head"
      data-state={state === 'default' ? undefined : state}
      scope={scope}
      aria-sort={sort}
      className={cn(
        'group/th relative',
        cellClasses({ type: 'header', state, striped: false }),
        state === 'hover' && 'bg-[var(--table-row-hover)]',
        className,
      )}
      {...props}
    >
      {children}
      {resizeHandle || state === 'hover' || state === 'resizing' ? (
        <span
          aria-hidden="true"
          data-slot="table-resize-handle"
          className={cn('pointer-events-none absolute -bottom-px right-0 top-0 w-0.5', state === 'resizing' ? 'bg-primary' : 'bg-input')}
        />
      ) : null}
    </th>
  );
}

const sortIcons = { sortable: ArrowUpDown, ascending: ChevronUp, descending: ChevronDown } as const;

export interface TableHeaderLabelProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  /** Figma Label. */
  label: string;
  /** Figma Sort: off (not sortable), sortable (inactive), ascending, descending. */
  sort?: TableSort;
  /** Figma Align: numbers and currency columns align right. */
  align?: 'left' | 'right';
  /** Called when the header button is activated (click, Enter, Space). The parent decides the next order. */
  onSortClick?: () => void;
  /** Figma Show info: the definition of the metric, shown in an Info Tip after the label. */
  info?: React.ReactNode;
  /** Figma Show menu: renders the ellipsis Button Icon xs. The parent opens its column menu from onMenuClick. */
  showMenu?: boolean;
  /** Accessible name of the menu button: "Column options for Amount". */
  menuLabel?: string;
  onMenuClick?: React.MouseEventHandler<HTMLButtonElement>;
}

/**
 * Header cell content. Put it inside a TableHead and give the TableHead the matching `sort`
 * (aria-sort). The menu shows on hover and focus of the header (TableHead is the group), and
 * stays visible while it has focus.
 */
function TableHeaderLabel({
  label,
  sort = 'off',
  align = 'left',
  onSortClick,
  info,
  showMenu = false,
  menuLabel,
  onMenuClick,
  className,
  ...props
}: TableHeaderLabelProps) {
  const right = align === 'right';
  const SortIcon = sort === 'off' ? null : sortIcons[sort];
  const text = <span className={cn(right ? 'min-w-10 truncate text-right' : 'shrink-0 whitespace-nowrap')}>{label}</span>;
  const labelEl =
    sort === 'off' ? (
      <span data-slot="table-header-text" className={cn('inline-flex min-w-0 items-center gap-1', right && 'flex-1 justify-end')}>{text}</span>
    ) : (
      <button
        type="button"
        data-slot="table-header-sort"
        onClick={onSortClick}
        className={cn(
          'inline-flex min-w-0 cursor-pointer items-center gap-1 rounded-sm text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring',
          right && 'justify-end',
        )}
      >
        {text}
        {SortIcon ? (
          <SortIcon
            aria-hidden="true"
            className={cn('size-4 shrink-0', sort === 'sortable' ? 'text-muted-foreground' : 'text-foreground')}
          />
        ) : null}
      </button>
    );
  const infoEl = info ? <InfoTip label={label}>{info}</InfoTip> : null;
  const menuEl = showMenu ? (
    <Button
      type="button"
      variant="ghost"
      size="icon-xs"
      aria-label={menuLabel ?? `Column options for ${label}`}
      onClick={onMenuClick}
      className="opacity-0 focus-visible:opacity-100 group-focus-within/th:opacity-100 group-hover/th:opacity-100"
    >
      <Ellipsis aria-hidden="true" />
    </Button>
  ) : null;
  const spacer = <span aria-hidden="true" className="h-px min-w-px flex-1" />;
  return (
    <div data-slot="table-header-label" data-sort={sort} data-align={align} className={cn('flex min-w-0 items-center gap-1 text-sm font-medium leading-5 text-foreground', className)} {...props}>
      {right ? (
        <>
          {menuEl}
          {spacer}
          {infoEl}
          {labelEl}
        </>
      ) : (
        <>
          {labelEl}
          {infoEl}
          {spacer}
          {menuEl}
        </>
      )}
    </div>
  );
}

export { Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell, TableHeaderLabel };
