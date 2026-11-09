import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { InlineMessage, type InlineMessageType } from './inline-message';

const meta = {
  title: 'Components/Alert/Inline Message',
  component: InlineMessage,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'One line of status text with an icon and no box, next to the thing it is about. Words carry the meaning; color and icon repeat it. 2 lines at most, 480 px max. Use Alert for titles, boxes or actions. Figma: Alert page / Inline Message (node 1119:7208). Guide: eggux build-ui/components/alert.md' } },
  },
  args: { type: 'default', children: 'Saved 2 minutes ago' },
} satisfies Meta<typeof InlineMessage>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();

// Figma Type=default: 161 x 20, clock icon, muted text.
export const Default: Story = {
  play: async ({ canvas }) => {
    const msg = canvas.getByRole('status');
    await expect(msg).toHaveTextContent('Saved 2 minutes ago');
    await expect(msg.querySelector('svg')).toHaveAttribute('data-icon', 'clock');
    await expect(msg.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    await expect(Math.round(box(msg).height)).toBe(20);
    await expect(box(msg.firstElementChild!).width).toBe(16);
    await expect(Math.round(box(msg.querySelector('[data-slot="inline-message-text"]')!).left - box(msg.firstElementChild!).right)).toBe(8);
  },
};

const types: [InlineMessageType, string, string | null][] = [
  ['default', 'Saved 2 minutes ago', 'clock'],
  ['info', 'Invoices sync every hour', 'info'],
  ['success', '3 rows imported', 'circle-check'],
  ['warning', '3 rows skipped', 'triangle-alert'],
  ['error', 'Could not save changes', 'circle-alert'],
  ['loading', 'Saving…', null],
];

// Figma Types: icon per type, status color for info/success/warning/error, Spinner for loading.
export const Types: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-4">
      {types.map(([type, text]) => <InlineMessage key={type} type={type}>{text}</InlineMessage>)}
    </div>
  ),
  play: async ({ canvas }) => {
    for (const [type, text, icon] of types) {
      const msg = canvas.getByText(text).closest('[data-slot="inline-message"]') as HTMLElement;
      await expect(msg).toHaveAttribute('data-type', type);
      await expect(Math.round(box(msg).height)).toBe(20);
      if (icon) await expect(msg.querySelector('svg')).toHaveAttribute('data-icon', icon);
      else await expect(msg.querySelector('[data-slot="spinner"]')).toBeInTheDocument();
    }
    const color = (t: string) => getComputedStyle(canvas.getByText(t)).color;
    await expect(color('Saved 2 minutes ago')).toBe(color('Saving…'));
    await expect(color('3 rows imported')).not.toBe(color('Saved 2 minutes ago'));
  },
};

// Figma Type=loading: Spinner sm (16) and muted text; the spinner is decorative.
export const Loading: Story = {
  args: { type: 'loading', children: 'Saving…' },
  play: async ({ canvas }) => {
    const msg = canvas.getByRole('status');
    await expect(msg).toHaveTextContent('Saving…');
    const spinner = msg.querySelector('[data-slot="spinner"]') as HTMLElement;
    await expect(box(spinner).width).toBe(16);
    await expect(spinner).toHaveAttribute('aria-hidden', 'true');
  },
};

// Errors that block the goal are announced at once.
export const ErrorState: Story = {
  name: 'Error',
  args: { type: 'error', children: 'Could not save changes. Check your connection and try again.' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('alert')).toHaveTextContent('Could not save changes');
  },
};

// Figma stress test: 480 max width, wraps to 2 lines then ellipsis; FILL in narrow columns.
const long = 'The import finished, but 3 rows were skipped because the invoice number was missing, the currency was not EUR, or the customer could not be matched to an existing Acme account. Review the skipped rows and import them again.';
export const LongText: Story = { tags: ['!dev'],
  args: { type: 'warning', children: long },
  play: async ({ canvas }) => {
    const msg = canvas.getByRole('status');
    await expect(Math.round(box(msg).width)).toBeLessThanOrEqual(480);
    await expect(Math.round(box(msg).height)).toBe(40);
    const text = msg.querySelector('[data-slot="inline-message-text"]') as HTMLElement;
    await expect(text.scrollHeight).toBeGreaterThan(text.clientHeight);
  },
};

export const NarrowColumns: Story = { parameters: { controls: { disable: true } }, tags: ['!dev'],
  render: () => (
    <div className="flex flex-col gap-6">
      {[276, 368].map(w => (
        <div key={w} data-width={w} style={{ width: w }}>
          <InlineMessage type="info" className="w-full">{long}</InlineMessage>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const w of [276, 368]) {
      const col = canvasElement.querySelector(`[data-width="${w}"]`)!;
      const msg = col.querySelector('[data-slot="inline-message"]')!;
      await expect(Math.round(box(msg).width)).toBe(w);
      await expect(Math.round(box(msg).height)).toBe(40);
    }
  },
};

export const TypesDark: Story = { ...Types, tags: ['!dev'], globals: { theme: 'Dark' } };
export const TypesCorporate: Story = { ...Types, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
