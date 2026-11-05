import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { Input } from './input';

// Inputs always have a label (Field in Figma). The stories use a plain <label> until Field is built.
const meta = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    docs: { description: { component: 'Short free text. Placeholder shows an example value, never the label. Figma: COMPONENTS / Input. Guide: eggux build-ui/components/input.md' } },
  },
  args: { placeholder: 'name@acme.com', onChange: fn() },
  decorators: [Story => <div className="w-80"><Story /></div>],
  render: args => (
    <label className="grid gap-1.5 text-sm font-medium">
      Work email
      <Input type="email" {...args} />
    </label>
  ),
} satisfies Meta<typeof Input>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, args }) => {
    const input = canvas.getByLabelText('Work email');
    await userEvent.click(input);
    await expect(input).toHaveFocus();
    await userEvent.type(input, 'ana@acme.com');
    await expect(input).toHaveValue('ana@acme.com');
    await expect(args.onChange).toHaveBeenCalled();
  },
};

export const Filled: Story = { args: { inputStyle: 'filled' } };

export const Sizes: Story = {
  render: () => (
    <div className="grid gap-3">
      <label className="grid gap-1 text-sm">Small<Input size="sm" placeholder="Filter" /></label>
      <label className="grid gap-1 text-sm">Default<Input placeholder="Customer name" /></label>
      <label className="grid gap-1 text-sm">Large<Input size="lg" placeholder="Search the help center" /></label>
    </div>
  ),
  play: async ({ canvas }) => {
    // Heights from Figma: sm 32, default 36 (density/control-height), lg 40.
    const h = ['Small', 'Default', 'Large'].map(n => Math.round(canvas.getByLabelText(n).getBoundingClientRect().height));
    await expect(h).toEqual([32, 36, 40]);
  },
};

export const Invalid: Story = {
  render: args => (
    <div className="grid gap-1.5">
      <label htmlFor="email" className="text-sm font-medium">Work email</label>
      <Input id="email" type="email" aria-invalid="true" aria-describedby="email-error" defaultValue="ana@" {...args} />
      <p id="email-error" className="text-sm text-destructive">Enter an email like name@acme.com</p>
    </div>
  ),
  play: async ({ canvas }) => {
    const input = canvas.getByLabelText('Work email');
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(input).toHaveAccessibleDescription('Enter an email like name@acme.com');
  },
};

export const ReadOnly: Story = {
  args: { readOnly: true, defaultValue: 'INV-2026-0042' },
  play: async ({ canvas }) => {
    const input = canvas.getByLabelText('Work email');
    await userEvent.type(input, 'x');
    await expect(input).toHaveValue('INV-2026-0042');
  },
};

export const Disabled: Story = { args: { disabled: true } };

// Stress test: long value in a narrow column stays one line and scrolls inside the field.
export const LongValue: Story = {
  args: { defaultValue: 'a.very.long.address.for.the.finance.department@acme-holdings-international.com' },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  play: async ({ canvas }) => {
    const input = canvas.getByLabelText('Work email');
    await expect(Math.round(input.getBoundingClientRect().height)).toBe(36);
    await expect(input.getBoundingClientRect().width).toBeLessThanOrEqual(276);
  },
};

export const FilledDark: Story = { args: { inputStyle: 'filled' }, globals: { theme: 'Dark' } };
