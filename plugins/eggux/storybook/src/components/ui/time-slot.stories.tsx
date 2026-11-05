import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { TimeSlot } from './time-slot';

const meta = {
  title: 'Components/Calendar/Time Slot',
  component: TimeSlot,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'One time as an outline toggle button, 96 x 32: default, selected (primary fill) or unavailable (stays in the list, muted, cannot be picked). Used in the Time column of Date Time Picker and in booking. Figma: Time Slot (used in Calendar page / Date Time Picker). Code mapping: shadcn ToggleGroup of outline Buttons.' } },
  },
  args: { time: '14:00', onClick: fn() },
  decorators: [Story => <div className="w-24"><Story /></div>],
} satisfies Meta<typeof TimeSlot>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => {
  const r = el.getBoundingClientRect();
  return [Math.round(r.width), Math.round(r.height)];
};
const probe = (className: string, prop: 'color' | 'backgroundColor') => {
  const el = document.createElement('span');
  el.className = className;
  (document.querySelector('#storybook-root') ?? document.body).append(el);
  const value = getComputedStyle(el)[prop];
  el.remove();
  return value;
};

export const Default: Story = {
  play: async ({ canvas, args }) => {
    const slot = canvas.getByRole('button', { name: '14:00' });
    await expect(box(slot)).toEqual([96, 32]);
    await expect(slot).toHaveAttribute('aria-pressed', 'false');
    await expect(getComputedStyle(slot).color).toBe(probe('text-foreground', 'color'));
    await userEvent.click(slot);
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    await expect(args.onClick).toHaveBeenCalledTimes(3);
  },
};

export const Selected: Story = {
  args: { selected: true },
  play: async ({ canvas }) => {
    const slot = canvas.getByRole('button', { name: '14:00', pressed: true });
    await expect(getComputedStyle(slot).backgroundColor).toBe(probe('bg-primary', 'backgroundColor'));
    await expect(getComputedStyle(slot).color).toBe(probe('text-primary-foreground', 'color'));
  },
};

export const Unavailable: Story = {
  args: { unavailable: true },
  play: async ({ canvas, args }) => {
    const slot = canvas.getByRole('button', { name: '14:00' });
    await expect(slot).toHaveAttribute('aria-disabled', 'true');
    await expect(getComputedStyle(slot).color).toBe(probe('text-muted-foreground', 'color'));
    await userEvent.click(slot);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

const All = () => (
  <div className="flex w-24 flex-col gap-2">
    <TimeSlot time="12:30" unavailable />
    <TimeSlot time="13:00" />
    <TimeSlot time="14:30" selected />
  </div>
);
export const AllStates: Story = { render: () => <All /> };
export const AllStatesDark: Story = { render: () => <All />, tags: ['!dev'], globals: { theme: 'Dark' } };
export const AllStatesCorporate: Story = { render: () => <All />, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
