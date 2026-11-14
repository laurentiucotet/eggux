import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { AIAssistantPanel, AIChatEmpty, AIConversation } from './ai-blocks';

const meta = {
  title: 'Blocks/AI Chat/Blocks',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The AI blocks from Figma, each a reusable component with content as props. Pick the smallest surface that does the job: the full chat page (Chat Empty, Conversation), a docked panel for the record on screen (Assistant Panel). Sending a prompt answers with a canned reply after a short delay (no network). Blocks/AI Chat/Examples shows the three chat components alone. Figma: BLOCKS / AI. Guide: eggux build-ui/patterns/ai-chat.md',
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const text = (name: string, category = 'Content') => ({ name, control: 'text' as const, table: { category } });

/* Visible stories: one per block, no play */

export const ChatEmpty: StoryObj<React.ComponentProps<typeof AIChatEmpty>> = {
  name: 'Chat Empty',
  args: {
    title: 'How can I help today?',
    description: 'Ask about your projects, customers and invoices.',
    placeholder: 'Ask anything…',
    disclaimer: 'Acme Assistant can make mistakes. Check important information.',
  },
  argTypes: { title: text('Title'), description: text('Description'), placeholder: text('Placeholder', 'Input'), disclaimer: text('Disclaimer', 'Input') },
  render: args => <AIChatEmpty {...args} />,
};

export const Conversation: StoryObj<React.ComponentProps<typeof AIConversation>> = {
  args: { placeholder: 'Reply…', disclaimer: 'Acme Assistant can make mistakes. Check important information.', seeded: true },
  argTypes: {
    placeholder: text('Placeholder', 'Input'),
    disclaimer: text('Disclaimer', 'Input'),
    seeded: { name: 'Show conversation', control: 'boolean', table: { category: 'Parts' } },
  },
  render: args => <AIConversation key={String(args.seeded)} {...args} />,
};

export const AssistantPanel: StoryObj<React.ComponentProps<typeof AIAssistantPanel>> = {
  name: 'Assistant Panel',
  args: { title: 'Assistant', context: 'Invoice INV-1024', placeholder: 'Ask about this invoice…', note: 'Answers use this invoice and its customer.' },
  argTypes: { title: text('Title'), context: text('Context (empty hides it)'), placeholder: text('Placeholder', 'Input'), note: text('Note', 'Input') },
  render: args => (
    <div className="flex h-[800px] justify-end bg-muted">
      <AIAssistantPanel {...args} />
    </div>
  ),
};

/* Hidden checks */

const WIDTHS = [1440, 768, 390] as const;
const multi = { a11y: { config: { rules: [{ id: 'landmark-unique', enabled: false }, { id: 'landmark-complementary-is-top-level', enabled: false }] } }, controls: { disable: true } };
const single = { controls: { disable: true } };
const atWidths = (render: () => React.ReactNode) => (
  <div className="flex flex-col gap-8">
    {WIDTHS.map(w => (
      <div key={w} data-width={w} style={{ width: w }} className="overflow-hidden">
        {render()}
      </div>
    ))}
  </div>
);
const box = (el: Element) => el.getBoundingClientRect();
const px = (el: Element, prop: string) => parseFloat(getComputedStyle(el).getPropertyValue(prop));

/** Every link and button named, images with alt, nothing wider than the frame. */
async function checkCommon(wrap: HTMLElement, w: number) {
  const c = within(wrap);
  for (const el of [...c.queryAllByRole('link'), ...c.queryAllByRole('button')]) {
    await expect((el.textContent ?? '').trim() || el.getAttribute('aria-label') || el.getAttribute('aria-labelledby')).toBeTruthy();
  }
  for (const img of wrap.querySelectorAll('img')) await expect(img.hasAttribute('alt')).toBe(true);
  const wider = [...wrap.querySelectorAll('*')].filter(el => box(el).right > box(wrap).right + 0.5).map(el => `${el.tagName}.${el.getAttribute('data-slot') ?? ''}`);
  await expect({ w, wider: wider.slice(0, 5) }).toEqual({ w, wider: [] });
  await expect(wrap.scrollWidth).toBeLessThanOrEqual(w);
}
const frame = (root: HTMLElement, w: number) => root.querySelector<HTMLElement>(`[data-width="${w}"]`)!;

export const ChatEmptyCheck: Story = {
  tags: ['!dev'],
  parameters: multi,
  render: () => atWidths(() => <AIChatEmpty />),
  play: async ({ canvasElement }) => {
    for (const w of WIDTHS) {
      const wrap = frame(canvasElement, w);
      const c = within(wrap);
      await expect(c.getAllByRole('heading', { level: 1 })).toHaveLength(1);
      await expect(c.getAllByRole('button', { name: /invoices|projects|email|month/ })).toHaveLength(4);
      await expect(c.getByText(/can make mistakes/)).toBeVisible();
      await checkCommon(wrap, w);
    }
    // Figma at 1440: 96 padding, content 768 wide, 32 gap.
    const wide = frame(canvasElement, 1440);
    const section = wide.querySelector('[data-slot="ai-chat-empty-body"]')!;
    await expect(px(section, 'padding-top')).toBe(96);
    await expect(Math.round(box(wide.querySelector('[data-slot="prompt-input"]')!).width)).toBe(768);
    // At 390 the input fills the width minus 16 px gutters.
    const narrow = frame(canvasElement, 390);
    await expect(Math.round(box(narrow.querySelector('[data-slot="prompt-input"]')!).width)).toBe(358);
  },
};

const onEmptySend = fn();
export const ChatEmptySendCheck: Story = {
  tags: ['!dev'],
  parameters: single,
  render: () => <AIChatEmpty onSend={onEmptySend} thinkDelay={50} wordDelay={5} />,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const field = c.getByRole('textbox', { name: 'Message' });
    // A starter prompt fills the input; Enter sends it.
    await userEvent.click(c.getByRole('button', { name: 'Summarize open invoices' }));
    await waitFor(() => expect(field).toHaveValue('Summarize open invoices'));
    await userEvent.click(field);
    await userEvent.keyboard('{Enter}');
    await expect(onEmptySend).toHaveBeenCalledWith('Summarize open invoices');
    // The user message appears at once, the input clears and keeps focus.
    const log = await c.findByRole('log', { name: 'Conversation' });
    await expect(within(log).getByText('Summarize open invoices')).toBeVisible();
    await waitFor(() => expect(field).toHaveValue(''));
    await expect(field).toHaveFocus();
    // The canned answer arrives with its actions.
    await waitFor(() => expect(within(log).getByRole('button', { name: 'Good response' })).toBeVisible(), { timeout: 4000 });
    await expect(within(log).getByText(/3 open invoices/)).toBeVisible();
    // Shift+Enter adds a line instead of sending.
    await userEvent.type(field, 'One{Shift>}{Enter}{/Shift}Two');
    await expect(field).toHaveValue('One\nTwo');
    await expect(within(log).queryByText(/^One/)).toBeNull();
  },
};

