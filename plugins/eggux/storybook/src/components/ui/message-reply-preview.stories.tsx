import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { MessageReplyPreview } from './message-reply-preview';

type Args = { variant: 'composer' | 'thread'; deleted: boolean; showAction: boolean; text: string };

const meta = {
  title: 'Components/Messaging/Message Reply Preview',
  decorators: [Story => <div className="w-[420px] max-w-full"><Story /></div>],
  parameters: {
    docs: {
      description: {
        component:
          'The quoted message of a reply. In the composer: "Replying to Ana", one line of the original and a Cancel button. In the thread: the author and one line, linking to the original message. A deleted original is plain text, not a link. Code only (no Figma component yet).',
      },
    },
  },
  args: { variant: 'composer', deleted: false, showAction: true, text: 'Can you send the signed contract before Friday?' },
  argTypes: {
    variant: { name: 'Variant', control: 'inline-radio', options: ['composer', 'thread'], description: 'composer sits above the composer; thread sits above a sent reply.', table: { category: 'Preview' } },
    deleted: { name: 'Original deleted', control: 'boolean', description: 'The original message no longer exists.', table: { category: 'Preview' } },
    showAction: { name: 'Show action', control: 'boolean', description: 'Cancel button (composer) or link to the original (thread).', table: { category: 'Preview' } },
    text: { name: 'Original text', control: 'text', description: 'The quoted text; it is cut to one line.', table: { category: 'Preview' } },
  },
  render: ({ variant, deleted, showAction, text }) => (
    <MessageReplyPreview
      variant={variant}
      author="Ana Popescu"
      text={text}
      deleted={deleted}
      onCancel={showAction ? () => undefined : undefined}
      href={showAction ? '#message-41' : undefined}
    />
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  render: function Render() {
    const [open, setOpen] = React.useState(true);
    const onSelect = fn();
    return (
      <div className="flex flex-col gap-3">
        {open ? <MessageReplyPreview author="Ana Popescu" text="Can you send the signed contract before Friday?" onCancel={() => setOpen(false)} /> : <p>Reply cancelled</p>}
        <MessageReplyPreview variant="thread" author="Ana Popescu" text="Can you send the signed contract before Friday?" href="#message-41" />
        <MessageReplyPreview variant="thread" author="Mihai Ionescu" text="Sure, on it" onSelect={onSelect} />
        <MessageReplyPreview variant="thread" author="Ana Popescu" text="gone" deleted href="#message-41" />
      </div>
    );
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('group', { name: 'Replying to Ana Popescu' })).toBeVisible();
    const link = canvas.getByRole('link', { name: /^Go to message from Ana Popescu/ });
    await expect(link).toHaveAttribute('href', '#message-41');
    await expect(canvas.getByRole('button', { name: /^Go to message from Mihai Ionescu/ })).toBeVisible();
    // Deleted original: text only, no link.
    await expect(canvas.getByText('Original message was deleted')).toBeVisible();
    await expect(canvas.getAllByRole('link')).toHaveLength(1);
    const cancel = canvas.getByRole('button', { name: 'Cancel reply' });
    cancel.focus();
    await expect(cancel).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(canvas.getByText('Reply cancelled')).toBeVisible());
  },
};

/** Both places the quote appears. */
export const InContext: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-end gap-1">
        <MessageReplyPreview variant="thread" author="Ana Popescu" text="Can you send the signed contract before Friday?" href="#message-41" />
        <p className="m-0 w-fit rounded-xl rounded-br-sm bg-primary px-3 py-2 text-sm leading-5 text-primary-foreground">Sending it this afternoon.</p>
      </div>
      <MessageReplyPreview author="Mihai Ionescu" text="Draft is ready for review" onCancel={() => undefined} />
    </div>
  ),
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => (
    <div className="flex flex-col gap-2">
      <MessageReplyPreview author="Alexandra-Maria Constantinescu-Papadopoulos" text="A very long message that goes on and on and must be cut to a single line with an ellipsis" onCancel={() => undefined} />
      <MessageReplyPreview variant="thread" author="Alexandra-Maria Constantinescu-Papadopoulos" text="A very long message that goes on and on and must be cut to a single line" href="#m" />
    </div>
  ),
  play: async ({ canvas }) => {
    const group = canvas.getByRole('group');
    await expect(group.scrollWidth).toBeLessThanOrEqual(group.clientWidth + 1);
    const link = canvas.getByRole('link');
    await expect(link.scrollWidth).toBeLessThanOrEqual(link.clientWidth + 1);
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
