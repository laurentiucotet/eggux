// EGG UI blocks, Navigation page: Block / Navbar (810:134778, default and on-image), Block / Navbar
// Mobile (96:5364 and "mobile nav open"), Block / Footer (72:49), Block / Footer Simple (202:3935).
// Navbar: a <header> with a 1152 container, 12 padding, a bottom border: Logo (home link), Nav Links
// (current one aria-current), then Sign in (ghost) and the primary CTA, 32 apart; optional cart
// (ghost Button Icon with a count). on-image: transparent with white text over a photo or video.
// Under a 768 container it becomes the mobile bar (64 high: logo and a menu button) and the menu
// opens a full-width Sheet with 48 high links (chevron for sections) and the CTAs full width.
// Footer: brand (Logo and one line, 280) and link columns (160, title ui/label, links body/small
// muted, 12 apart), then a separator and the legal line; 64 / 32 padding. Columns stack under 768.
// Footer Simple: logo with the main links (32 apart), a separator, copyright and legal links.
// Menus (Block / Navbar Flyout 814:477, Block / Navbar Mega Menu 212:920): a link with `menu` becomes
// a Navigation Menu trigger (chevron, aria-expanded) that opens on hover after 200 ms or on click /
// Enter and closes on Escape or outside click. dropdown: a short list (title and optional line);
// flyout: Navigation Menu Links in two 280 columns, a footer row and a featured card, under its
// trigger; mega: groups (overline title, 3-5 links) and a featured item across the container.
// On mobile each menu is a disclosure in the Sheet that shows its links.
// Layouts: default; centered (Block / Navbar Centered 212:822: links left, logo in the middle,
// endLinks and the buttons right); search (Block / Navbar Search 212:862: logo + product badge,
// links, a Search Field with ⌘K that fills the rest, actions, an outline CTA).
import * as React from 'react';
import { ChevronDown, ChevronRight, Menu, ShoppingBag } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Badge } from './badge';
import { BadgeCount } from './badge-count';
import { Button } from './button';
import { ImagePlaceholder } from './image-placeholder';
import { InlineForm } from './inline-form';
import { Select, SelectContent, SelectItem, SelectTrigger } from './select';
import { StatusDot } from './status-dot';
import { Logo } from './logo';
import { NavLink } from './nav-link';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from './navigation-menu';
import { SearchField } from './search-field';
import { Separator } from './separator';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './sheet';

export interface SiteMenuLink { label: string; href: string; /** One line on what the user gets. */ description?: string; /** An icon from `@/components/icons`. */ icon?: React.ReactNode }
export interface SiteMenuFeatured {
  title: string;
  description?: string;
  /** Overline above the title (mega: "New in 2.4"). */
  eyebrow?: string;
  /** Soft info badge above the title (flyout: "New in 4.2"). */
  badge?: string;
  /** Image URL; without it a placeholder. */
  image?: string;
  imageAlt?: string;
  action: { label: string; href: string };
}
export type SiteMenu =
  | { type: 'dropdown'; links: SiteMenuLink[] }
  | { type: 'flyout'; links: SiteMenuLink[]; /** Secondary actions in the footer row ("Contact sales"). */ actions?: { label: string; href: string }[]; /** The link at the end of the footer row ("All features"). */ more?: { label: string; href: string }; featured?: SiteMenuFeatured }
  | { type: 'mega'; groups: { title: string; links: SiteMenuLink[] }[]; featured?: SiteMenuFeatured };

export interface SiteLink {
  label: string;
  /** Needed for a plain link; a link with `menu` opens the menu instead. */
  href?: string;
  active?: boolean;
  /** A chevron on a plain link (the section page lists the menu). Use `menu` for a real menu. */
  hasMenu?: boolean;
  /** Opens a dropdown, flyout or mega menu. */
  menu?: SiteMenu;
}

export type SiteNavbarLayout = 'default' | 'centered' | 'search';

