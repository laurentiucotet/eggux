import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { ProrationPreview } from './proration-preview';

type Args = { fromPlan: string; fromMonthly: number; toPlan: string; toMonthly: number; width: number };

const NOW = '2026-11-13T00:00:00Z';
const RENEWS = '2026-11-28';

const meta = {
  title: 'Components/Billing/Proration Preview',
  parameters: {
    docs: {
      description: {
        component:
          'What a plan change costs today: the credit for the unused days on the current plan, the charge for the same days on the new plan, and the amount due today (or the credit added to the balance when the new plan is cheaper), then when the next full invoice comes. Prices are per month in EUR and a period is 30 days. Nothing changes until Confirm. Code only (no Figma component yet).',
      },
    },
  },
  args: { fromPlan: 'Starter', fromMonthly: 30, toPlan: 'Team', toMonthly: 60, width: 420 },
  argTypes: {
    fromPlan: { name: 'Current plan', control: 'text', description: 'Name of the plan now.', table: { category: 'Plans' } },
    fromMonthly: { name: 'Current monthly price', control: { type: 'range', min: 0, max: 500, step: 5 }, description: 'EUR per month.', table: { category: 'Plans' } },
    toPlan: { name: 'New plan', control: 'text', description: 'Name of the plan after the change.', table: { category: 'Plans' } },
    toMonthly: { name: 'New monthly price', control: { type: 'range', min: 0, max: 500, step: 5 }, description: 'EUR per month.', table: { category: 'Plans' } },
    width: { name: 'Width', control: { type: 'range', min: 276, max: 520, step: 4 }, description: 'Container width in px.', table: { category: 'Layout' } },
  },
  render: ({ width, ...args }) => (
    <div style={{ width, maxWidth: '100%' }}>
      <ProrationPreview now={NOW} renewsOn={RENEWS} onConfirm={fn()} {...args} />
    </div>
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** A cheaper plan: the difference becomes credit on the balance. */
export const Downgrade: Story = { args: { fromPlan: 'Team', fromMonthly: 60, toPlan: 'Starter', toMonthly: 30 } };

export const DefaultCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <ProrationPreview fromPlan="Starter" fromMonthly={30} toPlan="Team" toMonthly={60} now={NOW} renewsOn={RENEWS} onConfirm={fn()} />,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('region', { name: 'Switch from Starter to Team' })).toBeVisible();
    // 15 days left of 30: credit 15.00, charge 30.00, due 15.00.
    await expect(canvas.getByText('Unused time on Starter (15 days)')).toBeVisible();
    await expect(canvas.getByText('−€15.00')).toBeVisible();
    await expect(canvas.getByText('Team for the same 15 days')).toBeVisible();
    await expect(canvas.getByText('Due today').nextElementSibling).toHaveTextContent('€15.00');
    await expect(canvas.getByText('Your next invoice is on 28 Nov 2026, €60.00 for Team.')).toBeVisible();
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Confirm change' })).toHaveFocus();
  },
};

export const DowngradeCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <ProrationPreview fromPlan="Team" fromMonthly={60} toPlan="Starter" toMonthly={30} now={NOW} renewsOn={RENEWS} />,
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Credit added to your balance').nextElementSibling).toHaveTextContent('€15.00');
    await expect(canvas.queryByText('Due today')).toBeNull();
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => <ProrationPreview fromPlan="Acme Business Enterprise Annual" fromMonthly={12345.67} toPlan="Acme Global Enterprise Unlimited" toMonthly={98765.43} now={NOW} renewsOn={RENEWS} />,
  play: async ({ canvas }) => {
    const section = canvas.getByRole('region');
    await expect(section.scrollWidth).toBeLessThanOrEqual(section.clientWidth + 1);
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
