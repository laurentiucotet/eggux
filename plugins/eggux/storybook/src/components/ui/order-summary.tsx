// EGG UI Order Summary. Code only (no Figma component yet); Checkout family.
// The money side of checkout: the items (name, variant, quantity, line total), then Summary Rows
// for subtotal, discount (success, minus), shipping, tax and the total. Built on Summary Row.
// Collapse (mobile, always, never): below 768 px a header button "Show order summary" with the total
// opens the details (aria-expanded, aria-controls); from 768 px up they are always open.
// "always" keeps the toggle at every width, "never" has no toggle. The total is spoken in the
// button too, so the price is known while the list is closed. Amounts arrive formatted, same currency.
import * as React from 'react';
import { ChevronDown } from '@/components/icons';
import { cn } from '@/lib/utils';
import { SummaryList, SummaryRow } from './summary-row';

export interface OrderSummaryItem {
  name: string;
  /** "Sand · M". */
  variant?: string;
  quantity: number;
  /** Line total, formatted. */
  total: string;
}

export interface OrderSummaryProps extends Omit<React.ComponentProps<'section'>, 'children' | 'title'> {
  title?: string;
  items?: OrderSummaryItem[];
  subtotal: string;
  /** Discount amount, formatted, without sign. Shown in success with a minus sign. */
  discount?: string;
  /** Label of the discount row: "Discount (SPRING20)". */
  discountLabel?: string;
  /** Shipping, formatted, or text such as "Free". Omit when not chosen yet. */
  shipping?: string;
  /** Text shown instead of the shipping amount when it is not known yet. */
  shippingPending?: string;
  tax?: string;
  total: string;
  /** Currency code shown next to the total: "EUR". */
  currency?: string;
  collapse?: 'mobile' | 'always' | 'never';
  /** Start open (when collapsible). */
  defaultOpen?: boolean;
}

function OrderSummary({
  title = 'Order summary',
  items = [],
  subtotal,
  discount,
  discountLabel = 'Discount',
  shipping,
  shippingPending = 'Calculated at the next step',
  tax,
  total,
  currency,
  collapse = 'mobile',
  defaultOpen = false,
  className,
  ...props
}: OrderSummaryProps) {
  const id = React.useId();
  const [open, setOpen] = React.useState(defaultOpen);
  const contentId = `${id}-content`;
  const collapsible = collapse !== 'never';
  const count = items.reduce((a, i) => a + i.quantity, 0);
  const totalText = currency ? `${total} ${currency}` : total;

  return (
    <section
      data-slot="order-summary"
      data-collapse={collapse}
      data-state={collapsible ? (open ? 'open' : 'closed') : 'static'}
      aria-label={title}
      className={cn('flex w-96 min-w-0 max-w-full flex-col rounded-xl border border-border bg-card text-card-foreground', className)}
      {...props}
    >
      {collapsible ? (
        <h2 className={cn('m-0 text-base font-medium', collapse === 'mobile' && 'md:hidden')}>
          <button
            type="button"
            aria-expanded={open}
            aria-controls={contentId}
            onClick={() => setOpen(o => !o)}
            className="flex w-full min-w-0 items-center gap-2 rounded-xl px-4 py-3 text-left outline-none focus-visible:shadow-[0_0_0_2px_var(--background),0_0_0_4px_var(--ring)]"
          >
            <span className="min-w-0 flex-1 truncate text-sm leading-5 font-medium">
              {open ? 'Hide' : 'Show'} {title.toLowerCase()}
              {count ? <span className="font-normal text-muted-foreground"> ({count} {count === 1 ? 'item' : 'items'})</span> : null}
            </span>
            <span className="shrink-0 text-sm leading-5 font-semibold whitespace-nowrap tabular-nums">{totalText}</span>
            <ChevronDown aria-hidden="true" className={cn('size-4 shrink-0 text-muted-foreground motion-safe:transition-transform motion-safe:duration-[var(--duration-fast)]', open && 'rotate-180')} />
          </button>
        </h2>
      ) : null}
      {collapse === 'mobile' ? <h2 className="m-0 hidden px-4 pt-4 text-base leading-6 font-medium md:block">{title}</h2> : null}
      {!collapsible ? <h2 className="m-0 px-4 pt-4 text-base leading-6 font-medium">{title}</h2> : null}
      <div
        id={contentId}
        data-slot="order-summary-content"
        className={cn(
          'flex min-w-0 flex-col gap-4 px-4 pt-4 pb-4',
          collapse === 'mobile' && 'md:pt-2',
          !open && collapse === 'always' && 'hidden',
          !open && collapse === 'mobile' && 'hidden md:flex',
          open && collapsible && 'border-t border-border',
          collapse === 'mobile' && 'md:border-t-0',
        )}
      >
        {items.length ? (
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            {items.map(item => (
              <li key={item.name + (item.variant ?? '')} className="flex min-w-0 items-start gap-3">
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="text-sm leading-5 font-medium text-foreground [overflow-wrap:anywhere]">{item.name}</span>
                  <span className="text-xs leading-4 text-muted-foreground [overflow-wrap:anywhere]">
                    {[item.variant, `Qty ${item.quantity}`].filter(Boolean).join(' · ')}
                  </span>
                </div>
                <span className="shrink-0 text-sm leading-5 font-medium whitespace-nowrap text-foreground tabular-nums">{item.total}</span>
              </li>
            ))}
          </ul>
        ) : null}
        <SummaryList>
          <SummaryRow label="Subtotal" value={subtotal} />
          {discount ? <SummaryRow label={discountLabel} value={`-${discount}`} variant="discount" /> : null}
          <SummaryRow label="Shipping" value={shipping ?? shippingPending} />
          {tax ? <SummaryRow label="Tax" value={tax} /> : null}
          <SummaryRow label={currency ? `Total (${currency})` : 'Total'} value={total} variant="total" />
        </SummaryList>
      </div>
    </section>
  );
}

export { OrderSummary };
