import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { Field } from './field';
import { SegmentedInput, type SegmentedCharset } from './segmented-input';

type Preset = 'IBAN' | 'License key' | 'Card number' | 'Order number';
type Args = { preset: Preset; size: 'sm' | 'default' | 'lg'; separator: string; uppercase: boolean; disabled: boolean; invalid: boolean };

const presets: Record<Preset, { groups: number[]; charset: SegmentedCharset; hint: string; separator?: string }> = {
  IBAN: { groups: [4, 4, 4, 4, 4, 2], charset: 'alphanumeric', hint: 'Starts with two letters, for example DE89 3704 0044 0532 0130 00.' },
  'License key': { groups: [5, 5, 5, 5], charset: 'alphanumeric', hint: 'Find it in your purchase email. Paste it into any box.' },
  'Card number': { groups: [4, 4, 4, 4], charset: 'digits', hint: 'The 16 digits on the front of the card.' },
  'Order number': { groups: [3, 6], charset: 'digits', hint: 'Three digits, then six.' },
};

const meta = {
  title: 'Components/Forms/Segmented Input',
  parameters: {
    docs: {
      description: {
        component:
          'One code split into groups of boxes (IBAN, license key, card number). Typing moves to the next box when one is full; Backspace in an empty box goes back; paste splits across the boxes and drops spaces and dashes. Each box is a real input named "Part 2 of 5". The value is the boxes joined with a space, so a half filled code can be saved. Code only (no Figma component yet).',
      },
    },
  },
  args: { preset: 'License key', size: 'default', separator: '-', uppercase: true, disabled: false, invalid: false },
  argTypes: {
    preset: { name: 'Code type', control: 'select', options: Object.keys(presets), description: 'Group sizes and allowed characters.', table: { category: 'Input' } },
    size: { name: 'Size', control: 'inline-radio', options: ['sm', 'default', 'lg'], description: 'Box height, from Input.', table: { category: 'Input' } },
    separator: { name: 'Separator', control: 'text', description: 'Drawn between the boxes; empty for a gap only.', table: { category: 'Input' } },
    uppercase: { name: 'Uppercase', control: 'boolean', description: 'Letters are shown and stored in capitals.', table: { category: 'Input' } },
    disabled: { name: 'Disabled', control: 'boolean', description: 'Cannot be edited.', table: { category: 'Input' } },
    invalid: { name: 'Invalid', control: 'boolean', description: 'Shows the error state and message.', table: { category: 'Input' } },
  },
  decorators: [Story => <div className="w-[480px] max-w-full"><Story /></div>],
  render: ({ preset, size, separator, uppercase, disabled, invalid }) => {
    const p = presets[preset];
    return (
      <Field label={preset} hint={p.hint} error={invalid ? 'Check the code and try again.' : undefined} disabled={disabled} id="segmented-default">
        <SegmentedInput key={preset} aria-label={preset} groups={p.groups} charset={p.charset} size={size} separator={separator} uppercase={uppercase} />
      </Field>
    );
  },
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** A bank account number: six boxes, a space instead of a dash. Paste a whole IBAN into any box. */
export const Iban: Story = {
  args: { preset: 'IBAN', separator: '' },
};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: function Render() {
    const [value, setValue] = React.useState('');
    const onComplete = React.useRef(fn()).current;
    return (
      <>
        <Field label="License key" id="key">
          <SegmentedInput aria-label="License key" groups={[5, 5, 5]} onValueChange={setValue} onComplete={onComplete} name="key" />
        </Field>
        <p data-testid="value">{value}</p>
      </>
    );
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('group', { name: 'License key' })).toBeVisible();
    const boxes = () => canvas.getAllByRole('textbox') as HTMLInputElement[];
    await expect(boxes()).toHaveLength(3);
    // The Field label points at the first box.
    await expect(canvas.getByLabelText('Part 1 of 3')).toHaveAttribute('id', 'key');
    await userEvent.click(canvas.getByRole('textbox', { name: 'Part 1 of 3' }));
    // Typing fills a box, moves on, and capitalizes; characters outside the charset are dropped.
    await userEvent.keyboard('ab-cde12');
    await waitFor(() => expect(boxes()[1]).toHaveFocus());
    await expect(boxes()[0]).toHaveValue('ABCDE');
    await expect(boxes()[1]).toHaveValue('12');
    await userEvent.keyboard('345xy');
    await waitFor(() => expect(boxes()[2]).toHaveFocus());
    await expect(canvas.getByTestId('value')).toHaveTextContent('ABCDE 12345 XY');
    // Backspace in an empty box moves back and deletes the last character there.
    await userEvent.keyboard('{Backspace}{Backspace}');
    await expect(boxes()[2]).toHaveValue('');
    await userEvent.keyboard('{Backspace}');
    await waitFor(() => expect(boxes()[1]).toHaveFocus());
    await expect(boxes()[1]).toHaveValue('1234');
    // Arrows cross the box edges.
    await userEvent.keyboard('{ArrowLeft}{ArrowLeft}{ArrowLeft}{ArrowLeft}{ArrowLeft}');
    await waitFor(() => expect(boxes()[0]).toHaveFocus());
  },
};

