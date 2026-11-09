import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';
import { ScrollArea } from './scroll-area';

const releases = ['1.12.0', '1.11.0', '1.10.0', '1.9.0', '1.8.0', '1.7.0', '1.6.0', '1.5.0', '1.4.0', '1.3.0', '1.2.0', '1.1.0'];

const meta = {
  title: 'Components/Scroll Area/Scroll Area',
  component: ScrollArea,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'A region that scrolls inside the page with a thin styled scrollbar: long lists in a popover, sidebar content, a table body under a fixed header, a row of cards (horizontal). Give it a fixed or max height; the page stays the main scroll and two scroll areas never nest in the same direction. Figma: Scroll Area page / Scroll Area. Guide: eggux build-ui/components/list-and-tree.md' } },
  },
  args: { 'aria-label': 'Release notes' },
  render: args => (
    <ScrollArea {...args} className="h-[240px] w-[320px] rounded-md border border-border bg-background">
      <ul className="m-0 flex list-none flex-col gap-2 px-4 py-3 text-sm leading-5">
        {releases.map(r => <li key={r}>v{r} · release notes</li>)}
      </ul>
    </ScrollArea>
  ),
} satisfies Meta<typeof ScrollArea>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();

// Figma Orientation=vertical: 320 × 240, content taller than the box, a 10 px bar with a 6 px thumb; the viewport takes focus.
export const Default: Story = {
  play: async ({ canvas, canvasElement }) => {
    const viewport = canvas.getByRole('region', { name: 'Release notes' });
    await expect(viewport.scrollHeight).toBeGreaterThan(viewport.clientHeight);
    const bar = await waitFor(() => {
      const b = canvasElement.querySelector('[data-slot="scroll-area-scrollbar"]');
      if (!b) throw new Error('no scrollbar');
      return b;
    });
    await expect(Math.round(box(bar).width)).toBe(10);
    const thumb = await waitFor(() => {
      const t = canvasElement.querySelector('[data-slot="scroll-area-thumb"]');
      if (!t) throw new Error('no thumb');
      return t;
    });
    await expect(Math.round(box(thumb).width)).toBe(6);
    // The viewport is a tab stop, so the browser scrolls it with arrows and Page Down.
    await userEvent.tab();
    await expect(viewport).toHaveFocus();
  },
};

// Figma Orientation=horizontal: a row of cards at 480 × 120 with the bar at the bottom.
export const Horizontal: Story = {
  args: { orientation: 'horizontal', 'aria-label': 'Recent files' },
  render: args => (
    <ScrollArea {...args} className="h-[120px] w-[480px] rounded-md border border-border bg-background">
      <div className="flex w-max gap-3 px-4 py-3">
        {Array.from({ length: 8 }, (_, i) => <div key={i} className="h-[72px] w-24 shrink-0 rounded-md bg-muted" />)}
      </div>
    </ScrollArea>
  ),
  play: async ({ canvas, canvasElement }) => {
    const viewport = canvas.getByRole('region', { name: 'Recent files' });
    await expect(viewport.scrollWidth).toBeGreaterThan(viewport.clientWidth);
    const bar = await waitFor(() => {
      const b = canvasElement.querySelector('[data-slot="scroll-area-scrollbar"]');
      if (!b) throw new Error('no scrollbar');
      return b;
    });
    await expect(Math.round(box(bar).height)).toBe(10);
  },
};

export const DefaultDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' } };