export interface SiteNavbarProps extends React.ComponentProps<'header'> {
  links: SiteLink[];
  logo?: React.ReactNode;
  homeHref?: string;
  signIn?: { label?: string; href: string };
  cta: { label: string; href: string };
  /** Button style of the CTA. Default `default` (primary); Navbar Search uses outline. */
  ctaVariant?: 'default' | 'outline';
  /** Items in the cart (shops); shows the cart button. */
  cartCount?: number;
  variant?: 'default' | 'on-image';
  layout?: SiteNavbarLayout;
  /** centered: links on the right side, before Sign in. */
  endLinks?: SiteLink[];
  /** search: a badge after the logo ("Docs"). */
  badge?: string;
  /** search: the Search Field (placeholder names what is searched). */
  search?: { placeholder: string; onSearch?: (query: string) => void };
  /** Extra controls before Sign in (a language Button Icon). */
  actions?: React.ReactNode;
}

const onImageText = 'text-[var(--video-foreground)] hover:bg-white/10 hover:text-[var(--video-foreground)] aria-[current=page]:bg-white/15 aria-[current=page]:text-[var(--video-foreground)] data-[state=open]:bg-white/15 data-[state=open]:text-[var(--video-foreground)]';
const panelSurface = 'rounded-md border border-border bg-popover text-popover-foreground shadow-lg';

function FeaturedCard({ featured, mega }: { featured: SiteMenuFeatured; mega?: boolean }) {
  return (
    <div data-slot="site-menu-featured" className={cn('flex flex-col items-start gap-3', mega ? 'w-80 shrink-0' : 'w-full rounded-xl bg-[var(--section-muted-background)] p-3')}>
      <ImagePlaceholder ratio="16:9" src={featured.image} alt={featured.imageAlt ?? ''} showCaption={false} className="w-full rounded-xl" />
      {featured.badge ? <Badge variant="soft-info" className="rounded-full">{featured.badge}</Badge> : null}
      {featured.eyebrow ? <p className="m-0 text-xs leading-4 font-semibold tracking-[1.6px] text-muted-foreground uppercase">{featured.eyebrow}</p> : null}
      <div className="flex flex-col gap-1">
        <p className={cn('m-0 text-foreground', mega ? 'text-lg leading-7 font-semibold' : 'text-sm leading-5 font-medium')}>{featured.title}</p>
        {featured.description ? <p className="m-0 text-sm leading-5 text-muted-foreground">{featured.description}</p> : null}
      </div>
      <NavigationMenuLink asChild>
        <a href={featured.action.href} className="inline-flex h-8 items-center gap-1.5 rounded-full text-sm leading-5 font-medium text-brand outline-none hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/50">
          {featured.action.label}
          <ChevronRight aria-hidden="true" className="size-4" />
        </a>
      </NavigationMenuLink>
    </div>
  );
}

