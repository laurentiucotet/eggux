import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, waitFor } from 'storybook/test';
import { BellButton } from './bell-button';
import { NotificationInbox, type InboxNotification } from './notification-inbox';

type Args = { count: number; open: boolean };

const NOW = '2026-03-12T12:00:00';
const items: InboxNotification[] = [
  { id: 'n1', message: 'Maria approved invoice INV-1041', meta: '2 h ago · Approvals', date: '2026-03-12T10:05:00', unread: true, initials: 'MP', href: '#inv-1041' },
  { id: 'n2', message: 'Payment of EUR 1,240.00 received from Northwind', meta: '3 h ago · Billing', date: '2026-03-12T09:10:00', unread: true, initials: 'NW', href: '#payment' },
  { id: 'n3', message: 'Your Acme Pro plan renews on 1 April', meta: 'Yesterday · Billing', date: '2026-03-11T16:20:00', unread: true, initials: 'AC', href: '#plan' },
];

const panel = <NotificationInbox items={items} now={NOW} settingsHref="#settings" maxHeight={280} />;

const meta = {
  title: 'Components/Notifications/Bell Button',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'The bell in a header: a ghost icon button with an unread count badge (99+ above 99, none at 0) that opens a popover holding the notification panel. The name is the count, "Notifications, 3 unread"; the badge is hidden from screen readers so the number is read once. Escape closes and returns focus to the bell. Code only (no Figma component yet).',
      },
    },
  },
  args: { count: 3, open: false },
  argTypes: {
    count: { name: 'Unread', control: { type: 'range', min: 0, max: 1000, step: 1 }, description: 'Unread notifications. 0 hides the badge, above 99 shows 99+.', table: { category: 'Bell Button' } },
    open: { name: 'Open', control: 'boolean', description: 'Start with the panel open.', table: { category: 'Bell Button' } },
  },
  render: ({ count, open }) => (
    <div className={open ? 'h-[520px] w-[440px]' : ''}>
      <div className="flex justify-end">
        <BellButton key={String(open)} count={count} defaultOpen={open}>{panel}</BellButton>
      </div>
    </div>
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** The badge at 0, 3, 99 and 120 unread. */
export const Counts: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex items-center gap-4">
      {[0, 3, 99, 120].map(n => <BellButton key={n} count={n} />)}
    </div>
  ),
};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex h-[520px] w-[440px] justify-end">
      <BellButton count={3} onOpenChange={openSpy}>{panel}</BellButton>
    </div>
  ),
  play: async ({ canvas }) => {
    const bell = canvas.getByRole('button', { name: 'Notifications, 3 unread' });
    await expect(bell).toHaveAttribute('aria-expanded', 'false');
    await expect(bell).toHaveAttribute('aria-haspopup', 'dialog');
    await expect(canvas.getByText('3')).toHaveAttribute('aria-hidden', 'true');
    // Keyboard: Tab reaches the bell, Enter opens the panel.
    await userEvent.tab();
    await expect(bell).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    const dialog = await screen.findByRole('dialog', { name: 'Notifications' });
    await expect(bell).toHaveAttribute('aria-expanded', 'true');
    await expect(await screen.findByRole('heading', { name: 'Notifications', level: 2 })).toBeVisible();
    await expect(dialog).toBeVisible();
    await expect(openSpy).toHaveBeenCalledWith(true);
    // Escape closes and focus returns to the bell.
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await waitFor(() => expect(bell).toHaveFocus());
  },
};
const openSpy = fn();

export const CountsCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex items-center gap-4">
      <BellButton count={0} />
      <BellButton count={99} />
      <BellButton count={120} />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Notifications' })).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Notifications, 99 unread' })).toBeVisible();
    const big = canvas.getByRole('button', { name: 'Notifications, 99+ unread' });
    await expect(big).toHaveTextContent('99+');
    await expect(canvas.getByRole('button', { name: 'Notifications' })).not.toHaveTextContent(/\d/);
    await expect(big.getBoundingClientRect().width).toBeLessThan(44);
  },
};

export const EmptyPanelCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <BellButton count={0} defaultOpen />,
  play: async () => {
    await expect(await screen.findByRole('dialog', { name: 'Notifications' })).toHaveTextContent('You are all caught up.');
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="flex w-[276px] justify-end"><Story /></div>],
  render: () => <BellButton count={1000000} label="Notifications for the regional accounts payable team" />,
  play: async ({ canvas }) => {
    const bell = canvas.getByRole('button');
    await expect(bell).toHaveAccessibleName('Notifications for the regional accounts payable team, 99+ unread');
    await expect(bell).toHaveTextContent('99+');
    await expect(bell.getBoundingClientRect().width).toBeLessThan(44);
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
