import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';
import { ColumnResizeHeader } from './column-resize-header';
import { TableCell, TableHead } from './table';

type Args = { minWidth: number; maxWidth: number; step: number; width: number };

const rows = [
  { id: 'a', name: 'Ana Popescu', team: 'Finance', note: 'Approves invoices over 5,000 EUR' },
  { id: 'b', name: 'Ion Marin', team: 'Engineering', note: 'On call this week' },
  { id: 'c', name: 'Maria Ionescu', team: 'Support', note: 'Joined in March' },
];

// A table that owns its column widths, like an app would.
function Demo({ minWidth, maxWidth, step, width, nameWidth = 160, teamWidth = 140 }: Args & { nameWidth?: number; teamWidth?: number }) {
  const [w, setW] = React.useState({ name: nameWidth, team: teamWidth });
  const total = w.name + w.team + 200;
  return (
    <div style={{ width }} className="max-w-full">
      <div role="region" aria-label="People table. Scroll sideways to see more columns." tabIndex={0} className="overflow-x-auto rounded-lg border border-border outline-none focus-visible:shadow-[0_0_0_2px_var(--background),0_0_0_4px_var(--ring)]">
        <table style={{ width: total }} className="table-fixed border-separate border-spacing-0 text-sm">
          <thead>
            <tr>
              <ColumnResizeHeader label="Name" width={w.name} onWidthChange={n => setW(s => ({ ...s, name: n }))} minWidth={minWidth} maxWidth={maxWidth} step={step} />
              <ColumnResizeHeader label="Team" width={w.team} onWidthChange={n => setW(s => ({ ...s, team: n }))} minWidth={minWidth} maxWidth={maxWidth} step={step} />
              <TableHead style={{ width: 200 }}>Note</TableHead>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id}>
                <TableCell className="truncate">{r.name}</TableCell>
                <TableCell className="truncate">{r.team}</TableCell>
                <TableCell className="truncate">{r.note}</TableCell>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const meta = {
  title: 'Components/Data Structures/Column Resize Header',
  parameters: {
    docs: {
      description: {
        component:
          'A table header cell with a resize handle: drag it, or focus it and use Left and Right (Shift for bigger steps), Home, End; Enter or double click resets. Width is clamped between a minimum and a maximum and announced as "160 pixels". Code only (no Figma component yet).',
      },
    },
  },
  args: { minWidth: 80, maxWidth: 320, step: 10, width: 560 },
  argTypes: {
    minWidth: { name: 'Minimum width', control: { type: 'range', min: 40, max: 200, step: 10 }, description: 'Narrowest the column can get, in px.', table: { category: 'Columns' } },
    maxWidth: { name: 'Maximum width', control: { type: 'range', min: 200, max: 600, step: 10 }, description: 'Widest the column can get, in px.', table: { category: 'Columns' } },
    step: { name: 'Key step', control: { type: 'range', min: 2, max: 40, step: 2 }, description: 'Pixels per arrow key press.', table: { category: 'Columns' } },
    width: { name: 'Container width', control: { type: 'range', min: 240, max: 900, step: 4 }, description: 'Container width in px.', table: { category: 'Columns' } },
  },
  render: args => <Demo {...args} />,
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  play: async ({ canvas }) => {
    const handle = canvas.getByRole('separator', { name: 'Resize Name column' });
    await expect(handle).toHaveAttribute('aria-valuenow', '160');
    await expect(handle).toHaveAttribute('aria-valuemin', '80');
    await expect(handle).toHaveAttribute('aria-valuemax', '320');
    await expect(handle).toHaveAttribute('aria-valuetext', '160 pixels');
    const th = canvas.getByRole('columnheader', { name: /^Name/ });
    await expect(th.getBoundingClientRect().width).toBeCloseTo(160, 0);
    // Keyboard: Tab order reaches the scroll region, then the handles.
    handle.focus();
    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => expect(handle).toHaveAttribute('aria-valuetext', '170 pixels'));
    await waitFor(() => expect(th.getBoundingClientRect().width).toBeCloseTo(170, 0));
    await expect(await canvas.findByText('170 px')).toBeVisible();
    await userEvent.keyboard('{Shift>}{ArrowLeft}{/Shift}');
    await waitFor(() => expect(handle).toHaveAttribute('aria-valuenow', '120'));
    await userEvent.keyboard('{Home}');
    await waitFor(() => expect(handle).toHaveAttribute('aria-valuenow', '80'));
    await userEvent.keyboard('{ArrowLeft}');
    await expect(handle).toHaveAttribute('aria-valuenow', '80');
    await userEvent.keyboard('{End}');
    await waitFor(() => expect(handle).toHaveAttribute('aria-valuenow', '320'));
    await userEvent.keyboard('{ArrowRight}');
    await expect(handle).toHaveAttribute('aria-valuenow', '320');
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(handle).toHaveAttribute('aria-valuenow', '160'));
    // The other column did not move.
    await expect(canvas.getByRole('separator', { name: 'Resize Team column' })).toHaveAttribute('aria-valuenow', '140');
    // Leaving the handle hides the tag.
    await userEvent.tab();
    await waitFor(() => expect(canvas.queryByText('160 px')).toBeNull());
  },
};

export const PointerCheck: Story = {
  tags: ['!dev'],
  play: async ({ canvas }) => {
    const handle = canvas.getByRole('separator', { name: 'Resize Name column' });
    const r = handle.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    await userEvent.pointer([{ keys: '[MouseLeft>]', target: handle, coords: { clientX: x, clientY: y } }, { coords: { clientX: x + 40, clientY: y } }]);
    await waitFor(() => expect(handle).toHaveAttribute('aria-valuenow', '200'));
    await expect(handle).toHaveFocus();
    // Dragging far past the maximum stops at the maximum.
    await userEvent.pointer({ coords: { clientX: x + 900, clientY: y } });
    await waitFor(() => expect(handle).toHaveAttribute('aria-valuenow', '320'));
    handle.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, clientX: x + 900, clientY: y }));
    // After the button is up the width no longer follows the pointer.
    document.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, clientX: x, clientY: y }));
    await expect(handle).toHaveAttribute('aria-valuenow', '320');
    // Double click resets.
    await userEvent.dblClick(handle);
    await waitFor(() => expect(handle).toHaveAttribute('aria-valuenow', '160'));
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  args: { width: 276 },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: args => <Demo {...args} nameWidth={320} teamWidth={80} />,
  play: async ({ canvas, canvasElement }) => {
    const box = canvasElement.firstElementChild as HTMLElement;
    await expect(box.scrollWidth).toBeLessThanOrEqual(box.clientWidth + 1);
    // The table is wider than the container and scrolls in its own region.
    const region = canvas.getByRole('region', { name: /People table/ });
    await expect(region.scrollWidth).toBeGreaterThan(region.clientWidth);
    // A narrow column truncates its header and cells instead of growing.
    const team = canvas.getByRole('columnheader', { name: /^Team/ });
    await expect(team.getBoundingClientRect().width).toBeCloseTo(80, 0);
    await expect(canvas.getByRole('separator', { name: 'Resize Team column' })).toHaveAttribute('aria-valuenow', '80');
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
