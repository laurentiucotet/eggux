import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { InlineForm, type InlineFormProps } from './inline-form';

const meta = {
  title: 'Components/Input/Inline Form',
  component: InlineForm,
  parameters: {
    docs: { description: { component: 'One field and one button on a line: newsletter sign-up, coupon code, invite by email, add a tag. Enter submits; the error keeps the value and the success message says what happens next, both replacing the hint and announced politely. Tone=on-primary on primary bands and cards. Figma: Input page / Inline Form. Guides: eggux build-ui/components/input.md, patterns/commerce.md' } },
  },
  args: {
    label: 'Email address',
    placeholder: 'name@company.com',
    buttonLabel: 'Subscribe',
    hint: 'One email a month. Unsubscribe at any time.',
    inputProps: { type: 'email', autoComplete: 'email' },
    onSubmit: fn(),
  },
} satisfies Meta<typeof InlineForm>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => { const r = el.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)]; };
const color = (className: string) => {
  const el = document.createElement('span');
  el.className = className;
  (document.querySelector('#storybook-root') ?? document.body).append(el);
  const value = getComputedStyle(el).color;
  el.remove();
  return value;
};

// Figma State=default: 400 × 62; input fills, the button hugs 8 px after it, the hint 6 px below in
// body/small muted. Enter and the button submit the value.
export const Default: Story = {
  play: async ({ canvas, canvasElement, args }) => {
    const form = canvasElement.querySelector('[data-slot="inline-form"]')!;
    await expect(box(form)).toEqual([400, 62]);
    const input = canvas.getByRole('textbox', { name: 'Email address' });
    const button = canvas.getByRole('button', { name: 'Subscribe' });
    await expect(box(input)[1]).toBe(36);
    await expect(button.getBoundingClientRect().left - input.getBoundingClientRect().right).toBe(8);
    await expect(input).toHaveAccessibleDescription('One email a month. Unsubscribe at any time.');
    const hint = canvas.getByText('One email a month. Unsubscribe at any time.');
    await expect(hint.getBoundingClientRect().top - input.getBoundingClientRect().bottom).toBe(6);
    await expect(getComputedStyle(hint).fontSize).toBe('14px');
    await expect(getComputedStyle(hint).color).toBe(color('text-muted-foreground'));
    await userEvent.type(input, 'ana@acme.com{Enter}');
    await expect(args.onSubmit).toHaveBeenLastCalledWith('ana@acme.com', expect.anything());
    await userEvent.click(button);
    await expect(args.onSubmit).toHaveBeenCalledTimes(2);
  },
};

function Validating(props: InlineFormProps) {
  const [error, setError] = React.useState<string>();
  const [success, setSuccess] = React.useState<string>();
  return (
    <InlineForm
      {...props}
      error={error}
      success={success}
      onSubmit={value => {
        const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        setError(ok ? undefined : 'Enter an email address like name@company.com.');
        setSuccess(ok ? 'You are subscribed. Check your inbox to confirm.' : undefined);
      }}
    />
  );
}

// Figma State=error then State=success: the error keeps the value, replaces the hint and is linked
// and announced; fixing the value shows the success message.
export const Validation: Story = {
  render: args => <Validating {...args} />,
  play: async ({ canvas }) => {
    const input = canvas.getByRole('textbox', { name: 'Email address' });
    await userEvent.type(input, 'ana@acme{Enter}');
    await expect(input).toHaveValue('ana@acme');
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(input).toHaveAccessibleDescription('Enter an email address like name@company.com.');
    const error = canvas.getByText('Enter an email address like name@company.com.');
    await expect(error).toHaveAttribute('aria-live', 'polite');
    await expect(getComputedStyle(error).color).toBe(color('text-destructive'));
    await expect(canvas.queryByText('One email a month. Unsubscribe at any time.')).toBeNull();
    await userEvent.type(input, '.com{Enter}');
    await expect(input).not.toHaveAttribute('aria-invalid');
    const success = canvas.getByText('You are subscribed. Check your inbox to confirm.');
    await expect(getComputedStyle(success).color).toBe(color('text-success'));
    await expect(input).toHaveAccessibleDescription('You are subscribed. Check your inbox to confirm.');
  },
};

