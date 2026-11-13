import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { StepNavigation, type StepNavigationStep } from './step-navigation';

const names = ['Company details', 'Bank account', 'Invoice style', 'Team', 'Review'];

function build(count: number, current: number, errorAt: number, withDescriptions: boolean): StepNavigationStep[] {
  return names.slice(0, count).map((title, i) => ({
    id: `s${i}`,
    title,
    description: withDescriptions ? ['2 minutes', '3 minutes', '1 minute', 'Optional', 'Last check'][i] : undefined,
    state: i === current - 1 ? 'current' : i === errorAt - 1 && i < current - 1 ? 'error' : i < current - 1 ? 'done' : 'upcoming',
  }));
}

type Args = { steps: number; current: number; errorAt: number; clickableDone: boolean; showDescriptions: boolean; width: number };

const meta = {
  title: 'Components/Wizard/Step Navigation',
  parameters: {
    docs: {
      description: {
        component:
          'Vertical list of the steps of a flow. Each step is done, current, upcoming or error, and the state is written in words under the title. Done steps can be buttons so people go back. The current step has aria-current="step". For a horizontal bar use Progress Stepper Bar; for the whole frame use Wizard Shell. Code only (no Figma component yet). Guide: eggux build-ui/patterns/wizard.md',
      },
    },
  },
  args: { steps: 5, current: 3, errorAt: 0, clickableDone: true, showDescriptions: true, width: 280 },
  argTypes: {
    steps: { name: 'Steps', control: { type: 'range', min: 2, max: 5, step: 1 }, description: 'How many steps.', table: { category: 'Navigation' } },
    current: { name: 'Current step', control: { type: 'range', min: 1, max: 5, step: 1 }, description: 'The step the person is on, from 1. Earlier steps are done.', table: { category: 'Navigation' } },
    errorAt: { name: 'Step with an error', control: { type: 'range', min: 0, max: 5, step: 1 }, description: 'A step before the current one that needs attention. 0 for none.', table: { category: 'Navigation' } },
    clickableDone: { name: 'Clickable done steps', control: 'boolean', description: 'Done and error steps become buttons.', table: { category: 'Navigation' } },
    width: { name: 'Width', control: { type: 'range', min: 240, max: 480, step: 4 }, description: 'Container width in px.', table: { category: 'Navigation' } },
    showDescriptions: { name: 'Show descriptions', control: 'boolean', description: 'A short line under each title.', table: { category: 'Parts' } },
  },
  render: ({ steps, current, errorAt, clickableDone, showDescriptions, width }) => (
    <div style={{ width }} className="max-w-full">
      <StepNavigation steps={build(steps, Math.min(current, steps), errorAt, showDescriptions)} clickableDone={clickableDone} />
    </div>
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => {
    const onSelect = fn();
    (window as unknown as { __select?: typeof onSelect }).__select = onSelect;
    return <StepNavigation steps={build(5, 3, 1, true)} clickableDone onStepSelect={onSelect} />;
  },
  play: async ({ canvas }) => {
    const nav = canvas.getByRole('navigation', { name: 'Steps' });
    const items = within(nav).getAllByRole('listitem');
    await expect(items).toHaveLength(5);
    await expect(items[0]).toHaveAttribute('data-state', 'error');
    await expect(items[1]).toHaveAttribute('data-state', 'done');
    await expect(items[2]).toHaveAttribute('data-state', 'current');
    await expect(items[2]).toHaveAttribute('aria-current', 'step');
    await expect(items[3]).toHaveAttribute('data-state', 'upcoming');
    // State in words.
    await expect(within(items[0]).getByText('Needs attention')).toBeVisible();
    await expect(within(items[1]).getByText('Done')).toBeVisible();
    await expect(within(items[2]).getByText('Current step')).toBeVisible();
    await expect(within(items[3]).getByText('Upcoming')).toBeVisible();
    // Only done and error steps are buttons.
    await expect(canvas.getAllByRole('button')).toHaveLength(2);
    // Keyboard: Tab reaches the first, Enter selects it.
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: /Company details/ })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    const spy = (window as unknown as { __select: ReturnType<typeof fn> }).__select;
    await expect(spy).toHaveBeenCalledWith('s0');
    await userEvent.tab();
    await userEvent.keyboard(' ');
    await expect(spy).toHaveBeenLastCalledWith('s1');
  },
};

/** Every state next to each other, and the same list with no clickable steps. */
export const States: Story = {
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="flex w-[280px] max-w-full flex-col gap-8"><Story /></div>],
  render: () => (
    <>
      <StepNavigation aria-label="Steps with clickable done steps" steps={build(5, 3, 1, true)} clickableDone />
      <StepNavigation aria-label="Steps, read only" steps={build(4, 2, 0, false)} />
    </>
  ),
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => (
    <StepNavigation
      clickableDone
      steps={[
        { id: 'a', title: 'Registered company address and the VAT number for every legal entity', description: 'A description that is long enough to wrap over several lines', state: 'done' },
        { id: 'b', title: 'Averyveryverylongunbrokenstepnamewithnospacesatall0123456789', state: 'current' },
        { id: 'c', title: 'Review', state: 'upcoming' },
      ]}
    />
  ),
  play: async ({ canvas }) => {
    const nav = canvas.getByRole('navigation');
    await expect(nav.scrollWidth).toBeLessThanOrEqual(nav.clientWidth + 1);
    await expect(nav.getBoundingClientRect().width).toBeLessThanOrEqual(276);
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
