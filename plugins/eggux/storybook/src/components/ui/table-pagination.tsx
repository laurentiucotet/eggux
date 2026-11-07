// EGG UI Table Pagination. Figma: Table Pagination (Table page, "Table Pagination / Component",
// 245:2349). Under a table: the range with the total and the object name ("Showing 1-20 of 1,284
// invoices", body/small muted, truncates, min 160), "Rows per page" with an 80 wide Select (10, 20,
// 50, 100) and a numbered Pagination. 12 px vertical padding, 24 gap (12 when wrapped); min 448:
// when the row is too narrow, Pagination wraps to its own line. Keep it with one page (range only),
// so the total is always visible.
// A11y: the range is a polite live region; the Select is named "Rows per page".
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Pagination } from './pagination';
import { Select, SelectContent, SelectItem, SelectTrigger } from './select';

export interface TablePaginationProps extends Omit<React.ComponentProps<'div'>, 'onChange'> {
  page: number;
  pageSize: number;
  total: number;
  /** Plural object name: "invoices". */
  noun?: string;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizes?: number[];
  /** Figma Show rows per page. */
  showPageSize?: boolean;
  labels?: Partial<{ rowsPerPage: string; range: (from: number, to: number, total: number, noun: string) => string }>;
}

const fmt = (n: number) => n.toLocaleString('en-US');

function TablePagination({ page, pageSize, total, noun = 'rows', onPageChange, onPageSizeChange, pageSizes = [10, 20, 50, 100], showPageSize = true, labels, className, ...props }: TablePaginationProps) {
  const L = { rowsPerPage: 'Rows per page', range: (a: number, b: number, t: number, n: string) => `Showing ${fmt(a)}-${fmt(b)} of ${fmt(t)} ${n}`, ...labels };
  const labelId = React.useId();
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);
  return (
    <div data-slot="table-pagination" className={cn('flex min-w-[448px] flex-wrap items-center gap-x-6 gap-y-3 py-3', className)} {...props}>
      <p aria-live="polite" className="m-0 min-w-40 flex-1 truncate text-sm leading-5 text-muted-foreground">{L.range(from, to, total, noun)}</p>
      {showPageSize ? (
        <div className="flex shrink-0 items-center gap-2">
          <span id={labelId} className="text-sm leading-5 whitespace-nowrap text-muted-foreground">{L.rowsPerPage}</span>
          <Select value={String(pageSize)} onValueChange={v => onPageSizeChange?.(Number(v))}>
            <SelectTrigger aria-labelledby={labelId} className="w-20" />
            <SelectContent>
              {pageSizes.map(s => <SelectItem key={s} value={String(s)}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      ) : null}
      {pageCount > 1 ? <Pagination page={page} pageCount={pageCount} onPageChange={onPageChange} /> : null}
    </div>
  );
}

export { TablePagination };
