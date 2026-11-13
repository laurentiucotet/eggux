// EGG UI Credit Card Preview. Code only (no Figma component yet); Checkout family.
// A card face that follows the form: brand mark, chip, number, holder name and expiry. Number is
// shown masked by default (four dots groups and the last four digits); with `masked={false}` the
// digits typed so far show, grouped by four, the rest as dots. Empty values show placeholders
// ("FULL NAME", "MM/YY"). 1.586 : 1 like a real card, never wider than 340 px, text truncates.
// Decoration only: it is one image for assistive technology ("Visa card ending 4242, Ada Lovelace,
// expires 08/28"), so the form fields stay the real controls. Never feed it real card data in demos
// or logs: the Storybook examples use the test number 4242 4242 4242 4242 pattern only.
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface CreditCardPreviewProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  /** Digits typed so far (spaces ignored, at most 19). */
  number?: string;
  /** Holder name as typed. */
  name?: string;
  /** Expiry as typed: "08/28". */
  expiry?: string;
  /** Text mark of the brand: "VISA". Empty shows no mark. */
  brand?: string;
  /** Show only the last four digits. Default true. */
  masked?: boolean;
  /** Muted look for a card that cannot be used. */
  inactive?: boolean;
}

function groupDigits(digits: string, masked: boolean): string[] {
  const total = 16;
  const padded = digits.slice(0, total);
  const groups: string[] = [];
  for (let g = 0; g < 4; g++) {
    const chunk = padded.slice(g * 4, g * 4 + 4);
    const isLast = g === 3;
    if (masked && padded.length >= 4) {
      groups.push(isLast ? padded.slice(-4).padEnd(4, '•') : '••••');
    } else {
      groups.push(chunk.padEnd(4, '•'));
    }
  }
  return groups;
}

function CreditCardPreview({ number = '', name = '', expiry = '', brand = '', masked = true, inactive = false, className, ...props }: CreditCardPreviewProps) {
  const digits = number.replace(/\D/g, '').slice(0, 19);
  const groups = groupDigits(digits, masked);
  const last4 = digits.length >= 4 ? digits.slice(-4) : null;
  const label = [
    `${brand ? `${brand.charAt(0)}${brand.slice(1).toLowerCase()} ` : ''}card`,
    last4 ? `ending ${last4}` : 'number not entered',
    name || null,
    expiry ? `expires ${expiry}` : null,
  ].filter(Boolean).join(', ');
  return (
    <div
      role="img"
      aria-label={label}
      data-slot="credit-card-preview"
      data-state={inactive ? 'inactive' : 'default'}
      className={cn(
        'relative flex aspect-[1.586] w-[340px] min-w-0 max-w-full flex-col justify-between overflow-hidden rounded-xl bg-primary p-5 text-primary-foreground shadow-lg',
        inactive && 'opacity-60',
        className,
      )}
      {...props}
    >
      <div aria-hidden="true" className="pointer-events-none absolute -top-12 -right-12 size-40 rounded-full bg-primary-foreground/10" />
      <div aria-hidden="true" className="flex items-center justify-between gap-3">
        <span className="h-7 w-10 shrink-0 rounded-md border border-primary-foreground/40 bg-primary-foreground/20" />
        <span className="min-w-0 truncate text-sm leading-5 font-semibold tracking-widest">{brand}</span>
      </div>
      <div aria-hidden="true" className="flex min-w-0 flex-col gap-3">
        <span className="truncate font-mono text-base leading-6 font-medium tracking-wider whitespace-nowrap tabular-nums">{groups.join(' ')}</span>
        <div className="flex min-w-0 items-end justify-between gap-3">
          <span className="flex min-w-0 flex-col">
            <span className="text-[10px] leading-3 tracking-wider uppercase">Card holder</span>
            <span className="truncate text-sm leading-5 font-medium uppercase">{name || 'Full name'}</span>
          </span>
          <span className="flex shrink-0 flex-col items-end">
            <span className="text-[10px] leading-3 tracking-wider uppercase">Expires</span>
            <span className="text-sm leading-5 font-medium tabular-nums">{expiry || 'MM/YY'}</span>
          </span>
        </div>
      </div>
    </div>
  );
}

export { CreditCardPreview };
