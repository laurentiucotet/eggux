import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { CallBanner } from './call-banner';

type Args = { title: string; muted: boolean; showLeave: boolean; running: boolean };

const meta = {
  title: 'Components/Messaging/Call Banner',
  decorators: [Story => <div className="w-[480px] max-w-full"><Story /></div>],
  parameters: {
    docs: {
      description: {
        component:
          'The strip at the top of a chat while you are on a call: the call name, a timer, a Mute toggle and Leave. The text part returns to the call. The timer is not a live region; muting is announced once, politely. The pulse stops under reduced motion. Code only (no Figma component yet).',
      },
    },
  },
  args: { title: 'Acme Design sync', muted: false, showLeave: true, running: true },
  argTypes: {
    title: { name: 'Call name', control: 'text', description: 'A person or a room.', table: { category: 'Banner' } },
    muted: { name: 'Muted', control: 'boolean', description: 'Start with the microphone muted.', table: { category: 'Banner' } },
    showLeave: { name: 'Show Leave', control: 'boolean', description: 'Show the Leave button.', table: { category: 'Banner' } },
    running: { name: 'Timer running', control: 'boolean', description: 'Let the timer count up.', table: { category: 'Banner' } },
  },
  render: ({ title, muted, showLeave, running }) => (
    <CallBanner key={`${muted}`} title={title} defaultElapsed={754} running={running} defaultMuted={muted} onReturn={() => undefined} onLeave={showLeave ? () => undefined : undefined} />
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  render: function Render() {
    const onReturn = fn();
    const [left, setLeft] = React.useState(false);
    return left ? <p>You left the call</p> : <CallBanner title="Acme Design sync" elapsed={754} onReturn={onReturn} onLeave={() => setLeft(true)} />;
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('region', { name: 'Call in progress: Acme Design sync' })).toBeVisible();
    await expect(canvas.getByText('12:34')).toBeVisible();
    await expect(canvas.getByRole('status')).toHaveTextContent('');
    const mute = canvas.getByRole('button', { name: 'Mute microphone' });
    await expect(mute).toHaveAttribute('aria-pressed', 'false');
    await userEvent.tab();
    await userEvent.tab();
    await expect(mute).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(mute).toHaveAttribute('aria-pressed', 'true'));
    await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('Microphone muted'));
    await userEvent.keyboard(' ');
    await waitFor(() => expect(mute).toHaveAttribute('aria-pressed', 'false'));
    await userEvent.click(canvas.getByRole('button', { name: 'Leave' }));
    await waitFor(() => expect(canvas.getByText('You left the call')).toBeVisible());
  },
};

/** The timer counts up by itself when it is not controlled. */
export const TimerCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <CallBanner title="Mihai Ionescu" defaultElapsed={3599} />,
  play: async ({ canvas }) => {
    await expect(canvas.getByText('59:59')).toBeVisible();
    await waitFor(() => expect(canvas.getByText('1:00:00')).toBeVisible(), { timeout: 3000 });
  },
};

export const Muted: Story = {
  args: { muted: true },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => <CallBanner title="Quarterly planning with the whole Acme product and design team" elapsed={36125} onReturn={() => undefined} onLeave={() => undefined} />,
  play: async ({ canvas }) => {
    const banner = canvas.getByRole('region');
    await expect(banner.scrollWidth).toBeLessThanOrEqual(banner.clientWidth + 1);
    await expect(canvas.getByRole('button', { name: 'Leave' })).toBeVisible();
    await expect(canvas.getByText('10:02:05')).toBeVisible();
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
