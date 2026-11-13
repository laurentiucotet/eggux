import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';
import { EditableCell } from './editable-cell';
import { TableCell, TableHead } from './table';

type Args = { required: boolean; maxLength: number; failSave: boolean; readOnly: boolean; saveDelay: number; width: number };

const start = [
  { id: 'a', name: 'Ana Popescu', team: 'Finance' },
  { id: 'b', name: 'Ion Marin', team: 'Engineering' },
  { id: 'c', name: 'Maria Ionescu', team: 'Support' },
];

// A small table that owns the saved values, like an app would.
function Demo({ required, maxLength, failSave, readOnly, saveDelay, width, rows = start }: Args & { rows?: typeof start }) {
  const [names, setNames] = React.useState<Record<string, string>>(() => Object.fromEntries(rows.map(r => [r.id, r.name])));
  const validate = (next: string) => (required && !next.trim() ? 'Enter a name.' : next.length > maxLength ? `Use ${maxLength} characters or fewer.` : undefined);
  const save = (id: string) => (next: string) =>
    new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (failSave) reject(new Error('The server is busy. Try again in a moment.'));
        else {
          setNames(n => ({ ...n, [id]: next }));
          resolve();
        }
      }, saveDelay);
    });
  return (
    <div style={{ width }} className="max-w-full overflow-hidden rounded-lg border border-border">
      <table className="w-full table-fixed border-separate border-spacing-0 text-sm">
        <thead>
          <tr>
            <TableHead>Name</TableHead>
            <TableHead>Team</TableHead>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id}>
              <EditableCell label={`name of ${names[r.id]}`} value={names[r.id]} validate={validate} onSave={save(r.id)} readOnly={readOnly} placeholder="Full name" />
              <TableCell className="truncate">{r.team}</TableCell>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const meta = {
  title: 'Components/Data Structures/Editable Cell',
  parameters: {
    docs: {
      description: {
        component:
          'A table cell edited where it sits. Enter, F2 or double click edits; Enter saves, Escape cancels, focus goes back to the cell. A validation message stays under the input; a slow save shows "Saving..."; a failed save keeps the input open with its message. Code only (no Figma component yet).',
      },
    },
  },
  args: { required: true, maxLength: 20, failSave: false, readOnly: false, saveDelay: 400, width: 480 },
  argTypes: {
    required: { name: 'Required', control: 'boolean', description: 'An empty name is not allowed.', table: { category: 'Validation' } },
    maxLength: { name: 'Max length', control: { type: 'range', min: 5, max: 40, step: 1 }, description: 'Longest name that passes validation.', table: { category: 'Validation' } },
    failSave: { name: 'Server rejects the save', control: 'boolean', description: 'The save fails with a message.', table: { category: 'Saving' } },
    saveDelay: { name: 'Save time (ms)', control: { type: 'range', min: 0, max: 2000, step: 50 }, description: 'How long the save takes.', table: { category: 'Saving' } },
    readOnly: { name: 'Read only', control: 'boolean', description: 'The cells cannot be edited.', table: { category: 'Cell' } },
    width: { name: 'Width', control: { type: 'range', min: 240, max: 800, step: 4 }, description: 'Container width in px.', table: { category: 'Cell' } },
  },
  render: args => <Demo {...args} />,
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  args: { saveDelay: 30, maxLength: 12 },
  play: async ({ canvas }) => {
    // Save with Enter; focus returns to the cell.
    const cell = canvas.getByRole('cell', { name: /^Ana Popescu/ });
    cell.focus();
    await expect(cell).toHaveAccessibleDescription('Press Enter to edit name of Ana Popescu.');
    await userEvent.keyboard('{Enter}');
    const input = await canvas.findByRole('textbox', { name: 'Edit name of Ana Popescu' });
    await waitFor(() => expect(input).toHaveFocus());
    await userEvent.keyboard('Ana Radu{Enter}');
    await waitFor(() => expect(canvas.queryByRole('textbox')).toBeNull());
    const saved = canvas.getByRole('cell', { name: /^Ana Radu/ });
    await waitFor(() => expect(saved).toHaveFocus());
    // Escape cancels and keeps the old value.
    const ion = canvas.getByRole('cell', { name: /^Ion Marin/ });
    ion.focus();
    await userEvent.keyboard('{Enter}');
    await canvas.findByRole('textbox', { name: 'Edit name of Ion Marin' });
    await userEvent.keyboard('Someone else{Escape}');
    await waitFor(() => expect(canvas.queryByRole('textbox')).toBeNull());
    await waitFor(() => expect(canvas.getByRole('cell', { name: /^Ion Marin/ })).toHaveFocus());
    // Validation: empty is refused and the input stays; typing clears the message.
    const maria = canvas.getByRole('cell', { name: /^Maria Ionescu/ });
    maria.focus();
    await userEvent.keyboard('{Enter}');
    const field = await canvas.findByRole('textbox', { name: 'Edit name of Maria Ionescu' });
    await userEvent.keyboard('{Backspace}{Enter}');
    await waitFor(() => expect(field).toHaveAttribute('aria-invalid', 'true'));
    await expect(canvas.getByRole('alert')).toHaveTextContent('Enter a name.');
    await expect(field).toHaveAccessibleDescription('Enter a name.');
    await expect(field).toHaveFocus();
    await userEvent.keyboard('A name that is far too long{Enter}');
    await waitFor(() => expect(canvas.getByRole('alert')).toHaveTextContent('Use 12 characters or fewer.'));
    await userEvent.keyboard('{Control>}a{/Control}Mia{Enter}');
    await waitFor(() => expect(canvas.queryByRole('textbox')).toBeNull());
    await expect(canvas.getByRole('cell', { name: /^Mia/ })).toBeVisible();
  },
};

