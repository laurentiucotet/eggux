import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, waitFor } from 'storybook/test';
import { Button } from './button';
import { Checkbox } from './checkbox';
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './drawer';

const meta = {
  title: 'Components/Drawer/Drawer',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Bottom sheet for mobile: filters, sort, quick actions, a short form or a confirmation. Handle on top, full-width stacked buttons with the primary first and labelled with the result ("Show 24 results"). Outside tap, Escape and Cancel close it; drag to close is not built (vaul is not in the library). On desktop the same content becomes a Dialog or a Sheet. Figma: Drawer page / Drawer. Guide: eggux build-ui/components/drawer.md',
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const onShow = fn();

function Filters({ open, showHandle, options = ['Paid', 'Overdue', 'Draft'] }: { open?: boolean; showHandle?: boolean; options?: string[] }) {
  return (
    <Drawer defaultOpen={open}>
      <DrawerTrigger asChild>
        <Button variant="outline">Filters</Button>
      </DrawerTrigger>
      <DrawerContent showHandle={showHandle}>
        <DrawerHeader>
          <DrawerTitle>Filters</DrawerTitle>
          <DrawerDescription>Narrow the list of orders.</DrawerDescription>
        </DrawerHeader>
        <DrawerBody>
          <fieldset className="m-0 flex min-w-0 flex-col gap-3 border-0 p-0">
            <legend className="mb-3 text-sm font-medium">Status</legend>
            {options.map((o) => (
              <Checkbox key={o} label={o} />
            ))}
          </fieldset>
        </DrawerBody>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button onClick={onShow}>Show 24 results</Button>
          </DrawerClose>
          <DrawerClose asChild>
            <Button variant="outline">Clear filters</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

const px = (n: number) => Math.round(n);

// Figma Drawer: bottom edge, full width, radius xl on top, 16 sides and top, 24 bottom, 16 gap,
// handle 96 × 8, buttons full width stacked 8 apart with the primary first.
type Playground = {
  open: boolean;
  showHandle: boolean;
  title: string;
  showDescription: boolean;
  options: number;
  primary: string;
  showSecondary: boolean;
};

const statuses = ['Paid', 'Overdue', 'Draft', 'Sent', 'Partly paid', 'Refunded', 'Disputed', 'Cancelled', 'Scheduled', 'Void', 'Written off', 'On hold'];

/** Playground: every Drawer option in Controls. More options than fit make the body scroll. */
export const Default: StoryObj<Playground> = {
  argTypes: {
    open: { name: 'Open', control: 'boolean', description: 'Open on load', table: { category: 'Drawer' } },
    showHandle: { name: 'Show handle', control: 'boolean', description: 'The 96 × 8 handle on top', table: { category: 'Drawer' } },
    title: { name: 'Title', control: 'text', table: { category: 'Drawer Header' } },
    showDescription: { name: 'Show description', control: 'boolean', table: { category: 'Drawer Header' } },
    options: { name: 'Number of options', control: { type: 'range', min: 1, max: 12, step: 1 }, table: { category: 'Drawer Body' } },
    primary: { name: 'Primary label', control: 'text', description: 'Say the result ("Show 24 results")', table: { category: 'Drawer Footer' } },
    showSecondary: { name: 'Show secondary', control: 'boolean', description: 'A second full-width button under the primary', table: { category: 'Drawer Footer' } },
  },
  args: { open: false, showHandle: true, title: 'Filters', showDescription: true, options: 3, primary: 'Show 24 results', showSecondary: true },
  render: a => (
    <Drawer key={String(a.open)} defaultOpen={a.open}>
      <DrawerTrigger asChild>
        <Button variant="outline">Open drawer</Button>
      </DrawerTrigger>
      <DrawerContent showHandle={a.showHandle}>
        <DrawerHeader>
          <DrawerTitle>{a.title}</DrawerTitle>
          {a.showDescription ? <DrawerDescription>Narrow the list of orders.</DrawerDescription> : null}
        </DrawerHeader>
        <DrawerBody>
          <fieldset className="m-0 flex min-w-0 flex-col gap-3 border-0 p-0">
            <legend className="mb-3 text-sm font-medium">Status</legend>
            {statuses.slice(0, a.options).map(o => (
              <Checkbox key={o} label={o} />
            ))}
          </fieldset>
        </DrawerBody>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button onClick={onShow}>{a.primary}</Button>
          </DrawerClose>
          {a.showSecondary ? (
            <DrawerClose asChild>
              <Button variant="outline">Clear filters</Button>
            </DrawerClose>
          ) : null}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

// The checks that used to run on Default (hidden; the playground has no play function).
export const DefaultCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <Filters />,
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: 'Filters' });
    await userEvent.click(trigger);
    const dialog = await screen.findByRole('dialog', { name: 'Filters' });
    await expect(dialog).toHaveAccessibleDescription('Narrow the list of orders.');
    await waitFor(() => expect(screen.getByRole('checkbox', { name: 'Paid' })).toHaveFocus());
    const box = dialog.getBoundingClientRect();
    await expect(px(box.bottom)).toBe(window.innerHeight);
    await expect(px(box.width)).toBe(window.innerWidth);
    const cs = getComputedStyle(dialog);
    await expect(cs.paddingTop).toBe('16px');
    await expect(cs.paddingLeft).toBe('16px');
    await expect(cs.paddingBottom).toBe('24px');
    await expect(cs.rowGap).toBe('16px');
    await expect(cs.borderTopWidth).toBe('1px');
    await expect(cs.borderTopLeftRadius).toBe(getComputedStyle(document.documentElement).getPropertyValue('--radius-xl').trim());
    await expect(cs.boxShadow).not.toBe('none');
    const handle = dialog.querySelector<HTMLElement>('[data-slot="drawer-handle"]')!;
    await expect(px(handle.getBoundingClientRect().width)).toBe(96);
    await expect(px(handle.getBoundingClientRect().height)).toBe(8);
    await expect(handle).toHaveAttribute('aria-hidden', 'true');
    const show = screen.getByRole('button', { name: 'Show 24 results' });
    const clear = screen.getByRole('button', { name: 'Clear filters' });
    await expect(px(show.getBoundingClientRect().width)).toBe(px(box.width) - 32);
    await expect(px(clear.getBoundingClientRect().top - show.getBoundingClientRect().bottom)).toBe(8);
    // No close X: the handle, outside tap and the buttons close it.
    await expect(screen.queryByRole('button', { name: 'Close' })).toBeNull();
    await userEvent.click(screen.getByRole('checkbox', { name: 'Overdue' }));
    await userEvent.click(show);
    await expect(onShow).toHaveBeenCalled();
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await expect(trigger).toHaveFocus();
  },
};

// Keyboard: focus trap, Escape closes, focus returns.
export const Keyboard: Story = {
  parameters: { controls: { disable: true } },
  render: () => <Filters />,
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: 'Filters' });
    await userEvent.tab();
    await userEvent.keyboard('{Enter}');
    const dialog = await screen.findByRole('dialog', { name: 'Filters' });
    await waitFor(() => expect(screen.getByRole('checkbox', { name: 'Paid' })).toHaveFocus());
    for (let i = 0; i < 7; i += 1) {
      await userEvent.tab();
      await expect(dialog.contains(document.activeElement)).toBe(true);
    }
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await expect(trigger).toHaveFocus();
  },
};

