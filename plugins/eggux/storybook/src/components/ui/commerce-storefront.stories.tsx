import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { CategoryTiles, Incentives, ProductCarousel, PromoSection, StoreFooter, StoreNavbar, StorefrontHero } from './commerce-storefront';

const meta = {
  title: 'Blocks/Commerce/Storefront',
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'Store home parts, in page order: Store Navbar (announcement, categories, search, cart with count), Storefront Hero (photo, rating, category links), Incentives (service promises), Product Carousel (bestsellers with ratings), Category Tiles, Promo Section (one dated offer with its countdown) and Store Footer (first-order newsletter, payment methods, country and currency). Figma: BLOCKS / Commerce (Storefront). Guide: eggux build-ui/patterns/commerce.md' } },
  },
} satisfies Meta;
export default meta;

const cat = (category: string) => ({ table: { category } });
const text = (name: string, description: string, category = 'Content') => ({ name, control: 'text' as const, description, ...cat(category) });
const bool = (name: string, description: string, category = 'Content') => ({ name, control: 'boolean' as const, description, ...cat(category) });
const NOW = '2026-11-27T09:22:48Z';

type NavArgs = { announcement: string; cartCount: number; searchPlaceholder: string };
export const Navbar: StoryObj<NavArgs> = {
  name: 'Store Navbar',
  args: { announcement: 'Free delivery over €60 and 30-day free returns', cartCount: 2, searchPlaceholder: 'Search products' },
  argTypes: {
    announcement: text('Announcement', 'Announcement Banner message; empty hides it.'),
    cartCount: { name: 'Cart count', control: { type: 'range', min: 0, max: 20 }, description: 'Items in the cart; the count hides at zero.', ...cat('Content') },
    searchPlaceholder: text('Search placeholder', 'Names what is searched.'),
  },
  render: a => <StoreNavbar announcement={a.announcement} cartCount={a.cartCount} searchPlaceholder={a.searchPlaceholder} />,
};

type HeroArgs = { overline: string; title: string; description: string; showRating: boolean; showCategories: boolean };
export const Hero: StoryObj<HeroArgs> = {
  name: 'Storefront Hero',
  args: { overline: 'Autumn / Winter 2026', title: 'Layers for the long walk home', description: 'Wool-blend coats, heavyweight knits and waterproof boots, designed to last ten winters. Free delivery over €60.', showRating: true, showCategories: true },
  argTypes: {
    overline: text('Overline', 'Season or collection.'),
    title: text('Title', 'h1: what the store sells.'),
    description: text('Description', 'Lead: materials and the delivery promise.'),
    showRating: bool('Show rating', 'Rating card on the photo.'),
    showCategories: bool('Show categories', 'Three category links under the actions.'),
  },
  render: a => <StorefrontHero overline={a.overline} title={a.title} description={a.description} rating={a.showRating ? undefined : null} categories={a.showCategories ? undefined : []} />,
};

type StripArgs = { label: string };
export const IncentivesStory: StoryObj<StripArgs> = {
  name: 'Incentives',
  args: { label: 'Why shop with Acme' },
  argTypes: { label: text('Label', 'Name of the section for screen readers (no visible title).') },
  render: a => <Incentives label={a.label} />,
};

type CarouselArgs = { overline: string; title: string; description: string; showRating: boolean };
export const Carousel: StoryObj<CarouselArgs> = {
  name: 'Product Carousel',
  args: { overline: 'You may also like', title: 'Pairs well with what is in your bag', description: 'Picked from what customers bought together this month, with ratings from verified buyers.', showRating: true },
  argTypes: {
    overline: text('Overline', 'Section Header overline.', 'Section Header'),
    title: text('Title', 'Section Header title (h2).', 'Section Header'),
    description: text('Description', 'Section Header description.', 'Section Header'),
    showRating: bool('Show rating', 'Rating under every card, or under none.'),
  },
  render: a => <ProductCarousel overline={a.overline} title={a.title} description={a.description} showRating={a.showRating} />,
};

type TilesArgs = { overline: string; title: string; description: string; showAllLink: boolean };
export const Tiles: StoryObj<TilesArgs> = {
  name: 'Category Tiles',
  args: { overline: 'Shop by category', title: 'Everyday clothes in natural fibres', description: 'Sized XS to XXL, with free exchanges on every order.', showAllLink: true },
  argTypes: {
    overline: text('Overline', 'Section Header overline.', 'Section Header'),
    title: text('Title', 'Section Header title (h2).', 'Section Header'),
    description: text('Description', 'Section Header description.', 'Section Header'),
    showAllLink: bool('Show all link', '"View all categories" next to the header.'),
  },
  render: a => <CategoryTiles overline={a.overline} title={a.title} description={a.description} allLink={a.showAllLink ? undefined : null} />,
};

