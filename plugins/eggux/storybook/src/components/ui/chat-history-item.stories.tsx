import type * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';
import { ChatHistoryItem } from './chat-history-item';

const meta = {
  title: 'AI Chat/Chat History Item',
  component: ChatHistoryItem,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'One conversation in the history list: title from the first request (one line), relative time, pin. The row is a link; the options menu (rename, pin, share, delete) shows on hover and keyboard focus. Figma: AI Chat / Chat History Item. Guide: eggux build-ui/components/ai-chat.md' } },
  },
  // The link does not navigate in Storybook: the handler prevents it, like client-side routing.
  args: { onOpen: fn((e: React.MouseEvent<HTMLAnchorElement>) => e.preventDefault()), onRename: fn(), onPinnedChange: fn(), onShare: fn(), onDelete: fn() },
  decorators: [Story => <div className="w-64"><Story /></div>],
} satisfies Meta<typeof ChatHistoryItem>;
export default meta;
type Story = StoryObj<typeof meta>;

const row = (el: HTMLElement) => el.querySelector('[data-slot="chat-history-item"]') as HTMLElement;

// Figma State=default: 256 × 50; the link opens the conversation, the menu deletes it.
export const Default: Story = {
  play: async ({ canvas, canvasElement, args }) => {
    const item = row(canvasElement);
    await expect(Math.round(item.getBoundingClientRect().height)).toBe(50);
    await expect(Math.round(item.getBoundingClientRect().width)).toBe(256);
    const link = canvas.getByRole('link', { name: /Overdue invoices for Northwind/ });
    await expect(link).not.toHaveAttribute('aria-current');
    await userEvent.click(link);
    await expect(args.onOpen).toHaveBeenCalledTimes(1);

    await userEvent.click(canvas.getByRole('button', { name: 'Options for Overdue invoices for Northwind' }));
    const menu = await screen.findByRole('menu');
    await expect(within(menu).getAllByRole('menuitem').map(i => i.textContent)).toEqual(['Rename', 'Pin', 'Share', 'Delete']);
    await userEvent.click(within(menu).getByRole('menuitem', { name: 'Delete' }));
    await expect(args.onDelete).toHaveBeenCalledTimes(1);
  },
};

// Keyboard: Tab reaches the link, then the menu button (shown on focus). Enter opens the menu,
// arrows move, Escape closes and focus returns to the menu button.
export const Keyboard: Story = {
  play: async ({ canvas, args }) => {
    const button = canvas.getByRole('button', { name: 'Options for Overdue invoices for Northwind' });
    await expect(getComputedStyle(button).opacity).toBe('0');
    await userEvent.tab();
    await expect(canvas.getByRole('link')).toHaveFocus();
    await userEvent.tab();
    await expect(button).toHaveFocus();
    await waitFor(() => expect(getComputedStyle(button).opacity).toBe('1'));
    await userEvent.keyboard('{Enter}');
    const menu = await screen.findByRole('menu');
    await waitFor(() => expect(within(menu).getByRole('menuitem', { name: 'Rename' })).toHaveFocus());
    await userEvent.keyboard('{ArrowDown}');
    await expect(within(menu).getByRole('menuitem', { name: 'Pin' })).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
    await expect(button).toHaveFocus();

    await userEvent.keyboard('{ArrowDown}');
    await screen.findByRole('menu');
    await userEvent.keyboard('{ArrowDown}{Enter}');
    await expect(args.onPinnedChange).toHaveBeenCalledWith(true);
  },
};

// Figma State=hover: accent fill, menu button visible, title truncates before it.
export const Hover: Story = {
  args: { state: 'hover' },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: /^Options for/ });
    await expect(getComputedStyle(button).opacity).toBe('1');
    await expect(Math.round(button.getBoundingClientRect().height)).toBe(36);
  },
};

// Figma State=active: the open conversation, aria-current="page", menu button visible.
export const Active: Story = {
  args: { state: 'active' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link')).toHaveAttribute('aria-current', 'page');
    await expect(getComputedStyle(canvas.getByRole('button', { name: /^Options for/ })).opacity).toBe('1');
  },
};

