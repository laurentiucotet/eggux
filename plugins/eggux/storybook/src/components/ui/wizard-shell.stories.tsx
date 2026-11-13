import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { DraftSavedIndicator } from './draft-saved-indicator';
import { Field } from './field';
import { Input } from './input';
import { WizardShell, type WizardStep } from './wizard-shell';

const NOW = '2026-03-12T14:32:10Z';
const allSteps: WizardStep[] = [
  { id: 'company', title: 'Company details', description: '2 minutes' },
  { id: 'bank', title: 'Bank account', description: '3 minutes' },
  { id: 'style', title: 'Invoice style' },
  { id: 'review', title: 'Review' },
];

type Handlers = { onFinish?: () => void; onClose?: () => void; onSaveDraft?: () => void };
type Args = { steps: number; title: string; showClose: boolean; showSaveDraft: boolean; showDraftStatus: boolean; requireInput: boolean; width: number };

/** The app owns the answers and the validity; the shell only shows the current step. */
function Live({ steps, title, showClose, showSaveDraft, showDraftStatus, requireInput, onFinish, onClose, onSaveDraft }: Omit<Args, 'width'> & Handlers) {
  const [values, setValues] = React.useState<Record<string, string>>({});
  const [index, setIndex] = React.useState(0);
  const list = allSteps.slice(0, steps);
  const current = list[Math.min(index, list.length - 1)];
  const valid = !requireInput || current.id === 'review' || Boolean(values[current.id]?.trim());
  return (
    <WizardShell
      title={title}
      steps={list}
      step={Math.min(index, list.length - 1)}
      onStepChange={setIndex}
      valid={valid}
      onFinish={onFinish}
      onClose={showClose ? (onClose ?? (() => undefined)) : undefined}
      onSaveDraft={showSaveDraft ? (onSaveDraft ?? (() => undefined)) : undefined}
      draftStatus={showDraftStatus ? <DraftSavedIndicator status="saved" savedAt={NOW} timeZone="UTC" /> : undefined}
    >
      {current.id === 'review' ? (
        <p className="m-0 text-sm text-muted-foreground">Check your answers, then finish.</p>
      ) : (
        <Field label={`${current.title} name`} required>
          <Input value={values[current.id] ?? ''} onChange={e => setValues(v => ({ ...v, [current.id]: e.target.value }))} autoComplete="off" />
        </Field>
      )}
    </WizardShell>
  );
}

