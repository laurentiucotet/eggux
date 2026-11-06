import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { Button } from './button';
import { Field } from './field';
import { InputGroup } from './input-group';

const meta = {
  title: 'Components/Input/Input Group',
  component: InputGroup,
  parameters: {
    docs: { description: { component: 'Input with attached addons, for a fixed prefix or suffix that is part of the value format (https://, .com, EUR, kg, %). `start` / `end` take text (an Input Addon, read as the description) or a node (a Select or a Button). Show loading during an async check; the result goes in the Field hint or error. Icons inside the field: Input. Figma: Input page / Input Group. Guide: eggux build-ui/components/input.md' } },
  },
  args: { start: 'https://', end: '.com', defaultValue: 'egg-ux', onChange: fn() },
  decorators: [Story => <div className="w-[360px] max-w-full"><Story /></div>],
  render: args => (
    <Field label="Workspace URL" hint="Letters, numbers and dashes.">
      <InputGroup {...args} />
    </Field>
  ),
} satisfies Meta<typeof InputGroup>;
export default meta;
type Story = StoryObj<typeof meta>;

const group = (el: HTMLElement) => el.querySelector('[data-slot="input-group"]') as HTMLElement;
const probe = (cls: string) => { const p = document.createElement('span'); p.className = cls; document.body.append(p); const s = getComputedStyle(p); return { color: s.color, border: s.borderTopColor, remove: () => p.remove() }; };

// Figma State=default: 360 × 36, addons "https://" and ".com", value body/small; typing keeps the
// addons out of the value; the addon text is in the input's description.
export const Default: Story = {
  play: async ({ canvas, canvasElement, args }) => {
    const input = canvas.getByRole('textbox', { name: 'Workspace URL' });
    const box = group(canvasElement).getBoundingClientRect();
    await expect([Math.round(box.width), Math.round(box.height)]).toEqual([360, 36]);
    await expect(input).toHaveAccessibleDescription('Letters, numbers and dashes. https:// .com');
    await userEvent.clear(input);
    await userEvent.type(input, 'acme-finance');
    await expect(input).toHaveValue('acme-finance');
    await expect(args.onChange).toHaveBeenCalled();
    // The addons keep their width; the input fills between them.
    const [start, end] = Array.from(canvasElement.querySelectorAll('[data-slot="input-addon"]'));
    await expect(start.getBoundingClientRect().right).toBeLessThanOrEqual(input.getBoundingClientRect().left + 0.5);
    await expect(end.getBoundingClientRect().left).toBeGreaterThanOrEqual(input.getBoundingClientRect().right - 0.5);
  },
};

// Figma State=focus: the ring wraps the whole group (border/ring border plus the 2 px gap and band).
export const Focus: Story = {
  play: async ({ canvas, canvasElement }) => {
    await userEvent.tab();
    await expect(canvas.getByRole('textbox', { name: 'Workspace URL' })).toHaveFocus();
    const ring = probe('border border-ring');
    await expect(getComputedStyle(group(canvasElement)).borderTopColor).toBe(ring.border);
    ring.remove();
    await expect(getComputedStyle(group(canvasElement)).boxShadow).toContain('0px 0px 0px 4px');
  },
};

// Figma State=error: the Field error sets aria-invalid; the group border turns destructive.
export const ErrorState: Story = {
  name: 'Error',
  render: args => (
    <Field label="Workspace URL" error="This URL is taken. Try acme-finance-2.">
      <InputGroup {...args} defaultValue="acme-finance" />
    </Field>
  ),
  play: async ({ canvas, canvasElement }) => {
    const input = canvas.getByRole('textbox', { name: 'Workspace URL' });
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(input).toHaveAccessibleDescription('This URL is taken. Try acme-finance-2. https:// .com');
    const red = probe('border border-destructive');
    await expect(getComputedStyle(group(canvasElement)).borderTopColor).toBe(red.border);
    red.remove();
  },
};

// Figma State=disabled: the input and every control in the slots are disabled, the group fades.
export const Disabled: Story = {
  render: args => (
    <Field label="API endpoint" disabled>
      <InputGroup {...args} end={<Button variant="ghost" className="h-full rounded-none border-l border-input">Copy</Button>} />
    </Field>
  ),
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole('textbox', { name: 'API endpoint' })).toBeDisabled();
    await expect(canvas.getByRole('button', { name: 'Copy' })).toBeDisabled();
    await expect(getComputedStyle(group(canvasElement)).opacity).toBe('0.5');
  },
};

