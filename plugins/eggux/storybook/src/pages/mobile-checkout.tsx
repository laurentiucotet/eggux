import * as React from 'react';
import { Alert } from '@/components/ui/alert';
import { BottomActionBar } from '@/components/ui/bottom-action-bar';
import { Button } from '@/components/ui/button';
import { CouponInput } from '@/components/ui/coupon-input';
import { MobileHeader } from '@/components/ui/mobile-header';
import { OrderSummary } from '@/components/ui/order-summary';
import { PaymentMethodOption, PaymentMethodOptionGroup } from '@/components/ui/payment-method-option';
import { ShippingOption, ShippingOptionGroup } from '@/components/ui/shipping-option';
import { PhoneScreen } from './mobile-parts';

/** The only valid discount code of the demo: 10 percent off the items. */
export const demoCoupon = 'SAVE10';

const items = [
  { name: 'Merino sweater', variant: 'Sand · M', quantity: 1, cents: 12900 },
  { name: 'Canvas tote', variant: 'Natural', quantity: 2, cents: 11000 },
];
const shippingMethods = [
  { value: 'standard', name: 'Acme Post · Standard', estimate: 'Arrives Tue 18 to Thu 20 Nov', cents: 900 },
  { value: 'express', name: 'Acme Post · Express', estimate: 'Arrives Mon 17 Nov', cents: 1900, badge: 'Fastest' },
  { value: 'pickup', name: 'Pick up in store', estimate: 'Ready Mon 17 Nov, Strada Lipscani 12', cents: 0 },
];

const euro = (cents: number) => `€${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export interface MobileCheckoutPageProps {
  initialShipping?: string;
  initialPayment?: string;
  /** Start with the coupon applied. */
  initialCoupon?: boolean;
  /** Start with the order summary open. */
  initialSummaryOpen?: boolean;
  /** Start after the payment went through. */
  initialPaid?: boolean;
}

/** Checkout on a phone: the order, delivery, payment and a code, with the total and Pay in a Bottom Action Bar. */
export function MobileCheckoutPage({ initialShipping = 'standard', initialPayment = 'visa', initialCoupon = false, initialSummaryOpen = false, initialPaid = false }: MobileCheckoutPageProps) {
  const [shipping, setShipping] = React.useState(initialShipping);
  const [payment, setPayment] = React.useState(initialPayment);
  const [coupon, setCoupon] = React.useState(initialCoupon ? demoCoupon : '');
  const [couponError, setCouponError] = React.useState('');
  const [state, setState] = React.useState<'idle' | 'paying' | 'paid'>(initialPaid ? 'paid' : 'idle');

  const subtotal = items.reduce((a, i) => a + i.cents, 0);
  const discount = coupon ? Math.round(subtotal * 0.1) : 0;
  const method = shippingMethods.find(s => s.value === shipping) ?? shippingMethods[0]!;
  const total = subtotal - discount + method.cents;

  const pay = () => {
    setState('paying');
    window.setTimeout(() => setState('paid'), 400);
  };

  const header = <MobileHeader type="detail" title="Checkout" backLabel="Back to cart" />;

  if (state === 'paid') {
    return (
      <PhoneScreen header={header}>
        <Alert variant="success" title="Payment received" description={`${euro(total)} paid. A receipt is on its way to ana@acme.com. Your order arrives: ${method.estimate.replace(/^Arrives |^Ready /, '')}.`} />
      </PhoneScreen>
    );
  }

  return (
    <PhoneScreen
      header={header}
      className="px-4 pt-4 pb-6"
      footer={
        <BottomActionBar label="Pay" summaryLabel="Total" summaryValue={euro(total)}>
          <Button type="button" className="min-h-11" loading={state === 'paying'} onClick={pay}>
            Pay {euro(total)}
          </Button>
        </BottomActionBar>
      }
    >
      <div className="flex flex-col gap-6">
        <OrderSummary
          collapse="always"
          defaultOpen={initialSummaryOpen}
          className="w-full"
          items={items.map(i => ({ name: i.name, variant: i.variant, quantity: i.quantity, total: euro(i.cents) }))}
          subtotal={euro(subtotal)}
          discount={discount ? euro(discount) : undefined}
          discountLabel={`Discount (${coupon})`}
          shipping={method.cents ? euro(method.cents) : 'Free'}
          total={euro(total)}
          currency="EUR"
        />

        <div className="flex flex-col gap-3">
          <h2 className="m-0 text-base leading-6 font-semibold">Delivery</h2>
          <ShippingOptionGroup aria-label="Delivery method" value={shipping} onValueChange={setShipping}>
            {shippingMethods.map(s => (
              <ShippingOption key={s.value} value={s.value} name={s.name} estimate={s.estimate} price={s.cents ? euro(s.cents) : 'Free'} badge={s.badge} className="max-w-none" />
            ))}
          </ShippingOptionGroup>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="m-0 text-base leading-6 font-semibold">Payment</h2>
          <PaymentMethodOptionGroup aria-label="Payment method" value={payment} onValueChange={setPayment}>
            <PaymentMethodOption value="visa" brand="VISA" label="Visa ending in 4242" expiry="Expires 08/28" isDefault className="max-w-none" />
            <PaymentMethodOption value="mc" brand="MC" label="Mastercard ending in 5555" expiry="Expires 11/29" className="max-w-none" />
            <PaymentMethodOption value="old" brand="VISA" label="Visa ending in 0019" expiry="Expired 08/25" expired className="max-w-none" />
          </PaymentMethodOptionGroup>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="m-0 text-base leading-6 font-semibold">Discount</h2>
          <CouponInput
            className="max-w-none"
            applied={coupon || undefined}
            appliedDescription="10% off your items"
            error={couponError || undefined}
            onValueChange={() => setCouponError('')}
            onApply={code => {
              if (code.toUpperCase() === demoCoupon) {
                setCoupon(demoCoupon);
                setCouponError('');
              } else {
                setCouponError('This code is not valid. Check it and try again.');
              }
            }}
            onRemove={() => setCoupon('')}
          />
        </div>
      </div>
    </PhoneScreen>
  );
}
