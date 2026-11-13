import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { PinnedMessageBar, type PinnedMessage } from './pinned-message-bar';

type Args = { pins: number; showUnpin: boolean };

const all: PinnedMessage[] = [
  { id: 'a', author: 'Ana Popescu', text: 'Kick-off is on Monday at 10:00 in the Acme Studio, room 4.' },
  { id: 'b', author: 'Mihai Ionescu', text: 'The brand kit and the signed contract are in the shared folder.' },
  { id: 'c', author: 'Ana Popescu', text: 'Please send timesheets by Friday noon.' },
  { id: 'd', author: 'Elena Dumitru', text: 'Release notes for version 2.4 are final.' },
];

const meta = {
  title: 'Components/Messaging/Pinned Message Bar',
  decorators: [Story => <div className="w-[480px] max-w-full overflow-hidden rounded-lg border border-border"><Story /></div>],
  parameters: {
    docs: {
      description: {
        component:
          'The bar under a conversation header that shows a pinned message: counter, previous and next (they wrap), an Unpin button, and a message part that scrolls to the original. One pin hides the counter and arrows. Moving between pins is announced politely, never on first render. Code only (no Figma component yet).',
      },
    },
  },
  args: { pins: 3, showUnpin: true },
  argTypes: {
    pins: { name: 'Pinned messages', control: { type: 'range', min: 1, max: 4, step: 1 }, description: 'How many messages are pinned.', table: { category: 'Bar' } },
    showUnpin: { name: 'Show Unpin', control: 'boolean', description: 'Show the Unpin button.', table: { category: 'Bar' } },
  },
  render: function Render({ pins, showUnpin }) {
    return <PinnedMessageBar key={pins} messages={all.slice(0, pins)} onSelect={() => undefined} onUnpin={showUnpin ? () => undefined : undefined} />;
  },
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  render: function Render() {
    const [messages, setMessages] = React.useState(all.slice(0, 3));
    const onSelect = fn();
    return <PinnedMessageBar messages={messages} onSelect={onSelect} onUnpin={m => setMessages(list => list.filter(x => x.id !== m.id))} />;
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Pinned message 1 of 3')).toBeVisible();
    await expect(canvas.getByRole('status')).toHaveTextContent('');
    const next = canvas.getByRole('button', { name: 'Next pinned message' });
    next.focus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(canvas.getByText('Pinned message 2 of 3')).toBeVisible());
    await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('Pinned message 2 of 3, Mihai Ionescu'));
    // Previous from the first wraps to the last.
    await userEvent.click(canvas.getByRole('button', { name: 'Previous pinned message' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Previous pinned message' }));
    await waitFor(() => expect(canvas.getByText('Pinned message 3 of 3')).toBeVisible());
    // Unpin the third: the bar stays inside the list.
    await userEvent.click(canvas.getByRole('button', { name: 'Unpin message' }));
    await waitFor(() => expect(canvas.getByText('Pinned message 2 of 2')).toBeVisible());
    await userEvent.click(canvas.getByRole('button', { name: 'Unpin message' }));
    // One pin left: no counter and no arrows.
    await waitFor(() => expect(canvas.queryByRole('button', { name: 'Next pinned message' })).not.toBeInTheDocument());
    await expect(canvas.getByText('Pinned message')).toBeVisible();
  },
};

/** One pin: no counter, no arrows. */
export const SinglePin: Story = {
  args: { pins: 1 },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px] overflow-hidden"><Story /></div>],
  render: () => (
    <PinnedMessageBar
      messages={[{ id: 'x', author: 'Alexandra-Maria Constantinescu', text: 'A very long pinned message that must be cut to one line and never push the buttons away' }, all[1]!]}
      onSelect={() => undefined}
      onUnpin={() => undefined}
    />
  ),
  play: async ({ canvas }) => {
    const bar = canvas.getByRole('region', { name: 'Pinned messages' });
    await expect(bar.scrollWidth).toBeLessThanOrEqual(bar.clientWidth + 1);
    await expect(canvas.getByRole('button', { name: 'Unpin message' })).toBeVisible();
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
