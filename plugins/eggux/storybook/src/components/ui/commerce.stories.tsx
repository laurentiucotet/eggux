import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { AddressCard, LineItem, MiniCart, OrderRow, PaymentMethodCard, PaymentMethodMark, ProductCard, ShipmentTracker } from './commerce';
import { DropdownMenuItem } from './dropdown-menu';
import { RadioGroup } from './radio';

const meta = {
  title: 'Components/Commerce/Commerce',
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Shop parts. Product Card: vertical (grids), horizontal (lists) and overlay (editorial tiles), with sale and sold-out states and a small size; the name is the link. Line Item for carts (quantity, remove) and summaries; Mini Cart; Order Row for order history; Shipment Tracker; Address Card (pick one in checkout); Payment Method Card and Payment Method Mark (text marks, never real logos). Figma: Commerce page. Guide: eggux build-ui/patterns/commerce.md' } },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();
const onAdd = fn();

function Wish(props: Omit<React.ComponentProps<typeof ProductCard>, 'wished' | 'onWishChange'>) {
  const [w, setW] = React.useState(false);
  return <ProductCard {...props} wished={w} onWishChange={setW} />;
}

// Figma: vertical 264 × 384 (default, sale, sold-out), sm 180 × 284; overlay 264 × 352; horizontal 400 × 120.
export const ProductCards: Story = {
  name: 'Product Card',
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="flex items-start gap-6">
        <Wish name="Linen shirt, relaxed fit" href="#shirt" variantText="Sand · 4 colors" price="€59.00" onAdd={onAdd} />
        <Wish name="Wool coat" href="#coat" variantText="Charcoal · 3 colors" price="€47.20" oldPrice="€59.00" discount="-20%" onAdd={onAdd} />
        <Wish name="Denim jacket" href="#denim" variantText="Indigo" price="€89.00" soldOut onNotify={fn()} />
        <Wish name="Cotton tee" href="#tee" variantText="White" price="€19.00" size="sm" onAdd={onAdd} />
        <Wish name="Silk scarf" href="#scarf" variantText="Sand · 4 colors" price="€47.20" oldPrice="€59.00" discount="-20%" layout="overlay" />
      </div>
      <div className="flex gap-6">
        <ProductCard layout="horizontal" name="Linen shirt, relaxed fit" href="#shirt-h" variantText="Sand · 4 colors" price="€59.00" onAdd={onAdd} />
        <ProductCard layout="horizontal" name="Denim jacket" href="#denim-h" variantText="Indigo" price="€89.00" soldOut onNotify={fn()} />
      </div>
    </div>
  ),
  play: async ({ canvas }) => {
    const cards = canvas.getAllByRole('article');
    await expect(Math.round(box(cards[0]!).width)).toBe(264);
    await expect(Math.round(box(cards[0]!).height)).toBe(384);
    await expect(Math.round(box(cards[3]!).width)).toBe(180);
    await expect(Math.round(box(cards[4]!).height)).toBe(352);
    await expect(Math.round(box(cards[5]!).height)).toBe(120);
    await expect(canvas.getByRole('link', { name: 'Wool coat' })).toHaveAttribute('href', '#coat');
    await expect(cards[1]).toHaveTextContent('-20%');
    await expect(cards[1]).toHaveTextContent('Now €47.20Was €59.00');
    await expect(cards[2]).toHaveTextContent('Sold out');
    await expect(within(cards[2]!).getByRole('button', { name: 'Notify me' })).toBeInTheDocument();
    const save = canvas.getByRole('button', { name: 'Save Linen shirt, relaxed fit' });
    await userEvent.click(save);
    await expect(save).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(within(cards[0]!).getByRole('button', { name: 'Add to cart' }));
    await expect(onAdd).toHaveBeenCalledTimes(1);
    await expect(within(cards[4]!).queryByRole('button', { name: 'Add to cart' })).toBeNull();
  },
};

function Cart() {
  const [qty, setQty] = React.useState(2);
  const [gone, setGone] = React.useState(false);
  return (
    <div className="w-[480px]">
      {!gone ? <LineItem name="Linen shirt, relaxed fit" variant="Sand · M" quantity={qty} total={`€${(qty * 47.2).toFixed(2)}`} onQuantityChange={setQty} onRemove={() => setGone(true)} /> : <p className="m-0 text-sm">Removed.</p>}
      <LineItem layout="summary" name="Wool coat" variant="Charcoal · L" quantity={1} total="€189.00" />
    </div>
  );
}

// Figma: cart 480 × 100 (Number Input sm, Remove), summary 480 × 84 ("Qty 2").
export const LineItems: Story = {
  name: 'Line Item',
  render: () => <Cart />,
  play: async ({ canvas, canvasElement }) => {
    const [cart, summary] = canvasElement.querySelectorAll('[data-slot="line-item"]');
    await expect(Math.round(box(cart!).height)).toBe(100);
    await expect(Math.round(box(summary!).height)).toBe(84);
    await expect(summary).toHaveTextContent('Qty 1');
    await userEvent.click(canvas.getByRole('button', { name: 'Increase quantity of Linen shirt, relaxed fit' }));
    await expect(cart).toHaveTextContent('€141.60');
    await userEvent.click(canvas.getByRole('button', { name: 'Remove Linen shirt, relaxed fit' }));
    await expect(canvas.getByText('Removed.')).toBeInTheDocument();
  },
};