function MenuPanel({ menu }: { menu: SiteMenu }) {
  if (menu.type === 'dropdown') {
    return (
      <ul data-slot="site-menu-dropdown" className={cn(panelSurface, 'm-0 flex w-60 list-none flex-col p-1')}>
        {menu.links.map(l => (
          <li key={l.href}>
            <NavigationMenuLink asChild>
              <a href={l.href} className="flex items-start gap-2 rounded-sm px-2 py-[var(--menu-padding-y)] text-sm leading-5 text-popover-foreground outline-none hover:bg-accent focus-visible:bg-accent focus-visible:shadow-[0_0_0_2px_var(--ring)] [&_svg]:mt-0.5 [&_svg]:size-4 [&_svg]:shrink-0">
                {l.icon ? <span aria-hidden="true" className="contents">{l.icon}</span> : null}
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className="truncate">{l.label}</span>
                  {l.description ? <span className="text-xs leading-4 text-muted-foreground">{l.description}</span> : null}
                </span>
              </a>
            </NavigationMenuLink>
          </li>
        ))}
      </ul>
    );
  }
  if (menu.type === 'flyout') {
    const hasFooter = Boolean(menu.actions?.length || menu.more);
    return (
      <div data-slot="site-menu-flyout" className={cn(panelSurface, 'flex w-[746px] max-w-[calc(100vw-2rem)] min-w-[640px] gap-2 p-2')}>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <ul className="m-0 grid list-none grid-cols-2 gap-x-2 gap-y-1 p-0">
            {menu.links.map(l => <li key={l.href} className="min-w-0"><NavigationMenuLink href={l.href} title={l.label} description={l.description} icon={l.icon} showIcon={Boolean(l.icon)} className="min-w-0" /></li>)}
          </ul>
          {hasFooter ? (
            <div data-slot="site-menu-footer" className="mt-1 flex items-center gap-2 border-t border-border pt-2">
              {menu.actions?.map(a => (
                <NavigationMenuLink key={a.href} asChild>
                  <a href={a.href} className="inline-flex h-8 items-center rounded-full px-3 text-sm leading-5 font-medium text-foreground outline-none hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50">{a.label}</a>
                </NavigationMenuLink>
              ))}
              <span className="flex-1" />
              {menu.more ? (
                <NavigationMenuLink asChild>
                  <a href={menu.more.href} className="inline-flex h-8 items-center gap-1.5 rounded-full text-sm leading-5 font-medium text-brand outline-none hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/50">
                    {menu.more.label}<ChevronRight aria-hidden="true" className="size-4" />
                  </a>
                </NavigationMenuLink>
              ) : null}
            </div>
          ) : null}
        </div>
        {menu.featured ? <div className="flex w-[200px] shrink-0"><FeaturedCard featured={menu.featured} /></div> : null}
      </div>
    );
  }
  return (
    <div data-slot="site-menu-mega" className={cn(panelSurface, 'flex w-full gap-6 rounded-xl p-6')}>
      {menu.groups.map(g => (
        <div key={g.title} className="flex min-w-0 flex-1 flex-col gap-1">
          <p className="m-0 text-xs leading-4 font-semibold tracking-[1.6px] text-muted-foreground uppercase">{g.title}</p>
          <ul aria-label={g.title} className="m-0 flex list-none flex-col p-0">
            {g.links.map(l => <li key={l.href}><NavigationMenuLink href={l.href} title={l.label} description={l.description} icon={l.icon} showIcon={Boolean(l.icon)} className="min-w-0" /></li>)}
          </ul>
        </div>
      ))}
      {menu.featured ? <FeaturedCard featured={menu.featured} mega /> : null}
    </div>
  );
}

