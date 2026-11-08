import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { InlineEdit } from './inline-edit';

const meta = {
  title: 'Components/Input/Inline Edit',
  component: InlineEdit,
  parameters: {
    docs: { description: { component: 'Edit one short value in place (a title, a name, a reference): hover shows it is editable, click or Enter opens the input, Enter or the check saves, Escape or x cancels, blur saves. Saving shows a spinner; errors keep the input open with the message. Several related fields: a form. Figma: Input page / Inline Edit. Guide: eggux build-ui/components/input.md' } },
  },
  args: { label: 'title', defaultValue: 'Q3 vendor review', onSave: fn(), validate: (v: string) => (v.trim() ? undefined : 'Enter a name.') },
  decorators: [Story => <div className="w-80 max-w-full"><Story /></div>],
} satisfies Meta<typeof InlineEdit>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => { const r = el.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)]; };
const valueButton = (canvas: { getByRole: (r: string, o: object) => HTMLElement }) => canvas.getByRole('button', { name: /^Edit title:/ });

// Figma State=view -> editing -> view: 320 × 36, body/default. Click opens the input with the text
// selected; Enter saves; focus returns to the value.
export const Default: Story = {
  play: async ({ canvas, args }) => {
    const value = valueButton(canvas);
    await expect(value).toHaveAccessibleName('Edit title: Q3 vendor review');
    await expect(box(value)).toEqual([320, 36]);
    await expect(getComputedStyle(value).fontSize).toBe('16px');
    await userEvent.click(value);
    const input = canvas.getByRole('textbox', { name: 'title' }) as HTMLInputElement;
    await expect(input).toHaveFocus();
    await expect([input.selectionStart, input.selectionEnd]).toEqual([0, 16]);
    await userEvent.keyboard('Q3 vendor review: Acme{Enter}');
    await expect(args.onSave).toHaveBeenCalledWith('Q3 vendor review: Acme');
    const after = canvas.getByRole('button', { name: 'Edit title: Q3 vendor review: Acme' });
    await waitFor(() => expect(after).toHaveFocus());
  },
};

// Figma State=hover: background/muted fill and the pencil. Keyboard focus shows the same look (the
// test uses focus: headless Chromium does not match the (hover: hover) media query of hover:).
export const Hover: Story = {
  play: async ({ canvas, canvasElement }) => {
    const value = valueButton(canvas);
    const pencil = canvasElement.querySelector('[data-slot="inline-edit-pencil"]')!;
    await expect(getComputedStyle(pencil).opacity).toBe('0');
    await userEvent.tab();
    await expect(value).toHaveFocus();
    await expect(getComputedStyle(pencil).opacity).toBe('1');
    await expect(box(pencil)).toEqual([14, 14]);
    const p = document.createElement('span'); p.className = 'bg-muted'; document.body.append(p);
    await expect(getComputedStyle(value).backgroundColor).toBe(getComputedStyle(p).backgroundColor);
    p.remove();
  },
};

// Keyboard: Tab reaches the value, Enter opens, Escape cancels (value unchanged), focus returns.
export const Keyboard: Story = {
  play: async ({ canvas, args }) => {
    await userEvent.tab();
    await expect(valueButton(canvas)).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    const input = canvas.getByRole('textbox', { name: 'title' });
    await expect(input).toHaveFocus();
    await userEvent.keyboard('Something else{Escape}');
    await expect(args.onSave).not.toHaveBeenCalled();
    await expect(valueButton(canvas)).toHaveAccessibleName('Edit title: Q3 vendor review');
    await expect(valueButton(canvas)).toHaveFocus();
  },
};

// Figma State=editing: input + check (save) + x (cancel), 6 px apart, 36 high. The buttons work; an
// unchanged value just closes.
export const Editing: Story = {
  play: async ({ canvas, canvasElement, args }) => {
    await userEvent.click(valueButton(canvas));
    const editor = canvasElement.querySelector('[data-slot="inline-edit-editor"]')!;
    await expect(box(editor)).toEqual([320, 36]);
    const save = canvas.getByRole('button', { name: 'Save' });
    const cancel = canvas.getByRole('button', { name: 'Cancel' });
    await expect(box(save)).toEqual([36, 36]);
    await expect(Math.round(cancel.getBoundingClientRect().left - save.getBoundingClientRect().right)).toBe(6);
    await userEvent.click(cancel);
    await expect(valueButton(canvas)).toHaveFocus();
    await userEvent.click(valueButton(canvas));
    await userEvent.click(canvas.getByRole('button', { name: 'Save' }));
    await expect(args.onSave).not.toHaveBeenCalled();
    await userEvent.click(valueButton(canvas));
    await userEvent.keyboard('Vendor review 2026');
    await userEvent.click(canvas.getByRole('button', { name: 'Save' }));
    await expect(args.onSave).toHaveBeenCalledWith('Vendor review 2026');
  },
};

