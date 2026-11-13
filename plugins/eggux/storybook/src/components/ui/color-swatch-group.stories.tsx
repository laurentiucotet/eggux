import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fireEvent, fn, userEvent, waitFor } from 'storybook/test';
import { ColorSwatchGroup, type ColorSwatchOption, type ColorSwatchSize } from './color-swatch-group';
import { Field } from './field';

type Args = { size: ColorSwatchSize; allowCustom: boolean; showSelectedName: boolean; disabled: boolean };

const colors: ColorSwatchOption[] = [
  { value: 'blue', label: 'Blue', color: 'var(--chart-1)' },
  { value: 'orange', label: 'Orange', color: 'var(--chart-2)' },
  { value: 'cyan', label: 'Cyan', color: 'var(--chart-3)' },
  { value: 'amber', label: 'Amber', color: 'var(--chart-4)' },
  { value: 'magenta', label: 'Magenta', color: 'var(--chart-5)' },
  { value: 'green', label: 'Green', color: 'var(--chart-6)' },
  { value: 'violet', label: 'Violet', color: 'var(--chart-7)' },
  { value: 'rose', label: 'Rose', color: 'var(--chart-8)' },
];

const meta = {
  title: 'Components/Forms/Color Swatch Group',
  parameters: {
    docs: {
      description: {
        component:
          'Choose one color of a fixed set: a theme accent, a label color, a tag color. Built on native radio inputs (Tab enters the group, arrows move and select). Each swatch is named by its color; the selected one has a check and a ring, so color is never the only signal. Optional custom color opens the browser color input. Sizes 24, 32 and 40 px. Code only (no Figma component yet).',
      },
    },
  },
  args: { size: 'default', allowCustom: false, showSelectedName: true, disabled: false },
  argTypes: {
    size: { name: 'Size', control: 'inline-radio', options: ['sm', 'default', 'lg'], description: 'Swatch size: 24, 32 or 40 px.', table: { category: 'Group' } },
    allowCustom: { name: 'Allow custom color', control: 'boolean', description: 'A last swatch that opens the color input.', table: { category: 'Group' } },
    disabled: { name: 'Disabled', control: 'boolean', description: 'No swatch can be chosen.', table: { category: 'Group' } },
    showSelectedName: { name: 'Show selected name', control: 'boolean', description: 'The chosen color\'s name under the swatches.', table: { category: 'Parts' } },
  },
  decorators: [Story => <div className="w-80 max-w-full"><Story /></div>],
  render: ({ size, allowCustom, showSelectedName, disabled }) => (
    <ColorSwatchGroup aria-label="Accent color" options={colors} defaultValue="orange" size={size} allowCustom={allowCustom} showSelectedName={showSelectedName} disabled={disabled} />
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** The three sizes next to each other: 24 px for dense lists, 32 px for forms, 40 px for touch. */
export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-4">
      {(['sm', 'default', 'lg'] as const).map(s => (
        <ColorSwatchGroup key={s} aria-label={`Color, ${s} swatches`} options={colors.slice(0, 5)} defaultValue="blue" size={s} showSelectedName={false} />
      ))}
    </div>
  ),
};

/** Inside a Field with a hint, and a custom color already chosen. */
export const WithCustomColor: Story = {
  parameters: { controls: { disable: true } },
  render: function Render() {
    const [value, setValue] = React.useState('#0f766e');
    return (
      <Field label="Label color" hint="Pick one, or choose your own.">
        <ColorSwatchGroup aria-label="Label color" options={colors} value={value} onValueChange={setValue} allowCustom />
      </Field>
    );
  },
};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  args: { allowCustom: true },
  render: function Render({ allowCustom }) {
    const onValueChange = fn();
    return <ColorSwatchGroup aria-label="Accent color" options={colors} defaultValue="orange" allowCustom={allowCustom} onValueChange={onValueChange} />;
  },
  play: async ({ canvas }) => {
    const group = canvas.getByRole('radiogroup', { name: 'Accent color' });
    await expect(group).toBeVisible();
    await expect(canvas.getAllByRole('radio')).toHaveLength(8);
    await expect(canvas.getByRole('radio', { name: 'Orange' })).toBeChecked();
    await expect(canvas.getByText('Orange', { selector: 'p' })).toBeVisible();
    // The swatch is 32 px.
    await expect(Math.round(canvas.getByRole('radio', { name: 'Violet' }).getBoundingClientRect().width)).toBe(32);
    await userEvent.click(canvas.getByRole('radio', { name: 'Violet' }));
    await waitFor(() => expect(canvas.getByRole('radio', { name: 'Violet' })).toBeChecked());
    await expect(canvas.getByRole('radio', { name: 'Orange' })).not.toBeChecked();
    await expect(canvas.getByText('Violet', { selector: 'p' })).toBeVisible();
    // Keyboard: arrows move and select inside the group.
    canvas.getByRole('radio', { name: 'Violet' }).focus();
    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => expect(canvas.getByRole('radio', { name: 'Rose' })).toBeChecked());
    await expect(canvas.getByRole('radio', { name: 'Rose' })).toHaveFocus();
    // A custom color is any color that is not in the set.
    const custom = canvas.getByLabelText('Custom color');
    fireEvent.input(custom, { target: { value: '#123456' } });
    await waitFor(() => expect(canvas.getByText('Custom color: #123456')).toBeVisible());
    await expect(canvas.getByRole('radio', { name: 'Rose' })).not.toBeChecked();
  },
};

export const DisabledCheck: Story = {
  tags: ['!dev'],
  args: { disabled: true },
  play: async ({ canvas }) => {
    for (const radio of canvas.getAllByRole('radio')) await expect(radio).toBeDisabled();
    await userEvent.click(canvas.getByRole('radio', { name: 'Violet' }));
    await expect(canvas.getByRole('radio', { name: 'Orange' })).toBeChecked();
  },
};

export const FieldCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => (
    <Field label="Tag color" error="Choose a color for the tag." required>
      <ColorSwatchGroup aria-label="Tag color" options={colors} />
    </Field>
  ),
  play: async ({ canvas }) => {
    const group = canvas.getByRole('radiogroup', { name: 'Tag color' });
    await expect(group).toHaveAttribute('aria-invalid', 'true');
    await expect(group).toHaveAccessibleDescription('Choose a color for the tag.');
    await expect(canvas.getByText('No color selected')).toBeVisible();
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => (
    <ColorSwatchGroup
      aria-label="Accent color"
      size="lg"
      allowCustom
      options={[...colors, { value: 'long', label: 'A color name that is far too long to fit on one line of this narrow column', color: 'var(--chart-2)' }]}
      defaultValue="long"
    />
  ),
  play: async ({ canvas }) => {
    const group = canvas.getByRole('radiogroup');
    // The swatches wrap onto more lines and the long name is cut with an ellipsis, no horizontal scroll.
    await expect(group.scrollWidth).toBeLessThanOrEqual(group.clientWidth + 1);
    await expect(canvas.getAllByRole('radio').length).toBe(9);
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
