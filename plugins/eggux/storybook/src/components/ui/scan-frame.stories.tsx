import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { ScanFrame } from './scan-frame';

type Args = { state: 'scanning' | 'success' | 'error'; hint: string; size: number };

const meta = {
  title: 'Components/Mobile/Scan Frame',
  parameters: {
    docs: {
      description: {
        component:
          'The viewfinder over a camera feed for scanning a QR code, a barcode or a document: four corner brackets, a hint and a state (scanning, success, error). The brackets are white over live video, so they do not follow the theme. The hint is a polite live region, and a text fallback ("Enter the code instead") should always sit next to it. Code only (no Figma component yet).',
      },
    },
  },
  args: { state: 'scanning', hint: 'Point the camera at the QR code', size: 256 },
  argTypes: {
    state: { name: 'State', control: 'inline-radio', options: ['scanning', 'success', 'error'], description: 'What the scanner is doing.', table: { category: 'Frame' } },
    hint: { name: 'Hint', control: 'text', description: 'What to do or what happened.', table: { category: 'Frame' } },
    size: { name: 'Size', control: { type: 'range', min: 160, max: 320, step: 16 }, description: 'Side of the frame in px.', table: { category: 'Frame' } },
  },
  render: ({ state, hint, size }) => (
    <ScanFrame state={state} hint={hint} size={size}>
      <div className="size-full bg-[linear-gradient(135deg,var(--muted-foreground),var(--foreground))] opacity-60" />
    </ScanFrame>
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('status')).toHaveTextContent('Point the camera at the QR code');
    const frame = canvas.getByRole('status').previousElementSibling as HTMLElement;
    await expect(Math.round(frame.getBoundingClientRect().width)).toBe(256);
    await expect(Math.round(frame.getBoundingClientRect().height)).toBe(256);
  },
};

/** The three states side by side. */
export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap items-start gap-6">
      <ScanFrame state="scanning" hint="Point the camera at the QR code" size={200} />
      <ScanFrame state="success" hint="Code scanned" size={200} />
      <ScanFrame state="error" hint="That code is not from Acme. Try again." size={200} />
    </div>
  ),
};

/* Hidden checks */

export const StateCheck: Story = {
  tags: ['!dev'],
  args: { state: 'error', hint: 'That code is not from Acme. Try again.' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('status')).toHaveTextContent('That code is not from Acme');
    await expect(canvas.getByRole('status').closest('[data-slot="scan-frame"]')).toHaveAttribute('data-state', 'error');
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => <ScanFrame size={240} hint="Hold your phone steady and move closer until the whole code fits inside the corners of the frame" />,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('status').getBoundingClientRect().width).toBeLessThanOrEqual(276);
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
