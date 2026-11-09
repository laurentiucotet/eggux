import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, waitFor } from 'storybook/test';
import { Ellipsis, RefreshCw, Trash2, X } from '@/components/icons';
import { ButtonIcon, type ButtonIconSize, type ButtonIconVariant } from './button-icon';
import { TooltipProvider } from './tooltip';

const meta = {
  title: 'Components/Button/Button Icon',
  component: ButtonIcon,
  parameters: {
    docs: { description: { component: 'Icon-only button: an accessible label and a Tooltip with the same text, always. Variant rules match Button (ghost in toolbars and dense UI, soft next to soft Buttons). Size xs 28 (14 px icon) inside fields, chips and table rows; sm 32; default 36; lg 40 next to lg Buttons. Loading: a spinner replaces the icon, aria-busy, the tooltip says the action in progress. Figma: Button page / Button Icon. Guide: eggux build-ui/components/button.md, tooltip.md' } },
  },
  decorators: [Story => <TooltipProvider delayDuration={0}><Story /></TooltipProvider>],
  args: { label: 'More actions for Invoice INV-1041', icon: <Ellipsis aria-hidden="true" />, onClick: fn() },
  argTypes: {
    variant: { control: 'select', options: ['default', 'soft', 'secondary', 'outline', 'ghost', 'destructive'] },
    size: { control: 'inline-radio', options: ['xs', 'sm', 'default', 'lg'] },
  },
} satisfies Meta<typeof ButtonIcon>;
export default meta;
type Story = StoryObj<typeof meta>;

const probe = (cls: string) => { const p = document.createElement('span'); p.className = cls; document.body.append(p); return { style: getComputedStyle(p), remove: () => p.remove() }; };
const box = (el: Element) => { const r = el.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)]; };
const tips = () => [...document.body.querySelectorAll('[data-slot="tooltip-content"]')];

const variants: ButtonIconVariant[] = ['default', 'soft', 'secondary', 'outline', 'ghost', 'destructive'];
// Figma tokens per Variant, State=default: fill, icon (follows the text token) and border.
const tokens: Record<ButtonIconVariant, string> = {
  default: 'bg-primary text-primary-foreground',
  soft: 'bg-[var(--button-soft-bg)] text-brand',
  secondary: 'bg-secondary text-secondary-foreground',
  outline: 'bg-background text-foreground border border-input',
  ghost: 'bg-transparent text-foreground',
  destructive: 'bg-destructive text-destructive-foreground',
};

// Click runs the action; hover and keyboard focus show the tooltip with the accessible label.
export const Default: Story = {
  play: async ({ canvas, args }) => {
    const button = canvas.getByRole('button', { name: 'More actions for Invoice INV-1041' });
    await expect(box(button)).toEqual([36, 36]);
    await userEvent.hover(button);
    await expect(await screen.findByRole('tooltip')).toHaveTextContent('More actions for Invoice INV-1041');
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
    await userEvent.unhover(button);
    await waitFor(() => expect(tips()).toHaveLength(0));
  },
};

// Keyboard: Tab focuses it (ring and tooltip), Enter and Space activate, Escape hides the tooltip.
export const Keyboard: Story = {
  play: async ({ canvas, args }) => {
    const button = canvas.getByRole('button');
    await userEvent.tab();
    await expect(button).toHaveFocus();
    await waitFor(() => expect(getComputedStyle(button).boxShadow).toContain('0px 0px 0px 4px'));
    await expect(await screen.findByRole('tooltip')).toHaveTextContent('More actions for Invoice INV-1041');
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    await expect(args.onClick).toHaveBeenCalledTimes(2);
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(tips()).toHaveLength(0));
    await expect(button).toHaveFocus();
  },
};

export const Variants: Story = {
  render: args => (
    <div className="flex items-center gap-3">
      {variants.map(v => <ButtonIcon key={v} {...args} variant={v} label={`More actions (${v})`} />)}
    </div>
  ),
  play: async ({ canvas }) => {
    const buttons = canvas.getAllByRole('button');
    for (const [i, v] of variants.entries()) {
      const ref = probe(tokens[v]);
      const s = getComputedStyle(buttons[i]);
      // Colors transition when the theme class lands: wait for the end state.
      await waitFor(() => expect(s.backgroundColor).toBe(ref.style.backgroundColor));
      await waitFor(() => expect(s.color).toBe(ref.style.color));
      await expect(s.borderTopWidth).toBe(v === 'outline' ? '1px' : '0px');
      if (v === 'outline') await expect(s.borderTopColor).toBe(ref.style.borderTopColor);
      // Figma: shadow/xs on default, secondary, outline, destructive; none on ghost and soft.
      await expect(s.boxShadow.includes('0px 1px 2px')).toBe(!['ghost', 'soft'].includes(v));
      ref.remove();
    }
  },
};

