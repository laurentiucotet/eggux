import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { QrCode } from './qr-code';

type Args = { size: 'sm' | 'default' | 'lg'; value: string };

const meta = {
  title: 'Components/Mobile/QR Code',
  parameters: {
    docs: {
      description: {
        component:
          'A real, scannable QR code on a light tile, dark on light in every theme because many scanners read inverted codes badly. Sizes sm 96, default 128, lg 160 (the quiet zone grows with the size). Put the action in text next to it ("Scan to get the app") and a link or store badges for people who cannot scan. Figma: Mobile page / QR Code. Guide: eggux build-ui/patterns/marketing-pages.md',
      },
    },
  },
  args: { size: 'default', value: 'https://acme.example/app' },
  argTypes: {
    size: { name: 'Size', control: 'inline-radio', options: ['sm', 'default', 'lg'], description: 'Tile size: 96, 128 or 160.', table: { category: 'QR code' } },
    value: { name: 'Value', control: 'text', description: 'What the code opens.', table: { category: 'QR code' } },
  },
  render: ({ size, value }) => <QrCode size={size} value={value} alt="QR code to the Acme app in the App Store" />,
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  play: async ({ canvas }) => {
    const code = canvas.getByRole('img', { name: 'QR code to the Acme app in the App Store' });
    await expect(Math.round(code.getBoundingClientRect().width)).toBe(128);
    await expect(Math.round(code.getBoundingClientRect().height)).toBe(128);
    await expect(code.querySelector('svg')).not.toBeNull();
    await expect(getComputedStyle(code).backgroundColor).toBe('rgb(255, 255, 255)');
  },
};

/** The three sizes. */
export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex items-end gap-6">
      {(['sm', 'default', 'lg'] as const).map(s => <QrCode key={s} size={s} value="https://acme.example/app" alt={`QR code, ${s}`} />)}
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(Math.round(canvas.getByRole('img', { name: 'QR code, sm' }).getBoundingClientRect().width)).toBe(96);
    await expect(Math.round(canvas.getByRole('img', { name: 'QR code, lg' }).getBoundingClientRect().width)).toBe(160);
  },
};

/* Hidden checks */

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <QrCode size="sm" value={'https://acme.example/app?utm_source=newsletter&utm_campaign=autumn&ref=' + 'x'.repeat(200)} alt="QR code, long link" />,
  play: async ({ canvas }) => {
    // A long link still fits the tile: the code gets denser, the tile keeps its size.
    await expect(Math.round(canvas.getByRole('img').getBoundingClientRect().width)).toBe(96);
  },
};

// Dark on light in every theme.
export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
