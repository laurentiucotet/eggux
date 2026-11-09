import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, userEvent } from 'storybook/test';
import { Field } from './field';
import { Input } from './input';

const meta = {
  title: 'Components/Input/Field',
  component: Field,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Label + control + hint or error for every form control. The label is always visible; the error replaces the hint and says how to fix it. Mark the minority: required or optional, never both. Figma: Input page / Field. Guide: eggux build-ui/patterns/form-validation.md' } },
  },
  args: { label: 'Email', hint: 'We send receipts and account notices here.', children: <Input type="email" placeholder="name@example.com" /> },
  decorators: [Story => <div className="w-[320px] max-w-full"><Story /></div>],
} satisfies Meta<typeof Field>;
export default meta;
type Story = StoryObj<typeof meta>;

const root = (el: HTMLElement) => el.querySelector('[data-slot="field"]') as HTMLElement;

// Figma State=default, Layout=vertical: 320 × 88 (label 20, gap 8, input 36, gap 8, hint 16).
export const Default: Story = {
  play: async ({ canvas, canvasElement }) => {
    const input = canvas.getByRole('textbox', { name: 'Email' });
    await expect(input).toHaveAccessibleDescription('We send receipts and account notices here.');
    await expect(input).not.toHaveAttribute('aria-invalid');
    await expect(Math.round(root(canvasElement).getBoundingClientRect().height)).toBe(88);
    await userEvent.click(canvas.getByText('Email'));
    await expect(input).toHaveFocus();
  },
};

// Figma State=error: red label, error with icon replaces the hint, aria-invalid.
export const ErrorState: Story = {
  name: 'Error',
  args: { error: 'Enter an email address like name@example.com', children: <Input type="email" defaultValue="name@" /> },
  play: async ({ canvas, canvasElement }) => {
    const input = canvas.getByRole('textbox', { name: 'Email' });
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(input).toHaveAccessibleDescription('Enter an email address like name@example.com');
    await expect(canvas.queryByText('We send receipts and account notices here.')).not.toBeInTheDocument();
    await expect(canvasElement.querySelector('[data-slot="field-error"] svg')).toHaveAttribute('aria-hidden', 'true');
    await expect(Math.round(root(canvasElement).getBoundingClientRect().height)).toBe(88);
  },
};

// Figma State=disabled: the control is disabled, not just faded.
export const Disabled: Story = {
  args: { disabled: true, children: <Input type="email" defaultValue="ana@acme.com" /> },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('textbox', { name: 'Email' })).toBeDisabled();
  },
};

// Figma Show required / Show optional: the asterisk is hidden from screen readers, the control
// is required; "Optional" is read with the label.
export const RequiredAndOptional: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-6">
      <Field label="Company name" required><Input defaultValue="Acme GmbH" /></Field>
      <Field label="VAT number" optional hint="Leave empty for private customers."><Input /></Field>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('textbox', { name: 'Company name' })).toBeRequired();
    await expect(canvas.getByRole('textbox', { name: 'VAT number Optional' })).not.toBeRequired();
  },
};

// Figma Show info: Info Tip Trigger after the label opens the definition.
export const WithInfo: Story = {
  args: {
    label: 'Tax ID',
    hint: 'Format: RO12345678',
    info: { title: 'What is a tax ID?', children: 'The number your tax authority gives your business. It appears on every invoice you send.' },
    children: <Input defaultValue="RO18547290" />,
  },
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: 'More about Tax ID' });
    await userEvent.click(trigger);
    await expect(await screen.findByRole('dialog')).toHaveTextContent('What is a tax ID?');
    // The info button is not part of the label.
    await expect(canvas.getByRole('textbox', { name: 'Tax ID' })).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
  },
};

// Figma Show counter: counter at the right of the label; over the limit the Field shows an error.
function CounterField() {
  const [value, setValue] = React.useState('Invoice reminders for Acme customers, sent every Monday.');
  const over = value.length > 60;
  return (
    <Field label="Short description" counter={{ value: value.length, limit: 60 }} hint="Shown in the list of automations." error={over ? 'Use 60 characters or fewer' : undefined}>
      <Input value={value} onChange={e => setValue(e.target.value)} />
    </Field>
  );
}
export const WithCounter: Story = {
  parameters: { controls: { disable: true } },
  render: () => <CounterField />,
  play: async ({ canvas, canvasElement }) => {
    const input = canvas.getByRole('textbox', { name: 'Short description' });
    const counter = canvasElement.querySelector('[data-slot="field-counter"]') as HTMLElement;
    await expect(counter).toHaveAttribute('data-status', 'near');
    await expect(input).toHaveAccessibleDescription(/Shown in the list of automations\. 5\d \/ 60 characters/);
    await userEvent.type(input, ' And on Fridays.');
    await expect(counter).toHaveAttribute('data-status', 'over');
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    // Typing past the limit is never blocked.
    await expect((input as HTMLInputElement).value.length).toBeGreaterThan(60);
  },
};

// Figma Layout=horizontal: 160 label column, min width 400, 480 × 60.
export const Horizontal: Story = {
  args: { layout: 'horizontal' },
  decorators: [Story => <div className="w-[480px]"><Story /></div>],
  play: async ({ canvas, canvasElement }) => {
    const input = canvas.getByRole('textbox', { name: 'Email' });
    await expect(Math.round(root(canvasElement).getBoundingClientRect().height)).toBe(60);
    await expect(Math.round(input.getBoundingClientRect().left - root(canvasElement).getBoundingClientRect().left)).toBe(176);
  },
};

// Show label off: only for a control with its own visible label; hint stays.
export const WithoutLabel: Story = {
  args: { showLabel: false, children: <Input aria-label="Search invoices" placeholder="Search invoices" /> },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('textbox', { name: 'Search invoices' })).toHaveAccessibleDescription('We send receipts and account notices here.');
  },
};

// Stress test (Figma "Stress test / Field"): long label wraps at 256 (144 horizontal), long
// error wraps, nothing overflows at 276.
export const LongText: Story = { tags: ['!dev'],
  args: {
    label: 'Email address of the person who approves purchase orders above €10,000',
    required: true,
    info: { children: 'They get an email for every order above the limit.' },
    error: 'Enter an email address like name@example.com. Approvers must have an account in this workspace.',
    children: <Input type="email" defaultValue="laura.becker@" />,
  },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  play: async ({ canvasElement }) => {
    const label = canvasElement.querySelector('label') as HTMLElement;
    await expect(label.getBoundingClientRect().width).toBeLessThanOrEqual(256);
    await expect(label.getBoundingClientRect().height).toBeGreaterThan(20);
    await expect(root(canvasElement).scrollWidth).toBeLessThanOrEqual(276);
  },
};

export const ErrorDark: Story = { ...ErrorState, name: 'Error Dark', tags: ['!dev'], globals: { theme: 'Dark' } };
export const WithInfoCorporate: Story = { ...WithInfo, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