// Blur saves.
export const BlurSaves: Story = {
  tags: ['!dev'],
  render: args => (
    <div className="flex flex-col gap-3">
      <InlineEdit {...args} />
      <button type="button" className="self-start text-sm underline">Next</button>
    </div>
  ),
  play: async ({ canvas, args }) => {
    await userEvent.click(valueButton(canvas));
    await userEvent.keyboard('Vendor review');
    await userEvent.click(canvas.getByRole('button', { name: 'Next' }));
    await expect(args.onSave).toHaveBeenCalledWith('Vendor review');
    await expect(args.onSave).toHaveBeenCalledTimes(1);
    await expect(canvas.getByRole('button', { name: 'Edit title: Vendor review' })).toBeInTheDocument();
  },
};

// Figma State=saving: a spinner replaces the buttons and "Saving" is announced; the new value shows after.
function SavingDemo() {
  const [resolve, setResolve] = React.useState<(() => void) | null>(null);
  return (
    <div className="flex flex-col gap-3">
      <InlineEdit label="title" defaultValue="Q3 vendor review" onSave={() => new Promise<void>(r => setResolve(() => r))} />
      <button type="button" className="self-start text-sm underline" onClick={() => resolve?.()}>Finish saving</button>
    </div>
  );
}
export const Saving: Story = {
  parameters: { controls: { disable: true } },
  render: () => <SavingDemo />,
  play: async ({ canvas, canvasElement }) => {
    await userEvent.click(valueButton(canvas));
    await userEvent.keyboard('Q4 vendor review{Enter}');
    await expect(canvasElement.querySelector('[data-slot="inline-edit"]')).toHaveAttribute('data-state', 'saving');
    await expect(canvas.getByRole('status')).toHaveTextContent('Saving');
    await expect(canvas.getByRole('textbox', { name: 'title' })).toHaveAttribute('aria-busy', 'true');
    await expect(canvas.queryByRole('button', { name: 'Save' })).not.toBeInTheDocument();
    await expect(box(canvasElement.querySelector('[data-slot="spinner"]')!)).toEqual([16, 16]);
    // Typing is ignored while saving.
    await userEvent.keyboard('x');
    await expect(canvas.getByRole('textbox', { name: 'title' })).toHaveValue('Q4 vendor review');
    canvas.getByRole('button', { name: 'Finish saving' }).click();
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Edit title: Q4 vendor review' })).toBeInTheDocument());
  },
};

// Figma State=error: the input stays open with the typed value, aria-invalid and the message.
export const ErrorState: Story = {
  name: 'Error',
  play: async ({ canvas, args }) => {
    await userEvent.click(valueButton(canvas));
    await userEvent.keyboard('{Backspace}{Enter}');
    const input = canvas.getByRole('textbox', { name: 'title' });
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(input).toHaveAccessibleDescription('Enter a name.');
    await expect(canvas.getByRole('alert')).toHaveTextContent('Enter a name.');
    await expect(input).toHaveFocus();
    await expect(args.onSave).not.toHaveBeenCalled();
    await userEvent.type(input, 'Vendor review');
    await userEvent.keyboard('{Enter}');
    await expect(args.onSave).toHaveBeenCalledWith('Vendor review');
  },
};

// A failed save keeps the input open with the typed value and the server message.
export const SaveFails: Story = {
  tags: ['!dev'],
  args: { onSave: fn(async () => { throw new globalThis.Error('A project with this name already exists.'); }) },
  play: async ({ canvas }) => {
    await userEvent.click(valueButton(canvas));
    await userEvent.keyboard('Q2 vendor review{Enter}');
    await waitFor(() => expect(canvas.getByRole('alert')).toHaveTextContent('A project with this name already exists.'));
    await expect(canvas.getByRole('textbox', { name: 'title' })).toHaveValue('Q2 vendor review');
  },
};

// Stress test: a long value in the 276 and 368 columns stays on one line and truncates; the empty
// value shows the placeholder.
export const Stress: Story = {
  tags: ['!dev'],
  decorators: [Story => <div><Story /></div>],
  render: args => (
    <div className="flex flex-col gap-3">
      <div className="w-[276px]"><InlineEdit {...args} label="title 276" defaultValue="Quarterly vendor review for Acme Holdings International and subsidiaries" /></div>
      <div className="w-[368px]"><InlineEdit {...args} label="title 368" defaultValue="Quarterly vendor review for Acme Holdings International and subsidiaries" /></div>
      <div className="w-[276px]"><InlineEdit {...args} label="owner" defaultValue="" placeholder="Add an owner" /></div>
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    for (const b of Array.from(canvasElement.querySelectorAll('[data-slot="inline-edit-value"]'))) {
      await expect(box(b)[1]).toBe(36);
    }
    await expect(canvas.getByRole('button', { name: 'Edit owner: Add an owner' })).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: /^Edit title 276/ }));
    const editor = canvasElement.querySelector('[data-slot="inline-edit-editor"]')!;
    await expect(box(editor)).toEqual([276, 36]);
  },
};

export const Dark: Story = { tags: ['!dev'], globals: { theme: 'Dark' } };
export const CorporateLight: Story = {
  tags: ['!dev'],
  globals: { theme: 'Corporate Light' },
  play: async ({ canvas }) => {
    await userEvent.click(valueButton(canvas));
    await userEvent.keyboard('{Backspace}{Enter}');
    await expect(canvas.getByRole('alert')).toBeInTheDocument();
  },
};
