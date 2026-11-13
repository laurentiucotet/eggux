import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { Input } from './input';
import { KeyboardAccessoryBar } from './keyboard-accessory-bar';

type Args = { fields: number; keyboardHeight: number };

const fields = [
  { id: 'kab-name', label: 'Full name', type: 'text', placeholder: 'Maya Lopez' },
  { id: 'kab-email', label: 'Email', type: 'email', placeholder: 'maya@acme.example' },
  { id: 'kab-phone', label: 'Phone', type: 'tel', placeholder: '+40 721 555 014' },
  { id: 'kab-company', label: 'Company', type: 'text', placeholder: 'Acme' },
];

function Form({ count, bottom, onDone }: { count: number; bottom: number; onDone?: () => void }) {
  const list = fields.slice(0, count);
  return (
    <div className="relative h-[460px] w-[360px] max-w-full overflow-hidden rounded-xl border border-border bg-background">
      <form className="flex flex-col gap-3 p-4" onSubmit={e => e.preventDefault()}>
        {list.map(f => (
          <div key={f.id} className="flex min-w-0 flex-col gap-1.5">
            <label htmlFor={f.id} className="text-sm leading-5 font-medium">{f.label}</label>
            <Input id={f.id} type={f.type} placeholder={f.placeholder} />
          </div>
        ))}
      </form>
      <KeyboardAccessoryBar position="absolute" fieldIds={list.map(f => f.id)} bottom={bottom} onDone={onDone} />
    </div>
  );
}

const meta = {
  title: 'Components/Mobile/Keyboard Accessory Bar',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'The bar above the on-screen keyboard: Previous field, Next field and Done, 44 high. It knows the form by the ids of its fields: Previous and Next move the focus (disabled at the ends), Done blurs the field. `bottom` is the keyboard height, so the bar sticks above it. Buttons never steal focus from the field, so the keyboard stays up. The sample here is a frame; on a phone the bar is fixed. Code only (no Figma component yet).',
      },
    },
  },
  args: { fields: 3, keyboardHeight: 0 },
  argTypes: {
    fields: { name: 'Fields', control: { type: 'range', min: 2, max: 4, step: 1 }, description: 'How many fields the form has.', table: { category: 'Bar' } },
    keyboardHeight: { name: 'Keyboard height', control: { type: 'range', min: 0, max: 280, step: 10 }, description: 'The bottom offset in px (the keyboard).', table: { category: 'Bar' } },
  },
  render: ({ fields: count, keyboardHeight }) => <Form key={count} count={count} bottom={keyboardHeight} />,
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** With a keyboard 260 px tall under it. */
export const AboveKeyboard: Story = { args: { keyboardHeight: 260 } };

export const DefaultCheck: Story = {
  tags: ['!dev'],
  render: () => {
    const onDone = fn();
    return <Form count={3} bottom={0} onDone={onDone} />;
  },
  play: async ({ canvas }) => {
    const bar = canvas.getByRole('toolbar', { name: 'Form navigation' });
    const name = canvas.getByLabelText('Full name');
    const email = canvas.getByLabelText('Email');
    const phone = canvas.getByLabelText('Phone');
    const prev = canvas.getByRole('button', { name: 'Previous field' });
    const next = canvas.getByRole('button', { name: 'Next field' });
    const done = canvas.getByRole('button', { name: 'Done' });
    for (const b of [prev, next, done]) await expect(Math.round(b.getBoundingClientRect().height)).toBeGreaterThanOrEqual(44);
    // No field focused: Previous is off.
    await expect(prev).toBeDisabled();
    await userEvent.click(name);
    await waitFor(() => expect(bar).toHaveTextContent('Field 1 of 3'));
    await expect(prev).toBeDisabled();
    // Next moves the focus and the focus stays in the field (not on the button).
    await userEvent.click(next);
    await waitFor(() => expect(email).toHaveFocus());
    await expect(bar).toHaveTextContent('Field 2 of 3');
    await userEvent.click(next);
    await waitFor(() => expect(phone).toHaveFocus());
    await waitFor(() => expect(next).toBeDisabled());
    await userEvent.click(prev);
    await waitFor(() => expect(email).toHaveFocus());
    await expect(next).toBeEnabled();
    // Done blurs the field.
    await userEvent.click(done);
    await waitFor(() => expect(email).not.toHaveFocus());
    await waitFor(() => expect(prev).toBeDisabled());
  },
};

export const KeyboardCheck: Story = {
  tags: ['!dev'],
  render: () => <Form count={3} bottom={0} />,
  play: async ({ canvas }) => {
    // The bar is reachable with Tab and its buttons work with Enter.
    const name = canvas.getByLabelText('Full name');
    await userEvent.click(name);
    await userEvent.tab();
    await userEvent.tab();
    await userEvent.tab();
    const prev = canvas.getByRole('button', { name: 'Previous field' });
    await waitFor(() => expect(prev).toHaveFocus());
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(canvas.getByLabelText('Email')).toHaveFocus());
  },
};

export const OffsetCheck: Story = {
  tags: ['!dev'],
  render: () => <Form count={3} bottom={200} />,
  play: async ({ canvas }) => {
    const bar = canvas.getByRole('toolbar', { name: 'Form navigation' });
    const frame = bar.parentElement as HTMLElement;
    // The bar's bottom edge sits 200 px above the frame's bottom edge.
    await expect(Math.round(frame.getBoundingClientRect().bottom - bar.getBoundingClientRect().bottom)).toBeGreaterThanOrEqual(198);
    await expect(Math.round(frame.getBoundingClientRect().bottom - bar.getBoundingClientRect().bottom)).toBeLessThanOrEqual(202);
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => <Form count={4} bottom={120} />,
  play: async ({ canvas }) => {
    const bar = canvas.getByRole('toolbar', { name: 'Form navigation' });
    await expect(bar.scrollWidth).toBeLessThanOrEqual(bar.clientWidth + 1);
    await userEvent.click(canvas.getByLabelText('Company'));
    await waitFor(() => expect(bar).toHaveTextContent('Field 4 of 4'));
    for (const b of canvas.getAllByRole('button')) await expect(b).toBeVisible();
  },
};

export const DefaultDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' } };
