// EGG UI Pagination. Figma: Pagination page: Pagination Item (87:38), Pagination (697:117817),
// Pagination Compact (417:5105), Load More (435:1286), Pager Link (550:80300).
// Pagination Item: 36 high (min 36), radius button, ui/label; page (8 px sides; active = outline
// with shadow xs, hover = accent), previous / next (chevron and label, 10 / 16 px sides, 4 gap),
// ellipsis. Pagination Style=numbered: first, last, current ± 1 and ellipses, 4 apart (min 386);
// Style=simple: Previous, "Page 2 of 10" (body/small muted) and Next, 8 apart (min 278). Previous
// is disabled on the first page and Next on the last. Pagination Compact: two outline 32 Button
// Icons around "Page 2 of 12". Load More: "Showing 20 of 248 invoices" (ui/caption muted) over an
// outline Button, 8 apart, centered; loading disables it with a spinner. Pager Link: a bordered card
// (radius xl, 20 / 16 padding) with "Previous" or "Next" and a chevron, over the linked title.
// A11y: Pagination is a nav "Pagination"; the current page has aria-current="page"; page buttons
// are named "Page 3"; the ellipsis is hidden from screen readers; Load More announces the new count.
// Style=dots (Carousel Indicator) is not built here.
import * as React from 'react';
import { ChevronLeft, ChevronRight, Ellipsis } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { ButtonIcon } from './button-icon';

const itemBase =
  'inline-flex h-9 min-w-9 shrink-0 cursor-pointer items-center justify-center gap-1 rounded-button text-sm leading-5 font-medium whitespace-nowrap text-foreground outline-none transition-[color,background-color,box-shadow] duration-[var(--duration-fast)] hover:bg-accent hover:text-accent-foreground focus-visible:shadow-[0_0_0_2px_var(--background),0_0_0_4px_var(--ring)] disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0';

export interface PaginationItemProps extends React.ComponentProps<'button'> {
  /** Figma Type (ellipsis is PaginationEllipsis). */
  itemType?: 'page' | 'previous' | 'next';
  active?: boolean;
}

function PaginationItem({ itemType: type = 'page', active = false, className, children, ...props }: PaginationItemProps) {
  return (
    <button
      type="button"
      data-slot="pagination-item"
      data-type={type}
      aria-current={active ? 'page' : undefined}
      className={cn(
        itemBase,
        type === 'page' && 'px-2',
        type === 'previous' && 'pr-4 pl-2.5',
        type === 'next' && 'pr-2.5 pl-4',
        active && 'border border-input bg-background shadow-xs hover:bg-background hover:text-foreground',
        className,
      )}
      {...props}
    >
      {type === 'previous' ? <ChevronLeft aria-hidden="true" /> : null}
      {children}
      {type === 'next' ? <ChevronRight aria-hidden="true" /> : null}
    </button>
  );
}

function PaginationEllipsis({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span data-slot="pagination-ellipsis" aria-hidden="true" className={cn('flex size-9 shrink-0 items-center justify-center text-muted-foreground [&_svg]:size-4', className)} {...props}>
      <Ellipsis />
    </span>
  );
}

/** First, last, current ± siblings, with null for an ellipsis. */
function pageRange(page: number, count: number, siblings = 1): (number | null)[] {
  const out: (number | null)[] = [];
  const from = Math.max(2, page - siblings);
  const to = Math.min(count - 1, page + siblings);
  out.push(1);
  if (from > 2) out.push(from === 3 ? 2 : null);
  for (let p = from; p <= to; p++) out.push(p);
  if (to < count - 1) out.push(to === count - 2 ? count - 1 : null);
  if (count > 1) out.push(count);
  return out;
}

export interface PaginationProps extends Omit<React.ComponentProps<'nav'>, 'onChange'> {
  /** 1-based current page. */
  page: number;
  pageCount: number;
  onPageChange?: (page: number) => void;
  /** Figma Style: numbered (tables, long lists) or simple (articles, search, mobile). */
  paginationStyle?: 'numbered' | 'simple';
  siblings?: number;
  labels?: Partial<{ nav: string; previous: string; next: string; page: (n: number) => string; of: (p: number, c: number) => string }>;
}

