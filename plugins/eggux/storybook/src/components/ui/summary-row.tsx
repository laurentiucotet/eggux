// EGG UI Summary Row. Figma: Summary Row (Description List page, "Summary Row / Component",
// 406:1704). Variant (default, discount, total). One line of a money breakdown: label left (body/
// small muted), amount right (foreground, no wrap), 16 gap, one baseline. Discount: the amount in
// success with a minus sign. Total: label ui/label, amount heading/h4 (20/28), 8 px top padding.
// Amounts use the same format and currency in every row.
// Semantics: rows are dt / dd pairs, so wrap them in a <dl> (SummaryList). A <dl> cannot hold a
// Separator, so the total draws the line itself as a top border (Figma: a Separator above it).
import * as React from 'react';
import { cn } from '@/lib/utils';

export type SummaryRowVariant = 'default' | 'discount' | 'total';

export interface SummaryRowProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  label: React.ReactNode;
  value: string;
  variant?: SummaryRowVariant;
}

function SummaryList({ className, ...props }: React.ComponentProps<'dl'>) {
  return <dl data-slot="summary-list" className={cn('m-0 flex min-w-0 flex-col gap-3', className)} {...props} />;
}

function SummaryRow({ label, value, variant = 'default', className, ...props }: SummaryRowProps) {
  const total = variant === 'total';
  return (
    <div data-slot="summary-row" data-variant={variant} className={cn('flex min-w-0 items-baseline gap-4', total && 'border-t border-border pt-2', className)} {...props}>
      <dt className={cn('min-w-0 flex-1 text-sm leading-5 [overflow-wrap:anywhere]', total ? 'font-medium text-foreground' : 'text-muted-foreground')}>{label}</dt>
      <dd
        className={cn(
          'm-0 shrink-0 text-right whitespace-nowrap tabular-nums',
          total ? 'text-xl leading-7 font-semibold tracking-tight text-foreground' : 'text-sm leading-5',
          variant === 'default' && 'text-foreground',
          variant === 'discount' && 'text-success',
        )}
      >
        {value}
      </dd>
    </div>
  );
}

export { SummaryList, SummaryRow };
