import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { NotificationInbox, type InboxNotification } from './notification-inbox';

type Args = { title: string; defaultTab: 'all' | 'unread'; showSettings: boolean; maxHeight: number; width: number };

// Fixed clock: nothing here depends on today's date.
const NOW = '2026-03-12T12:00:00';

const items: InboxNotification[] = [
  { id: 'n1', message: 'Maria approved invoice INV-1041', meta: '2 h ago · Approvals', date: '2026-03-12T10:05:00', unread: true, initials: 'MP', href: '#inv-1041' },
  { id: 'n2', message: 'Payment of EUR 1,240.00 received from Northwind', meta: '3 h ago · Billing', date: '2026-03-12T09:10:00', unread: true, initials: 'NW', href: '#payment' },
  { id: 'n3', message: 'Daniel commented on the Q3 budget', meta: '5 h ago · Comments', date: '2026-03-12T07:00:00', initials: 'DR', href: '#budget' },
  { id: 'n4', message: 'Your Acme Pro plan renews on 1 April', meta: 'Yesterday · Billing', date: '2026-03-11T16:20:00', unread: true, initials: 'AC', href: '#plan' },
  { id: 'n5', message: 'Two new people joined Acme Europe', meta: 'Yesterday · Team', date: '2026-03-11T09:00:00', initials: 'AE', href: '#team' },
  { id: 'n6', message: 'The February report is ready to download', meta: '3 days ago · Reports', date: '2026-03-09T09:00:00', initials: 'RP', href: '#report' },
];

const meta = {
  title: 'Components/Notifications/Notification Inbox',
  parameters: {
    docs: {
      description: {
        component:
          'The panel behind the bell, fuller than Notification Center: title with Mark all as read, tabs All and Unread with counts, notifications grouped Today and Earlier under sticky group headers (measured from a fixed `now`), an empty state per tab and a footer link to settings. Mark all as read stays in the tab order (aria-disabled at 0) and one polite status says the result. Code only (no Figma component yet).',
      },
    },
  },
  args: { title: 'Notifications', defaultTab: 'all', showSettings: true, maxHeight: 360, width: 400 },
  argTypes: {
    title: { name: 'Title', control: 'text', description: 'Panel heading.', table: { category: 'Inbox' } },
    defaultTab: { name: 'Starting tab', control: 'inline-radio', options: ['all', 'unread'], description: 'Tab shown first.', table: { category: 'Inbox' } },
    maxHeight: { name: 'Scroll height', control: { type: 'range', min: 160, max: 600, step: 10 }, description: 'Height of the scroll area in px.', table: { category: 'Inbox' } },
    showSettings: { name: 'Show settings link', control: 'boolean', description: 'The footer link.', table: { category: 'Parts' } },
    width: { name: 'Width', control: { type: 'range', min: 276, max: 520, step: 4 }, description: 'Container width in px.', table: { category: 'Layout' } },
  },
  render: ({ showSettings, width, defaultTab, ...args }) => (
    <div style={{ width, maxWidth: '100%' }}>
      <NotificationInbox key={defaultTab} items={items} now={NOW} defaultTab={defaultTab} settingsHref={showSettings ? '#settings' : undefined} {...args} />
    </div>
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Everything is read: the Unread tab shows the caught up state. */
export const CaughtUp: Story = {
  args: { defaultTab: 'unread' },
  render: ({ width }) => (
    <div style={{ width, maxWidth: '100%' }}>
      <NotificationInbox items={items.map(n => ({ ...n, unread: false }))} now={NOW} defaultTab="unread" settingsHref="#settings" />
    </div>
  ),
};

/** A new account with no notifications. */
export const Empty: Story = {
  render: ({ width }) => (
    <div style={{ width, maxWidth: '100%' }}>
      <NotificationInbox items={[]} now={NOW} settingsHref="#settings" />
    </div>
  ),
};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="w-[400px]">
      <NotificationInbox items={items} now={NOW} settingsHref="#settings" onMarkAllRead={markSpy} />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('region', { name: 'Notifications' })).toBeVisible();
    // Tabs with counts, groups from the fixed clock.
    await expect(canvas.getByRole('tab', { name: 'All 6' })).toHaveAttribute('aria-selected', 'true');
    await expect(canvas.getByRole('tab', { name: 'Unread 3' })).toBeVisible();
    await expect(canvas.getByRole('heading', { name: 'Today 3 notifications' })).toBeVisible();
    await expect(canvas.getByRole('heading', { name: 'Earlier 3 notifications' })).toBeVisible();
    await expect(within(canvas.getByRole('list', { name: 'Today' })).getAllByRole('listitem')).toHaveLength(3);
    await expect(canvas.getByRole('link', { name: /Unread: Maria approved invoice/ })).toBeVisible();
    await expect(canvas.getByRole('link', { name: 'Notification settings' })).toHaveAttribute('href', '#settings');

    // Fold a group: its list is hidden, the header says so.
    const earlier = canvas.getByRole('button', { name: 'Earlier 3 notifications' });
    await userEvent.click(earlier);
    await waitFor(() => expect(earlier).toHaveAttribute('aria-expanded', 'false'));
    await expect(canvas.queryByRole('list', { name: 'Earlier' })).toBeNull();
    await userEvent.click(earlier);
    await waitFor(() => expect(earlier).toHaveAttribute('aria-expanded', 'true'));

    // Unread tab: only unread rows, then Mark all as read.
    await userEvent.click(canvas.getByRole('tab', { name: 'Unread 3' }));
    await waitFor(() => expect(canvas.getAllByRole('listitem')).toHaveLength(3));
    await expect(canvas.queryByRole('heading', { name: /^Earlier 3/ })).toBeNull();
    const mark = canvas.getByRole('button', { name: 'Mark all as read' });
    await userEvent.click(mark);
    await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('3 notifications marked as read.'));
    await expect(markSpy).toHaveBeenCalled();
    await expect(canvas.getByRole('tab', { name: 'Unread 0' })).toBeVisible();
    await expect(canvas.getByRole('heading', { name: 'You are all caught up' })).toBeVisible();
    // The button is off but keeps focus, and a second click does nothing.
    await expect(mark).toHaveAttribute('aria-disabled', 'true');
    await expect(mark).toHaveFocus();
  },
};
const markSpy = fn();

