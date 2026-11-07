import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { CopyButton } from './copy-button';
import { DescriptionList, DescriptionListItem } from './description-list';

const meta = {
  title: 'Components/Description List/Description List Item',
  component: DescriptionListItem,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Label-value pairs for record details (dl / dt / dd). Horizontal in cards and sheets, vertical in narrow columns and grids; bordered for dense specs and invoices. Divider off on the last row; an empty value says "Not set". Show action adds a Copy Button xs for IDs, keys and links. Money breakdowns use Summary Row. Figma: Description List page / Description List Item. Guide: eggux build-ui/components/description-list.md' } },
  },
  args: { label: 'Phone', children: '+40 712 345 678' },
  render: () => (
    <DescriptionList className="w-[560px]">
      <DescriptionListItem label="Phone">+40 712 345 678</DescriptionListItem>
      <DescriptionListItem label="Email">ana.ionescu@acme.com</DescriptionListItem>
      <DescriptionListItem label="Customer ID" action={<CopyButton value="CUS-48213" size="xs" label="Copy customer ID" />}>CUS-48213</DescriptionListItem>
      <DescriptionListItem label="VAT number" />
    </DescriptionList>
  ),
} satisfies Meta<typeof DescriptionListItem>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();

// Figma Orientation=horizontal: rows 45 with the divider, label 160, no divider on the last row, "Not set".
export const Default: Story = {
  play: async ({ canvas, canvasElement }) => {
    const rows = canvasElement.querySelectorAll<HTMLElement>('[data-slot="description-list-item"]');
    await expect(Math.round(box(rows[0]!).height)).toBe(45);
    await expect(Math.round(box(rows[0]!.querySelector('dt')!).width)).toBe(160);
    await expect(getComputedStyle(rows[3]!).borderBottomWidth).toBe('0px');
    await expect(within(rows[3]!).getByText('Not set')).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Copy customer ID' })).toBeInTheDocument();
    await expect(canvas.getAllByRole('term')).toHaveLength(4);
  },
};

// Figma Orientation=vertical: label over value, 69 with the divider; in a 2-column grid.
export const Vertical: Story = {
  render: () => (
    <DescriptionList className="grid w-[540px] grid-cols-2 gap-x-5">
      <DescriptionListItem orientation="vertical" label="Phone">+40 712 345 678</DescriptionListItem>
      <DescriptionListItem orientation="vertical" label="City">Cluj-Napoca</DescriptionListItem>
    </DescriptionList>
  ),
  play: async ({ canvasElement }) => {
    const row = canvasElement.querySelector('[data-slot="description-list-item"]')!;
    await expect(Math.round(box(row).height)).toBe(69);
  },
};

// Figma Style=bordered: label cell on card/muted (192 max), rows overlap their borders.
export const Bordered: Story = {
  render: () => (
    <DescriptionList listStyle="bordered" className="w-[560px]">
      <DescriptionListItem itemStyle="bordered" label="Invoice">INV-2026-0412</DescriptionListItem>
      <DescriptionListItem itemStyle="bordered" label="Issued">7 November 2026</DescriptionListItem>
      <DescriptionListItem itemStyle="bordered" label="API key" action={<CopyButton value="sk_live_4821" size="xs" label="Copy API key" />}>sk_live_4821</DescriptionListItem>
    </DescriptionList>
  ),
  play: async ({ canvasElement }) => {
    const rows = canvasElement.querySelectorAll('[data-slot="description-list-item"]');
    await expect(Math.round(box(rows[0]!).height)).toBe(46);
    await expect(Math.round(box(rows[0]!.querySelector('dt')!).width)).toBe(192);
    await expect(Math.round(box(rows[1]!).top)).toBe(Math.round(box(rows[0]!).bottom) - 1);
  },
};

// Stress: a long value wraps, the label keeps 160; at 280 the bordered label shrinks to 96 min. Tests only.
export const Stress: Story = {
  tags: ['!dev'],
  render: () => (
    <div className="flex flex-col gap-6">
      <DescriptionList className="w-[560px]">
        <DescriptionListItem label="Billing address">Strada Memorandumului 28, Etaj 4, Apartament 12, 400114 Cluj-Napoca, Cluj, Romania</DescriptionListItem>
      </DescriptionList>
      <DescriptionList listStyle="bordered" className="w-[280px]">
        <DescriptionListItem itemStyle="bordered" label="Registration number">J12/4821/2019-RO-CLUJ-NAPOCA</DescriptionListItem>
      </DescriptionList>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [long, narrow] = canvasElement.querySelectorAll('[data-slot="description-list-item"]');
    await expect(box(long!).height).toBeGreaterThan(45);
    await expect(Math.round(box(long!.querySelector('dt')!).width)).toBe(160);
    await expect(Math.round(box(narrow!).width)).toBe(280);
    await expect(box(narrow!.querySelector('dt')!).width).toBeGreaterThanOrEqual(96);
  },
};

export const DefaultDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' }, render: Bordered.render };
export const DefaultCorporate: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' }, render: Bordered.render };
