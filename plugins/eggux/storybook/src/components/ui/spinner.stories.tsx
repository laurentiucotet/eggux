import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Spinner } from './spinner';

const meta = {
  title: 'Components/Spinner',
  component: Spinner,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Indeterminate loading for waits under about 3 s. Use Skeleton for content and Progress for known progress; never dots inside a Button. One spinner per region. Figma: Spinner / Component (node 303:4553). Guide: eggux build-ui/components/indicators.md' } },
  },
  args: { label: 'Loading invoices' },
} satisfies Meta<typeof Spinner>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();
const spinner = (root: HTMLElement) => root.querySelector('[data-slot="spinner"]') as HTMLElement;

// Figma Size=default, Tone=default, Type=default: 20 px ring, rotating 1 s linear.
export const Default: Story = {
  play: async ({ canvas, canvasElement }) => {
    const status = canvas.getByRole('status');
    await expect(status).toHaveTextContent('Loading invoices');
    await expect(box(spinner(canvasElement)).width).toBe(20);
    const ring = status.querySelector('svg') as SVGElement;
    await expect(ring).toHaveAttribute('aria-hidden', 'true');
    await expect(Math.round(box(ring).width)).toBe(20);
    const style = getComputedStyle(ring);
    await expect(style.animationName).toBe('spin');
    await expect(style.animationDuration).toBe('1s');
    await expect(style.animationTimingFunction).toBe('linear');
  },
};

// Figma Size sm 16, default 20, lg 32.
export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex items-center gap-6">
      <Spinner size="sm" label="Loading small" />
      <Spinner label="Loading default" />
      <Spinner size="lg" label="Loading large" />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(box(canvas.getByRole('status', { name: 'Loading small' })).width).toBe(16);
    await expect(box(canvas.getByRole('status', { name: 'Loading default' })).width).toBe(20);
    await expect(box(canvas.getByRole('status', { name: 'Loading large' })).width).toBe(32);
  },
};

// Figma Tone: muted on quiet surfaces, default next to body text.
export const Tones: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex items-center gap-6">
      <Spinner tone="muted" label="Loading muted" />
      <Spinner tone="default" label="Loading default tone" />
    </div>
  ),
  play: async ({ canvas }) => {
    const muted = getComputedStyle(canvas.getByRole('status', { name: 'Loading muted' })).color;
    const normal = getComputedStyle(canvas.getByRole('status', { name: 'Loading default tone' })).color;
    await expect(muted).not.toBe(normal);
  },
};

// Figma Type=dots: three dots, 4 px (8 px at lg) at 100 / 70 / 40 % opacity, pulsing 0.2 s apart.
export const Dots: Story = {
  args: { type: 'dots', label: 'Assistant is writing' },
  render: args => (
    <div className="flex items-center gap-6">
      <Spinner {...args} />
      <Spinner {...args} size="lg" label="Assistant is writing, large" />
    </div>
  ),
  play: async ({ canvas }) => {
    const small = canvas.getByRole('status', { name: 'Assistant is writing' });
    const dots = Array.from(small.querySelectorAll('[data-slot="spinner-dot"]'));
    await expect(dots).toHaveLength(3);
    await expect(Math.round(box(dots[0]).width)).toBe(4);
    await expect(Math.round(box(dots[1]).left - box(dots[0]).right)).toBe(4);
    await expect(dots.map(d => getComputedStyle(d).animationDelay)).toEqual(['0s', '0.2s', '0.4s']);
    const large = canvas.getByRole('status', { name: 'Assistant is writing, large' });
    await expect(Math.round(box(large.querySelector('[data-slot="spinner-dot"]')!).width)).toBe(8);
    await expect(Math.round(box(large).width)).toBe(32);
  },
};

// Without a label the spinner is decorative: the text next to it carries the meaning.
export const Decorative: Story = {
  args: { label: undefined, size: 'sm', tone: 'muted' },
  render: args => (
    <p className="flex items-center gap-2 text-sm text-muted-foreground"><Spinner {...args} />Saving…</p>
  ),
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.queryByRole('status')).not.toBeInTheDocument();
    await expect(spinner(canvasElement)).toHaveAttribute('aria-hidden', 'true');
  },
};

// Figma stress test: inline with text and in a narrow column; it never shrinks.
export const Stress: Story = { parameters: { controls: { disable: true } }, tags: ['!dev'],
  render: () => (
    <div className="flex w-[276px] items-start gap-2 text-sm">
      <Spinner size="sm" tone="muted" label="Importing" />
      <span className="min-w-0">Importing 1,248 invoices for Acme Industrial Supplies, this can take a minute.</span>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(Math.round(box(canvas.getByRole('status')).width)).toBe(16);
  },
};

export const DefaultDark: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
export const DotsDark: Story = { ...Dots, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DotsCorporate: Story = { ...Dots, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
