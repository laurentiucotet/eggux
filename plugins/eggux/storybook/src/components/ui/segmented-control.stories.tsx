import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { Calendar, List, LayoutGrid } from '@/components/icons';
import { SegmentedControl } from './segmented-control';

type Args = { options: number; selected: number; showIcons: boolean; fullWidth: boolean; disabled: boolean; width: number };

const all = [
  { value: 'day', label: 'Day', icon: <Calendar /> },
  { value: 'week', label: 'Week', icon: <List /> },
  { value: 'month', label: 'Month', icon: <LayoutGrid /> },
  { value: 'quarter', label: 'Quarter', icon: <Calendar /> },
  { value: 'year', label: 'Year', icon: <List /> },
];

const meta = {
  title: 'Components/Mobile/Segmented Control',
  parameters: {
    docs: {
      description: {
        component:
          'An iOS-style control of 2 to 5 short options with a sliding thumb. It is a radio group: one option is always chosen, arrow keys move and choose, Home and End jump, and only the chosen option is in the tab order. 44 high, options share the width and truncate; the thumb slides only when motion is allowed. Not for on/off settings (Switch) or more than 5 options (Select). Code only (no Figma component yet).',
      },
    },
  },
  args: { options: 3, selected: 0, showIcons: false, fullWidth: true, disabled: false, width: 340 },
  argTypes: {
    options: { name: 'Options', control: { type: 'range', min: 2, max: 5, step: 1 }, description: 'How many options, 2 to 5.', table: { category: 'Control' } },
    selected: { name: 'Selected option', control: { type: 'range', min: 0, max: 4, step: 1 }, description: 'Index of the chosen option.', table: { category: 'Control' } },
    fullWidth: { name: 'Full width', control: 'boolean', description: 'Fill the width or hug the options.', table: { category: 'Control' } },
    disabled: { name: 'Disabled', control: 'boolean', description: 'Blocks every option.', table: { category: 'Control' } },
    width: { name: 'Width', control: { type: 'range', min: 276, max: 420, step: 4 }, description: 'Width of the column in px.', table: { category: 'Control' } },
    showIcons: { name: 'Show icons', control: 'boolean', description: 'An icon before each label.', table: { category: 'Parts' } },
  },
  render: ({ options, selected, showIcons, fullWidth, disabled, width }) => {
    const list = all.slice(0, options).map(o => ({ ...o, icon: showIcons ? o.icon : undefined }));
    return (
      <div style={{ width }} className="max-w-full">
        <SegmentedControl key={`${options}-${selected}`} label="Report period" options={list} defaultValue={list[Math.min(selected, options - 1)].value} fullWidth={fullWidth} disabled={disabled} />
      </div>
    );
  },
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** All option counts side by side. */
export const Counts: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex w-[340px] max-w-full flex-col gap-4">
      {[2, 3, 4, 5].map(n => (
        <SegmentedControl key={n} label={`${n} options`} options={all.slice(0, n)} defaultValue={all[n - 1].value} />
      ))}
    </div>
  ),
};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  render: () => {
    const onValueChange = fn();
    return <div className="w-[340px]"><SegmentedControl label="Report period" options={all.slice(0, 3)} defaultValue="day" onValueChange={onValueChange} /></div>;
  },
  play: async ({ canvas }) => {
    const group = canvas.getByRole('radiogroup', { name: 'Report period' });
    const day = canvas.getByRole('radio', { name: 'Day' });
    const week = canvas.getByRole('radio', { name: 'Week' });
    await expect(day).toBeChecked();
    await expect(Math.round(group.getBoundingClientRect().height)).toBe(44);
    await expect(Math.round(week.getBoundingClientRect().height)).toBeGreaterThanOrEqual(44);
    // Only the chosen option is a tab stop.
    await expect(day).toHaveAttribute('tabindex', '0');
    await expect(week).toHaveAttribute('tabindex', '-1');
    await userEvent.tab();
    await expect(day).toHaveFocus();
    // Arrow keys move and choose.
    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => expect(week).toBeChecked());
    await waitFor(() => expect(week).toHaveFocus());
    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => expect(canvas.getByRole('radio', { name: 'Month' })).toBeChecked());
    // Wraps at the end, Home and End jump.
    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => expect(day).toBeChecked());
    await userEvent.keyboard('{End}');
    await waitFor(() => expect(canvas.getByRole('radio', { name: 'Month' })).toBeChecked());
    await userEvent.keyboard('{Home}');
    await waitFor(() => expect(day).toBeChecked());
    // A click chooses too, and the thumb follows.
    await userEvent.click(week);
    await waitFor(() => expect(week).toBeChecked());
    const thumb = group.querySelector<HTMLElement>('[data-slot="segmented-control-thumb"]')!;
    await expect(thumb.style.transform).toBe('translateX(100%)');
  },
};

export const DisabledCheck: Story = {
  tags: ['!dev'],
  render: () => (
    <div className="w-[340px]">
      <SegmentedControl label="Plan" options={[{ value: 'a', label: 'Monthly' }, { value: 'b', label: 'Yearly', disabled: true }, { value: 'c', label: 'Lifetime' }]} defaultValue="a" />
    </div>
  ),
  play: async ({ canvas }) => {
    const monthly = canvas.getByRole('radio', { name: 'Monthly' });
    await expect(canvas.getByRole('radio', { name: 'Yearly' })).toBeDisabled();
    monthly.focus();
    // The arrow skips the disabled option.
    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => expect(canvas.getByRole('radio', { name: 'Lifetime' })).toBeChecked());
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => (
    <SegmentedControl
      label="Report period"
      options={[
        { value: 'a', label: 'Every single working day', icon: <Calendar /> },
        { value: 'b', label: 'Week', icon: <List /> },
        { value: 'c', label: 'Quarter to date', icon: <LayoutGrid /> },
        { value: 'd', label: 'Year' },
        { value: 'e', label: 'All time' },
      ]}
      defaultValue="a"
    />
  ),
  play: async ({ canvas }) => {
    const group = canvas.getByRole('radiogroup', { name: 'Report period' });
    await expect(group.scrollWidth).toBeLessThanOrEqual(group.clientWidth + 1);
    await expect(Math.round(group.getBoundingClientRect().height)).toBe(44);
    for (const r of canvas.getAllByRole('radio')) await expect(r.getBoundingClientRect().width).toBeGreaterThan(0);
  },
};

export const DefaultDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' } };
