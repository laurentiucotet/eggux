import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { FileText, Folder, Package } from '@/components/icons';
import { Thumbnail } from './thumbnail';

const product = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="80" height="80" fill="#d6c3a5"/><rect x="22" y="24" width="36" height="38" rx="5" fill="#8a6f4e"/></svg>');

const meta = {
  title: 'Components/Image/Thumbnail',
  component: Thumbnail,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'A small framed image of a product, file or listing: border, rounded corners, the image cropped to the frame; a fallback icon on a muted tile when there is no image. Sizes xs 24, sm 32, default 48, lg 64, xl 80; Ratio 4:3 makes it 3/4 as tall. Never stretch it. People use Avatar; logos use Logo Tile. Figma: Image page / Thumbnail.' } },
  },
  args: { src: product },
} satisfies Meta<typeof Thumbnail>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();

// Sizes 24 to 80, 4:3 at 64 (48 tall), fallback icons, a broken image falls back.
export const Default: Story = {
  render: args => (
    <div className="flex items-end gap-4">
      {(['xs', 'sm', 'default', 'lg', 'xl'] as const).map(s => <Thumbnail key={s} {...args} size={s} />)}
      <Thumbnail {...args} size="lg" ratio="4:3" />
      <Thumbnail size="default" icon={<FileText />} />
      <Thumbnail size="default" icon={<Package />} />
      <Thumbnail size="default" icon={<Folder />} />
      <Thumbnail size="default" src="data:image/png;base64,broken" data-testid="broken" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const all = canvasElement.querySelectorAll('[data-slot="thumbnail"]');
    await expect([0, 1, 2, 3, 4].map(i => Math.round(box(all[i]!).width))).toEqual([24, 32, 48, 64, 80]);
    await expect(Math.round(box(all[5]!).height)).toBe(48);
    await expect(all[6]!.querySelector('img')).toBeNull();
    await new Promise(r => setTimeout(r, 50));
    await expect(canvasElement.querySelector('[data-testid="broken"] img')).toBeNull();
  },
};

export const DefaultDark: Story = { parameters: { controls: { disable: true } }, tags: ['!dev'], globals: { theme: 'Dark' }, render: Default.render };
export const DefaultCorporate: Story = { parameters: { controls: { disable: true } }, tags: ['!dev'], globals: { theme: 'Corporate Light' }, render: Default.render };
