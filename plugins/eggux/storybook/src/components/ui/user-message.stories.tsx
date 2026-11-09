import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { UserMessage } from './user-message';

const meta = {
  title: 'Components/AI Chat/User Message',
  component: UserMessage,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'A message the user sent: muted bubble on the right, hugs short text up to 576 px. Copy and edit show on hover and focus. Figma: AI Chat / User Message. Guide: eggux build-ui/components/ai-chat.md' } },
  },
  args: { children: 'Which invoices for Acme are still open?', onCopy: fn(), onEdit: fn() },
  decorators: [Story => <div className="w-[768px] max-w-full"><Story /></div>],
} satisfies Meta<typeof UserMessage>;
export default meta;
type Story = StoryObj<typeof meta>;

// Figma default: 768 × 48, bubble on the right, hugs the text.
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('[data-slot="user-message"]') as HTMLElement;
    const bubble = canvasElement.querySelector('[data-slot="user-message-bubble"]') as HTMLElement;
    await expect(Math.round(bubble.getBoundingClientRect().height)).toBe(48);
    await expect(Math.round(bubble.getBoundingClientRect().right)).toBe(Math.round(root.getBoundingClientRect().right));
    await expect(bubble.getBoundingClientRect().width).toBeLessThan(576);
    await expect(bubble).toHaveTextContent('You: Which invoices for Acme are still open?');
  },
};

// Figma Show actions: copy and edit, reachable by keyboard.
export const WithActions: Story = {
  args: { showActions: true },
  play: async ({ canvas, args }) => {
    await userEvent.tab();
    const copy = canvas.getByRole('button', { name: 'Copy' });
    await expect(copy).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onCopy).toHaveBeenCalledTimes(1);
    await userEvent.click(canvas.getByRole('button', { name: 'Edit and resend' }));
    await expect(args.onEdit).toHaveBeenCalledTimes(1);
  },
};

// Stress test: a long message wraps at 576 px and is shown as sent.
export const LongText: Story = { tags: ['!dev'],
  args: { children: 'Find every invoice for Acme Industrial Supplies GmbH that is still open, group them by the account manager, and draft one reminder email per manager with the total amount in EUR and the oldest due date first.' },
  play: async ({ canvasElement }) => {
    const bubble = canvasElement.querySelector('[data-slot="user-message-bubble"]') as HTMLElement;
    await expect(Math.round(bubble.getBoundingClientRect().width)).toBe(576);
    await expect(bubble.getBoundingClientRect().height).toBeGreaterThan(48);
  },
};

// Narrow panel (368 px): the bubble fills the width.
export const NarrowPanel: Story = { tags: ['!dev'],
  args: { ...LongText.args, fill: true },
  decorators: [Story => <div className="w-[368px]"><Story /></div>],
  play: async ({ canvasElement }) => {
    const bubble = canvasElement.querySelector('[data-slot="user-message-bubble"]') as HTMLElement;
    await expect(Math.round(bubble.getBoundingClientRect().width)).toBe(368);
  },
};

export const WithActionsDark: Story = { ...WithActions, tags: ['!dev'], globals: { theme: 'Dark' } };
