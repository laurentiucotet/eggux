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
import * as React from 'react';
import { ChevronRight, Menu, ShoppingBag } from '@/components/icons';
import { cn } from '@/lib/utils';
import { BadgeCount } from './badge-count';
import { Button } from './button';
import { Logo } from './logo';
import { NavLink } from './nav-link';
import { Separator } from './separator';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './sheet';

export interface SiteLink { label: string; href: string; active?: boolean; /** Opens a section menu (chevron). */ hasMenu?: boolean }

export interface SiteNavbarProps extends React.ComponentProps<'header'> {
  links: SiteLink[];
  logo?: React.ReactNode;
  homeHref?: string;
  signIn?: { label?: string; href: string };
  cta: { label: string; href: string };
  /** Items in the cart (shops); shows the cart button. */
  cartCount?: number;
  variant?: 'default' | 'on-image';
}

function SiteNavbar({ links, logo, homeHref = '/', signIn, cta, cartCount, variant = 'default', className, ...props }: SiteNavbarProps) {
  const onImage = variant === 'on-image';
  const [open, setOpen] = React.useState(false);
  const textOn = onImage ? 'text-[var(--video-foreground)] hover:bg-white/10 hover:text-[var(--video-foreground)] aria-[current=page]:bg-white/15 aria-[current=page]:text-[var(--video-foreground)]' : '';
  const brand = (
    <a href={homeHref} className="flex shrink-0 rounded-md outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50">
      {logo ?? <Logo className={onImage ? '[&_[data-slot=logo-name]]:text-[var(--video-foreground)]' : undefined} />}
    </a>
  );
  return (
    <header
      data-slot="site-navbar"
      data-variant={variant}
      className={cn('@container flex w-full justify-center', onImage ? 'bg-transparent' : 'border-b border-border bg-background', className)}
      {...props}
    >
      {/* Desktop */}
      <div className="hidden w-full max-w-[1152px] items-center gap-8 py-3 @3xl:flex">
        {brand}
        <nav aria-label="Main" className="min-w-0 flex-1">
          <ul className="m-0 flex list-none items-center gap-1 p-0">
            {links.map(l => (
              <li key={l.href} className="flex">
                <NavLink href={l.href} active={l.active} showChevron={l.hasMenu} className={textOn}>{l.label}</NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          {cartCount !== undefined ? (
            <a href="/cart" className={cn('relative flex size-9 items-center justify-center rounded-full outline-none hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50 [&_svg]:size-4', onImage && 'text-[var(--video-foreground)] hover:bg-white/10')}>
              <ShoppingBag aria-hidden="true" />
              <span className="sr-only">Cart, {cartCount} items</span>
              {cartCount > 0 ? <BadgeCount aria-hidden="true" count={cartCount} className="absolute -top-1 left-5" /> : null}
            </a>
          ) : null}
          {signIn ? <Button asChild variant="ghost" className={onImage ? 'text-[var(--video-foreground)] hover:bg-white/10 hover:text-[var(--video-foreground)]' : undefined}><a href={signIn.href}>{signIn.label ?? 'Sign in'}</a></Button> : null}
          <Button asChild><a href={cta.href}>{cta.label}</a></Button>
        </div>
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
            <nav aria-label="Main" className="flex min-h-0 flex-1 flex-col">
              <ul className="m-0 flex list-none flex-col p-4 pt-0">
                {links.map(l => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      aria-current={l.active ? 'page' : undefined}
                      onClick={() => setOpen(false)}
                      className="flex h-12 items-center justify-between rounded-md text-lg leading-7 font-semibold text-foreground outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-[current=page]:text-brand"
                    >
                      {l.label}
                      {l.hasMenu ? <ChevronRight aria-hidden="true" className="size-4" /> : null}
                    </a>
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

export { SiteFooter, SiteFooterSimple, SiteNavbar };
