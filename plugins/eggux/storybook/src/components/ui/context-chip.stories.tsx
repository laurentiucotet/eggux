import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { ContextChip, type ContextChipType } from './context-chip';

const meta = {
  title: 'Components/AI Chat/Context Chip',
  component: ContextChip,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'What the assistant will use: a file, a record or a person, in the Prompt Input Attachments slot or above a message. Remove with x ("Remove <label>"); labels truncate at 180 px with the full text in a tooltip. Figma: AI Chat / Context Chip. Guide: eggux build-ui/components/ai-chat.md' } },
  },
  args: { onRemove: fn() },
} satisfies Meta<typeof ContextChip>;
export default meta;
type Story = StoryObj<typeof meta>;

const chip = (el: HTMLElement) => el.querySelector('[data-slot="context-chip"]') as HTMLElement;

// Figma Type=file: 24 high, muted fill, remove x.
export const Default: Story = {
  play: async ({ canvas, canvasElement, args }) => {
    await expect(Math.round(chip(canvasElement).getBoundingClientRect().height)).toBe(24);
    await expect(canvas.getByText('Q3 report.pdf')).toBeVisible();
    await expect(canvasElement.querySelector('svg[data-icon="file-text"]')).not.toBeNull();
    const remove = canvas.getByRole('button', { name: 'Remove Q3 report.pdf' });
    await userEvent.click(remove);
    await expect(args.onRemove).toHaveBeenCalledTimes(1);
    // Keyboard: Tab reaches the x, Enter removes.
    remove.blur();
    await userEvent.tab();
    await expect(remove).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onRemove).toHaveBeenCalledTimes(2);
  },
};

// Figma Type=file, record, person: each type has its own icon and text property.
export const Types: Story = {
  render: args => (
    <div className="flex flex-wrap gap-2">
      <ContextChip {...args} type="file" />
      <ContextChip {...args} type="record" />
      <ContextChip {...args} type="person" />
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    for (const [type, icon, label] of [['file', 'file-text', 'Q3 report.pdf'], ['record', 'link', 'INV-1041'], ['person', 'user', 'Ana Popescu']] as const) {
      const el = canvasElement.querySelector(`[data-type="${type}"]`) as HTMLElement;
      await expect(el.querySelector(`svg[data-icon="${icon}"]`)).not.toBeNull();
      await expect(el).toHaveTextContent(label);
      await expect(canvas.getByRole('button', { name: `Remove ${label}` })).toBeVisible();
    }
  },
};

// Figma Show remove off: a chip that cannot be removed (above a sent message).
export const WithoutRemove: Story = {
  args: { type: 'record', showRemove: false },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('button')).not.toBeInTheDocument();
    await expect(canvas.getByText('INV-1041')).toBeVisible();
  },
};

// Context added to a request: the list announces removals politely and focus moves to the next
// chip (or the message field when none is left).
function ContextList() {
  const [items, setItems] = React.useState<{ type: ContextChipType; label: string }[]>([
    { type: 'record', label: 'INV-1041 (this invoice)' },
    { type: 'file', label: 'Q3 report.pdf' },
    { type: 'person', label: 'Ana Popescu' },
  ]);
  const [status, setStatus] = React.useState('');
  const listRef = React.useRef<HTMLDivElement>(null);
  const fieldRef = React.useRef<HTMLInputElement>(null);
  const remove = (index: number) => {
    const removed = items[index];
    setItems(items.filter((_, i) => i !== index));
    setStatus(`Removed ${removed.label}`);
    requestAnimationFrame(() => {
      const buttons = listRef.current?.querySelectorAll('button');
      const next = buttons?.[Math.min(index, buttons.length - 1)];
      (next ?? fieldRef.current)?.focus();
    });
  };
  return (
    <div className="flex w-[368px] flex-col gap-2">
      <div ref={listRef} role="group" aria-label="Context for this request" className="flex flex-wrap gap-2">
        {items.map((item, i) => (
          <ContextChip key={item.label} type={item.type} {...{ [item.type]: item.label }} onRemove={() => remove(i)} />
        ))}
      </div>
      <input ref={fieldRef} aria-label="Message" placeholder="Ask about this invoice…" className="h-9 rounded-input border border-input bg-background px-3 text-sm" />
      <p role="status" aria-live="polite" className="sr-only">{status}</p>
    </div>
  );
}

export const RemoveFromList: Story = {
  parameters: { controls: { disable: true } },
  render: () => <ContextList />,
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Remove Q3 report.pdf' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('Removed Q3 report.pdf');
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Remove Ana Popescu' })).toHaveFocus());
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Remove INV-1041 (this invoice)' })).toHaveFocus());
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(canvas.getByRole('textbox', { name: 'Message' })).toHaveFocus());
  },
};

const longName = 'Rechnungsprüfungsverfahren Acme Industrial Supplies GmbH Q3 2026 final.pdf';

// Stress test: the label truncates at 180 px, the full text is in the tooltip, still one line.
export const LongText: Story = { tags: ['!dev'],
  args: { file: longName },
  play: async ({ canvasElement, canvas }) => {
    const label = canvasElement.querySelector('[data-slot="context-chip-label"]') as HTMLElement;
    await expect(Math.round(label.getBoundingClientRect().width)).toBe(180);
    await expect(label.scrollWidth).toBeGreaterThan(label.clientWidth);
    await expect(label).toHaveAttribute('title', longName);
    await expect(Math.round(chip(canvasElement).getBoundingClientRect().height)).toBe(24);
    await expect(canvas.getByRole('button', { name: `Remove ${longName}` })).toBeVisible();
  },
};

// Narrow column (128 px): the chip shrinks below the 180 px cap and keeps the x visible.
export const NarrowColumn: Story = { tags: ['!dev'],
  args: { file: longName },
  decorators: [Story => <div className="flex w-32"><Story /></div>],
  play: async ({ canvasElement, canvas }) => {
    const el = chip(canvasElement);
    await expect(el.getBoundingClientRect().width).toBeLessThanOrEqual(128);
    const x = canvas.getByRole('button').getBoundingClientRect();
    await expect(x.right).toBeLessThanOrEqual(el.getBoundingClientRect().right);
  },
};

// Short label.
export const ShortText: Story = { tags: ['!dev'],
  args: { file: 'A' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Remove A' })).toBeVisible();
  },
};

export const TypesDark: Story = { ...Types, tags: ['!dev'], globals: { theme: 'Dark' } };
export const TypesCorporate: Story = { ...Types, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
