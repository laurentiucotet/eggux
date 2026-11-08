import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';
import { Clock, Globe } from '@/components/icons';
import { Badge } from './badge';
import { Button } from './button';
import { EventCard } from './event-card';
import { ImagePlaceholder } from './image-placeholder';
import { MetaItem } from './meta-item';

const date = { month: 'NOV', day: '12', dateTime: '2026-11-12', label: '12 November 2026' };
const tags = (
  <>
    <Badge variant="secondary">Webinar</Badge>
    <Badge variant="secondary">Online</Badge>
  </>
);
const meta2 = (
  <>
    <MetaItem icon={<Clock />}>15:00-16:00 CET</MetaItem>
    <MetaItem icon={<Globe />}>Online</MetaItem>
  </>
);
const title = 'Close the books in five days';

const meta = {
  title: 'Components/Card/Event Card',
  component: EventCard,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'One event in a list (horizontal) or grid (vertical, with image). The whole card links to the event page through the title link; the action is the only other control and its label names the event. Vertical Date position=image puts the Date Tile over the image corner (needs an image). Time always with its time zone. Figma: Card page / Event Card. Guide: eggux build-ui/components/card.md' } },
  },
  args: {
    date,
    title,
    href: '#close-the-books',
    tags,
    meta: meta2,
    actions: <Button variant="outline" size="sm" aria-label={`Register for ${title}`}>Register</Button>,
  },
} satisfies Meta<typeof EventCard>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();
const root = (el: HTMLElement) => el.querySelector('[data-slot="event-card"]') as HTMLElement;

// Figma Layout=horizontal: 640 wide, 16 padding, Date Tile 56, title 20/28.
export const Default: Story = {
  play: async ({ canvas, canvasElement }) => {
    const el = root(canvasElement);
    await expect(Math.round(box(el).width)).toBe(640);
    await expect(Math.round(box(canvasElement.querySelector('time')!).width)).toBe(56);
    await expect(canvas.getByRole('link', { name: title })).toHaveAttribute('href', '#close-the-books');
    await expect(canvas.getByRole('button', { name: `Register for ${title}` })).toBeVisible();
    await expect(Math.round(box(canvas.getByRole('button', { name: /Register/ })).height)).toBe(32);
    await expect(canvasElement.querySelector('time')).toHaveTextContent('12 November 2026');
    await expect(canvas.getByRole('heading', { name: title })).toBeVisible();
    // The title link is stretched over the card: it is the one link.
    await expect(canvas.getAllByRole('link')).toHaveLength(1);
  },
};

// Keyboard: Tab reaches the link, then the action; Enter on the link goes to the event.
export const Keyboard: Story = {
  play: async ({ canvas }) => {
    await userEvent.tab();
    await expect(canvas.getByRole('link', { name: title })).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: /Register/ })).toHaveFocus();
  },
};

// Layout=vertical, Date position=text: 352 wide, 16:9 image on top, Date Tile next to the title.
export const Vertical: Story = {
  args: { layout: 'vertical', datePosition: 'text', image: <ImagePlaceholder ratio="16:9" /> },
  play: async ({ canvasElement }) => {
    const el = root(canvasElement);
    await expect(Math.round(box(el).width)).toBe(352);
    const img = canvasElement.querySelector('[data-slot="image-placeholder"]') as HTMLElement;
    await expect(Math.round(box(img).width)).toBe(318);
    await expect(Math.abs(box(img).height - (318 * 9) / 16)).toBeLessThan(1);
    await expect(Math.round(box(canvasElement.querySelector('time')!).width)).toBe(56);
    // The Date Tile sits next to the title (Figma height 397; the title wraps to two lines in this font, so the card is taller).
    await expect(box(canvasElement.querySelector('time')!).right).toBeLessThanOrEqual(box(canvasElement.querySelector('[data-slot="event-card-text"]')!).left);
  },
};

// Date position=image: the sm Date Tile (44) sits over the top-left corner of the image, inset 12.
export const DateOnImage: Story = {
  args: { layout: 'vertical', datePosition: 'image', image: <ImagePlaceholder ratio="16:9" /> },
  play: async ({ canvasElement }) => {
    const img = canvasElement.querySelector('[data-slot="event-card-image"]') as HTMLElement;
    const tile = img.querySelector('time') as HTMLElement;
    await expect(Math.round(box(tile).width)).toBe(44);
    await expect(Math.round(box(tile).left - box(img).left)).toBe(12);
    await expect(Math.round(box(tile).top - box(img).top)).toBe(12);
    await expect(Math.abs(box(root(canvasElement)).height - 395)).toBeLessThan(12);
  },
};

// Past event: a Recorded badge and "Watch the recording", the tile stays the same.
export const Past: Story = {
  args: {
    tags: <><Badge variant="secondary">Webinar</Badge><Badge variant="soft-neutral">Recorded</Badge></>,
    actions: <Button variant="outline" size="sm" aria-label={`Watch the recording of ${title}`}>Watch the recording</Button>,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Recorded')).toBeVisible();
    await expect(canvas.getByRole('button', { name: `Watch the recording of ${title}` })).toBeVisible();
  },
};

// Stress test: a long title is cut at 2 lines; the card never overflows in 276 and 368 columns.
const longTitle = 'Closing the books in five days: the approvals, bank matching and accruals every finance team should automate this year';
export const LongTitleNarrow: Story = {
  args: { layout: 'vertical', title: longTitle, image: <ImagePlaceholder ratio="16:9" />, actions: <Button variant="outline" size="sm" aria-label={`Register for ${longTitle}`}>Register</Button> },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  play: async ({ canvas, canvasElement }) => {
    const el = root(canvasElement);
    await expect(Math.round(box(el).width)).toBe(276);
    await expect(el.scrollWidth).toBeLessThanOrEqual(el.clientWidth);
    const link = canvas.getByRole('link');
    await expect(Math.round(box(link).height)).toBeLessThanOrEqual(56);
  },
};
export const LongTitleHorizontal368: Story = {
  args: { title: longTitle, actions: <Button variant="outline" size="sm" aria-label="Register">Register</Button> },
  decorators: [Story => <div className="w-[368px]"><Story /></div>],
  play: async ({ canvasElement }) => {
    const el = root(canvasElement);
    await expect(Math.round(box(el).width)).toBe(368);
    await expect(el.scrollWidth).toBeLessThanOrEqual(el.clientWidth);
  },
};

const Both = () => (
  <div className="flex flex-col gap-6">
    <EventCard {...meta.args} />
    <EventCard {...meta.args} layout="vertical" datePosition="image" image={<ImagePlaceholder ratio="16:9" />} />
  </div>
);
export const BothLight: Story = { parameters: { controls: { disable: true } }, render: () => <Both />, name: 'Both layouts' };
export const BothDark: Story = { parameters: { controls: { disable: true } }, render: () => <Both />, tags: ['!dev'], globals: { theme: 'Dark' }, name: 'Both layouts (Dark)' };
export const BothCorporate: Story = { parameters: { controls: { disable: true } }, render: () => <Both />, tags: ['!dev'], globals: { theme: 'Corporate Light' }, name: 'Both layouts (Corporate Light)' };
