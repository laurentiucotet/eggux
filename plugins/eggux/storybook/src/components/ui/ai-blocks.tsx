// EGG UI AI blocks. Figma: BLOCKS / AI (page 158:2): Block / AI Chat Empty, AI Conversation,
// AI Assistant Panel, Inline AI, AI Document Review, AI Search Answer, Agent Task Run, AI Generate,
// AI Settings. Built only from the AI Chat components and the library. Sending a prompt appends
// the user message at once, then a canned answer that "thinks" for a moment and streams word by
// word (no network): Send becomes Stop while it streams, Stop keeps what was written, Regenerate
// writes the answer again. Guide: eggux build-ui/patterns/ai-chat.md
import * as React from 'react';
import { ChevronDown, FileText, Globe, Sparkles, SquarePen, X } from '@/components/icons';
import { cn } from '@/lib/utils';
import { AssistantMessage, type AssistantMessageState } from './assistant-message';
import { Badge } from './badge';
import { Button } from './button';
import { ButtonIcon } from './button-icon';
import { IconTile } from './icon-tile';
import { PromptInput } from './prompt-input';
import { PromptSuggestion } from './prompt-suggestion';
import { Reasoning } from './reasoning';
import { Separator } from './separator';
import { Citation, SourceItem, Sources } from './sources';
import { ToolCall } from './tool-call';
import { UserMessage } from './user-message';

/* ------------------------------------------------------------------------------------------ */
/* Fake chat engine shared by the chat blocks                                                    */
/* ------------------------------------------------------------------------------------------ */

export interface ChatTurn {
  id: string;
  role: 'user' | 'assistant';
  /** Plain text of the turn (the streamed answer for a canned reply). */
  text?: string;
  /** Rich content for seeded turns; wins over text. */
  content?: React.ReactNode;
  /** Extra content under an assistant answer (tool calls, follow-ups). */
  after?: React.ReactNode;
  state?: AssistantMessageState | 'thinking';
  feedback?: 'good' | 'bad';
}

export interface FakeChatOptions {
  initial?: ChatTurn[];
  /** The canned answer for a prompt. */
  reply?: (prompt: string) => string;
  /** How long the assistant "thinks" before the first word, in ms. */
  thinkDelay?: number;
  /** Delay between streamed words, in ms. */
  wordDelay?: number;
}

const defaultReply = (prompt: string) =>
  `Here is what I found for "${prompt.trim()}". Acme has 3 open invoices, €4,820 in total, and the oldest one, INV-1024, is 12 days overdue. Want me to draft a reminder?`;

let turnSeq = 0;
const nextId = () => `t${Date.now().toString(36)}${(turnSeq += 1)}`;

/** Local, network-free chat state: send, stop, regenerate and feedback. */
function useFakeChat({ initial = [], reply = defaultReply, thinkDelay = 600, wordDelay = 40 }: FakeChatOptions = {}) {
  const [turns, setTurns] = React.useState<ChatTurn[]>(initial);
  const timers = React.useRef<number[]>([]);
  const clear = () => {
    timers.current.forEach(t => window.clearTimeout(t));
    timers.current = [];
  };
  React.useEffect(() => clear, []);

  const patch = (id: string, next: Partial<ChatTurn>) => setTurns(ts => ts.map(t => (t.id === id ? { ...t, ...next } : t)));

  const stream = (id: string, answer: string) => {
    clear();
    patch(id, { text: '', content: undefined, after: undefined, state: 'thinking', feedback: undefined });
    const words = answer.split(' ');
    const start = window.setTimeout(() => {
      let i = 0;
      const tick = () => {
        i += 1;
        const done = i >= words.length;
        patch(id, { text: words.slice(0, i).join(' '), state: done ? 'default' : 'streaming' });
        if (!done) timers.current.push(window.setTimeout(tick, wordDelay));
      };
      tick();
    }, thinkDelay);
    timers.current.push(start);
  };

  const prompts = React.useRef(new Map<string, string>());
  const streaming = turns.some(t => t.state === 'streaming' || t.state === 'thinking');

  const send = (prompt: string) => {
    const text = prompt.trim();
    if (!text || streaming) return;
    const userId = nextId();
    const id = nextId();
    prompts.current.set(id, text);
    setTurns(ts => [...ts, { id: userId, role: 'user', text }, { id, role: 'assistant', text: '', state: 'thinking' }]);
    stream(id, reply(text));
  };

  const stop = () => {
    clear();
    setTurns(ts => ts.map(t => (t.state === 'streaming' || t.state === 'thinking' ? { ...t, state: 'stopped' } : t)));
  };

  const regenerate = (id: string) => {
    if (streaming) return;
    const turn = turns.find(t => t.id === id);
    const index = turns.findIndex(t => t.id === id);
    const before = [...turns.slice(0, index)].reverse().find(t => t.role === 'user');
    const prompt = prompts.current.get(id) ?? before?.text ?? '';
    if (!turn) return;
    stream(id, reply(prompt));
  };

  const feedback = (id: string, value: 'good' | 'bad') => patch(id, { feedback: value });

  return { turns, setTurns, streaming, send, stop, regenerate, feedback };
}

