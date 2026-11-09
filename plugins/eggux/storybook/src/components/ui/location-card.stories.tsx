import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Clock, Phone } from '@/components/icons';
import { Badge } from './badge';
import { LocationCard } from './location-card';
import { MetaItem } from './meta-item';

const metaItems = (
  <>
    <MetaItem icon={<Phone />}><a href="tel:+49305550100" className="hover:underline">+49 30 555 0100</a></MetaItem>
    <MetaItem icon={<Clock />}>Mon-Fri, 9:00-18:00 CET</MetaItem>
  </>
);

const meta = {
  title: 'Components/Card/Location Card',
  component: LocationCard,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'One office, store or venue: city (heading), optional tag, address in an <address>, phone and hours as Meta Items, and a Get directions link that names the place and opens a new tab. Show map is a slot (the Map component is not in code yet): the written address stays either way. Same fields in every card of a grid. Figma: Card page / Location Card. Guide: eggux build-ui/components/card.md' } },
  },
  args: {
    city: 'Berlin',
    address: 'Friedrichstraße 68, 10117 Berlin, Germany',
    tag: <Badge variant="secondary">Headquarters</Badge>,
    meta: metaItems,
    directionsHref: 'https://maps.example.com/?q=Friedrichstra%C3%9Fe+68+Berlin',
    directionsLabel: 'Berlin office',
  },
} satisfies Meta<typeof LocationCard>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();

// Figma: 320 x 204, padding 20, gap 12.
export const Default: Story = {
  play: async ({ canvas, canvasElement }) => {
    const el = canvasElement.querySelector('[data-slot="location-card"]') as HTMLElement;
    await expect(Math.round(box(el).width)).toBe(320);
    await expect(Math.round(box(el).height)).toBe(204);
    await expect(canvas.getByRole('heading', { name: 'Berlin' })).toBeVisible();
    await expect(canvasElement.querySelector('address')).toHaveTextContent('Friedrichstraße 68, 10117 Berlin, Germany');
    const link = canvas.getByRole('link', { name: /Get directions to Berlin office/ });
    await expect(link).toHaveAccessibleName(/opens in a new tab/);
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(Math.round(box(link).height)).toBe(32);
    await expect(canvas.getByRole('link', { name: '+49 30 555 0100' })).toHaveAttribute('href', 'tel:+49305550100');
  },
};

export const NoTag: Story = {
  args: { tag: undefined },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('[data-slot="badge"]')).toBeNull();
  },
};

// Show map: a 180 high map at the top with the card radius on top. The map names the place.
export const WithMap: Story = {
  args: { map: <div role="img" aria-label="Map of the Berlin office" className="size-full bg-muted" /> },
  play: async ({ canvas, canvasElement }) => {
    const map = canvasElement.querySelector('[data-slot="location-card-map"]') as HTMLElement;
    await expect(Math.round(box(map).height)).toBe(180);
    await expect(canvas.getByRole('img', { name: 'Map of the Berlin office' })).toBeVisible();
    await expect(Math.round(box(canvasElement.querySelector('[data-slot="location-card"]')!).height)).toBe(384);
    await expect(canvasElement.querySelector('address')).toBeVisible();
  },
};

// Stress test: long city and address wrap; a long tag truncates; no overflow at 276.
export const LongTextNarrow: Story = { tags: ['!dev'],
  args: {
    city: 'Frankfurt am Main, Hauptverwaltung und Rechenzentrum',
    address: 'Taunusanlage 1, Skyper Tower, Etage 12 bis 15, 60329 Frankfurt am Main, Hessen, Germany',
    tag: <Badge variant="secondary">Headquarters and data center</Badge>,
  },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[data-slot="location-card"]') as HTMLElement;
    await expect(Math.round(box(el).width)).toBe(276);
    await expect(el.scrollWidth).toBeLessThanOrEqual(el.clientWidth);
  },
};
export const Narrow368Grid: Story = { tags: ['!dev'],
  decorators: [Story => <div className="w-[368px]"><Story /></div>],
  play: async ({ canvasElement }) => {
    await expect(Math.round(box(canvasElement.querySelector('[data-slot="location-card"]')!).width)).toBe(320);
  },
};

export const DefaultDark: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
