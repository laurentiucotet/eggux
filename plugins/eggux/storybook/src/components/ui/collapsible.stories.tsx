import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { Collapsible } from './collapsible';
import { Field } from './field';
import { Input } from './input';

// Figma Collapsible Content: two Fields with an Input each.
const fields = (
  <>
    <Field label="Purchase order number" hint="Shown on the invoice PDF."><Input defaultValue="PO-2026-0418" /></Field>
    <Field label="Payment terms" hint="Days until the invoice is due."><Input defaultValue="30 days" /></Field>
  </>
);

const meta = {
  title: 'Components/Accordion/Collapsible',
  component: Collapsible,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'A link trigger with a chevron that opens optional content in place: advanced fields in a form, "Show 3 more line items". Closed by default; open when a field inside has a value or an error. Figma: Accordion page / Collapsible. Guide: eggux build-ui/components/accordion.md' } },
  },
  args: { label: 'Show advanced settings', openLabel: 'Hide advanced settings', children: fields, onOpenChange: fn() },
  decorators: [Story => <div className="w-[400px] max-w-full"><Story /></div>],
} satisfies Meta<typeof Collapsible>;
export default meta;
type Story = StoryObj<typeof meta>;

const root = (el: HTMLElement) => el.querySelector('[data-slot="collapsible"]') as HTMLElement;

// Figma State=collapsed (400 × 32) and expanded (236): the label says Show / Hide.
export const Default: Story = {
  play: async ({ canvas, canvasElement, args }) => {
    const trigger = canvas.getByRole('button', { name: 'Show advanced settings' });
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(Math.round(root(canvasElement).getBoundingClientRect().height)).toBe(32);
    await expect(canvas.queryByRole('textbox')).not.toBeInTheDocument();
    await userEvent.click(trigger);
    await expect(args.onOpenChange).toHaveBeenCalledWith(true);
    await expect(trigger).toHaveAccessibleName('Hide advanced settings');
    await expect(trigger).toHaveFocus();
    await expect(Math.round(root(canvasElement).getBoundingClientRect().height)).toBe(236);
    await expect(canvas.getByRole('textbox', { name: 'Purchase order number' })).toBeVisible();
  },
};

// Content stays mounted while collapsed: a typed value survives closing and opening again.
export const KeepsValues: Story = {
  args: { defaultOpen: true },
  play: async ({ canvas }) => {
    const po = canvas.getByRole('textbox', { name: 'Purchase order number' });
    await userEvent.clear(po);
    await userEvent.type(po, 'PO-2026-0999');
    const trigger = canvas.getByRole('button', { name: 'Hide advanced settings' });
    await userEvent.click(trigger);
    await userEvent.click(trigger);
    await expect(canvas.getByRole('textbox', { name: 'Purchase order number' })).toHaveValue('PO-2026-0999');
  },
};

// Keyboard: Tab reaches the trigger, Enter and Space toggle, focus stays on it.
export const Keyboard: Story = {
  play: async ({ canvas }) => {
    await userEvent.tab();
    const trigger = canvas.getByRole('button');
    await expect(trigger).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await userEvent.keyboard(' ');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(trigger).toHaveFocus();
  },
};

// "Show 3 more" under a short list.
export const ShowMoreRows: Story = {
  args: {
    label: 'Show 3 more line items',
    openLabel: 'Hide 3 line items',
    children: ['Support plan · €240', 'Onboarding · €600', 'Extra seats (5) · €150'].map(r => (
      <p key={r} className="text-sm text-foreground">{r}</p>
    )),
  },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Show 3 more line items' }));
    await expect(canvas.getByText('Onboarding · €600')).toBeVisible();
  },
};

// Stress test (Figma "Stress test / Collapsible"): content fills a 276 column, nothing overflows.
export const Narrow: Story = { tags: ['!dev'],
  args: { defaultOpen: true },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  play: async ({ canvas, canvasElement }) => {
    const input = canvas.getByRole('textbox', { name: 'Payment terms' });
    await expect(Math.round(input.getBoundingClientRect().width)).toBe(276);
    await expect(root(canvasElement).scrollWidth).toBeLessThanOrEqual(276);
  },
};

export const ExpandedDark: Story = { args: { defaultOpen: true }, tags: ['!dev'], globals: { theme: 'Dark' } };
export const ExpandedCorporate: Story = { args: { defaultOpen: true }, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
