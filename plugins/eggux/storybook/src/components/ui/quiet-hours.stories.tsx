import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, waitFor } from 'storybook/test';
import { QuietHours, describeQuietHours, type QuietHoursValue, type Weekday } from './quiet-hours';

type Preset = 'weekdays' | 'weekends' | 'every day' | 'Monday only';
type Args = { enabled: boolean; from: string; to: string; days: Preset; width: number };

const presets: Record<Preset, Weekday[]> = {
  weekdays: ['mon', 'tue', 'wed', 'thu', 'fri'],
  weekends: ['sat', 'sun'],
  'every day': ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
  'Monday only': ['mon'],
};
const times = ['00:00', '06:00', '07:00', '08:00', '12:00', '21:00', '22:00', '23:00', '23:30'];

const meta = {
  title: 'Components/Notifications/Quiet Hours',
  parameters: {
    docs: {
      description: {
        component:
          'A schedule that mutes notifications: a switch, a start and an end time (every 30 minutes; an end before the start means through the night), seven weekday chips and one summary sentence, "Muted 22:00 to 07:00 on weekdays". The summary is the only live region. Off disables the schedule controls together. Code only (no Figma component yet).',
      },
    },
  },
  args: { enabled: true, from: '22:00', to: '07:00', days: 'weekdays', width: 420 },
  argTypes: {
    enabled: { name: 'On', control: 'boolean', description: 'The quiet hours switch.', table: { category: 'Quiet Hours' } },
    from: { name: 'From', control: 'select', options: times, description: 'Start time, 24 hour clock.', table: { category: 'Quiet Hours' } },
    to: { name: 'To', control: 'select', options: times, description: 'End time. Earlier than the start means through the night.', table: { category: 'Quiet Hours' } },
    days: { name: 'Days', control: 'select', options: Object.keys(presets), description: 'Which weekdays are muted.', table: { category: 'Quiet Hours' } },
    width: { name: 'Width', control: { type: 'range', min: 276, max: 520, step: 4 }, description: 'Container width in px.', table: { category: 'Layout' } },
  },
  render: ({ enabled, from, to, days, width }) => (
    <div style={{ width, maxWidth: '100%' }}>
      <QuietHours key={`${enabled}${from}${to}${days}`} defaultValue={{ enabled, from, to, days: presets[days] }} />
    </div>
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Switched off: the schedule is disabled and the summary says so. */
export const Off: Story = { args: { enabled: false } };

export const DefaultCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <div className="w-[420px]"><QuietHours onValueChange={changeSpy} /></div>,
  play: async ({ canvas }) => {
    const summary = canvas.getByText('Muted 22:00 to 07:00 on weekdays');
    await expect(summary).toHaveAttribute('role', 'status');
    await expect(canvas.getByRole('combobox', { name: 'From' })).toHaveTextContent('22:00');
    await expect(canvas.getByRole('combobox', { name: 'To' })).toHaveTextContent('07:00');
    await expect(canvas.getByRole('toolbar', { name: 'Days' })).toBeVisible();

    // Keyboard: Tab goes switch, From, To, then the first chip.
    await userEvent.tab();
    await expect(canvas.getByRole('switch', { name: 'Quiet hours' })).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole('combobox', { name: 'From' })).toHaveFocus();

    // Pick a later start from the list.
    await userEvent.click(canvas.getByRole('combobox', { name: 'From' }));
    const option = await screen.findByRole('option', { name: '23:00' });
    await userEvent.click(option);
    await waitFor(() => expect(canvas.getByText('Muted 23:00 to 07:00 on weekdays')).toBeVisible());

    // Chips: Saturday joins, then Sunday makes it every day.
    const sat = canvas.getByRole('button', { name: 'Sat' });
    await expect(sat).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(sat);
    await waitFor(() => expect(sat).toHaveAttribute('aria-pressed', 'true'));
    await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('Muted 23:00 to 07:00 on Mon, Tue, Wed, Thu, Fri and Sat'));
    await userEvent.click(canvas.getByRole('button', { name: 'Sun' }));
    await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('Muted 23:00 to 07:00 every day'));
    await expect(changeSpy).toHaveBeenCalled();

    // Off: the controls are disabled and the summary says so.
    await userEvent.click(canvas.getByRole('switch', { name: 'Quiet hours' }));
    await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('Quiet hours are off'));
    await expect(canvas.getByRole('combobox', { name: 'From' })).toBeDisabled();
    await expect(canvas.getByRole('button', { name: 'Mon' })).toBeDisabled();
  },
};
const changeSpy = fn();

export const SummaryCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <div />,
  play: async () => {
    const base: QuietHoursValue = { enabled: true, from: '22:00', to: '07:00', days: ['mon', 'tue', 'wed', 'thu', 'fri'] };
    await expect(describeQuietHours(base)).toBe('Muted 22:00 to 07:00 on weekdays');
    await expect(describeQuietHours({ ...base, days: ['sat', 'sun'] })).toBe('Muted 22:00 to 07:00 on weekends');
    await expect(describeQuietHours({ ...base, days: ['mon'] })).toBe('Muted 22:00 to 07:00 on Mondays');
    await expect(describeQuietHours({ ...base, days: ['mon', 'wed', 'fri'] })).toBe('Muted 22:00 to 07:00 on Mon, Wed and Fri');
    await expect(describeQuietHours({ ...base, days: [] })).toBe('Choose at least one day');
    await expect(describeQuietHours({ ...base, to: '22:00' })).toBe('Choose different start and end times');
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => <QuietHours label="Quiet hours for the regional accounts payable team" defaultValue={{ enabled: true, from: '23:30', to: '06:00', days: ['mon', 'wed', 'fri', 'sat'] }} />,
  play: async ({ canvas }) => {
    const root = canvas.getByRole('toolbar', { name: 'Days' }).closest('[data-slot=quiet-hours]') as HTMLElement;
    await expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth + 1);
    const group = canvas.getByRole('toolbar', { name: 'Days' });
    await expect(group.getBoundingClientRect().height).toBeGreaterThan(36);
    await expect(canvas.getByRole('status')).toHaveTextContent('Muted 23:30 to 06:00 on Mon, Wed, Fri and Sat');
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
