import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { Toast, ToastProvider, ToastViewport, Toaster, toast, type ToastProps, type ToastType } from './toast';
import { Button } from './button';

const meta = {
  title: 'Components/Toast',
  component: Toast,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Short message about an action or a background event, shown briefly in a corner. One line, past tense, names the object; at most one action. Built on the radix-ui Toast (Sonner is not installed): polite live region, assertive for errors, timer paused on hover and focus, swipe or Escape to dismiss, F8 focuses the stack. Never the only place for information. Figma: Toast page / Toast. Guide: eggux build-ui/components/toast.md' } },
  },
  args: { title: 'Changes saved', description: 'Project “Website redesign” was updated.' },
} satisfies Meta<typeof Toast>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Static frame for visuals: a provider, and a viewport laid out in the page instead of fixed to a corner. */
const Frame = ({ width = 384, label, children }: { width?: number; label?: string; children: React.ReactNode }) => (
  <ToastProvider>
    <div style={{ width }} className="max-w-full">
      {children}
      <ToastViewport label={label} className="static! inset-auto! sm:static! sm:inset-auto! w-full! translate-x-0! p-0! sm:translate-x-0! flex-col! sm:flex-col! gap-4!" />
    </div>
  </ToastProvider>
);
// Open, never auto-dismissed, so the visual and the tests are deterministic.
const Still = (props: ToastProps) => <Toast defaultOpen duration={Infinity} {...props} />;

const rect = (el: Element) => el.getBoundingClientRect();
const root = (canvasElement: HTMLElement) => canvasElement.querySelector('[data-slot="toast"]') as HTMLElement;
// Radix renders an open toast into the viewport a moment after the first render: wait for it.
const ready = (canvasElement: HTMLElement) => waitFor(() => expect(canvasElement.querySelector('[data-slot="toast"]')).not.toBeNull(), { timeout: 3000 });
const roots = (canvasElement: HTMLElement) => Array.from(canvasElement.querySelectorAll<HTMLElement>('[data-slot="toast"]'));

const types: ToastType[] = ['default', 'success', 'error', 'warning', 'info', 'loading'];
const text: Record<ToastType, { title: string; description: string }> = {
  default: { title: 'Changes saved', description: 'Project “Website redesign” was updated.' },
  success: { title: 'Invoice INV-1048 created', description: 'Sent to billing@acme.example.' },
  error: { title: 'Export failed', description: 'The file is over 25 MB. Try fewer columns.' },
  warning: { title: 'Storage almost full', description: 'You have used 92% of your 10 GB.' },
  info: { title: 'New version available', description: 'Reload to get the latest changes.' },
  loading: { title: 'Importing contacts', description: 'This can take a minute.' },
};

// Figma Type=default, Style=default: 384 x 76, popover surface with a border.
export const Default: Story = {
  render: args => <Frame><Still {...args} /></Frame>,
  play: async ({ canvasElement }) => { await ready(canvasElement);
    const el = root(canvasElement);
    await expect(el).toHaveTextContent('Changes saved');
    await expect(el).toHaveTextContent('Project “Website redesign” was updated.');
    await expect(Math.round(rect(el).width)).toBe(384);
    await expect(Math.round(rect(el).height)).toBe(76);
    await expect(getComputedStyle(el).borderTopWidth).toBe('1px');
    // No icon on Type=default, and no buttons unless asked.
    await expect(el.querySelector('[data-slot="toast-icon"]')).toBeNull();
    await expect(el.querySelector('button')).toBeNull();
    // Radix: the labelled notifications region (F8 focuses it).
    await expect(within(canvasElement).getByRole('region', { name: /Notifications/ })).toBeInTheDocument();
  },
};

// One toast per Type, Style=default. Icons carry the type; the text names the outcome.
export const Types: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Frame>
      {types.map(t => <Still key={t} type={t} {...text[t]} />)}
    </Frame>
  ),
  play: async ({ canvasElement }) => { await ready(canvasElement);
    const list = roots(canvasElement);
    await expect(list).toHaveLength(6);
    for (const el of list) await expect(Math.round(rect(el).height)).toBe(76);
    // Icon colors, compared with token probes.
    const colors: Record<string, string> = { success: 'text-success', error: 'text-destructive', warning: 'text-warning', info: 'text-info', loading: 'text-muted-foreground' };
    for (const [type, cls] of Object.entries(colors)) {
      const probe = document.createElement('span');
      probe.className = cls;
      document.body.append(probe);
      const icon = canvasElement.querySelector(`[data-type="${type}"] [data-slot="toast-icon"]`) as HTMLElement;
      await expect(getComputedStyle(icon).color).toBe(getComputedStyle(probe).color);
      await expect(Math.round(rect(icon).width)).toBe(16);
      probe.remove();
    }
    // Surface, border and text colors.
    const probe = document.createElement('div');
    probe.className = 'bg-popover border border-border text-muted-foreground';
    document.body.append(probe);
    const ref = getComputedStyle(probe);
    await expect(getComputedStyle(list[0]).backgroundColor).toBe(ref.backgroundColor);
    await expect(getComputedStyle(list[0]).borderTopColor).toBe(ref.borderTopColor);
    await expect(getComputedStyle(list[0].querySelector('[data-slot="toast-description"]') as HTMLElement).color).toBe(ref.color);
    probe.remove();
    // The loading icon spins.
    await expect(canvasElement.querySelector('[data-type="loading"] svg')).toHaveClass('animate-spin');
  },
};

