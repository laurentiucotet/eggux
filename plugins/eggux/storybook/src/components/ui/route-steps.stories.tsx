import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';
import { RouteSteps, type RouteStep } from './route-steps';

const allSteps: RouteStep[] = [
  { id: '1', instruction: 'Head north on Market Street', meters: 300, maneuver: 'depart' },
  { id: '2', instruction: 'Turn left onto Cedar Street', meters: 450, maneuver: 'left' },
  { id: '3', instruction: 'Bear right at the fountain', meters: 220, maneuver: 'slight-right' },
  { id: '4', instruction: 'Turn right onto Quay Road', meters: 800, maneuver: 'right' },
  { id: '5', instruction: 'Continue straight past the station', meters: 430, maneuver: 'straight' },
  { id: '6', instruction: 'Arrive at Acme Riverside, on your left', maneuver: 'arrive' },
];

type Args = { stepCount: number; current: number; expanded: boolean; unit: 'metric' | 'imperial'; title: string; duration: string; width: number };

const meta = {
  title: 'Components/Location/Route Steps',
  parameters: {
    docs: {
      description: {
        component:
          'A turn-by-turn list: an icon per manoeuvre, the instruction, the distance to the next turn and the current step highlighted (aria-current="step"). The header summarises the route and holds Show or Hide steps; collapsed, only the current step is left. Previous and Next move the current step, so a route never needs a gesture. Code only (no Figma component yet).',
      },
    },
  },
  args: { stepCount: 6, current: 1, expanded: true, unit: 'metric', title: 'Walking route', duration: '12 min', width: 380 },
  argTypes: {
    stepCount: { name: 'Steps', control: { type: 'range', min: 2, max: 6, step: 1 }, description: 'How many steps.', table: { category: 'Route' } },
    current: { name: 'Current step', control: { type: 'range', min: 0, max: 5, step: 1 }, description: 'Index of the current step.', table: { category: 'Route' } },
    expanded: { name: 'Expanded', control: 'boolean', description: 'Every step, or only the current one.', table: { category: 'Route' } },
    unit: { name: 'Unit', control: 'inline-radio', options: ['metric', 'imperial'], description: 'Kilometres or miles.', table: { category: 'Route' } },
    title: { name: 'Title', control: 'text', description: 'Heading of the card.', table: { category: 'Route' } },
    duration: { name: 'Duration', control: 'text', description: 'Total time in the summary.', table: { category: 'Route' } },
    width: { name: 'Width', control: { type: 'range', min: 240, max: 520, step: 4 }, description: 'Width in px.', table: { category: 'Layout' } },
  },
  render: ({ stepCount, current, expanded, unit, title, duration, width }) => (
    <div style={{ width }} className="max-w-full">
      <RouteSteps key={`${stepCount}-${current}-${expanded}`} steps={allSteps.slice(0, stepCount - 1).concat(allSteps[5])} defaultCurrent={current} defaultExpanded={expanded} unit={unit} title={title} duration={duration} />
    </div>
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Collapsed to the current step, as on a phone while moving. */
export const Collapsed: Story = { args: { expanded: false, current: 3 } };

export const DefaultCheck: Story = {
  tags: ['!dev'],
  render: () => <RouteSteps steps={allSteps} defaultCurrent={1} duration="12 min" />,
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole('heading', { name: 'Walking route' })).toBeVisible();
    await expect(canvas.getByText('6 steps, 2.2 km, 12 min')).toBeVisible();
    const items = canvasElement.querySelectorAll('li');
    await expect(items.length).toBe(6);
    const current = canvasElement.querySelector('[aria-current="step"]') as HTMLElement;
    await expect(current).toHaveTextContent('Turn left onto Cedar Street');
    await expect(current).toHaveTextContent('450 m');
    await expect(items[0]).toHaveTextContent('Done: Head north on Market Street');
    // Next moves the current step.
    await userEvent.click(canvas.getByRole('button', { name: 'Next step' }));
    await waitFor(() => expect(canvasElement.querySelector('[aria-current="step"]')).toHaveTextContent('Bear right at the fountain'));
    await expect(canvas.getByRole('status')).toHaveTextContent('Step 3 of 6');
    // Collapse to the current step and expand again.
    const toggle = canvas.getByRole('button', { name: 'Hide steps' });
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(toggle);
    await waitFor(() => expect(canvasElement.querySelectorAll('li').length).toBe(1));
    await expect(canvas.getByRole('button', { name: 'Show steps' })).toHaveAttribute('aria-expanded', 'false');
    toggle.focus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(canvasElement.querySelectorAll('li').length).toBe(6));
  },
};

export const EdgesCheck: Story = {
  tags: ['!dev'],
  render: () => <RouteSteps steps={allSteps.slice(0, 2)} unit="imperial" />,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Previous step' })).toBeDisabled();
    await userEvent.click(canvas.getByRole('button', { name: 'Next step' }));
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Next step' })).toBeDisabled());
    await expect(canvas.getByRole('status')).toHaveTextContent('Step 2 of 2');
    await expect(canvas.getByText('2 steps, 0.5 mi')).toBeVisible();
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => (
    <RouteSteps
      title="Driving route to Acme Superstore International Airport Terminal Two"
      duration="1 h 25 min"
      defaultCurrent={2}
      steps={allSteps.map(s => ({ ...s, instruction: `${s.instruction} and keep going along the extraordinarily long boulevard` }))}
    />
  ),
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('[data-slot=route-steps]') as HTMLElement;
    await expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth + 1);
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