function Pagination({ page, pageCount, onPageChange, paginationStyle = 'numbered', siblings = 1, labels, className, ...props }: PaginationProps) {
  const L = { nav: 'Pagination', previous: 'Previous', next: 'Next', page: (n: number) => `Page ${n}`, of: (p: number, c: number) => `Page ${p} of ${c}`, ...labels };
  const go = (p: number) => onPageChange?.(Math.max(1, Math.min(pageCount, p)));
  const prev = <PaginationItem itemType="previous" disabled={page <= 1} onClick={() => go(page - 1)}>{L.previous}</PaginationItem>;
  const next = <PaginationItem itemType="next" disabled={page >= pageCount} onClick={() => go(page + 1)}>{L.next}</PaginationItem>;
  return (
    <nav data-slot="pagination" data-style={paginationStyle} aria-label={L.nav} className={cn('flex w-fit shrink-0 items-center', className)} {...props}>
      {paginationStyle === 'simple' ? (
        <div className="flex min-w-[278px] items-center gap-2">
          {prev}
          <span className="text-sm leading-5 whitespace-nowrap text-muted-foreground">{L.of(page, pageCount)}</span>
          {next}
        </div>
      ) : (
        <ul className="m-0 flex list-none items-center gap-1 p-0">
          <li className="flex">{prev}</li>
          {pageRange(page, pageCount, siblings).map((p, i) => (
            <li key={p ?? `gap-${i}`} className="flex">
              {p === null ? (
                <PaginationEllipsis />
              ) : (
                <PaginationItem active={p === page} aria-label={L.page(p)} onClick={() => go(p)}>{p}</PaginationItem>
              )}
            </li>
          ))}
          <li className="flex">{next}</li>
        </ul>
      )}
    </nav>
  );
}

export interface PaginationCompactProps extends Omit<React.ComponentProps<'nav'>, 'onChange'> {
  page: number;
  pageCount: number;
  onPageChange?: (page: number) => void;
  labels?: Partial<{ nav: string; previous: string; next: string; of: (p: number, c: number) => string }>;
}

function PaginationCompact({ page, pageCount, onPageChange, labels, className, ...props }: PaginationCompactProps) {
  const L = { nav: 'Pagination', previous: 'Previous page', next: 'Next page', of: (p: number, c: number) => `Page ${p} of ${c}`, ...labels };
  return (
    <nav data-slot="pagination-compact" aria-label={L.nav} className={cn('flex w-fit shrink-0 items-center gap-2', className)} {...props}>
      <ButtonIcon variant="outline" size="sm" icon={<ChevronLeft />} label={L.previous} disabled={page <= 1} onClick={() => onPageChange?.(page - 1)} />
      <span className="text-sm leading-5 whitespace-nowrap text-muted-foreground">{L.of(page, pageCount)}</span>
      <ButtonIcon variant="outline" size="sm" icon={<ChevronRight />} label={L.next} disabled={page >= pageCount} onClick={() => onPageChange?.(page + 1)} />
    </nav>
  );
}

export interface LoadMoreProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  /** "Showing 20 of 248 invoices". */
  status: string;
  /** Button label: "Load 20 more". */
  label: string;
  loading?: boolean;
  onLoadMore?: () => void;
}

function LoadMore({ status, label, loading = false, onLoadMore, className, ...props }: LoadMoreProps) {
  return (
    <div data-slot="load-more" className={cn('flex w-full flex-col items-center gap-2', className)} {...props}>
      <p role="status" className="m-0 w-full truncate text-center text-xs leading-4 text-muted-foreground">{status}</p>
      <Button variant="outline" loading={loading} onClick={onLoadMore}>{label}</Button>
    </div>
  );
}

export interface PagerLinkProps extends Omit<React.ComponentProps<'a'>, 'title'> {
  direction: 'previous' | 'next';
  title: string;
  /** Caption: "Previous" / "Next". */
  caption?: string;
}

function PagerLink({ direction, title, caption, className, ...props }: PagerLinkProps) {
  const next = direction === 'next';
  return (
    <a
      data-slot="pager-link"
      data-direction={direction}
      className={cn(
        'flex min-w-0 flex-col gap-1 rounded-xl border border-border bg-card px-5 py-4 text-card-foreground no-underline outline-none transition-[border-color,box-shadow] duration-[var(--duration-fast)] hover:border-foreground/20 hover:shadow-sm focus-visible:ring-[3px] focus-visible:ring-ring/50',
        next ? 'items-end text-right' : 'items-start',
        className,
      )}
      {...props}
    >
      <span className="flex items-center gap-1 text-xs leading-4 text-muted-foreground [&_svg]:size-3.5">
        {next ? null : <ChevronLeft aria-hidden="true" />}
        {caption ?? (next ? 'Next' : 'Previous')}
        {next ? <ChevronRight aria-hidden="true" /> : null}
      </span>
      <span className="w-full text-sm leading-5 font-medium [overflow-wrap:anywhere]">{title}</span>
    </a>
  );
}

export { LoadMore, PagerLink, Pagination, PaginationCompact, PaginationEllipsis, PaginationItem, pageRange };
