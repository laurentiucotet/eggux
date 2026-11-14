import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { ArrowRight, ChevronRight, Plus } from '@/components/icons';
import { Button } from './button';

// One story per Figma variant group, plus the states and the stress cases from the Figma stress
// test. Every story is also a test (vitest): it renders, passes axe, and runs its play function.
const meta = {
  title: 'Components/Button/Button',
  component: Button,
  parameters: {
    docs: { description: { component: 'One `default` per view; `soft` for a brand action that must not compete with it; `destructive` only inside a confirmation step. Label is a verb. Loading keeps the width and blocks repeat clicks. Figma: Button page / Button. Guide: eggux build-ui/components/button.md' } },
  },
  args: { children: 'Save customer', onClick: fn() },
  argTypes: {
    variant: { control: 'select', options: ['default', 'soft', 'secondary', 'outline', 'ghost', 'destructive', 'link'] },
    size: { control: 'inline-radio', options: ['xs', 'sm', 'default', 'lg', 'xl', 'touch'], description: 'xs 28, sm 32, default 36, lg 40, xl 48, touch 44 (min 44 x 44, for touch screens).' },
  },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

const probe = (cls: string) => { const p = document.createElement('span'); p.className = cls; document.body.append(p); return { style: getComputedStyle(p), remove: () => p.remove() }; };
const box = (el: Element) => { const r = el.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)]; };

const variants = ['default', 'soft', 'secondary', 'outline', 'ghost', 'destructive', 'link'] as const;
// Figma tokens per Variant, State=default: fill, label and border.
const tokens: Record<(typeof variants)[number], string> = {
  default: 'bg-primary text-primary-foreground',
  soft: 'bg-[var(--button-soft-bg)] text-brand',
  secondary: 'bg-secondary text-secondary-foreground',
  outline: 'bg-background text-foreground border border-input',
  ghost: 'bg-transparent text-foreground',
  destructive: 'bg-destructive text-destructive-foreground',
  link: 'bg-transparent text-brand',
};

export const Default: Story = {
  play: async ({ canvas, args }) => {
    const button = canvas.getByRole('button', { name: 'Save customer' });
    // Figma Variant=default, Size=default: 36 high, 16 px sides.
    await expect(box(button)[1]).toBe(36);
    await expect(getComputedStyle(button).paddingLeft).toBe('16px');
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
    // Keyboard: Tab reaches it and Enter activates it.
    button.blur();
    await userEvent.tab();
    await expect(button).toHaveFocus();
    // Figma State=focus: 2 px background gap plus a 2 px ring (4 px spread), shadow replaced.
    await waitFor(() => expect(getComputedStyle(button).boxShadow).toContain('0px 0px 0px 4px'));
    await userEvent.keyboard('{Enter}');
    await expect(args.onClick).toHaveBeenCalledTimes(2);
    await userEvent.keyboard(' ');
    await expect(args.onClick).toHaveBeenCalledTimes(3);
  },
};

export const Variants: Story = {
  render: args => (
    <div className="flex flex-wrap items-center gap-3">
      {variants.map(v => (
        <Button key={v} {...args} variant={v}>{v[0].toUpperCase() + v.slice(1)}</Button>
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    const buttons = canvas.getAllByRole('button');
    await expect(buttons).toHaveLength(7);
    for (const [i, v] of variants.entries()) {
      const ref = probe(tokens[v]);
      const s = getComputedStyle(buttons[i]);
      // Colors transition when the theme class lands: wait for the end state.
      await waitFor(() => expect(s.backgroundColor).toBe(ref.style.backgroundColor));
      await waitFor(() => expect(s.color).toBe(ref.style.color));
      // Only outline has a border, in --input.
      await expect(s.borderTopWidth).toBe(v === 'outline' ? '1px' : '0px');
      if (v === 'outline') await expect(s.borderTopColor).toBe(ref.style.borderTopColor);
      ref.remove();
    }
    // Link: no side padding, so the text lines up with the text column.
    await expect(getComputedStyle(buttons[6]).paddingLeft).toBe('0px');
  },
};

export const TouchCheck: Story = {
  tags: ['!dev'],
  args: { size: 'touch', children: 'Pay now' },
  render: args => <div className="flex items-center gap-3"><Button {...args} /><Button {...args} aria-label="Add"><Plus aria-hidden="true" /></Button></div>,
  play: async ({ canvas }) => {
    const [text, icon] = canvas.getAllByRole('button');
    // Touch: 44 high, never narrower than 44.
    await expect(box(text)[1]).toBe(44);
    await expect(box(icon)[1]).toBe(44);
    await expect(box(icon)[0]).toBeGreaterThanOrEqual(44);
  },
};

export const Sizes: Story = {
  render: args => (
    <div className="flex flex-wrap items-center gap-3">
      {(['xs', 'sm', 'default', 'lg', 'xl', 'touch'] as const).map(s => <Button key={s} {...args} size={s} leadingIcon={<Plus aria-hidden="true" />}>Size {s}</Button>)}
    </div>
  ),
  play: async ({ canvas }) => {
    const buttons = canvas.getAllByRole('button');
    // Heights from Figma: xs 28, sm 32, default 36 (density/control-height), lg 40, xl 48; touch 44 (code only, min 44 x 44).
    await expect(buttons.map(b => box(b)[1])).toEqual([28, 32, 36, 40, 48, 44]);
    // Sides: xs 10, sm 12, default 16, lg 24, xl 32.
    await expect(buttons.map(b => getComputedStyle(b).paddingLeft)).toEqual(['10px', '12px', '16px', '24px', '32px', '16px']);
    // Gaps: xs 4, sm 6, default 8, lg 8, xl 10.
    await expect(buttons.map(b => getComputedStyle(b).columnGap)).toEqual(['4px', '6px', '8px', '8px', '10px', '8px']);
    // Label: xs ui/label-small 12/16, the others ui/label 14/20 (xl too).
    await expect(buttons.map(b => getComputedStyle(b).fontSize)).toEqual(['12px', '14px', '14px', '14px', '14px', '14px']);
    // Icons: 14 px in xs, 16 px in the other sizes.
    await expect(buttons.map(b => box(b.querySelector('svg')!)[0])).toEqual([14, 16, 16, 16, 16, 16]);
  },
};

// Figma Show leading icon + Show trailing icon (defaults plus and chevron-right).
export const WithIcons: Story = {
  args: { leadingIcon: <Plus aria-hidden="true" />, trailingIcon: <ArrowRight aria-hidden="true" />, children: 'Add line item', variant: 'soft' },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: 'Add line item' });
    await expect(button.querySelectorAll('svg')).toHaveLength(2);
  },
};

