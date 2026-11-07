import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { Button } from './button';
import { Carousel, CarouselArrow, CarouselGallery, CarouselHero, CarouselIndicator, CarouselSlide, CarouselThumbnail } from './carousel';
import { ImagePlaceholder } from './image-placeholder';

const meta = {
  title: 'Components/Carousel/Carousel',
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Carousel: a row of slides with previous / next arrows (disabled at the ends), dots and swipe; Left / Right move while it has focus; slides are named "2 of 5" and the ones out of view are inert. Carousel Slide: caption or overlay. Carousel Gallery: a product or property gallery with overlay arrows, counter, thumbnails and a Lightbox (Esc closes, arrows move, focus stays inside). Carousel Hero: a timed banner with bars and Pause, held on hover and focus and off with reduced motion. Do not hide important content behind slide 2. Figma: Carousel page. Guide: eggux build-ui/components/carousel.md' } },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();
const places = ['Warehouse in Berlin', 'Office in Bucharest', 'Depot in Lyon', 'Hub in Rotterdam', 'Store in Milan'];

// Figma Type=single: 720 wide, 16:9 slide, arrows and 5 dots under it (457 high).
export const Single: Story = {
  render: () => (
    <div className="w-[720px]">
      <Carousel label="Our locations">
        {places.map(p => <CarouselSlide key={p} title={p} description="4,200 m², opened in 2024" alt={p} />)}
      </Carousel>
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    const carousel = canvas.getByRole('region', { name: 'Our locations' });
    await expect(carousel).toHaveAttribute('aria-roledescription', 'carousel');
    const prev = canvas.getByRole('button', { name: 'Previous slide' });
    const next = canvas.getByRole('button', { name: 'Next slide' });
    await expect(prev).toBeDisabled();
    await expect(canvas.getAllByRole('button', { name: /Go to slide/ })).toHaveLength(5);
    await expect(Math.round(box(canvasElement.querySelector('[data-slot="carousel-dot"][aria-current="true"]')!).width)).toBe(20);
    await userEvent.click(next);
    await expect(canvas.getByRole('button', { name: 'Go to slide 2' })).toHaveAttribute('aria-current', 'true');
    await expect(canvas.getByRole('group', { name: '2 of 5' })).not.toHaveAttribute('inert');
    await expect(canvas.getByRole('group', { name: '1 of 5', hidden: true })).toHaveAttribute('inert');
    // Keyboard on the carousel.
    next.focus();
    await userEvent.keyboard('{ArrowRight}{ArrowRight}{ArrowRight}');
    await expect(next).toBeDisabled();
    await expect(canvasElement.querySelector('[aria-live="polite"]')).toHaveTextContent('Slide 5 of 5');
    await userEvent.click(canvas.getByRole('button', { name: 'Go to slide 1' }));
    await expect(prev).toBeDisabled();
  },
};

const Product = ({ name }: { name: string }) => (
  <article className="flex w-full flex-col gap-3">
    <ImagePlaceholder ratio="1:1" alt="" showCaption={false} />
    <div className="flex flex-col gap-1">
      <h3 className="m-0 text-sm leading-5 font-medium">{name}</h3>
      <p className="m-0 text-xs leading-4 text-muted-foreground">Sand · 4 colors</p>
      <p className="m-0 text-sm leading-5 font-medium">€59.00</p>
    </div>
    <Button variant="outline" size="sm" className="w-full">Add to cart</Button>
  </article>
);

// Figma Type=multiple: 1152 wide, 264 slides 24 apart: 4 fit, so 8 products have 5 positions.
export const Multiple: Story = {
  render: () => (
    <div className="w-[1152px]">
      <Carousel label="Related products" type="multiple">
        {['Linen shirt', 'Wool coat', 'Denim jacket', 'Cotton tee', 'Silk scarf', 'Leather belt', 'Canvas bag', 'Knit hat'].map(n => <Product key={n} name={n} />)}
      </Carousel>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole('button', { name: /Go to slide/ })).toHaveLength(5);
    const first = canvas.getByRole('group', { name: '1 of 8' });
    await expect(Math.round(box(first).width)).toBe(264);
    await expect(canvas.getByRole('group', { name: '4 of 8' })).not.toHaveAttribute('inert');
    await expect(canvas.getByRole('group', { name: '5 of 8', hidden: true })).toHaveAttribute('inert');
    await userEvent.click(canvas.getByRole('button', { name: 'Next slide' }));
    await expect(canvas.getByRole('group', { name: '5 of 8' })).not.toHaveAttribute('inert');
  },
};

