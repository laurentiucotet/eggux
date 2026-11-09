import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Scrim, type ScrimTone } from './scrim';

const meta = {
  title: 'Components/Dialog/Scrim',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'The dimmed layer behind overlays and over media. Tone=dialog (dialog/overlay) sits behind Dialog, Alert Dialog, Sheet and Drawer; media (media/scrim) darkens a photo under text; light (background at 80%) veils busy or locked content. First layer of the box it covers, stretched to all sides; it blocks clicks to what is behind. Figma: Dialog page, "Scrim / Component". Guide: build-ui/components/dialog.md.',
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

type Playground = { tone: ScrimTone; width: number };

/** Playground: Scrim Tone over busy content. */
export const Default: StoryObj<Playground> = {
  argTypes: {
    tone: { name: 'Tone', control: 'inline-radio', options: ['dialog', 'media', 'light'], description: 'dialog: behind a modal. media: text over a photo. light: a locked section.', table: { category: 'Scrim' } },
    width: { name: 'Width', control: { type: 'range', min: 160, max: 640, step: 4 }, description: 'Width of the box it covers', table: { category: 'Scrim' } },
  },
  args: { tone: 'dialog', width: 240 },
  render: a => <Box tone={a.tone} width={a.width} />,
};

/** Busy content behind the scrim: shapes only, so the text on top is the only text. */
const Backdrop = () => (
  <div aria-hidden="true" className="absolute inset-0 grid grid-cols-3 gap-2 bg-muted p-3">
    {Array.from({ length: 6 }, (_, i) => (
      <div key={i} className="rounded-md bg-primary/60" />
    ))}
  </div>
);

const label: Record<ScrimTone, string> = {
  dialog: 'Tone dialog: behind a modal',
  media: 'Tone media: text over a photo',
  light: 'Tone light: locked section',
};

const Box = ({ tone, width = 240 }: { tone: ScrimTone; width?: number }) => (
  <div data-testid={`box-${tone}-${width}`} className="relative h-40 overflow-hidden rounded-lg border" style={{ width }}>
    <Backdrop />
    <Scrim tone={tone} />
    <p
      className={
        tone === 'light'
          ? 'absolute inset-x-0 bottom-3 px-3 text-sm font-medium text-foreground'
          : 'absolute inset-x-0 bottom-3 px-3 text-sm font-medium text-[var(--media-foreground)]'
      }
    >
      {label[tone]}
    </p>
  </div>
);

const expectCovers = (box: HTMLElement) => {
  const scrim = box.querySelector<HTMLElement>('[data-slot="scrim"]')!;
  const b = box.getBoundingClientRect();
  const s = scrim.getBoundingClientRect();
  // Stretched to all sides of the box (border inside excluded).
  expect(Math.round(s.width)).toBe(Math.round(b.width) - 2);
  expect(Math.round(s.height)).toBe(Math.round(b.height) - 2);
  // A click in the middle lands on the scrim, not on the content behind it.
  const hit = document.elementFromPoint(s.left + s.width / 2, s.top + s.height / 4);
  expect(hit).toBe(scrim);
  return scrim;
};

export const Tones: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Box tone="dialog" />
      <Box tone="media" />
      <Box tone="light" />
    </div>
  ),
  play: async ({ canvas }) => {
    const dialog = expectCovers(canvas.getByTestId('box-dialog-240'));
    const media = expectCovers(canvas.getByTestId('box-media-240'));
    const light = expectCovers(canvas.getByTestId('box-light-240'));
    // Token values: dialog/overlay black 50%, media/scrim black 60%, background at 80%.
    const probe = document.createElement('div');
    document.body.appendChild(probe);
    probe.style.backgroundColor = 'var(--dialog-overlay)';
    await expect(getComputedStyle(dialog).backgroundColor).toBe(getComputedStyle(probe).backgroundColor);
    probe.style.backgroundColor = 'var(--media-scrim)';
    await expect(getComputedStyle(media).backgroundColor).toBe(getComputedStyle(probe).backgroundColor);
    probe.style.backgroundColor = 'color-mix(in oklab, var(--background) 80%, transparent)';
    await expect(getComputedStyle(light).backgroundColor).toBe(getComputedStyle(probe).backgroundColor);
    probe.remove();
    // Decorative: hidden from assistive technology.
    await expect(dialog).toHaveAttribute('aria-hidden', 'true');
    await expect(media).toHaveAttribute('data-tone', 'media');
  },
};

export const TonesDark: Story = { ...Tones, tags: ['!dev'], globals: { theme: 'Dark' } };
export const TonesCorporate: Story = { ...Tones, tags: ['!dev'], globals: { theme: 'Corporate Light' } };

/** Figma stress test: the scrim stretches to any box, from a 276 column to 640 x 400. */
export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true }, layout: 'padded' },
  render: () => (
    <div className="flex flex-wrap items-start gap-4">
      <Box tone="dialog" width={276} />
      <Box tone="media" width={368} />
      <div data-testid="box-default" className="relative h-[400px] w-[640px] overflow-hidden">
        <Backdrop />
        <Scrim />
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expectCovers(canvas.getByTestId('box-dialog-276'));
    expectCovers(canvas.getByTestId('box-media-368'));
    const box = canvas.getByTestId('box-default');
    const scrim = box.querySelector<HTMLElement>('[data-slot="scrim"]')!;
    await expect(scrim.getBoundingClientRect().width).toBe(640);
    await expect(scrim.getBoundingClientRect().height).toBe(400);
    await expect(scrim).toHaveAttribute('data-tone', 'dialog');
  },
};
