import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { Button } from './button';
import { SnackbarStack, useSnackbarQueue, type SnackbarItem } from './snackbar';

type Args = { message: string; showAction: boolean; actionLabel: string; showClose: boolean; duration: number; count: number };

const messages = ['INV-2040 archived.', 'Reminder sent to Northwind Traders.', 'Draft saved.'];

/** A phone-sized frame: the stack sits in the flow at the bottom instead of fixed to the window. */
const Frame = ({ width = 390, children }: { width?: number; children: React.ReactNode }) => (
  <div style={{ width }} className="flex h-[420px] max-w-full flex-col overflow-hidden rounded-lg border border-border bg-muted/40">
    {children}
  </div>
);

type DemoProps = { initial: Omit<SnackbarItem, 'id'>[]; duration: number; onAction?: () => void; action?: string; close?: boolean; width?: number };

/** Controlled example: the button adds a snackbar, the stack removes it when it is dismissed. */
function Demo({ initial, duration, onAction, action, close, width }: DemoProps) {
  const { items, show, dismiss } = useSnackbarQueue();
  const seeded = React.useRef(false);
  React.useEffect(() => {
    if (seeded.current) return;
    seeded.current = true;
    initial.forEach(i => show(i));
  }, [initial, show]);
  const n = React.useRef(initial.length);
  return (
    <Frame width={width}>
      <div className="flex min-h-0 flex-1 items-start p-4">
        <Button
          variant="outline"
          onClick={() => {
            const k = n.current++;
            show({ message: `${messages[k % messages.length]}`, duration, close, action: action ? { label: action, onClick: onAction } : undefined });
          }}
        >
          Show snackbar
        </Button>
      </div>
      <SnackbarStack items={items} onDismiss={dismiss} fixed={false} />
    </Frame>
  );
}

const meta = {
  title: 'Components/Mobile/Snackbar',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A short message at the bottom of a phone screen, with at most one action (Undo). The mobile variant of Toast: the same inverted Toast with close and action, anchored to the bottom, full width, safe area below, up to 3 stacked (newest last). Goes away by itself; the timer pauses while the pointer is over it or focus is inside it, so Undo never vanishes under a finger or while focused. Escape or the close button dismisses; F8 moves focus into the stack. Polite live region. Not the only place for important information. Code only (no Figma component yet). Guide: eggux build-ui/patterns/mobile.md',
      },
    },
  },
  args: { message: 'INV-2040 archived.', showAction: true, actionLabel: 'Undo', showClose: true, duration: 0, count: 1 },
  argTypes: {
    message: { name: 'Message', control: 'text', description: 'One short line that names what happened.', table: { category: 'Snackbar' } },
    duration: { name: 'Duration (ms)', control: { type: 'range', min: 0, max: 10000, step: 500 }, description: '0 keeps it until dismissed; otherwise it goes away after this time.', table: { category: 'Snackbar' } },
    count: { name: 'Snackbars shown', control: { type: 'range', min: 1, max: 4, step: 1 }, description: 'How many start in the stack (the stack holds 3).', table: { category: 'Snackbar' } },
    showAction: { name: 'Show action', control: 'boolean', description: 'One verb button, for example Undo.', table: { category: 'Parts' } },
    actionLabel: { name: 'Action label', control: 'text', description: 'The verb on the action.', table: { category: 'Parts' } },
    showClose: { name: 'Show close', control: 'boolean', description: 'The close button.', table: { category: 'Parts' } },
  },
  render: ({ message, showAction, actionLabel, showClose, duration, count }) => (
    <Demo
      key={[message, showAction, actionLabel, showClose, duration, count].join('|')}
      duration={duration || Infinity}
      action={showAction ? actionLabel : undefined}
      close={showClose}
      initial={Array.from({ length: count }, (_, i) => ({
        message: i === count - 1 ? message : messages[i % messages.length],
        duration: duration || Infinity,
        close: showClose,
        action: showAction ? { label: actionLabel } : undefined,
      }))}
    />
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Three at once: the newest sits at the bottom; a fourth would push the oldest out. */
export const Stack: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Demo
      duration={Infinity}
      initial={messages.map((m, i) => ({ message: m, duration: Infinity, action: i === 0 ? { label: 'Undo' } : undefined }))}
    />
  ),
};