type PromoArgs = { title: string; description: string; endsAt: string; finePrint: string };
export const Promo: StoryObj<PromoArgs> = {
  name: 'Promo Section',
  args: { title: 'Mid-season sale: up to 30% off knitwear', description: 'Merino jumpers, cardigans and scarves, reduced while sizes last. Prices already include the discount.', endsAt: '2026-11-29T23:59:00Z', finePrint: 'Discount shown at checkout on marked items. Free returns still apply.' },
  argTypes: {
    title: text('Title', 'h2: the offer.'),
    description: text('Description', 'What is reduced and how.'),
    endsAt: text('Ends at', 'ISO date and time: the badge and the countdown both read it.'),
    finePrint: text('Fine print', 'Terms under the actions.'),
  },
  render: a => <PromoSection title={a.title} description={a.description} endsAt={a.endsAt} now={NOW} finePrint={a.finePrint} />,
};

type FooterArgs = { newsletterTitle: string; copyright: string };
export const Footer: StoryObj<FooterArgs> = {
  name: 'Store Footer',
  args: { newsletterTitle: 'Get 10% off your first order', copyright: '© 2026 Acme Apparel Ltd. Prices include VAT.' },
  argTypes: {
    newsletterTitle: text('Newsletter title', 'What subscribers get.'),
    copyright: text('Copyright', 'Legal line; say that prices include VAT.'),
  },
  render: a => <StoreFooter newsletterTitle={a.newsletterTitle} copyright={a.copyright} />,
};

/* Hidden checks */

const box = (el: Element) => el.getBoundingClientRect();
const r = (n: number) => Math.round(n);
const slot = (root: Element, name: string) => root.querySelector(`[data-slot="${name}"]`)!;
const items = (root: Element, name: string) => [...root.querySelectorAll(`[data-slot="${name}"]`)];
const tops = (els: Element[]) => new Set(els.map(e => r(box(e).top))).size;

const All = ({ width }: { width: number }) => (
  <div className="flex flex-col" style={{ width }}>
    <StoreNavbar />
    <main>
      <StorefrontHero />
      <Incentives />
      <ProductCarousel />
      <CategoryTiles />
      <PromoSection now={NOW} />
    </main>
    <StoreFooter />
  </div>
);

async function common(root: HTMLElement, width: number) {
  const c = within(root);
  await expect(c.getAllByRole('heading', { level: 1 })).toHaveLength(1);
  await expect(c.getByRole('banner')).toBeInTheDocument();
  await expect(c.getByRole('contentinfo')).toBeInTheDocument();
  for (const name of ['Layers for the long walk home', 'Pairs well with what is in your bag', 'Everyday clothes in natural fibres', 'Mid-season sale: up to 30% off knitwear']) {
    await expect(c.getByRole('region', { name })).toBeInTheDocument();
  }
  await expect(c.getByRole('heading', { level: 2, name: 'Mid-season sale: up to 30% off knitwear' })).toBeInTheDocument();
  await expect(c.getByRole('heading', { level: 2, name: 'Get 10% off your first order' })).toBeInTheDocument();
  for (const el of [...c.queryAllByRole('link'), ...c.queryAllByRole('button')]) await expect(el).toHaveAccessibleName();
  for (const img of root.querySelectorAll('img')) await expect(img.hasAttribute('alt')).toBe(true);
  await expect(c.getByRole('list', { name: 'Why shop with Acme' }).children).toHaveLength(4);
  await expect(c.getByRole('list', { name: 'Accepted payment methods' }).children).toHaveLength(6);
  // The badge and the countdown read the same end date.
  await expect(c.getByText('Ends Sunday 29 November')).toBeInTheDocument();
  await expect((root.firstElementChild as HTMLElement).scrollWidth).toBeLessThanOrEqual(width);
}

