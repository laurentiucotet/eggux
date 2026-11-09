import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { PricingPage } from './pricing-page';

const meta = {
  title: 'Pages/Marketing/Pricing',
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
    docs: { description: { component: 'Pricing: a billing switch (monthly or yearly), three plans with the middle one featured, a comparison table, questions about pricing and a closing call to action. Switch to Yearly to see the prices change. Guide: eggux build-ui/patterns/marketing-pages.md and monetization.md' } },
  },
  render: () => <PricingPage />,
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Yearly: Story = { render: () => <PricingPage defaultPeriod="yearly" /> };

/* Hidden checks */

export const FlowCheck: Story = {
  tags: ['!dev'],
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getByRole('heading', { level: 1, name: 'Simple pricing, for the whole team' })).toBeVisible();
    await expect(c.getAllByRole('article')).toHaveLength(3);
    await expect(c.getByRole('table', { name: 'Compare plans' })).toBeVisible();
    await expect(c.getAllByText('€39').length).toBeGreaterThan(0);
    await userEvent.click(c.getByRole('radio', { name: 'Yearly, save 20%' }));
    // 20% off: 39 becomes 31.
    await expect((await c.findAllByText('€31')).length).toBeGreaterThan(0);
    await expect(c.getAllByRole('link', { name: 'Start free trial' }).length).toBeGreaterThan(0);
  },
};
export const DefaultDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultBackOffice: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' } };
