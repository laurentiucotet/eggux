import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { ChatComposer, ChatMessage, ConversationItem, MentionChip, ReactionBar, ThreadSummary, TypingIndicator, toggleReaction, type ReactionData } from './chat';

const meta = {
  title: 'Components/Chat/Chat',
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'People chat (support, team chat, inbox). Chat Message: incoming with avatar on muted, outgoing on primary with Sent / Delivered / Read; runs from one person group (avatar and time on the last). Typing Indicator: announced politely. Chat Composer: Enter sends, Shift+Enter adds a line, Send disabled while empty, grows to 5 lines. Mention Chip, Reaction Bar (toggle and add from the Emoji Picker), Thread Summary, Conversation Item for the conversation list. AI assistant messages use the AI Chat components. Figma: Chat page. Guide: eggux build-ui/components/chat.md' } },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();
const sofia = { name: 'Sofia Bran', initials: 'SB' };

// Figma: 640 wide, 56 high single-line messages; incoming left with avatar, outgoing right with status.
export const Messages: Story = {
  name: 'Chat Message',
  render: () => (
    <div className="flex w-[640px] flex-col gap-4">
      <ChatMessage author={sofia} text="Hi! Is the export to Excel included in the Team plan?" time="10:42" dateTime="2026-11-07T10:42" />
      <ChatMessage direction="outgoing" text="Yes, every plan exports to Excel and CSV." time="10:43" status="read" />
      <ChatMessage author={sofia} text="Great." grouped />
      <ChatMessage author={sofia} text="And can I schedule the export every Monday at 8:00 so the finance team gets it before the weekly meeting? We used to do that by hand." time="10:44" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const msgs = [...canvasElement.querySelectorAll('[data-slot="chat-message"]')];
    await expect(Math.round(box(msgs[0]!).height)).toBe(56);
    await expect(msgs[0]).toHaveTextContent('Sofia Bran: Hi!');
    await expect(msgs[1]).toHaveTextContent('You: Yes');
    await expect(msgs[1]).toHaveTextContent('10:43Read');
    const out = msgs[1]!.querySelector('[data-slot="chat-bubble"]')!;
    await expect(box(out).right).toBeCloseTo(box(msgs[1]!).right, 0);
    await expect(msgs[2]!.querySelector('time')).toBeNull();
    const long = msgs[3]!.querySelector('[data-slot="chat-bubble"]')!;
    await expect(Math.round(box(long).width)).toBe(440);
  },
};

// Figma Size=compact: 400 panel, bubble up to 276; 276 column still fits.
export const Compact: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex w-[400px] flex-col gap-3">
        <ChatMessage size="compact" author={sofia} text="Hi! Is the export to Excel included in the Team plan?" time="10:42" />
        <ChatMessage size="compact" direction="outgoing" text="Hi! Is the export to Excel included in the Team plan?" time="10:42" status="read" />
      </div>
      <div className="w-[276px]"><ChatMessage size="compact" direction="outgoing" text="Yes." time="10:43" status="delivered" /></div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const bubbles = canvasElement.querySelectorAll('[data-slot="chat-bubble"]');
    await expect(Math.round(box(bubbles[1]!).width)).toBe(276);
    await expect(Math.round(box(canvasElement.querySelectorAll('[data-slot="chat-message"]')[1]!).height)).toBe(76);
  },
};

const onSend = fn();

function Conversation() {
  const [msgs, setMsgs] = React.useState<string[]>([]);
  return (
    <div className="flex w-[640px] flex-col gap-4">
      {msgs.map((m, i) => <ChatMessage key={i} direction="outgoing" text={m} time="now" status="sent" />)}
      <TypingIndicator names={['Sofia']} />
      <ChatComposer label="Message Sofia Bran" onAttach={fn()} onSend={t => { onSend(t); setMsgs(x => [...x, t]); }} />
    </div>
  );
}

// Figma: composer 640 × 36 with attach and Send; typing indicator.
export const Composer: Story = {
  name: 'Chat Composer and Typing Indicator',
  render: () => <Conversation />,
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole('status')).toHaveTextContent('Sofia is typing…');
    const box1 = canvas.getByRole('textbox', { name: 'Message Sofia Bran' });
    await expect(Math.round(box(box1).height)).toBe(36);
    const send = canvas.getByRole('button', { name: 'Send' });
    await expect(send).toBeDisabled();
    await userEvent.type(box1, 'Line one{Shift>}{Enter}{/Shift}Line two');
    await expect(box1).toHaveValue('Line one\nLine two');
    await expect(box(box1).height).toBeGreaterThan(36);
    await userEvent.keyboard('{Enter}');
    await expect(onSend).toHaveBeenCalledWith('Line one\nLine two');
    await expect(box1).toHaveValue('');
    await expect(canvasElement.querySelector('[data-slot="chat-message"]')).toHaveTextContent('Line one');
    await expect(canvas.getByRole('button', { name: 'Attach file' })).toBeInTheDocument();
  },
};

const start: ReactionData[] = [
  { emoji: '👍', name: 'thumbs up', count: 4, reacted: true },
  { emoji: '🎉', name: 'party popper', count: 2 },
  { emoji: '👀', name: 'eyes', count: 1 },
];

function Reactions() {
  const [list, setList] = React.useState(start);
  return <ReactionBar reactions={list} onReact={(e, n) => setList(l => toggleReaction(l, e, n))} />;
}

