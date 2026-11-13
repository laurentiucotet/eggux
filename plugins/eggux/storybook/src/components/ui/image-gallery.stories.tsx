import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { ImageGallery, type GalleryImage } from './image-gallery';
import type { ImageRatio } from './image-placeholder';

type Args = { images: number; ratio: ImageRatio; showThumbnails: boolean; showCounter: boolean; showCaption: boolean; loop: boolean; width: number };

const all: GalleryImage[] = [
  { alt: 'Oak desk seen from the front', caption: 'Oak desk, front view' },
  { alt: 'Oak desk, drawer open', caption: 'Drawer open, felt lining' },
  { alt: 'Close-up of the oak grain', caption: 'Oiled oak grain' },
  { alt: 'Desk in a bright office', caption: 'In a bright office' },
  { alt: 'Cable tray under the desk', caption: 'Cable tray underneath' },
  { alt: 'Desk packed for delivery', caption: 'Flat-pack, 28 kg' },
];

const meta = {
  title: 'Components/Media/Image Gallery',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A main image with a thumbnail strip, previous and next arrows and a counter. Left and Right arrows (and Home, End) change the image from anywhere inside the group, a thumbnail is a button with aria-current, and a polite status line names the shown image. Pass onImageClick to make the main image open a Lightbox. Code only (no Figma component yet).',
      },
    },
  },
  args: { images: 6, ratio: '4:3', showThumbnails: true, showCounter: true, showCaption: true, loop: false, width: 480 },
  argTypes: {
    images: { name: 'Images', control: { type: 'range', min: 1, max: 6, step: 1 }, description: 'How many images the gallery holds.', table: { category: 'Gallery' } },
    ratio: { name: 'Ratio', control: 'select', options: ['16:9', '4:3', '1:1', '3:2'], description: 'Shape of the main image.', table: { category: 'Gallery' } },
    loop: { name: 'Loop', control: 'boolean', description: 'Next on the last image goes to the first.', table: { category: 'Gallery' } },
    showThumbnails: { name: 'Show thumbnails', control: 'boolean', description: 'The strip under the main image.', table: { category: 'Parts' } },
    showCounter: { name: 'Show counter', control: 'boolean', description: 'The "2 / 6" badge on the main image.', table: { category: 'Parts' } },
    showCaption: { name: 'Show caption', control: 'boolean', description: 'The caption under the main image.', table: { category: 'Parts' } },
    width: { name: 'Width', control: { type: 'range', min: 276, max: 720, step: 4 }, description: 'Width of the column in px.', table: { category: 'Gallery' } },
  },
  render: ({ images, width, ...rest }) => (
    <div style={{ width }} className="max-w-full">
      <ImageGallery label="Product photos" images={all.slice(0, images)} {...rest} />
    </div>
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Controlled use: the parent shows which image is open (what a Lightbox hook-up looks like). */
export const OpensFullScreen: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const [opened, setOpened] = React.useState<number | null>(null);
    return (
      <div className="w-[480px] max-w-full">
        <ImageGallery label="Product photos" images={all} onImageClick={setOpened} />
        <p className="mt-3 text-sm leading-5 text-muted-foreground">{opened === null ? 'Click the main image.' : `Opened image ${opened + 1} full screen.`}</p>
      </div>
    );
  },
};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  render: () => {
    const onIndexChange = fn();
    return (
      <div className="w-[480px] max-w-full">
        <ImageGallery label="Product photos" images={all} onIndexChange={onIndexChange} />
      </div>
    );
  },
  play: async ({ canvas }) => {
    const gallery = canvas.getByRole('group', { name: 'Product photos' });
    await expect(gallery).toHaveAttribute('aria-roledescription', 'carousel');
    await expect(canvas.getByText('1 / 6')).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Previous image' })).toBeDisabled();
    await userEvent.click(canvas.getByRole('button', { name: 'Next image' }));
    await waitFor(() => expect(canvas.getByText('2 / 6')).toBeVisible());
    await expect(canvas.getByRole('button', { name: /^Show image 2/ })).toHaveAttribute('aria-current', 'true');
    // Keyboard: arrows work from a focused thumbnail.
    canvas.getByRole('button', { name: /^Show image 2/ }).focus();
    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => expect(canvas.getByText('3 / 6')).toBeVisible());
    await userEvent.keyboard('{End}');
    await waitFor(() => expect(canvas.getByText('6 / 6')).toBeVisible());
    await expect(canvas.getByRole('button', { name: 'Next image' })).toBeDisabled();
    await userEvent.keyboard('{Home}');
    await waitFor(() => expect(canvas.getByText('1 / 6')).toBeVisible());
    await userEvent.click(canvas.getByRole('button', { name: /^Show image 4/ }));
    await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('Image 4 of 6'));
  },
};

const onOpen = fn();

export const OpenCheck: Story = {
  tags: ['!dev'],
  render: () => (
    <div className="w-[480px] max-w-full">
      <ImageGallery label="Product photos" images={all} onImageClick={onOpen} loop />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Previous image' })).toBeEnabled();
    await userEvent.click(canvas.getByRole('button', { name: 'Previous image' }));
    await waitFor(() => expect(canvas.getByText('6 / 6')).toBeVisible());
    await userEvent.click(canvas.getByRole('button', { name: /^Open image full screen/ }));
    await expect(onOpen).toHaveBeenCalledWith(5);
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => (
    <ImageGallery
      label="Long names"
      images={[
        { alt: 'A photograph with a very long description that should never push the layout wider than its column', caption: 'A caption that is far too long to fit on one line in a narrow column of the page' },
        ...all,
        ...all,
      ]}
    />
  ),
  play: async ({ canvas }) => {
    const gallery = canvas.getByRole('group', { name: 'Long names' });
    await expect(gallery.scrollWidth).toBeLessThanOrEqual(gallery.clientWidth + 1);
    await expect(canvas.getByText('1 / 13')).toBeVisible();
    // Many thumbnails scroll inside the strip, not the page.
    const strip = gallery.querySelector<HTMLElement>('[data-slot="image-gallery-thumbnails"]')!;
    await expect(strip.scrollWidth).toBeGreaterThan(strip.clientWidth);
  },
};

export const DefaultDark: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
