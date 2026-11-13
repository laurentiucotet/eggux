import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { CreditBalance } from './credit-balance';

type Args = { balance: number; lowThreshold: number; showExpiring: boolean; expiringAmount: number; title: string };

const NOW = '2026-11-13T00:00:00Z';

const meta = {
  title: 'Components/Billing/Credit Balance',
  parameters: {
    docs: {
      description: {
        component:
          'Prepaid credit left, in EUR: the amount as the main figure, a state in words (Low balance at or below the threshold, Empty at zero), the credit that expires with its date and the days left, and a Top up button. The figure is a status. Code only (no Figma component yet).',
      },
    },
  },
  args: { balance: 48.2, lowThreshold: 10, showExpiring: true, expiringAmount: 10, title: 'Credit balance' },
  argTypes: {
    balance: { name: 'Balance', control: { type: 'range', min: 0, max: 500, step: 0.2 }, description: 'Credit left in EUR.', table: { category: 'Balance' } },
    lowThreshold: { name: 'Low threshold', control: { type: 'range', min: 0, max: 100, step: 5 }, description: 'At or below this the balance is low.', table: { category: 'Balance' } },
    title: { name: 'Title', control: 'text', description: 'The card label.', table: { category: 'Balance' } },
    showExpiring: { name: 'Show expiring credit', control: 'boolean', description: 'A line about credit that expires.', table: { category: 'Parts' } },
    expiringAmount: { name: 'Expiring amount', control: { type: 'range', min: 1, max: 100, step: 1 }, description: 'EUR that expires on 30 Nov 2026.', table: { category: 'Parts' } },
  },
  render: ({ showExpiring, expiringAmount, ...args }) => (
    <CreditBalance now={NOW} expiring={showExpiring ? { amount: expiringAmount, on: '2026-11-30' } : undefined} onTopUp={fn()} {...args} />
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** At or below the threshold the card says "Low balance" and Top up becomes the main button. */
export const Low: Story = { args: { balance: 6.5 } };

/** At zero the card says "Empty" and what to do. */
export const Empty: Story = { args: { balance: 0, showExpiring: false } };

export const DefaultCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => {
    const onTopUp = fn();
    return <CreditBalance balance={48.2} now={NOW} expiring={{ amount: 10, on: '2026-11-30' }} onTopUp={onTopUp} />;
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('region', { name: 'Credit balance' })).toBeVisible();
    await expect(canvas.getByRole('status')).toHaveTextContent('€48.20');
    await expect(canvas.queryByText('Low balance')).toBeNull();
    await expect(canvas.getByText('€10.00 expires in 17 days (30 Nov 2026)')).toBeVisible();
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Top up' })).toHaveFocus();
  },
};

export const StatesCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => {
    const onTopUp = fn();
    return (
      <div className="flex flex-col gap-4">
        <CreditBalance balance={6.5} title="Low credit" onTopUp={onTopUp} />
        <CreditBalance balance={0} title="Empty credit" onTopUp={onTopUp} />
        <CreditBalance balance={20} title="Expiring today" now={NOW} expiring={{ amount: 5, on: '2026-11-13' }} />
      </div>
    );
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Low balance')).toBeVisible();
    await expect(canvas.getByText('Empty')).toBeVisible();
    await expect(canvas.getByText('Add credit to keep your services running.')).toBeVisible();
    await expect(canvas.getByText('€5.00 expires today (13 Nov 2026)')).toBeVisible();
    const buttons = canvas.getAllByRole('button', { name: 'Top up' });
    await userEvent.click(buttons[0]);
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => <CreditBalance balance={1234567.89} title="Prepaid credit for Acme International Holdings and all subsidiaries" now={NOW} expiring={{ amount: 123456.78, on: '2027-12-31' }} />,
  play: async ({ canvas }) => {
    const section = canvas.getByRole('region');
    await expect(section.scrollWidth).toBeLessThanOrEqual(section.clientWidth + 1);
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
