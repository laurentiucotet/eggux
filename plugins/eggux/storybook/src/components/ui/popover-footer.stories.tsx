import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';
import { Button } from './button';
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from './popover';
import { PopoverFooter } from './popover-footer';
import { PopoverHeader } from './popover-header';
import { Switch } from './switch';

const meta = {
  title: 'Components/Popover/Popover Footer',
  component: PopoverFooter,
  parameters: {
    layout: 'centered',
    docs: { description: { component: 'Bottom of a Popover, like Dialog Footer: an optional Start slot on the left (Reset), Cancel and the one primary action on the right, all sm. Only for popovers whose choices apply on a button press; popovers that apply at once have no footer. Figma: Popover page / Popover Footer. Guide: eggux build-ui/components/popover.md' } },
  },
} satisfies Meta<typeof PopoverFooter>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => { const r = el.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)]; };
const onApply = fn();

function ColumnSettings({ withReset = false }: { withReset?: boolean }) {
  const [open, setOpen] = React.useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild><Button variant="outline">Columns</Button></PopoverTrigger>
      <PopoverContent aria-labelledby="columns-title" className="flex flex-col gap-4">
        <PopoverHeader titleId="columns-title" title="Visible columns" />
        <div className="flex flex-col gap-3 text-sm">
          {['Customer', 'Due date', 'Amount'].map(c => (
            <label key={c} className="flex items-center justify-between">{c}<Switch defaultChecked /></label>
          ))}
        </div>
        <PopoverFooter start={withReset ? <Button variant="ghost" size="sm">Reset</Button> : undefined}>
          <PopoverClose asChild><Button variant="outline" size="sm">Cancel</Button></PopoverClose>
          <Button size="sm" onClick={() => { onApply(); setOpen(false); }}>Apply</Button>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
}

// Cancel and Apply on the right; Apply runs and closes.
export const Default: Story = {
  parameters: { controls: { disable: true } },
  render: () => <ColumnSettings />,
  play: async ({ canvas }) => {
    onApply.mockClear();
    await userEvent.click(canvas.getByRole('button', { name: 'Columns' }));
    const dialog = await screen.findByRole('dialog', { name: 'Visible columns' });
    const footer = dialog.querySelector<HTMLElement>('[data-slot="popover-footer"]')!;
    // Fills the content width (256 in Figma; 254 in code, where the 1 px Popover border sits inside the 288), 32 high (sm buttons).
    await expect(box(footer)).toEqual([254, 32]);
    const apply = within(dialog).getByRole('button', { name: 'Apply' });
    const cancel = within(dialog).getByRole('button', { name: 'Cancel' });
    // Right aligned, 8 px apart, Apply last.
    await expect(Math.round(footer.getBoundingClientRect().right - apply.getBoundingClientRect().right)).toBe(0);
    await expect(Math.round(apply.getBoundingClientRect().left - cancel.getBoundingClientRect().right)).toBe(8);
    await userEvent.click(apply);
    await expect(onApply).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  },
};

// Show start: Reset on the left; tab order Reset, Cancel, Apply.
export const WithStart: Story = {
  parameters: { controls: { disable: true } },
  render: () => <ColumnSettings withReset />,
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Columns' }));
    const dialog = await screen.findByRole('dialog', { name: 'Visible columns' });
    const footer = dialog.querySelector<HTMLElement>('[data-slot="popover-footer"]')!;
    const reset = within(dialog).getByRole('button', { name: 'Reset' });
    await expect(Math.round(reset.getBoundingClientRect().left - footer.getBoundingClientRect().left)).toBe(0);
    reset.focus();
    await userEvent.tab();
    await expect(within(dialog).getByRole('button', { name: 'Cancel' })).toHaveFocus();
    await userEvent.tab();
    await expect(within(dialog).getByRole('button', { name: 'Apply' })).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  },
};

// Min 240: Reset, Cancel and Apply stay on one row and never overflow.
export const Stress: Story = {
  parameters: { controls: { disable: true } },
  tags: ['!dev'],
  render: () => (
    <div className="flex flex-col gap-6">
      {[240, 276, 368].map(width => (
        <div key={width} data-testid={`col-${width}`} style={{ width }}>
          <PopoverFooter start={<Button variant="ghost" size="sm">Reset</Button>}>
            <Button variant="outline" size="sm">Cancel</Button>
            <Button size="sm">Apply</Button>
          </PopoverFooter>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const width of [240, 276, 368]) {
      const footer = within(canvasElement).getByTestId(`col-${width}`).querySelector<HTMLElement>('[data-slot="popover-footer"]')!;
      await expect(box(footer)).toEqual([width, 32]);
      await expect(footer.scrollWidth).toBeLessThanOrEqual(footer.clientWidth);
    }
  },
};

export const DefaultDark: Story = { ...WithStart, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...WithStart, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