type FakeChat = ReturnType<typeof useFakeChat>;

/** The turns of a conversation in a log region; the assistant turns get copy, regenerate and feedback. */
function ChatLog({ chat, className, label = 'Conversation' }: { chat: FakeChat; className?: string; label?: string }) {
  return (
    <div role="log" aria-label={label} data-slot="ai-chat-log" className={cn('flex w-full flex-col gap-8', className)}>
      {chat.turns.map(t =>
        t.role === 'user' ? (
          <UserMessage key={t.id}>{t.content ?? t.text}</UserMessage>
        ) : (
          <React.Fragment key={t.id}>
            <AssistantMessage
              state={t.state === 'thinking' ? 'streaming' : t.state}
              feedback={t.feedback}
              onCopy={() => void navigator.clipboard?.writeText(t.text ?? '').catch(() => {})}
              onRegenerate={() => chat.regenerate(t.id)}
              onFeedback={v => chat.feedback(t.id, v)}
            >
              {t.content ??
                (t.state === 'thinking' ? (
                  <Reasoning state="running" status="Thinking…" />
                ) : t.state === 'stopped' && !t.text ? (
                  <p className="text-muted-foreground">No answer yet.</p>
                ) : (
                  <p>{t.text}</p>
                ))}
            </AssistantMessage>
            {t.after}
          </React.Fragment>
        ),
      )}
    </div>
  );
}

const disclaimerClass = 'text-center text-xs text-muted-foreground';

/** Search and the Auto model in the Prompt Input Tools slot (Figma). */
function ChatTools() {
  return (
    <>
      <Button variant="ghost" size="sm" leadingIcon={<Globe aria-hidden="true" />}>Search</Button>
      <Button variant="ghost" size="sm" trailingIcon={<ChevronDown aria-hidden="true" />} aria-label="Model: Auto">Auto</Button>
    </>
  );
}

/* ------------------------------------------------------------------------------------------ */
/* Block / AI Chat Empty                                                                         */
/* ------------------------------------------------------------------------------------------ */

export interface AIChatEmptyProps extends Omit<React.ComponentProps<'section'>, 'title'>, FakeChatOptions {
  title?: string;
  description?: string;
  placeholder?: string;
  /** 3-4 starter prompts from real tasks. */
  suggestions?: string[];
  disclaimer?: string;
  /** Called with each prompt sent (the block also answers it locally). */
  onSend?: (prompt: string) => void;
}