const onCheckout = fn();

// Figma: 360 × 359; two summary items, subtotal, note, View cart / Checkout.
export const Mini: Story = {
  name: 'Mini Cart',
  render: () => (
    <MiniCart
      items={[{ name: 'Linen shirt, relaxed fit', variant: 'Sand · M', quantity: 2, total: '€94.40' }, { name: 'Wool coat', variant: 'Charcoal · L', quantity: 1, total: '€189.00' }]}
      subtotal="€283.40"
      cartHref="#cart"
      onCheckout={onCheckout}
      onClose={fn()}
    />
  ),
  play: async ({ canvas }) => {
    const cart = canvas.getByRole('region', { name: 'Cart (3 items)' });
    await expect(Math.round(box(cart).width)).toBe(360);
    await expect(Math.abs(Math.round(box(cart).height) - 359)).toBeLessThanOrEqual(2);
    await expect(cart).toHaveTextContent('Subtotal€283.40');
    await expect(canvas.getByRole('link', { name: 'View cart' })).toHaveAttribute('href', '#cart');
    await userEvent.click(canvas.getByRole('button', { name: 'Checkout' }));
    await expect(onCheckout).toHaveBeenCalled();
    await expect(canvas.getByRole('button', { name: 'Close cart' })).toBeInTheDocument();
  },
};

// Figma: 720 × 63 rows, status badges for every status, selected row.
export const Orders: Story = {
  name: 'Order Row',
  render: () => (
    <nav aria-label="Orders" className="w-[720px]">
      <OrderRow href="#o1" number="Order #10482" meta="12 Nov 2026 · 3 items" status="shipped" total="€112.40" selected />
      <OrderRow href="#o2" number="Order #10477" meta="2 Nov 2026 · 1 item" status="processing" total="€59.00" />
      <OrderRow href="#o3" number="Order #10461" meta="18 Oct 2026 · 2 items" status="delivered" total="€148.00" />
      <OrderRow href="#o4" number="Order #10422" meta="1 Oct 2026 · 1 item" status="cancelled" total="€19.00" />
      <OrderRow href="#i1" number="Invoice INV-2042" meta="1 Oct 2026" status="paid" total="€240.00" />
      <OrderRow href="#i2" number="Invoice INV-2031" meta="1 Sep 2026" status="refunded" total="€240.00" />
    </nav>
  ),
  play: async ({ canvas }) => {
    const first = canvas.getByRole('link', { name: /Order #10482/ });
    await expect(Math.round(box(first).height)).toBe(63);
    await expect(first).toHaveAttribute('aria-current', 'page');
    await expect(first).toHaveTextContent('Shipped€112.40');
    await expect(canvas.getByRole('link', { name: /INV-2031/ })).toHaveTextContent('Refunded');
  },
};

// Figma: 640 × 144; ETA, carrier, Track on DHL, 4 steps (2 done, out for delivery current).
export const Tracker: Story = {
  name: 'Shipment Tracker',
  render: () => (
    <ShipmentTracker
      eta="Arriving Thursday, 14 Nov"
      carrier="DHL · 1Z999AA10123456784"
      trackUrl="#dhl"
      trackLabel="Track on DHL"
      current={2}
      steps={[
        { id: 'ordered', title: 'Ordered', description: '10 Nov, 14:02' },
        { id: 'shipped', title: 'Shipped', description: '11 Nov, 09:40' },
        { id: 'out', title: 'Out for delivery', description: '14 Nov, 07:15' },
        { id: 'delivered', title: 'Delivered', description: 'Expected by 18:00' },
      ]}
    />
  ),
  play: async ({ canvas }) => {
    const t = canvas.getByRole('region', { name: 'Arriving Thursday, 14 Nov' });
    await expect(Math.round(box(t).width)).toBe(640);
    await expect(Math.abs(Math.round(box(t).height) - 144)).toBeLessThanOrEqual(4);
    await expect(canvas.getByRole('link', { name: /Track on DHL/ })).toHaveAttribute('target', '_blank');
    await expect(canvas.getByRole('list', { name: 'Shipment progress' })).toHaveTextContent('Out for delivery');
  },
};

function Addresses() {
  const [v, setV] = React.useState('home');
  return (
    <RadioGroup value={v} onValueChange={setV} aria-label="Delivery address" className="flex gap-4">
      <AddressCard value="home" selected={v === 'home'} name="Elena Popa" isDefault lines={['Strada Exemplu 12, Floor 3', '010101 Bucharest, Romania', '+40 712 345 678']} onEdit={fn()} onRemove={fn()} />
      <AddressCard value="office" selected={v === 'office'} name="Elena Popa (office)" lines={['Bulevardul Unirii 1', '030167 Bucharest, Romania', '+40 721 000 111']} onEdit={fn()} onRemove={fn()} />
    </RadioGroup>
  );
}

// Figma: 320 wide, default 154, selected 156 (2 px primary); a radio group in checkout.
export const AddressCards: Story = {
  name: 'Address Card',
  render: () => <Addresses />,
  play: async ({ canvas, canvasElement }) => {
    const cards = canvasElement.querySelectorAll('[data-slot="address-card"]');
    await expect(Math.round(box(cards[0]!).width)).toBe(320);
    await expect(Math.abs(Math.round(box(cards[0]!).height) - 156)).toBeLessThanOrEqual(2);
    await expect(canvas.getByRole('radio', { name: 'Elena Popa' })).toBeChecked();
    await userEvent.click(canvas.getByRole('radio', { name: 'Elena Popa (office)' }));
    await expect(cards[1]).toHaveAttribute('data-state', 'selected');
    await expect(canvas.getByRole('button', { name: 'Edit address of Elena Popa' })).toBeInTheDocument();
  },
};

// Figma: 400 × 64 cards (default, expired with Update) and 24 high text marks.
export const Payments: Story = {
  name: 'Payment Method Card and Mark',
  render: () => (
    <div className="flex flex-col gap-4">
      <PaymentMethodCard brand="VISA" label="Visa ending in 4242" expiry="Expires 08/28" isDefault menu={<><DropdownMenuItem>Make default</DropdownMenuItem><DropdownMenuItem variant="destructive">Remove</DropdownMenuItem></>} />
      <PaymentMethodCard brand="MC" label="Mastercard ending in 4444" expiry="Expired 08/25" expired onUpdate={fn()} menu={<DropdownMenuItem variant="destructive">Remove</DropdownMenuItem>} />
      <ul aria-label="We accept" className="m-0 flex list-none gap-2 p-0">
        {['Visa', 'Mastercard', 'PayPal', 'Apple Pay', 'Klarna', 'SEPA'].map(n => <li key={n}><PaymentMethodMark name={n} /></li>)}
      </ul>
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    const cards = canvasElement.querySelectorAll('[data-slot="payment-method-card"]');
    await expect(Math.round(box(cards[0]!).height)).toBe(64);
    await expect(cards[1]).toHaveTextContent('Expired 08/25');
    await expect(canvas.getByRole('button', { name: 'Update Mastercard ending in 4444' })).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: 'More actions for Visa ending in 4242' }));
    await expect(await within(document.body).findByRole('menuitem', { name: 'Make default' })).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    const mark = canvasElement.querySelector('[data-slot="payment-method-mark"]')!;
    await expect(Math.round(box(mark).height)).toBe(24);
    await expect(canvas.getByRole('list', { name: 'We accept' }).querySelectorAll('li')).toHaveLength(6);
  },
};

