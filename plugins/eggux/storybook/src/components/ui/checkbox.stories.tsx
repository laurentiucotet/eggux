import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { Checkbox } from './checkbox';

const meta = {
  title: 'Components/Selection Controls/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Several options can be chosen, saved on submit. Indeterminate only for "select all" over a partial selection; never pre-tick consent. Space toggles, the label is tied to the box. Figma: Selection controls page / Checkbox. Guide: eggux build-ui/components/select.md' } },
  },
  args: { label: 'Send me product updates' },
} satisfies Meta<typeof Checkbox>;
export default meta;
type Story = StoryObj<typeof meta>;

const size = (el: Element) => { const r = el.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)]; };
// Probe element carrying the token classes, to compare computed colors against.
const probe = (cls: string) => { const p = document.createElement('span'); p.className = cls; document.body.append(p); return { style: getComputedStyle(p), remove: () => p.remove() }; };

// Figma Checked=false, State=default: 16 px box, 8 px gap, label 14/20 medium.
export const Default: Story = {
  args: { onCheckedChange: fn() },
  play: async ({ canvas, args }) => {
    const box = canvas.getByRole('checkbox', { name: 'Send me product updates' });
    await expect(size(box)).toEqual([16, 16]);
    await expect(box).not.toBeChecked();
    const ref = probe('border border-input bg-background rounded-sm');
    await expect(getComputedStyle(box).borderTopColor).toBe(ref.style.borderTopColor);
    await expect(getComputedStyle(box).borderTopLeftRadius).toBe(ref.style.borderTopLeftRadius);
    ref.remove();
    await userEvent.click(canvas.getByText('Send me product updates'));
    await expect(box).toBeChecked();
    await expect(args.onCheckedChange).toHaveBeenCalledWith(true);
    await userEvent.click(box);
    await expect(box).not.toBeChecked();
  },
};

export const Checked: Story = {
  args: { defaultChecked: true },
  play: async ({ canvas, canvasElement }) => {
    const box = canvas.getByRole('checkbox');
    await expect(box).toBeChecked();
    const ref = probe('bg-primary border border-primary');
    await expect(getComputedStyle(box).backgroundColor).toBe(ref.style.backgroundColor);
    await expect(getComputedStyle(box).borderTopColor).toBe(ref.style.borderTopColor);
    ref.remove();
    await expect(size(canvasElement.querySelector('[data-slot="checkbox-indicator"] svg')!)).toEqual([14, 14]);
  },
};

// Indeterminate exposes aria-checked="mixed"; Space makes it checked.
export const Indeterminate: Story = {
  args: { label: 'Select all invoices' },
  render: args => {
    const [checked, setChecked] = React.useState<boolean | 'indeterminate'>('indeterminate');
    return <Checkbox {...args} checked={checked} onCheckedChange={setChecked} />;
  },
  play: async ({ canvas, canvasElement }) => {
    const box = canvas.getByRole('checkbox', { name: 'Select all invoices' });
    await expect(box).toHaveAttribute('aria-checked', 'mixed');
    await expect(size(canvasElement.querySelector('[data-slot="checkbox-indicator"] svg')!)).toEqual([14, 14]);
    await userEvent.tab();
    await expect(box).toHaveFocus();
    await userEvent.keyboard(' ');
    await expect(box).toBeChecked();
  },
};

// Figma State=focus: 2 px background gap plus 4 px ring, shown on keyboard focus.
export const Keyboard: Story = {
  play: async ({ canvas }) => {
    const box = canvas.getByRole('checkbox');
    await userEvent.tab();
    await expect(box).toHaveFocus();
    await expect(getComputedStyle(box).boxShadow).toContain('0px 0px 0px 4px');
    await userEvent.keyboard(' ');
    await expect(box).toBeChecked();
    await userEvent.keyboard(' ');
    await expect(box).not.toBeChecked();
  },
};

// State=error: destructive border; the message comes from Field or the group.
export const ErrorState: Story = {
  name: 'Error',
  args: { invalid: true, label: 'I agree to the Acme terms of service' },
  play: async ({ canvas }) => {
    const box = canvas.getByRole('checkbox');
    await expect(box).toHaveAttribute('aria-invalid', 'true');
    const ref = probe('border border-destructive');
    await expect(getComputedStyle(box).borderTopColor).toBe(ref.style.borderTopColor);
    ref.remove();
  },
};

export const ErrorChecked: Story = {
  args: { invalid: true, defaultChecked: true },
  play: async ({ canvas }) => {
    const box = canvas.getByRole('checkbox');
    const ref = probe('border border-destructive bg-primary');
    await expect(getComputedStyle(box).borderTopColor).toBe(ref.style.borderTopColor);
    await expect(getComputedStyle(box).backgroundColor).toBe(ref.style.backgroundColor);
    ref.remove();
  },
};