// Outside tap on the overlay closes it (dragging is never the only way to close).
export const OutsideTap: Story = {
  parameters: { controls: { disable: true } },
  tags: ['!dev'],
  render: () => <Filters />,
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Filters' }));
    await screen.findByRole('dialog');
    const overlay = document.querySelector<HTMLElement>('[data-slot="drawer-overlay"]')!;
    await userEvent.pointer({ keys: '[MouseLeft]', target: overlay, coords: { clientX: 5, clientY: 5 } });
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  },
};

// Figma Show handle off.
export const WithoutHandle: Story = {
  parameters: { controls: { disable: true } },
  render: () => <Filters showHandle={false} />,
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Filters' }));
    const dialog = await screen.findByRole('dialog');
    await expect(dialog.querySelector('[data-slot="drawer-handle"]')).toBeNull();
  },
};

// Stress: many options stay under 80 % of the screen and the body scrolls; buttons stay in view.
export const Stress: Story = {
  parameters: { controls: { disable: true } },
  tags: ['!dev'],
  render: () => <Filters options={Array.from({ length: 40 }, (_, i) => `Customer segment with a long name number ${i + 1}`)} />,
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Filters' }));
    const dialog = await screen.findByRole('dialog');
    await expect(dialog.getBoundingClientRect().height).toBeLessThanOrEqual(window.innerHeight * 0.8 + 1);
    const body = dialog.querySelector<HTMLElement>('[data-slot="drawer-body"]')!;
    await expect(body.scrollHeight).toBeGreaterThan(body.clientHeight);
    const clear = screen.getByRole('button', { name: 'Clear filters' });
    await expect(clear.getBoundingClientRect().bottom).toBeLessThanOrEqual(window.innerHeight - 23);
  },
};

const openStory: Story = {
  render: () => <Filters open />,
  play: async () => {
    await screen.findByRole('dialog', { name: 'Filters' });
  },
};
export const OpenDark: Story = { ...openStory, tags: ['!dev'], globals: { theme: 'Dark' } };
export const OpenCorporate: Story = { ...openStory, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