const undoSpy = fn();
const items = (canvasElement: HTMLElement) => Array.from(canvasElement.querySelectorAll<HTMLElement>('[data-slot="snackbar"]'));
const ready = (canvasElement: HTMLElement) => waitFor(() => expect(items(canvasElement).length).toBeGreaterThan(0), { timeout: 3000 });

export const DefaultCheck: Story = {
  tags: ['!dev'],
  play: async ({ canvas, canvasElement }) => {
    await ready(canvasElement);
    const bar = items(canvasElement)[0];
    await expect(bar).toHaveTextContent('INV-2040 archived.');
    // Polite live region: Radix announces through a status element, never assertive.
    await expect(bar).toHaveAttribute('data-style', 'inverted');
    await expect(canvas.getByRole('region', { name: /Notifications/ })).toBeInTheDocument();
    // Full width of the frame minus the 16 px sides.
    const frame = bar.closest('div[style]') as HTMLElement;
    await expect(Math.round(frame.getBoundingClientRect().width - bar.getBoundingClientRect().width)).toBe(32);
    await expect(canvas.getByRole('button', { name: 'Undo' })).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Dismiss' })).toBeVisible();
    // The close button dismisses.
    await userEvent.click(canvas.getByRole('button', { name: 'Dismiss' }));
    await waitFor(() => expect(items(canvasElement)).toHaveLength(0));
    // Another one, then Escape dismisses it.
    await userEvent.click(canvas.getByRole('button', { name: 'Show snackbar' }));
    await waitFor(() => expect(items(canvasElement)).toHaveLength(1));
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(items(canvasElement)).toHaveLength(0));
  },
};

// The timer runs out on its own. Pausing on hover is Radix behavior and depends on window focus, which
// a fresh review page (Chromatic) does not have yet, so the pause is checked only with the keyboard
// (KeyboardCheck: it outlives its duration while focused).
export const TimerCheck: Story = {
  tags: ['!dev'],
  args: { duration: 800 },
  play: async ({ canvasElement }) => {
    await ready(canvasElement);
    await waitFor(() => expect(items(canvasElement)).toHaveLength(0), { timeout: 4000 });
  },
};

export const KeyboardCheck: Story = {
  tags: ['!dev'],
  render: () => <Demo duration={900} initial={[{ message: 'INV-2040 archived.', duration: 900, action: { label: 'Undo', onClick: undoSpy } }]} />,
  play: async ({ canvas, canvasElement }) => {
    await ready(canvasElement);
    // F8 moves focus into the notifications; Tab reaches the action.
    await userEvent.keyboard('{F8}');
    for (let i = 0; i < 6; i++) {
      if (document.activeElement === canvas.getByRole('button', { name: 'Undo' })) break;
      await userEvent.tab();
    }
    const undo = canvas.getByRole('button', { name: 'Undo' });
    await waitFor(() => expect(undo).toHaveFocus());
    // Focus pauses the timer: the snackbar outlives its 900 ms.
    await new Promise(r => setTimeout(r, 1500));
    await expect(items(canvasElement)).toHaveLength(1);
    // Enter runs the action and the snackbar closes.
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(items(canvasElement)).toHaveLength(0));
    await expect(undoSpy).toHaveBeenCalledTimes(1);
  },
};

export const StackCheck: Story = {
  tags: ['!dev'],
  args: { count: 4 },
  play: async ({ canvasElement }) => {
    await ready(canvasElement);
    // Four were added; the stack holds the newest three, the newest last.
    await waitFor(() => expect(items(canvasElement)).toHaveLength(3));
    await expect(items(canvasElement)[2]).toHaveTextContent('INV-2040 archived.');
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  render: () => (
    <Demo
      width={276}
      duration={Infinity}
      initial={[
        { message: 'The invoice for Fieldstone Bakery and Sons International Limited was archived together with its 14 attachments.', duration: Infinity, action: { label: 'Undo' } },
        { message: 'Supercalifragilisticexpialidocious_customer_reference_number_2041', duration: Infinity },
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    await ready(canvasElement);
    await waitFor(() => expect(items(canvasElement)).toHaveLength(2));
    const frame = canvasElement.querySelector('div[style]') as HTMLElement;
    for (const bar of items(canvasElement)) {
      // The text wraps; nothing is wider than the 276 px frame.
      await expect(bar.getBoundingClientRect().width).toBeLessThanOrEqual(frame.clientWidth);
      await expect(bar.scrollWidth).toBeLessThanOrEqual(bar.clientWidth + 1);
    }
  },
};

export const DefaultDark: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
