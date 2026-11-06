import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';
import { Field } from './field';
import { TagInput, type TagInputOption } from './tag-input';

const meta = {
  title: 'Components/Select/Tag Input',
  component: TagInput,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Several values in one field: a multi-select from a list (chevron on: the list opens with a check on each picked option and stays open while picking) or free tags (chevron off: Enter or comma adds). At most ~5 tags, then "+3 more". Backspace in the empty field removes the last tag; each Tag x is "Remove <value>". Tags wrap and the field grows. Adding and removing are announced. Size default (min 36), sm (min 32), lg (min 40); tags stay 24. Figma: Select page / Tag Input. Guide: eggux build-ui/components/select.md' } },
  },
  decorators: [Story => <div className="w-[360px]"><Story /></div>],
} satisfies Meta<typeof TagInput>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => {
  const r = el.getBoundingClientRect();
  return [Math.round(r.width), Math.round(r.height)];
};
const css = (el: Element) => getComputedStyle(el);
const probe = (className: string, prop: 'color' | 'backgroundColor' | 'borderTopColor') => {
  const el = document.createElement('span');
  el.className = className;
  (document.querySelector('#storybook-root') ?? document.body).append(el);
  const value = getComputedStyle(el)[prop];
  el.remove();
  return value;
};

const skills: TagInputOption[] = ['Writing', 'Copywriting', 'UX writing', 'Design', 'Research', 'Strategy', 'Analytics', 'Finance'].map(l => ({
  value: l.toLowerCase().replace(' ', '-'),
  label: l,
}));

const onValueChange = fn();

// Figma "Example / multi-select open": 360 x 36, Tags (24 high, 4 apart), chevrons-up-down. Typing
// filters; Enter checks and adds a tag; the list stays open while picking; Escape closes.
export const Default: Story = {
  render: () => (
    <Field label="Skills">
      <TagInput options={skills} defaultValue={['design', 'research']} listLabel="Skills" onValueChange={onValueChange} />
    </Field>
  ),
  play: async ({ canvas, canvasElement }) => {
    const input = canvas.getByRole('combobox', { name: 'Skills' });
    const field = canvasElement.querySelector('[data-slot="tag-input"]')!;
    await expect(box(field)).toEqual([360, 36]);
    await expect([css(field).paddingLeft, css(field).paddingRight, css(field).paddingTop]).toEqual(['6px', '12px', '4px']);
    await expect(css(field).borderTopColor).toBe(probe('border border-input', 'borderTopColor'));
    const tags = field.querySelectorAll('[data-slot="tag"]');
    await expect(tags).toHaveLength(2);
    await expect(box(tags[0])[1]).toBe(24);
    await expect(Math.round(tags[1].getBoundingClientRect().left - tags[0].getBoundingClientRect().right)).toBe(4);
    await expect(box(field.querySelector(':scope > svg')!)).toEqual([16, 16]);
    await expect(input).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(input);
    await expect(input).toHaveAttribute('aria-expanded', 'true');
    const list = await screen.findByRole('listbox', { name: 'Skills' });
    await expect(list).toHaveAttribute('aria-multiselectable', 'true');
    await expect(within(list).getByRole('option', { name: 'Design' })).toHaveAttribute('aria-selected', 'true');
    await userEvent.type(input, 'wri');
    await expect(within(list).getAllByRole('option').map(o => o.textContent)).toEqual(['Writing', 'Copywriting', 'UX writing']);
    await userEvent.keyboard('{Enter}');
    await expect(onValueChange).toHaveBeenLastCalledWith(['design', 'research', 'writing']);
    await expect(canvas.getByRole('button', { name: 'Remove Writing' })).toBeInTheDocument();
    await expect(canvas.getByText('Writing added')).toHaveAttribute('role', 'status');
    // Still open, query cleared, focus kept.
    await expect(input).toHaveValue('');
    await expect(input).toHaveFocus();
    await expect(screen.getByRole('listbox')).toBeInTheDocument();
    // Clicking a checked option removes it.
    await userEvent.click(within(list).getByRole('option', { name: 'Design' }));
    await expect(onValueChange).toHaveBeenLastCalledWith(['research', 'writing']);
    await expect(canvas.queryByRole('button', { name: 'Remove Design' })).toBeNull();
    await expect(input).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
    await expect(input).toHaveFocus();
  },
};

// Keyboard: Backspace in the empty field removes the last tag; Tab reaches each x; Delete on it removes.
export const Keyboard: Story = {
  render: () => <Field label="Skills"><TagInput options={skills} defaultValue={['design', 'research', 'finance']} /></Field>,
  play: async ({ canvas }) => {
    const input = canvas.getByRole('combobox', { name: 'Skills' });
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Remove Design' })).toHaveFocus();
    await userEvent.keyboard('{Delete}');
    await expect(canvas.queryByRole('button', { name: 'Remove Design' })).toBeNull();
    await expect(input).toHaveFocus();
    await expect(canvas.getByText('Design removed')).toBeInTheDocument();
    await userEvent.keyboard('{Backspace}');
    await expect(canvas.queryByRole('button', { name: 'Remove Finance' })).toBeNull();
    await userEvent.keyboard('{ArrowDown}');
    await screen.findByRole('listbox');
    await userEvent.keyboard('{ArrowDown}{Enter}');
    await expect(canvas.getByRole('button', { name: 'Remove Copywriting' })).toBeInTheDocument();
    await userEvent.tab();
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
  },
};

