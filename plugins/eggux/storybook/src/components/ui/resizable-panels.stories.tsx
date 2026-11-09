import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fireEvent, fn, userEvent, waitFor } from 'storybook/test';
import { ResizablePanels } from './resizable-panels';

const meta = {
  title: 'Components/Drawer/Resizable Panels',
  component: ResizablePanels,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Two panels with a handle that drags the split: list and detail, editor and preview, code and output. The start panel keeps its width, the end panel fills; each has a minimum. The handle is a focusable separator: arrows resize, Home/End go to the limits, Enter collapses and restores, double-click resets. Needs at least 480; on narrow screens show one panel at a time. Figma: Drawer page / Resizable Panels. Guide: eggux build-ui/components/drawer.md',
      },
    },
  },
  args: {
    start: <p className="text-sm text-muted-foreground">Start panel: a list, a tree or navigation</p>,
    end: <p className="text-sm">End panel: the detail of what is selected</p>,
  },
  decorators: [(Story) => <div className="h-[400px] w-[960px] max-w-full [&>*]:h-full"><Story /></div>],
} satisfies Meta<typeof ResizablePanels>;
export default meta;
type Story = StoryObj<typeof meta>;

const px = (n: number) => Math.round(n);
const part = (el: HTMLElement, slot: string) => el.querySelector<HTMLElement>(`[data-slot="${slot}"]`)!;

const onSizeChange = fn();

// Figma: 960 × 400, start 320, handle 12 with grip, end fills on muted; radius lg, border.
export const Default: Story = {
  args: { onSizeChange },
  play: async ({ canvas, canvasElement }) => {
    const root = part(canvasElement, 'resizable-panels');
    await expect(px(root.getBoundingClientRect().width)).toBe(960);
    await expect(getComputedStyle(root).minWidth).toBe('480px');
    const startPanel = part(canvasElement, 'resizable-panel-start');
    const endPanel = part(canvasElement, 'resizable-panel-end');
    const handle = canvas.getByRole('separator', { name: 'Resize panels' });
    await expect(px(startPanel.getBoundingClientRect().width)).toBe(320);
    await expect(px(handle.getBoundingClientRect().width)).toBe(12);
    await expect(px(endPanel.getBoundingClientRect().width)).toBe(960 - 2 - 320 - 12);
    await expect(getComputedStyle(startPanel).paddingTop).toBe('16px');
    await expect(getComputedStyle(handle).borderLeftWidth).toBe('1px');
    await expect(handle).toHaveAttribute('aria-valuenow', '320');
    await expect(handle).toHaveAttribute('aria-valuemin', '0');
    await expect(handle).toHaveAttribute('aria-valuemax', String(960 - 2 - 12 - 240));
    await expect(handle).toHaveAttribute('aria-orientation', 'vertical');
    await expect(handle).toHaveAttribute('aria-controls', startPanel.id);
    // Drag 100 px to the right.
    const box = handle.getBoundingClientRect();
    const y = box.top + 50;
    await userEvent.pointer([
      { keys: '[MouseLeft>]', target: handle, coords: { clientX: box.left + 6, clientY: y } },
      { pointerName: 'mouse', target: handle, coords: { clientX: box.left + 106, clientY: y } },
      { keys: '[/MouseLeft]', target: handle, coords: { clientX: box.left + 106, clientY: y } },
    ]);
    await expect(handle).toHaveAttribute('aria-valuenow', '420');
    await expect(px(startPanel.getBoundingClientRect().width)).toBe(420);
    await expect(onSizeChange).toHaveBeenLastCalledWith(420);
    // Double-click resets the split.
    await userEvent.dblClick(handle);
    await expect(handle).toHaveAttribute('aria-valuenow', '320');
  },
};

