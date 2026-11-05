import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';
import { TimePicker } from './time-picker';

const meta = {
  title: 'Components/Calendar/Time Picker',
  component: TimePicker,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Time field (24 h) that opens a list of times in fixed steps (15 or 30 min) in a Popover, Checked on the selected one. Type=range picks a start and an end ("09:00 to 10:30") and shows the duration; the end list starts after the start. Size default 36, sm 32, lg 40: match the Date Picker beside it. Unavailable times stay in the list, disabled. Keyboard: Enter, Space or ArrowDown opens, arrows move, Enter picks, Escape closes. Figma: Calendar page / Time Picker. Guide: eggux build-ui/components/date-picker.md' } },
  },
  args: { label: 'Start time', onValueChange: fn() },
  decorators: [Story => <div className="w-[160px]"><Story /></div>],
} satisfies Meta<typeof TimePicker>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => {
  const r = el.getBoundingClientRect();
  return [Math.round(r.width), Math.round(r.height)];
};
const probe = (className: string, prop: 'color' | 'backgroundColor' | 'borderTopColor') => {
  const el = document.createElement('span');
  el.className = className;
  (document.querySelector('#storybook-root') ?? document.body).append(el);
  const value = getComputedStyle(el)[prop];
  el.remove();
  return value;
};
const css = (el: Element) => getComputedStyle(el);