// Figma State=loading: spinner instead of the leading icon, same width, same colors, no fade.
export const Loading: Story = {
  args: { loading: true, leadingIcon: <Plus aria-hidden="true" />, children: 'Saving…' },
  play: async ({ canvas, args }) => {
    const button = canvas.getByRole('button', { name: 'Saving…' });
    await expect(button).toHaveAttribute('aria-disabled', 'true');
    await expect(button).toHaveAttribute('aria-busy', 'true');
    await expect(button.querySelector('[data-slot="button-spinner"]')).not.toBeNull();
    await expect(button.querySelectorAll('svg')).toHaveLength(1);
    await expect(getComputedStyle(button).opacity).toBe('1');
    await userEvent.click(button);
    button.focus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

// Loading in every Variant: the spinner takes the leading slot, the width matches the idle button with an icon.
export const LoadingVariants: Story = {
  render: args => (
    <div className="flex flex-col gap-3">
      {variants.map(v => (
        <div key={v} className="flex items-center gap-3">
          <Button {...args} variant={v} leadingIcon={<Plus aria-hidden="true" />}>Save</Button>
          <Button {...args} variant={v} loading>Save</Button>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    const buttons = canvas.getAllByRole('button');
    for (let i = 0; i < buttons.length; i += 2) await expect(box(buttons[i + 1])).toEqual(box(buttons[i]));
  },
};

// Figma State=disabled: 50 % opacity, same colors; blocks clicks.
export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvas, args }) => {
    const button = canvas.getByRole('button');
    await expect(getComputedStyle(button).opacity).toBe('0.5');
    await userEvent.click(button, { pointerEventsCheck: 0 });
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

export const AsLink: Story = {
  render: args => <Button {...args} asChild variant="outline"><a href="#invoices">View invoices</a></Button>,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: 'View invoices' })).toHaveAttribute('href', '#invoices');
  },
};

// Stress test (Figma "Stress test / Button"): long label, narrow column. Hugs its label, one line.
export const LongLabel: Story = { tags: ['!dev'],
  args: { children: 'Export every invoice from the last fiscal year to CSV' },
  render: args => <div className="w-[276px] rounded-md border border-dashed p-3"><Button {...args} /></div>,
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole('button');
    const lineHeight = parseFloat(getComputedStyle(button).lineHeight) || 20;
    await expect(button.getBoundingClientRect().height).toBeLessThan(lineHeight * 2 + 16);
  },
};

// Stress test: a one-letter label is still a pill at least as tall as wide; all options on.
export const ShortAndAllOptions: Story = { tags: ['!dev'],
  render: args => (
    <div className="flex items-center gap-3">
      <Button {...args}>A</Button>
      <Button {...args} variant="outline" leadingIcon={<Plus aria-hidden="true" />} trailingIcon={<ChevronRight aria-hidden="true" />}>Add customer</Button>
    </div>
  ),
  play: async ({ canvas }) => {
    const [a] = canvas.getAllByRole('button');
    const [w, h] = box(a);
    await expect(w).toBeGreaterThanOrEqual(h - 1);
  },
};

// Same variants in Dark and Corporate Light: axe checks the contrast of every theme mode.
export const VariantsDark: Story = { ...Variants, tags: ['!dev'], globals: { theme: 'Dark' } };
export const VariantsCorporate: Story = { ...Variants, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