/** Full chat page before the first message: what the assistant can do, starter prompts, the input. Sending turns it into the conversation. */
function AIChatEmpty({
  title = 'How can I help today?',
  description = 'Ask about your projects, customers and invoices.',
  placeholder = 'Ask anything…',
  suggestions = ['Summarize open invoices', 'Which projects are behind?', 'Draft a follow-up email', 'Compare this month to last'],
  disclaimer = 'Acme Assistant can make mistakes. Check important information.',
  onSend,
  initial,
  reply,
  thinkDelay,
  wordDelay,
  className,
  ...props
}: AIChatEmptyProps) {
  const chat = useFakeChat({ initial, reply, thinkDelay, wordDelay });
  const headingId = React.useId();
  const [draft, setDraft] = React.useState('');
  const send = (prompt: string) => {
    onSend?.(prompt);
    chat.send(prompt);
    setDraft('');
  };
  const empty = chat.turns.length === 0;

  return (
    <section
      data-slot="ai-chat-empty"
      aria-labelledby={headingId}
      className={cn('@container w-full bg-background', className)}
      {...props}
    >
      <div data-slot="ai-chat-empty-body" className="mx-auto flex w-full max-w-[960px] flex-col items-center gap-8 px-4 py-12 @min-[640px]:px-24 @min-[640px]:py-24">
        {empty ? (
          <div data-slot="ai-chat-empty-heading" className="flex flex-col items-center gap-4 text-center">
            <IconTile icon={<Sparkles />} tileStyle="outline" size="lg" className="rounded-xl text-foreground" />
            <h1 id={headingId} className="m-0 text-3xl leading-9 font-semibold tracking-[-0.4px] text-foreground">{title}</h1>
            <p className="m-0 text-base leading-7 text-muted-foreground">{description}</p>
          </div>
        ) : (
          <>
            <h1 id={headingId} className="sr-only">{title}</h1>
            <ChatLog chat={chat} />
          </>
        )}
        <PromptInput
          value={draft}
          onValueChange={setDraft}
          placeholder={placeholder}
          streaming={chat.streaming}
          onSubmit={send}
          onStop={chat.stop}
          onAttach={() => {}}
          tools={<ChatTools />}
        />
        {empty ? (
          <ul aria-label="Suggested prompts" data-slot="ai-chat-suggestions" className="m-0 flex w-full list-none flex-wrap justify-center gap-2 p-0">
            {suggestions.map(s => (
              <li key={s} className="flex max-w-full">
                <PromptSuggestion label={s} onClick={() => setDraft(s)} />
              </li>
            ))}
          </ul>
        ) : null}
        <p className={cn(disclaimerClass, 'm-0')}>{disclaimer}</p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------------------------ */
/* Block / AI Conversation                                                                       */
/* ------------------------------------------------------------------------------------------ */

function FollowUps({ items, onPick }: { items: string[]; onPick: (s: string) => void }) {
  return (
    <ul aria-label="Follow-up prompts" data-slot="ai-follow-ups" className="m-0 flex list-none flex-wrap gap-2 p-0 pl-12">
      {items.map(s => (
        <li key={s} className="flex max-w-full">
          <PromptSuggestion label={s} onClick={() => onPick(s)} />
        </li>
      ))}
    </ul>
  );
}

/** First answer of the Figma conversation: reasoning, a finished tool call, cited facts, a list and sources. */
function InvoicesAnswer() {
  return (
    <>
      <Reasoning state="collapsed" label="Thought for 12 s" />
      <ToolCall status="done" title="Search invoices" description="customer: Acme, status: open">
        <p>Found 3 invoices: INV-1024, INV-1031 and INV-1038.</p>
      </ToolCall>
      <p>
        Acme has 3 open invoices, €4,820 in total. <Citation label="1" source="Invoices list" />
      </p>
      <p>
        The oldest one, INV-1024, is 12 days overdue; payment terms are 30 days. <Citation label="1" source="Invoices list" />{' '}
        <Citation label="2" source="Acme contract" />
      </p>
      <ul className="m-0 flex list-disc flex-col gap-2 pl-5">
        <li>INV-1024: €2,400, due Oct 7</li>
        <li>INV-1031: €1,620, due Oct 15</li>
        <li>INV-1038: €800, due Oct 28</li>
      </ul>
      <p>Want me to draft a reminder for INV-1024?</p>
      <Sources label="3 sources" showList={false}>
        <SourceItem number="1" letter="B" title="Invoices list" domain="billing.acme.com" />
        <SourceItem number="2" letter="D" title="Acme contract" domain="docs.acme.com" />
        <SourceItem number="3" letter="C" title="Acme customer record" domain="crm.acme.com" />
      </Sources>
    </>
  );
}

function ReminderDraft() {
  return (
    <div data-slot="ai-draft" className="flex flex-col gap-1 rounded-lg bg-muted p-3 text-sm leading-5 text-foreground">
      <p className="m-0 font-medium">Subject: Reminder for invoice INV-1024</p>
      <p className="m-0">
        Hi Acme team, a friendly reminder that invoice INV-1024 (€2,400) was due on October 7. You can pay it from the link in the original email. Thank you!
      </p>
    </div>
  );
}

type Approval = 'pending' | 'approved' | 'denied';

/** A Tool Call that waits for approval; Approve confirms what changed, Deny keeps the draft. Owns its state. */
function ApprovalCall({
  message,
  title = 'Send email',
  description = 'to: billing@acme.com',
  done = 'Email sent to billing@acme.com. You can see it in the invoice activity.',
  denied = 'Not sent. Tell me what to change in the draft.',
}: {
  message?: React.ReactNode;
  title?: string;
  description?: string;
  done?: string;
  denied?: string;
}) {
  const [approval, setApproval] = React.useState<Approval>('pending');
  if (approval === 'pending') {
    return <ToolCall status="approval" title={title} description={description} approvalMessage={message} onApprove={() => setApproval('approved')} onDeny={() => setApproval('denied')} />;
  }
  return (
    <div className="flex w-full flex-col gap-2">
      {approval === 'approved' ? <ToolCall status="done" title={title} description={description} /> : null}
      <p role="status" className="m-0 text-sm leading-5 text-muted-foreground">
        {approval === 'approved' ? done : denied}
      </p>
    </div>
  );
}

export interface AIConversationProps extends React.ComponentProps<'section'>, Omit<FakeChatOptions, 'initial'> {
  placeholder?: string;
  disclaimer?: string;
  /** Show the seeded conversation from Figma; off starts from an empty thread. */
  seeded?: boolean;
  onSend?: (prompt: string) => void;
}

/** A full conversation: cited answer with reasoning, tool call and sources, follow-ups, and an action that waits for approval. */
function AIConversation({
  placeholder = 'Reply…',
  disclaimer = 'Acme Assistant can make mistakes. Check important information.',
  seeded = true,
  onSend,
  reply,
  thinkDelay,
  wordDelay,
  className,
  ...props
}: AIConversationProps) {
  const [draft, setDraft] = React.useState('');
  const seed: ChatTurn[] = seeded
    ? [
        { id: 's1', role: 'user', text: 'Which invoices for Acme are still open?' },
        {
          id: 's2',
          role: 'assistant',
          content: <InvoicesAnswer />,
          state: 'default',
          after: <FollowUps items={['Draft the reminder', 'Show paid invoices too']} onPick={setDraft} />,
        },
        { id: 's3', role: 'user', text: 'Draft the reminder and send it to their billing contact.' },
        {
          id: 's4',
          role: 'assistant',
          state: 'default',
          content: (
            <>
              <p>Here is the draft. I will send it after you approve.</p>
              <ReminderDraft />
              <ApprovalCall message="The assistant wants to send the reminder for INV-1024 to billing@acme.com. Review the draft before approving." />
            </>
          ),
        },
      ]
    : [];
  const chat = useFakeChat({ initial: seed, reply, thinkDelay, wordDelay });

  const send = (prompt: string) => {
    onSend?.(prompt);
    chat.send(prompt);
    setDraft('');
  };

  return (
    <section data-slot="ai-conversation" aria-label="Chat with Acme Assistant" className={cn('flex w-full flex-col items-center gap-10 bg-background px-4 pt-10 pb-6', className)} {...props}>
      <ChatLog chat={chat} className="max-w-[768px]" />
      <div data-slot="ai-composer" className="sticky bottom-0 flex w-full max-w-[768px] flex-col gap-2 bg-background">
        <PromptInput value={draft} onValueChange={setDraft} placeholder={placeholder} streaming={chat.streaming} onSubmit={send} onStop={chat.stop} onAttach={() => {}} tools={<ChatTools />} />
        <p className={cn(disclaimerClass, 'm-0')}>{disclaimer}</p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------------------------ */
/* Block / AI Assistant Panel                                                                    */
/* ------------------------------------------------------------------------------------------ */

export interface AIAssistantPanelProps extends Omit<React.ComponentProps<'aside'>, 'title'>, Omit<FakeChatOptions, 'initial'> {
  title?: string;
  /** The record the assistant uses (Figma context badge); removable. Empty hides it. */
  context?: string;
  placeholder?: string;
  note?: string;
  onClose?: () => void;
  onSend?: (prompt: string) => void;
}

/** Docked assistant on the right (400 wide): help with the record on screen, with its context shown and an approval before acting. */
function AIAssistantPanel({
  title = 'Assistant',
  context: contextProp = 'Invoice INV-1024',
  placeholder = 'Ask about this invoice…',
  note = 'Answers use this invoice and its customer.',
  onClose,
  onSend,
  reply,
  thinkDelay,
  wordDelay,
  className,
  ...props
}: AIAssistantPanelProps) {
  const headingId = React.useId();
  const [context, setContext] = React.useState(contextProp);
  React.useEffect(() => setContext(contextProp), [contextProp]);
  const seed = (): ChatTurn[] => [
    { id: 's1', role: 'user', text: 'Why is this invoice overdue?' },
    {
      id: 's2',
      role: 'assistant',
      state: 'default',
      content: (
        <>
          <p>INV-1024 was due on October 7. Acme opened the email twice but has not paid. Their last 4 invoices were paid on time.</p>
          <p>I can send a polite reminder to billing@acme.com.</p>
        </>
      ),
      after: (
        <ApprovalCall
          title="Send email"
          description="to: billing@acme.com"
          message="The assistant wants to send the reminder for INV-1024 to billing@acme.com. Review the draft before approving."
        />
      ),
    },
  ];
  const chat = useFakeChat({ initial: seed(), reply, thinkDelay, wordDelay });
  const reset = () => {
    chat.stop();
    chat.setTurns([]);
  };
  const fresh = chat.turns.length === 0;

  return (
    <aside
      data-slot="ai-assistant-panel"
      aria-labelledby={headingId}
      className={cn('flex h-[800px] max-h-full w-[400px] max-w-full flex-col border-l border-border bg-background text-foreground', className)}
      {...props}
    >
      <div data-slot="ai-assistant-panel-header" className="flex h-[52px] shrink-0 items-center gap-2 py-2 pr-2 pl-4">
        <Sparkles className="size-4 shrink-0" aria-hidden="true" />
        <h2 id={headingId} className="m-0 min-w-0 flex-1 truncate text-sm leading-5 font-medium">{title}</h2>
        <ButtonIcon variant="ghost" icon={<SquarePen />} label="New chat" onClick={reset} />
        <ButtonIcon variant="ghost" icon={<X />} label="Close assistant" onClick={onClose} />
      </div>
      <Separator spacing="none" />
      <div data-slot="ai-assistant-panel-messages" className="flex min-h-0 flex-1 flex-col items-start gap-6 overflow-y-auto p-4">
        {context ? (
          <Badge variant="outline" className="max-w-64 gap-1">
            <FileText aria-hidden="true" />
            <span className="truncate">{context}</span>
            <button type="button" aria-label={`Remove ${context}`} title={`Remove ${context}`} onClick={() => setContext('')} className="-mr-1 flex size-4 items-center justify-center rounded-sm outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring">
              <X className="size-3" aria-hidden="true" />
            </button>
          </Badge>
        ) : null}
        {fresh ? <p className="m-0 text-sm text-muted-foreground">Ask about {context || 'this page'}: why it is overdue, what to send, what changed.</p> : null}
        <ChatLog chat={chat} className="gap-6" label="Assistant conversation" />
      </div>
      <div data-slot="ai-assistant-panel-composer" className="flex shrink-0 flex-col gap-2 p-4">
        <PromptInput
          placeholder={placeholder}
          showVoice={false}
          streaming={chat.streaming}
          onSubmit={p => {
            onSend?.(p);
            chat.send(p);
          }}
          onStop={chat.stop}
          onAttach={() => {}}
        />
        <p className={cn(disclaimerClass, 'm-0')}>{note}</p>
      </div>
    </aside>
  );
}

export { AIChatEmpty, AIConversation, AIAssistantPanel, useFakeChat, ChatLog };