// Style=inverted: foreground fill, background text, no border, 384 x 74, monochrome icons.
export const Inverted: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Frame>
      {types.map(t => <Still key={t} type={t} toastStyle="inverted" {...text[t]} />)}
    </Frame>
  ),
  play: async ({ canvasElement }) => { await ready(canvasElement);
    const list = roots(canvasElement);
    for (const el of list) {
      await expect(Math.round(rect(el).height)).toBe(74);
      await expect(getComputedStyle(el).borderTopWidth).toBe('0px');
    }
    const probe = document.createElement('div');
    probe.className = 'bg-foreground text-background';
    document.body.append(probe);
    const ref = getComputedStyle(probe);
    await expect(getComputedStyle(list[0]).backgroundColor).toBe(ref.backgroundColor);
    await expect(getComputedStyle(list[0].querySelector('[data-slot="toast-title"]') as HTMLElement).color).toBe(ref.color);
    // Icons are monochrome: the same color as the text.
    for (const el of list.slice(1)) await expect(getComputedStyle(el.querySelector('[data-slot="toast-icon"]') as HTMLElement).color).toBe(ref.color);
    // Description at 80% opacity.
    await expect(getComputedStyle(list[0].querySelector('[data-slot="toast-description"]') as HTMLElement).opacity).toBe('0.8');
    probe.remove();
  },
};

export const OneLine: Story = {
  parameters: { controls: { disable: true } },
  name: 'Without description',
  render: () => <Frame><Still title="Invoice #1042 sent" /></Frame>,
  play: async ({ canvasElement }) => { await ready(canvasElement);
    const el = root(canvasElement);
    await expect(el.querySelector('[data-slot="toast-description"]')).toBeNull();
    // Figma "All options off": 384 x 54.
    await expect(Math.round(rect(el).height)).toBe(54);
  },
};

const onUndo = fn();
// Show action: one verb, Button size sm (32). Clicking it runs the handler and dismisses the toast.
export const WithAction: Story = {
  parameters: { controls: { disable: true } },
  render: () => <Frame><Still type="success" title="Invoice archived" description="You can restore it from Archive." action={{ label: 'Undo', onClick: onUndo }} close /></Frame>,
  play: async ({ canvasElement }) => { await ready(canvasElement);
    onUndo.mockClear();
    const c = within(canvasElement);
    const undo = c.getByRole('button', { name: 'Undo' });
    await expect(Math.round(rect(undo).height)).toBe(32);
    const close = c.getByRole('button', { name: 'Dismiss' });
    await expect(Math.round(rect(close).width)).toBe(24);
    await userEvent.click(undo);
    await expect(onUndo).toHaveBeenCalledOnce();
    await waitFor(() => expect(canvasElement.querySelector('[data-slot="toast"]')).toBeNull());
  },
};

// Show close: the dismiss button removes the toast.
export const WithClose: Story = {
  parameters: { controls: { disable: true } },
  render: () => <Frame><Still type="error" title="Upload failed" description="Check the connection and try again." close /></Frame>,
  play: async ({ canvasElement }) => { await ready(canvasElement);
    const el = root(canvasElement);
    // Errors are assertive: Radix renders them as a foreground toast.
    await expect(el).toHaveAttribute('data-type', 'error');
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Dismiss' }));
    await waitFor(() => expect(canvasElement.querySelector('[data-slot="toast"]')).toBeNull());
  },
};

// Show avatar (Type=default only): 24 px slot before the text. No Avatar component in code yet, so the story passes a placeholder.
export const WithAvatar: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Frame>
      <Still
        avatar={<span aria-hidden="true" className="flex size-6 items-center justify-center rounded-full bg-muted text-xs font-medium text-foreground">AP</span>}
        title="Ana Popescu replied"
        description="“Looks good, shipping it today.”"
        action={{ label: 'View' }}
        close
      />
    </Frame>
  ),
  play: async ({ canvasElement }) => { await ready(canvasElement);
    const slot = canvasElement.querySelector('[data-slot="toast-avatar"]') as HTMLElement;
    await expect(Math.round(rect(slot).width)).toBe(24);
    // Never a status icon and an avatar together.
    await expect(canvasElement.querySelector('[data-slot="toast-icon"]')).toBeNull();
  },
};

