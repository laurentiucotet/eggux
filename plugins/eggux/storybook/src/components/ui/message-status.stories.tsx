import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { MessageStatus, type MessageStatusValue } from './message-status';

type Args = { status: MessageStatusValue; showLabel: boolean; showTime: boolean };

const meta = {
  title: 'Components/Messaging/Message Status',
  parameters: {
    docs: {
      description: {
        component:
          'Where one of your own messages is in its delivery: Sending, Sent, Delivered, Read, or Not sent with a Retry button. The state is always text (visible, or sr-only when the label is off), never only a glyph. Quiet by default; turn on announce for the one message being sent now. Code only (no Figma component yet).',
      },
    },
  },
  args: { status: 'delivered', showLabel: true, showTime: true },
  argTypes: {
    status: { name: 'Status', control: 'select', options: ['sending', 'sent', 'delivered', 'read', 'failed'], description: 'Delivery state of the message.', table: { category: 'Status' } },
    showLabel: { name: 'Show label', control: 'boolean', description: 'Show the word next to the glyph.', table: { category: 'Status' } },
    showTime: { name: 'Show time', control: 'boolean', description: 'Show the time of the message before the status.', table: { category: 'Status' } },
  },
  render: ({ status, showLabel, showTime }) => (
    <MessageStatus status={status} showLabel={showLabel} time={showTime ? '10:42' : undefined} onRetry={() => undefined} />
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  args: { status: 'failed' },
  render: () => {
    const onRetry = fn();
    return (
      <div className="flex flex-col gap-2">
        <MessageStatus status="sending" />
        <MessageStatus status="sent" />
        <MessageStatus status="delivered" />
        <MessageStatus status="read" showLabel={false} />
        <MessageStatus status="failed" onRetry={onRetry} retryLabel="Retry sending message 4" />
      </div>
    );
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Sending')).toBeVisible();
    await expect(canvas.getByText('Sent')).toBeVisible();
    await expect(canvas.getByText('Delivered')).toBeVisible();
    // Label off: the word stays for screen readers.
    await expect(canvas.getByText('Read')).toHaveClass('sr-only');
    await expect(canvas.getByText('Not sent')).toBeVisible();
    // Quiet by default: no live region.
    await expect(canvas.queryAllByRole('status')).toHaveLength(0);
    const retry = canvas.getByRole('button', { name: 'Retry sending message 4' });
    retry.focus();
    await expect(retry).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await userEvent.click(retry);
  },
};

/** Failed turns into Sending and then Sent: the flow a Retry starts. */
export const RetryFlow: Story = {
  parameters: { controls: { disable: true } },
  render: function Render() {
    const [status, setStatus] = React.useState<MessageStatusValue>('failed');
    return (
      <MessageStatus
        status={status}
        announce
        onRetry={() => {
          setStatus('sending');
          window.setTimeout(() => setStatus('sent'), 600);
        }}
      />
    );
  },
};

export const RetryFlowCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: RetryFlow.render,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Retry' })).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Retry' }));
    await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('Sending'));
    await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('Sent'), { timeout: 3000 });
    await expect(canvas.queryByRole('button', { name: 'Retry' })).not.toBeInTheDocument();
  },
};

/** The five states side by side. */
export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-2">
      {(['sending', 'sent', 'delivered', 'read', 'failed'] as const).map(s => (
        <MessageStatus key={s} status={s} time="10:42" onRetry={() => undefined} />
      ))}
    </div>
  ),
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => <MessageStatus status="failed" time="10:42" onRetry={() => undefined} retryLabel="Retry sending this message" />,
  play: async ({ canvas }) => {
    const root = canvas.getByRole('button').parentElement as HTMLElement;
    await expect(root.scrollWidth).toBeLessThanOrEqual(root.parentElement!.clientWidth + 1);
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
