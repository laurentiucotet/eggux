// EGG UI Tree Table. Code only (no Figma component yet); family Data Structures.
// A table whose first column is a tree: each row has a level, an indent that grows with it and, for
// a row with children, a chevron that shows or hides the rows below it (a project and its tasks,
// a ledger group and its accounts). The other columns are plain cells. "Expand all" and "Collapse
// all" buttons sit above. Built on the Table parts (header, row, cell) so it follows the table look.
// The table scrolls sideways inside its own region (tab stop) when the columns do not fit.
// A11y: WAI-ARIA treegrid at row level. One tab stop (roving tabindex on the rows). Down and Up move
// through the visible rows, Right expands a collapsed row or moves to its first child, Left collapses
// an open row or moves to its parent, Home and End jump to the first and last visible row, Enter
// toggles the row and calls onRowSelect. Rows carry aria-level, aria-posinset, aria-setsize and
// aria-expanded. The chevron is a pointer shortcut; the keyboard and the buttons do the same.
import * as React from 'react';
import { ChevronRight } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from './table';

export interface TreeTableColumn {
  id: string;
  header: string;
  align?: 'left' | 'right';
  /** CSS width of the column, "40%" or "8rem". The first column takes the rest when empty. */
  width?: string;
}

export interface TreeTableRowData {
  id: string;
  /** Cell content by column id. The first column's content is the row's name. */
  cells: Record<string, React.ReactNode>;
  children?: TreeTableRowData[];
}

export interface TreeTableProps extends Omit<React.ComponentProps<'div'>, 'defaultValue'> {
  columns: TreeTableColumn[];
  rows: TreeTableRowData[];
  /** Ids that start expanded, or "all". Default: all. */
  defaultExpanded?: string[] | 'all';
  onExpandedChange?: (expanded: string[]) => void;
  selectedId?: string;
  onRowSelect?: (row: TreeTableRowData) => void;
  showControls?: boolean;
  /** Accessible name of the table. */
  label?: string;
  /** Pixels of indent per level. Default 20. */
  indent?: number;
}

const ROW_FOCUS = 'outline-none group-focus-visible/row:shadow-[inset_0_2px_0_var(--ring),inset_0_-2px_0_var(--ring)]';

function countRows(list: TreeTableRowData[]): number {
  return list.reduce((s, r) => s + 1 + countRows(r.children ?? []), 0);
}

