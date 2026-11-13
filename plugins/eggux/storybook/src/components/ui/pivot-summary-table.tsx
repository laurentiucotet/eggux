// EGG UI Pivot Summary Table. Code only (no Figma component yet); family Data Structures.
// Flat records ({ row, column, value }) cross-tabulated into a grid: one row per row key, one
// column per column key, each cell the sum of its records. A Total column and a Total row (with
// the grand total in the corner) close the grid. A heat tint behind each cell shows how its value
// compares with the largest cell, in four steps drawn in the primary colour; the number is always
// printed in the normal text colour, so the tint adds to the number and never replaces it. A cell
// with no records shows a dash. The first column stays in view when the table scrolls sideways,
// and the table scrolls inside its own region (a tab stop) when the columns do not fit.
// A11y: a real table: a caption (the title), column headers with scope="col", row headers with
// scope="row", the totals row in a tfoot. The dash has the text "No data" for screen readers. The
// tint is decoration; the legend says what it means in words.
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface PivotRecord {
  row: string;
  column: string;
  value: number;
}

export interface PivotSummaryTableProps extends Omit<React.ComponentProps<'div'>, 'title'> {
  data: PivotRecord[];
  /** Heading of the row-header column: "Region". */
  rowLabel?: string;
  /** Row keys in the order to show. Default: order of first appearance. */
  rowOrder?: string[];
  /** Column keys in the order to show. Default: order of first appearance. */
  columnOrder?: string[];
  /** Title and caption of the table. */
  title?: string;
  titleAs?: 'h2' | 'h3' | 'h4';
  /** ISO currency code ("EUR"): values are shown as money. Default: plain numbers. */
  currency?: string;
  /** Show the Total column, the Total row and the grand total. Default true. */
  showTotals?: boolean;
  /** Show the heat tint and its legend. Default true. */
  heat?: boolean;
  locale?: string;
}

// Every class name in full so Tailwind can generate it. The text keeps the normal colour on all of them.
const tint = ['', 'bg-primary/10', 'bg-primary/20', 'bg-primary/30', 'bg-primary/40'] as const;

const cellBase = 'border-b border-border px-3 py-2 text-right tabular-nums whitespace-nowrap';

