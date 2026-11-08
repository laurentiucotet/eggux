import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { Alert, type AlertStyle, type AlertVariant } from './alert';
import { Button } from './button';

const meta = {
  title: 'Components/Alert/Alert',
  component: Alert,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Persistent message about a page or section. Layout inline (card above the content) or banner (full width, top of a page or panel); Style default, soft or accent, one per product. Destructive uses role="alert", the others role="status". Dismiss only when no action is needed. Figma: Alert page / Alert. Guide: eggux build-ui/components/alert.md' } },
  },
  args: { title: 'Heads up', description: 'You can add team members from the Settings page.' },
  decorators: [Story => <div className="w-[480px] max-w-full"><Story /></div>],
} satisfies Meta<typeof Alert>;
export default meta;
type Story = StoryObj<typeof meta>;

const height = (el: HTMLElement) => Math.round(el.getBoundingClientRect().height);

const content: Record<AlertVariant, { title: string; description: string }> = {
  default: { title: 'Heads up', description: 'You can add team members from the Settings page.' },
  destructive: { title: 'Sync failed', description: 'Check the connection and try again.' },
  success: { title: 'Workspace upgraded', description: 'Your team now has all Business features.' },
  warning: { title: 'Trial ends in 3 days', description: 'Add a payment method to keep your invoices.' },
  info: { title: 'Read-only access', description: 'Ask an admin to make you an editor.' },
};
const variants = Object.keys(content) as AlertVariant[];

// Figma Variant=default, Layout=inline, Style=default: 480 x 68.
export const Default: Story = {
  play: async ({ canvas }) => {
    const alert = canvas.getByRole('status');
    await expect(alert).toHaveTextContent('Heads up');
    await expect(alert).toHaveTextContent('You can add team members from the Settings page.');
    await expect(Math.round(alert.getBoundingClientRect().width)).toBe(480);
    await expect(height(alert)).toBe(68);
    // The icon is decorative; there is no dismiss button unless onDismiss is given.
    await expect(alert.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    await expect(canvas.queryByRole('button')).toBeNull();
  },
};

const Stack = ({ alertStyle, layout = 'inline' }: { alertStyle: AlertStyle; layout?: 'inline' | 'banner' }) => (
  <div className="flex flex-col gap-4">
    {variants.map(v => <Alert key={v} variant={v} alertStyle={alertStyle} layout={layout} {...content[v]} />)}
  </div>
);

// One story per Variant, Style=default. Warning is filled (no border): 66, the others 68.
export const Variants: Story = {
  parameters: { controls: { disable: true } },
  render: () => <Stack alertStyle="default" />,
  play: async ({ canvas }) => {
    const heights = canvas.getAllByText(/./, { selector: '[data-slot="alert-title"]' }).map(t => height(t.closest('[data-slot="alert"]') as HTMLElement));
    await expect(heights).toEqual([68, 68, 68, 66, 68]);
    await expect(canvas.getAllByRole('alert')).toHaveLength(1);
    await expect(canvas.getAllByRole('status')).toHaveLength(4);
    await expect(canvas.getByRole('alert')).toHaveTextContent('Sync failed');
  },
};

export const Destructive: Story = {
  args: { variant: 'destructive', ...content.destructive },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('alert')).toHaveTextContent('Sync failed');
    await expect(height(canvas.getByRole('alert'))).toBe(68);
  },
};
// Figma Style=default success and info: neutral border and muted description; only the icon and title take the status color.
const neutralFrame = async (el: HTMLElement) => {
  const probe = document.createElement('span');
  probe.className = 'border border-border text-muted-foreground';
  document.body.append(probe);
  const ref = getComputedStyle(probe);
  await expect(getComputedStyle(el).borderTopColor).toBe(ref.borderTopColor);
  await expect(getComputedStyle(el.querySelector('[data-slot="alert-description"]') as HTMLElement).color).toBe(ref.color);
  probe.remove();
};
export const Success: Story = { args: { variant: 'success', ...content.success }, play: async ({ canvas }) => { const el = canvas.getByRole('status'); await expect(el).toHaveTextContent('Workspace upgraded'); await neutralFrame(el); } };
export const Warning: Story = {
  args: { variant: 'warning', ...content.warning },
  play: async ({ canvas }) => {
    // Filled, no border (Figma 66).
    await expect(height(canvas.getByRole('status'))).toBe(66);
  },
};
export const Info: Story = { args: { variant: 'info', ...content.info }, play: async ({ canvas }) => { const el = canvas.getByRole('status'); await expect(el).toHaveTextContent('Read-only access'); await neutralFrame(el); } };