function TreeTable({ columns, rows, defaultExpanded = 'all', onExpandedChange, selectedId, onRowSelect, showControls = true, label = 'Tree table', indent = 20, className, ...props }: TreeTableProps) {
  const index = React.useMemo(() => {
    const parent = new Map<string, string | null>();
    const parents: string[] = [];
    const walk = (list: TreeTableRowData[], p: string | null) => {
      for (const r of list) {
        parent.set(r.id, p);
        if (r.children?.length) {
          parents.push(r.id);
          walk(r.children, r.id);
        }
      }
    };
    walk(rows, null);
    return { parent, parents };
  }, [rows]);

  const [expanded, setExpandedState] = React.useState<Set<string>>(() => new Set(defaultExpanded === 'all' ? index.parents : defaultExpanded));
  const [active, setActive] = React.useState<string | undefined>(rows[0]?.id);
  const refs = React.useRef(new Map<string, HTMLTableRowElement>());

  const setExpanded = (next: Set<string>) => {
    setExpandedState(next);
    onExpandedChange?.(Array.from(next));
  };
  const toggle = (id: string, open?: boolean) => {
    const next = new Set(expanded);
    if (open ?? !next.has(id)) next.add(id);
    else next.delete(id);
    setExpanded(next);
  };

  const visible: string[] = [];
  const collect = (list: TreeTableRowData[]) => {
    for (const r of list) {
      visible.push(r.id);
      if (r.children?.length && expanded.has(r.id)) collect(r.children);
    }
  };
  collect(rows);

  const focusId = (id: string | undefined) => {
    if (!id) return;
    setActive(id);
    refs.current.get(id)?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTableRowElement>, row: TreeTableRowData) => {
    if (e.target !== e.currentTarget) return;
    const i = visible.indexOf(row.id);
    const has = !!row.children?.length;
    switch (e.key) {
      case 'ArrowDown':
        focusId(visible[i + 1]);
        break;
      case 'ArrowUp':
        focusId(visible[i - 1]);
        break;
      case 'Home':
        focusId(visible[0]);
        break;
      case 'End':
        focusId(visible[visible.length - 1]);
        break;
      case 'ArrowRight':
        if (has && !expanded.has(row.id)) toggle(row.id, true);
        else if (has) focusId(row.children![0].id);
        break;
      case 'ArrowLeft':
        if (has && expanded.has(row.id)) toggle(row.id, false);
        else {
          const p = index.parent.get(row.id);
          if (p) focusId(p);
        }
        break;
      case 'Enter':
        if (has) toggle(row.id);
        onRowSelect?.(row);
        break;
      default:
        return;
    }
    e.preventDefault();
  };

  const renderRows = (list: TreeTableRowData[], level: number): React.ReactNode =>
    list.map((row, i) => {
      const has = !!row.children?.length;
      const open = has && expanded.has(row.id);
      return (
        <React.Fragment key={row.id}>
          <TableRow
            ref={el => {
              if (el) refs.current.set(row.id, el);
              else refs.current.delete(row.id);
            }}
            aria-level={level}
            aria-posinset={i + 1}
            aria-setsize={list.length}
            aria-expanded={has ? open : undefined}
            selected={onRowSelect ? selectedId === row.id : undefined}
            tabIndex={(active ?? visible[0]) === row.id ? 0 : -1}
            data-row={row.id}
            onFocus={e => {
              if (e.target === e.currentTarget) setActive(row.id);
            }}
            onKeyDown={e => onKeyDown(e, row)}
            onClick={() => {
              setActive(row.id);
              onRowSelect?.(row);
            }}
            className={cn('group/row', onRowSelect && 'cursor-pointer', ROW_FOCUS)}
          >
            {columns.map((c, ci) => (
              <TableCell
                key={c.id}
                className={cn(c.align === 'right' && 'text-right tabular-nums', ci === 0 && 'font-medium', ROW_FOCUS.replace('outline-none ', ''))}
              >
                {ci === 0 ? (
                  <div className="flex min-w-0 items-center gap-1" style={{ paddingInlineStart: (level - 1) * indent }}>
                    {has ? (
                      <span
                        aria-hidden="true"
                        data-slot="tree-table-chevron"
                        onClick={e => {
                          e.stopPropagation();
                          focusId(row.id);
                          toggle(row.id);
                        }}
                        className="flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      >
                        <ChevronRight className={cn('size-4 transition-transform duration-[var(--duration-fast)] motion-reduce:transition-none', open && 'rotate-90')} />
                      </span>
                    ) : (
                      <span aria-hidden="true" className="size-6 shrink-0" />
                    )}
                    <span className="min-w-0 flex-1 truncate">{row.cells[c.id]}</span>
                  </div>
                ) : (
                  <div className="min-w-0 truncate">{row.cells[c.id]}</div>
                )}
              </TableCell>
            ))}
          </TableRow>
          {open ? renderRows(row.children!, level + 1) : null}
        </React.Fragment>
      );
    });

  const total = countRows(rows);
  const allOpen = index.parents.every(id => expanded.has(id));
  const allClosed = index.parents.every(id => !expanded.has(id));

  return (
    <div data-slot="tree-table" className={cn('flex w-full min-w-0 flex-col gap-3', className)} {...props}>
      {showControls ? (
        <div className="flex min-w-0 flex-wrap items-center justify-between gap-x-3 gap-y-2">
          <p role="status" className="m-0 min-w-0 text-sm leading-5 text-muted-foreground">{visible.length} of {total} rows shown</p>
          <div className="flex shrink-0 items-center gap-2">
            <Button type="button" variant="outline" size="sm" disabled={allOpen} onClick={() => setExpanded(new Set(index.parents))}>Expand all</Button>
            <Button type="button" variant="outline" size="sm" disabled={allClosed} onClick={() => setExpanded(new Set())}>Collapse all</Button>
          </div>
        </div>
      ) : null}
      <div
        role="region"
        aria-label={`${label}. Scroll sideways to see more columns.`}
        tabIndex={0}
        className="min-w-0 max-w-full overflow-x-auto rounded-lg border border-border outline-none focus-visible:shadow-[0_0_0_2px_var(--background),0_0_0_4px_var(--ring)]"
      >
        <table role="treegrid" aria-label={label} data-slot="table" className="w-full min-w-[28rem] table-fixed border-separate border-spacing-0 text-sm">
          <colgroup>
            {columns.map(c => (
              <col key={c.id} style={c.width ? { width: c.width } : undefined} />
            ))}
          </colgroup>
          <TableHeader>
            <TableRow>
              {columns.map(c => (
                <TableHead key={c.id} className={cn('text-foreground', c.align === 'right' && 'text-right')}>
                  <span className="block min-w-0 truncate">{c.header}</span>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>{renderRows(rows, 1)}</TableBody>
        </table>
      </div>
    </div>
  );
}

export { TreeTable };