export const KeyboardCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="w-[400px]">
      <NotificationInbox items={items} now={NOW} settingsHref="#settings" />
    </div>
  ),
  play: async ({ canvas }) => {
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Mark all as read' })).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole('tab', { name: 'All 6' })).toHaveFocus();
    // Arrow key moves to Unread and selects it.
    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => expect(canvas.getByRole('tab', { name: 'Unread 3' })).toHaveAttribute('aria-selected', 'true'));
    // The tab panel takes focus next (a scrollable region), then the first group toggle.
    await userEvent.tab();
    await waitFor(() => expect(canvas.getByRole('tabpanel')).toHaveFocus());
    await userEvent.tab();
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Today 2 notifications' })).toHaveFocus());
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Today 2 notifications' })).toHaveAttribute('aria-expanded', 'false'));
  },
};

export const StickyCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="w-[400px]">
      <NotificationInbox items={items} now={NOW} maxHeight={200} />
    </div>
  ),
  play: async ({ canvasElement, canvas }) => {
    const scroller = canvasElement.querySelector('[data-slot="notification-inbox-scroll"]') as HTMLElement;
    await expect(scroller.scrollHeight).toBeGreaterThan(scroller.clientHeight);
    const header = canvas.getByRole('heading', { name: /^Today/ }).parentElement as HTMLElement;
    scroller.scrollTop = 60;
    await waitFor(() => expect(Math.abs(header.getBoundingClientRect().top - scroller.getBoundingClientRect().top)).toBeLessThan(10));
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => (
    <NotificationInbox
      title="Notifications for the regional accounts payable team of Acme Europe"
      now={NOW}
      settingsHref="#settings"
      items={[
        { id: 's1', message: 'Maria Papadopoulou-Konstantinidis approved supplier invoice INV-2026-0001041 for Northwind Traders Europe', meta: '2 h ago · Approvals for the regional accounts payable team', date: '2026-03-12T10:05:00', unread: true, initials: 'MP', href: '#a' },
        ...Array.from({ length: 300 }, (_, i): InboxNotification => ({ id: `x${i}`, message: `Report ${i + 1} is ready`, meta: 'Yesterday', date: '2026-03-11T09:00:00', initials: 'RP', href: '#r' })),
      ]}
    />
  ),
  play: async ({ canvas }) => {
    const panel = canvas.getByRole('region');
    await expect(panel.scrollWidth).toBeLessThanOrEqual(panel.clientWidth + 1);
    await expect(canvas.getByRole('tab', { name: 'All 301' })).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Mark all as read' })).toBeVisible();
    const h = canvas.getByRole('heading', { level: 2 });
    await expect(h.scrollWidth).toBeGreaterThan(h.clientWidth);
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
