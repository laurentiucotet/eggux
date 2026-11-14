// EGG UI blocks, BLOCKS / Commerce page (126:2), Storefront family: Block / Store Navbar
// (693:107134), Storefront Hero (693:113324), Category Tiles (693:105642), Promo Section
// (693:113388), Incentives (693:105668), Product Carousel (693:105691), Store Footer (693:108930).
// Guide: build-ui/patterns/commerce.md (store home order: announcement, navbar with cart, photo
// hero, service strip, bestsellers, promo band, category tiles, footer with payment methods).
// Sections sit in a 1152 container (layout/container/6xl) with 24 / 32 px gutters below 1152;
// layout follows each block's own width (container queries).
// Store Navbar: the Announcement Banner over the library Navbar (layout search) with the category
// links, a Search Field, Wishlist and the cart button with its count (hidden at zero).
// Storefront Hero: 1:1 photo (720) with a rating card (Rating sm + label, radius 12, 12 / 16
// padding) next to the content (64 / 80 padding, 32 gap): overline, h1 display/lg, lead, primary
// and outline lg Buttons, then "Shop by category" with three Navigation Menu Links. Stacked below 1024.
// Category Tiles: 96 padding, left Section Header with a link Button, four 3:4 tiles (270, 24 apart,
// radius 12), name heading/h4 and count body/small; 2 per row below 1024.
// Promo Section: 96 padding; a bordered panel (radius 12): content (64 padding, 24 gap) with a
// soft-destructive pill Badge that names the end date, h2 heading/h1, lead, the Countdown (same end
// date, never resets), lg actions and fine print; 1:1 photo (560) on the right. Stacked below 1024.
// Incentives: 64 padding, four Trust Badges (270, 24 apart); 2 per row below 1024, 1 below 576.
// Product Carousel: 96 padding, Section Header with a link Button, then a Carousel of 252 Product
// Cards (24 apart), each with its Rating; the Carousel brings its own arrows and dots.
// Store Footer: 64 padding; a newsletter card (radius 12, 32 padding: heading/h3, body/small, a 420
// Inline Form) over the library Footer: brand with the company address, four link columns, then
// the legal line with the Payment Method Marks and the country and currency Select.
import * as React from 'react';
import { ArrowRight, Headphones, Heart, Package, RefreshCw, ShieldCheck } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Badge } from './badge';
import { Button } from './button';
import { Carousel } from './carousel';
import { PaymentMethodMark, ProductCard, type ProductCardProps } from './commerce';
import { ImagePlaceholder } from './image-placeholder';
import { InlineForm } from './inline-form';
import { Logo } from './logo';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from './navigation-menu';
import { NavigationMenuLink } from './navigation-menu-link';
import { Rating } from './rating';
import { SectionHeader } from './section-header-block';
import { Select, SelectContent, SelectItem, SelectTrigger } from './select';
import { AnnouncementBanner, Countdown } from './site-banners';
import { SiteFooter, SiteNavbar, type FooterColumn, type SiteLink } from './site-navigation';
import { TrustBadge } from './trust-badge';

const shell = '@container w-full bg-background text-foreground';
const inner = 'mx-auto flex w-full max-w-6xl min-w-0 flex-col px-6 @3xl:px-8 @6xl:px-0';

export interface StoreLink { label: string; href: string }

/* Store Navbar */

export interface StoreNavbarProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  /** Announcement Banner message; empty hides the banner. */
  announcement?: string;
  announcementLink?: StoreLink;
  categories?: SiteLink[];
  searchPlaceholder?: string;
  /** Items in the cart; the count hides at zero. */
  cartCount?: number;
  signIn?: StoreLink;
  wishlistHref?: string;
}

const storeCategories: SiteLink[] = [
  { label: 'New in', href: '#new' },
  { label: 'Women', href: '#women', active: true },
  { label: 'Men', href: '#men' },
  { label: 'Shoes', href: '#shoes' },
  { label: 'Accessories', href: '#accessories' },
  { label: 'Sale', href: '#sale' },
];

