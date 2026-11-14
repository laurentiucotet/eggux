import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { MarkAllReadBar } from './mark-all-read-bar';

type Args = { unreadCount: number; sticky: boolean; width: number };

function Demo({ start, sticky, onMarkAllRead, onUndo }: { start: number; sticky?: boolean; onMarkAllRead?: () => void; onUndo?: () => void }) {
  const [count, setCount] = React.useState(start);
  return (
    <MarkAllReadBar
      unreadCount={count}
      sticky={sticky}
      onMarkAllRead={() => {
        onMarkAllRead?.();
        setCount(0);
      }}
      onUndo={() => {
        onUndo?.();
        setCount(start);
      }}
    />
  );
}

const meta = {
  title: 'Components/Notifications/Mark All Read Bar',
  parameters: {
    docs: {
      description: {
        component:
          'A bar above a notification list with the unread count and one button. Mark all as read turns into Undo, so a slip is one click to fix; the same button changes its name, so keyboard focus stays put. With nothing unread the button is aria-disabled and the text says "You are all caught up". One polite status, written only after a click. Code only (no Figma component yet).',
      },
    },
  },
  args: { unreadCount: 12, sticky: false, width: 420 },
  argTypes: {
    unreadCount: { name: 'Unread', control: { type: 'range', min: 0, max: 1200, step: 1 }, description: 'Unread notifications at the start.', table: { category: 'Bar' } },
    sticky: { name: 'Sticky', control: 'boolean', description: 'Pin to the top of the scroll area.', table: { category: 'Bar' } },
    width: { name: 'Width', control: { type: 'range', min: 240, max: 640, step: 4 }, description: 'Container width in px.', table: { category: 'Layout' } },
  },
  render: ({ unreadCount, sticky, width }) => (
    <div style={{ width, maxWidth: '100%' }}>
      <Demo key={unreadCount} start={unreadCount} sticky={sticky} />
    </div>
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Nothing unread: the button is off and the text says so. */
export const CaughtUp: Story = { args: { unreadCount: 0 } };

export const DefaultCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <div className="w-[420px]"><Demo start={12} onMarkAllRead={markSpy} onUndo={undoSpy} /></div>,
  play: async ({ canvas }) => {
    await expect(canvas.getByText('12 unread notifications')).toBeVisible();
    const button = canvas.getByRole('button', { name: 'Mark all as read' });
    // Keyboard: Tab reaches the button, Enter marks.
    await userEvent.tab();
    await expect(button).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(canvas.getByText('12 marked as read')).toBeVisible());
    await expect(markSpy).toHaveBeenCalled();
    // The same button is now Undo and still has focus.
    const undo = canvas.getByRole('button', { name: 'Undo' });
    await expect(undo).toBe(button);
    await expect(undo).toHaveFocus();
    await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('12 notifications marked as read. Undo is available.'));
    await userEvent.click(undo);
    await waitFor(() => expect(canvas.getByText('12 unread notifications')).toBeVisible());
    await expect(undoSpy).toHaveBeenCalled();
    await expect(canvas.getByRole('button', { name: 'Mark all as read' })).toHaveFocus();
    await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('12 notifications are unread again.'));
  },
};
const markSpy = fn();
const undoSpy = fn();

export const EmptyCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <div className="w-[420px]"><MarkAllReadBar unreadCount={0} onMarkAllRead={emptySpy} /><MarkAllReadBar unreadCount={1} /></div>,
  play: async ({ canvas }) => {
    await expect(canvas.getByText('You are all caught up')).toBeVisible();
    await expect(canvas.getByText('1 unread notification')).toBeVisible();
    const [off] = canvas.getAllByRole('button', { name: 'Mark all as read' });
    await expect(off).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(off!);
    await expect(emptySpy).not.toHaveBeenCalled();
  },
};
const emptySpy = fn();

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => <Demo start={12480} />,
  play: async ({ canvas }) => {
    const text = canvas.getByText(/unread notifications/);
    await expect(text.scrollWidth).toBeGreaterThan(text.clientWidth);
    await expect(text.getBoundingClientRect().height).toBeLessThan(28);
    await expect(canvas.getByRole('button', { name: 'Mark all as read' })).toBeVisible();
    const bar = text.parentElement as HTMLElement;
    await expect(bar.scrollWidth).toBeLessThanOrEqual(bar.clientWidth + 1);
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
