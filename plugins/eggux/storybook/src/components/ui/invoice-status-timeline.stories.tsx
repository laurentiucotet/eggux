import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { InvoiceStatusTimeline, type InvoiceDates } from './invoice-status-timeline';

type Args = { status: 'draft' | 'sent' | 'viewed' | 'paid' | 'overdue' | 'refunded' };

const NOW = '2026-10-13T12:00:00Z';
const dates: InvoiceDates = {
  created: '2026-09-01',
  sent: '2026-09-02',
  viewed: '2026-09-05',
  due: '2026-10-01',
  paid: '2026-10-08',
  refunded: '2026-10-20',
};

const meta = {
  title: 'Components/Billing/Invoice Status Timeline',
  parameters: {
    docs: {
      description: {
        component:
          'The life of one invoice: Draft, Sent, Viewed, Paid with their dates. The current step is marked with aria-current="step"; steps not reached say "Not yet". Overdue adds a step in the error tone ("Overdue by 12 days", counted from the due date to `now`); refunded adds a step after Paid. Every state has a word, never colour alone. Dates are ISO strings shown in UTC. Code only (no Figma component yet).',
      },
    },
  },
  args: { status: 'viewed' },
  argTypes: {
    status: { name: 'Status', control: 'select', options: ['draft', 'sent', 'viewed', 'paid', 'overdue', 'refunded'], description: 'Where the invoice is now.', table: { category: 'Timeline' } },
  },
  render: ({ status }) => <InvoiceStatusTimeline status={status} dates={dates} now={NOW} />,
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** All six statuses side by side. */
export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {(['draft', 'sent', 'viewed', 'paid', 'overdue', 'refunded'] as const).map(s => (
        <div key={s} className="flex min-w-0 flex-col gap-2">
          <p className="m-0 text-xs font-medium text-muted-foreground uppercase">{s}</p>
          <InvoiceStatusTimeline status={s} dates={dates} now={NOW} aria-label={`Invoice status: ${s}`} />
        </div>
      ))}
    </div>
  ),
};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <InvoiceStatusTimeline status="viewed" dates={dates} now={NOW} />,
  play: async ({ canvas }) => {
    const list = canvas.getByRole('list', { name: 'Invoice status' });
    const items = within(list).getAllByRole('listitem');
    await expect(items).toHaveLength(4);
    await expect(items[0]).toHaveTextContent('Draft created: Done');
    await expect(items[1]).toHaveTextContent('Sent: Done');
    await expect(items[2]).toHaveTextContent('Viewed: Current');
    await expect(items[2]).toHaveAttribute('aria-current', 'step');
    await expect(items[3]).toHaveTextContent('Paid: Not yet');
    await expect(items[3]).not.toHaveAttribute('aria-current');
  },
};

export const OverdueCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <InvoiceStatusTimeline status="overdue" dates={dates} now={NOW} />,
  play: async ({ canvas }) => {
    const items = within(canvas.getByRole('list')).getAllByRole('listitem');
    await expect(items).toHaveLength(5);
    await expect(items[3]).toHaveTextContent('Overdue: Overdue');
    await expect(items[3]).toHaveTextContent('Overdue by 12 days (due 1 Oct 2026)');
    await expect(items[3]).toHaveAttribute('aria-current', 'step');
    await expect(items[4]).toHaveTextContent('Paid: Not yet');
  },
};

export const RefundedCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <InvoiceStatusTimeline status="refunded" dates={dates} now={NOW} />,
  play: async ({ canvas }) => {
    const items = within(canvas.getByRole('list')).getAllByRole('listitem');
    await expect(items).toHaveLength(5);
    await expect(items[3]).toHaveTextContent('Paid: Done');
    await expect(items[3]).toHaveTextContent('8 Oct 2026');
    await expect(items[4]).toHaveTextContent('Refunded: Refunded');
    await expect(items[4]).toHaveTextContent('20 Oct 2026');
    await expect(items[4]).toHaveAttribute('aria-current', 'step');
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => <InvoiceStatusTimeline status="overdue" dates={{ ...dates, due: '2024-01-31' }} now={NOW} />,
  play: async ({ canvas }) => {
    const list = canvas.getByRole('list');
    await expect(list.scrollWidth).toBeLessThanOrEqual(list.clientWidth + 1);
    await expect(within(list).getAllByRole('listitem')[3]).toHaveTextContent('Overdue by 986 days (due 31 Jan 2024)');
  },
};

export const DefaultDark: Story = { ...OverdueCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...OverdueCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