// Narrow and long text. Tests only.
export const EdgeCases: Story = {
  tags: ['!dev'],
  render: () => (
    <div className="flex flex-col gap-4">
      <ProductCard name="An extremely long product name that goes on and on past the card" href="#x" variantText="A very long variant text with many colors" price="€1,299.00" oldPrice="€1,599.00" discount="-19%" onAdd={fn()} />
      <div className="w-[320px]"><OrderRow href="#n" number="Order #1048200001" meta="12 Nov 2026 · 30 items" status="processing" total="€12,112.40" /></div>
      <div className="w-[320px]"><PaymentMethodCard brand="AMEX" label="American Express ending in 0005" expiry="Expired 01/24" expired onUpdate={fn()} /></div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const el of canvasElement.querySelectorAll('[data-slot="order-row"], [data-slot="payment-method-card"]')) await expect(el.scrollWidth).toBeLessThanOrEqual(320);
  },
};

const All = () => (
  <div className="flex flex-col gap-8">
    <div className="flex gap-6">
      <ProductCard name="Wool coat" href="#coat" variantText="Charcoal" price="€47.20" oldPrice="€59.00" discount="-20%" onAdd={() => {}} />
      <ProductCard layout="overlay" name="Silk scarf" href="#scarf" variantText="Sand" price="€39.00" />
      <MiniCart items={[{ name: 'Linen shirt', variant: 'Sand · M', quantity: 2, total: '€94.40' }]} subtotal="€94.40" cartHref="#cart" />
    </div>
    <div className="w-[720px]"><OrderRow href="#o" number="Order #10482" meta="12 Nov 2026" status="delivered" total="€112.40" selected /></div>
    <PaymentMethodCard brand="MC" label="Mastercard ending in 4444" expiry="Expired 08/25" expired onUpdate={() => {}} />
  </div>
);
export const AllDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' }, render: () => <All /> };
export const AllCorporate: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' }, render: () => <All /> };