// Keyboard: Tab reaches the handle; arrows 16 (Shift 64); Home/End limits; Enter collapses and restores.
export const Keyboard: Story = {
  play: async ({ canvas, canvasElement }) => {
    const handle = canvas.getByRole('separator', { name: 'Resize panels' });
    await userEvent.tab();
    await expect(handle).toHaveFocus();
    await expect(getComputedStyle(handle).boxShadow).not.toBe('none');
    await userEvent.keyboard('{ArrowRight}');
    await expect(handle).toHaveAttribute('aria-valuenow', '336');
    await userEvent.keyboard('{ArrowLeft}{ArrowLeft}');
    await expect(handle).toHaveAttribute('aria-valuenow', '304');
    await userEvent.keyboard('{Shift>}{ArrowRight}{/Shift}');
    await expect(handle).toHaveAttribute('aria-valuenow', '368');
    await userEvent.keyboard('{Home}');
    await expect(handle).toHaveAttribute('aria-valuenow', '200');
    await userEvent.keyboard('{ArrowLeft}');
    await expect(handle).toHaveAttribute('aria-valuenow', '200');
    await userEvent.keyboard('{End}');
    await expect(handle).toHaveAttribute('aria-valuenow', '706');
    await userEvent.keyboard('{ArrowRight}');
    await expect(handle).toHaveAttribute('aria-valuenow', '706');
    // End panel keeps its 240 minimum.
    await expect(px(part(canvasElement, 'resizable-panel-end').getBoundingClientRect().width)).toBe(240);
    await userEvent.keyboard('{Enter}');
    await expect(handle).toHaveAttribute('aria-valuenow', '0');
    await expect(part(canvasElement, 'resizable-panel-start')).not.toBeVisible();
    await expect(handle).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(handle).toHaveAttribute('aria-valuenow', '706');
    await expect(part(canvasElement, 'resizable-panel-start')).toBeVisible();
  },
};

// The split is remembered per person (storageKey, localStorage).
export const Remembered: Story = {
  tags: ['!dev'],
  args: { storageKey: 'egg-test-resizable-split' },
  play: async ({ canvas }) => {
    const handle = canvas.getByRole('separator');
    fireEvent.keyDown(handle, { key: 'ArrowRight' });
    await waitFor(() => expect(handle).toHaveAttribute('aria-valuenow', '336'));
    await waitFor(() => expect(window.localStorage.getItem('egg-test-resizable-split')).toBe('336'));
    window.localStorage.removeItem('egg-test-resizable-split');
  },
};

// Labelled panels render as named groups.
export const LabelledPanels: Story = {
  tags: ['!dev'],
  args: { startLabel: 'Tickets', endLabel: 'Ticket detail', handleLabel: 'Resize tickets list' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('group', { name: 'Tickets' })).toBeInTheDocument();
    await expect(canvas.getByRole('group', { name: 'Ticket detail' })).toBeInTheDocument();
    await expect(canvas.getByRole('separator', { name: 'Resize tickets list' })).toBeInTheDocument();
  },
};

// Stress from Figma: column 1/2 (564) and the 480 minimum; the end panel never drops under its
// minimum and long text wraps inside the panels.
// End text in foreground: Figma foreground/muted on background/muted is 4.34:1 (design finding).
const longEnd = <p className="text-sm">End panel: the detail of what is selected, with a long description that wraps inside the panel</p>;
export const Stress: Story = {
  tags: ['!dev'],
  decorators: [(Story) => <div className="flex flex-col gap-4"><Story /></div>],
  render: (args) => (
    <>
      <div className="h-[200px] w-[564px]" data-testid="w564"><ResizablePanels {...args} className="h-full" end={longEnd} /></div>
      <div className="h-[200px] w-[480px]" data-testid="w480"><ResizablePanels {...args} className="h-full" end={longEnd} /></div>
      <div className="h-[200px] w-[360px]" data-testid="w360"><ResizablePanels {...args} className="h-full" end={longEnd} /></div>
    </>
  ),
  play: async ({ canvas }) => {
    for (const [id, width] of [['w564', 564], ['w480', 480]] as const) {
      const box = canvas.getByTestId(id);
      const end = part(box, 'resizable-panel-end');
      await expect(px(part(box, 'resizable-panels').getBoundingClientRect().width)).toBe(width);
      await expect(px(end.getBoundingClientRect().width)).toBeGreaterThanOrEqual(240);
      await expect(end.scrollWidth).toBeLessThanOrEqual(end.clientWidth);
    }
    // Under 480 the component keeps its minimum (the page shows one panel instead).
    await expect(px(part(canvas.getByTestId('w360'), 'resizable-panels').getBoundingClientRect().width)).toBe(480);
  },
};

export const DefaultDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' } };