export const PasteCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: function Render() {
    const [done, setDone] = React.useState('');
    return (
      <>
        <SegmentedInput aria-label="IBAN" groups={[4, 4, 4, 4, 4, 2]} separator="" onComplete={setDone} />
        <p data-testid="done">{done}</p>
      </>
    );
  },
  play: async ({ canvas }) => {
    const boxes = () => canvas.getAllByRole('textbox') as HTMLInputElement[];
    await userEvent.click(boxes()[0]!);
    // Spaces and dashes in the pasted text are dropped; the code splits across the boxes.
    await userEvent.paste('de89 3704-0044 0532 0130 00');
    await waitFor(() => expect(canvas.getByTestId('done')).toHaveTextContent('DE89370400440532013000'));
    await expect(boxes().map(b => b.value)).toEqual(['DE89', '3704', '0044', '0532', '0130', '00']);
    await expect(boxes()[5]).toHaveFocus();
  },
};

export const PartialPasteCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <SegmentedInput aria-label="Card number" groups={[4, 4, 4, 4]} charset="digits" defaultValue="4111" />,
  play: async ({ canvas }) => {
    const boxes = () => canvas.getAllByRole('textbox') as HTMLInputElement[];
    await expect(boxes()[0]).toHaveValue('4111');
    // Letters are not digits: ignored. A paste into the second box fills forward from there.
    await userEvent.type(boxes()[1]!, 'ab');
    await expect(boxes()[1]).toHaveValue('');
    await userEvent.click(boxes()[1]!);
    await userEvent.paste('1111 22');
    await waitFor(() => expect(boxes().map(b => b.value)).toEqual(['4111', '1111', '22', '']));
    await expect(boxes()[2]).toHaveFocus();
  },
};

export const StatesCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-4">
      <SegmentedInput aria-label="Disabled code" groups={[3, 3]} defaultValue="ABC DEF" disabled />
      <SegmentedInput aria-label="Read-only code" groups={[3, 3]} defaultValue="ABC DEF" readOnly />
      <Field label="Invalid code" error="This code does not exist.">
        <SegmentedInput aria-label="Invalid code" groups={[3, 3]} defaultValue="ABC" />
      </Field>
    </div>
  ),
  play: async ({ canvas }) => {
    for (const box of canvas.getByRole('group', { name: 'Disabled code' }).querySelectorAll('input')) await expect(box).toBeDisabled();
    const ro = canvas.getByRole('group', { name: 'Read-only code' }).querySelectorAll('input')[0]!;
    await userEvent.click(ro);
    await userEvent.keyboard('Z');
    await expect(ro).toHaveValue('ABC');
    const invalid = canvas.getByRole('group', { name: 'Invalid code' }).querySelectorAll('input')[1]!;
    await expect(invalid).toHaveAttribute('aria-invalid', 'true');
    await expect(invalid).toHaveAccessibleDescription('This code does not exist.');
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => <SegmentedInput aria-label="IBAN" groups={[4, 4, 4, 4, 4, 4, 4, 2]} size="lg" defaultValue="DE89 3704 0044 0532 0130 00" />,
  play: async ({ canvas }) => {
    const group = canvas.getByRole('group');
    // The boxes wrap onto more lines instead of scrolling sideways.
    await expect(group.scrollWidth).toBeLessThanOrEqual(group.clientWidth + 1);
    await expect(canvas.getAllByRole('textbox')).toHaveLength(8);
    const tops = new Set(canvas.getAllByRole('textbox').map(b => Math.round(b.getBoundingClientRect().top)));
    await expect(tops.size).toBeGreaterThan(1);
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