// Style=soft: tint fill, no border, 66.
export const Soft: Story = {
  parameters: { controls: { disable: true } },
  render: () => <Stack alertStyle="soft" />,
  play: async ({ canvas }) => {
    const alerts = canvas.getAllByText(/./, { selector: '[data-slot="alert-title"]' }).map(t => t.closest('[data-slot="alert"]') as HTMLElement);
    await expect(height(alerts[0])).toBe(66);
    await expect(getComputedStyle(alerts[0]).borderTopWidth).toBe('0px');
    await expect(getComputedStyle(alerts[0]).backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
  },
};

// Style=accent: bordered card with a 4 px status bar on the left, 68.
export const Accent: Story = {
  parameters: { controls: { disable: true } },
  render: () => <Stack alertStyle="accent" />,
  play: async ({ canvas, canvasElement }) => {
    const alerts = canvas.getAllByText(/./, { selector: '[data-slot="alert-title"]' }).map(t => t.closest('[data-slot="alert"]') as HTMLElement);
    await expect(height(alerts[0])).toBe(68);
    const bars = canvasElement.querySelectorAll('[data-slot="alert-bar"]');
    await expect(bars).toHaveLength(5);
    await expect(Math.round(bars[0].getBoundingClientRect().width)).toBe(4);
    await expect(bars[0]).toHaveAttribute('aria-hidden', 'true');
  },
};

// Layout=banner: full width, bottom border only, no radius, 24 px side padding, 67 (warning 66).
export const Banner: Story = {
  parameters: { controls: { disable: true } },
  render: () => <div className="w-[960px]"><Stack alertStyle="default" layout="banner" /></div>,
  play: async ({ canvas }) => {
    const alerts = canvas.getAllByText(/./, { selector: '[data-slot="alert-title"]' }).map(t => t.closest('[data-slot="alert"]') as HTMLElement);
    await expect(alerts.map(height)).toEqual([67, 67, 67, 66, 67]);
    await expect(Math.round(alerts[0].getBoundingClientRect().width)).toBe(960);
    await expect(getComputedStyle(alerts[0]).borderTopWidth).toBe('0px');
    await expect(getComputedStyle(alerts[0]).borderBottomWidth).toBe('1px');
    await expect(getComputedStyle(alerts[0]).borderTopLeftRadius).toBe('0px');
  },
};

export const BannerSoft: Story = {
  parameters: { controls: { disable: true } },
  render: () => <div className="w-[960px]"><Stack alertStyle="soft" layout="banner" /></div>,
  play: async ({ canvas }) => {
    await expect(height(canvas.getByRole('alert'))).toBe(66);
  },
};

export const BannerAccent: Story = {
  parameters: { controls: { disable: true } },
  render: () => <div className="w-[960px]"><Stack alertStyle="accent" layout="banner" /></div>,
  play: async ({ canvas }) => {
    await expect(height(canvas.getByRole('alert'))).toBe(67);
  },
};

// Actions slot: the action that resolves the situation first; Buttons are the existing Button (sm).
export const WithActions: Story = {
  args: {
    variant: 'warning',
    ...content.warning,
    actions: (
      <>
        <Button size="sm" variant="outline">Add payment method</Button>
        <Button size="sm" variant="ghost">View plans</Button>
      </>
    ),
  },
  play: async ({ canvas }) => {
    const first = canvas.getByRole('button', { name: 'Add payment method' });
    await expect(Math.round(first.getBoundingClientRect().height)).toBe(32);
    await userEvent.tab();
    await expect(first).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'View plans' })).toHaveFocus();
  },
};

export const WithActionsSoft: Story = { ...WithActions, args: { ...WithActions.args, alertStyle: 'soft' } };
export const WithActionsAccent: Story = { ...WithActions, args: { ...WithActions.args, alertStyle: 'accent' } };

