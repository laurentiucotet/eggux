import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, mocked, spyOn, userEvent, waitFor } from 'storybook/test';
import { CopyField } from './copy-field';
import { Field } from './field';
import { TooltipProvider } from './tooltip';

const meta = {
  title: 'Components/Input/Copy Field',
  component: CopyField,
  parameters: {
    docs: { description: { component: 'A value people copy and paste elsewhere: API key, invite link, webhook URL, reference code. Read-only field in muted with the value in mono, then Copy; "Copied" for 2 s, no toast. Long values truncate; the full value is copied. Secrets mask all but the last 4 characters until Reveal. A value people edit: Input. Figma: Input page / Copy Field. Guide: eggux build-ui/patterns/settings-and-admin.md' } },
  },
  args: { value: 'sk_live_51H8xKd2a9f4F2a', valueLabel: 'live secret key', onCopy: fn() },
  decorators: [Story => <TooltipProvider delayDuration={0}><div className="w-[360px] max-w-full"><Story /></div></TooltipProvider>],
  render: args => (
    <Field label="Live secret key" hint="Use it on your server only.">
      <CopyField {...args} />
    </Field>
  ),
  // Stub the clipboard so the tests do not depend on browser permissions.
  beforeEach: () => {
    if (!navigator.clipboard) Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => undefined } });
    const spy = spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);
    return () => spy.mockRestore();
  },
} satisfies Meta<typeof CopyField>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => { const r = el.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)]; };

// Figma State=default -> copied: 360 × 36, read-only mono value, outline Button with copy icon. The
// click copies the full value, shows "Copied" with a check, announces it, and returns after the time.
export const Default: Story = {
  args: { copiedDuration: 600 },
  play: async ({ canvas, canvasElement, args }) => {
    const input = canvas.getByRole('textbox', { name: 'Live secret key' });
    await expect(input).toHaveAttribute('readonly');
    await expect(input).toHaveAccessibleDescription('Use it on your server only.');
    await expect(getComputedStyle(input).fontFamily).toContain('Mono');
    await expect(box(canvasElement.querySelector('[data-slot="copy-field"]')!)).toEqual([360, 36]);
    const button = canvas.getByRole('button', { name: 'Copy live secret key' });
    await expect(box(button)[1]).toBe(36);
    await userEvent.click(button);
    await expect(mocked(navigator.clipboard.writeText)).toHaveBeenCalledWith('sk_live_51H8xKd2a9f4F2a');
    await expect(args.onCopy).toHaveBeenCalledWith('sk_live_51H8xKd2a9f4F2a');
    await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('Copied'));
    await expect(canvas.getByRole('button', { name: 'Copied' })).toBeInTheDocument();
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Copy live secret key' })).toBeInTheDocument(), { timeout: 2000 });
    await expect(canvas.getByRole('status')).toHaveTextContent('');
  },
};

// Keyboard: the value is focusable and selectable (Tab), then Tab to Copy and Enter copies.
export const Keyboard: Story = {
  play: async ({ canvas, args }) => {
    await userEvent.tab();
    await expect(canvas.getByRole('textbox', { name: 'Live secret key' })).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Copy live secret key' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(args.onCopy).toHaveBeenCalledTimes(1));
  },
};

// Secret: masked to the last 4 characters until Reveal (a pressed toggle); Copy copies the full value.
export const Secret: Story = {
  args: { secret: true, revealLabel: 'Show live secret key' },
  play: async ({ canvas }) => {
    const input = canvas.getByRole('textbox', { name: 'Live secret key' });
    await expect(input).toHaveValue(`${'•'.repeat(16)}4F2a`);
    const reveal = canvas.getByRole('button', { name: 'Show live secret key' });
    await expect(reveal).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(reveal);
    await expect(reveal).toHaveAttribute('aria-pressed', 'true');
    await expect(input).toHaveValue('sk_live_51H8xKd2a9f4F2a');
    await userEvent.click(reveal);
    await userEvent.click(canvas.getByRole('button', { name: 'Copy live secret key' }));
    await expect(mocked(navigator.clipboard.writeText)).toHaveBeenCalledWith('sk_live_51H8xKd2a9f4F2a');
  },
};

// Clipboard fails: the value is shown and selected, the message says how to copy by hand.
export const CopyFails: Story = {
  tags: ['!dev'],
  args: { secret: true, revealLabel: 'Show live secret key' },
  play: async ({ canvas }) => {
    mocked(navigator.clipboard.writeText).mockRejectedValueOnce(new Error('denied'));
    await userEvent.click(canvas.getByRole('button', { name: 'Copy live secret key' }));
    await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('Press Ctrl+C to copy'));
    const input = canvas.getByRole('textbox', { name: 'Live secret key' }) as HTMLInputElement;
    await expect(input).toHaveValue('sk_live_51H8xKd2a9f4F2a');
    await waitFor(() => expect(input).toHaveFocus());
    await expect([input.selectionStart, input.selectionEnd]).toEqual([0, input.value.length]);
  },
};

// Other values: invite link and webhook URL.
export const Links: Story = {
  render: args => (
    <div className="flex flex-col gap-4">
      <Field label="Invite link"><CopyField {...args} value="https://app.acme.com/invite/7Hd92kLx" valueLabel="invite link" /></Field>
      <Field label="Webhook URL" disabled><CopyField {...args} value="https://hooks.acme.com/v1/orders" valueLabel="webhook URL" /></Field>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Copy invite link' })).toBeEnabled();
    await expect(canvas.getByRole('button', { name: 'Copy webhook URL' })).toBeDisabled();
  },
};

// Stress test: a long value in the 276 and 368 columns stays on one line and truncates; the button
// keeps its size; the full value is copied.
export const Stress: Story = {
  tags: ['!dev'],
  decorators: [Story => <div><Story /></div>],
  render: args => (
    <div className="flex flex-col gap-4">
      {[276, 368].map(w => (
        <div key={w} style={{ width: w }}>
          <Field label={`Webhook ${w}`}><CopyField {...args} value="https://hooks.acme-holdings-international.com/v1/orders/created?token=7Hd92kLx0aPq" valueLabel={`webhook ${w}`} /></Field>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    for (const row of Array.from(canvasElement.querySelectorAll('[data-slot="copy-field"]'))) {
      await expect(box(row)[1]).toBe(36);
      await expect(box(row.querySelector('[data-slot="copy-field-button"]')!)[0]).toBeGreaterThanOrEqual(90);
    }
    await expect(box(canvasElement.querySelector('[data-slot="copy-field"]')!)[0]).toBe(276);
    await userEvent.click(canvas.getByRole('button', { name: 'Copy webhook 276' }));
    await expect(mocked(navigator.clipboard.writeText)).toHaveBeenCalledWith('https://hooks.acme-holdings-international.com/v1/orders/created?token=7Hd92kLx0aPq');
  },
};

export const Dark: Story = { tags: ['!dev'], globals: { theme: 'Dark' } };
export const CorporateLight: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' } };
