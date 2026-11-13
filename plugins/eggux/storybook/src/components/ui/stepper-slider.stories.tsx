import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { Field } from './field';
import { StepperSlider } from './stepper-slider';

type Args = { min: number; max: number; step: number; unit: string; showMarks: boolean; disabled: boolean; invalid: boolean };

const meta = {
  title: 'Components/Forms/Stepper Slider',
  parameters: {
    docs: {
      description: {
        component:
          'One number chosen two ways: a slider for "about this much" and a number input for "exactly this", kept in sync. Typing in range moves the slider; leaving the field rounds to the step and clamps to min and max. The unit sits inside the input and is read with it. One Field label names the control. For two thumbs use Range Input; with no slider use Number Input. Code only (no Figma component yet).',
      },
    },
  },
  args: { min: 0, max: 1000, step: 10, unit: 'EUR', showMarks: false, disabled: false, invalid: false },
  argTypes: {
    min: { name: 'Minimum', control: { type: 'number' }, description: 'Lowest value.', table: { category: 'Range' } },
    max: { name: 'Maximum', control: { type: 'number' }, description: 'Highest value.', table: { category: 'Range' } },
    step: { name: 'Step', control: 'select', options: [0.5, 1, 5, 10, 50], description: 'Size of one step; typed numbers are rounded to it.', table: { category: 'Range' } },
    unit: { name: 'Unit', control: 'text', description: 'Shown in the input and read as its description.', table: { category: 'Range' } },
    disabled: { name: 'Disabled', control: 'boolean', description: 'Neither part can be changed.', table: { category: 'Range' } },
    invalid: { name: 'Invalid', control: 'boolean', description: 'Shows the error state and message.', table: { category: 'Range' } },
    showMarks: { name: 'Show marks', control: 'boolean', description: 'Min, middle and max under the slider.', table: { category: 'Parts' } },
  },
  decorators: [Story => <div className="w-[420px] max-w-full"><Story /></div>],
  render: function Render({ min, max, step, unit, showMarks, disabled, invalid }) {
    const [value, setValue] = React.useState(250);
    return (
      <Field label="Monthly budget" hint={`Between ${min} and ${max} ${unit}.`} error={invalid ? 'Choose an amount your plan allows.' : undefined} disabled={disabled}>
        <StepperSlider label="Monthly budget" min={min} max={max} step={step} unit={unit} showMarks={showMarks} value={Math.min(max, Math.max(min, value))} onValueChange={setValue} />
      </Field>
    );
  },
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Percent in steps of 5, with the marks shown. */
export const Percent: Story = {
  args: { min: 0, max: 100, step: 5, unit: '%', showMarks: true },
};

/** Half steps: typed numbers round to the nearest 0.5. */
export const Decimals: Story = {
  args: { min: 0, max: 12, step: 0.5, unit: 'h' },
};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  play: async ({ canvas }) => {
    const slider = canvas.getByRole('slider', { name: 'Monthly budget slider' });
    const input = canvas.getByRole('spinbutton', { name: 'Monthly budget' });
    await expect(slider).toHaveAttribute('aria-valuetext', '250 EUR');
    await expect(input).toHaveValue(250);
    await expect(input).toHaveAccessibleDescription(/EUR/);
    // Slider to input: arrow keys step by 10.
    slider.focus();
    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => expect(input).toHaveValue(260));
    await expect(slider).toHaveAttribute('aria-valuenow', '260');
    // Input to slider: a number in range moves the thumb at once.
    await userEvent.clear(input);
    await userEvent.type(input, '400');
    await waitFor(() => expect(slider).toHaveAttribute('aria-valuenow', '400'));
    // Above the max: the input is invalid while typing, and leaving it clamps to 1000.
    await userEvent.clear(input);
    await userEvent.type(input, '5000');
    await waitFor(() => expect(input).toHaveAttribute('aria-invalid', 'true'));
    await userEvent.tab();
    await waitFor(() => expect(input).toHaveValue(1000));
    await expect(input).not.toHaveAttribute('aria-invalid');
    await expect(slider).toHaveAttribute('aria-valuenow', '1000');
    // Not a multiple of the step: rounded on leaving the field.
    await userEvent.clear(input);
    await userEvent.type(input, '333{Enter}');
    await waitFor(() => expect(input).toHaveValue(330));
    await expect(slider).toHaveAttribute('aria-valuenow', '330');
  },
};

export const DecimalsCheck: Story = {
  tags: ['!dev'],
  args: { min: 0, max: 12, step: 0.5, unit: 'h' },
  play: async ({ canvas }) => {
    const input = canvas.getByRole('spinbutton', { name: 'Monthly budget' });
    await userEvent.clear(input);
    await userEvent.type(input, '2.3{Enter}');
    await waitFor(() => expect(input).toHaveValue(2.5));
    await expect(canvas.getByRole('slider')).toHaveAttribute('aria-valuetext', '2.5 h');
  },
};

export const DisabledCheck: Story = {
  tags: ['!dev'],
  args: { disabled: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('spinbutton', { name: 'Monthly budget' })).toBeDisabled();
    await expect(canvas.getByRole('slider')).toHaveAttribute('data-disabled');
  },
};

export const ErrorCheck: Story = {
  tags: ['!dev'],
  args: { invalid: true },
  play: async ({ canvas }) => {
    const input = canvas.getByRole('spinbutton', { name: 'Monthly budget' });
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(input).toHaveAccessibleDescription(/Choose an amount your plan allows/);
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => (
    <Field label="Maximum amount per transaction">
      <StepperSlider label="Maximum amount per transaction" min={0} max={1000000} step={1000} unit="EUR" defaultValue={750000} showMarks size="lg" onValueChange={fn()} />
    </Field>
  ),
  play: async ({ canvas }) => {
    const root = canvas.getByRole('slider').closest('[data-slot="stepper-slider"]')!;
    await expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth + 1);
    // The slider keeps a usable width next to the input.
    await expect(canvas.getByRole('slider').closest('[data-slot="slider"]')!.getBoundingClientRect().width).toBeGreaterThan(80);
    await expect(canvas.getByRole('spinbutton')).toHaveValue(750000);
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
