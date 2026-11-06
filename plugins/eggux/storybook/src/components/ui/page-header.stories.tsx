import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { Building, Calendar, Plus, Receipt } from '@/components/icons';
import { BackLink } from './back-link';
import { Badge } from './badge';
import { Button } from './button';
import { MetaItem } from './meta-item';
import { PageHeader } from './page-header';

const meta = {
  title: 'Components/Navigation/Page Header',
  component: PageHeader,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Title of a page inside the app shell with one sentence of description and the page actions (primary last). Record pages add a Back Link that names the list, a status Badge and Meta Items, and a pager to step through the list. Global actions go in the Top Bar. The header wraps: actions and pager move under the text in narrow columns; title and description up to 2 lines. Figma: Navigation page / Page Header. Guide: eggux build-ui/components/navigation.md' } },
  },
  args: {
    title: 'Projects',
    description: 'All projects across your workspace.',
    actions: (
      <>
        <Button variant="outline">Export</Button>
        <Button leadingIcon={<Plus aria-hidden="true" />}>New project</Button>
      </>
    ),
  },
  decorators: [Story => <div className="w-[1136px] max-w-full"><Story /></div>],
} satisfies Meta<typeof PageHeader>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();
const h = (el: Element) => Math.round(box(el).height);

// Figma default: 1136 × 56, title 24/32 semibold, description 14/20 muted, actions bottom-aligned.
export const Default: Story = {
  play: async ({ canvas, canvasElement }) => {
    const header = canvasElement.querySelector('[data-slot="page-header"]')!;
    await expect(h(header)).toBe(56);
    const title = canvas.getByRole('heading', { level: 1, name: 'Projects' });
    const s = getComputedStyle(title);
    await expect([s.fontSize, s.lineHeight, s.fontWeight]).toEqual(['24px', '32px', '600']);
    const primary = canvas.getByRole('button', { name: 'New project' });
    await expect(Math.round(box(primary).bottom)).toBe(Math.round(box(header).bottom));
    await expect(box(canvas.getByRole('button', { name: 'Export' })).right).toBeLessThan(box(primary).left);
  },
};

// Record page: back link, status badge and meta, pager before the actions.
const onNext = fn();
export const Record: Story = {
  args: {
    title: 'Invoice INV-2041',
    description: undefined,
    backLink: <BackLink href="#invoices">All invoices</BackLink>,
    badge: <Badge variant="warning">Overdue</Badge>,
    meta: (
      <>
        <MetaItem icon={<Calendar />}>Due 12 Nov 2026</MetaItem>
        <MetaItem icon={<Building />}>Acme Inc.</MetaItem>
        <MetaItem icon={<Receipt />}>EUR 4,200.00</MetaItem>
      </>
    ),
    pager: { label: '3 of 24', previousLabel: 'Previous invoice', nextLabel: 'Next invoice', onNext },
    actions: <Button>Record payment</Button>,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: 'All invoices' })).toHaveAttribute('href', '#invoices');
    const title = canvas.getByRole('heading', { name: 'Invoice INV-2041' });
    await expect(title).toHaveAccessibleDescription('Overdue');
    await expect(canvas.getByText('3 of 24')).toBeInTheDocument();
    const next = canvas.getByRole('button', { name: 'Next invoice' });
    await expect(h(next)).toBe(32);
    await userEvent.click(next);
    await expect(onNext).toHaveBeenCalled();
    const pager = next.closest('[data-slot="page-header-pager"]')!;
    await expect(box(pager).right).toBeLessThan(box(canvas.getByRole('button', { name: 'Record payment' })).left);
  },
};

// Last record: next is disabled. No page action: the slot is gone.
export const States: Story = {
  name: 'States (end of list, no actions)',
  render: () => (
    <div className="flex flex-col gap-10">
      <PageHeader title="Invoice INV-2064" pager={{ label: '24 of 24', previousLabel: 'Previous invoice', nextLabel: 'Next invoice', hasNext: false }} as="h2" />
      <PageHeader title="Usage report" description="Read-only summary of this month." as="h2" />
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole('button', { name: 'Next invoice' })).toBeDisabled();
    await expect(canvas.getByRole('button', { name: 'Previous invoice' })).toBeEnabled();
    const headers = canvasElement.querySelectorAll('[data-slot="page-header"]');
    await expect(headers[1].querySelector('[data-slot="page-header-actions"]')).toBeNull();
  },
};

// Stress: at 368 the actions wrap under the text; long title and description stop at 2 lines. Tests only.
export const Stress: Story = {
  tags: ['!dev'],
  decorators: [Story => <div className="w-[368px]"><Story /></div>],
  args: {
    title: 'Quarterly revenue reconciliation for every subsidiary in the European region and beyond',
    description: 'Every invoice, credit note and payment matched against the bank statements of all subsidiaries, refreshed every night at midnight.',
  },
  play: async ({ canvas, canvasElement }) => {
    const title = canvas.getByRole('heading', { level: 1 });
    await expect(h(title)).toBe(64);
    await expect(h(canvas.getByText(/Every invoice/))).toBe(40);
    const actions = canvas.getByRole('button', { name: 'New project' }).closest('[data-slot="page-header-actions"]')!;
    await expect(box(actions).top).toBeGreaterThan(box(title).bottom);
    const header = canvasElement.querySelector('[data-slot="page-header"]')!;
    await expect(header.scrollWidth).toBeLessThanOrEqual(368);
  },
};

export const RecordDark: Story = { ...Record, tags: ['!dev'], globals: { theme: 'Dark' } };
export const RecordCorporate: Story = { ...Record, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
