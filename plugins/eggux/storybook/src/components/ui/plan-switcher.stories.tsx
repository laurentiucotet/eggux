import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { PlanSwitcher } from './plan-switcher';

type Args = { planName: string; period: 'monthly' | 'yearly'; seats: number; monthlyPrice: number; yearlyDiscount: number; width: number };

const meta = {
  title: 'Components/Billing/Plan Switcher',
  parameters: {
    docs: {
      description: {
        component:
          'Monthly / Yearly toggle with the yearly saving in a badge, a seat stepper and the resulting price line in words ("5 seats × €12.00 = €60.00 per month"). The price line is a status, so a change is announced. Prices are per seat in EUR; the yearly price is the monthly price less the discount, billed once a year. It shows a price and takes no card. Code only (no Figma component yet).',
      },
    },
  },
  args: { planName: 'Team', period: 'monthly', seats: 5, monthlyPrice: 12, yearlyDiscount: 20, width: 420 },
  argTypes: {
    planName: { name: 'Plan name', control: 'text', description: 'Names the group ("Team plan").', table: { category: 'Switcher' } },
    period: { name: 'Period', control: 'inline-radio', options: ['monthly', 'yearly'], description: 'Starting period.', table: { category: 'Switcher' } },
    seats: { name: 'Seats', control: { type: 'range', min: 1, max: 50, step: 1 }, description: 'Starting seat count.', table: { category: 'Switcher' } },
    monthlyPrice: { name: 'Monthly price per seat', control: { type: 'range', min: 1, max: 100, step: 1 }, description: 'EUR per seat per month.', table: { category: 'Switcher' } },
    yearlyDiscount: { name: 'Yearly discount', control: { type: 'range', min: 0, max: 40, step: 5 }, description: 'Percent off when paying yearly. 0 hides the saving.', table: { category: 'Switcher' } },
    width: { name: 'Width', control: { type: 'range', min: 276, max: 520, step: 4 }, description: 'Container width in px.', table: { category: 'Layout' } },
  },
  render: ({ period, seats, width, ...args }) => (
    <div style={{ width, maxWidth: '100%' }}>
      <PlanSwitcherKeyed key={`${period}-${seats}`} period={period} seats={seats} {...args} />
    </div>
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

function PlanSwitcherKeyed({ period, seats, ...args }: Omit<Args, 'width'>) {
  return <PlanSwitcher defaultPeriod={period} defaultSeats={seats} {...args} />;
}

export const Default: Story = {};

/** Starts on the yearly period: the saving is part of the price line. */
export const Yearly: Story = { args: { period: 'yearly', seats: 12 } };

export const DefaultCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <PlanSwitcher monthlyPrice={12} onPeriodChange={fn()} onSeatsChange={fn()} />,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('group', { name: 'Team plan' })).toBeVisible();
    await expect(canvas.getByRole('status')).toHaveTextContent('5 seats × €12.00 = €60.00 per month');
    await expect(canvas.getByRole('status')).toHaveTextContent('Pay yearly and save €144.00 a year.');
    await expect(canvas.getByText('Save 20%')).toBeVisible();
    await userEvent.click(canvas.getByRole('radio', { name: 'Yearly' }));
    await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('5 seats × €9.60 × 12 months = €576.00 per year'));
    await expect(canvas.getByRole('status')).toHaveTextContent('You save €144.00 a year.');
    await userEvent.click(canvas.getByRole('button', { name: 'Add a seat' }));
    await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('6 seats × €9.60 × 12 months = €691.20 per year'));
    // One period always stays selected.
    await userEvent.click(canvas.getByRole('radio', { name: 'Yearly' }));
    await expect(canvas.getByRole('radio', { name: 'Yearly' })).toBeChecked();
  },
};

export const LimitsCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <PlanSwitcher monthlyPrice={12} defaultSeats={1} minSeats={1} maxSeats={2} yearlyDiscount={0} />,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('status')).toHaveTextContent('1 seat × €12.00 = €12.00 per month');
    await expect(canvas.queryByText(/Save/)).toBeNull();
    await expect(canvas.getByRole('button', { name: 'Remove a seat' })).toBeDisabled();
    await userEvent.click(canvas.getByRole('button', { name: 'Add a seat' }));
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Add a seat' })).toBeDisabled());
    await expect(canvas.getByRole('status')).toHaveTextContent('2 seats');
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => <PlanSwitcher planName="Acme Business Enterprise Annual Commitment" monthlyPrice={1234.5} defaultSeats={480} defaultPeriod="yearly" />,
  play: async ({ canvas }) => {
    const group = canvas.getByRole('group');
    await expect(group.scrollWidth).toBeLessThanOrEqual(group.clientWidth + 1);
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