// The three states side by side, as in Figma.
export const States: Story = {
  render: args => (
    <div className="flex flex-col gap-6">
      <InlineForm {...args} />
      <InlineForm {...args} defaultValue="ana@acme" error="Enter an email address like name@company.com." />
      <InlineForm {...args} defaultValue="ana@acme.com" success="You are subscribed. Check your inbox to confirm." />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const states = [...canvasElement.querySelectorAll('[data-slot="inline-form"]')].map(f => f.getAttribute('data-state'));
    await expect(states).toEqual(['default', 'error', 'success']);
  },
};

// Figma Tone=on-primary: on a primary band the button is secondary and the hint and messages use
// foreground/primary; the input keeps its own surface.
export const OnPrimary: Story = {
  args: { tone: 'on-primary' },
  render: args => (
    <div className="flex flex-col gap-6 rounded-lg bg-primary p-6">
      <InlineForm {...args} />
      <InlineForm {...args} defaultValue="ana@acme" error="Enter an email address like name@company.com." />
      <InlineForm {...args} defaultValue="ana@acme.com" success="You are subscribed. Check your inbox to confirm." />
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    const [button] = canvas.getAllByRole('button', { name: 'Subscribe' });
    await expect(getComputedStyle(button).backgroundColor).toBe((() => {
      const el = document.createElement('span');
      el.className = 'bg-secondary';
      canvasElement.append(el);
      const v = getComputedStyle(el).backgroundColor;
      el.remove();
      return v;
    })());
    for (const p of canvasElement.querySelectorAll('[aria-live="polite"]')) {
      await expect(getComputedStyle(p).color).toBe(color('text-primary-foreground'));
    }
    const [input] = canvas.getAllByRole('textbox');
    await expect(getComputedStyle(input).backgroundColor).not.toBe(getComputedStyle(canvasElement.querySelector('.bg-primary')!).backgroundColor);
  },
};

// Pending: the button shows its spinner and ignores repeat submits.
export const Pending: Story = {
  args: { pending: true, defaultValue: 'ana@acme.com' },
  play: async ({ canvas, args }) => {
    const button = canvas.getByRole('button', { name: 'Subscribe' });
    await expect(button).toHaveAttribute('aria-busy', 'true');
    await userEvent.click(button);
    await userEvent.type(canvas.getByRole('textbox'), '{Enter}');
    await expect(args.onSubmit).not.toHaveBeenCalled();
  },
};

// Stress test (Figma "Stress test / Inline Form"): a long hint wraps, no hint, the 368 and 276
// columns (below 320 the button goes full width under the input), a long button label.
export const Stress: Story = {
  tags: ['!dev'],
  render: args => (
    <div className="flex flex-col gap-6">
      <div data-case="long"><InlineForm {...args} hint="One email a month. Unsubscribe at any time. One email a month. Unsubscribe at any time." /></div>
      <div data-case="nohint"><InlineForm {...args} hint={undefined} /></div>
      <div data-case="368" className="w-92"><InlineForm {...args} className="w-full" /></div>
      <div data-case="276" className="w-[276px]"><InlineForm {...args} className="w-full" /></div>
      <div data-case="label"><InlineForm {...args} buttonLabel="Subscribe to the monthly newsletter" /></div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const q = (c: string, s: string) => canvasElement.querySelector<HTMLElement>(`[data-case="${c}"] ${s}`)!;
    await expect(q('long', 'p').getBoundingClientRect().height).toBeGreaterThan(20);
    await expect(q('nohint', 'input')).not.toHaveAttribute('aria-describedby');
    await expect(box(q('nohint', '[data-slot="inline-form-row"]'))[1]).toBe(36);
    // 368: one line.
    await expect(Math.round(q('368', 'button').getBoundingClientRect().top)).toBe(Math.round(q('368', 'input').getBoundingClientRect().top));
    // 276: the button goes full width under the input.
    await expect(q('276', 'button').getBoundingClientRect().top).toBeGreaterThan(q('276', 'input').getBoundingClientRect().bottom);
    await expect(box(q('276', 'button'))[0]).toBe(276);
    // A long label keeps the input usable.
    await expect(q('label', 'input').getBoundingClientRect().width).toBeGreaterThan(80);
    await expect(box(q('label', '[data-slot="inline-form"]'))[0]).toBe(400);
  },
};

export const Dark: Story = { tags: ['!dev'], globals: { theme: 'Dark' }, render: States.render };
export const CorporateLight: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' }, render: States.render };
export const OnPrimaryDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' }, args: { tone: 'on-primary' }, render: OnPrimary.render };