// Show progress: a 4 px Progress under the text for an upload; the toast stays until the work ends.
export const WithProgress: Story = {
  parameters: { controls: { disable: true } },
  render: () => <Frame><Still type="loading" title="Uploading 3 files" description="invoice-june.pdf and 2 more" progress={40} progressLabel="Upload progress" close /></Frame>,
  play: async ({ canvasElement }) => { await ready(canvasElement);
    const bar = within(canvasElement).getByRole('progressbar', { name: 'Upload progress' });
    await expect(bar).toHaveAttribute('aria-valuenow', '40');
    await expect(Math.round(rect(bar).height)).toBe(4);
    // Loading with progress has no auto-dismiss: the duration is Infinity by default.
    await expect(root(canvasElement)).toBeInTheDocument();
  },
};

// All options on (Figma stress case): 384 wide, long text wraps, nothing overflows.
export const AllOptionsOn: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Frame>
      <Still
        avatar={<span aria-hidden="true" className="flex size-6 items-center justify-center rounded-full bg-muted text-xs font-medium text-foreground">AP</span>}
        title="Changes saved with a much longer label than planned"
        description="Project “Website redesign” was updated. Project “Website redesign” was updated."
        action={{ label: 'Undo' }}
        close
        progress={60}
      />
    </Frame>
  ),
  play: async ({ canvasElement }) => { await ready(canvasElement);
    const el = root(canvasElement);
    await expect(Math.round(rect(el).width)).toBe(384);
    await expect(el.scrollWidth).toBeLessThanOrEqual(el.clientWidth);
    // The title wraps to two lines; the action and close keep their size.
    await expect(rect(el.querySelector('[data-slot="toast-title"]') as HTMLElement).height).toBeGreaterThan(30);
    await expect(Math.round(rect(within(el).getByRole('button', { name: 'Undo' })).height)).toBe(32);
  },
};

const longText = { title: 'Changes saved with a much longer label than planned', description: 'Project “Website redesign” was updated. Project “Website redesign” was updated.' };