// State=disabled: 50 % opacity on the whole row, no toggling by click or keyboard.
export const Disabled: Story = {
  args: { disabled: true, defaultChecked: true, onCheckedChange: fn() },
  play: async ({ canvas, canvasElement, args }) => {
    const box = canvas.getByRole('checkbox');
    await expect(box).toBeDisabled();
    await expect(getComputedStyle(canvasElement.querySelector('[data-slot="checkbox-field"]')!).opacity).toBe('0.5');
    await expect(getComputedStyle(box).opacity).toBe('1');
    await userEvent.click(canvas.getByText('Send me product updates'));
    await expect(args.onCheckedChange).not.toHaveBeenCalled();
    await expect(box).toBeChecked();
  },
};

// All Checked x State variants in one grid.
export const AllStates: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="grid grid-cols-3 gap-x-8 gap-y-4">
      <Checkbox label="Unchecked" />
      <Checkbox invalid label="Unchecked, error" />
      <Checkbox disabled label="Unchecked, disabled" />
      <Checkbox defaultChecked label="Checked" />
      <Checkbox defaultChecked invalid label="Checked, error" />
      <Checkbox defaultChecked disabled label="Checked, disabled" />
      <Checkbox checked="indeterminate" label="Mixed" />
      <Checkbox checked="indeterminate" invalid label="Mixed, error" />
      <Checkbox checked="indeterminate" disabled label="Mixed, disabled" />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole('checkbox')).toHaveLength(9);
    await expect(canvas.getByRole('checkbox', { name: 'Mixed, disabled' })).toBeDisabled();
    await expect(canvas.getByRole('checkbox', { name: 'Mixed' })).toHaveAttribute('aria-checked', 'mixed');
  },
};

// Show label off: needs an aria-label.
export const NoLabel: Story = {
  args: { label: undefined, 'aria-label': 'Select invoice INV-1041' },
  play: async ({ canvas }) => {
    const box = canvas.getByRole('checkbox', { name: 'Select invoice INV-1041' });
    await expect(size(box)).toEqual([16, 16]);
    await userEvent.click(box);
    await expect(box).toBeChecked();
  },
};

// Show description: one sentence under the label, indented 24 px, linked with aria-describedby.
export const WithDescription: Story = {
  args: { description: 'A short email once a month. Unsubscribe at any time.' },
  play: async ({ canvas }) => {
    const box = canvas.getByRole('checkbox');
    await expect(box).toHaveAccessibleDescription('A short email once a month. Unsubscribe at any time.');
    const label = canvas.getByText('Send me product updates');
    const desc = canvas.getByText(/A short email/);
    await expect(Math.round(desc.getBoundingClientRect().left - box.getBoundingClientRect().left)).toBe(0);
    await expect(Math.round(desc.getBoundingClientRect().left - label.getBoundingClientRect().left)).toBe(-24);
  },
};

// Stress: long label wraps, the box keeps 16 px on the first line; the description clamps at 3 lines.
const longLabel = 'I agree that Acme may send invoices, receipts and payment reminders to the billing address on file for my workspace';
const longDescription = 'You can change this at any time in Settings. Reminders are sent three days before a payment is due and again on the due date. Receipts are sent after every successful payment. This sentence is deliberately long to check the clamp.';
export const LongText: Story = { tags: ['!dev'],
  args: { label: longLabel, description: longDescription },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  play: async ({ canvas, canvasElement }) => {
    const box = canvas.getByRole('checkbox');
    await expect(size(box)).toEqual([16, 16]);
    const field = canvasElement.querySelector('[data-slot="checkbox-field"]') as HTMLElement;
    await expect(field.scrollWidth).toBeLessThanOrEqual(field.clientWidth);
    const label = canvas.getByText(longLabel);
    await expect(label.getBoundingClientRect().height).toBeGreaterThan(40);
    await expect(Math.round(canvas.getByText(/You can change this/).getBoundingClientRect().height)).toBe(60);
    // Box centered on the first label line (20 px line, 16 px box).
    await expect(Math.round(box.getBoundingClientRect().top - label.getBoundingClientRect().top)).toBe(2);
  },
};

export const Narrow368: Story = { tags: ['!dev'],
  ...LongText,
  decorators: [Story => <div className="w-[368px]"><Story /></div>],
  play: async ({ canvas, canvasElement }) => {
    const field = canvasElement.querySelector('[data-slot="checkbox-field"]') as HTMLElement;
    await expect(Math.round(field.getBoundingClientRect().width)).toBe(368);
    await expect(field.scrollWidth).toBeLessThanOrEqual(field.clientWidth);
    await expect(size(canvas.getByRole('checkbox'))).toEqual([16, 16]);
  },
};

// Theme copies: axe checks contrast in each mode (hidden from the sidebar).
export const AllStatesDark: Story = { ...AllStates, tags: ['!dev'], globals: { theme: 'Dark' } };
export const AllStatesCorporate: Story = { ...AllStates, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
