import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { NotificationItem } from './notification';
import { NotificationGroupHeader } from './notification-group-header';

type Args = { label: string; count: number; collapsible: boolean; sticky: boolean; collapsed: boolean; width: number };

const meta = {
  title: 'Components/Notifications/Notification Group Header',
  parameters: {
    docs: {
      description: {
        component:
          'The label above one group of notifications ("Today", "Earlier") with its count and a fold toggle. A heading with a button inside: aria-expanded and aria-controls say what it folds, and the name reads "Today 3 notifications". Sticky: it stays at the top of the scroll area until the next group pushes it away. Code only (no Figma component yet).',
      },
    },
  },
  args: { label: 'Today', count: 3, collapsible: true, sticky: true, collapsed: false, width: 360 },
  argTypes: {
    label: { name: 'Label', control: 'text', description: 'The group name; truncates on one line.', table: { category: 'Group Header' } },
    count: { name: 'Count', control: { type: 'range', min: 0, max: 1000, step: 1 }, description: 'Notifications in the group.', table: { category: 'Group Header' } },
    collapsible: { name: 'Collapsible', control: 'boolean', description: 'Show the fold toggle. Off: a plain heading with the count.', table: { category: 'Group Header' } },
    collapsed: { name: 'Start folded', control: 'boolean', description: 'Starting state of the toggle.', table: { category: 'Group Header' } },
    sticky: { name: 'Sticky', control: 'boolean', description: 'Pin to the top of the scroll area.', table: { category: 'Group Header' } },
    width: { name: 'Width', control: { type: 'range', min: 240, max: 480, step: 4 }, description: 'Container width in px.', table: { category: 'Layout' } },
  },
  render: ({ collapsed, width, ...args }) => (
    <div style={{ width, maxWidth: '100%' }}>
      <NotificationGroupHeader key={String(collapsed)} defaultCollapsed={collapsed} {...args} />
    </div>
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

const rows = [
  ['Maria approved invoice INV-1041', '2 h ago · Approvals'],
  ['Payment of EUR 1,240.00 received', '3 h ago · Billing'],
  ['Daniel commented on Q3 budget', '5 h ago · Comments'],
  ['Your report is ready to download', '6 h ago · Reports'],
  ['Acme Pro renews on 1 April', 'Yesterday · Billing'],
  ['Two new people joined Acme Europe', 'Yesterday · Team'],
  ['Weekly summary is ready', '2 days ago · Reports'],
];

function ScrollDemo() {
  return (
    <div data-testid="scroll" className="h-64 w-[360px] max-w-full overflow-y-auto rounded-lg border border-border bg-popover p-2">
      <div>
        <NotificationGroupHeader label="Today" count={4} controls="gh-today" />
        <ul id="gh-today" aria-label="Today" className="m-0 flex flex-col gap-1 p-0">
          {rows.slice(0, 4).map(([m, t]) => <NotificationItem key={m} message={m} meta={t} initials="AC" />)}
        </ul>
      </div>
      <div>
        <NotificationGroupHeader label="Earlier" count={3} controls="gh-earlier" />
        <ul id="gh-earlier" aria-label="Earlier" className="m-0 flex flex-col gap-1 p-0">
          {rows.slice(4).map(([m, t]) => <NotificationItem key={m} message={m} meta={t} initials="AC" />)}
        </ul>
      </div>
    </div>
  );
}

/** Two groups in a scroll area: each header sticks while its group scrolls under it. */
export const InAScrollArea: Story = {
  parameters: { controls: { disable: true } },
  render: () => <ScrollDemo />,
};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => {
    return (
      <div className="w-[360px]">
        <NotificationGroupHeader label="Today" count={3} controls="list-1" onCollapsedChange={fn()} />
        <ul id="list-1" aria-label="Today" className="m-0 p-0" />
      </div>
    );
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { level: 3, name: 'Today 3 notifications' })).toBeVisible();
    const toggle = canvas.getByRole('button', { name: 'Today 3 notifications' });
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(toggle).toHaveAttribute('aria-controls', 'list-1');
    await userEvent.click(toggle);
    await waitFor(() => expect(toggle).toHaveAttribute('aria-expanded', 'false'));
    // Keyboard: Tab reaches it, Enter and Space fold and unfold.
    toggle.blur();
    await userEvent.tab();
    await expect(toggle).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(toggle).toHaveAttribute('aria-expanded', 'true'));
    await userEvent.keyboard(' ');
    await waitFor(() => expect(toggle).toHaveAttribute('aria-expanded', 'false'));
  },
};

export const SingularAndPlain: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex w-[360px] flex-col gap-2">
      <NotificationGroupHeader label="Yesterday" count={1} />
      <NotificationGroupHeader label="Last week" count={12} collapsible={false} />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Yesterday 1 notification' })).toBeVisible();
    await expect(canvas.getByRole('heading', { name: 'Last week 12 notifications' })).toBeVisible();
    await expect(canvas.queryByRole('button', { name: /Last week/ })).toBeNull();
  },
};

export const StickyCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <ScrollDemo />,
  play: async ({ canvas }) => {
    const scroller = canvas.getByTestId('scroll');
    const today = canvas.getByRole('heading', { name: /^Today/ }).parentElement as HTMLElement;
    const earlier = canvas.getByRole('heading', { name: /^Earlier/ }).parentElement as HTMLElement;
    scroller.scrollTop = 120;
    await waitFor(() => expect(Math.abs(today.getBoundingClientRect().top - scroller.getBoundingClientRect().top)).toBeLessThan(14));
    scroller.scrollTop = scroller.scrollHeight;
    await waitFor(() => expect(Math.abs(earlier.getBoundingClientRect().top - scroller.getBoundingClientRect().top)).toBeLessThan(14));
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => <NotificationGroupHeader label="Approvals waiting for the regional accounts payable team" count={12480} />,
  play: async ({ canvas }) => {
    const toggle = canvas.getByRole('button');
    await expect(toggle.scrollWidth).toBeLessThanOrEqual(toggle.clientWidth + 1);
    await expect(toggle.getBoundingClientRect().height).toBeLessThan(40);
    await expect(canvas.getByText('99+')).toBeVisible();
    await expect(toggle).toHaveAccessibleName(/12,480 notifications/);
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
