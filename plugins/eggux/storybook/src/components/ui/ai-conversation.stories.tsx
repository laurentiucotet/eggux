import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';
import { ChevronDown, Globe } from '@/components/icons';
import { AssistantMessage } from './assistant-message';
import { Button } from './button';
import { PromptInput } from './prompt-input';
import { UserMessage } from './user-message';

// Figma "Example / in ai conversation": the three chat components together, with a fake reply
// that streams word by word so Stop, stopped and the actions can be tried by hand.
type Turn = { id: number; role: 'user' | 'assistant'; text: string; state?: 'default' | 'streaming' | 'stopped' };

const REPLY = 'Acme has 3 open invoices, €4,820 in total. The oldest one, INV-1024, is 12 days overdue. Want me to draft a reminder for INV-1024?';

function Conversation({ wordDelay = 60 }: { wordDelay?: number }) {
  const [turns, setTurns] = React.useState<Turn[]>([
    { id: 1, role: 'user', text: 'Which invoices for Acme are still open?' },
    { id: 2, role: 'assistant', text: REPLY, state: 'default' },
  ]);
  const timer = React.useRef<number | undefined>(undefined);
  const streaming = turns.some(t => t.state === 'streaming');

  React.useEffect(() => () => window.clearInterval(timer.current), []);

  const send = (text: string) => {
    const id = Date.now();
    setTurns(t => [...t, { id, role: 'user', text }, { id: id + 1, role: 'assistant', text: '', state: 'streaming' }]);
    const words = REPLY.split(' ');
    let i = 0;
    timer.current = window.setInterval(() => {
      i += 1;
      setTurns(t => t.map(x => (x.id === id + 1 ? { ...x, text: words.slice(0, i).join(' '), state: i >= words.length ? 'default' : 'streaming' } : x)));
      if (i >= words.length) window.clearInterval(timer.current);
    }, wordDelay);
  };

  const stop = () => {
    window.clearInterval(timer.current);
    setTurns(t => t.map(x => (x.state === 'streaming' ? { ...x, state: 'stopped' } : x)));
  };

  return (
    <div className="flex w-[768px] max-w-full flex-col gap-6">
      <div role="log" aria-label="Conversation" className="flex flex-col gap-6">
        {turns.map(t =>
          t.role === 'user' ? (
            <UserMessage key={t.id} showActions>{t.text}</UserMessage>
          ) : (
            <AssistantMessage key={t.id} state={t.state}>
              <p>{t.text || '…'}</p>
            </AssistantMessage>
          ),
        )}
      </div>
      <PromptInput
        streaming={streaming}
        onSubmit={send}
        onStop={stop}
        onAttach={() => {}}
        tools={
          <>
            <Button variant="ghost" size="sm" leadingIcon={<Globe aria-hidden="true" />}>Search</Button>
            <Button variant="ghost" size="sm" trailingIcon={<ChevronDown aria-hidden="true" />} aria-label="Model: Auto">Auto</Button>
          </>
        }
      />
    </div>
  );
}

const meta = {
  title: 'Blocks/AI Chat/Examples',
  component: Conversation,
  parameters: { layout: 'padded', docs: { description: { component: 'Prompt Input, User Message and Assistant Message in one conversation. Figma: AI Chat / Example / in ai conversation.' } } },
} satisfies Meta<typeof Conversation>;
export default meta;
type Story = StoryObj<typeof meta>;

export const InConversation: Story = {
  args: { wordDelay: 5 },
  play: async ({ canvas }) => {
    const field = canvas.getByRole('textbox', { name: 'Message' });
    await userEvent.type(field, 'Draft the reminder for INV-1024.');
    await userEvent.keyboard('{Enter}');
    await expect(canvas.getByText('Draft the reminder for INV-1024.')).toBeVisible();
    // The reply streams, then the actions come back and Send returns.
    await waitFor(() => expect(canvas.getAllByRole('button', { name: 'Good response' })).toHaveLength(2), { timeout: 3000 });
    await expect(canvas.getByRole('button', { name: 'Send' })).toBeDisabled();
  },
};

export const StopWhileStreaming: Story = {
  args: { wordDelay: 400 },
  play: async ({ canvas }) => {
    await userEvent.type(canvas.getByRole('textbox', { name: 'Message' }), 'Summarize Acme.');
    await userEvent.keyboard('{Enter}');
    await userEvent.click(await canvas.findByRole('button', { name: 'Stop' }));
    await expect(canvas.getByText('You stopped this answer')).toBeVisible();
  },
};