// Dismiss: a named button, reachable by Tab, Enter or Space removes the alert. Focus does not
// get lost: it moves to the "Restore alert" button that takes the alert's place. In a real page
// move it to the next heading or the content the alert concerned.
const DismissibleAlert = () => {
  const [open, setOpen] = React.useState(true);
  const restore = React.useRef<HTMLButtonElement>(null);
  return (
    <div className="flex flex-col items-start gap-3">
      {open ? (
        <Alert
          variant="info"
          {...content.info}
          onDismiss={() => {
            setOpen(false);
            // Wait for the alert to unmount, then move focus to a stable target.
            requestAnimationFrame(() => restore.current?.focus());
          }}
        />
      ) : null}
      <Button ref={restore} size="sm" variant="outline" onClick={() => setOpen(true)}>Restore alert</Button>
    </div>
  );
};
export const Dismissible: Story = {
  parameters: { controls: { disable: true } },
  render: () => <DismissibleAlert />,
  play: async ({ canvas }) => {
    const dismiss = canvas.getByRole('button', { name: 'Dismiss' });
    await expect(Math.round(dismiss.getBoundingClientRect().width)).toBe(24);
    await userEvent.tab();
    await expect(dismiss).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(canvas.queryByRole('status')).toBeNull();
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Restore alert' })).toHaveFocus());
    await userEvent.keyboard('{Enter}');
    await expect(canvas.getByRole('status')).toBeVisible();
  },
};

export const DismissCallback: Story = {
  args: { onDismiss: fn(), variant: 'success', ...content.success },
  play: async ({ canvas, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Dismiss' }));
    await expect(args.onDismiss).toHaveBeenCalledTimes(1);
    canvas.getByRole('button', { name: 'Dismiss' }).focus();
    await userEvent.keyboard(' ');
    await expect(args.onDismiss).toHaveBeenCalledTimes(2);
  },
};

// Title only: Show description off.
export const TitleOnly: Story = {
  args: { description: undefined, title: 'Changes saved' },
  play: async ({ canvas }) => {
    await expect(height(canvas.getByRole('status'))).toBe(46);
  },
};

// Stress test (Figma "Stress test / Alert"): long text wraps, icon and dismiss keep their size.
const longTitle = 'Your Acme workspace is switching to the new billing system on the first day of next month';
const longDescription = 'All open invoices, saved payment methods and usage reports move automatically, so nothing needs your attention today. If you pay by bank transfer, update the reference number on your standing order before the switch to avoid a late payment.';
export const LongText: Story = { tags: ['!dev'],
  args: { variant: 'info', title: longTitle, description: longDescription, onDismiss: fn(), actions: <Button size="sm" variant="outline">Review billing</Button> },
  play: async ({ canvas, canvasElement }) => {
    const alert = canvas.getByRole('status');
    await expect(height(alert)).toBeGreaterThan(120);
    await expect(alert.scrollWidth).toBeLessThanOrEqual(alert.clientWidth);
    await expect(Math.round(canvasElement.querySelector('[data-slot="alert-icon"] svg')!.getBoundingClientRect().width)).toBe(16);
    await expect(Math.round(canvas.getByRole('button', { name: 'Dismiss' }).getBoundingClientRect().width)).toBe(24);
  },
};

export const Narrow276: Story = { tags: ['!dev'],
  ...LongText,
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  play: async ({ canvas }) => {
    const alert = canvas.getByRole('status');
    await expect(Math.round(alert.getBoundingClientRect().width)).toBe(276);
    await expect(alert.scrollWidth).toBeLessThanOrEqual(alert.clientWidth);
  },
};

export const Narrow368: Story = { tags: ['!dev'],
  ...LongText,
  args: { ...LongText.args, alertStyle: 'accent', variant: 'warning' },
  decorators: [Story => <div className="w-[368px]"><Story /></div>],
  play: async ({ canvas }) => {
    const alert = canvas.getByRole('status');
    await expect(Math.round(alert.getBoundingClientRect().width)).toBe(368);
    await expect(alert.scrollWidth).toBeLessThanOrEqual(alert.clientWidth);
  },
};

// Theme copies: axe checks contrast of every Variant and Style in each mode.
const AllStyles = () => (
  <div className="flex flex-col gap-6">
    <Stack alertStyle="default" />
    <Stack alertStyle="soft" />
    <Stack alertStyle="accent" />
  </div>
);
export const AllStylesLight: Story = { parameters: { controls: { disable: true } }, render: () => <AllStyles />, name: 'All styles' };
export const AllStylesDark: Story = { parameters: { controls: { disable: true } }, render: () => <AllStyles />, tags: ['!dev'], globals: { theme: 'Dark' }, name: 'All styles (Dark)' };
export const AllStylesCorporate: Story = { parameters: { controls: { disable: true } }, render: () => <AllStyles />, tags: ['!dev'], globals: { theme: 'Corporate Light' }, name: 'All styles (Corporate Light)' };
export const DefaultDark: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
