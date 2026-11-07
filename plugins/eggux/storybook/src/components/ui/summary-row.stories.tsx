import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { SummaryList, SummaryRow } from './summary-row';

const meta = {
  title: 'Components/Description List/Summary Row',
  component: SummaryRow,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'One line of a money breakdown: label left, amount right (order summary, invoice totals, price calculator, plan cost). default for lines, discount for reductions (success, with a minus sign), total for the last line with a Separator above. Same number format and currency in every row. Record details that are not amounts use Description List Item. Figma: Description List page / Summary Row.' } },
  },
  args: { label: 'Subtotal', value: '€95.00' },
  render: () => (
    <SummaryList className="w-[336px]">
      <SummaryRow label="Subtotal" value="€95.00" />
      <SummaryRow label="Discount (SPRING10)" value="−€9.50" variant="discount" />
      <SummaryRow label="VAT (19%)" value="€16.25" />
      <SummaryRow label="Total" value="€101.75" variant="total" />
    </SummaryList>
  ),
} satisfies Meta<typeof SummaryRow>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();

// Figma: default 20 high, discount in success, total with a top line and the amount at 20 px; amounts right-aligned.
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const rows = canvasElement.querySelectorAll<HTMLElement>('[data-slot="summary-row"]');
    await expect(Math.round(box(rows[0]!).height)).toBe(20);
    // 36 plus the 1 px top border that stands in for the Separator.
    await expect(Math.round(box(rows[3]!).height)).toBe(37);
    await expect(getComputedStyle(rows[3]!).borderTopWidth).toBe('1px');
    const amounts = Array.from(rows).map(r => Math.round(box(r.querySelector('dd')!).right));
    await expect(new Set(amounts).size).toBe(1);
    await expect(getComputedStyle(rows[1]!.querySelector('dd')!).color).not.toBe(getComputedStyle(rows[0]!.querySelector('dd')!).color);
  },
};

// Stress: a long label wraps, the amount stays on one line at 240. Tests only.
export const Stress: Story = {
  tags: ['!dev'],
  render: () => (
    <SummaryList className="w-[240px]">
      <SummaryRow label="Shipping to Cluj-Napoca, express courier, insured" value="€1,249,000.00" />
    </SummaryList>
  ),
  play: async ({ canvasElement }) => {
    const row = canvasElement.querySelector('[data-slot="summary-row"]')!;
    await expect(box(row).height).toBeGreaterThan(20);
    await expect(Math.round(box(row.querySelector('dd')!).height)).toBe(20);
  },
};

export const DefaultDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' } };
