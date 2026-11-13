import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { ChannelPreferences, type PreferenceEvent, type PreferenceMatrix } from './channel-preferences';

type Args = { eventCount: number; showSummary: boolean; showCaption: boolean; disabled: boolean; width: number };

const events: PreferenceEvent[] = [
  { id: 'paid', label: 'Invoice paid' },
  { id: 'overdue', label: 'Invoice overdue' },
  { id: 'comment', label: 'New comment' },
  { id: 'report', label: 'Report ready' },
  { id: 'login', label: 'New sign-in' },
  { id: 'plan', label: 'Plan renews' },
];

const described: PreferenceEvent[] = [
  { id: 'paid', label: 'Invoice paid', description: 'A customer pays one of your invoices.' },
  { id: 'overdue', label: 'Invoice overdue', description: 'An invoice is past its due date.' },
  { id: 'comment', label: 'New comment', description: 'Someone replies in a thread you follow.' },
];

const start: PreferenceMatrix = {
  paid: { email: true, push: true, inapp: true },
  overdue: { email: true, push: false, inapp: true },
  comment: { email: false, push: false, inapp: true },
  report: { email: true },
  login: { email: true, push: true },
  plan: {},
};

const meta = {
  title: 'Components/Notifications/Channel Preferences',
  parameters: {
    docs: {
      description: {
        component:
          'A matrix of events by channels (Email, Push, In app) with a switch in every cell, a switch in each column header that turns the channel on or off for all events, and a one-line summary under each event ("Email, In app"). A real table: caption, column headers, row headers. Every switch is named by its row and column ("Invoice paid by Email"). Code only (no Figma component yet).',
      },
    },
  },
  args: { eventCount: 4, showSummary: true, showCaption: false, disabled: false, width: 440 },
  argTypes: {
    eventCount: { name: 'Events', control: { type: 'range', min: 1, max: 6, step: 1 }, description: 'How many event rows.', table: { category: 'Preferences' } },
    disabled: { name: 'Disabled', control: 'boolean', description: 'Blocks every switch.', table: { category: 'Preferences' } },
    showSummary: { name: 'Show summary', control: 'boolean', description: 'The "Email, In app" line under each event.', table: { category: 'Parts' } },
    showCaption: { name: 'Show caption', control: 'boolean', description: 'Show the table caption (always there for screen readers).', table: { category: 'Parts' } },
    width: { name: 'Width', control: { type: 'range', min: 276, max: 640, step: 4 }, description: 'Container width in px.', table: { category: 'Layout' } },
  },
  render: ({ eventCount, width, ...args }) => (
    <div style={{ width, maxWidth: '100%' }}>
      <ChannelPreferences key={eventCount} events={events.slice(0, eventCount)} defaultValue={start} caption="Notification channels by event" {...args} />
    </div>
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Each event with a sentence of what triggers it, and the caption on show. */
export const WithDescriptions: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="w-[480px] max-w-full">
      <ChannelPreferences events={described} defaultValue={start} caption="Choose where each update reaches you" showCaption />
    </div>
  ),
};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="w-[440px]">
      <ChannelPreferences events={events.slice(0, 4)} defaultValue={start} onValueChange={changeSpy} />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('table', { name: 'Notification channels by event' })).toBeVisible();
    await expect(canvas.getAllByRole('columnheader')).toHaveLength(4);
    await expect(canvas.getAllByRole('rowheader')).toHaveLength(4);
    await expect(canvas.getAllByRole('switch')).toHaveLength(3 + 12);
    const paid = canvas.getByRole('rowheader', { name: /Invoice paid/ });
    await expect(paid).toHaveTextContent('Email, Push, In app');

    // One cell: Report ready by Push on, the summary follows.
    const report = canvas.getByRole('rowheader', { name: /Report ready/ });
    await expect(report).toHaveTextContent('Email');
    const cell = canvas.getByRole('switch', { name: 'Report ready by Push' });
    await expect(cell).not.toBeChecked();
    await userEvent.click(cell);
    await waitFor(() => expect(cell).toBeChecked());
    await waitFor(() => expect(report).toHaveTextContent('Email, Push'));
    await expect(changeSpy).toHaveBeenCalled();

    // Header switch: Push for every event.
    const all = canvas.getByRole('switch', { name: 'All Push' });
    await expect(all).not.toBeChecked();
    await userEvent.click(all);
    await waitFor(() => expect(all).toBeChecked());
    await expect(canvas.getByRole('switch', { name: 'Invoice overdue by Push' })).toBeChecked();
    await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('Push on for 4 events'));
    // Turning one cell off clears the header switch.
    await userEvent.click(canvas.getByRole('switch', { name: 'New comment by Push' }));
    await waitFor(() => expect(all).not.toBeChecked());

    // Keyboard: focus a switch and press Space.
    const email = canvas.getByRole('switch', { name: 'New comment by Email' });
    email.focus();
    await expect(email).toHaveFocus();
    await userEvent.keyboard(' ');
    await waitFor(() => expect(email).toBeChecked());
    await expect(within(canvas.getByRole('row', { name: /New comment/ })).getAllByRole('switch')).toHaveLength(3);
  },
};
const changeSpy = fn();

export const DisabledCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <div className="w-[440px]"><ChannelPreferences events={events.slice(0, 2)} defaultValue={start} disabled /></div>,
  play: async ({ canvas }) => {
    for (const s of canvas.getAllByRole('switch')) await expect(s).toBeDisabled();
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => (
    <ChannelPreferences
      events={[
        { id: 'a', label: 'Weekly accounts payable ageing report for all Acme Europe entities', description: 'Sent to the regional controller of every legal entity in the group.' },
        { id: 'b', label: 'Supplier invoice approved' },
        ...events.slice(0, 4),
      ]}
      defaultValue={start}
      channels={[{ key: 'email', label: 'Email' }, { key: 'push', label: 'Push' }, { key: 'inapp', label: 'In app' }]}
    />
  ),
  play: async ({ canvas }) => {
    const root = canvas.getByRole('table').parentElement as HTMLElement;
    await expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth + 1);
    await expect(canvas.getByRole('table').getBoundingClientRect().width).toBeLessThanOrEqual(276);
    await expect(canvas.getAllByRole('switch')).toHaveLength(3 + 18);
    await expect(canvas.getByRole('switch', { name: 'Weekly accounts payable ageing report for all Acme Europe entities by In app' })).toBeVisible();
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