// Figma: mention chips, reaction bar (28 high pills, reacted pressed), thread summary.
export const Social: Story = {
  name: 'Mentions, Reactions, Thread Summary',
  render: () => (
    <div className="flex flex-col gap-6">
      <p className="m-0 text-sm leading-6">Can <MentionChip name="Maria Ilie" /> check the totals before <MentionChip name="you" you /> send it?</p>
      <Reactions />
      <ThreadSummary repliers={[{ name: 'Ana Popescu' }, { name: 'Mihai Ionescu' }, { name: 'Ioana Rusu' }, { name: 'A' }, { name: 'B' }, { name: 'C' }]} replies={3} last="Last reply 2 h ago" unread onClick={fn()} />
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    await expect(canvasElement.querySelector('[data-you]')).toHaveTextContent('@you');
    const thumbs = canvas.getByRole('button', { name: /thumbs up/ });
    await expect(thumbs).toHaveAttribute('aria-pressed', 'true');
    await expect(Math.round(box(thumbs).height)).toBe(28);
    await userEvent.click(thumbs);
    await expect(thumbs).toHaveAttribute('aria-pressed', 'false');
    await expect(thumbs).toHaveTextContent('3');
    await userEvent.click(canvas.getByRole('button', { name: /eyes/ }));
    await expect(canvas.getByRole('button', { name: /eyes/ })).toHaveTextContent('2');
    await userEvent.click(canvas.getByRole('button', { name: 'Add reaction' }));
    await expect(await within(document.body).findByRole('dialog')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    const thread = canvas.getByRole('button', { name: /3 replies/ });
    await expect(thread).toHaveTextContent('+3');
    await expect(thread).toHaveAccessibleName(/unread/);
  },
};

// Figma: 360 × 66; default, hover, selected (aria-current); pinned, muted (dot), unread count.
export const Conversations: Story = {
  name: 'Conversation Item',
  render: () => (
    <div role="list" aria-label="Conversations" className="flex w-[360px] flex-col gap-1">
      <div role="listitem"><ConversationItem person={{ name: 'Ana Popescu' }} status="online" message="Sure, I will send the updated invoice today." time="10:42" unread={3} selected /></div>
      <div role="listitem"><ConversationItem person={{ name: 'Finance team' }} message="You: Approved, thanks!" time="Yesterday" pinned /></div>
      <div role="listitem"><ConversationItem person={{ name: 'Mihai Ionescu' }} message="The reminder went out this morning." time="Mon" unread={5} muted /></div>
    </div>
  ),
  play: async ({ canvas }) => {
    const ana = canvas.getByRole('button', { name: /Ana Popescu/ });
    await expect(Math.round(box(ana).width)).toBe(360);
    await expect(Math.round(box(ana).height)).toBe(66);
    await expect(ana).toHaveAttribute('aria-current', 'true');
    await expect(ana).toHaveAccessibleName(/3 unread/);
    await expect(canvas.getByRole('button', { name: /Finance team.*pinned/ })).toBeInTheDocument();
    const mihai = canvas.getByRole('button', { name: /Mihai Ionescu.*muted/ });
    await expect(mihai).not.toHaveTextContent('5');
    await expect(mihai).toHaveAccessibleName(/Unread/);
  },
};

// Long names and messages, two and three people typing. Tests only.
export const EdgeCases: Story = {
  tags: ['!dev'],
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="w-[240px]"><ConversationItem className="w-full" person={{ name: 'Alexandra-Maria Constantinescu-Popovici' }} message="A very long last message that has to be cut on one line" time="12 Oct 2026" unread={120} /></div>
      <TypingIndicator names={['Sofia', 'Ana']} />
      <TypingIndicator names={['Sofia', 'Ana', 'Mihai']} />
      <div className="w-[640px]"><ChatMessage author={sofia} text="https://acme.example/invoices/INV-2026-000184/attachments/very-long-file-name-without-spaces.pdf" time="10:45" /></div>
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByText('Sofia and Ana are typing…')).toBeInTheDocument();
    await expect(canvas.getByText('Several people are typing…')).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: /Alexandra/ })).toHaveTextContent('99+');
    const bubble = canvasElement.querySelector('[data-slot="chat-bubble"]')!;
    await expect(box(bubble).width).toBeLessThanOrEqual(440);
  },
};

const All = () => (
  <div className="flex gap-10">
    <div className="flex w-[640px] flex-col gap-4">
      <ChatMessage author={sofia} text="Hi! Is the export to Excel included in the Team plan?" time="10:42" />
      <ChatMessage direction="outgoing" text="Yes, every plan exports to Excel." time="10:43" status="read" />
      <TypingIndicator names={['Sofia']} />
      <ChatComposer />
      <Reactions />
      <p className="m-0 text-sm">Ask <MentionChip name="Maria Ilie" /> or <MentionChip name="you" you /></p>
    </div>
    <div className="flex w-[360px] flex-col gap-1">
      <ConversationItem person={{ name: 'Ana Popescu' }} message="Sure, I will send it." time="10:42" unread={3} selected />
      <ConversationItem person={{ name: 'Mihai Ionescu' }} message="Thanks" time="Mon" muted unread={2} />
    </div>
  </div>
);
export const AllDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' }, render: () => <All /> };
export const AllCorporate: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' }, render: () => <All /> };