// Parts: arrows (outline, overlay, disabled), dots, bars with Pause, counter; caption and overlay slides; thumbnails.
export const Parts: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <CarouselArrow direction="previous" />
        <CarouselArrow direction="next" />
        <CarouselArrow direction="next" disabled />
        <div className="rounded-xl bg-[var(--video-background)] p-4"><div className="flex gap-3"><CarouselArrow direction="previous" variant="overlay" /><CarouselArrow direction="next" variant="overlay" /></div></div>
      </div>
      <div className="flex items-center gap-6">
        <CarouselIndicator count={5} index={0} />
        <div className="flex items-center gap-4 rounded-xl bg-neutral-500 p-4">
          <CarouselIndicator tone="overlay" count={5} index={1} />
          <CarouselIndicator type="bars" tone="overlay" count={4} index={1} progress={0.4} />
          <CarouselIndicator type="counter" tone="overlay" count={8} index={1} />
        </div>
        <CarouselIndicator type="counter" count={8} index={1} />
      </div>
      <div className="flex gap-2">
        <CarouselThumbnail alt="Front view" active />
        <CarouselThumbnail alt="Side view" />
      </div>
      <div className="grid w-[1464px] grid-cols-2 gap-6">
        <CarouselSlide title="Warehouse in Berlin" description="4,200 m², opened in 2024" />
        <CarouselSlide type="overlay" title="Close the month in days, not weeks" description="Invoices, approvals and reports in one place." action={{ label: 'See how it works', href: '#how' }} />
      </div>
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    await expect(Math.round(box(canvas.getAllByRole('button', { name: 'Previous slide' })[0]!).width)).toBe(36);
    await expect(canvas.getByRole('button', { name: 'Pause slides' })).toBeInTheDocument();
    await expect(canvasElement.querySelectorAll('[data-slot="carousel-bar-fill"]')[1]).toHaveStyle({ width: '16px' });
    await expect(canvas.getAllByText('Slide 2 of 8')).toHaveLength(2);
    await expect(canvas.getByRole('button', { name: 'Front view' })).toHaveAttribute('aria-current', 'true');
    const overlay = canvasElement.querySelector('[data-type="overlay"]')!;
    await expect(Math.round(box(overlay).height)).toBe(405);
    const caption = canvasElement.querySelector('figure[data-type="caption"]')!;
    await expect(Math.abs(Math.round(box(caption).height) - 461)).toBeLessThanOrEqual(2);
  },
};

const photos = Array.from({ length: 8 }, (_, i) => ({ alt: `Kitchen, photo ${i + 1}`, title: `Apartment in Cluj · photo ${i + 1}` }));
const onDownload = fn();

// Figma Gallery: 560 wide, 420 stage, counter, open viewer, 64 thumbnails; the Lightbox opens over it.
export const Gallery: Story = {
  render: () => <CarouselGallery label="Apartment photos" images={photos} defaultIndex={1} onDownload={onDownload} />,
  play: async ({ canvas, canvasElement }) => {
    const stage = canvasElement.querySelector('[data-slot="gallery-stage"]')!;
    await expect(Math.round(box(stage).width)).toBe(560);
    await expect(Math.round(box(stage).height)).toBe(420);
    await expect(canvas.getByText('Slide 2 of 8')).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: 'Kitchen, photo 4' }));
    await expect(canvas.getByText('Slide 4 of 8')).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: 'Open full screen' }));
    const dialog = await within(document.body).findByRole('dialog', { name: /Apartment in Cluj · photo 4/ });
    await userEvent.keyboard('{ArrowRight}');
    await expect(dialog).toHaveAccessibleName(/photo 5/);
    await userEvent.click(within(dialog).getByRole('button', { name: 'Download image' }));
    await expect(onDownload).toHaveBeenCalledWith(photos[4]);
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(within(document.body).queryByRole('dialog')).toBeNull());
    await expect(canvas.getByText('Slide 5 of 8')).toBeInTheDocument();
  },
};

