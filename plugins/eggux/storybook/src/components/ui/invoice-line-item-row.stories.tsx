import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { InvoiceLineItemList, InvoiceLineItemRow } from './invoice-line-item-row';

type Args = { description: string; showDetail: boolean; showQuantity: boolean; credit: boolean; amount: string };

const meta = {
  title: 'Components/Checkout/Invoice Line Item Row',
  parameters: {
    docs: {
      description: {
        component:
          'One billed line of an invoice or receipt: description, detail line, "2 x €10.00" and the amount. The description wraps and the amount never does. A credit line (refund, discount) shows the amount in success with a minus sign. Rows are list items inside InvoiceLineItemList. Code only (no Figma component yet).',
      },
    },
  },
  args: { description: 'Acme Pro plan, 5 seats', showDetail: true, showQuantity: true, credit: false, amount: '€50.00' },
  argTypes: {
    description: { name: 'Description', control: 'text', description: 'What was billed.', table: { category: 'Row' } },
    amount: { name: 'Amount', control: 'text', description: 'Line amount, formatted, without sign.', table: { category: 'Row' } },
    credit: { name: 'Credit line', control: 'boolean', description: 'A refund or discount: success color and a minus sign.', table: { category: 'Row' } },
    showDetail: { name: 'Show detail', control: 'boolean', description: 'The period or SKU under the description.', table: { category: 'Parts' } },
    showQuantity: { name: 'Show quantity and unit price', control: 'boolean', description: '"5 x €10.00" under the detail.', table: { category: 'Parts' } },
  },
  render: ({ description, showDetail, showQuantity, credit, amount }) => (
    <div className="w-96 max-w-full">
      <InvoiceLineItemList aria-label="Invoice lines">
        <InvoiceLineItemRow
          description={description}
          detail={showDetail ? 'Mar 1 to Mar 31' : undefined}
          quantity={showQuantity ? 5 : undefined}
          unitPrice={showQuantity ? '€10.00' : undefined}
          amount={amount}
          credit={credit}
        />
      </InvoiceLineItemList>
    </div>
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('list', { name: 'Invoice lines' })).toBeInTheDocument();
    await expect(canvas.getAllByRole('listitem')).toHaveLength(1);
    const row = canvas.getByRole('listitem');
    await expect(row.textContent).toContain('Quantity 5');
    await expect(row.textContent).toContain('at €10.00');
    await expect(row).toHaveAttribute('data-state', 'default');
  },
};

/** A whole invoice: lines, a discount line and a refund. */
export const Invoice: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="w-[420px] max-w-full">
      <InvoiceLineItemList aria-label="Invoice 2041 lines">
        <InvoiceLineItemRow description="Acme Pro plan, 5 seats" detail="Mar 1 to Mar 31" quantity={5} unitPrice="€10.00" amount="€50.00" />
        <InvoiceLineItemRow description="Extra storage, 100 GB" detail="Mar 1 to Mar 31" quantity={1} unitPrice="€8.00" amount="€8.00" />
        <InvoiceLineItemRow description="Spring offer, 20% off" amount="€11.60" credit />
        <InvoiceLineItemRow description="Refund for February downtime" amount="€4.00" credit />
      </InvoiceLineItemList>
    </div>
  ),
};

/* Hidden checks */

export const CreditCheck: Story = {
  tags: ['!dev'],
  args: { credit: true, amount: '€11.60' },
  play: async ({ canvas }) => {
    const row = canvas.getByRole('listitem');
    await expect(row).toHaveAttribute('data-state', 'credit');
    await expect(row.textContent).toContain('Credit');
    await expect(row.textContent).toContain('€11.60');
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => (
    <InvoiceLineItemList aria-label="Stress lines">
      <InvoiceLineItemRow
        description="Professional services: onboarding workshop for the Verylongdepartmentname-International-Operations team"
        detail="Reference ACME-2041-ONBOARDING-WORKSHOP-EMEA-REGION-0001"
        quantity={12}
        unitPrice="€1,250.00"
        amount="€15,000.00"
      />
    </InvoiceLineItemList>
  ),
  play: async ({ canvas }) => {
    const row = canvas.getByRole('listitem');
    await expect(row.scrollWidth).toBeLessThanOrEqual(row.clientWidth + 1);
    // The amount stays on one line.
    const amount = canvas.getByText('€15,000.00');
    await expect(Math.round(amount.getBoundingClientRect().height)).toBeLessThanOrEqual(20);
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
