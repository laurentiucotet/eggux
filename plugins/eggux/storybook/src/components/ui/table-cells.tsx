// EGG UI table cell contents. Figma: Table page, "Table Cell / Component" section: Table Cell Text
// (Style default, strong, muted x Align left, right), Table Cell Stack, Table Cell Amount (Trend
// none, up, down), Table Cell Date, Table Cell Link. Put them in a TableCell (table.tsx). Every one
// stays on one line and truncates; the Table needs `fixed` (or a max width) for the ellipsis.
// Empty values show "-", never blank.
import * as React from 'react';
import { TrendingDown, TrendingUp } from '@/components/icons';
import { cn } from '@/lib/utils';

const EMPTY = '-';
const isEmpty = (v: React.ReactNode) => v === null || v === undefined || v === '' || v === false;

export type TableCellTextStyle = 'default' | 'strong' | 'muted';

export interface TableCellTextProps extends React.ComponentProps<'div'> {
  /** Figma Style: strong = the identifying column; muted = secondary values. */
  textStyle?: TableCellTextStyle;
  /** Figma Align: right for numbers and currency. */
  align?: 'left' | 'right';
}

function TableCellText({ textStyle = 'default', align = 'left', className, children, ...props }: TableCellTextProps) {
  return (
    <div
      data-slot="table-cell-text"
      data-style={textStyle}
      className={cn(
        'min-w-0 truncate text-sm leading-5',
        textStyle === 'strong' && 'font-medium text-foreground',
        textStyle === 'default' && 'text-foreground',
        textStyle === 'muted' && 'text-muted-foreground',
        align === 'right' && 'text-right',
        className,
      )}
      {...props}
    >
      {isEmpty(children) ? EMPTY : children}
    </div>
  );
}

export interface TableCellStackProps extends Omit<React.ComponentProps<'div'>, 'title'> {
  /** Figma Title: the primary value (medium weight). */
  title: React.ReactNode;
  /** Figma Description: the secondary detail (caption, muted). */
  description?: React.ReactNode;
}

function TableCellStack({ title, description, className, ...props }: TableCellStackProps) {
  return (
    <div data-slot="table-cell-stack" className={cn('flex min-w-0 flex-col gap-0.5', className)} {...props}>
      <span data-slot="table-cell-stack-title" className="truncate text-sm font-medium leading-5 text-foreground">
        {isEmpty(title) ? EMPTY : title}
      </span>
      <span data-slot="table-cell-stack-description" className="truncate text-xs leading-4 text-muted-foreground">
        {isEmpty(description) ? EMPTY : description}
      </span>
    </div>
  );
}

export type TableCellAmountTrend = 'none' | 'up' | 'down';

export interface TableCellAmountProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  /** Figma Amount: a preformatted string, or a number formatted with `currency` and `locale`. */
  amount: string | number | null | undefined;
  /** ISO currency code ("EUR") used when `amount` is a number. */
  currency?: string;
  /** BCP 47 locale for the number format. One format per column. */
  locale?: string;
  /** Figma Trend: none shows the Note (count, currency); up and down show the change with a trend icon. The sign is in the text; color only supports it. */
  trend?: TableCellAmountTrend;
  /** Figma Note / Increase / Decrease (Show note): the line under the amount, e.g. "3 invoices" or "+12.4% vs Sep". */
  note?: React.ReactNode;
}

function TableCellAmount({ amount, currency = 'EUR', locale = 'en-IE', trend = 'none', note, className, ...props }: TableCellAmountProps) {
  const text =
    typeof amount === 'number'
      ? new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount)
      : isEmpty(amount)
        ? EMPTY
        : amount;
  const Trend = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : null;
  return (
    <div
      data-slot="table-cell-amount"
      data-trend={trend}
      className={cn('flex min-w-0 flex-col items-end gap-0.5 text-right tabular-nums', className)}
      {...props}
    >
      <span data-slot="table-cell-amount-value" className="max-w-full truncate text-sm font-medium leading-5 text-foreground">{text}</span>
      {note ? (
        <span data-slot="table-cell-amount-note" className="flex max-w-full items-center gap-1 text-xs leading-4 text-muted-foreground">
          {Trend ? <Trend aria-hidden="true" className="size-3.5 shrink-0" /> : null}
          <span className="truncate">{note}</span>
        </span>
      ) : null}
    </div>
  );
}

export interface TableCellDateProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  /** Figma Date: one format for the whole column ("12 Nov 2026"). */
  date: string | null | undefined;
  /** Machine-readable value for <time datetime>, e.g. "2026-11-12". */
  dateTime?: string;
  /** Figma Time (Show time): under the date, only when it matters. */
  time?: string;
}

function TableCellDate({ date, dateTime, time, className, ...props }: TableCellDateProps) {
  return (
    <div data-slot="table-cell-date" className={cn('flex min-w-0 flex-col gap-0.5', className)} {...props}>
      {date ? (
        <time dateTime={dateTime} className="truncate text-sm leading-5 text-foreground">{date}</time>
      ) : (
        <span className="truncate text-sm leading-5 text-foreground">{EMPTY}</span>
      )}
      {time ? <span className="truncate text-xs leading-4 text-muted-foreground">{time}</span> : null}
    </div>
  );
}

export interface TableCellLinkProps extends React.ComponentProps<'a'> {}

/** Figma Table Cell Link: underlined foreground text on one line. One link per row besides the row itself. */
function TableCellLink({ className, children, ...props }: TableCellLinkProps) {
  return (
    <div data-slot="table-cell-link" className="flex min-w-0 items-center">
      <a
        className={cn(
          'min-w-0 truncate rounded-sm text-sm leading-5 text-foreground underline outline-none hover:text-foreground/80 focus-visible:ring-2 focus-visible:ring-ring',
          className,
        )}
        {...props}
      >
        {isEmpty(children) ? EMPTY : children}
      </a>
    </div>
  );
}

export { TableCellText, TableCellStack, TableCellAmount, TableCellDate, TableCellLink };
