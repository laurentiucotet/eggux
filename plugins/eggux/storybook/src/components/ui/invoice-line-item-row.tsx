// EGG UI Invoice Line Item Row. Code only (no Figma component yet); Checkout family.
// One billed line of an invoice or receipt: description (wraps, never cut), an optional detail line
// (period, SKU), "2 x €10.00" for quantity and unit price, and the amount on the right (no wrap,
// tabular digits). Credit = a refund or discount line: the amount in success with a minus sign.
// Rows are list items: wrap them in InvoiceLineItemList (a labelled list). Amounts arrive formatted.
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InvoiceLineItemRowProps extends Omit<React.ComponentProps<'li'>, 'children'> {
  description: string;
  /** Second line: "Mar 1 to Mar 31", "SKU AC-204". */
  detail?: string;
  quantity?: number;
  /** Formatted unit price. Shown with the quantity when both are set. */
  unitPrice?: string;
  /** Line amount, formatted, without sign. */
  amount: string;
  /** A refund or discount line. */
  credit?: boolean;
}

function InvoiceLineItemRow({ description, detail, quantity, unitPrice, amount, credit = false, className, ...props }: InvoiceLineItemRowProps) {
  const showQty = quantity !== undefined && unitPrice !== undefined;
  return (
    <li data-slot="invoice-line-item-row" data-state={credit ? 'credit' : 'default'} className={cn('flex min-w-0 items-start gap-4 py-3', className)} {...props}>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="m-0 text-sm leading-5 font-medium text-foreground [overflow-wrap:anywhere]">{description}</p>
        {detail ? <p className="m-0 text-xs leading-4 text-muted-foreground [overflow-wrap:anywhere]">{detail}</p> : null}
        {showQty ? (
          <p className="m-0 text-xs leading-4 text-muted-foreground tabular-nums">
            <span className="sr-only">Quantity </span>{quantity}<span aria-hidden="true"> x </span><span className="sr-only"> at </span>{unitPrice}
          </p>
        ) : null}
      </div>
      <p className={cn('m-0 shrink-0 text-right text-sm leading-5 font-medium whitespace-nowrap tabular-nums', credit ? 'text-success' : 'text-foreground')}>
        {credit ? <span aria-hidden="true">-</span> : null}
        {credit ? <span className="sr-only">Credit </span> : null}
        {amount}
      </p>
    </li>
  );
}

function InvoiceLineItemList({ className, ...props }: React.ComponentProps<'ul'>) {
  return <ul data-slot="invoice-line-item-list" className={cn('m-0 flex w-full min-w-0 list-none flex-col divide-y divide-border p-0', className)} {...props} />;
}

export { InvoiceLineItemList, InvoiceLineItemRow };
