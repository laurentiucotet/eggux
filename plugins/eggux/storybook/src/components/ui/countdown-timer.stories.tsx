import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, waitFor } from 'storybook/test';
import { CountdownTimer } from './countdown-timer';

type Preset = 'days' | 'hours' | 'minutes' | 'ended';
type Args = { timeLeft: Preset; size: 'sm' | 'default' | 'lg'; showDays: boolean; showSeconds: boolean; width: number };

// Fixed moments (UTC), so nothing depends on the real clock or the time zone.
const TARGET = '2026-11-23T12:00:00Z';
const nowFor: Record<Preset, string> = {
  days: '2026-11-20T08:25:04Z', // 3 days 3 h 34 min 56 s left
  hours: '2026-11-23T05:40:30Z', // 6 h 19 min 30 s left
  minutes: '2026-11-23T11:55:45Z', // 4 min 15 s left
  ended: '2026-11-23T12:00:00Z',
};

const meta = {
  title: 'Components/Date and Time/Countdown Timer',
  parameters: {
    docs: {
      description: {
        component:
          'Time left until a target, as day, hour, minute and second blocks. The blocks are visual only: screen readers get one polite sentence that changes once a minute, so a ticking second never talks. When the target is reached the blocks give way to the finished message. Pass `now` to freeze the clock. Code only (no Figma component yet).',
      },
    },
  },
  args: { timeLeft: 'days', size: 'default', showDays: true, showSeconds: true, width: 390 },
  argTypes: {
    timeLeft: { name: 'Time left', control: 'select', options: ['days', 'hours', 'minutes', 'ended'], description: 'A frozen moment to look at: days left, hours left, minutes left or ended.', table: { category: 'Timer' } },
    size: { name: 'Size', control: 'inline-radio', options: ['sm', 'default', 'lg'], description: 'Block size: 40, 56 or 72 px minimum width.', table: { category: 'Timer' } },
    showDays: { name: 'Show days', control: 'boolean', description: 'Off: the hours block keeps counting past 24.', table: { category: 'Blocks' } },
    showSeconds: { name: 'Show seconds', control: 'boolean', description: 'Seconds block.', table: { category: 'Blocks' } },
    width: { name: 'Width', control: { type: 'range', min: 276, max: 560, step: 4 }, description: 'Width of the container in px: the blocks wrap.', table: { category: 'Layout' } },
  },
  render: ({ timeLeft, size, showDays, showSeconds, width }) => (
    <div style={{ width, maxWidth: '100%' }}>
      <CountdownTimer label="Time left until the Acme spring sale" target={TARGET} now={nowFor[timeLeft]} size={size} showDays={showDays} showSeconds={showSeconds} finishedMessage="The Acme spring sale has ended" />
    </div>
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Ended: Story = { args: { timeLeft: 'ended' } };

export const DefaultCheck: Story = {
  tags: ['!dev'],
  play: async ({ canvas }) => {
    const group = canvas.getByRole('group', { name: 'Time left until the Acme spring sale' });
    await expect(group).toHaveAttribute('data-state', 'running');
    // The blocks show the numbers; the spoken sentence has no seconds.
    await expect(group.querySelector('[data-unit="days"]')).toHaveTextContent('03');
    await expect(group.querySelector('[data-unit="hours"]')).toHaveTextContent('03');
    await expect(group.querySelector('[data-unit="minutes"]')).toHaveTextContent('34');
    await expect(group.querySelector('[data-unit="seconds"]')).toHaveTextContent('56');
    await expect(canvas.getByText('3 days 3 hours 34 minutes left')).toBeInTheDocument();
    await expect(group.querySelector('[aria-live="polite"]')).toBeTruthy();
  },
};

export const FinishedCheck: Story = {
  tags: ['!dev'],
  args: { timeLeft: 'ended' },
  play: async ({ canvas }) => {
    const group = canvas.getByRole('group', { name: 'Time left until the Acme spring sale' });
    await expect(group).toHaveAttribute('data-state', 'finished');
    await expect(canvas.getByText('The Acme spring sale has ended')).toBeVisible();
    await expect(group.querySelector('[data-unit]')).toBeNull();
  },
};

const liveSpy = fn();

export const LiveCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: function Render() {
    const [target] = React.useState(() => Date.now() + 2200);
    return <CountdownTimer label="Time left until the demo ends" target={target} onComplete={liveSpy} finishedMessage="The demo has ended" />;
  },
  play: async ({ canvas }) => {
    const group = canvas.getByRole('group', { name: 'Time left until the demo ends' });
    await expect(group).toHaveAttribute('data-state', 'running');
    // The real clock ticks: the seconds block changes, then the finished message appears.
    const first = group.querySelector('[data-unit="seconds"]')?.textContent;
    await waitFor(() => expect(group.querySelector('[data-unit="seconds"]')?.textContent).not.toBe(first), { timeout: 3000 });
    await waitFor(() => expect(canvas.getByText('The demo has ended')).toBeVisible(), { timeout: 5000 });
    await waitFor(() => expect(liveSpy).toHaveBeenCalledTimes(1));
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px] max-w-full"><Story /></div>],
  render: () => (
    <div className="flex flex-col gap-4">
      <CountdownTimer label="Large countdown" target={TARGET} now={nowFor.days} size="lg" />
      <CountdownTimer label="Countdown without days" target="2026-12-31T23:59:59Z" now="2026-11-20T08:25:04Z" showDays={false} size="lg" />
      <CountdownTimer label="Long message" target={TARGET} now={nowFor.ended} finishedMessage="The Acme spring sale for members and partners has ended" />
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    const root = canvasElement.firstElementChild as HTMLElement;
    await expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth + 1);
    // Past 24 hours the hours block keeps counting.
    const noDays = canvas.getByRole('group', { name: 'Countdown without days' });
    await expect(noDays.querySelector('[data-unit="hours"]')).toHaveTextContent('999');
    await expect(canvas.getByText('The Acme spring sale for members and partners has ended')).toBeInTheDocument();
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
