import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { ArrowRight, Plus } from 'lucide-react';
import { Button } from './button';

// One story per Figma variant group, plus the states and the stress cases from the Figma stress
// test. Every story is also a test (vitest): it renders, passes axe, and runs its play function.
const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    docs: { description: { component: 'One `default` per view; `destructive` only inside a confirmation step. Label is a verb. Figma: COMPONENTS / Button. Guide: eggux build-ui/components/button.md' } },
  },
  args: { children: 'Save customer', onClick: fn() },
  argTypes: {
    variant: { control: 'select', options: ['default', 'soft', 'secondary', 'outline', 'ghost', 'destructive', 'link'] },
    size: { control: 'inline-radio', options: ['xs', 'sm', 'default', 'lg', 'xl'] },
  },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, args }) => {
    const button = canvas.getByRole('button', { name: 'Save customer' });
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
    // Keyboard: Tab reaches it and Enter activates it.
    button.blur();
    await userEvent.tab();
    await expect(button).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onClick).toHaveBeenCalledTimes(2);
  },
};

export const Variants: Story = {
  render: args => (
    <div className="flex flex-wrap items-center gap-3">
      {(['default', 'soft', 'secondary', 'outline', 'ghost', 'destructive', 'link'] as const).map(v => (
        <Button key={v} {...args} variant={v}>{v[0].toUpperCase() + v.slice(1)}</Button>
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole('button')).toHaveLength(7);
  },
};

export const Sizes: Story = {
  render: args => (
    <div className="flex flex-wrap items-center gap-3">
      {(['xs', 'sm', 'default', 'lg', 'xl'] as const).map(s => <Button key={s} {...args} size={s}>Size {s}</Button>)}
    </div>
  ),
  play: async ({ canvas }) => {
    // Heights from Figma: xs 28, sm 32, default 36 (density/control-height), lg 40, xl 48.
    const heights = canvas.getAllByRole('button').map(b => Math.round(b.getBoundingClientRect().height));
    await expect(heights).toEqual([28, 32, 36, 40, 48]);
  },
};

export const WithIcons: Story = {
  args: { leadingIcon: <Plus aria-hidden="true" />, trailingIcon: <ArrowRight aria-hidden="true" />, children: 'Add line item', variant: 'soft' },
};

export const Loading: Story = {
  args: { loading: true, leadingIcon: <Plus aria-hidden="true" />, children: 'Saving…' },
  play: async ({ canvas, args }) => {
    const button = canvas.getByRole('button', { name: 'Saving…' });
    await expect(button).toHaveAttribute('aria-disabled', 'true');
    await expect(button).toHaveAttribute('aria-busy', 'true');
    await userEvent.click(button);
    button.focus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvas, args }) => {
    await userEvent.click(canvas.getByRole('button'), { pointerEventsCheck: 0 });
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
export const LongLabel: Story = {
  args: { children: 'Export every invoice from the last fiscal year to CSV' },
  render: args => <div className="w-[276px] rounded-md border border-dashed p-3"><Button {...args} /></div>,
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole('button');
    const lineHeight = parseFloat(getComputedStyle(button).lineHeight) || 20;
    await expect(button.getBoundingClientRect().height).toBeLessThan(lineHeight * 2 + 16);
  },
};

// Same variants in Dark and Corporate Light: axe checks the contrast of every theme mode.
export const VariantsDark: Story = { ...Variants, globals: { theme: 'Dark' } };
export const VariantsCorporate: Story = { ...Variants, globals: { theme: 'Corporate Light' } };
