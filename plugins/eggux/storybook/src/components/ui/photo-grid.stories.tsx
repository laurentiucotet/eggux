import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { PhotoGrid, type Photo } from './photo-grid';

type Args = { layout: 'masonry' | 'rows'; photos: number; columns: number; rowHeight: number; captions: 'always' | 'hover' | 'off'; max: number; width: number };

const all: Photo[] = [
  { alt: 'Team at the kick-off workshop', caption: 'Kick-off workshop', aspect: 1.5 },
  { alt: 'Whiteboard full of sticky notes', caption: 'Sticky notes', aspect: 0.75 },
  { alt: 'Laptop and coffee on a desk', caption: 'Desk setup', aspect: 1 },
  { alt: 'Office entrance with the Acme sign', caption: 'Office entrance', aspect: 1.5 },
  { alt: 'Lunch table with eight chairs', caption: 'Team lunch', aspect: 1.78 },
  { alt: 'Stairs leading up to the studio', caption: 'Studio stairs', aspect: 0.75 },
  { alt: 'Two colleagues reviewing a design', caption: 'Design review', aspect: 1.5 },
  { alt: 'Plant on a window sill', caption: 'Window sill', aspect: 1 },
  { alt: 'Printed posters on a wall', caption: 'Poster wall', aspect: 1.33 },
  { alt: 'Bicycles parked outside', caption: 'Bike rack', aspect: 1.5 },
];

const meta = {
  title: 'Components/Media/Photo Grid',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A photo grid in two layouts: masonry (each photo keeps its ratio) and rows (justified rows of one height), with optional captions over the photos and a "+N more" tile that shows the rest. With onPhotoClick every photo is a button, for a Lightbox. Code only (no Figma component yet).',
      },
    },
  },
  args: { layout: 'masonry', photos: 10, columns: 3, rowHeight: 120, captions: 'always', max: 0, width: 560 },
  argTypes: {
    layout: { name: 'Layout', control: 'inline-radio', options: ['masonry', 'rows'], description: 'Masonry columns or justified rows.', table: { category: 'Grid' } },
    photos: { name: 'Photos', control: { type: 'range', min: 1, max: 10, step: 1 }, description: 'How many photos the grid holds.', table: { category: 'Grid' } },
    columns: { name: 'Columns', control: { type: 'range', min: 1, max: 5, step: 1 }, description: 'Masonry only: number of columns.', table: { category: 'Grid' } },
    rowHeight: { name: 'Row height', control: { type: 'range', min: 80, max: 220, step: 10 }, description: 'Rows only: target height of a row in px.', table: { category: 'Grid' } },
    max: { name: 'Show at most', control: { type: 'range', min: 0, max: 9, step: 1 }, description: 'Photos before the "+N more" tile (0 shows all).', table: { category: 'Grid' } },
    captions: { name: 'Captions', control: 'inline-radio', options: ['always', 'hover', 'off'], description: 'Caption over the bottom of each photo.', table: { category: 'Parts' } },
    width: { name: 'Width', control: { type: 'range', min: 276, max: 800, step: 4 }, description: 'Width of the column in px.', table: { category: 'Grid' } },
  },
  render: ({ photos, width, max, ...rest }) => (
    <div style={{ width }} className="max-w-full">
      <PhotoGrid key={max} label="Team photos" photos={all.slice(0, photos)} max={max} {...rest} />
    </div>
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Both layouts side by side, with the "+N more" tile. */
export const Layouts: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="grid w-[900px] max-w-full gap-8 md:grid-cols-2">
      <div className="min-w-0">
        <p className="mb-2 text-sm leading-5 font-medium">Masonry</p>
        <PhotoGrid label="Masonry photos" photos={all} columns={3} max={6} />
      </div>
      <div className="min-w-0">
        <p className="mb-2 text-sm leading-5 font-medium">Rows</p>
        <PhotoGrid label="Row photos" photos={all} layout="rows" max={6} />
      </div>
    </div>
  ),
};

/** Every photo is a button (for a Lightbox) and the page shows which one was opened. */
export const Clickable: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const [opened, setOpened] = React.useState<number | null>(null);
    return (
      <div className="w-[560px] max-w-full">
        <PhotoGrid label="Team photos" photos={all} layout="rows" max={7} captions="hover" onPhotoClick={setOpened} />
        <p className="mt-3 text-sm leading-5 text-muted-foreground">{opened === null ? 'Click a photo.' : `Opened: ${all[opened].alt}`}</p>
      </div>
    );
  },
};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  render: () => (
    <div className="w-[560px] max-w-full">
      <PhotoGrid label="Team photos" photos={all} max={6} />
    </div>
  ),
  play: async ({ canvas }) => {
    const grid = canvas.getByRole('group', { name: 'Team photos' });
    await expect(grid).toHaveAttribute('data-layout', 'masonry');
    // Five photos and the +4 tile in place of the sixth.
    await expect(canvas.getAllByRole('img')).toHaveLength(5);
    await expect(canvas.getByText('Kick-off workshop')).toBeVisible();
    const more = canvas.getByRole('button', { name: '+4 more, show all photos' });
    await expect(more).toHaveTextContent('+4 more');
    await userEvent.click(more);
    await waitFor(() => expect(canvas.getAllByRole('img')).toHaveLength(10));
    await expect(canvas.queryByRole('button', { name: /more, show all/ })).toBeNull();
  },
};

const onPhoto = fn();

export const ClickCheck: Story = {
  tags: ['!dev'],
  render: () => (
    <div className="w-[560px] max-w-full">
      <PhotoGrid label="Team photos" photos={all.slice(0, 6)} layout="rows" captions="hover" onPhotoClick={onPhoto} />
    </div>
  ),
  play: async ({ canvas }) => {
    const second = canvas.getByRole('button', { name: /^Open photo: Whiteboard full of sticky notes/ });
    second.focus();
    await userEvent.keyboard('{Enter}');
    await expect(onPhoto).toHaveBeenCalledWith(1);
    // Rows: photos of one row share one height.
    const first = canvas.getByRole('button', { name: /^Open photo: Team at the kick-off/ });
    await expect(Math.abs(first.getBoundingClientRect().height - canvas.getByRole('button', { name: /^Open photo: Laptop/ }).getBoundingClientRect().height)).toBeLessThan(40);
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => (
    <div className="grid gap-4">
      <PhotoGrid
        label="Narrow masonry"
        columns={2}
        max={4}
        photos={[{ alt: 'Long caption', caption: 'A caption that is far too long to fit in one small tile of the grid', aspect: 1 }, ...all]}
      />
      <PhotoGrid label="Narrow rows" layout="rows" rowHeight={100} photos={all.slice(0, 5)} />
    </div>
  ),
  play: async ({ canvas }) => {
    for (const name of ['Narrow masonry', 'Narrow rows']) {
      const grid = canvas.getByRole('group', { name });
      await expect(grid.scrollWidth).toBeLessThanOrEqual(grid.clientWidth + 1);
    }
    await expect(canvas.getByRole('button', { name: /^\+\d+ more/ })).toBeVisible();
  },
};

export const DefaultDark: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