export const Check1440: StoryObj = {
  tags: ['!dev'],
  render: () => <All width={1440} />,
  play: async ({ canvasElement }) => {
    await common(canvasElement, 1440);
    const c = within(canvasElement);
    await expect(c.getByRole('link', { name: 'Cart, 2 items' })).toBeInTheDocument();
    // Navbar: banner 40 over the 61 bar.
    await expect(r(box(slot(canvasElement, 'store-navbar')).height)).toBe(101);
    // Hero: 720 photo and 720 content side by side, 720 high.
    const hero = c.getByRole('region', { name: 'Layers for the long walk home' });
    await expect(r(box(slot(hero, 'storefront-hero-media')).width)).toBe(720);
    await expect(r(box(hero).height)).toBe(720);
    await expect(r(box(c.getByRole('link', { name: /Coats and jackets/ })).width)).toBe(181);
    // Incentives: 182 high, four in a row.
    const inc = c.getByRole('region', { name: 'Why shop with Acme' });
    await expect(r(box(inc).height)).toBe(182);
    await expect(tops(items(inc, 'trust-badge'))).toBe(1);
    await expect(r(box(items(inc, 'trust-badge')[0]!).width)).toBe(270);
    // Tiles: four 270 tiles, 24 apart, 96 padding.
    const tiles = c.getByRole('region', { name: 'Everyday clothes in natural fibres' });
    const t = items(tiles, 'category-tile');
    await expect(tops(t)).toBe(1);
    await expect(r(box(t[0]!).width)).toBe(270);
    await expect(r(box(t[1]!).left - box(t[0]!).right)).toBe(24);
    await expect(r(box(slot(tiles, 'store-section-header')).top - box(tiles).top)).toBe(96);
    // Carousel: 252 cards, 24 apart, four fully visible in 1152.
    const car = c.getByRole('region', { name: 'Pairs well with what is in your bag' });
    const cards = items(car, 'product-carousel-item');
    await expect(r(box(cards[0]!).width)).toBe(252);
    await expect(r(box(cards[1]!).left - box(cards[0]!).right)).toBe(24);
    // Promo: 1152 panel, 560 photo.
    const promo = c.getByRole('region', { name: 'Mid-season sale: up to 30% off knitwear' });
    await expect(r(box(slot(promo, 'promo-panel')).width)).toBe(1152);
    await expect(r(box(slot(promo, 'promo-panel').lastElementChild!).width)).toBe(560);
    // Footer: newsletter 1152, columns in one row.
    await expect(r(box(slot(canvasElement, 'store-footer-newsletter')).width)).toBe(1152);
    const navs = ['Shop', 'Help', 'Company', 'Legal'].map(n => c.getByRole('navigation', { name: n }));
    await expect(tops(navs)).toBe(1);
  },
};

export const Check768: StoryObj = {
  tags: ['!dev'],
  render: () => <All width={768} />,
  play: async ({ canvasElement }) => {
    await common(canvasElement, 768);
    const c = within(canvasElement);
    const hero = c.getByRole('region', { name: 'Layers for the long walk home' });
    await expect(box(slot(hero, 'storefront-hero-content')).top).toBeGreaterThanOrEqual(box(slot(hero, 'storefront-hero-media')).bottom - 1);
    await expect(tops(items(c.getByRole('region', { name: 'Everyday clothes in natural fibres' }), 'category-tile'))).toBe(2);
    await expect(tops(items(c.getByRole('region', { name: 'Why shop with Acme' }), 'trust-badge'))).toBe(2);
    const promo = c.getByRole('region', { name: 'Mid-season sale: up to 30% off knitwear' });
    await expect(box(slot(promo, 'promo-panel').lastElementChild!).top).toBeGreaterThan(box(slot(promo, 'promo-content')).top);
  },
};

export const Check390: StoryObj = {
  tags: ['!dev'],
  render: () => <All width={390} />,
  play: async ({ canvasElement }) => {
    await common(canvasElement, 390);
    const c = within(canvasElement);
    await expect(c.getByRole('button', { name: 'Menu' })).toBeInTheDocument();
    await expect(tops(items(c.getByRole('region', { name: 'Everyday clothes in natural fibres' }), 'category-tile'))).toBe(4);
    await expect(tops(items(c.getByRole('region', { name: 'Why shop with Acme' }), 'trust-badge'))).toBe(4);
  },
};

// Behavior: countdown from a fixed clock, cart count hidden at zero, carousel arrows, wishlist.
export const Behavior: StoryObj = {
  tags: ['!dev'],
  render: () => (
    <div className="w-[1440px]">
      <StoreNavbar cartCount={0} />
      <PromoSection now={NOW} />
      <ProductCarousel />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getByRole('link', { name: 'Cart, 0 items' }).querySelector('[data-slot="badge-count"]')).toBeNull();
    const tiles = items(canvasElement, 'countdown-tile').map(t => t.firstElementChild!.textContent);
    await expect(tiles.slice(0, 3)).toEqual(['02', '14', '36']);
    await expect(c.getByText(/Offer ends Sunday 29 November at 23:59/)).toBeInTheDocument();
    const car = c.getByRole('region', { name: 'Pairs well with what is in your bag' });
    await userEvent.click(within(car).getByRole('button', { name: 'Save Organic cotton tee, relaxed fit' }));
    await expect(within(car).getByRole('button', { name: 'Save Organic cotton tee, relaxed fit' })).toHaveAttribute('aria-pressed', 'true');
    await expect(within(car).getByRole('img', { name: 'Rated 4.6 out of 5, 128 reviews' })).toBeInTheDocument();
    const next = within(car).getByRole('button', { name: /next/i });
    await userEvent.click(next);
    await waitFor(() => expect(within(car).getByText(/Slide 2 of/)).toBeInTheDocument());
  },
};

export const FooterDark: StoryObj = { tags: ['!dev'], globals: { theme: 'Dark' }, render: () => <div className="w-[1440px]"><StoreNavbar /><StorefrontHero /><PromoSection now={NOW} /><StoreFooter /></div> };
export const FooterCorporate: StoryObj = { tags: ['!dev'], globals: { theme: 'Corporate Light' }, render: FooterDark.render };