// Figma Size: xs 28 (14 px icon), sm 32, default 36, lg 40 (16 px icon).
export const Sizes: Story = {
  render: args => (
    <div className="flex items-center gap-3">
      {(['xs', 'sm', 'default', 'lg'] as ButtonIconSize[]).map(s => <ButtonIcon key={s} {...args} variant="outline" size={s} label={`More actions (${s})`} />)}
    </div>
  ),
  play: async ({ canvas }) => {
    const buttons = canvas.getAllByRole('button');
    await expect(buttons.map(box)).toEqual([[28, 28], [32, 32], [36, 36], [40, 40]]);
    await expect(buttons.map(b => box(b.querySelector('svg')!)[0])).toEqual([14, 16, 16, 16]);
  },
};

// Figma Variant=soft in every size: button/soft-bg with a foreground/brand icon, no shadow.
export const Soft: Story = {
  render: args => (
    <div className="flex items-center gap-3">
      {(['xs', 'sm', 'default', 'lg'] as ButtonIconSize[]).map(s => <ButtonIcon key={s} {...args} variant="soft" size={s} label={`Add line item (${s})`} />)}
    </div>
  ),
  play: async ({ canvas }) => {
    const ref = probe(tokens.soft);
    for (const b of canvas.getAllByRole('button')) {
      await expect(getComputedStyle(b).backgroundColor).toBe(ref.style.backgroundColor);
      await expect(getComputedStyle(b).color).toBe(ref.style.color);
    }
    ref.remove();
  },
};

// Figma State=loading: the spinner replaces the icon, same size and colors, aria-busy, clicks
// blocked; the label and tooltip say the action in progress.
export const Loading: Story = {
  args: { label: 'Refresh invoices', loadingLabel: 'Refreshing', icon: <RefreshCw aria-hidden="true" />, loading: true, variant: 'outline' },
  render: args => (
    <div className="flex items-center gap-3">
      {(['xs', 'sm', 'default', 'lg'] as ButtonIconSize[]).map(s => <ButtonIcon key={s} {...args} size={s} />)}
    </div>
  ),
  play: async ({ canvas, args }) => {
    const buttons = canvas.getAllByRole('button', { name: 'Refreshing' });
    await expect(buttons.map(box)).toEqual([[28, 28], [32, 32], [36, 36], [40, 40]]);
    for (const b of buttons) {
      await expect(b).toHaveAttribute('aria-busy', 'true');
      await expect(b.querySelectorAll('svg')).toHaveLength(1);
      await expect(b.querySelector('[data-slot="button-spinner"]')).not.toBeNull();
      await expect(getComputedStyle(b).opacity).toBe('1');
    }
    await expect(buttons.map(b => box(b.querySelector('svg')!)[0])).toEqual([14, 16, 16, 16]);
    await userEvent.click(buttons[2]);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

// Figma State=disabled: 50 % opacity; no click.
export const Disabled: Story = {
  args: { disabled: true, variant: 'destructive', label: 'Delete invoice', icon: <Trash2 aria-hidden="true" /> },
  play: async ({ canvas, args }) => {
    const button = canvas.getByRole('button', { name: 'Delete invoice' });
    await expect(getComputedStyle(button).opacity).toBe('0.5');
    await userEvent.click(button, { pointerEventsCheck: 0 });
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

// Stress test (Figma "Stress test / Button Icon"): fixed size, never shrinks in a tight row; a
// long label stays in the tooltip, which wraps at 280.
export const NarrowRow: Story = { tags: ['!dev'],
  args: { variant: 'ghost', size: 'xs', label: 'Remove the filter Customer is Acme Corporation Europe GmbH', icon: <X aria-hidden="true" /> },
  render: args => (
    <div className="flex w-[120px] items-center gap-1 rounded-md border border-dashed p-1">
      <span className="min-w-0 flex-1 truncate text-sm">Customer is Acme Corporation Europe GmbH</span>
      <ButtonIcon {...args} />
    </div>
  ),
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button');
    await expect(box(button)).toEqual([28, 28]);
    await userEvent.hover(button);
    const tip = await screen.findByRole('tooltip');
    await expect(tip).toHaveTextContent('Remove the filter');
    await userEvent.unhover(button);
  },
};

export const VariantsDark: Story = { ...Variants, tags: ['!dev'], globals: { theme: 'Dark' } };
export const VariantsCorporate: Story = { ...Variants, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