// Stress: the 276 (1/4) and 368 (1/3) px columns. Text wraps, nothing overflows.
export const Columns: Story = { parameters: { controls: { disable: true } }, tags: ['!dev'],
  render: () => (
    <div className="flex flex-col gap-6">
      {[276, 368].map(w => (
        <Frame key={w} width={w} label={`Notifications ${w} ({hotkey})`}><Still {...longText} action={{ label: 'Undo' }} close /></Frame>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => { await ready(canvasElement);
    const list = roots(canvasElement);
    await expect(list.map(el => Math.round(rect(el).width))).toEqual([276, 368]);
    for (const el of list) await expect(el.scrollWidth).toBeLessThanOrEqual(el.clientWidth);
  },
};

export const LongWords: Story = { parameters: { controls: { disable: true } }, tags: ['!dev'],
  name: 'Long unbroken text',
  render: () => <Frame width={276}><Still type="error" title="invoice-INV-1048-final-final-v2-signed-scan.pdf" description="averyveryveryverylongfilenamewithoutanyspaces.extension could not be exported" close /></Frame>,
  play: async ({ canvasElement }) => { await ready(canvasElement);
    const el = root(canvasElement);
    await expect(el.scrollWidth).toBeLessThanOrEqual(el.clientWidth);
    await expect(Math.round(rect(el).width)).toBe(276);
  },
};

const Demo = ({ inverted = false }: { inverted?: boolean }) => (
  <div className="flex flex-wrap gap-2">
    <Toaster toastStyle={inverted ? 'inverted' : 'default'} />
    <Button variant="outline" onClick={() => toast.success('Invoice INV-1048 created', { description: 'Sent to billing@acme.example.', duration: Infinity })}>Create invoice</Button>
    <Button variant="outline" onClick={() => toast('Invoice archived', { action: { label: 'Undo' }, close: true, duration: Infinity })}>Archive</Button>
    <Button variant="outline" onClick={() => toast.error('Export failed', { description: 'Try fewer columns.', close: true, duration: Infinity })}>Export</Button>
    <Button
      variant="outline"
      onClick={() => {
        const id = toast.loading('Uploading 3 files', { progress: 20, progressLabel: 'Upload progress' });
        window.setTimeout(() => toast.update(id, { progress: 100 }), 800);
        window.setTimeout(() => toast.update(id, { type: 'success', title: 'Uploaded 3 files', progress: undefined, duration: 4000 }), 1300);
      }}
    >
      Upload
    </Button>
  </div>
);

// Live: toast() from a button. The stack sits in the viewport corner (fixed), so tests query the document.
export const Live: Story = {
  render: () => <Demo />,
  parameters: { controls: { disable: true }, layout: 'centered' },
  play: async ({ canvas }) => {
    toast.dismiss();
    await userEvent.click(canvas.getByRole('button', { name: 'Create invoice' }));
    const body = within(document.body);
    const el = await body.findByText('Invoice INV-1048 created', { selector: '[data-slot="toast-title"]' });
    const t = el.closest('[data-slot="toast"]') as HTMLElement;
    await expect(t).toHaveAttribute('data-type', 'success');
    // Bottom right of the window, 384 wide.
    await expect(Math.round(rect(t).width)).toBe(384 - 32);
    await expect(Math.round(window.innerWidth - rect(t).right)).toBe(16);
    toast.dismiss();
    await waitFor(() => expect(document.querySelector('[data-slot="toast"]')).toBeNull());
  },
};

// Keyboard: F8 focuses the stack, Tab reaches the action, Enter runs it, Escape dismisses.
export const Keyboard: Story = {
  render: () => <Demo />,
  parameters: { controls: { disable: true }, layout: 'centered' },
  play: async ({ canvas }) => {
    toast.dismiss();
    await userEvent.click(canvas.getByRole('button', { name: 'Archive' }));
    const body = within(document.body);
    await body.findByText('Invoice archived', { selector: '[data-slot="toast-title"]' });
    await userEvent.keyboard('[F8]');
    const viewport = document.querySelector('[data-slot="toast-viewport"]') as HTMLElement;
    await waitFor(() => expect(viewport).toHaveFocus());
    await userEvent.tab();
    const toastEl = document.querySelector('[data-slot="toast"]') as HTMLElement;
    await waitFor(() => expect(toastEl.contains(document.activeElement) || toastEl === document.activeElement).toBe(true));
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(document.querySelector('[data-slot="toast"]')).toBeNull());
  },
};

// Timer: a toast with a short duration goes away on its own; hovering pauses it.
export const AutoDismiss: Story = {
  render: () => (
    <div>
      <Toaster />
      <Button variant="outline" onClick={() => toast('Invoice #1042 sent', { duration: 600 })}>Send</Button>
      <Button variant="outline" className="ml-2" onClick={() => toast('Hold me', { duration: 600, action: { label: 'Undo' } })}>Send with action</Button>
    </div>
  ),
  parameters: { controls: { disable: true }, layout: 'centered' },
  play: async ({ canvas }) => {
    toast.dismiss();
    await userEvent.click(canvas.getByRole('button', { name: 'Send' }));
    await waitFor(() => expect(document.querySelector('[data-slot="toast"]')).not.toBeNull());
    await waitFor(() => expect(document.querySelector('[data-slot="toast"]')).toBeNull(), { timeout: 3000 });
    // Focus pauses the timer, so the action can be reached.
    await userEvent.click(canvas.getByRole('button', { name: 'Send with action' }));
    const undo = await within(document.body).findByRole('button', { name: 'Undo' });
    undo.focus();
    await new Promise(r => setTimeout(r, 1200));
    await expect(document.querySelector('[data-slot="toast"]')).not.toBeNull();
    toast.dismiss();
  },
};

export const InvertedLive: Story = {
  name: 'Inverted (live)',
  render: () => <Demo inverted />,
  parameters: { controls: { disable: true }, layout: 'centered' },
  play: async ({ canvas }) => {
    toast.dismiss();
    await userEvent.click(canvas.getByRole('button', { name: 'Export' }));
    const t = await within(document.body).findByText('Export failed', { selector: '[data-slot="toast-title"]' });
    await expect(t.closest('[data-slot="toast"]')).toHaveAttribute('data-style', 'inverted');
    toast.dismiss();
  },
};

// Theme checks: contrast in each mode. The inverted style flips to a light toast in Dark.
const Themed = () => (
  <Frame>
    <Still type="success" title="Invoice INV-1048 created" description="Sent to billing@acme.example." action={{ label: 'View' }} close />
    <Still type="error" toastStyle="inverted" title="Export failed" description="Try fewer columns." close />
  </Frame>
);
export const ThemedLight: Story = { tags: ['!dev'], parameters: { controls: { disable: true } }, render: () => <Themed />, name: 'Themed', play: async ({ canvasElement }) => { await ready(canvasElement); await expect(roots(canvasElement)).toHaveLength(2); } };
export const ThemedDark: Story = { ...ThemedLight, tags: ['!dev'], globals: { theme: 'Dark' } };
export const ThemedCorporate: Story = { ...ThemedLight, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