// Figma Show loading: Spinner sm after the value while the URL is checked; aria-busy and a polite
// status message; the result goes in the Field hint.
function LoadingDemo(args: React.ComponentProps<typeof InputGroup>) {
  const [checking, setChecking] = React.useState(true);
  return (
    <div className="flex flex-col gap-3">
      <Field label="Workspace URL" hint={checking ? 'Checking if the URL is free.' : 'acme-finance is available.'}>
        <InputGroup {...args} defaultValue="acme-finance" loading={checking} loadingLabel="Checking the workspace URL" />
      </Field>
      <Button variant="outline" size="sm" className="self-start" onClick={() => setChecking(false)}>Finish check</Button>
    </div>
  );
}
export const Loading: Story = {
  render: args => <LoadingDemo {...args} />,
  play: async ({ canvas, canvasElement }) => {
    const input = canvas.getByRole('textbox', { name: 'Workspace URL' });
    await expect(input).toHaveAttribute('aria-busy', 'true');
    await expect(canvas.getByRole('status')).toHaveTextContent('Checking the workspace URL');
    const spinner = canvasElement.querySelector('[data-slot="input-group-loading"] [data-slot="spinner"]')!;
    await expect(Math.round(spinner.getBoundingClientRect().width)).toBe(16);
    await userEvent.click(canvas.getByRole('button', { name: 'Finish check' }));
    await expect(input).not.toHaveAttribute('aria-busy');
    await expect(canvas.getByRole('status')).toHaveTextContent('');
    await expect(input).toHaveAccessibleDescription('acme-finance is available. https:// .com');
  },
};

// Figma Start and End slots: text addons for units and currencies, or a Button attached to the field.
export const Slots: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Field label="Monthly budget"><InputGroup start="EUR" defaultValue="1,250.00" inputClassName="text-right tabular-nums" inputMode="decimal" /></Field>
      <Field label="Parcel weight"><InputGroup end="kg" defaultValue="2.4" inputMode="decimal" /></Field>
      <Field label="Discount"><InputGroup end="%" defaultValue="15" inputMode="numeric" /></Field>
      <Field label="Reviewer handle"><InputGroup start="@" defaultValue="ana.berg" /></Field>
      <Field label="Webhook secret">
        <InputGroup readOnly defaultValue="whsec_7Hd92kLx" end={<Button variant="ghost" className="h-full rounded-none border-l border-input">Generate</Button>} />
      </Field>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('textbox', { name: 'Monthly budget' })).toHaveAccessibleDescription('EUR');
    await expect(canvas.getByRole('textbox', { name: 'Parcel weight' })).toHaveAccessibleDescription('kg');
    await expect(getComputedStyle(canvas.getByRole('textbox', { name: 'Monthly budget' })).textAlign).toBe('right');
    // A node in a slot is not added to the description.
    await expect(canvas.getByRole('textbox', { name: 'Webhook secret' })).not.toHaveAttribute('aria-describedby');
    await userEvent.tab();
    await userEvent.tab();
    await userEvent.tab();
    await userEvent.tab();
    await userEvent.tab();
    await expect(canvas.getByRole('textbox', { name: 'Webhook secret' })).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Generate' })).toHaveFocus();
  },
};

// Stress test: a long value in the 276 and 368 columns stays on one line and truncates; the addons
// keep their width; no start or no end.
export const Stress: Story = {
  tags: ['!dev'],
  decorators: [Story => <div className="w-auto"><Story /></div>],
  render: () => (
    <div className="flex flex-col gap-4">
      {[276, 368].map(w => (
        <div key={w} style={{ width: w }}>
          <Field label={`Website ${w}`}>
            <InputGroup start="https://" end=".com" defaultValue="finance-department-quarterly-reports-and-vendor-reviews" />
          </Field>
        </div>
      ))}
      <div className="w-[276px]"><Field label="Only start"><InputGroup start="https://" defaultValue="acme.com" /></Field></div>
      <div className="w-[276px]"><Field label="Only end"><InputGroup end="kg" defaultValue="12" /></Field></div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const g of Array.from(canvasElement.querySelectorAll<HTMLElement>('[data-slot="input-group"]'))) {
      await expect(Math.round(g.getBoundingClientRect().height)).toBe(36);
      for (const a of Array.from(g.querySelectorAll<HTMLElement>('[data-slot="input-addon"]'))) {
        await expect(Math.round(a.getBoundingClientRect().height)).toBe(34);
      }
      await expect(g.getBoundingClientRect().width).toBeLessThanOrEqual(368);
    }
  },
};

export const Dark: Story = { tags: ['!dev'], globals: { theme: 'Dark' } };
export const CorporateLight: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' } };
