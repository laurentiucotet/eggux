import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';
import { Button } from './button';
import { Checkbox } from './checkbox';
import { Field } from './field';
import { CheckItem, ErrorSummary, Fieldset, FormSection, RequirementList, type FormError } from './form-layout';
import { Input } from './input';

const meta = {
  title: 'Components/Form Layout/Form Section',
  component: FormSection,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'The structure of long forms: Form Section (title and a sentence beside or above 2-6 fields, a divider between sections), Fieldset (one legend, rule and error for a group of controls), Error Summary (after a failed submit: the count and a link to each field; focus moves to it) and Requirement List with Check Items (rules checked live as people type). Figma: Form Layout page. Guide: eggux build-ui/patterns/form-validation.md' } },
  },
  args: { title: 'Billing details' },
  render: () => (
    <div className="flex w-[960px] flex-col gap-8">
      <FormSection title="Billing details" description="Shown on every invoice you send. Changes apply to new invoices only.">
        <Field label="Company name" hint="As registered"><Input defaultValue="Acme Inc." /></Field>
        <Field label="VAT number" hint="Starts with the country code, like RO12345678"><Input defaultValue="RO12345678" /></Field>
      </FormSection>
      <div className="w-[560px]">
        <FormSection title="Contact" description="Who gets invoices and reminders." divider={false}>
          <Field label="Email"><Input type="email" defaultValue="billing@acme.com" /></Field>
        </FormSection>
      </div>
    </div>
  ),
} satisfies Meta<typeof FormSection>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();

// Figma: side 960 × 225 with a 280 heading and fields 48 to the right; stacked under 640.
export const Default: Story = {
  play: async ({ canvas, canvasElement }) => {
    const [side, stacked] = canvasElement.querySelectorAll('[data-slot="form-section"]');
    await expect(canvas.getByRole('region', { name: 'Billing details' })).toBeInTheDocument();
    await expect(Math.round(box(side!).height)).toBe(225);
    const heading = canvas.getByRole('heading', { name: 'Billing details' });
    const fields = side!.querySelector('[data-slot="form-section-fields"]')!;
    await expect(Math.round(box(heading).width)).toBe(280);
    await expect(Math.round(box(fields).left - box(heading).right)).toBe(48);
    const stackedHeading = canvas.getByRole('heading', { name: 'Contact' });
    const stackedFields = stacked!.querySelector('[data-slot="form-section-fields"]')!;
    await expect(Math.round(box(stackedFields).top - box(stackedHeading.parentElement!).bottom)).toBe(24);
  },
};

function SignupDemo() {
  const [errors, setErrors] = React.useState<FormError[]>([]);
  const [topics, setTopics] = React.useState<string[]>([]);
  const [password, setPassword] = React.useState('');
  const topicError = errors.some(e => e.fieldId === 'topic-paid') ? 'Choose at least one notification.' : undefined;
  const emailError = errors.find(e => e.fieldId === 'email')?.message;
  const rules = [
    { label: 'At least 12 characters', met: password.length >= 12 },
    { label: 'One number', met: /\d/.test(password) },
    { label: 'One symbol', met: /[^\w\s]/.test(password) },
  ];
  return (
    <form
      noValidate
      className="flex w-[560px] flex-col gap-6"
      onSubmit={e => {
        e.preventDefault();
        const form = e.currentTarget;
        const email = (form.elements.namedItem('email') as HTMLInputElement).value;
        const next: FormError[] = [];
        if (!/^\S+@\S+\.\S+$/.test(email)) next.push({ fieldId: 'email', message: 'Email: enter an email address like name@company.com' });
        if (!topics.length) next.push({ fieldId: 'topic-paid', message: 'Notifications: choose at least one' });
        setErrors(next);
      }}
    >
      <ErrorSummary errors={errors} />
      <Field id="email" label="Email" error={emailError ? 'Enter an email address like name@company.com' : undefined}>
        <Input name="email" type="email" />
      </Field>
      <Fieldset legend="Notify me about" description="Choose at least one." error={topicError}>
        {[['paid', 'Invoices paid'], ['approvals', 'Approvals waiting'], ['weekly', 'Weekly summary']].map(([v, l]) => (
          <Checkbox
            key={v}
            id={`topic-${v}`}
            label={l}
            invalid={Boolean(topicError)}
            checked={topics.includes(v!)}
            onCheckedChange={c => setTopics(t => (c ? [...t, v!] : t.filter(x => x !== v)))}
          />
        ))}
      </Fieldset>
      <Field id="password" label="Password">
        <Input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      </Field>
      <RequirementList title="Your password needs">
        {rules.map(r => <CheckItem key={r.label} mark={r.met ? 'check' : 'dash'}>{r.label}</CheckItem>)}
      </RequirementList>
      <Button type="submit" className="self-start">Create account</Button>
    </form>
  );
}

// Failed submit: summary takes focus, links move focus to fields; the group error; live rules.
export const Validation: Story = {
  render: () => <SignupDemo />,
  play: async ({ canvas, canvasElement }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Create account' }));
    const summary = canvas.getByRole('group', { name: 'Fix 2 fields to continue' });
    await waitFor(() => expect(summary).toHaveFocus());
    await expect(Math.round(box(summary).width)).toBe(560);
    await userEvent.click(canvas.getByRole('link', { name: 'Notifications: choose at least one' }));
    await expect(canvas.getByRole('checkbox', { name: 'Invoices paid' })).toHaveFocus();
    const group = canvas.getByRole('group', { name: 'Notify me about' });
    await expect(group).toHaveAccessibleDescription('Choose at least one. Choose at least one notification.');
    await userEvent.type(canvas.getByLabelText('Password'), 'correct-horse-9');
    const items = canvasElement.querySelectorAll('[data-slot="check-item"]');
    await expect([...items].map(i => i.getAttribute('data-mark'))).toEqual(['check', 'check', 'check']);
    await expect(canvas.getByRole('list', { name: 'Your password needs' })).toHaveTextContent('Met: At least 12 characters');
  },
};

// Check Item marks and tones on primary and inverted cards.
export const CheckItems: Story = {
  render: () => (
    <div className="flex items-start gap-6">
      <ul className="m-0 flex flex-col gap-1.5 p-0">
        <CheckItem mark="check">At least 12 characters</CheckItem>
        <CheckItem mark="dash">One symbol</CheckItem>
        <CheckItem mark="x">Not used on Acme before</CheckItem>
      </ul>
      <ul className="m-0 flex flex-col gap-1.5 rounded-lg bg-primary p-4">
        <CheckItem tone="on-primary" stateText={{ check: 'Included: ' }}>Unlimited invoices</CheckItem>
        <CheckItem tone="on-primary" mark="dash" stateText={{ dash: 'Not included: ' }}>SSO</CheckItem>
      </ul>
      <ul className="m-0 flex flex-col gap-1.5 rounded-lg bg-foreground p-4">
        <CheckItem tone="inverted">Audit log</CheckItem>
        <CheckItem tone="inverted" mark="dash">Custom contracts</CheckItem>
      </ul>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const items = canvasElement.querySelectorAll('[data-slot="check-item"]');
    await expect(Math.round(box(items[0]!).height)).toBe(20);
    await expect(items[3]).toHaveTextContent('Included: Unlimited invoices');
  },
};

export const DefaultDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' }, render: CheckItems.render };
export const DefaultCorporate: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' }, render: CheckItems.render };
export const ValidationDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' }, render: () => <SignupDemo /> };
