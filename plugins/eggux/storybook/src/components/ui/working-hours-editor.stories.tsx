import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { WorkingHoursEditor, defaultWorkingHours, type WorkingHours } from './working-hours-editor';

type Args = { step: 15 | 30 | 60; hour12: boolean; weekStartsOn: 0 | 1; showTotal: boolean; showCopy: boolean; disabled: boolean; width: number };

const meta = {
  title: 'Components/Date and Time/Working Hours Editor',
  parameters: {
    docs: {
      description: {
        component:
          'Seven weekday rows, each with a switch that opens or closes the day and from and to time selects. A day cannot end before it starts. The Copy button of a row copies its hours to every day. The foot shows the weekly total. Times are native selects, so mobile gets the system picker. Code only (no Figma component yet).',
      },
    },
  },
  args: { step: 30, hour12: false, weekStartsOn: 1, showTotal: true, showCopy: true, disabled: false, width: 480 },
  argTypes: {
    step: { name: 'Step', control: 'inline-radio', options: [15, 30, 60], description: 'Minutes between the times offered.', table: { category: 'Editor' } },
    hour12: { name: '12-hour times', control: 'boolean', description: 'Show 9:00 AM instead of 09:00.', table: { category: 'Editor' } },
    weekStartsOn: { name: 'Week starts on', control: 'inline-radio', options: [1, 0], description: '1 is Monday, 0 is Sunday.', table: { category: 'Editor' } },
    showTotal: { name: 'Show total', control: 'boolean', description: 'The weekly total in the foot.', table: { category: 'Parts' } },
    showCopy: { name: 'Show copy button', control: 'boolean', description: 'Copy the hours of a day to all days.', table: { category: 'Parts' } },
    disabled: { name: 'Disabled', control: 'boolean', description: 'Disables every switch, select and button.', table: { category: 'State' } },
    width: { name: 'Width', control: { type: 'range', min: 276, max: 640, step: 4 }, description: 'Width of the container in px: the times wrap under the day name.', table: { category: 'Layout' } },
  },
  render: function Render({ step, hour12, weekStartsOn, showTotal, showCopy, disabled, width }) {
    const [value, setValue] = React.useState<WorkingHours>(defaultWorkingHours);
    return (
      <div style={{ width, maxWidth: '100%' }}>
        <WorkingHoursEditor value={value} onValueChange={setValue} step={step} hour12={hour12} weekStartsOn={weekStartsOn} showTotal={showTotal} showCopy={showCopy} disabled={disabled} />
      </div>
    );
  },
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const TwelveHour: Story = { args: { hour12: true, step: 60 } };

export const DefaultCheck: Story = {
  tags: ['!dev'],
  render: () => <WorkingHoursEditor onValueChange={fn()} />,
  play: async ({ canvas }) => {
    const group = canvas.getByRole('group', { name: 'Working hours' });
    await expect(group).toBeVisible();
    await expect(canvas.getAllByRole('switch')).toHaveLength(7);
    await expect(canvas.getByRole('switch', { name: 'Monday' })).toBeChecked();
    await expect(canvas.getByRole('switch', { name: 'Saturday' })).not.toBeChecked();
    await expect(canvas.getByText('Total 40 h per week')).toBeVisible();
    // Monday is first; the closed days say so and have no time selects.
    await expect(canvas.getAllByRole('switch')[0]).toHaveAccessibleName('Monday');
    await expect(canvas.queryByRole('combobox', { name: 'Saturday opens' })).toBeNull();
    await expect(canvas.getAllByText('Closed')).toHaveLength(2);

    // Opening Saturday shows its times with the same defaults.
    await userEvent.click(canvas.getByRole('switch', { name: 'Saturday' }));
    await waitFor(() => expect(canvas.getByRole('combobox', { name: 'Saturday opens' })).toHaveValue('09:00'));
    await expect(canvas.getByText('Total 48 h per week')).toBeVisible();
    await userEvent.click(canvas.getByRole('switch', { name: 'Saturday' }));
    await waitFor(() => expect(canvas.queryByRole('combobox', { name: 'Saturday opens' })).toBeNull());

    // The closing list starts after the opening time.
    const opens = canvas.getByRole('combobox', { name: 'Monday opens' });
    const closes = canvas.getByRole('combobox', { name: 'Monday closes' });
    await userEvent.selectOptions(opens, '10:00');
    await waitFor(() => expect(opens).toHaveValue('10:00'));
    await expect((closes as HTMLSelectElement).options[0]!.value).toBe('10:30');
    // Opening after the closing time pushes the closing time along.
    await userEvent.selectOptions(opens, '18:00');
    await waitFor(() => expect(canvas.getByRole('combobox', { name: 'Monday closes' })).toHaveValue('18:30'));
    await expect(canvas.getByText('Total 32 h 30 min per week')).toBeVisible();

    // Copy to all days: every day, closed ones too, takes Monday's hours.
    await userEvent.click(canvas.getByRole('button', { name: 'Copy Monday hours to all days' }));
    await waitFor(() => expect(canvas.getAllByRole('switch').every(s => s.getAttribute('aria-checked') === 'true')).toBe(true));
    await expect(canvas.getByRole('combobox', { name: 'Sunday closes' })).toHaveValue('18:30');
    await expect(canvas.getByRole('status')).toHaveTextContent('Monday hours copied to all days');
    await expect(canvas.getByText('Total 3 h 30 min per week')).toBeVisible();
  },
};

export const KeyboardCheck: Story = {
  tags: ['!dev'],
  args: { weekStartsOn: 0 },
  play: async ({ canvas }) => {
    // The week can start on Sunday.
    await expect(canvas.getAllByRole('switch')[0]).toHaveAccessibleName('Sunday');
    const sunday = canvas.getByRole('switch', { name: 'Sunday' });
    sunday.focus();
    await userEvent.keyboard(' ');
    await waitFor(() => expect(canvas.getByRole('switch', { name: 'Sunday' })).toBeChecked());
    // Tab goes switch, opens, closes, copy.
    await userEvent.tab();
    await expect(canvas.getByRole('combobox', { name: 'Sunday opens' })).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole('combobox', { name: 'Sunday closes' })).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Copy Sunday hours to all days' })).toHaveFocus();
  },
};

export const DisabledCheck: Story = {
  tags: ['!dev'],
  args: { disabled: true },
  play: async ({ canvas }) => {
    for (const s of canvas.getAllByRole('switch')) await expect(s).toBeDisabled();
    await expect(canvas.getByRole('combobox', { name: 'Monday opens' })).toBeDisabled();
    await expect(canvas.getByRole('button', { name: 'Copy Monday hours to all days' })).toBeDisabled();
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px] max-w-full"><Story /></div>],
  render: () => <WorkingHoursEditor hour12 step={15} defaultValue={defaultWorkingHours.map(d => ({ ...d, enabled: true, from: '08:15', to: '24:00' }))} />,
  play: async ({ canvas, canvasElement }) => {
    const root = canvasElement.firstElementChild as HTMLElement;
    await expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth + 1);
    // Wednesday is the longest name; its row wraps instead of overflowing.
    const row = canvas.getByRole('switch', { name: 'Wednesday' }).closest('[data-day]') as HTMLElement;
    await expect(row.scrollWidth).toBeLessThanOrEqual(row.clientWidth + 1);
    await expect(canvas.getByRole('combobox', { name: 'Wednesday closes' })).toBeVisible();
    await expect(canvas.getByText('Total 110 h 15 min per week')).toBeVisible();
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
