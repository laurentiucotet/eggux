import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Button } from './button';
import { Lightbox, type LightboxImage } from './lightbox';

type Args = { images: number; showCaption: boolean; showCounter: boolean; loop: boolean; open: boolean };

const all: LightboxImage[] = [
  { alt: 'Oak desk seen from the front', caption: 'Oak desk, front view' },
  { alt: 'Oak desk, drawer open', caption: 'Drawer open, felt lining' },
  { alt: 'Close-up of the oak grain', caption: 'Oiled oak grain' },
  { alt: 'Desk in a bright office', caption: 'In a bright office' },
  { alt: 'Cable tray under the desk', caption: 'Cable tray underneath' },
  { alt: 'Desk packed for delivery', caption: 'Flat-pack, 28 kg' },
];

const meta = {
  title: 'Components/Media/Lightbox',
  parameters: {
    docs: {
      description: {
        component:
          'A full-screen image viewer in the Dialog: previous and next, a counter, a caption and Close. Left and Right arrows change the image, Escape or Close closes it and focus returns to the control that opened it. Use it to look closer at a photo from a Gallery or Photo Grid. Code only (no Figma component yet).',
      },
    },
  },
  args: { images: 6, showCaption: true, showCounter: true, loop: false, open: false },
  argTypes: {
    images: { name: 'Images', control: { type: 'range', min: 1, max: 6, step: 1 }, description: 'How many images the viewer holds.', table: { category: 'Viewer' } },
    loop: { name: 'Loop', control: 'boolean', description: 'Next on the last image goes to the first.', table: { category: 'Viewer' } },
    open: { name: 'Open', control: 'boolean', description: 'Start with the viewer open.', table: { category: 'Viewer' } },
    showCaption: { name: 'Show caption', control: 'boolean', description: 'The caption under the image.', table: { category: 'Parts' } },
    showCounter: { name: 'Show counter', control: 'boolean', description: 'The "2 / 6" counter in the title row.', table: { category: 'Parts' } },
  },
  render: ({ images, open, ...rest }) => (
    <Lightbox
      key={`${images}-${open}`}
      label="Product photos"
      images={all.slice(0, images)}
      defaultOpen={open}
      trigger={<Button variant="outline">View photos</Button>}
      {...rest}
    />
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  play: async ({ canvas, canvasElement }) => {
    const trigger = canvas.getByRole('button', { name: 'View photos' });
    await userEvent.click(trigger);
    const dialog = await within(canvasElement.ownerDocument.body).findByRole('dialog', { name: 'Product photos' });
    const view = within(dialog);
    await expect(view.getByText('1 / 6')).toBeVisible();
    await expect(view.getByText('Oak desk, front view')).toBeVisible();
    await expect(view.getByRole('button', { name: 'Previous image' })).toBeDisabled();
    await userEvent.click(view.getByRole('button', { name: 'Next image' }));
    await waitFor(() => expect(view.getByText('2 / 6')).toBeVisible());
    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => expect(view.getByText('3 / 6')).toBeVisible());
    await userEvent.keyboard('{End}');
    await waitFor(() => expect(view.getByText('6 / 6')).toBeVisible());
    await expect(view.getByRole('button', { name: 'Next image' })).toBeDisabled();
    await userEvent.keyboard('{ArrowLeft}');
    await waitFor(() => expect(view.getByText('5 / 6')).toBeVisible());
    // Escape closes and focus returns to the trigger.
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(canvasElement.ownerDocument.body.querySelector('[role="dialog"]')).toBeNull());
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

export const CloseCheck: Story = {
  tags: ['!dev'],
  play: async ({ canvas, canvasElement }) => {
    const trigger = canvas.getByRole('button', { name: 'View photos' });
    await userEvent.click(trigger);
    const dialog = await within(canvasElement.ownerDocument.body).findByRole('dialog', { name: 'Product photos' });
    await userEvent.click(within(dialog).getByRole('button', { name: 'Close' }));
    await waitFor(() => expect(canvasElement.ownerDocument.body.querySelector('[role="dialog"]')).toBeNull());
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

/** The viewer opens at a chosen image, as from a thumbnail click. */
export const FromThumbnail: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const [index, setIndex] = React.useState(0);
    const [open, setOpen] = React.useState(false);
    return (
      <>
        <div className="flex max-w-full flex-wrap gap-2">
          {all.slice(0, 4).map((image, i) => (
            <Button
              key={image.alt}
              variant="outline"
              size="sm"
              onClick={() => {
                setIndex(i);
                setOpen(true);
              }}
            >
              Photo {i + 1}
            </Button>
          ))}
        </div>
        <Lightbox label="Product photos" images={all} open={open} onOpenChange={setOpen} index={index} onIndexChange={setIndex} />
      </>
    );
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => (
    <Lightbox
      label="A viewer title that is far too long to fit next to the counter and the close button in a narrow screen"
      images={[{ alt: 'Long caption photo', caption: 'A caption that is far too long to fit on one line in a narrow column of the page, so it wraps' }, ...all]}
      defaultOpen
    />
  ),
  play: async ({ canvasElement }) => {
    const dialog = await within(canvasElement.ownerDocument.body).findByRole('dialog');
    await expect(dialog.scrollWidth).toBeLessThanOrEqual(dialog.clientWidth + 1);
    await expect(within(dialog).getByRole('button', { name: 'Close' })).toBeVisible();
    await expect(within(dialog).getByText('1 / 7')).toBeVisible();
  },
};

const openCopy = { args: { open: true } };
export const DefaultDark: Story = { ...openCopy, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...openCopy, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
