import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { UnreadDivider } from './unread-divider';

type Args = { count: number; showJump: boolean };

const meta = {
  title: 'Components/Messaging/Unread Divider',
  decorators: [Story => <div className="w-[480px] max-w-full"><Story /></div>],
  parameters: {
    docs: {
      description: {
        component:
          'The line in a message list where the unread messages begin: "3 new messages" between two rules, with an optional Jump to latest button. Static text, never announced; the count is part of the text. Count 0 shows "New messages". Code only (no Figma component yet).',
      },
    },
  },
  args: { count: 3, showJump: true },
  argTypes: {
    count: { name: 'Unread count', control: { type: 'range', min: 0, max: 120, step: 1 }, description: '0 shows "New messages" with no number; above 99 shows 99+.', table: { category: 'Divider' } },
    showJump: { name: 'Show Jump to latest', control: 'boolean', description: 'Show the button that scrolls to the newest message.', table: { category: 'Divider' } },
  },
  render: ({ count, showJump }) => <UnreadDivider count={count || undefined} onJump={showJump ? () => undefined : undefined} />,
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  render: () => {
    const onJump = fn();
    return (
      <div>
        <UnreadDivider count={3} onJump={onJump} />
        <UnreadDivider count={1} />
        <UnreadDivider />
        <UnreadDivider count={250} />
      </div>
    );
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('group', { name: '3 new messages' })).toBeVisible();
    await expect(canvas.getByRole('group', { name: '1 new message' })).toBeVisible();
    await expect(canvas.getByRole('group', { name: 'New messages' })).toBeVisible();
    await expect(canvas.getByRole('group', { name: '99+ new messages' })).toBeVisible();
    const jump = canvas.getByRole('button', { name: 'Jump to latest' });
    await userEvent.tab();
    await expect(jump).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await userEvent.click(jump);
    await expect(canvas.getAllByRole('button')).toHaveLength(1);
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => <UnreadDivider count={99} label="new replies in this thread" onJump={() => undefined} />,
  play: async ({ canvas }) => {
    const group = canvas.getByRole('group');
    await expect(group.scrollWidth).toBeLessThanOrEqual(group.clientWidth + 1);
    await expect(canvas.getByRole('button', { name: 'Jump to latest' })).toBeVisible();
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
