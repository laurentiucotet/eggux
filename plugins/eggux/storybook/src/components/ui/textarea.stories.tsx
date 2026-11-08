import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { Field } from './field';
import { Textarea } from './textarea';

const meta = {
  title: 'Components/Input/Textarea',
  component: Textarea,
  parameters: {
    docs: { description: { component: 'Free text longer than one line: notes, descriptions, reasons. Min height 64, grows with the text up to a max height, then scrolls. Put it in a Field for label, hint, error and counter; read-only for notes locked after approval. One line: Input; formatting: Rich Text Editor. Figma: Input page / Textarea. Guide: eggux build-ui/components/input.md' } },
  },
  args: { placeholder: 'Add a note…', onChange: fn() },
  decorators: [Story => <div className="w-80 max-w-full"><Story /></div>],
  render: args => (
    <Field label="Note for the approver">
      <Textarea {...args} />
    </Field>
  ),
} satisfies Meta<typeof Textarea>;
export default meta;
type Story = StoryObj<typeof meta>;

const h = (el: Element) => Math.round(el.getBoundingClientRect().height);
const probe = (cls: string) => { const p = document.createElement('span'); p.className = cls; document.body.append(p); const s = getComputedStyle(p); return { bg: s.backgroundColor, border: s.borderTopColor, remove: () => p.remove() }; };

// Figma State=default, Content=placeholder: 320 × 64, 12 / 8 px padding, body/small, radius/md.
// Typing works, Enter adds a line, the box grows with the text.
export const Default: Story = {
  play: async ({ canvas, args }) => {
    const box = canvas.getByRole('textbox', { name: 'Note for the approver' });
    await expect([Math.round(box.getBoundingClientRect().width), h(box)]).toEqual([320, 64]);
    const s = getComputedStyle(box);
    await expect([s.paddingLeft, s.paddingTop, s.fontSize, s.borderTopLeftRadius]).toEqual(['12px', '8px', '14px', '8px']);
    await userEvent.type(box, 'Budget approved by finance.{Enter}Ship after the vendor signs.{Enter}Check the VAT number.{Enter}Send the PO to Acme.');
    await expect(box).toHaveValue('Budget approved by finance.\nShip after the vendor signs.\nCheck the VAT number.\nSend the PO to Acme.');
    await expect(args.onChange).toHaveBeenCalled();
    await expect(h(box)).toBeGreaterThan(64);
  },
};

// Keyboard: Tab reaches it and Tab leaves it (never trapped); focus shows the Figma ring.
export const Keyboard: Story = {
  render: args => (
    <div className="flex flex-col gap-3">
      <Field label="Note for the approver"><Textarea {...args} /></Field>
      <button type="button" className="self-start text-sm underline">Next</button>
    </div>
  ),
  play: async ({ canvas }) => {
    const box = canvas.getByRole('textbox', { name: 'Note for the approver' });
    await userEvent.tab();
    await expect(box).toHaveFocus();
    const ring = probe('border border-ring');
    await expect(getComputedStyle(box).borderTopColor).toBe(ring.border);
    ring.remove();
    await expect(getComputedStyle(box).boxShadow).toContain('0px 0px 0px 4px');
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Next' })).toHaveFocus();
  },
};

// Figma State=error: Field error, aria-invalid, destructive border.
export const ErrorState: Story = {
  name: 'Error',
  render: args => (
    <Field label="Reason for the refund" error="Add a reason so the customer knows why.">
      <Textarea {...args} />
    </Field>
  ),
  play: async ({ canvas }) => {
    const box = canvas.getByRole('textbox', { name: 'Reason for the refund' });
    await expect(box).toHaveAttribute('aria-invalid', 'true');
    await expect(box).toHaveAccessibleDescription('Add a reason so the customer knows why.');
    const red = probe('border border-destructive');
    await expect(getComputedStyle(box).borderTopColor).toBe(red.border);
    red.remove();
  },
};

