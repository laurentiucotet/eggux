import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';
import { ConditionalFieldGroup } from './conditional-field-group';
import { Field } from './field';
import { Input } from './input';

type Args = { trigger: 'switch' | 'radio'; startOpen: boolean; showDescription: boolean; disabled: boolean; width: number };

function Example({ trigger, startOpen, showDescription, disabled }: Omit<Args, 'width'>) {
  return (
    <ConditionalFieldGroup
      trigger={trigger}
      label="Billing address is different"
      description={showDescription ? 'Turn on to enter an address for invoices.' : undefined}
      fieldsLabel="Billing address"
      defaultChecked={startOpen}
      disabled={disabled}
    >
      <Field label="Street and number"><Input name="street" autoComplete="off" /></Field>
      <Field label="City"><Input name="city" autoComplete="off" /></Field>
    </ConditionalFieldGroup>
  );
}

const meta = {
  title: 'Components/Wizard/Conditional Field Group',
  parameters: {
    docs: {
      description: {
        component:
          'A Switch or a Yes / No radio pair that reveals follow-up fields when on. Hidden fields are display:none and inert (out of the tab order and the accessibility tree) but stay mounted, so typed values come back. A polite status announces "fields shown" or "hidden". Code only (no Figma component yet). Guide: eggux build-ui/patterns/wizard.md',
      },
    },
  },
  args: { trigger: 'switch', startOpen: false, showDescription: true, disabled: false, width: 400 },
  argTypes: {
    trigger: { name: 'Trigger', control: 'inline-radio', options: ['switch', 'radio'], description: 'A Switch or a Yes / No radio pair.', table: { category: 'Group' } },
    startOpen: { name: 'Start on', control: 'boolean', description: 'Start with the fields shown.', table: { category: 'Group' } },
    disabled: { name: 'Disabled', control: 'boolean', description: 'The trigger cannot be changed.', table: { category: 'Group' } },
    width: { name: 'Width', control: { type: 'range', min: 240, max: 560, step: 4 }, description: 'Container width in px.', table: { category: 'Group' } },
    showDescription: { name: 'Show description', control: 'boolean', description: 'Help text under the question.', table: { category: 'Parts' } },
  },
  render: ({ width, ...rest }) => (
    <div style={{ width }} className="max-w-full">
      <Example key={`${rest.trigger}-${rest.startOpen}`} {...rest} />
    </div>
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <Example trigger="switch" startOpen={false} showDescription disabled={false} />,
  play: async ({ canvas }) => {
    const toggle = canvas.getByRole('switch', { name: 'Billing address is different' });
    await expect(toggle).toHaveAttribute('aria-checked', 'false');
    // Hidden: not in the accessibility tree, not in the tab order.
    await expect(canvas.queryByRole('textbox', { name: 'Street and number' })).toBeNull();
    await expect(canvas.queryByRole('group', { name: 'Billing address' })).toBeNull();
    toggle.focus();
    await userEvent.keyboard(' ');
    await waitFor(() => expect(toggle).toHaveAttribute('aria-checked', 'true'));
    await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('Billing address fields shown'));
    await expect(toggle).toHaveFocus();
    // Revealed fields are reachable by Tab and keep what is typed.
    await userEvent.tab();
    await expect(canvas.getByRole('textbox', { name: 'Street and number' })).toHaveFocus();
    await userEvent.keyboard('12 High Street');
    toggle.focus();
    await userEvent.keyboard(' ');
    await waitFor(() => expect(toggle).toHaveAttribute('aria-checked', 'false'));
    await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('Billing address fields hidden'));
    await expect(canvas.queryByRole('textbox', { name: 'Street and number' })).toBeNull();
    await userEvent.tab();
    await expect(toggle).not.toHaveFocus();
    toggle.focus();
    await userEvent.keyboard(' ');
    await waitFor(() => expect(canvas.getByRole('textbox', { name: 'Street and number' })).toHaveValue('12 High Street'));
  },
};

export const RadioCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <Example trigger="radio" startOpen={false} showDescription disabled={false} />,
  play: async ({ canvas }) => {
    const group = canvas.getByRole('radiogroup');
    await expect(canvas.getByRole('radio', { name: 'No' })).toBeChecked();
    await expect(canvas.queryByRole('textbox', { name: 'City' })).toBeNull();
    await userEvent.click(canvas.getByRole('radio', { name: 'Yes' }));
    await waitFor(() => expect(canvas.getByRole('textbox', { name: 'City' })).toBeVisible());
    await expect(canvas.getByRole('status')).toHaveTextContent('Billing address fields shown');
    await expect(group).toBeVisible();
  },
};

/** Both triggers, shown and hidden. */
export const Triggers: Story = {
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="flex w-[400px] max-w-full flex-col gap-8"><Story /></div>],
  render: () => (
    <>
      <Example trigger="switch" startOpen showDescription disabled={false} />
      <Example trigger="radio" startOpen={false} showDescription disabled={false} />
    </>
  ),
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => (
    <ConditionalFieldGroup label="The delivery address is not the same as the registered office address of the company" description="A description that is long enough to wrap over several lines in a narrow column." defaultChecked>
      <Field label="Street and number"><Input autoComplete="off" /></Field>
    </ConditionalFieldGroup>
  ),
  play: async ({ canvas }) => {
    const root = canvas.getByRole('group', { name: 'The delivery address is not the same as the registered office address of the company' });
    await expect(root.getBoundingClientRect().width).toBeLessThanOrEqual(276);
    await expect(canvas.getByRole('textbox', { name: 'Street and number' })).toBeVisible();
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
