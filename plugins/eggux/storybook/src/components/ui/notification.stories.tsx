import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';
import { Button } from './button';
import { NotificationCenter, NotificationItem } from './notification';

type N = { id: string; initials: string; message: string; meta: string; type: string; unread: boolean; action?: string };
const seed: N[] = [
  { id: 'n1', initials: 'EP', message: 'Elena Popa approved INV-1041 for €2,450.00', meta: '2 h ago · Approvals', type: 'approvals', unread: true },
  { id: 'n2', initials: 'MS', message: 'Mark Schulz mentioned you in Q4 forecast', meta: 'Yesterday · Comments', type: 'mentions', unread: true },
  { id: 'n3', initials: 'AK', message: 'Aisha Khan asked you to approve PO-0193', meta: 'Yesterday · Approvals', type: 'approvals', unread: false, action: 'View invoice' },
  { id: 'n4', initials: 'AC', message: 'Export of 1,284 invoices is ready', meta: '2 days ago · Exports', type: 'exports', unread: false },
];

function CenterDemo({ tabs = true, initial = seed, title }: { tabs?: boolean; initial?: N[]; title?: string }) {
  const [items, setItems] = React.useState(initial);
  const [tab, setTab] = React.useState('all');
  const shown = items.filter(n => tab === 'all' || n.type === tab);
  const unread = items.filter(n => n.unread).length;
  return (
    <NotificationCenter
      className="w-[400px]"
      title={title}
      tabs={tabs ? [{ value: 'all', label: 'All' }, { value: 'mentions', label: 'Mentions' }, { value: 'approvals', label: 'Approvals' }] : undefined}
      tab={tab}
      onTabChange={setTab}
      unreadCount={unread}
      onMarkAllRead={() => setItems(i => i.map(n => ({ ...n, unread: false })))}
      viewAllHref="#notifications"
    >
      {shown.map(n => (
        <NotificationItem
          key={n.id}
          initials={n.initials}
          message={n.message}
          meta={n.meta}
          unread={n.unread}
          href={`#${n.id}`}
          onOpen={() => setItems(i => i.map(x => (x.id === n.id ? { ...x, unread: false } : x)))}
          actions={n.action ? <Button variant="outline" size="sm">{n.action}</Button> : undefined}
        />
      ))}
    </NotificationCenter>
  );
}

const meta = {
  title: 'Components/Notifications/Notification Center',
  component: NotificationCenter,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'The panel behind the bell: Mark all as read, optional tabs by type, newest first with unread on top (muted row and a dot), View all at the bottom. Opening the panel does not mark items read; opening an item does. Empty: "You are all caught up." At least 288 wide; on phones in a Sheet. Figma: Notifications page / Notification Center, Notification Item. Guide: eggux build-ui/patterns/notifications.md' } },
  },
  render: () => <CenterDemo />,
} satisfies Meta<typeof NotificationCenter>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();

// Figma: 400 panel, rows 64 (one line) and with actions, unread dot, tabs filter, mark all read.
export const Default: Story = {
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole('region', { name: 'Notifications' })).toBeInTheDocument();
    const rows = canvasElement.querySelectorAll('[data-slot="notification-item"]');
    await expect(rows).toHaveLength(4);
    await expect(Math.round(box(rows[1]!).height)).toBe(64);
    await expect(canvas.getByRole('link', { name: /Unread: Mark Schulz mentioned you/ })).toHaveAttribute('href', '#n2');
    await expect(canvasElement.querySelectorAll('[data-slot="notification-dot"]')).toHaveLength(2);
    await userEvent.click(canvas.getByRole('tab', { name: 'Mentions' }));
    await expect(canvasElement.querySelectorAll('[data-slot="notification-item"]')).toHaveLength(1);
    await userEvent.click(canvas.getByRole('tab', { name: 'All' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Mark all as read' }));
    await expect(canvasElement.querySelectorAll('[data-slot="notification-dot"]')).toHaveLength(0);
    await expect(canvas.getByRole('button', { name: 'Mark all as read' })).toBeDisabled();
    await expect(canvas.getByRole('link', { name: 'View all notifications' })).toHaveAttribute('href', '#notifications');
  },
};

// No tabs (one kind) and the empty panel.
export const NoTabsAndEmpty: Story = {
  render: () => (
    <div className="flex items-start gap-6">
      <CenterDemo tabs={false} />
      <CenterDemo tabs={false} initial={[]} title="Mentions" />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('tablist')).toBeNull();
    await expect(canvas.getByText('You are all caught up.')).toBeInTheDocument();
  },
};

// Stress: at 288 a long message clamps to 2 lines and the meta truncates. Tests only.
export const Stress: Story = {
  tags: ['!dev'],
  render: () => (
    <NotificationCenter className="w-[288px]">
      <NotificationItem
        unread
        initials="AC"
        href="#x"
        message="Alexandra-Maria Constantinescu-Ionescu approved INV-1041, INV-1042, INV-1043 and 12 more invoices for a total of €248,450.00"
        meta="2 h ago · Approvals · Finance Operations · Bucharest"
      />
    </NotificationCenter>
  ),
  play: async ({ canvasElement }) => {
    const row = canvasElement.querySelector('[data-slot="notification-item"]')!;
    const msg = row.querySelector('p')!;
    await expect(Math.round(box(msg).height)).toBe(40);
    const metaEl = row.querySelectorAll('p')[1]!;
    await expect(metaEl.scrollWidth).toBeGreaterThan(metaEl.clientWidth);
  },
};

export const DefaultDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' } };