/** Desktop links: plain Nav Links and menu triggers in one Navigation Menu. */
function SiteNavLinks({ links, onImage, className, label = 'Main' }: { links: SiteLink[]; onImage?: boolean; className?: string; label?: string }) {
  const hasMega = links.some(l => l.menu?.type === 'mega');
  return (
    <NavigationMenu aria-label={label} delayDuration={200} className={cn('max-w-none', hasMega && 'static [&>div]:static!', className)}>
      <NavigationMenuList>
        {links.map(l => {
          const mega = l.menu?.type === 'mega';
          return (
            <NavigationMenuItem key={l.label} className={mega ? 'static' : undefined}>
              {l.menu ? (
                <>
                  <NavigationMenuTrigger className={cn(l.active && 'bg-accent text-accent-foreground', onImage && onImageText)}>{l.label}</NavigationMenuTrigger>
                  {/* 8 under the bar: past the 12 px bar padding and its border. Mega spans the container. */}
                  <NavigationMenuContent className={mega ? 'right-0 w-auto' : 'mt-[21px]'}>
                    <MenuPanel menu={l.menu} />
                  </NavigationMenuContent>
                </>
              ) : (
                <NavigationMenuLink asChild active={l.active}>
                  <NavLink href={l.href} active={l.active} showChevron={l.hasMenu} className={onImage ? onImageText : undefined}>{l.label}</NavLink>
                </NavigationMenuLink>
              )}
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const mobileRow = 'flex h-12 w-full items-center justify-between rounded-md text-lg leading-7 font-semibold text-foreground outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-[current=page]:text-brand';

function MobileMenuSection({ link, onNavigate }: { link: SiteLink & { menu: SiteMenu }; onNavigate: () => void }) {
  const [open, setOpen] = React.useState(false);
  const id = React.useId();
  const groups = link.menu.type === 'mega' ? link.menu.groups : [{ title: '', links: link.menu.links }];
  return (
    <>
      <button type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen(o => !o)} className={cn(mobileRow, 'cursor-pointer border-0 bg-transparent p-0 text-left')}>
        {link.label}
        <ChevronDown aria-hidden="true" className={cn('size-4 transition-transform duration-[var(--duration-fast)]', open && 'rotate-180')} />
      </button>
      <div id={id} hidden={!open} className="pb-2">
        {groups.map(g => (
          <div key={g.title || 'links'} className="flex flex-col">
            {g.title ? <p className="m-0 pt-2 pb-1 text-xs leading-4 font-semibold tracking-[1.6px] text-muted-foreground uppercase">{g.title}</p> : null}
            <ul aria-label={g.title || link.label} className="m-0 flex list-none flex-col p-0">
              {g.links.map(s => (
                <li key={s.href}>
                  <a href={s.href} onClick={onNavigate} className="flex h-10 items-center rounded-md text-base leading-6 text-foreground outline-none hover:text-brand focus-visible:ring-[3px] focus-visible:ring-ring/50">{s.label}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}

function SiteNavbar({ links, logo, homeHref = '/', signIn, cta, ctaVariant = 'default', cartCount, variant = 'default', layout = 'default', endLinks = [], badge, search, actions, className, ...props }: SiteNavbarProps) {
  const onImage = variant === 'on-image';
  const [open, setOpen] = React.useState(false);
  const allLinks = [...links, ...endLinks];
  const brand = (
    <a href={homeHref} className="flex shrink-0 rounded-md outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50">
      {logo ?? <Logo className={onImage ? '[&_[data-slot=logo-name]]:text-[var(--video-foreground)]' : undefined} />}
    </a>
  );
  const buttons = (
    <>
      {actions}
      {cartCount !== undefined ? (
        <a href="/cart" className={cn('relative flex size-9 items-center justify-center rounded-full outline-none hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50 [&_svg]:size-4', onImage && 'text-[var(--video-foreground)] hover:bg-white/10')}>
          <ShoppingBag aria-hidden="true" />
          <span className="sr-only">Cart, {cartCount} items</span>
          {cartCount > 0 ? <BadgeCount aria-hidden="true" count={cartCount} className="absolute -top-1 left-5" /> : null}
        </a>
      ) : null}
      {signIn ? <Button asChild variant="ghost" className={onImage ? 'text-[var(--video-foreground)] hover:bg-white/10 hover:text-[var(--video-foreground)]' : undefined}><a href={signIn.href}>{signIn.label ?? 'Sign in'}</a></Button> : null}
      <Button asChild variant={ctaVariant}><a href={cta.href}>{cta.label}</a></Button>
    </>
  );
  return (
    <header
      data-slot="site-navbar"
      data-variant={variant}
      data-layout={layout}
      className={cn('@container flex w-full justify-center', onImage ? 'bg-transparent' : 'border-b border-border bg-background', className)}
      {...props}
    >
      {/* Desktop */}
      <div className="relative hidden w-full max-w-[1152px] items-center gap-8 py-3 @3xl:flex">
        {layout === 'centered' ? (
          <>
            <div className="flex min-w-0 flex-1 items-center"><SiteNavLinks links={links} onImage={onImage} /></div>
            {brand}
            <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
              {endLinks.length ? <SiteNavLinks links={endLinks} onImage={onImage} label="More" /> : null}
              {buttons}
            </div>
          </>
        ) : layout === 'search' ? (
          <>
            <div className="flex shrink-0 items-center gap-3">
              {brand}
              {badge ? <Badge variant="secondary">{badge}</Badge> : null}
            </div>
            <SiteNavLinks links={links} onImage={onImage} className="shrink-0" />
            {search ? <SearchField placeholder={search.placeholder} onSearch={search.onSearch} className="w-auto min-w-0 flex-1" /> : <span className="flex-1" />}
            <div className="flex shrink-0 items-center gap-2">{buttons}</div>
          </>
        ) : (
          <>
            {brand}
            <SiteNavLinks links={links} onImage={onImage} className="min-w-0 flex-1 justify-start" />
            <div className="flex shrink-0 items-center gap-2">{buttons}</div>
          </>
        )}
      </div>
      {/* Mobile */}
      <div className="flex h-16 w-full items-center justify-between pr-2 pl-4 @3xl:hidden">
        {brand}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Menu" className={onImage ? 'text-[var(--video-foreground)] hover:bg-white/10' : undefined}><Menu aria-hidden="true" /></Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full sm:w-full">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
              <SheetDescription className="sr-only">Site navigation</SheetDescription>
            </SheetHeader>
            <nav aria-label="Main" className="flex min-h-0 flex-1 flex-col overflow-y-auto">
              {search ? <div className="px-4 pb-2"><SearchField placeholder={search.placeholder} onSearch={search.onSearch} showShortcut={false} className="w-full" /></div> : null}
              <ul className="m-0 flex list-none flex-col p-4 pt-0">
                {allLinks.map(l => (
                  <li key={l.label}>
                    {l.menu ? (
                      <MobileMenuSection link={l as SiteLink & { menu: SiteMenu }} onNavigate={() => setOpen(false)} />
                    ) : (
                      <a href={l.href} aria-current={l.active ? 'page' : undefined} onClick={() => setOpen(false)} className={mobileRow}>
                        {l.label}
                        {l.hasMenu ? <ChevronRight aria-hidden="true" className="size-4" /> : null}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
              <div className="mt-auto flex flex-col gap-2 p-4">
                <Button asChild size="lg" className="w-full"><a href={cta.href}>{cta.label}</a></Button>
                {signIn ? <Button asChild size="lg" variant="outline" className="w-full"><a href={signIn.href}>{signIn.label ?? 'Sign in'}</a></Button> : null}
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

/* Footer */

export interface FooterColumn { title: string; links: { label: string; href: string }[] }

export interface SiteFooterProps extends React.ComponentProps<'footer'> {
  logo?: React.ReactNode;
  tagline?: string;
  columns: FooterColumn[];
  copyright: string;
  /** Right side of the legal line ("Made in Europe"), or legal links. */
  end?: React.ReactNode;
}

const footerLink = 'rounded-sm text-sm leading-5 text-muted-foreground outline-none hover:text-foreground hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/50';

function SiteFooter({ logo, tagline, columns, copyright, end, className, ...props }: SiteFooterProps) {
  return (
    <footer data-slot="site-footer" className={cn('@container flex w-full justify-center border-t border-border bg-background px-4 pt-16 pb-8', className)} {...props}>
      <div className="flex w-full max-w-[1152px] flex-col gap-12">
        <div className="flex flex-col gap-10 @3xl:flex-row @3xl:gap-12">
          <div className="flex min-w-0 flex-1 flex-col gap-4">
            {logo ?? <Logo />}
            {tagline ? <p className="m-0 max-w-[280px] text-sm leading-5 text-muted-foreground">{tagline}</p> : null}
          </div>
          <div className="grid grid-cols-2 gap-x-12 gap-y-10 @xl:grid-cols-4 @3xl:flex @3xl:gap-12">
            {columns.map(c => (
              <nav key={c.title} aria-label={c.title} className="flex flex-col gap-3 @3xl:w-40">
                <h2 className="m-0 text-sm leading-5 font-medium text-foreground">{c.title}</h2>
                <ul className="m-0 flex list-none flex-col gap-3 p-0">
                  {c.links.map(l => <li key={l.href} className="flex"><a href={l.href} className={footerLink}>{l.label}</a></li>)}
                </ul>
              </nav>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <Separator />
          <div className="flex flex-wrap items-start gap-4 text-sm leading-5 text-muted-foreground">
            <p className="m-0 min-w-0 flex-1">{copyright}</p>
            {end ? <div className="shrink-0">{end}</div> : null}
          </div>
        </div>
      </div>
    </footer>
  );
}

export interface SiteFooterSimpleProps extends React.ComponentProps<'footer'> {
  logo?: React.ReactNode;
  links: { label: string; href: string }[];
  legal: { label: string; href: string }[];
  copyright: string;
}

function SiteFooterSimple({ logo, links, legal, copyright, className, ...props }: SiteFooterSimpleProps) {
  return (
    <footer data-slot="site-footer-simple" className={cn('@container flex w-full justify-center border-t border-border bg-background px-4 py-12', className)} {...props}>
      <div className="flex w-full max-w-[1152px] flex-col gap-8">
        <div className="flex flex-col items-start gap-6 @3xl:flex-row @3xl:items-center @3xl:justify-between @3xl:gap-8">
          {logo ?? <Logo />}
          <nav aria-label="Footer">
            <ul className="m-0 flex list-none flex-wrap gap-x-8 gap-y-3 p-0">
              {links.map(l => <li key={l.href} className="flex"><a href={l.href} className={cn(footerLink, 'font-medium')}>{l.label}</a></li>)}
            </ul>
          </nav>
        </div>
        <Separator />
        <div className="flex flex-col items-start gap-4 text-sm leading-5 text-muted-foreground @3xl:flex-row @3xl:items-center @3xl:justify-between @3xl:gap-8">
          <p className="m-0">{copyright}</p>
          <nav aria-label="Legal">
            <ul className="m-0 flex list-none flex-wrap gap-6 p-0">
              {legal.map(l => <li key={l.href} className="flex"><a href={l.href} className={footerLink}>{l.label}</a></li>)}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}

/* Footer Newsletter, Corporate, Centered (212:1025, 212:1079, 212:1158) */

function FooterColumns({ columns, className }: { columns: FooterColumn[]; className?: string }) {
  return (
    <div className={cn('grid min-w-0 grid-cols-2 gap-x-8 gap-y-10 @xl:grid-cols-3 @3xl:flex @3xl:flex-1 @3xl:gap-8', className)}>
      {columns.map(c => (
        <nav key={c.title} aria-label={c.title} className="flex min-w-0 flex-col gap-3 @3xl:flex-1">
          <h2 className="m-0 text-sm leading-5 font-medium text-foreground">{c.title}</h2>
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            {c.links.map(l => <li key={l.href} className="flex"><a href={l.href} className={footerLink}>{l.label}</a></li>)}
          </ul>
        </nav>
      ))}
    </div>
  );
}

function LegalLinks({ links, label = 'Legal' }: { links: { label: string; href: string }[]; label?: string }) {
  return (
    <nav aria-label={label}>
      <ul className="m-0 flex list-none flex-wrap gap-x-6 gap-y-2 p-0">
        {links.map(l => <li key={l.href} className="flex"><a href={l.href} className={footerLink}>{l.label}</a></li>)}
      </ul>
    </nav>
  );
}

export interface SiteFooterNewsletterProps extends React.ComponentProps<'footer'> {
  logo?: React.ReactNode;
  tagline?: string;
  /** Title over the form: what people get and how often. */
  newsletterTitle?: string;
  /** Inline Form: placeholder, button and hint; onSubmit gets the email. */
  newsletter: Omit<React.ComponentProps<typeof InlineForm>, 'label'>;
  columns: FooterColumn[];
  copyright: string;
  legal: { label: string; href: string }[];
}

function SiteFooterNewsletter({ logo, tagline, newsletterTitle = 'Product updates, once a month', newsletter, columns, copyright, legal, className, ...props }: SiteFooterNewsletterProps) {
  const titleId = React.useId();
  return (
    <footer data-slot="site-footer-newsletter" className={cn('@container flex w-full justify-center border-t border-border bg-background px-4 pt-16 pb-10', className)} {...props}>
      <div className="flex w-full max-w-[1152px] flex-col gap-12">
        <div className="flex flex-col gap-12 @3xl:flex-row @3xl:gap-16">
          <div className="flex w-full max-w-[400px] shrink-0 flex-col gap-4">
            {logo ?? <Logo />}
            {tagline ? <p className="m-0 text-base leading-7 text-muted-foreground">{tagline}</p> : null}
            <div className="flex flex-col gap-2 pt-2">
              <p id={titleId} className="m-0 text-sm leading-5 font-medium text-foreground">{newsletterTitle}</p>
              <InlineForm aria-labelledby={titleId} label="Email address" placeholder="you@company.com" {...newsletter} className="w-full" />
            </div>
          </div>
          <FooterColumns columns={columns} />
        </div>
        <div className="flex flex-col gap-6">
          <Separator />
          <div className="flex flex-col items-start gap-4 text-sm leading-5 text-muted-foreground @3xl:flex-row @3xl:items-center @3xl:gap-6">
            <p className="m-0 min-w-0 flex-1">{copyright}</p>
            <LegalLinks links={legal} />
          </div>
        </div>
      </div>
    </footer>
  );
}

export interface SiteFooterCorporateProps extends React.ComponentProps<'footer'> {
  logo?: React.ReactNode;
  /** Company name, address and registration, one line each. */
  address: string[];
  /** Certification badges (ISO 27001, SOC 2 Type II, GDPR). */
  certifications?: string[];
  columns: FooterColumn[];
  copyright: string;
  /** Live status: a Status Dot with its label, linked to the status page. */
  status?: { label: string; href: string; status?: React.ComponentProps<typeof StatusDot>['status'] };
  social?: { label: string; href: string }[];
  /** Language and region: a Select. */
  language?: { label?: string; value: string; options: { value: string; label: string }[]; onValueChange?: (v: string) => void };
}

function SiteFooterCorporate({ logo, address, certifications = [], columns, copyright, status, social = [], language, className, ...props }: SiteFooterCorporateProps) {
  return (
    <footer data-slot="site-footer-corporate" className={cn('@container flex w-full justify-center border-t border-border bg-[var(--section-muted-background)] px-4 pt-16 pb-10', className)} {...props}>
      <div className="flex w-full max-w-[1152px] flex-col gap-12">
        <div className="flex flex-col gap-10 @3xl:flex-row @3xl:gap-8">
          <div className="flex w-full max-w-[264px] shrink-0 flex-col gap-4">
            {logo ?? <Logo />}
            <address className="text-sm leading-5 text-muted-foreground not-italic">
              {address.map(line => <span key={line} className="block">{line}</span>)}
            </address>
            {certifications.length ? (
              <ul aria-label="Certifications" className="m-0 flex list-none flex-wrap gap-2 p-0">
                {certifications.map(c => <li key={c}><Badge variant="outline">{c}</Badge></li>)}
              </ul>
            ) : null}
          </div>
          <FooterColumns columns={columns} className="@xl:grid-cols-3" />
        </div>
        <div className="flex flex-col gap-6">
          <Separator />
          <div className="flex flex-wrap items-center gap-x-6 gap-y-4 text-sm leading-5 text-muted-foreground">
            {status ? (
              <a href={status.href} className="rounded-sm outline-none hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/50">
                <StatusDot status={status.status ?? 'success'} label={status.label} />
              </a>
            ) : null}
            <p className="m-0 min-w-0 flex-1">{copyright}</p>
            {social.length ? <LegalLinks links={social} label="Social" /> : null}
            {language ? (
              <Select value={language.value} onValueChange={language.onValueChange}>
                <SelectTrigger aria-label={language.label ?? 'Language and region'} className="w-[180px]" />
                <SelectContent>
                  {language.options.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                </SelectContent>
              </Select>
            ) : null}
          </div>
        </div>
      </div>
    </footer>
  );
}

export interface SiteFooterCenteredProps extends React.ComponentProps<'footer'> {
  logo?: React.ReactNode;
  links: { label: string; href: string }[];
  /** Contact and social links as icon buttons; the label names the place ("Email us"). */
  social?: { label: string; href: string; icon: React.ReactNode }[];
  copyright: string;
  legal?: { label: string; href: string }[];
}

function SiteFooterCentered({ logo, links, social = [], copyright, legal = [], className, ...props }: SiteFooterCenteredProps) {
  return (
    <footer data-slot="site-footer-centered" className={cn('@container flex w-full flex-col items-center gap-8 border-t border-border bg-background px-4 py-12 text-center', className)} {...props}>
      {logo ?? <Logo />}
      <nav aria-label="Footer">
        <ul className="m-0 flex list-none flex-wrap justify-center gap-x-8 gap-y-3 p-0">
          {links.map(l => <li key={l.href} className="flex"><a href={l.href} className={footerLink}>{l.label}</a></li>)}
        </ul>
      </nav>
      {social.length ? (
        <ul aria-label="Contact" className="m-0 flex list-none gap-2 p-0">
          {social.map(s => (
            <li key={s.href}>
              <Button asChild variant="ghost" size="icon"><a href={s.href} aria-label={s.label}>{s.icon}</a></Button>
            </li>
          ))}
        </ul>
      ) : null}
      <p className="m-0 text-sm leading-5 text-muted-foreground">
        {copyright}
        {legal.map(l => <React.Fragment key={l.href}>{' · '}<a href={l.href} className={footerLink}>{l.label}</a></React.Fragment>)}
      </p>
    </footer>
  );
}

export { SiteFooter, SiteFooterCentered, SiteFooterCorporate, SiteFooterNewsletter, SiteFooterSimple, SiteNavbar, SiteNavLinks };