// Figma State=disabled: not editable, faded, keeps the white fill.
export const Disabled: Story = {
  render: args => (
    <Field label="Note for the approver" disabled><Textarea {...args} defaultValue="Waiting for the contract." /></Field>
  ),
  play: async ({ canvas }) => {
    const box = canvas.getByRole('textbox', { name: 'Note for the approver' });
    await expect(box).toBeDisabled();
    await expect(getComputedStyle(box).opacity).toBe('0.5');
    const bg = probe('bg-background');
    await expect(getComputedStyle(box).backgroundColor).toBe(bg.bg);
    bg.remove();
  },
};

// Figma State=read-only: muted fill, no shadow, full-contrast text that stays selectable and focusable.
export const ReadOnly: Story = {
  render: args => (
    <Field label="Approval note"><Textarea {...args} readOnly defaultValue="Approved by Ana Berg on 12 March. Payment terms: 30 days." /></Field>
  ),
  play: async ({ canvas }) => {
    const box = canvas.getByRole('textbox', { name: 'Approval note' });
    await userEvent.type(box, ' Changed');
    await expect(box).toHaveValue('Approved by Ana Berg on 12 March. Payment terms: 30 days.');
    await expect(box).toHaveFocus();
    const muted = probe('bg-muted');
    await expect(getComputedStyle(box).backgroundColor).toBe(muted.bg);
    muted.remove();
    // shadow-none: every shadow layer is transparent.
    await expect(getComputedStyle(box).boxShadow).toMatch(/^(none|(rgba\(0, 0, 0, 0\) 0px 0px 0px 0px(, )?)+)$/);
  },
};

// Figma Field Show counter: the limit shows at the right of the label; past it the Field shows the
// error and typing is never blocked.
function CounterDemo() {
  const [value, setValue] = React.useState('The vendor missed two delivery dates in Q3.');
  const over = value.length > 60;
  return (
    <Field label="Reason" counter={{ value: value.length, limit: 60 }} error={over ? 'Use 60 characters or fewer.' : undefined}>
      <Textarea value={value} onChange={e => setValue(e.target.value)} />
    </Field>
  );
}
export const WithCounter: Story = {
  parameters: { controls: { disable: true } },
  render: () => <CounterDemo />,
  play: async ({ canvas }) => {
    const box = canvas.getByRole('textbox', { name: 'Reason' });
    await userEvent.type(box, ' We ask for a new plan.');
    await expect(box).toHaveAttribute('aria-invalid', 'true');
    await expect((box as HTMLTextAreaElement).value.length).toBeGreaterThan(60);
  },
};

// Stress test: long text in the 276 and 368 columns wraps inside the box (no horizontal scroll),
// grows to the max height (240), then scrolls.
const long = Array.from({ length: 14 }, (_, i) => `Line ${i + 1}: delivery for Acme Holdings International confirmed by the warehouse team.`).join('\n');
export const Stress: Story = {
  parameters: { controls: { disable: true } },
  tags: ['!dev'],
  decorators: [Story => <div><Story /></div>],
  render: () => (
    <div className="flex gap-4">
      <div className="w-[276px]"><Field label="Notes 276"><Textarea defaultValue={long} /></Field></div>
      <div className="w-[368px]"><Field label="Notes 368"><Textarea defaultValue="Short note." /></Field></div>
    </div>
  ),
  play: async ({ canvas }) => {
    const tall = canvas.getByRole('textbox', { name: 'Notes 276' });
    await expect(h(tall)).toBe(240);
    await expect(tall.scrollHeight).toBeGreaterThan(tall.clientHeight);
    await expect(tall.scrollWidth).toBeLessThanOrEqual(tall.clientWidth);
    await expect(h(canvas.getByRole('textbox', { name: 'Notes 368' }))).toBe(64);
  },
};

export const Dark: Story = { tags: ['!dev'], globals: { theme: 'Dark' }, render: args => <Field label="Note"><Textarea {...args} defaultValue="Budget approved." /></Field> };
export const CorporateLight: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' }, render: args => <Field label="Note"><Textarea {...args} readOnly defaultValue="Budget approved." /></Field> };
