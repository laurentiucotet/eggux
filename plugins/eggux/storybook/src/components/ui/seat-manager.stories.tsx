import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';
import { SeatManager } from './seat-manager';

type Args = { used: number; bought: number; pricePerSeat: number; width: number };

const meta = {
  title: 'Components/Billing/Seat Manager',
  parameters: {
    docs: {
      description: {
        component:
          'Seats used of seats bought, and a stepper to add or remove seats. The lowest number is the seats in use. A preview in words shows the price change ("Adding 3 seats: +€36.00 per month") and Confirm stays disabled until the number changes. Nothing is charged before Confirm. Prices are per seat per month in EUR. Code only (no Figma component yet).',
      },
    },
  },
  args: { used: 8, bought: 10, pricePerSeat: 12, width: 420 },
  argTypes: {
    used: { name: 'Seats used', control: { type: 'range', min: 0, max: 60, step: 1 }, description: 'Seats taken by people. Also the minimum.', table: { category: 'Seats' } },
    bought: { name: 'Seats bought', control: { type: 'range', min: 1, max: 60, step: 1 }, description: 'Seats paid for today.', table: { category: 'Seats' } },
    pricePerSeat: { name: 'Price per seat', control: { type: 'range', min: 1, max: 100, step: 1 }, description: 'EUR per seat per month.', table: { category: 'Seats' } },
    width: { name: 'Width', control: { type: 'range', min: 276, max: 520, step: 4 }, description: 'Container width in px.', table: { category: 'Layout' } },
  },
  render: ({ used, bought, width, ...args }) => (
    <div style={{ width, maxWidth: '100%' }}>
      <SeatManager key={`${used}-${bought}`} used={Math.min(used, bought)} bought={bought} {...args} />
    </div>
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Every seat is taken: the bar is in the warning tone and the text says new people cannot join. */
export const NoFreeSeats: Story = { args: { used: 10, bought: 10 } };

export const DefaultCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: function Render() {
    const [confirmed, setConfirmed] = React.useState('');
    return (
      <>
        <SeatManager used={8} bought={10} pricePerSeat={12} onConfirm={n => setConfirmed(String(n))} />
        <p data-testid="confirmed">{confirmed}</p>
      </>
    );
  },
  play: async ({ canvas }) => {
    const bar = canvas.getByRole('progressbar', { name: 'Seats in use' });
    await expect(bar).toHaveAttribute('aria-valuetext', '8 of 10 seats used');
    await expect(canvas.getByText('2 seats free.')).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Confirm change' })).toBeDisabled();
    await expect(canvas.getByRole('status')).toHaveTextContent('No change. You pay €120.00 per month for 10 seats.');
    for (let i = 0; i < 3; i++) await userEvent.click(canvas.getByRole('button', { name: 'Add a seat' }));
    await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('Adding 3 seats: +€36.00 per month. New total €156.00 per month.'));
    await userEvent.click(canvas.getByRole('button', { name: 'Confirm change' }));
    await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('Done. You now have 13 seats.'));
    await expect(canvas.getByRole('button', { name: 'Confirm change' })).toBeDisabled();
    await expect(canvas.getByTestId('confirmed')).toHaveTextContent('13');
  },
};

export const MinimumCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <SeatManager used={8} bought={10} pricePerSeat={12} />,
  play: async ({ canvas }) => {
    for (let i = 0; i < 4; i++) {
      const down = canvas.getByRole('button', { name: 'Remove a seat' });
      if (!(down as HTMLButtonElement).disabled) await userEvent.click(down);
    }
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Remove a seat' })).toBeDisabled());
    await expect(canvas.getByRole('status')).toHaveTextContent('Removing 2 seats: −€24.00 per month. New total €96.00 per month.');
    await expect(canvas.getByRole('spinbutton', { name: 'Seats you want' })).toHaveValue('8');
    await expect(canvas.getByText('The lowest number is 8, the seats in use. Remove people first to go lower.')).toBeVisible();
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => <SeatManager used={1480} bought={1500} pricePerSeat={1234.5} maxSeats={5000} />,
  play: async ({ canvas }) => {
    const section = canvas.getByRole('region', { name: 'Seats' });
    await expect(section.scrollWidth).toBeLessThanOrEqual(section.clientWidth + 1);
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