function StoreNavbar({
  announcement = 'Free delivery over €60 and 30-day free returns',
  announcementLink = { label: 'Delivery details', href: '#delivery' },
  categories = storeCategories,
  searchPlaceholder = 'Search products',
  cartCount = 2,
  signIn = { label: 'Sign in', href: '#account' },
  wishlistHref = '#wishlist',
  className,
  ...props
}: StoreNavbarProps) {
  return (
    <div data-slot="store-navbar" className={cn('flex w-full flex-col', className)} {...props}>
      {announcement ? <AnnouncementBanner message={announcement} link={announcementLink} label="Store announcement" /> : null}
      <SiteNavbar
        layout="search"
        links={categories}
        search={{ placeholder: searchPlaceholder }}
        cartCount={cartCount}
        cta={signIn}
        ctaVariant="outline"
        actions={<Button asChild variant="ghost" size="icon"><a href={wishlistHref} aria-label="Wishlist"><Heart aria-hidden="true" /></a></Button>}
        className="px-4 @6xl:px-0"
      />
    </div>
  );
}

/* Storefront Hero */

export interface StorefrontHeroProps extends Omit<React.ComponentProps<'section'>, 'title'> {
  overline?: string;
  title?: string;
  description?: string;
  primaryAction?: StoreLink;
  secondaryAction?: StoreLink | null;
  /** Rating card on the photo: the average and the label. Null hides it. */
  rating?: { value: number; label: string } | null;
  categoriesLabel?: string;
  /** Three Navigation Menu Links: name and "48 styles from €129". */
  categories?: { label: string; description: string; href: string }[];
  image?: string;
  imageAlt?: string;
}