export const ConversationCheck: Story = {
  tags: ['!dev'],
  parameters: multi,
  render: () => atWidths(() => <AIConversation />),
  play: async ({ canvasElement }) => {
    for (const w of WIDTHS) {
      const wrap = frame(canvasElement, w);
      const c = within(wrap);
      await expect(c.getByRole('region', { name: 'Chat with Acme Assistant' })).toBeInTheDocument();
      await expect(c.getByRole('log', { name: 'Conversation' })).toBeInTheDocument();
      await expect(c.getByRole('button', { name: 'Thought for 12 s' })).toBeInTheDocument();
      await expect(c.getAllByRole('link', { name: /^Source 1/ }).length).toBeGreaterThan(0);
      await checkCommon(wrap, w);
    }
    // Figma at 1440: thread and composer 768 wide, 40 on top.
    const wide = frame(canvasElement, 1440);
    await expect(Math.round(box(wide.querySelector('[data-slot="ai-chat-log"]')!).width)).toBe(768);
    await expect(Math.round(box(wide.querySelector('[data-slot="ai-composer"]')!).width)).toBe(768);
    await expect(px(wide.querySelector('[data-slot="ai-conversation"]')!, 'padding-top')).toBe(40);
  },
};

const onConversationSend = fn();
export const ConversationFlowCheck: Story = {
  tags: ['!dev'],
  parameters: single,
  render: () => <AIConversation onSend={onConversationSend} thinkDelay={300} wordDelay={60} />,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const log = c.getByRole('log', { name: 'Conversation' });
    // Approve: the action runs and says what changed.
    await userEvent.click(c.getByRole('button', { name: 'Approve' }));
    await expect(await c.findByText(/Email sent to billing@acme.com/)).toBeVisible();
    // Follow-up chip fills the input; Send sends it.
    const field = c.getByRole('textbox', { name: 'Message' });
    await userEvent.click(c.getByRole('button', { name: 'Show paid invoices too' }));
    await waitFor(() => expect(field).toHaveValue('Show paid invoices too'));
    await userEvent.click(c.getByRole('button', { name: 'Send' }));
    await expect(onConversationSend).toHaveBeenCalledWith('Show paid invoices too');
    const bubbles = () => [...log.querySelectorAll('[data-slot="user-message-bubble"]')].map(b => b.textContent);
    await expect(bubbles().at(-1)).toBe('You: Show paid invoices too');
    // While it works, Send becomes Stop; Stop keeps what was written.
    await expect(await c.findByRole('status')).toBeInTheDocument();
    const stop = await c.findByRole('button', { name: 'Stop' });
    await waitFor(() => expect(canvasElement.querySelectorAll('[data-slot="assistant-message"][data-state="streaming"] p').length).toBeGreaterThan(0));
    await userEvent.click(stop);
    await expect(await c.findByText('You stopped this answer')).toBeVisible();
    await expect(c.getByRole('button', { name: 'Send' })).toBeInTheDocument();
    // Regenerate writes the stopped answer again, to the end.
    const messages = canvasElement.querySelectorAll('[data-slot="assistant-message"]');
    const last = messages[messages.length - 1] as HTMLElement;
    await userEvent.click(within(last).getByRole('button', { name: 'Regenerate' }));
    await waitFor(() => expect(within(last).getByRole('button', { name: 'Good response' })).toBeVisible(), { timeout: 6000 });
    await expect(last).toHaveAttribute('data-state', 'default');
    await expect(within(last).getByText(/Want me to draft a reminder\?/)).toBeVisible();
    // Feedback toggles.
    await userEvent.click(within(last).getByRole('button', { name: 'Good response' }));
    await expect(within(last).getByRole('button', { name: 'Good response' })).toHaveAttribute('aria-pressed', 'true');
  },
};

