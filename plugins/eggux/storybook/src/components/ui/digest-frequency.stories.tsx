import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { DigestFrequency, type DigestDay, type DigestMode } from './digest-frequency';

type Args = { mode: DigestMode; time: string; day: DigestDay; width: number };

const meta = {
  title: 'Components/Notifications/Digest Frequency',
  parameters: {
    docs: {
      description: {
        component:
          'How often email notifications are bundled: three radio cards, Instant, Daily and Weekly. The chosen card opens its schedule (a time for Daily; a weekday and a time for Weekly) and a polite sentence says the result ("You will get one summary every Monday at 09:00."). Arrow keys move between the cards. Code only (no Figma component yet).',
      },
    },
  },
  args: { mode: 'daily', time: '09:00', day: 'monday', width: 420 },
  argTypes: {
    mode: { name: 'Frequency', control: 'inline-radio', options: ['instant', 'daily', 'weekly'], description: 'Starting choice.', table: { category: 'Digest' } },
    time: { name: 'Time', control: 'select', options: ['07:00', '09:00', '12:00', '18:00'], description: 'Send time for Daily and Weekly.', table: { category: 'Digest' } },
    day: { name: 'Weekday', control: 'select', options: ['monday', 'wednesday', 'friday', 'sunday'], description: 'Send day for Weekly.', table: { category: 'Digest' } },
    width: { name: 'Width', control: { type: 'range', min: 276, max: 520, step: 4 }, description: 'Container width in px.', table: { category: 'Layout' } },
  },
  render: ({ mode, time, day, width }) => (
    <div style={{ width, maxWidth: '100%' }}>
      <DigestFrequency key={`${mode}${time}${day}`} defaultValue={{ mode, time, day }} />
    </div>
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Weekly opens the weekday and the time. */
export const Weekly: Story = { args: { mode: 'weekly', day: 'friday', time: '18:00' } };

export const DefaultCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <div className="w-[420px]"><DigestFrequency onValueChange={changeSpy} /></div>,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('radiogroup', { name: 'Email digest' })).toBeVisible();
    await expect(canvas.getByRole('radio', { name: 'Daily' })).toBeChecked();
    await expect(canvas.getByRole('combobox', { name: 'Send at' })).toHaveTextContent('09:00');
    await expect(canvas.queryByRole('combobox', { name: 'Send on' })).toBeNull();
    await expect(canvas.getByRole('status')).toHaveTextContent('You will get one summary every day at 09:00.');

    // Weekly opens the weekday.
    await userEvent.click(canvas.getByRole('radio', { name: 'Weekly' }));
    await waitFor(() => expect(canvas.getByRole('combobox', { name: 'Send on' })).toHaveTextContent('Monday'));
    await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('You will get one summary every Monday at 09:00.'));
    await expect(changeSpy).toHaveBeenCalled();

    // Instant needs no schedule.
    await userEvent.click(canvas.getByRole('radio', { name: 'Instant' }));
    await waitFor(() => expect(canvas.queryByRole('combobox')).toBeNull());
    await expect(canvas.getByRole('status')).toHaveTextContent('You will get an email for each notification as it happens.');
  },
};
const changeSpy = fn();

export const KeyboardCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <div className="w-[420px]"><DigestFrequency /></div>,
  play: async ({ canvas }) => {
    // Tab lands on the chosen card, arrows move and choose, Tab goes on to the schedule.
    await userEvent.tab();
    await expect(canvas.getByRole('radio', { name: 'Daily' })).toHaveFocus();
    // The key is held until the focus has moved: Radix checks a card when focus arrives by arrow key.
    await userEvent.keyboard('{ArrowDown>}');
    await waitFor(() => expect(canvas.getByRole('radio', { name: 'Weekly' })).toHaveFocus());
    await userEvent.keyboard('{/ArrowDown}');
    await waitFor(() => expect(canvas.getByRole('radio', { name: 'Weekly' })).toBeChecked());
    await userEvent.keyboard('{ArrowUp>}');
    await waitFor(() => expect(canvas.getByRole('radio', { name: 'Daily' })).toHaveFocus());
    await userEvent.keyboard('{/ArrowUp}');
    await waitFor(() => expect(canvas.getByRole('radio', { name: 'Daily' })).toBeChecked());
    await userEvent.tab();
    await expect(canvas.getByRole('combobox', { name: 'Send at' })).toHaveFocus();
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => <DigestFrequency label="Email digest for the regional accounts payable team" defaultValue={{ mode: 'weekly', time: '18:00', day: 'wednesday' }} />,
  play: async ({ canvas }) => {
    const root = canvas.getByRole('radiogroup').parentElement as HTMLElement;
    await expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth + 1);
    await expect(canvas.getByRole('combobox', { name: 'Send on' })).toBeVisible();
    await expect(canvas.getByRole('combobox', { name: 'Send at' })).toBeVisible();
    await expect(canvas.getByRole('status')).toHaveTextContent('every Wednesday at 18:00');
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
