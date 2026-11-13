import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';
import { Button } from './button';
import { ProgressStepperBar } from './progress-stepper-bar';

const names = ['Account', 'Company', 'Bank details', 'Invoice style', 'Review'];

type Args = { steps: number; current: number; showName: boolean; showBack: boolean; width: number };

const meta = {
  title: 'Components/Onboarding/Progress Stepper Bar',
  parameters: {
    docs: {
      description: {
        component:
          'A thin segmented bar for a multi-step flow: one 4 px segment per step filled up to the current one, "Step 2 of 5" with the step name, and a Back link from step 2. The step line is a polite status. Not navigation between sections: segments are not buttons. For a stepper with clickable steps use Stepper. Code only (no Figma component yet). Guide: eggux build-ui/patterns/onboarding.md',
      },
    },
  },
  args: { steps: 5, current: 2, showName: true, showBack: true, width: 440 },
  argTypes: {
    steps: { name: 'Steps', control: { type: 'range', min: 2, max: 5, step: 1 }, description: 'How many steps the flow has.', table: { category: 'Bar' } },
    current: { name: 'Current step', control: { type: 'range', min: 1, max: 5, step: 1 }, description: 'The step the person is on, from 1.', table: { category: 'Bar' } },
    width: { name: 'Width', control: { type: 'range', min: 240, max: 640, step: 4 }, description: 'Container width in px.', table: { category: 'Bar' } },
    showName: { name: 'Show step name', control: 'boolean', description: 'The name after the count.', table: { category: 'Parts' } },
    showBack: { name: 'Show Back', control: 'boolean', description: 'The Back link (not on step 1).', table: { category: 'Parts' } },
  },
  render: ({ steps, current, showName, showBack, width }) => (
    <div style={{ width }} className="max-w-full">
      <ProgressStepperBar steps={names.slice(0, steps)} current={Math.min(current, steps)} showName={showName} showBack={showBack} />
    </div>
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

function Flow() {
  const [current, setCurrent] = React.useState(1);
  return (
    <div className="flex w-[440px] max-w-full flex-col items-start gap-4">
      <ProgressStepperBar steps={names} current={current} onBack={() => setCurrent(c => Math.max(1, c - 1))} />
      <Button size="sm" onClick={() => setCurrent(c => Math.min(names.length, c + 1))}>Continue</Button>
    </div>
  );
}

export const DefaultCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <Flow />,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('status')).toHaveTextContent('Step 1 of 5');
    await expect(canvas.getByRole('status')).toHaveTextContent('Account');
    // No Back on the first step.
    await expect(canvas.queryByRole('button', { name: 'Back' })).toBeNull();
    const segments = () => canvas.getByRole('list', { name: 'Progress' }).querySelectorAll('li');
    await expect(segments()).toHaveLength(5);
    // Segments are 4 px high.
    await expect(Math.round(segments()[0].getBoundingClientRect().height)).toBe(4);
    await userEvent.click(canvas.getByRole('button', { name: 'Continue' }));
    await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('Step 2 of 5'));
    await expect(segments()[1]).toHaveAttribute('aria-current', 'step');
    await expect(segments()[0]).toHaveAttribute('data-state', 'done');
    await expect(segments()[2]).toHaveAttribute('data-state', 'upcoming');
    await expect(segments()[0]).toHaveTextContent('Step 1: Account, done');
    await expect(segments()[2]).toHaveTextContent('Step 3: Bank details, not started');
    // Back with the keyboard.
    const back = canvas.getByRole('button', { name: 'Back' });
    back.focus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('Step 1 of 5'));
  },
};

/** First, middle and last step, and Back as a link. */
export const Positions: Story = {
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="flex w-[440px] max-w-full flex-col gap-6"><Story /></div>],
  render: () => (
    <>
      <ProgressStepperBar steps={names} current={1} />
      <ProgressStepperBar steps={names} current={3} backHref="#back" />
      <ProgressStepperBar steps={names} current={5} />
    </>
  ),
};

export const LinkCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <ProgressStepperBar steps={names} current={3} backHref="#back" />,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: 'Back' })).toHaveAttribute('href', '#back');
    await expect(canvas.getByRole('status')).toHaveTextContent('Step 3 of 5');
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => (
    <ProgressStepperBar
      steps={['Account', 'Company', 'Connect your bank account and verify the very long legal name of the holder', 'Style', 'Review', 'Done', 'Extra']}
      current={3}
    />
  ),
  play: async ({ canvas }) => {
    const root = canvas.getByRole('status').parentElement!.parentElement as HTMLElement;
    await expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth + 1);
    const status = canvas.getByRole('status');
    await expect(status.scrollWidth).toBeLessThanOrEqual(status.clientWidth + 1);
    await expect(canvas.getByText('Step 3 of 7')).toBeVisible();
    await expect(canvas.getByRole('list', { name: 'Progress' }).querySelectorAll('li')).toHaveLength(7);
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