const heroSlides = [
  { overline: 'New · October 2026', title: 'Close the month in days, not weeks', text: 'Invoices, approvals and reports in one place, for finance teams of every size.', action: { label: 'Start free trial', href: '#trial' } },
  { overline: 'Customers', title: 'How Northwind cut approvals to one day', text: 'A 40-person finance team, three countries, one workflow.', action: { label: 'Read the story', href: '#story' } },
  { overline: 'Webinar', title: 'Audit-ready reports in 20 minutes', text: 'Thu 12 Nov 2026, 15:00 CET.', action: { label: 'Save your seat', href: '#webinar' } },
  { overline: 'Security', title: 'SOC 2 Type II, now for every plan', action: { label: 'See the report', href: '#soc2' } },
];

// Figma Hero: 1440 × 560, bars with Pause, overlay arrows; Pause stops auto-advance.
export const Hero: Story = {
  render: () => <div className="w-[1440px]"><CarouselHero label="Highlights" slides={heroSlides} interval={7000} /></div>,
  play: async ({ canvas }) => {
    const hero = canvas.getByRole('region', { name: 'Highlights' });
    await expect(Math.round(box(hero).height)).toBe(560);
    await expect(canvas.getByRole('heading', { name: 'Close the month in days, not weeks' })).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Pause slides' }));
    await expect(canvas.getByRole('button', { name: 'Play slides' })).toBeInTheDocument();
    await userEvent.click(canvas.getAllByRole('button', { name: 'Next slide' })[0]!);
    await expect(canvas.getByRole('heading', { name: 'How Northwind cut approvals to one day' })).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Go to slide 4' }));
    await expect(canvas.getByRole('heading', { name: 'SOC 2 Type II, now for every plan' })).toBeVisible();
    await userEvent.click(canvas.getAllByRole('button', { name: 'Next slide' })[0]!);
    await expect(canvas.getByRole('heading', { name: 'Close the month in days, not weeks' })).toBeVisible();
  },
};

// Auto-advance with a short interval, held while the pointer is over it. Tests only.
export const HeroAutoAdvance: Story = {
  tags: ['!dev'],
  render: () => <div className="w-[1440px]"><CarouselHero label="Timed" slides={heroSlides.slice(0, 2)} interval={400} /></div>,
  play: async ({ canvas }) => {
    await waitFor(() => expect(canvas.getByRole('heading', { name: 'How Northwind cut approvals to one day' })).toBeVisible(), { timeout: 3000 });
  },
};

// One slide: no controls; narrow single carousel. Tests only.
export const EdgeCases: Story = {
  tags: ['!dev'],
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="w-[720px]"><Carousel label="One slide"><CarouselSlide title="Only one" /></Carousel></div>
      <div className="w-[276px]"><Carousel label="Narrow">{places.map(p => <CarouselSlide key={p} title={p} />)}</Carousel></div>
      <CarouselGallery label="Two photos" images={photos.slice(0, 2)} lightbox={false} />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(within(canvas.getByRole('region', { name: 'One slide' })).queryByRole('button')).toBeNull();
    const narrow = canvas.getByRole('region', { name: 'Narrow' });
    await expect(Math.round(box(within(narrow).getByRole('group', { name: '1 of 5' })).width)).toBe(276);
    await expect(within(canvas.getByRole('region', { name: 'Two photos' })).queryByRole('button', { name: 'Open full screen' })).toBeNull();
  },
};

const All = () => (
  <div className="flex flex-col gap-10">
    <div className="w-[720px]"><Carousel label="Our locations">{places.map(p => <CarouselSlide key={p} title={p} description="4,200 m²" />)}</Carousel></div>
    <CarouselGallery label="Apartment photos" images={photos} />
    <div className="w-[1440px]"><CarouselHero label="Highlights" slides={heroSlides} interval={0} /></div>
  </div>
);
export const AllDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' }, render: () => <All /> };
export const AllCorporate: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' }, render: () => <All /> };
