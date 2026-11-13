import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { DistanceBadge, type DistanceMode, type DistanceUnit } from './distance-badge';

type Args = { meters: number; mode: DistanceMode; unit: DistanceUnit; switchable: boolean; size: 'sm' | 'default' | 'lg'; showIcon: boolean };

const meta = {
  title: 'Components/Location/Distance Badge',
  parameters: {
    docs: {
      description: {
        component:
          'A compact pill for how far a place is: "1.2 km", "0.7 mi", or a travel time ("8 min walk", "3 min drive"). The visible text is short; screen readers get the long form ("1.2 kilometres away"). Metric or imperial, or a switchable badge that is a button. Code only (no Figma component yet).',
      },
    },
  },
  args: { meters: 1200, mode: 'distance', unit: 'metric', switchable: false, size: 'default', showIcon: true },
  argTypes: {
    meters: { name: 'Distance (m)', control: { type: 'range', min: 20, max: 20000, step: 10 }, description: 'Distance in metres.', table: { category: 'Badge' } },
    mode: { name: 'Mode', control: 'select', options: ['distance', 'walk', 'bike', 'drive'], description: 'A distance or a travel time.', table: { category: 'Badge' } },
    unit: { name: 'Unit', control: 'inline-radio', options: ['metric', 'imperial'], description: 'Kilometres or miles.', table: { category: 'Badge' } },
    size: { name: 'Size', control: 'inline-radio', options: ['sm', 'default', 'lg'], description: '16, 20 or 24 high.', table: { category: 'Badge' } },
    switchable: { name: 'Switchable', control: 'boolean', description: 'The badge is a button that switches km and mi.', table: { category: 'Badge' } },
    showIcon: { name: 'Show icon', control: 'boolean', description: 'The pin or clock.', table: { category: 'Parts' } },
  },
  render: ({ unit, ...args }) => <DistanceBadge key={unit} defaultUnit={unit} {...args} />,
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  render: () => (
    <div className="flex flex-col items-start gap-2">
      <DistanceBadge meters={1200} />
      <DistanceBadge meters={700} mode="walk" />
      <DistanceBadge meters={850} unit="imperial" />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText('1.2 kilometres away')).toBeInTheDocument();
    await expect(canvas.getByText('1.2 km')).toBeVisible();
    await expect(canvas.getByText('8 minutes on foot')).toBeInTheDocument();
    await expect(canvas.getByText('8 min walk')).toBeVisible();
    await expect(canvas.getByText('0.5 mi')).toBeVisible();
    // The pill is 20 px high.
    await expect(Math.round(canvas.getByText('1.2 km').closest('[data-slot=distance-badge]')!.getBoundingClientRect().height)).toBe(20);
  },
};

/** Every mode for the same walk to the shop, in both units. */
export const Modes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <DistanceBadge meters={1600} />
        <DistanceBadge meters={1600} unit="imperial" />
        <DistanceBadge meters={450} />
        <DistanceBadge meters={45} />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <DistanceBadge meters={1600} mode="walk" />
        <DistanceBadge meters={1600} mode="bike" />
        <DistanceBadge meters={1600} mode="drive" />
        <DistanceBadge meters={9000} mode="walk" />
      </div>
    </div>
  ),
};

/** The badge is a button: press it to switch between kilometres and miles. */
export const Switchable: Story = { args: { switchable: true, meters: 2400 } };

export const SwitchCheck: Story = {
  tags: ['!dev'],
  render: () => <DistanceBadge meters={1200} switchable onUnitChange={fn()} />,
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: /1\.2 km, 1\.2 kilometres away\. Switch to miles/ });
    await userEvent.click(button);
    await waitFor(() => expect(canvas.getByRole('button', { name: /0\.7 mi, 0\.7 miles away\. Switch to kilometres/ })).toBeVisible());
    // Keyboard.
    canvas.getByRole('button').focus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(canvas.getByRole('button', { name: /1\.2 km/ })).toBeVisible());
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <DistanceBadge meters={19999} mode="walk" size="lg" />
      <DistanceBadge meters={12345} switchable size="lg" />
      <DistanceBadge meters={20} size="sm" />
    </div>
  ),
  play: async ({ canvas }) => {
    const first = canvas.getByText('4 h 1 min walk');
    await expect(first.closest('[data-slot=distance-badge]')!.getBoundingClientRect().width).toBeLessThanOrEqual(276);
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
