import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { AiSuggestion } from './ai-suggestion';

const meta = {
  title: 'AI Chat/AI Suggestion',
  component: AiSuggestion,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'A value the AI proposes for a form field: dashed tinted box, the reason, Accept and Dismiss. Nothing is saved until the person accepts; accepted values keep an "AI generated" label with Undo until edited. Figma: AI Chat / AI Suggestion. Guide: eggux build-ui/components/ai-chat.md' } },
  },
  args: { onAccept: fn(), onDismiss: fn(), onUndo: fn(), onValueChange: fn() },
  decorators: [Story => <div className="w-[320px] max-w-full"><Story /></div>],
} satisfies Meta<typeof AiSuggestion>;
export default meta;
type Story = StoryObj<typeof meta>;

const root = (el: HTMLElement) => el.querySelector('[data-slot="ai-suggestion"]') as HTMLElement;

// Figma State=suggested (320 × 124). Accept saves, shows the AI label and moves focus to the field.
export const Default: Story = {
  play: async ({ canvas, args, canvasElement }) => {
    await expect(Math.round(root(canvasElement).getBoundingClientRect().height)).toBe(124);
    const accept = canvas.getByRole('button', { name: 'Accept Expense category' });
    await expect(Math.round(accept.getBoundingClientRect().height)).toBe(32);
    await expect(args.onAccept).not.toHaveBeenCalled();
    await userEvent.click(accept);
    await expect(args.onAccept).toHaveBeenCalledWith('Office supplies');
    const field = canvas.getByRole('textbox', { name: 'Expense category' });
    await expect(field).toHaveFocus();
    await expect(field).toHaveValue('Office supplies');
    await expect(canvas.getByText('AI generated')).toBeVisible();
    // Undo goes back to the suggestion, focus on Accept.
    await userEvent.click(canvas.getByRole('button', { name: 'Undo' }));
    await expect(args.onUndo).toHaveBeenCalledTimes(1);
    await expect(canvas.getByRole('button', { name: 'Accept Expense category' })).toHaveFocus();
  },
};

// Dismiss saves nothing and moves focus to the empty field.
export const Dismiss: Story = {
  play: async ({ canvas, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Dismiss Expense category' }));
    await expect(args.onDismiss).toHaveBeenCalledTimes(1);
    await expect(args.onAccept).not.toHaveBeenCalled();
    const field = canvas.getByRole('textbox', { name: 'Expense category' });
    await expect(field).toHaveFocus();
    await expect(field).toHaveValue('');
    await expect(canvas.queryByText('AI generated')).not.toBeInTheDocument();
  },
};

// Keyboard: Tab reaches Accept then Dismiss; Enter accepts.
export const Keyboard: Story = {
  play: async ({ canvas, args }) => {
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Accept Expense category' })).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Dismiss Expense category' })).toHaveFocus();
    await userEvent.tab({ shift: true });
    await userEvent.keyboard('{Enter}');
    await expect(args.onAccept).toHaveBeenCalledWith('Office supplies');
    await expect(canvas.getByRole('textbox', { name: 'Expense category' })).toHaveFocus();
  },
};

// Figma State=accepted (320 × 86): field, AI generated label, note with Undo. Editing removes the label.
export const Accepted: Story = {
  args: { state: 'accepted' },
  play: async ({ canvas, args, canvasElement }) => {
    await expect(Math.round(root(canvasElement).getBoundingClientRect().height)).toBe(86);
    await expect(canvas.getByText('AI generated')).toBeVisible();
    await expect(canvas.getByText('Suggested by AI and accepted by you.')).toBeVisible();
    const field = canvas.getByRole('textbox', { name: 'Expense category' });
    await userEvent.type(field, ' and stationery');
    await expect(args.onValueChange).toHaveBeenLastCalledWith('Office supplies and stationery');
    await expect(canvas.queryByText('AI generated')).not.toBeInTheDocument();
    await expect(canvas.queryByRole('button', { name: 'Undo' })).not.toBeInTheDocument();
  },
};

export const LowConfidence: Story = {
  args: { label: 'Cost center', value: 'Marketing', reason: 'Low confidence: only 1 earlier invoice from this vendor. Check before accepting.' },
};

// Stress: long label truncates to one line; long value and reason wrap; actions keep their size.
const long = {
  label: 'Expense category for the Acme Industrial supplies invoice with a much longer label',
  value: 'Office supplies, printer paper, toner cartridges and desk accessories for the Berlin office',
  reason: 'Based on 12 earlier invoices from this vendor, all of them booked under the same category in the last 18 months.',
};
export const Column276: Story = { tags: ['!dev'],
  args: long,
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  play: async ({ canvas, canvasElement }) => {
    const label = canvas.getByText(long.label);
    await expect(Math.round(label.getBoundingClientRect().height)).toBe(20);
    await expect(label.scrollWidth).toBeGreaterThan(label.clientWidth);
    const el = root(canvasElement);
    await expect(el.scrollWidth).toBeLessThanOrEqual(el.clientWidth);
    await expect(Math.round(canvas.getByRole('button', { name: /^Accept/ }).getBoundingClientRect().height)).toBe(32);
  },
};
export const Column368: Story = { tags: ['!dev'], ...Column276, decorators: [Story => <div className="w-[368px]"><Story /></div>] };
export const AcceptedLong: Story = { tags: ['!dev'], args: { ...long, state: 'accepted' }, decorators: [Story => <div className="w-[276px]"><Story /></div>] };

export const DefaultDark: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Dark' } };
export const AcceptedDark: Story = { ...Accepted, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
