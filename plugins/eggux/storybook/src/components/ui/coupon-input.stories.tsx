import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { CouponInput } from './coupon-input';

type Args = { label: string; state: 'idle' | 'loading' | 'applied' | 'error'; disabled: boolean; error: string; appliedDescription: string };

const meta = {
  title: 'Components/Checkout/Coupon Input',
  parameters: {
    docs: {
      description: {
        component:
          'A discount code field with Apply. Idle, loading, error (aria-invalid, message linked and spoken) and applied (the code, what it does and Remove; focus returns to the field after Remove). Enter applies; Apply stays off while the field is empty. The parent checks the code and sets the state. Code only (no Figma component yet).',
      },
    },
  },
  args: { label: 'Discount code', state: 'idle', disabled: false, error: 'This code has expired.', appliedDescription: '20% off your order' },
  argTypes: {
    label: { name: 'Label', control: 'text', description: 'Label of the field.', table: { category: 'Coupon' } },
    state: { name: 'State', control: 'select', options: ['idle', 'loading', 'applied', 'error'], description: 'Where the code is in its check.', table: { category: 'Coupon' } },
    disabled: { name: 'Disabled', control: 'boolean', description: 'Blocks the field and the buttons.', table: { category: 'Coupon' } },
    error: { name: 'Error message', control: 'text', description: 'Shown in the error state.', table: { category: 'Parts' } },
    appliedDescription: { name: 'Applied description', control: 'text', description: 'What the code does, in the applied state.', table: { category: 'Parts' } },
  },
  render: ({ label, state, disabled, error, appliedDescription }) => (
    <CouponInput
      key={state}
      label={label}
      disabled={disabled}
      loading={state === 'loading'}
      error={state === 'error' ? error : undefined}
      applied={state === 'applied' ? 'SPRING20' : undefined}
      appliedDescription={appliedDescription}
      defaultValue={state === 'loading' || state === 'error' ? 'SPRING20' : ''}
    />
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

function Flow({ onApply }: { onApply?: (code: string) => void }) {
  const [applied, setApplied] = React.useState<string>();
  const [error, setError] = React.useState<string>();
  return (
    <CouponInput
      applied={applied}
      appliedDescription="20% off your order"
      error={error}
      onValueChange={() => setError(undefined)}
      onApply={code => {
        onApply?.(code);
        if (code.toUpperCase() === 'SPRING20') {
          setApplied('SPRING20');
          setError(undefined);
        } else setError('That code is not valid.');
      }}
      onRemove={() => setApplied(undefined)}
    />
  );
}

/** The whole path: type a wrong code, then a right one, then remove it. */
export const ApplyAndRemove: Story = {
  parameters: { controls: { disable: true } },
  render: () => <Flow />,
};

export const FlowCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <Flow onApply={fn()} />,
  play: async ({ canvas }) => {
    const apply = canvas.getByRole('button', { name: 'Apply' });
    await expect(apply).toBeDisabled();
    const field = canvas.getByRole('textbox', { name: 'Discount code' });
    await userEvent.type(field, 'nope{Enter}');
    const alert = await canvas.findByRole('alert');
    await expect(alert).toHaveTextContent('That code is not valid.');
    await expect(field).toHaveAttribute('aria-invalid', 'true');
    await expect(field).toHaveAccessibleDescription('That code is not valid.');
    await userEvent.clear(field);
    await userEvent.type(field, 'spring20');
    await waitFor(() => expect(field).not.toHaveAttribute('aria-invalid'));
    await userEvent.click(canvas.getByRole('button', { name: 'Apply' }));
    const status = await canvas.findByRole('status');
    await expect(status).toHaveTextContent('SPRING20');
    await expect(status).toHaveTextContent('20% off your order');
    await userEvent.click(canvas.getByRole('button', { name: 'Remove code SPRING20' }));
    const again = await canvas.findByRole('textbox', { name: 'Discount code' });
    await waitFor(() => expect(again).toHaveFocus());
  },
};

export const LoadingCheck: Story = {
  tags: ['!dev'],
  args: { state: 'loading' },
  play: async ({ canvas }) => {
    const apply = canvas.getByRole('button', { name: 'Apply' });
    await expect(apply).toHaveAttribute('aria-busy', 'true');
    await expect(canvas.getByRole('textbox', { name: 'Discount code' })).toHaveAttribute('readonly');
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="flex w-[276px] flex-col gap-6"><Story /></div>],
  render: () => (
    <>
      <CouponInput defaultValue="WELCOME-FRIENDS-AND-FAMILY-2026-EXTRA" error="This code is only valid for orders above €500.00 placed before the end of the spring sale." />
      <CouponInput applied="WELCOME-FRIENDS-AND-FAMILY-2026-EXTRA" appliedDescription="Free express shipping on orders over €500.00 for the first three months" />
    </>
  ),
  play: async ({ canvas }) => {
    const box = canvas.getByRole('button', { name: 'Apply' }).closest('form')!;
    await expect(box.scrollWidth).toBeLessThanOrEqual(box.clientWidth + 1);
    const remove = canvas.getByRole('button', { name: /^Remove code/ });
    await expect(remove.getBoundingClientRect().right).toBeLessThanOrEqual(remove.closest('[role="status"]')!.getBoundingClientRect().right);
  },
};

export const DefaultDark: Story = { ...FlowCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...FlowCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
