// EGG UI Price Tag. Code only (no Figma component yet); Checkout family.
// The price of a product or plan: the current price, an optional old price struck through, an
// optional discount badge and an optional unit ("/ month"). Size (sm, default, lg). On sale the
// current price is destructive, as in Product Card. Screen readers hear "Now €39.00, was €49.00":
// the strike-through alone says nothing to them. Amounts arrive formatted, one currency per page.
import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Badge } from './badge';

const priceVariants = cva('font-semibold tracking-tight tabular-nums', {
  variants: {
    size: {
      sm: 'text-sm leading-5',
      default: 'text-base leading-6',
      lg: 'text-2xl leading-8',
    },
  },
  defaultVariants: { size: 'default' },
});

export interface PriceTagProps extends Omit<React.ComponentProps<'p'>, 'children'> {
  /** Current price, formatted: "€39.00". */
  price: string;
  /** Old price, formatted. Turns the tag into a sale tag. */
  compareAt?: string;
  /** Discount badge text: "-20%". Needs `compareAt` to make sense. */
  discount?: string;
  /** What the price covers: "/ month", "per night". */
  unit?: string;
  size?: 'sm' | 'default' | 'lg';
}

function PriceTag({ price, compareAt, discount, unit, size = 'default', className, ...props }: PriceTagProps) {
  const sale = Boolean(compareAt);
  return (
    <p data-slot="price-tag" data-state={sale ? 'sale' : 'default'} className={cn('m-0 flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1', className)} {...props}>
      <span className={cn(priceVariants({ size }), 'whitespace-nowrap', sale ? 'text-destructive' : 'text-foreground')}>
        {sale ? <span className="sr-only">Now </span> : null}
        {price}
      </span>
      {unit ? <span className="text-xs leading-4 text-muted-foreground">{unit}</span> : null}
      {compareAt ? (
        <span className="text-sm leading-5 whitespace-nowrap text-muted-foreground tabular-nums">
          <span className="sr-only">, was </span>
          <del>{compareAt}</del>
        </span>
      ) : null}
      {discount ? <Badge variant="destructive">{discount}</Badge> : null}
    </p>
  );
}

export { PriceTag };