function StorefrontHero({
  overline = 'Autumn / Winter 2026',
  title = 'Layers for the long walk home',
  description = 'Wool-blend coats, heavyweight knits and waterproof boots, designed to last ten winters. Free delivery over €60.',
  primaryAction = { label: 'Shop women', href: '#women' },
  secondaryAction = { label: 'Shop men', href: '#men' },
  rating = { value: 4.8, label: '4.8 out of 5 from 12,400 reviews' },
  categoriesLabel = 'Shop by category',
  categories = [
    { label: 'Coats and jackets', description: '48 styles from €129', href: '#coats' },
    { label: 'Knitwear', description: '36 styles from €59', href: '#knitwear' },
    { label: 'Boots', description: '22 styles from €119', href: '#boots' },
  ],
  image,
  imageAlt = 'A woman in a striped shirt outdoors at sunset',
  className,
  ...props
}: StorefrontHeroProps) {
  const titleId = React.useId();
  const catId = React.useId();
  return (
    <section data-slot="storefront-hero" aria-labelledby={titleId} className={cn('@container w-full bg-background text-foreground', className)} {...props}>
      <div className="grid w-full grid-cols-1 @5xl:grid-cols-2">
        <div data-slot="storefront-hero-media" className="relative min-w-0">
          <ImagePlaceholder ratio="1:1" src={image} alt={image ? imageAlt : ''} showCaption={false} className="rounded-none" />
          {rating ? (
            <div data-slot="storefront-hero-rating" className="absolute bottom-12 left-12 flex max-w-[calc(100%-6rem)] items-center gap-3 rounded-xl bg-card px-4 py-3 text-card-foreground shadow-md">
              <Rating value={rating.value} size="sm" aria-hidden="true" />
              <p className="m-0 min-w-0 text-sm leading-5 font-medium">{rating.label}</p>
            </div>
          ) : null}
        </div>
        <div data-slot="storefront-hero-content" className="flex min-w-0 flex-col justify-center gap-8 px-6 py-12 @3xl:px-20 @3xl:py-16">
          <div className="flex w-full max-w-[560px] flex-col items-start gap-6">
            <p className="m-0 text-xs leading-4 font-semibold tracking-[1.6px] text-brand uppercase">{overline}</p>
            <h1 id={titleId} className="m-0 text-4xl leading-10 font-extrabold tracking-[-0.4px] @3xl:text-6xl @3xl:leading-[60px]">{title}</h1>
            <p className="m-0 text-xl leading-7 text-muted-foreground">{description}</p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg"><a href={primaryAction.href}>{primaryAction.label}</a></Button>
              {secondaryAction ? <Button asChild size="lg" variant="outline"><a href={secondaryAction.href}>{secondaryAction.label}</a></Button> : null}
            </div>
          </div>
          {categories.length ? (
            <div className="flex w-full max-w-[560px] flex-col gap-2">
              <p id={catId} className="m-0 text-sm leading-5 font-medium">{categoriesLabel}</p>
              <NavigationMenu aria-label={categoriesLabel} className="max-w-none [&>div]:w-full">
                <NavigationMenuList className="grid w-full grid-cols-1 gap-2 @xl:grid-cols-3">
                  {categories.map(c => (
                    <NavigationMenuItem key={c.href} className="min-w-0">
                      <NavigationMenuLink href={c.href} title={c.label} description={c.description} showIcon={false} className="min-w-0" />
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

/* Category Tiles */

export interface CategoryTile { name: string; count: string; href: string; image?: string; imageAlt?: string }

export interface CategoryTilesProps extends Omit<React.ComponentProps<'section'>, 'title'> {
  overline?: string;
  title?: string;
  description?: string;
  /** Link Button next to the header; null hides it. */
  allLink?: StoreLink | null;
  tiles?: CategoryTile[];
}

const defaultTiles: CategoryTile[] = [
  { name: 'Women', count: '214 styles', href: '#women' },
  { name: 'Men', count: '186 styles', href: '#men' },
  { name: 'Tees and basics', count: '58 styles', href: '#tees' },
  { name: 'Shoes and accessories', count: '97 styles', href: '#shoes' },
];

function SectionTop({ titleId, overline, title, description, link }: { titleId: string; overline?: string; title: string; description?: string; link?: React.ReactNode }) {
  return (
    <div data-slot="store-section-header" className="flex w-full flex-col items-start gap-4 @3xl:flex-row @3xl:items-end @3xl:justify-between @3xl:gap-8">
      <SectionHeader align="left" titleId={titleId} overline={overline} title={title} description={description} />
      {link ? <div className="flex shrink-0 items-center gap-2">{link}</div> : null}
    </div>
  );
}

function CategoryTiles({
  overline = 'Shop by category',
  title = 'Everyday clothes in natural fibres',
  description = 'Sized XS to XXL, with free exchanges on every order.',
  allLink = { label: 'View all categories', href: '#categories' },
  tiles = defaultTiles,
  className,
  ...props
}: CategoryTilesProps) {
  const titleId = React.useId();
  return (
    <section data-slot="category-tiles" aria-labelledby={titleId} className={cn(shell, className)} {...props}>
      <div className={cn(inner, 'gap-12 py-16 @3xl:py-24')}>
        <SectionTop titleId={titleId} overline={overline} title={title} description={description} link={allLink ? <Button asChild variant="link"><a href={allLink.href}>{allLink.label}<ArrowRight aria-hidden="true" /></a></Button> : null} />
        <ul data-slot="category-tiles-list" className="m-0 grid w-full list-none grid-cols-1 gap-6 p-0 @xl:grid-cols-2 @5xl:grid-cols-4">
          {tiles.map(t => (
            <li key={t.href} data-slot="category-tile" className="group relative flex min-w-0 flex-col gap-4">
              <ImagePlaceholder ratio="3:4" src={t.image} alt="" showCaption={false} className="rounded-xl" />
              <div className="flex flex-col gap-1">
                <h3 className="m-0 text-xl leading-7 font-semibold tracking-tight">
                  <a href={t.href} className="text-foreground no-underline outline-none after:absolute after:inset-0 after:rounded-xl focus-visible:after:ring-[3px] focus-visible:after:ring-ring/50 group-hover:underline">{t.name}</a>
                </h3>
                <p className="m-0 text-sm leading-5 text-muted-foreground">{t.count}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* Promo Section */

export interface PromoSectionProps extends Omit<React.ComponentProps<'section'>, 'title'> {
  title?: string;
  description?: string;
  /** The end of the offer: the badge and the Countdown both read it. */
  endsAt?: Date | string | number;
  /** Start clock for previews and tests. */
  now?: Date | string | number;
  countdownLabel?: string;
  primaryAction?: StoreLink;
  secondaryAction?: StoreLink | null;
  finePrint?: string;
  image?: string;
  imageAlt?: string;
}

const endDay = (d: Date | string | number) => new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Europe/Lisbon' }).format(new Date(d));

function PromoSection({
  title = 'Mid-season sale: up to 30% off knitwear',
  description = 'Merino jumpers, cardigans and scarves, reduced while sizes last. Prices already include the discount.',
  endsAt = '2026-11-29T23:59:00Z',
  now,
  countdownLabel = 'Offer ends in',
  primaryAction = { label: 'Shop the sale', href: '#sale' },
  secondaryAction = { label: 'See all offers', href: '#offers' },
  finePrint = 'Discount shown at checkout on marked items. Free returns still apply.',
  image,
  imageAlt = 'A smiling woman in a grey blazer by a window',
  className,
  ...props
}: PromoSectionProps) {
  const titleId = React.useId();
  const cdId = React.useId();
  const day = endDay(endsAt);
  return (
    <section data-slot="promo-section" aria-labelledby={titleId} className={cn(shell, className)} {...props}>
      <div className={cn(inner, 'py-16 @3xl:py-24')}>
        <div data-slot="promo-panel" className="grid w-full grid-cols-1 overflow-hidden rounded-xl border border-border bg-[var(--section-muted-background)] @5xl:grid-cols-[1fr_560px]">
          <div data-slot="promo-content" className="flex min-w-0 flex-col items-start gap-6 p-6 @3xl:p-16">
            <Badge variant="soft-destructive" shape="pill">Ends {day}</Badge>
            <h2 id={titleId} className="m-0 text-3xl leading-9 font-extrabold tracking-[-0.4px] @3xl:text-4xl @3xl:leading-10">{title}</h2>
            <p className="m-0 text-xl leading-7 text-muted-foreground">{description}</p>
            <div className="flex flex-col gap-2">
              <p id={cdId} className="m-0 text-sm leading-5 font-medium">{countdownLabel}</p>
              <Countdown endsAt={endsAt} now={now} showSeconds aria-labelledby={cdId} label={`Offer ends ${day} at 23:59`} />
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg"><a href={primaryAction.href}>{primaryAction.label}</a></Button>
              {secondaryAction ? <Button asChild size="lg" variant="outline"><a href={secondaryAction.href}>{secondaryAction.label}</a></Button> : null}
            </div>
            {finePrint ? <p className="m-0 text-xs leading-4 text-muted-foreground">{finePrint}</p> : null}
          </div>
          <ImagePlaceholder ratio="1:1" src={image} alt={image ? imageAlt : ''} showCaption={false} className="rounded-none" />
        </div>
      </div>
    </section>
  );
}

/* Incentives */

export interface Incentive { name: string; description?: string; icon?: React.ReactNode }

export interface IncentivesProps extends Omit<React.ComponentProps<'section'>, 'title'> {
  /** Name of the section (no visible title). */
  label?: string;
  items?: Incentive[];
}

const defaultIncentives: Incentive[] = [
  { name: 'Free delivery over €60', description: '2 to 4 working days across the EU', icon: <Package /> },
  { name: '30-day free returns', description: 'Drop-off points or courier pickup', icon: <RefreshCw /> },
  { name: '2-year warranty', description: 'Free repair or replacement', icon: <ShieldCheck /> },
  { name: 'Help 7 days a week', description: 'Chat, email or phone, 8:00 to 20:00', icon: <Headphones /> },
];

function Incentives({ label = 'Why shop with Acme', items = defaultIncentives, className, ...props }: IncentivesProps) {
  return (
    <section data-slot="incentives" aria-label={label} className={cn(shell, className)} {...props}>
      <div className={cn(inner, 'py-16')}>
        <ul aria-label={label} className="m-0 grid w-full list-none grid-cols-1 gap-6 p-0 @xl:grid-cols-2 @5xl:grid-cols-4">
          {items.map(i => <li key={i.name} className="flex min-w-0"><TrustBadge name={i.name} description={i.description} icon={i.icon} className="w-full" /></li>)}
        </ul>
      </div>
    </section>
  );
}

/* Product Carousel */

export interface CarouselProduct extends Pick<ProductCardProps, 'name' | 'href' | 'variantText' | 'price' | 'oldPrice' | 'discount' | 'soldOut' | 'image'> {
  rating?: number;
  reviews?: number;
}

export interface ProductCarouselProps extends Omit<React.ComponentProps<'section'>, 'title'> {
  overline?: string;
  title?: string;
  description?: string;
  allLink?: StoreLink | null;
  products?: CarouselProduct[];
  /** Turn on the rating under every card or under none. */
  showRating?: boolean;
}

export const carouselProducts: CarouselProduct[] = [
  { name: 'Organic cotton tee, relaxed fit', href: '#tee', variantText: 'White · 5 colors', price: '€29.00', rating: 4.6, reviews: 128 },
  { name: 'Heavyweight hooded sweatshirt', href: '#hoodie', variantText: 'Heather gray · 4 colors', price: '€69.00', oldPrice: '€89.00', discount: '-22%', rating: 4.8, reviews: 268 },
  { name: 'Suede derby sneaker', href: '#derby', variantText: 'Teal · 3 colors', price: '€119.00', rating: 4.4, reviews: 96 },
  { name: 'Trail runner, recycled mesh', href: '#runner', variantText: 'Charcoal · 2 colors', price: '€99.00', rating: 4.7, reviews: 184 },
  { name: 'Field watch, silicone strap', href: '#watch', variantText: 'Chalk · 2 colors', price: '€79.00', soldOut: true, rating: 4.5, reviews: 72 },
  { name: 'Merino crew socks, 3 pack', href: '#socks', variantText: 'Oat · 3 colors', price: '€24.00', rating: 4.9, reviews: 412 },
];

function ProductCarousel({
  overline = 'You may also like',
  title = 'Pairs well with what is in your bag',
  description = 'Picked from what customers bought together this month, with ratings from verified buyers.',
  allLink = { label: 'Shop all new arrivals', href: '#new' },
  products = carouselProducts,
  showRating = true,
  className,
  ...props
}: ProductCarouselProps) {
  const titleId = React.useId();
  const [wished, setWished] = React.useState<string[]>([]);
  return (
    <section data-slot="product-carousel" aria-labelledby={titleId} className={cn(shell, className)} {...props}>
      <div className={cn(inner, 'gap-12 py-16 @3xl:py-24')}>
        <SectionTop titleId={titleId} overline={overline} title={title} description={description} link={allLink ? <Button asChild variant="link"><a href={allLink.href}>{allLink.label}<ArrowRight aria-hidden="true" /></a></Button> : null} />
        <Carousel label={`${title}: products`} type="multiple" slideWidth={252} gap={24}>
          {products.map(p => (
            <div key={p.href} data-slot="product-carousel-item" className="flex flex-col gap-2">
              <ProductCard
                {...p}
                className="w-full"
                wished={wished.includes(p.href)}
                onWishChange={w => setWished(list => (w ? [...list, p.href] : list.filter(h => h !== p.href)))}
              />
              {showRating && p.rating != null ? <Rating value={p.rating} size="sm" showValue count={p.reviews} /> : null}
            </div>
          ))}
        </Carousel>
      </div>
    </section>
  );
}

/* Store Footer */

export interface StoreFooterProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  newsletterTitle?: string;
  newsletterText?: string;
  newsletterHint?: string;
  onSubscribe?: (email: string) => void;
  /** Company name, address and customer care, one line each. */
  address?: string[];
  columns?: FooterColumn[];
  copyright?: string;
  paymentMethods?: string[];
  regions?: { value: string; label: string }[];
  region?: string;
  onRegionChange?: (value: string) => void;
}

const col = (title: string, items: string[]): FooterColumn => ({ title, links: items.map(l => ({ label: l, href: `#${l.toLowerCase().replace(/ /g, '-')}` })) });

const storeColumns: FooterColumn[] = [
  col('Shop', ['Women', 'Men', 'Shoes', 'Accessories', 'Gift cards', 'Sale']),
  col('Help', ['Delivery', 'Returns and exchanges', 'Size guide', 'Order status', 'Contact us']),
  col('Company', ['Our story', 'Materials', 'Repairs', 'Stores', 'Careers']),
  col('Legal', ['Privacy', 'Terms of sale', 'Cookies', 'Withdrawal form', 'Imprint']),
];

const storeRegions = [
  { value: 'pt', label: 'Portugal (EUR €)' },
  { value: 'es', label: 'Spain (EUR €)' },
  { value: 'de', label: 'Germany (EUR €)' },
  { value: 'fr', label: 'France (EUR €)' },
];

function StoreFooter({
  newsletterTitle = 'Get 10% off your first order',
  newsletterText = 'New drops, restocks and care tips, twice a month. Unsubscribe in one click.',
  newsletterHint = 'We send the code right away. Read our privacy policy.',
  onSubscribe,
  address = ['Acme Apparel Ltd.', 'Rua do Exemplo 48, 4000-000 Porto', 'Customer care: hello@acme.example'],
  columns = storeColumns,
  copyright = '© 2026 Acme Apparel Ltd. Prices include VAT.',
  paymentMethods = ['Visa', 'Mastercard', 'Amex', 'PayPal', 'Apple Pay', 'Klarna'],
  regions = storeRegions,
  region: regionProp,
  onRegionChange,
  className,
  ...props
}: StoreFooterProps) {
  const titleId = React.useId();
  const [inner_, setInner] = React.useState(regions[0]?.value ?? '');
  const region = regionProp ?? inner_;
  return (
    <div data-slot="store-footer" className={cn('@container flex w-full flex-col border-t border-border bg-background text-foreground', className)} {...props}>
      <div className="flex w-full justify-center px-4 pt-16">
        <section data-slot="store-footer-newsletter" aria-labelledby={titleId} className="flex w-full max-w-6xl flex-col gap-6 rounded-xl border border-border bg-card p-6 text-card-foreground @5xl:flex-row @5xl:items-start @5xl:justify-between @5xl:gap-12 @5xl:p-8">
          <div className="flex min-w-0 flex-col gap-2">
            <h2 id={titleId} className="m-0 text-2xl leading-8 font-semibold tracking-tight">{newsletterTitle}</h2>
            <p className="m-0 text-sm leading-5 text-muted-foreground">{newsletterText}</p>
          </div>
          <InlineForm label="Email address" placeholder="name@company.com" buttonLabel="Subscribe" hint={newsletterHint} success="You are subscribed. Check your inbox for your code." onSubmit={v => onSubscribe?.(v)} inputProps={{ type: 'email', autoComplete: 'email' }} className="w-full @5xl:w-[420px] @5xl:shrink-0" />
        </section>
      </div>
      <SiteFooter
        className="border-t-0 pt-12"
        logo={(
          <div data-slot="store-footer-brand" className="flex flex-col gap-4">
            <Logo />
            <address className="text-sm leading-5 text-muted-foreground not-italic">{address.map(l => <span key={l} className="block">{l}</span>)}</address>
          </div>
        )}
        columns={columns}
        copyright={copyright}
        end={(
          <div className="flex max-w-[100cqw] flex-wrap items-center gap-6">
            <ul aria-label="Accepted payment methods" data-slot="store-footer-payments" className="m-0 flex list-none flex-wrap gap-2 p-0">
              {paymentMethods.map(m => <li key={m}><PaymentMethodMark name={m} /></li>)}
            </ul>
            <Select value={region} onValueChange={v => { setInner(v); onRegionChange?.(v); }}>
              <SelectTrigger aria-label="Country and currency" className="w-[200px]" />
              <SelectContent>{regions.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        )}
      />
    </div>
  );
}

export { CategoryTiles, Incentives, ProductCarousel, PromoSection, StoreFooter, StoreNavbar, StorefrontHero };