// Figma Type=single, Size=default, placeholder: 160 x 36, "Select time", clock icon.
export const Default: Story = {
  play: async ({ canvas, args }) => {
    const trigger = canvas.getByRole('button', { name: 'Start time, Select time' });
    await expect(box(trigger)).toEqual([160, 36]);
    await expect(css(trigger.querySelector('[data-slot="time-picker-value"]')!).color).toBe(probe('text-muted-foreground', 'color'));
    await expect(box(trigger.querySelector('svg')!)).toEqual([16, 16]);
    await userEvent.click(trigger);
    const dialog = await screen.findByRole('dialog', { name: 'Choose a time' });
    const list = within(dialog).getByRole('listbox', { name: 'Times' });
    await expect(within(list).getAllByRole('option')).toHaveLength(48);
    await expect(list).toHaveFocus();
    await userEvent.click(within(list).getByRole('option', { name: '10:30' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await expect(args.onValueChange).toHaveBeenCalledWith('10:30');
    const filled = canvas.getByRole('button', { name: 'Start time, 10:30' });
    await expect(filled).toHaveFocus();
    await expect(css(filled.querySelector('[data-slot="time-picker-value"]')!).color).toBe(probe('text-foreground', 'color'));
    // Reopen: the pick is checked.
    await userEvent.click(filled);
    const again = await screen.findByRole('option', { name: '10:30' });
    await expect(again).toHaveAttribute('aria-selected', 'true');
    await expect(again.querySelector('svg')).not.toBeNull();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await expect(filled).toHaveFocus();
    // Keyboard: Enter opens, arrows move in the list, Enter picks and focus returns to the trigger.
    await userEvent.keyboard('{Enter}');
    const list2 = await screen.findByRole('listbox', { name: 'Times' });
    await expect(list2).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}{ArrowDown}');
    await expect(list2).toHaveAttribute('aria-activedescendant', screen.getByRole('option', { name: '11:30' }).id);
    await userEvent.keyboard('{Enter}');
    await expect(args.onValueChange).toHaveBeenLastCalledWith('11:30');
    await waitFor(() => expect(filled).toHaveFocus());
    await userEvent.keyboard('{Enter}');
    await screen.findByRole('listbox');
    await userEvent.keyboard('{End}');
    await expect(screen.getByRole('listbox')).toHaveAttribute('aria-activedescendant', screen.getByRole('option', { name: '23:30' }).id);
    await userEvent.keyboard('{Home}');
    await expect(screen.getByRole('listbox')).toHaveAttribute('aria-activedescendant', screen.getByRole('option', { name: '00:00' }).id);
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
    await expect(filled).toHaveFocus();
  },
};

// Figma Size: default 36, sm 32, lg 40. Text 14 px, lg 16 px.
export const Sizes: Story = {
  decorators: [],
  render: () => (
    <div className="flex w-[160px] flex-col gap-3">
      <TimePicker size="sm" label="Small" defaultValue="10:30" />
      <TimePicker size="default" label="Default" defaultValue="10:30" />
      <TimePicker size="lg" label="Large" defaultValue="10:30" />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(box(canvas.getByRole('button', { name: 'Small, 10:30' }))).toEqual([160, 32]);
    await expect(box(canvas.getByRole('button', { name: 'Default, 10:30' }))).toEqual([160, 36]);
    await expect(box(canvas.getByRole('button', { name: 'Large, 10:30' }))).toEqual([160, 40]);
    await expect(css(canvas.getByRole('button', { name: 'Default, 10:30' })).fontSize).toBe('14px');
    await expect(css(canvas.getByRole('button', { name: 'Large, 10:30' })).fontSize).toBe('16px');
  },
};

// Figma State=focus: border-ring and a 3 px ring; State=error: destructive border; State=disabled: faded and inert.
export const States: Story = {
  decorators: [],
  render: () => (
    <div className="flex w-[160px] flex-col gap-3">
      <TimePicker label="Error" defaultValue="10:30" invalid />
      <TimePicker label="Disabled" defaultValue="10:30" disabled />
    </div>
  ),
  play: async ({ canvas }) => {
    const error = canvas.getByRole('button', { name: 'Error, 10:30' });
    await expect(error).toHaveAttribute('aria-invalid', 'true');
    await expect(css(error).borderTopColor).toBe(probe('border-destructive', 'borderTopColor'));
    const disabled = canvas.getByRole('button', { name: 'Disabled, 10:30' });
    await expect(disabled).toBeDisabled();
    await expect(css(disabled).opacity).toBe('0.5');
    await userEvent.click(disabled);
    await expect(screen.queryByRole('dialog')).toBeNull();
    await userEvent.tab();
    await expect(error).toHaveFocus();
    await expect(css(error).boxShadow).not.toBe('none');
  },
};

// Figma Type=range: 240 x 36, "09:00 to 10:30" and "1 h 30 min".
const RangeExample = (props: { label?: string; size?: 'sm' | 'default' | 'lg' }) => (
  <TimePicker type="range" label={props.label ?? 'Availability'} size={props.size} defaultRange={{ start: '09:00', end: '10:30' }} />
);
export const Range: Story = {
  decorators: [Story => <div className="w-[240px]"><Story /></div>],
  render: () => <RangeExample />,
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: 'Availability, 09:00 to 10:30 1 h 30 min' });
    await expect(box(trigger)).toEqual([240, 36]);
    await expect(trigger.querySelector('[data-slot="time-picker-duration"]')).toHaveTextContent('1 h 30 min');
    await expect(css(trigger.querySelector('[data-slot="time-picker-duration"]')!).color).toBe(probe('text-muted-foreground', 'color'));
    await userEvent.click(trigger);
    const dialog = await screen.findByRole('dialog', { name: 'Choose a time range' });
    const start = within(dialog).getByRole('listbox', { name: 'Start time' });
    const end = within(dialog).getByRole('listbox', { name: 'End time' });
    // The end list starts after the start and shows the duration next to each time.
    await expect(within(end).getAllByRole('option')[0]).toHaveTextContent('09:30');
    await expect(within(end).getAllByRole('option')[0]).toHaveTextContent('30 min');
    await expect(within(end).getByRole('option', { name: /10:30/ })).toHaveAttribute('aria-selected', 'true');
    await expect(within(end).getByRole('option', { name: /10:30/ })).toHaveTextContent('1 h 30 min');
    // Picking a later start keeps a valid end and moves focus to the end list.
    await userEvent.click(within(start).getByRole('option', { name: '10:00' }));
    await waitFor(() => expect(within(dialog).getByRole('listbox', { name: 'End time' })).toHaveFocus());
    await expect(within(dialog).getByRole('listbox', { name: 'End time' }).querySelector('[role="option"]')).toHaveTextContent('10:30');
    await userEvent.click(within(within(dialog).getByRole('listbox', { name: 'End time' })).getByRole('option', { name: /11:30/ }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await expect(canvas.getByRole('button', { name: 'Availability, 10:00 to 11:30 1 h 30 min' })).toHaveFocus();
  },
};