// Figma Pinned: pin icon after the text; the menu offers Unpin.
export const Pinned: Story = {
  args: { pinned: true },
  play: async ({ canvas, canvasElement, args }) => {
    await expect(canvas.getByRole('link')).toHaveAccessibleName(/pinned/);
    await expect(canvasElement.querySelector('svg[data-icon="pin"]')).not.toBeNull();
    await userEvent.click(canvas.getByRole('button', { name: /^Options for/ }));
    await userEvent.click(await screen.findByRole('menuitem', { name: 'Unpin' }));
    await expect(args.onPinnedChange).toHaveBeenCalledWith(false);
  },
};

// Figma Show time off: one line, 32 high.
export const WithoutTime: Story = {
  args: { showTime: false },
  play: async ({ canvasElement }) => {
    await expect(Math.round(row(canvasElement).getBoundingClientRect().height)).toBe(32);
  },
};

// A history list: grouped by date, pinned first, the open one active.
export const List: Story = {
  render: args => (
    <nav aria-label="Chat history" className="flex flex-col gap-1">
      <p className="px-2 pt-2 text-xs font-medium text-muted-foreground">Pinned</p>
      <ChatHistoryItem {...args} title="Q3 cash flow for Acme" time="Oct 2" pinned />
      <p className="px-2 pt-2 text-xs font-medium text-muted-foreground">Today</p>
      <ChatHistoryItem {...args} title="Overdue invoices for Northwind" time="2 h ago" state="active" />
      <ChatHistoryItem {...args} title="Reminder email for INV-1024" time="5 h ago" />
      <p className="px-2 pt-2 text-xs font-medium text-muted-foreground">Previous 7 days</p>
      <ChatHistoryItem {...args} title="Compare supplier prices in EUR" time="3 days ago" />
    </nav>
  ),
  play: async ({ canvas }) => {
    const nav = canvas.getByRole('navigation', { name: 'Chat history' });
    await expect(within(nav).getAllByRole('link')).toHaveLength(4);
    await expect(within(nav).getByRole('link', { current: 'page' })).toHaveAccessibleName(/Overdue invoices for Northwind/);
  },
};

const longTitle = 'Compare the payment behaviour of all European subsidiaries of Northwind Traders over the last eight quarters';
const longTime = '2 h ago with a much longer label than planned';

// Stress test: long title and time truncate to one line each; full title in the tooltip.
export const LongText: Story = { tags: ['!dev'],
  args: { title: longTitle, time: longTime, pinned: true, state: 'hover' },
  play: async ({ canvas, canvasElement }) => {
    const item = row(canvasElement);
    await expect(Math.round(item.getBoundingClientRect().height)).toBe(50);
    await expect(item.scrollWidth).toBeLessThanOrEqual(item.clientWidth);
    const link = canvas.getByRole('link');
    await expect(link).toHaveAttribute('title', longTitle);
    const title = link.firstElementChild as HTMLElement;
    await expect(title.scrollWidth).toBeGreaterThan(title.clientWidth);
  },
};

// Narrow (128, the smallest width the item supports) and the 276 / 368 px columns.
export const Columns: Story = { tags: ['!dev'],
  args: { title: longTitle, time: longTime },
  decorators: [Story => <div className="w-auto"><Story /></div>],
  render: args => (
    <div className="flex flex-col gap-4">
      {[128, 276, 368].map(w => (
        <div key={w} style={{ width: w }} data-width={w}>
          <ChatHistoryItem {...args} pinned />
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const box of canvasElement.querySelectorAll<HTMLElement>('[data-width]')) {
      const item = row(box);
      await expect(Math.round(item.getBoundingClientRect().width)).toBe(Number(box.dataset.width));
      await expect(Math.round(item.getBoundingClientRect().height)).toBe(50);
      await expect(item.scrollWidth).toBeLessThanOrEqual(item.clientWidth);
    }
  },
};

export const ListDark: Story = { ...List, tags: ['!dev'], globals: { theme: 'Dark' } };
export const ListCorporate: Story = { ...List, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
