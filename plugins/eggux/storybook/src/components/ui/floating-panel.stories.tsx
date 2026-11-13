import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';
import { Button } from './button';
import { FloatingPanel, type FloatingPanelCorner } from './floating-panel';

type Args = { title: string; corner: FloatingPanelCorner; width: number; open: boolean };

function Frame({ children, width = 640 }: { children: React.ReactNode; width?: number }) {
  return (
    <div data-testid="frame" style={{ width }} className="relative h-[400px] max-w-full overflow-hidden rounded-lg border border-border bg-muted/30 p-4 text-sm">
      <h1 className="m-0 text-base font-semibold text-foreground">Invoice INV-2041</h1>
      <p className="mt-1 max-w-sm text-muted-foreground">Acme Ltd, 1,240.00 EUR, due 30 November. The panel floats over this page and the page stays usable.</p>
      {children}
    </div>
  );
}

function Notes({ title, corner, width, open }: Args) {
  const [shown, setShown] = React.useState(open);
  React.useEffect(() => setShown(open), [open]);
  return (
    <Frame>
      {!shown ? (
        <Button className="mt-4" variant="outline" onClick={() => setShown(true)}>Open {title}</Button>
      ) : null}
      <FloatingPanel key={corner} title={title} corner={corner} width={width} open={shown} onOpenChange={setShown}>
        <label htmlFor="panel-notes" className="mb-1 block text-xs font-medium text-muted-foreground">Notes for the finance team</label>
        <textarea
          id="panel-notes"
          rows={4}
          defaultValue="Customer asked to split the payment in two parts."
          className="w-full min-w-0 rounded-md border border-input bg-background p-2 text-sm text-foreground outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        />
        <div className="mt-2 flex justify-end">
          <Button size="sm">Save note</Button>
        </div>
      </FloatingPanel>
    </Frame>
  );
}

const meta = {
  title: 'Components/Layout/Floating Panel',
  parameters: {
    docs: {
      description: {
        component:
          'A small non-modal panel docked to a corner with a title bar. Drag the bar, or focus the grip and use the arrow keys (Shift for bigger steps, Home to reset); it stays inside the window or its container. Escape and the close button close it. The page behind stays usable and focus is not trapped. `fixed` pins it to the window. Code only (no Figma component yet).',
      },
    },
  },
  args: { title: 'Quick notes', corner: 'bottom-right', width: 320, open: true },
  argTypes: {
    title: { name: 'Title', control: 'text', description: 'Title bar text and accessible name.', table: { category: 'Panel' } },
    corner: { name: 'Corner', control: 'select', options: ['top-left', 'top-right', 'bottom-left', 'bottom-right'], description: 'The corner it is docked to.', table: { category: 'Panel' } },
    width: { name: 'Width', control: { type: 'range', min: 240, max: 420, step: 10 }, description: 'Panel width in px.', table: { category: 'Panel' } },
    open: { name: 'Open', control: 'boolean', description: 'Shows or hides the panel.', table: { category: 'Panel' } },
  },
  render: args => <Notes {...args} />,
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  play: async ({ canvas }) => {
    const frame = canvas.getByTestId('frame');
    const panel = canvas.getByRole('dialog', { name: 'Quick notes' });
    await expect(panel).toHaveAttribute('aria-modal', 'false');
    // Docked 16 px from the bottom right corner (inside the 1 px border).
    const f = frame.getBoundingClientRect();
    const p0 = panel.getBoundingClientRect();
    await expect(Math.round(f.right - p0.right)).toBe(17);
    await expect(Math.round(f.bottom - p0.bottom)).toBe(17);

    // Pointer: drag the title bar up and left.
    const title = canvas.getByRole('heading', { name: 'Quick notes' });
    const tb = title.getBoundingClientRect();
    const x = tb.left + 20;
    const y = tb.top + 5;
    await userEvent.pointer([
      { keys: '[MouseLeft>]', target: title, coords: { clientX: x, clientY: y } },
      { coords: { clientX: x - 120, clientY: y - 80 } },
      { keys: '[/MouseLeft]' },
    ]);
    await waitFor(() => expect(Math.round(p0.left - panel.getBoundingClientRect().left)).toBe(120));
    await expect(Math.round(p0.top - panel.getBoundingClientRect().top)).toBe(80);

    // Dragging far outside stops at the container edge.
    await userEvent.pointer([
      { keys: '[MouseLeft>]', target: title, coords: { clientX: x - 120, clientY: y - 80 } },
      { coords: { clientX: x - 2000, clientY: y - 2000 } },
      { keys: '[/MouseLeft]' },
    ]);
    await waitFor(() => expect(panel.getBoundingClientRect().left).toBeGreaterThanOrEqual(f.left));
    await expect(panel.getBoundingClientRect().top).toBeGreaterThanOrEqual(f.top);

    // Keyboard: the handle moves it, Home resets it.
    const handle = canvas.getByRole('button', { name: 'Move panel' });
    handle.focus();
    await userEvent.keyboard('{Home}');
    await waitFor(() => expect(Math.round(f.right - panel.getBoundingClientRect().right)).toBe(17));
    await userEvent.keyboard('{ArrowLeft}');
    await waitFor(() => expect(Math.round(f.right - panel.getBoundingClientRect().right)).toBe(33));
    await userEvent.keyboard('{Shift>}{ArrowUp}{/Shift}');
    await waitFor(() => expect(Math.round(f.bottom - panel.getBoundingClientRect().bottom)).toBe(17 + 64));
    await userEvent.keyboard('{ArrowRight}{ArrowRight}{ArrowRight}');
    // Right edge stops at the container edge.
    await waitFor(() => expect(Math.round(f.right - panel.getBoundingClientRect().right)).toBe(0));

    // Escape closes from inside; the page can reopen it.
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(canvas.queryByRole('dialog')).toBeNull());
    await userEvent.click(canvas.getByRole('button', { name: 'Open Quick notes' }));
    await canvas.findByRole('dialog', { name: 'Quick notes' });
    // The close button does the same.
    await userEvent.click(canvas.getByRole('button', { name: 'Close panel' }));
    await waitFor(() => expect(canvas.queryByRole('dialog')).toBeNull());
  },
};

/** Docked top left, closed at the start: open it from the page. */
export const TopLeft: Story = {
  args: { corner: 'top-left', title: 'Help and shortcuts', open: false },
};

/* Hidden checks */

export const Stress: Story = {
  tags: ['!dev'],
  args: { width: 420, title: 'Quick notes for the quarterly statement of Acme International Holdings' },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  play: async ({ canvas }) => {
    const frame = canvas.getByTestId('frame').getBoundingClientRect();
    const panel = canvas.getByRole('dialog');
    const r = panel.getBoundingClientRect();
    // 420 px asked, 276 px column: the panel shrinks and stays inside.
    await expect(r.width).toBeLessThanOrEqual(frame.width);
    await expect(r.left).toBeGreaterThanOrEqual(frame.left);
    await expect(r.right).toBeLessThanOrEqual(frame.right);
    const title = canvas.getByRole('heading', { name: /Quick notes for the quarterly/ });
    await expect(title.scrollWidth).toBeGreaterThan(title.clientWidth);
    await expect(canvas.getByRole('button', { name: 'Close panel' })).toBeVisible();
    await expect(panel.scrollWidth).toBeLessThanOrEqual(panel.clientWidth + 1);
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
