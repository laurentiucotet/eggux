import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { PriceTag } from './price-tag';

type Args = { size: 'sm' | 'default' | 'lg'; price: string; onSale: boolean; compareAt: string; showDiscount: boolean; discount: string; showUnit: boolean; unit: string };

const meta = {
  title: 'Components/Checkout/Price Tag',
  parameters: {
    docs: {
      description: {
        component:
          'The price of a product or plan: current price, an old price struck through, a discount badge and a unit. On sale the current price is destructive; screen readers hear "Now €39.00, was €49.00" because the strike-through says nothing to them. Amounts arrive formatted, one currency per page. Code only (no Figma component yet).',
      },
    },
  },
  args: { size: 'default', price: '€39.00', onSale: true, compareAt: '€49.00', showDiscount: true, discount: '-20%', showUnit: false, unit: '/ month' },
  argTypes: {
    size: { name: 'Size', control: 'inline-radio', options: ['sm', 'default', 'lg'], description: 'Text size of the price.', table: { category: 'Price' } },
    price: { name: 'Price', control: 'text', description: 'Current price, formatted.', table: { category: 'Price' } },
    onSale: { name: 'On sale', control: 'boolean', description: 'Shows the old price struck through.', table: { category: 'Price' } },
    compareAt: { name: 'Old price', control: 'text', description: 'The price before the sale.', table: { category: 'Parts' } },
    showDiscount: { name: 'Show discount badge', control: 'boolean', description: 'Badge with the discount, on sale only.', table: { category: 'Parts' } },
    discount: { name: 'Discount text', control: 'text', description: 'Text of the badge.', table: { category: 'Parts' } },
    showUnit: { name: 'Show unit', control: 'boolean', description: 'What the price covers.', table: { category: 'Parts' } },
    unit: { name: 'Unit', control: 'text', description: 'Text of the unit.', table: { category: 'Parts' } },
  },
  render: ({ size, price, onSale, compareAt, showDiscount, discount, showUnit, unit }) => (
    <PriceTag size={size} price={price} compareAt={onSale ? compareAt : undefined} discount={onSale && showDiscount ? discount : undefined} unit={showUnit ? unit : undefined} />
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  play: async ({ canvas }) => {
    const tag = canvas.getByText('€49.00').closest('p')!;
    await expect(tag).toHaveAttribute('data-state', 'sale');
    // Assistive technology gets the words, not the line through.
    await expect(tag.textContent).toContain('Now €39.00');
    await expect(tag.textContent).toContain('was €49.00');
    await expect(canvas.getByText('€49.00').tagName).toBe('DEL');
    await expect(canvas.getByText('-20%')).toBeInTheDocument();
  },
};

/** The three sizes, a regular price and a sale price in each. */
export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-4">
      {(['sm', 'default', 'lg'] as const).map(size => (
        <div key={size} className="flex flex-wrap items-baseline gap-6">
          <PriceTag size={size} price="€39.00" />
          <PriceTag size={size} price="€39.00" compareAt="€49.00" discount="-20%" />
          <PriceTag size={size} price="€12.00" unit="/ month" />
        </div>
      ))}
    </div>
  ),
};

/* Hidden checks */

export const RegularCheck: Story = {
  tags: ['!dev'],
  args: { onSale: false, showUnit: true },
  play: async ({ canvas }) => {
    const tag = canvas.getByText('€39.00').closest('p')!;
    await expect(tag).toHaveAttribute('data-state', 'default');
    await expect(tag.querySelector('del')).toBeNull();
    await expect(tag.textContent).not.toContain('Now');
    await expect(canvas.getByText('/ month')).toBeInTheDocument();
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => <PriceTag size="lg" price="€1,249,999.00" compareAt="€1,499,999.00" discount="-17% this week only" unit="/ month, billed yearly" />,
  play: async ({ canvas }) => {
    const tag = canvas.getByText('€1,249,999.00').closest('p')!;
    // Wraps onto more lines instead of overflowing the column.
    await expect(tag.scrollWidth).toBeLessThanOrEqual(tag.clientWidth + 1);
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
