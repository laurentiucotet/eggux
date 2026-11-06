import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, userEvent, waitFor, within } from 'storybook/test';
import { Button } from './button';
import { Checkbox } from './checkbox';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { PopoverFooter } from './popover-footer';
import { PopoverHeader } from './popover-header';

const meta = {
  title: 'Components/Popover/Popover Header',
  component: PopoverHeader,
  parameters: {
    layout: 'centered',
    docs: { description: { component: 'Top of a Popover, like Dialog Header: Title (ui/label, 2 lines), optional Description and a 20 px close X. Put it first in PopoverContent and point aria-labelledby at its title. For filter, picker and settings popovers; a small text popover needs no header. Figma: Popover page / Popover Header. Guide: eggux build-ui/components/popover.md' } },
  },
  args: { title: 'Filter by status' },
} satisfies Meta<typeof PopoverHeader>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => { const r = el.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)]; };

const statuses = ['Draft', 'Sent', 'Paid', 'Overdue'];

function FilterPopover({ description }: { description?: string }) {
  return (
    <Popover>
      <PopoverTrigger asChild><Button variant="outline">Status</Button></PopoverTrigger>
      <PopoverContent aria-labelledby="status-filter-title" className="flex flex-col gap-4">
        <PopoverHeader titleId="status-filter-title" title="Filter by status" description={description} />
        <div className="flex flex-col gap-2">
          {statuses.map(s => (
            <label key={s} className="flex items-center gap-2 text-sm">
              <Checkbox /> {s}
            </label>
          ))}
        </div>
        <PopoverFooter start={<Button variant="ghost" size="sm">Reset</Button>}>
          <Button variant="outline" size="sm">Cancel</Button>
          <Button size="sm">Apply</Button>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
}

// The title names the popover; the X closes it and focus returns to the trigger.
export const Default: Story = {
  render: () => <FilterPopover />,
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: 'Status' });
    await userEvent.click(trigger);
    const dialog = await screen.findByRole('dialog', { name: 'Filter by status' });
    const header = dialog.querySelector<HTMLElement>('[data-slot="popover-header"]')!;
    // Fills the content width (256 in Figma; 254 in code, where the 1 px Popover border sits inside the 288), 20 high (one title line), 20 px close with a 16 px icon.
    await expect(box(header)).toEqual([254, 20]);
    const close = within(dialog).getByRole('button', { name: 'Close' });
    await expect(box(close)).toEqual([20, 20]);
    await expect(box(close.querySelector('svg')!)).toEqual([16, 16]);
    await expect(getComputedStyle(within(dialog).getByRole('heading', { name: 'Filter by status' })).fontWeight).toBe('500');
    await userEvent.click(close);
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await expect(trigger).toHaveFocus();
  },
};

// Show description on: muted body/small 4 px under the title.
export const WithDescription: Story = {
  render: () => <FilterPopover description="Pick one or more statuses to show." />,
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Status' }));
    const dialog = await screen.findByRole('dialog', { name: 'Filter by status' });
    const title = dialog.querySelector<HTMLElement>('[data-slot="popover-title"]')!;
    const description = dialog.querySelector<HTMLElement>('[data-slot="popover-description"]')!;
    await expect(Math.round(description.getBoundingClientRect().top - title.getBoundingClientRect().bottom)).toBe(4);
    // Escape closes from anywhere inside.
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  },
};

// Show close off: the title fills the row.
export const WithoutClose: Story = {
  decorators: [Story => <Popover open><div className="w-64"><Story /></div></Popover>],
  args: { title: 'Notifications', showClose: false },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('button', { name: 'Close' })).toBeNull();
    await expect(box(canvas.getByRole('heading', { name: 'Notifications' }))[0]).toBe(256);
  },
};

// Long title: two lines then an ellipsis; description three lines; the X stays 20 px.
export const Stress: Story = {
  tags: ['!dev'],
  render: () => (
    <Popover open>
      <div className="flex flex-col gap-6">
        {[160, 276, 368].map(width => (
          <div key={width} data-testid={`col-${width}`} style={{ width }}>
            <PopoverHeader
              title="Filter invoices of Acme Holdings by status, owner, due date and the currency they were issued in"
              description="Pick one or more statuses to show. Invoices that match none of them stay hidden until you reset the filter, including the ones shared with you by other teams."
            />
          </div>
        ))}
      </div>
    </Popover>
  ),
  play: async ({ canvasElement }) => {
    for (const width of [160, 276, 368]) {
      const col = within(canvasElement).getByTestId(`col-${width}`);
      const header = col.querySelector<HTMLElement>('[data-slot="popover-header"]')!;
      await expect(box(header)[0]).toBe(width);
      await expect(header.scrollWidth).toBeLessThanOrEqual(header.clientWidth);
      await expect(box(col.querySelector('[data-slot="popover-title"]')!)[1]).toBe(40);
      await expect(box(col.querySelector('[data-slot="popover-description"]')!)[1]).toBeLessThanOrEqual(60);
      await expect(box(col.querySelector('[data-slot="popover-header-close"]')!)).toEqual([20, 20]);
    }
  },
};

export const DefaultDark: Story = { ...WithDescription, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...WithDescription, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