export const AssistantPanelCheck: Story = {
  tags: ['!dev'],
  parameters: multi,
  render: () => (
    <div className="flex flex-col gap-8">
      {[400, 360].map(w => (
        <div key={w} data-width={w} style={{ width: w, height: 800 }} className="flex overflow-hidden">
          <AIAssistantPanel thinkDelay={50} wordDelay={5} />
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const w of [400, 360]) {
      const wrap = frame(canvasElement, w);
      const c = within(wrap);
      await expect(c.getByRole('complementary', { name: 'Assistant' })).toBeInTheDocument();
      await expect(c.getByRole('heading', { level: 2, name: 'Assistant' })).toBeInTheDocument();
      await checkCommon(wrap, w);
    }
    const wrap = frame(canvasElement, 400);
    const c = within(wrap);
    // Figma: 400 wide, header 52 high, messages and composer 16 padding.
    await expect(Math.round(box(wrap.querySelector('[data-slot="ai-assistant-panel"]')!).width)).toBe(400);
    await expect(Math.round(box(wrap.querySelector('[data-slot="ai-assistant-panel-header"]')!).height)).toBe(52);
    await expect(px(wrap.querySelector('[data-slot="ai-assistant-panel-messages"]')!, 'padding-top')).toBe(16);
    // The context can be removed.
    await userEvent.click(c.getByRole('button', { name: 'Remove Invoice INV-1024' }));
    await expect(c.queryByText('Invoice INV-1024')).toBeNull();
    // Deny keeps the draft and says so.
    await userEvent.click(c.getByRole('button', { name: 'Deny' }));
    await expect(await c.findByText(/Not sent/)).toBeVisible();
    // Send with Enter: the answer arrives in the panel.
    await userEvent.type(c.getByRole('textbox', { name: 'Message' }), 'When was it sent?{Enter}');
    const log = c.getByRole('log', { name: 'Assistant conversation' });
    await expect(within(log).getByText('When was it sent?')).toBeVisible();
    await waitFor(() => expect(within(log).getAllByRole('button', { name: 'Good response' })).toHaveLength(2), { timeout: 4000 });
    // New chat clears the conversation.
    await userEvent.click(c.getByRole('button', { name: 'New chat' }));
    await waitFor(() => expect(within(log).queryAllByRole('button', { name: 'Good response' })).toHaveLength(0));
  },
};

/* Theme copies for axe */
export const ConversationDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' }, parameters: single, render: () => <AIConversation /> };
export const ConversationBackOffice: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' }, parameters: single, render: () => <AIConversation /> };
