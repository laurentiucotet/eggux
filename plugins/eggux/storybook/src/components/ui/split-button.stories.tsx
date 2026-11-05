import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, waitFor } from 'storybook/test';
import { DropdownMenuItem } from './dropdown-menu';
import { SplitButton } from './split-button';

const saveMenu = (
  <>
    <DropdownMenuItem>Save and close</DropdownMenuItem>
    <DropdownMenuItem>Save as draft</DropdownMenuItem>
    <DropdownMenuItem>Save as template</DropdownMenuItem>
  </>
);

const meta = {
  title: 'Components/Button/Split Button',
  component: SplitButton,
  parameters: {
    docs: { description: { component: 'One main action plus a menu of variants of the same action (Save / Save as draft / Save and close). The main part runs the most common choice; never hide unrelated or destructive actions in the menu. default when it is the primary action of the view, outline otherwise. Figma: Button page / Split Button. Guide: eggux build-ui/components/button.md' } },
  },
  args: { label: 'Save', menuLabel: 'More save options', menu: saveMenu, onClick: fn() },
  argTypes: { variant: { control: 'inline-radio', options: ['default', 'outline'] } },
} satisfies Meta<typeof SplitButton>;
export default meta;
type Story = StoryObj<typeof meta>;

const probe = (cls: string) => { const p = document.createElement('span'); p.className = cls; document.body.append(p); return { style: getComputedStyle(p), remove: () => p.remove() }; };
const box = (el: Element) => { const r = el.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)]; };

// The main part saves; the chevron opens the menu of variants.
export const Default: Story = {
  play: async ({ canvas, args }) => {
    const save = canvas.getByRole('button', { name: 'Save' });
    const more = canvas.getByRole('button', { name: 'More save options' });
    await userEvent.click(save);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
    // Figma Split Button default: 36 high; chevron part 36 wide; 16 px left and 12 px right on the action.
    const root = save.parentElement!;
    await expect(box(root)[1]).toBe(36);
    await expect(box(more)).toEqual([36, 36]);
    await expect([getComputedStyle(save).paddingLeft, getComputedStyle(save).paddingRight]).toEqual(['16px', '12px']);
    const ref = probe('bg-primary text-primary-foreground');
    await expect(getComputedStyle(root).backgroundColor).toBe(ref.style.backgroundColor);
    await expect(getComputedStyle(save).color).toBe(ref.style.color);
    ref.remove();
    await expect(more).toHaveAttribute('aria-haspopup', 'menu');
    await expect(more).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(more);
    await expect(more).toHaveAttribute('aria-expanded', 'true');
    await expect(await screen.findAllByRole('menuitem')).toHaveLength(3);
    await userEvent.click(screen.getByRole('menuitem', { name: 'Save as draft' }));
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

// Keyboard: two tab stops; ArrowDown on the chevron opens the menu, Escape closes it and returns focus.
export const Keyboard: Story = {
  play: async ({ canvas, args }) => {
    const save = canvas.getByRole('button', { name: 'Save' });
    const more = canvas.getByRole('button', { name: 'More save options' });
    await userEvent.tab();
    await expect(save).toHaveFocus();
    await waitFor(() => expect(getComputedStyle(save).boxShadow).toContain('0px 0px 0px 4px'));
    await userEvent.keyboard('{Enter}');
    await expect(args.onClick).toHaveBeenCalledTimes(1);
    await userEvent.tab();
    await expect(more).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    await screen.findByRole('menu');
    await waitFor(() => expect(screen.getAllByRole('menuitem')[0]).toHaveFocus());
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
    await expect(more).toHaveFocus();
  },
};

// Figma Variant=outline: background fill, 1 px input border, input divider; 38 wide chevron part
// with the border (36 inside).
export const Outline: Story = {
  args: { variant: 'outline' },
  play: async ({ canvas }) => {
    const save = canvas.getByRole('button', { name: 'Save' });
    const root = save.parentElement!;
    const ref = probe('bg-background text-foreground border border-input');
    await expect(getComputedStyle(root).backgroundColor).toBe(ref.style.backgroundColor);
    await expect(getComputedStyle(root).borderTopColor).toBe(ref.style.borderTopColor);
    await expect(getComputedStyle(save).color).toBe(ref.style.color);
    const divider = root.querySelector('[data-slot="split-button-divider"]')!;
    await expect(getComputedStyle(divider).backgroundColor).toBe(ref.style.borderTopColor);
    ref.remove();
    await expect(box(root)[1]).toBe(36);
    await expect(box(canvas.getByRole('button', { name: 'More save options' }))).toEqual([36, 34]);
  },
};

export const Variants: Story = {
  render: args => (
    <div className="flex items-center gap-3">
      <SplitButton {...args} variant="default" />
      <SplitButton {...args} variant="outline" label="Send now" menuLabel="More send options" />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole('button')).toHaveLength(4);
  },
};

// The open menu (Figma "Example / split button open"): 224 wide, under the chevron, right aligned.
export const Open: Story = {
  args: { open: true },
  parameters: { layout: 'padded' },
  render: args => <div className="flex h-40 justify-end"><SplitButton {...args} /></div>,
  play: async () => {
    const menu = await screen.findByRole('menu');
    await expect(Math.round(menu.getBoundingClientRect().width)).toBe(224);
  },
};

// Disabled: both parts blocked, 50 % opacity.
export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvas, args }) => {
    const save = canvas.getByRole('button', { name: 'Save' });
    await expect(save).toBeDisabled();
    await expect(canvas.getByRole('button', { name: 'More save options' })).toBeDisabled();
    await expect(getComputedStyle(save.parentElement!).opacity).toBe('0.5');
    await userEvent.click(save, { pointerEventsCheck: 0 });
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

// Stress test (Figma "Stress test / Split Button"): a long label grows the action part on one
// line; a one-letter label stays a compact pill.
export const LongAndShortLabels: Story = { tags: ['!dev'],
  render: args => (
    <div className="flex w-[368px] flex-col items-start gap-3">
      <SplitButton {...args} label="Save and send the invoice to Acme" />
      <SplitButton {...args} label="A" variant="outline" menuLabel="More options for A" />
    </div>
  ),
  play: async ({ canvas }) => {
    const long = canvas.getByRole('button', { name: 'Save and send the invoice to Acme' });
    await expect(box(long)[1]).toBe(36);
  },
};

export const VariantsDark: Story = { ...Variants, tags: ['!dev'], globals: { theme: 'Dark' } };
export const VariantsCorporate: Story = { ...Variants, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