// Show chevron off: free tags. Enter or comma adds the typed text; duplicates are ignored.
export const FreeTags: Story = {
  render: () => <Field label="Keywords" hint="Press Enter after each keyword."><TagInput placeholder="Add keyword…" defaultValue={['invoices']} /></Field>,
  play: async ({ canvas, canvasElement }) => {
    const input = canvas.getByRole('textbox', { name: 'Keywords' });
    await expect(input).toHaveAccessibleDescription('Press Enter after each keyword.');
    await expect(canvasElement.querySelector('[data-slot="tag-input"] > svg')).toBeNull();
    await userEvent.type(input, 'receipts{Enter}');
    await userEvent.type(input, 'refunds,');
    await userEvent.type(input, 'invoices{Enter}');
    await expect(Array.from(canvasElement.querySelectorAll('[data-slot="tag-label"]')).map(t => t.textContent)).toEqual(['invoices', 'receipts', 'refunds']);
    await expect(canvas.getByText('refunds added')).toBeInTheDocument();
  },
};

// Over ~5 tags: "+3 more".
export const Overflow: Story = {
  render: () => <Field label="Skills"><TagInput options={skills} defaultValue={skills.map(s => s.value)} /></Field>,
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelectorAll('[data-slot="tag"]')).toHaveLength(5);
    await expect(canvasElement.querySelector('[data-slot="tag-input-more"]')).toHaveTextContent('+3 more');
  },
};

// Figma Size: sm (min 32, 2 px padding), default (min 36, 4 px), lg (min 40, 6 px). Tags stay 24.
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <TagInput size="sm" label="Small" options={skills} defaultValue={['design']} />
      <TagInput label="Default" options={skills} defaultValue={['design']} />
      <TagInput size="lg" label="Large" options={skills} defaultValue={['design']} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [sm, md, lg] = Array.from(canvasElement.querySelectorAll('[data-slot="tag-input"]'));
    await expect(box(sm)[1]).toBe(32);
    await expect(css(sm).paddingTop).toBe('2px');
    await expect(box(md)[1]).toBe(36);
    await expect(box(lg)[1]).toBeGreaterThanOrEqual(40);
    await expect(css(lg).paddingTop).toBe('6px');
    for (const f of [sm, md, lg]) await expect(box(f.querySelector('[data-slot="tag"]')!)[1]).toBe(24);
  },
};

// Figma State=error and disabled (every Tag disabled, nothing can change).
export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Field label="Reviewers' skills" error="Pick at least one skill."><TagInput options={skills} /></Field>
      <Field label="Team skills" disabled><TagInput options={skills} defaultValue={['design', 'finance']} /></Field>
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    const invalid = canvas.getByRole('combobox', { name: "Reviewers' skills" });
    await expect(invalid).toHaveAttribute('aria-invalid', 'true');
    await expect(invalid).toHaveAccessibleDescription('Pick at least one skill.');
    const [errorField, disabledField] = Array.from(canvasElement.querySelectorAll('[data-slot="tag-input"]'));
    await expect(css(errorField).borderTopColor).toBe(probe('border border-destructive', 'borderTopColor'));
    await expect(css(disabledField).opacity).toBe('0.5');
    await expect(canvas.getByRole('combobox', { name: 'Team skills' })).toBeDisabled();
    await expect(canvas.getByRole('button', { name: 'Remove Design' })).toBeDisabled();
    await userEvent.click(disabledField);
    await expect(screen.queryByRole('listbox')).toBeNull();
  },
};

// Stress test (Figma "Stress test / Tag Input"): tags wrap to new lines at 276 and 368 and the field
// grows in height; long labels truncate at 192; the chevron keeps its size.
export const Stress: Story = {
  tags: ['!dev'],
  decorators: [],
  render: () => (
    <div className="flex flex-col gap-4">
      {[276, 368].map(w => (
        <div key={w} style={{ width: w }}>
          <TagInput
            label={`Labels ${w}`}
            maxVisible={10}
            options={[...skills, { value: 'long', label: 'Customer success and account management' }]}
            defaultValue={['long', 'design', 'research', 'strategy', 'analytics']}
          />
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const field of Array.from(canvasElement.querySelectorAll('[data-slot="tag-input"]'))) {
      await expect(box(field)[1]).toBeGreaterThan(36);
      const long = field.querySelector('[data-slot="tag"]')!;
      await expect(box(long)[0]).toBe(192);
      await expect(box(field.querySelector(':scope > svg')!)).toEqual([16, 16]);
      await expect(field.scrollWidth).toBeLessThanOrEqual(field.clientWidth + 2);
    }
  },
};

// The open multi-select, for the theme checks.
export const Open: Story = {
  decorators: [Story => <div className="h-[260px] w-[360px]"><Story /></div>],
  render: () => <Field label="Skills"><TagInput options={skills.slice(0, 5)} defaultValue={['design', 'research']} /></Field>,
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('combobox', { name: 'Skills' }));
    const list = await screen.findByRole('listbox');
    await expect(within(list).getByRole('option', { name: 'Research' })).toHaveAttribute('aria-selected', 'true');
  },
};

export const OpenDark: Story = { ...Open, tags: ['!dev'], globals: { theme: 'Dark' } };
export const OpenCorporate: Story = { ...Open, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