export const DoubleClickCheck: Story = {
  tags: ['!dev'],
  args: { saveDelay: 30 },
  play: async ({ canvas }) => {
    await userEvent.dblClick(canvas.getByRole('cell', { name: /^Ion Marin/ }));
    await canvas.findByRole('textbox', { name: 'Edit name of Ion Marin' });
    // Leaving with a valid change saves it (blur).
    await userEvent.keyboard('Ion Radu');
    await userEvent.click(canvas.getByRole('cell', { name: 'Finance' }));
    await waitFor(() => expect(canvas.getByRole('cell', { name: /^Ion Radu/ })).toBeVisible());
    // Leaving with an invalid change drops it.
    await userEvent.dblClick(canvas.getByRole('cell', { name: /^Maria Ionescu/ }));
    await canvas.findByRole('textbox', { name: 'Edit name of Maria Ionescu' });
    await userEvent.keyboard('{Backspace}');
    await userEvent.click(canvas.getByRole('cell', { name: 'Finance' }));
    await waitFor(() => expect(canvas.getByRole('cell', { name: /^Maria Ionescu/ })).toBeVisible());
    await expect(canvas.queryByRole('alert')).toBeNull();
  },
};

export const SavingCheck: Story = {
  tags: ['!dev'],
  args: { saveDelay: 600 },
  play: async ({ canvas }) => {
    canvas.getByRole('cell', { name: /^Ana Popescu/ }).focus();
    await userEvent.keyboard('{Enter}');
    const input = await canvas.findByRole('textbox', { name: 'Edit name of Ana Popescu' });
    await userEvent.keyboard('Ana P{Enter}');
    await expect(await canvas.findByText('Saving…')).toBeVisible();
    await expect(input).toHaveAttribute('readonly');
    await expect(input).toHaveAttribute('aria-busy', 'true');
    await waitFor(() => expect(canvas.queryByRole('textbox')).toBeNull(), { timeout: 3000 });
    await expect(canvas.getByRole('cell', { name: /^Ana P/ })).toBeVisible();
  },
};

export const FailedSaveCheck: Story = {
  tags: ['!dev'],
  args: { saveDelay: 30, failSave: true },
  play: async ({ canvas }) => {
    canvas.getByRole('cell', { name: /^Ion Marin/ }).focus();
    await userEvent.keyboard('{Enter}');
    const input = await canvas.findByRole('textbox', { name: 'Edit name of Ion Marin' });
    await userEvent.keyboard('Ion R{Enter}');
    await waitFor(() => expect(canvas.getByRole('alert')).toHaveTextContent('The server is busy. Try again in a moment.'));
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await waitFor(() => expect(input).toHaveFocus());
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(canvas.getByRole('cell', { name: /^Ion Marin/ })).toHaveFocus());
  },
};

export const ReadOnlyCheck: Story = {
  tags: ['!dev'],
  args: { readOnly: true },
  play: async ({ canvas }) => {
    const cell = canvas.getByRole('cell', { name: /^Ana Popescu/ });
    await expect(cell).not.toHaveAttribute('tabindex');
    await userEvent.dblClick(cell);
    await expect(canvas.queryByRole('textbox')).toBeNull();
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  args: { saveDelay: 30, failSave: true, width: 276 },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: args => (
    <Demo
      {...args}
      rows={[{ id: 'x', name: 'Alexandra Constantinescu-Popescu of the Regional Operations Team', team: 'Customer Success and Partnerships' }]}
    />
  ),
  play: async ({ canvas, canvasElement }) => {
    const box = canvasElement.firstElementChild as HTMLElement;
    await expect(box.scrollWidth).toBeLessThanOrEqual(box.clientWidth + 1);
    const cell = canvas.getAllByRole('cell')[0];
    cell.focus();
    await userEvent.keyboard('{Enter}');
    await canvas.findByRole('textbox');
    await userEvent.keyboard('A{Enter}');
    await waitFor(() => expect(canvas.getByRole('alert')).toBeVisible());
    await expect(box.scrollWidth).toBeLessThanOrEqual(box.clientWidth + 1);
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
