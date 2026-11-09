import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { ChevronDown, FileText, Globe, X } from '@/components/icons';
import { Button } from './button';
import { PromptInput } from './prompt-input';

// Every story is a test (vitest): it renders, passes axe and runs its play function.
const meta = {
  title: 'Components/AI Chat/Prompt Input',
  component: PromptInput,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Main input of an AI chat. Enter sends, Shift+Enter adds a line, Send is disabled while empty, Stop replaces Send while the answer streams. Figma: AI Chat / Prompt Input. Guide: eggux build-ui/components/ai-chat.md' } },
  },
  args: { onSubmit: fn(), onStop: fn(), onVoice: fn(), onAttach: fn(), onValueChange: fn() },
  decorators: [Story => <div className="w-[768px] max-w-full"><Story /></div>],
} satisfies Meta<typeof PromptInput>;
export default meta;
type Story = StoryObj<typeof meta>;

const tools = (
  <>
    <Button variant="ghost" size="sm" leadingIcon={<Globe aria-hidden="true" />}>Search</Button>
    <Button variant="ghost" size="sm" trailingIcon={<ChevronDown aria-hidden="true" />} aria-label="Model: Auto">Auto</Button>
  </>
);

// Figma State=default, Content=placeholder: Send disabled until there is text.
export const Default: Story = {
  args: { tools },
  play: async ({ canvas, args }) => {
    const field = canvas.getByRole('textbox', { name: 'Message' });
    const send = canvas.getByRole('button', { name: 'Send' });
    await expect(send).toBeDisabled();
    await userEvent.click(field);
    await userEvent.type(field, 'Which invoices for Acme are open?');
    await expect(send).toBeEnabled();
    // Shift+Enter adds a line, Enter sends and clears; focus stays in the field.
    await userEvent.keyboard('{Shift>}{Enter}{/Shift}');
    await expect(args.onSubmit).not.toHaveBeenCalled();
    await userEvent.type(field, 'Only the overdue ones.');
    await userEvent.keyboard('{Enter}');
    await expect(args.onSubmit).toHaveBeenCalledWith('Which invoices for Acme are open?\nOnly the overdue ones.');
    await expect(field).toHaveValue('');
    await expect(field).toHaveFocus();
    await expect(send).toBeDisabled();
  },
};

// Figma State=default, Content=filled: 768 × 118 at comfortable density.
export const Filled: Story = {
  args: { tools, defaultValue: 'Summarize the open invoices for Acme and draft a reminder email.' },
  play: async ({ canvas, canvasElement, args }) => {
    const root = canvasElement.querySelector('[data-slot="prompt-input"]') as HTMLElement;
    await expect(Math.round(root.getBoundingClientRect().height)).toBe(118);
    await expect(root).toHaveAttribute('data-content', 'filled');
    await userEvent.click(canvas.getByRole('button', { name: 'Send' }));
    await expect(args.onSubmit).toHaveBeenCalledWith('Summarize the open invoices for Acme and draft a reminder email.');
  },
};

// Figma State=streaming: Stop replaces Send, Enter does not send a second request.
export const Streaming: Story = {
  args: { tools, streaming: true, defaultValue: 'Draft the reminder in a friendlier tone.' },
  play: async ({ canvas, args }) => {
    await expect(canvas.queryByRole('button', { name: 'Send' })).not.toBeInTheDocument();
    canvas.getByRole('textbox').focus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onSubmit).not.toHaveBeenCalled();
    await userEvent.click(canvas.getByRole('button', { name: 'Stop' }));
    await expect(args.onStop).toHaveBeenCalledTimes(1);
  },
};

// Figma State=disabled.
export const Disabled: Story = {
  args: { tools, disabled: true, defaultValue: 'Summarize the open invoices for Acme.' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('textbox')).toBeDisabled();
    await expect(canvas.getByRole('button', { name: 'Send' })).toBeDisabled();
    await expect(canvas.getByRole('button', { name: 'Dictate' })).toBeDisabled();
    await expect(canvas.getByRole('button', { name: 'Search' })).toBeDisabled();
  },
};

// Figma Show attachments with the Attachments slot filled, and the attach button.
export const WithAttachments: Story = {
  args: {
    tools,
    defaultValue: 'Compare these two reports.',
    attachments: (['Q3-report.pdf', 'Q2-report.pdf'] as const).map(name => (
      <div key={name} className="flex w-56 items-center gap-2 rounded-lg border border-border bg-background p-2">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted"><FileText aria-hidden="true" /></span>
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-sm font-medium">{name}</span>
          <span className="text-xs text-muted-foreground">PDF · 240 KB</span>
        </span>
        <Button variant="ghost" size="icon-xs" aria-label={`Remove ${name}`}><X aria-hidden="true" /></Button>
      </div>
    )),
  },
  play: async ({ canvas, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Attach files' }));
    await expect(args.onAttach).toHaveBeenCalledTimes(1);
  },
};

// Panel and inline use: tools and voice hidden.
export const Minimal: Story = {
  args: { showVoice: false, onAttach: undefined, placeholder: 'Ask about this invoice…' },
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole('button')).toHaveLength(1);
  },
};

// Stress test (Figma "Stress test / Prompt Input"): grows to about 8 lines, then scrolls.
export const LongText: Story = { tags: ['!dev'],
  args: { tools, defaultValue: Array.from({ length: 14 }, (_, i) => `Line ${i + 1}: list every open invoice for Acme with its due date and amount in EUR.`).join('\n') },
  play: async ({ canvas }) => {
    const field = canvas.getByRole('textbox') as HTMLTextAreaElement;
    await expect(Math.round(field.getBoundingClientRect().height)).toBe(224);
    await expect(field.scrollHeight).toBeGreaterThan(field.clientHeight);
  },
};

// Narrow column (368 px): the toolbar stays on one row.
export const Narrow: Story = { tags: ['!dev'],
  args: { tools },
  decorators: [Story => <div className="w-[368px]"><Story /></div>],
  play: async ({ canvas }) => {
    const send = canvas.getByRole('button', { name: 'Send' }).getBoundingClientRect();
    const dictate = canvas.getByRole('button', { name: 'Dictate' }).getBoundingClientRect();
    await expect(Math.round(send.top)).toBe(Math.round(dictate.top));
  },
};

export const FilledDark: Story = { ...Filled, tags: ['!dev'], globals: { theme: 'Dark' } };
export const FilledCorporate: Story = { ...Filled, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