function PivotSummaryTable({
  data,
  rowLabel = 'Row',
  rowOrder,
  columnOrder,
  title = 'Summary',
  titleAs: Title = 'h3',
  currency,
  showTotals = true,
  heat = true,
  locale = 'en-GB',
  className,
  ...props
}: PivotSummaryTableProps) {
  const headingId = React.useId();
  const model = React.useMemo(() => {
    const cells = new Map<string, number>();
    const rowSeen: string[] = [];
    const colSeen: string[] = [];
    for (const r of data) {
      if (!rowSeen.includes(r.row)) rowSeen.push(r.row);
      if (!colSeen.includes(r.column)) colSeen.push(r.column);
      const k = `${r.row}\u0000${r.column}`;
      cells.set(k, (cells.get(k) ?? 0) + r.value);
    }
    const rows = rowOrder ?? rowSeen;
    const cols = columnOrder ?? colSeen;
    const get = (r: string, c: string) => cells.get(`${r}\u0000${c}`);
    const rowTotal = (r: string) => cols.reduce((s, c) => s + (get(r, c) ?? 0), 0);
    const colTotal = (c: string) => rows.reduce((s, r) => s + (get(r, c) ?? 0), 0);
    const grand = rows.reduce((s, r) => s + rowTotal(r), 0);
    let max = 0;
    for (const r of rows) for (const c of cols) max = Math.max(max, get(r, c) ?? 0);
    return { rows, cols, get, rowTotal, colTotal, grand, max };
  }, [data, rowOrder, columnOrder]);

  const fmt = React.useMemo(() => {
    const f = new Intl.NumberFormat(locale, currency ? { style: 'currency', currency, maximumFractionDigits: 0 } : { maximumFractionDigits: 0 });
    return (n: number) => f.format(n);
  }, [locale, currency]);

  const { rows, cols, get, rowTotal, colTotal, grand, max } = model;
  const level = (v: number) => (max <= 0 || v <= 0 ? 0 : Math.min(4, Math.ceil((v / max) * 4)));
  const stickyHead = 'sticky left-0 z-10 bg-card text-left shadow-[inset_-1px_0_0_var(--border)]';

  return (
    <div data-slot="pivot-summary-table" className={cn('flex w-full min-w-0 flex-col gap-3', className)} {...props}>
      <Title id={headingId} className="m-0 min-w-0 text-base leading-6 font-semibold break-words">{title}</Title>
      {heat ? (
        <p className="m-0 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-xs leading-4 text-muted-foreground">
          <span>Darker cells have higher values.</span>
          <span aria-hidden="true" className="flex items-center gap-0.5">
            {tint.slice(1).map(c => (
              <span key={c} className={cn('size-3 rounded-sm border border-border', c)} />
            ))}
          </span>
        </p>
      ) : null}
      <div
        role="region"
        aria-label={`${title}. Scroll sideways to see more columns.`}
        tabIndex={0}
        className="min-w-0 max-w-full overflow-x-auto rounded-lg border border-border bg-card outline-none focus-visible:shadow-[0_0_0_2px_var(--background),0_0_0_4px_var(--ring)]"
      >
        <table aria-labelledby={headingId} className="w-full border-separate border-spacing-0 text-sm">
          <thead>
            <tr>
              <th scope="col" className={cn(stickyHead, 'min-w-[7rem] border-b border-border px-3 py-2 text-xs font-medium whitespace-nowrap text-foreground')}>{rowLabel}</th>
              {cols.map(c => (
                <th key={c} scope="col" className="border-b border-border px-3 py-2 text-right text-xs font-medium whitespace-nowrap text-foreground">{c}</th>
              ))}
              {showTotals ? <th scope="col" className="border-b border-l border-border bg-[var(--card-muted)] px-3 py-2 text-right text-xs font-semibold whitespace-nowrap text-foreground">Total</th> : null}
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r} data-row={r}>
                <th scope="row" className={cn(stickyHead, 'max-w-[10rem] truncate border-b border-border px-3 py-2 font-medium')} title={r}>{r}</th>
                {cols.map(c => {
                  const v = get(r, c);
                  return (
                    <td key={c} data-level={v === undefined || !heat ? 0 : level(v)} title={v === undefined ? undefined : `${r}, ${c}: ${fmt(v)}`} className={cn(cellBase, 'text-foreground', heat && v !== undefined && tint[level(v)])}>
                      {v === undefined ? (
                        <>
                          <span aria-hidden="true">–</span>
                          <span className="sr-only">No data</span>
                        </>
                      ) : (
                        fmt(v)
                      )}
                    </td>
                  );
                })}
                {showTotals ? <td className={cn(cellBase, 'border-l bg-[var(--card-muted)] font-semibold text-foreground')}>{fmt(rowTotal(r))}</td> : null}
              </tr>
            ))}
          </tbody>
          {showTotals ? (
            <tfoot>
              <tr>
                <th scope="row" className={cn(stickyHead, 'border-t border-border bg-[var(--card-muted)] px-3 py-2 font-semibold')}>Total</th>
                {cols.map(c => (
                  <td key={c} className={cn(cellBase, 'border-t border-b-0 bg-[var(--card-muted)] font-semibold text-foreground')}>{fmt(colTotal(c))}</td>
                ))}
                <td className={cn(cellBase, 'border-t border-b-0 border-l bg-[var(--card-muted)] font-semibold text-foreground')}>{fmt(grand)}</td>
              </tr>
            </tfoot>
          ) : null}
        </table>
      </div>
    </div>
  );
}

export { PivotSummaryTable };
