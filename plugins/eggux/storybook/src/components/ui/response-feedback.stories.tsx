import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { ThumbsDown } from '@/components/icons';
import { Button } from './button';
import { ResponseFeedback } from './response-feedback';

const meta = {
  title: 'AI Chat/Response Feedback',
  component: ResponseFeedback,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Opens under an answer after Bad response: reasons as toggle chips (one or more), optional details, a note on what is shared, Send. Escape or Cancel closes and focus returns to Bad response. Good response sends at once, no form. Figma: AI Chat / Response Feedback. Guide: eggux build-ui/components/ai-chat.md' } },
  },
  args: { onSubmit: fn(), onClose: fn() },
  decorators: [Story => <div className="w-[480px] max-w-full"><Story /></div>],
} satisfies Meta<typeof ResponseFeedback>;
export default meta;
type Story = StoryObj<typeof meta>;

const form = (el: HTMLElement) => el.querySelector('[data-slot="response-feedback"]') as HTMLElement;

// Figma default (480 wide): focus starts on the first reason; Send needs a reason, sends reasons and details.
export const Default: Story = {
  play: async ({ canvas, canvasElement, args }) => {
    await expect(canvas.getByRole('form', { name: 'What went wrong?' })).toBeVisible();
    // Figma: 480 × 274 (reasons in two rows of three).
    await expect(Math.round(form(canvasElement).getBoundingClientRect().width)).toBe(480);
    await expect(Math.round(form(canvasElement).getBoundingClientRect().height)).toBe(274);
    const first = canvas.getByRole('button', { name: 'Not accurate' });
    await expect(first).toHaveFocus();
    const send = canvas.getByRole('button', { name: 'Send' });
    await expect(send).toBeDisabled();
    await expect(Math.round(send.getBoundingClientRect().height)).toBe(32);
    await expect(Math.round(first.getBoundingClientRect().height)).toBe(32);

    await userEvent.keyboard(' ');
    await expect(first).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(canvas.getByRole('button', { name: 'Incomplete' }));
    await userEvent.type(canvas.getByRole('textbox', { name: 'Details (optional)' }), 'It missed INV-1038 (EUR 800).');
    await expect(send).toBeEnabled();
    await userEvent.click(send);
    await expect(args.onSubmit).toHaveBeenCalledWith({ reasons: ['Not accurate', 'Incomplete'], details: 'It missed INV-1038 (EUR 800).' });
  },
};

// A reason chosen (Figma shows "Not accurate" selected): pressing it again clears it.
export const ReasonSelected: Story = {
  args: { defaultReasons: ['Not accurate'] },
  play: async ({ canvas }) => {
    const chip = canvas.getByRole('button', { name: 'Not accurate' });
    await expect(chip).toHaveAttribute('aria-pressed', 'true');
    await expect(canvas.getByRole('button', { name: 'Not helpful' })).toHaveAttribute('aria-pressed', 'false');
    await expect(canvas.getByRole('button', { name: 'Send' })).toBeEnabled();
    await userEvent.click(chip);
    await expect(chip).toHaveAttribute('aria-pressed', 'false');
    await expect(canvas.getByRole('button', { name: 'Send' })).toBeDisabled();
  },
};

// Figma Show details off: no textarea.
export const WithoutDetails: Story = {
  args: { showDetails: false, defaultReasons: ['Too slow'] },
  play: async ({ canvas, args }) => {
    await expect(canvas.queryByRole('textbox')).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: 'Send' }));
    await expect(args.onSubmit).toHaveBeenCalledWith({ reasons: ['Too slow'], details: '' });
  },
};

// Close, Cancel and Escape all close.
export const Close: Story = {
  play: async ({ canvas, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Close' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Cancel' }));
    canvas.getByRole('textbox').focus();
    await userEvent.keyboard('{Escape}');
    await expect(args.onClose).toHaveBeenCalledTimes(3);
  },
};

// The whole flow: Bad response opens the form under the answer, focus moves in, Escape closes it
// and focus returns to Bad response, which stays pressed after Send.
function Flow() {
  const [open, setOpen] = React.useState(false);
  const [sent, setSent] = React.useState(false);
  const badRef = React.useRef<HTMLButtonElement>(null);
  const close = () => {
    setOpen(false);
    requestAnimationFrame(() => badRef.current?.focus());
  };
  return (
    <div className="flex flex-col gap-2">
      <p className="text-base leading-7">Acme has 3 open invoices, €4,820 in total.</p>
      <div>
        <Button ref={badRef} variant="ghost" size="icon" aria-label="Bad response" title="Bad response" aria-pressed={open || sent} aria-expanded={open} onClick={() => setOpen(true)}>
          <ThumbsDown aria-hidden="true" />
        </Button>
      </div>
      {open ? <ResponseFeedback onClose={close} onSubmit={() => { setSent(true); close(); }} /> : null}
      <p role="status" className="text-sm text-muted-foreground">{sent ? 'Thanks, this helps' : ''}</p>
    </div>
  );
}

export const FromBadResponse: Story = {
  parameters: { controls: { disable: true } },
  render: () => <Flow />,
  play: async ({ canvas }) => {
    const bad = canvas.getByRole('button', { name: 'Bad response' });
    await userEvent.click(bad);
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Not accurate' })).toHaveFocus());
    await userEvent.keyboard('{Escape}');
    await expect(canvas.queryByRole('form')).not.toBeInTheDocument();
    await waitFor(() => expect(bad).toHaveFocus());

    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Not accurate' })).toHaveFocus());
    await userEvent.keyboard(' ');
    await userEvent.click(canvas.getByRole('button', { name: 'Send' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('Thanks, this helps');
    await waitFor(() => expect(bad).toHaveFocus());
    await expect(bad).toHaveAttribute('aria-pressed', 'true');
  },
};

const long = {
  title: 'What went wrong? with a much longer label than planned',
  note: 'Sends this conversation to the Acme team. Sends this conversation to the Acme team.',
};

// Stress test: long title and note wrap; chips wrap; nothing overflows at 276 and 368 px.
export const LongText: Story = { tags: ['!dev'],
  args: long,
  play: async ({ canvasElement }) => {
    const el = form(canvasElement);
    await expect(el.scrollWidth).toBeLessThanOrEqual(el.clientWidth);
  },
};

// Figma columns 1/4 (276) and 1/3 (368): one form per page, so each width is its own story.
const column = (width: number): Story => ({
  args: { ...long, autoFocus: false },
  decorators: [Story => <div style={{ width }}><Story /></div>],
  play: async ({ canvasElement, canvas }) => {
    const el = form(canvasElement);
    await expect(Math.round(el.getBoundingClientRect().width)).toBe(width);
    await expect(el.scrollWidth).toBeLessThanOrEqual(el.clientWidth);
    const send = canvas.getByRole('button', { name: 'Send' });
    await expect(send.getBoundingClientRect().right).toBeLessThanOrEqual(el.getBoundingClientRect().right);
  },
});
export const Column276: Story = column(276);
export const Column368: Story = column(368);

export const ReasonSelectedDark: Story = { ...ReasonSelected, tags: ['!dev'], globals: { theme: 'Dark' } };
export const ReasonSelectedCorporate: Story = { ...ReasonSelected, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
