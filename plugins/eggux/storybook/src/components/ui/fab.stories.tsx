import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { Fab } from './fab';

type Args = { fabType: 'icon' | 'extended'; label: string };

const meta = {
  title: 'Components/Mobile/FAB',
  parameters: {
    docs: {
      description: {
        component:
          'Floating action button for the one main action on a mobile screen: new invoice, compose, add. 56 high and round. Extended shows the label and shrinks to the icon on scroll. One per screen; never for destructive or secondary actions. Figma: Mobile page / FAB. Guide: eggux build-ui/patterns/mobile.md',
      },
    },
  },
  args: { fabType: 'icon', label: 'New invoice' },
  argTypes: {
    fabType: { name: 'Type', control: 'inline-radio', options: ['icon', 'extended'], description: 'Icon only, or icon with the label.', table: { category: 'FAB' } },
    label: { name: 'Label', control: 'text', description: 'The action; the accessible name when icon only.', table: { category: 'FAB' } },
  },
  render: ({ fabType, label }) => <Fab fabType={fabType} label={label} />,
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  render: () => <Fab onClick={fn()} />,
  play: async ({ canvas }) => {
    const fab = canvas.getByRole('button', { name: 'New invoice' });
    await expect(Math.round(fab.getBoundingClientRect().width)).toBe(56);
    await expect(Math.round(fab.getBoundingClientRect().height)).toBe(56);
    await expect(getComputedStyle(fab).borderRadius).not.toBe('0px');
    await userEvent.tab();
    await expect(fab).toHaveFocus();
  },
};

/** Icon and extended side by side. */
export const Types: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex items-center gap-6">
      <Fab fabType="icon" label="New invoice" />
      <Fab fabType="extended" label="New invoice" />
    </div>
  ),
};

/* Hidden checks */

export const ExtendedCheck: Story = {
  tags: ['!dev'],
  args: { fabType: 'extended' },
  play: async ({ canvas }) => {
    const fab = canvas.getByRole('button', { name: 'New invoice' });
    await expect(Math.round(fab.getBoundingClientRect().height)).toBe(56);
    await expect(fab.getBoundingClientRect().width).toBeGreaterThan(56);
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[200px]"><Story /></div>],
  render: () => <Fab fabType="extended" label="Create a new recurring invoice for a customer" className="max-w-full" />,
  play: async ({ canvas }) => {
    const fab = canvas.getByRole('button');
    await expect(fab.getBoundingClientRect().width).toBeLessThanOrEqual(200);
    await expect(Math.round(fab.getBoundingClientRect().height)).toBe(56);
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
