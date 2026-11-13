import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { WheelColumn, WheelPicker } from './wheel-picker';

type Args = { hour: string; minute: string; showPeriod: boolean };

const range = (n: number, pad = 2) => Array.from({ length: n }, (_, i) => ({ value: String(i), label: String(i).padStart(pad, '0') }));
const hours = range(24);
const minutes = range(60);
const periods = [
  { value: 'am', label: 'AM' },
  { value: 'pm', label: 'PM' },
];

const meta = {
  title: 'Components/Mobile/Wheel Picker',
  parameters: {
    docs: {
      description: {
        component:
          'The scrolling column picker of phones: spin a column under a fixed selection band to pick one value (a time, a quantity, a duration). Several columns sit side by side. Each column is a listbox: swipe snaps to the nearest row, a tap selects, Up and Down move one row, Home and End jump. On desktop prefer a Select. Code only (no Figma component yet).',
      },
    },
  },
  args: { hour: '9', minute: '30', showPeriod: false },
  argTypes: {
    hour: { name: 'Hour', control: 'select', options: hours.map(h => h.value), description: 'The selected hour.', table: { category: 'Value' } },
    minute: { name: 'Minute', control: 'select', options: minutes.filter((_, i) => i % 5 === 0).map(m => m.value), description: 'The selected minute.', table: { category: 'Value' } },
    showPeriod: { name: 'Show AM/PM column', control: 'boolean', description: 'A third column.', table: { category: 'Parts' } },
  },
  render: function Render({ hour, minute, showPeriod }) {
    const [h, setH] = React.useState(hour);
    const [m, setM] = React.useState(minute);
    const [p, setP] = React.useState('am');
    React.useEffect(() => setH(hour), [hour]);
    React.useEffect(() => setM(minute), [minute]);
    return (
      <div className="flex flex-col items-center gap-3">
        <WheelPicker aria-label="Time">
          <WheelColumn label="Hours" options={hours} value={h} onValueChange={setH} />
          <WheelColumn label="Minutes" options={minutes} value={m} onValueChange={setM} />
          {showPeriod ? <WheelColumn label="Period" options={periods} value={p} onValueChange={setP} /> : null}
        </WheelPicker>
        <p className="m-0 text-sm leading-5 text-muted-foreground" data-testid="value">
          {h.padStart(2, '0')}:{m.padStart(2, '0')}
        </p>
      </div>
    );
  },
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  play: async ({ canvas }) => {
    const hoursList = canvas.getByRole('listbox', { name: 'Hours' });
    await expect(canvas.getAllByRole('listbox')).toHaveLength(2);
    // The selected row is under the band once the column has scrolled to it.
    await waitFor(() => expect(Math.abs(hoursList.scrollTop - 9 * 44)).toBeLessThanOrEqual(2));
    await expect(canvas.getAllByRole('option', { selected: true }).map(o => o.textContent)).toEqual(['09', '30']);
    // Keyboard: arrows move one row, Home jumps to the first.
    hoursList.focus();
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(canvas.getByTestId('value')).toHaveTextContent('10:30'));
    await userEvent.keyboard('{Home}');
    await waitFor(() => expect(canvas.getByTestId('value')).toHaveTextContent('00:30'));
  },
};

export const TapCheck: Story = {
  tags: ['!dev'],
  play: async ({ canvas }) => {
    await userEvent.click(within(canvas.getByRole('listbox', { name: 'Hours' })).getByRole('option', { name: '11' }));
    await waitFor(() => expect(canvas.getByTestId('value')).toHaveTextContent('11:30'));
    await waitFor(() => expect(Math.abs(canvas.getByRole('listbox', { name: 'Hours' }).scrollTop - 11 * 44)).toBeLessThanOrEqual(2));
  },
};

/** Three columns, with AM and PM. */
export const WithPeriod: Story = { args: { showPeriod: true } };

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[240px]"><Story /></div>],
  render: () => (
    <WheelPicker aria-label="Country code">
      <WheelColumn label="Country" options={[{ value: 'a', label: 'A very long country name that must be cut' }, { value: 'b', label: 'Chile' }]} value="a" onValueChange={() => undefined} />
    </WheelPicker>
  ),
  play: async ({ canvas }) => {
    const option = canvas.getByRole('option', { name: /A very long/ });
    await expect(option.scrollWidth).toBeGreaterThanOrEqual(option.clientWidth);
    await expect(Math.round(option.getBoundingClientRect().height)).toBe(44);
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