const meta = {
  title: 'Components/Wizard/Wizard Shell',
  parameters: {
    docs: {
      description: {
        component:
          'Frame of a multi-step flow: header with the title and Close, Step Navigation, the step content (passed in), and a footer with Back, Save draft and Next / Finish. Next stays disabled until the step is valid, with the reason beside it. On a step change focus moves to the step heading and a polite status announces "Step 2 of 4". Code only (no Figma component yet). Guide: eggux build-ui/patterns/wizard.md',
      },
    },
  },
  args: { steps: 4, title: 'Set up invoicing', showClose: true, showSaveDraft: true, showDraftStatus: true, requireInput: true, width: 760 },
  argTypes: {
    title: { name: 'Title', control: 'text', description: 'Name of the flow.', table: { category: 'Wizard' } },
    steps: { name: 'Steps', control: { type: 'range', min: 2, max: 4, step: 1 }, description: 'How many steps.', table: { category: 'Wizard' } },
    requireInput: { name: 'Require input', control: 'boolean', description: 'Next is disabled until the field has text.', table: { category: 'Wizard' } },
    width: { name: 'Width', control: { type: 'range', min: 276, max: 880, step: 4 }, description: 'Container width in px. Below 40rem the navigation sits above the content.', table: { category: 'Wizard' } },
    showClose: { name: 'Show Close', control: 'boolean', description: 'The X in the header.', table: { category: 'Parts' } },
    showSaveDraft: { name: 'Show Save draft', control: 'boolean', description: 'The Save draft button.', table: { category: 'Parts' } },
    showDraftStatus: { name: 'Show draft status', control: 'boolean', description: 'A Draft Saved Indicator after Save draft.', table: { category: 'Parts' } },
  },
  render: ({ width, ...rest }) => (
    <div style={{ width }} className="max-w-full">
      <Live key={rest.steps} {...rest} />
    </div>
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => {
    const handlers = { onFinish: fn(), onClose: fn(), onSaveDraft: fn() };
    (window as unknown as { __h?: typeof handlers }).__h = handlers;
    return <Live steps={3} title="Set up invoicing" showClose showSaveDraft showDraftStatus={false} requireInput {...handlers} />;
  },
  play: async ({ canvas }) => {
    const h = (window as unknown as { __h: Record<'onFinish' | 'onClose' | 'onSaveDraft', ReturnType<typeof fn>> }).__h;
    await expect(canvas.getByRole('region', { name: 'Set up invoicing' })).toBeVisible();
    await expect(canvas.getByRole('heading', { level: 3, name: 'Company details' })).toBeVisible();
    // Next is disabled until the step is valid; Back is disabled on the first step.
    const next = canvas.getByRole('button', { name: 'Next' });
    await expect(next).toBeDisabled();
    await expect(next).toHaveAccessibleDescription('Complete the required fields to continue.');
    await expect(canvas.getByRole('button', { name: 'Back' })).toBeDisabled();
    await userEvent.type(canvas.getByRole('textbox', { name: /Company details name/ }), 'Acme Ltd');
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Next' })).toBeEnabled());
    // Next: focus goes to the new step heading, and the change is announced politely.
    await userEvent.click(canvas.getByRole('button', { name: 'Next' }));
    await waitFor(() => expect(canvas.getByRole('heading', { level: 3, name: 'Bank account' })).toHaveFocus());
    await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('Step 2 of 3: Bank account'));
    const nav = canvas.getByRole('navigation', { name: 'Set up invoicing steps' });
    await expect(nav.querySelector('[aria-current="step"]')).toHaveTextContent('Bank account');
    await expect(canvas.getByRole('button', { name: 'Next' })).toBeDisabled();
    // Save draft and Close call the app.
    await userEvent.click(canvas.getByRole('button', { name: 'Save draft' }));
    await expect(h.onSaveDraft).toHaveBeenCalledTimes(1);
    // A done step in the navigation goes back; the typed answer is still there.
    await userEvent.click(canvas.getByRole('button', { name: /Company details/ }));
    await waitFor(() => expect(canvas.getByRole('heading', { level: 3, name: 'Company details' })).toHaveFocus());
    await expect(canvas.getByRole('textbox', { name: /Company details name/ })).toHaveValue('Acme Ltd');
    // Forward again with the keyboard, fill step 2, reach the last step: Finish.
    await userEvent.click(canvas.getByRole('button', { name: 'Next' }));
    await userEvent.type(await canvas.findByRole('textbox', { name: /Bank account name/ }), 'Main account');
    await userEvent.click(canvas.getByRole('button', { name: 'Next' }));
    await waitFor(() => expect(canvas.getByRole('heading', { level: 3, name: 'Invoice style' })).toHaveFocus());
    // Last step: Finish replaces Next, and it is disabled until the step is valid.
    await expect(canvas.queryByRole('button', { name: 'Next' })).toBeNull();
    await expect(canvas.getByRole('button', { name: 'Finish' })).toBeDisabled();
    await userEvent.click(canvas.getByRole('button', { name: 'Back' }));
    await waitFor(() => expect(canvas.getByRole('heading', { level: 3, name: 'Bank account' })).toHaveFocus());
    await userEvent.click(canvas.getByRole('button', { name: 'Next' }));
    await userEvent.type(await canvas.findByRole('textbox', { name: /Invoice style name/ }), 'Classic');
    await userEvent.click(await canvas.findByRole('button', { name: 'Finish' }));
    await expect(h.onFinish).toHaveBeenCalledTimes(1);
    await userEvent.click(canvas.getByRole('button', { name: 'Close' }));
    await expect(h.onClose).toHaveBeenCalledTimes(1);
  },
};

/** A step the person has left with a problem shows "Needs attention" in the navigation and can be clicked. */
export const WithError: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <WizardShell title="Set up invoicing" steps={allSteps} defaultStep={2} errorStepIds={['bank']} onClose={() => undefined} onSaveDraft={() => undefined} draftStatus={<DraftSavedIndicator status="error" onRetry={() => undefined} />}>
      <Field label="Invoice style name" required><Input defaultValue="Classic" autoComplete="off" /></Field>
    </WizardShell>
  ),
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => (
    <WizardShell
      title="Set up invoicing for every legal entity of the whole group"
      steps={[
        { id: 'a', title: 'Registered company address and the VAT number', description: 'A long description for this step' },
        { id: 'b', title: 'Review' },
      ]}
      valid={false}
      onClose={() => undefined}
      onSaveDraft={() => undefined}
      draftStatus={<DraftSavedIndicator status="saved" savedAt={NOW} timeZone="UTC" />}
    >
      <Field label="Company name" required><Input autoComplete="off" /></Field>
    </WizardShell>
  ),
  play: async ({ canvas }) => {
    const region = canvas.getByRole('region');
    await expect(region.scrollWidth).toBeLessThanOrEqual(region.clientWidth + 1);
    await expect(region.getBoundingClientRect().width).toBeLessThanOrEqual(276);
    for (const button of canvas.getAllByRole('button')) {
      await expect(button.getBoundingClientRect().right).toBeLessThanOrEqual(region.getBoundingClientRect().right + 1);
    }
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
