import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';
import { OrderSummary, type OrderSummaryItem } from './order-summary';

type Args = {
  collapse: 'mobile' | 'always' | 'never';
  showItems: boolean;
  showDiscount: boolean;
  showShipping: boolean;
  showTax: boolean;
  showCurrency: boolean;
  width: number;
};

const items: OrderSummaryItem[] = [
  { name: 'Linen shirt', variant: 'Sand · M', quantity: 2, total: '€118.00' },
  { name: 'Canvas tote', variant: 'Natural', quantity: 1, total: '€24.00' },
];

const meta = {
  title: 'Components/Checkout/Order Summary',
  parameters: {
    docs: {
      description: {
        component:
          'The money side of checkout: items, subtotal, discount, shipping, tax and the total, built on Summary Row. Below 768 px it collapses to a "Show order summary" button that carries the total; the same toggle can be forced at every width or turned off. The button has aria-expanded and aria-controls. Code only (no Figma component yet).',
      },
    },
  },
  args: { collapse: 'always', showItems: true, showDiscount: true, showShipping: true, showTax: true, showCurrency: false, width: 384 },
  argTypes: {
    collapse: { name: 'Collapse', control: 'inline-radio', options: ['mobile', 'always', 'never'], description: 'mobile = toggle below 768 px; always = toggle at every width; never = no toggle.', table: { category: 'Summary' } },
    width: { name: 'Width', control: { type: 'range', min: 240, max: 480, step: 8 }, description: 'Width of the panel in px.', table: { category: 'Summary' } },
    showItems: { name: 'Show items', control: 'boolean', description: 'List the items above the rows.', table: { category: 'Parts' } },
    showDiscount: { name: 'Show discount', control: 'boolean', description: 'A discount row in success.', table: { category: 'Parts' } },
    showShipping: { name: 'Show shipping amount', control: 'boolean', description: 'Off = not chosen yet.', table: { category: 'Parts' } },
    showTax: { name: 'Show tax', control: 'boolean', description: 'A tax row.', table: { category: 'Parts' } },
    showCurrency: { name: 'Show currency', control: 'boolean', description: 'Currency code next to the total.', table: { category: 'Parts' } },
  },
  render: ({ collapse, showItems, showDiscount, showShipping, showTax, showCurrency, width }) => (
    <OrderSummary
      key={collapse}
      style={{ width }}
      collapse={collapse}
      items={showItems ? items : []}
      subtotal="€142.00"
      discount={showDiscount ? '€28.40' : undefined}
      discountLabel="Discount (SPRING20)"
      shipping={showShipping ? 'Free' : undefined}
      tax={showTax ? '€21.52' : undefined}
      total="€113.60"
      currency={showCurrency ? 'EUR' : undefined}
    />
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  play: async ({ canvas }) => {
    const toggle = canvas.getByRole('button', { name: /Show order summary/ });
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(toggle).toHaveTextContent('€113.60');
    await expect(canvas.queryByText('Subtotal')).not.toBeVisible();
    await userEvent.click(toggle);
    await waitFor(() => expect(canvas.getByRole('button', { name: /Hide order summary/ })).toHaveAttribute('aria-expanded', 'true'));
    await expect(canvas.getByText('Subtotal')).toBeVisible();
    await expect(canvas.getByText('Discount (SPRING20)')).toBeVisible();
    await expect(canvas.getByText('-€28.40')).toBeVisible();
    await expect(canvas.getByText('Linen shirt')).toBeVisible();
    // Keyboard: Enter on the focused toggle closes it again.
    canvas.getByRole('button', { name: /Hide order summary/ }).focus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(canvas.getByRole('button', { name: /Show order summary/ })).toHaveAttribute('aria-expanded', 'false'));
  },
};

/** Always open, no toggle: the version for the side of a wide checkout page. */
export const Static: Story = {
  args: { collapse: 'never', showCurrency: true },
};

export const StaticCheck: Story = {
  tags: ['!dev'],
  args: { collapse: 'never', showShipping: false },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('button')).toBeNull();
    await expect(canvas.getByRole('region', { name: 'Order summary' })).toBeInTheDocument();
    await expect(canvas.getByText('Calculated at the next step')).toBeVisible();
    await expect(canvas.getByText('Total')).toBeVisible();
  },
};

export const MobileCheck: Story = {
  tags: ['!dev'],
  args: { collapse: 'mobile' },
  play: async ({ canvas }) => {
    // Under 768 px the toggle shows and the rows are hidden; from 768 px the reverse. Either way one
    // of the two is true and the total is always reachable.
    const toggle = canvas.getByRole('button', { name: /order summary/, hidden: true });
    const wide = window.matchMedia('(min-width: 768px)').matches;
    if (wide) {
      await expect(toggle).not.toBeVisible();
      await expect(canvas.getByText('Subtotal')).toBeVisible();
    } else {
      await expect(toggle).toBeVisible();
      await expect(canvas.getByText('Subtotal')).not.toBeVisible();
    }
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => (
    <OrderSummary
      className="w-full"
      collapse="always"
      defaultOpen
      items={[{ name: 'Handwoven linen shirt with extra long sleeves and mother of pearl buttons', variant: 'Natural undyed sand · Extra large tall', quantity: 12, total: '€1,418.00' }]}
      subtotal="€1,418.00"
      discount="€283.60"
      discountLabel="Discount (WELCOME-FRIENDS-AND-FAMILY-2026)"
      shipping="€4,999.90"
      tax="€215.20"
      total="€6,349.50"
      currency="EUR"
    />
  ),
  play: async ({ canvas }) => {
    const panel = canvas.getByRole('region', { name: 'Order summary' });
    await expect(panel.scrollWidth).toBeLessThanOrEqual(panel.clientWidth + 1);
    await expect(canvas.getByText('€6,349.50')).toBeVisible();
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
