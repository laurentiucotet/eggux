import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { BottomActionBar } from './bottom-action-bar';
import { Button } from './button';

type Args = { showSummary: boolean; stacked: boolean; showSecondary: boolean; primary: string };

const frame = (Story: React.ComponentType) => (
  <div className="flex h-48 w-[390px] max-w-full flex-col justify-end overflow-hidden rounded-lg border border-border bg-muted/40">
    <Story />
  </div>
);

const meta = {
  title: 'Components/Mobile/Bottom Action Bar',
  decorators: [frame],
  parameters: {
    docs: {
      description: {
        component:
          'The bar stuck to the bottom of a mobile screen that holds the one decision of the screen: Continue, Pay, Save. An optional summary on the left ("Total" and "€248.00"), buttons on the right or full width and stacked. Border on top and safe-area padding inside. It replaces the Bottom Nav on flows; never show both. Code only (no Figma component yet).',
      },
    },
  },
  args: { showSummary: true, stacked: false, showSecondary: false, primary: 'Pay now' },
  argTypes: {
    showSummary: { name: 'Show summary', control: 'boolean', description: 'A label and value on the left.', table: { category: 'Parts' } },
    showSecondary: { name: 'Show secondary action', control: 'boolean', description: 'A second, outline button.', table: { category: 'Parts' } },
    stacked: { name: 'Stacked', control: 'boolean', description: 'Buttons full width, one per row.', table: { category: 'Bar' } },
    primary: { name: 'Primary label', control: 'text', description: 'The one filled button.', table: { category: 'Bar' } },
  },
  render: ({ showSummary, stacked, showSecondary, primary }) => (
    <BottomActionBar summaryLabel={showSummary ? 'Total' : undefined} summaryValue={showSummary ? '€248.00' : undefined} stacked={stacked} label="Checkout">
      {showSecondary ? <Button variant="outline">Save for later</Button> : null}
      <Button>{primary}</Button>
    </BottomActionBar>
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  play: async ({ canvas }) => {
    const bar = canvas.getByRole('region', { name: 'Checkout' });
    await expect(getComputedStyle(bar).borderTopWidth).toBe('1px');
    await expect(canvas.getByText('€248.00')).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Pay now' })).toBeVisible();
  },
};

/** No summary: the buttons fill the width; stacked: one per row. */
export const Layouts: Story = {
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="flex w-[390px] max-w-full flex-col gap-4"><Story /></div>],
  render: () => (
    <>
      <BottomActionBar label="Continue" className="rounded-lg border">
        <Button>Continue</Button>
      </BottomActionBar>
      <BottomActionBar label="Pay" stacked summaryLabel="Total" summaryValue="€248.00" className="rounded-lg border">
        <Button>Pay now</Button>
        <Button variant="outline">Save for later</Button>
      </BottomActionBar>
    </>
  ),
};

/* Hidden checks */

export const StackedCheck: Story = {
  tags: ['!dev'],
  args: { stacked: true, showSecondary: true },
  play: async ({ canvas }) => {
    const [save, pay] = [canvas.getByRole('button', { name: 'Save for later' }), canvas.getByRole('button', { name: 'Pay now' })];
    await expect(save.getBoundingClientRect().width).toBeGreaterThan(300);
    await expect(Math.round(save.getBoundingClientRect().width)).toBe(Math.round(pay.getBoundingClientRect().width));
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px] border border-border"><Story /></div>],
  render: () => (
    <BottomActionBar summaryLabel="Total including shipping and taxes" summaryValue="€12,480,000.00" label="Long">
      <Button>Pay now</Button>
    </BottomActionBar>
  ),
  play: async ({ canvas }) => {
    const bar = canvas.getByRole('region', { name: 'Long' });
    await expect(bar.scrollWidth).toBeLessThanOrEqual(bar.clientWidth + 1);
    await expect(canvas.getByRole('button', { name: 'Pay now' })).toBeVisible();
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
