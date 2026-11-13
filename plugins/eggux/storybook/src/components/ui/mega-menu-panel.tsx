// EGG UI Mega Menu Panel. Code only (no Figma component yet). The wide panel a site navbar opens
// under one top level item (Products, Solutions): up to four columns of links, each with a heading,
// an optional icon, a one line description and a badge, and one featured card (media, title, text,
// link) at the end. It is a <nav> with its own name, headings are real headings, links are real
// links, the current one has aria-current="page". The layout answers to the width of the panel,
// not the screen (container queries): 1 column under 28 rem, 2 columns up to 48 rem, 3 (4 without a featured card) and the
// featured card beside them above that, so it also works in a narrow side panel (276 px).
// MegaMenuPanel is the content (use it inline as an expanded region). MegaMenu is the finished
// navbar item: a button plus the panel in a Popover (click or Enter opens, Escape closes and
// returns focus to the button, Tab walks the links). Not for fewer than six links (use a
// Dropdown Menu) and not for hover-only opening.
import * as React from 'react';
import { ArrowRight, ChevronDown } from '@/components/icons';
import { cn } from '@/lib/utils';
import { AspectRatio } from './aspect-ratio';
import { Button } from './button';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

export interface MegaMenuLink {
  label: string;
  href: string;
  /** One line under the label (two at most, then cut). */
  description?: string;
  /** A 16 px icon from `@/components/icons`. */
  icon?: React.ReactNode;
  /** A short tag after the label ("New"). */
  badge?: string;
  /** The page the visitor is on: aria-current="page". */
  current?: boolean;
}

export interface MegaMenuColumn {
  heading: string;
  links: MegaMenuLink[];
}

export interface MegaMenuFeatured {
  /** Small line above the title ("New"). */
  eyebrow?: string;
  title: string;
  description?: string;
  href: string;
  /** Link text, a verb phrase ("Read the announcement"). */
  cta: string;
  /** An image, or any node; shown in a 16:9 box above the text. */
  media?: React.ReactNode;
}

export interface MegaMenuPanelProps extends Omit<React.ComponentProps<'nav'>, 'children'> {
  columns: MegaMenuColumn[];
  featured?: MegaMenuFeatured;
  /** A row under the columns (a link to the full list, a help line). */
  footer?: React.ReactNode;
  /** Heading level of the column headings. Default 3. */
  headingLevel?: 2 | 3 | 4;
  /** No border, radius or shadow: for a surface that already has them (Popover). */
  bare?: boolean;
}

const focusRing = 'outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50';

function MegaMenuPanel({ columns, featured, footer, headingLevel = 3, bare = false, className, 'aria-label': ariaLabel = 'Site menu', ...props }: MegaMenuPanelProps) {
  const Heading = `h${headingLevel}` as 'h3';
  return (
    <nav
      data-slot="mega-menu-panel"
      aria-label={ariaLabel}
      className={cn(
        '@container w-full min-w-0 max-w-[60rem] bg-popover text-popover-foreground',
        !bare && 'rounded-lg border border-border shadow-md',
        className,
      )}
      {...props}
    >
      <div className="flex min-w-0 flex-col gap-6 p-4 @md:p-6 @3xl:flex-row">
        <div
          className={cn(
            'grid min-w-0 flex-1 grid-cols-1 content-start gap-x-6 gap-y-6 @md:grid-cols-2',
            columns.length > 2 && '@3xl:grid-cols-3',
            columns.length > 3 && (featured ? '@3xl:grid-cols-2' : '@3xl:grid-cols-4'),
          )}
        >
          {columns.map(col => (
            <section key={col.heading} data-slot="mega-menu-column" className="flex min-w-0 flex-col gap-2">
              <Heading className="m-0 px-2 text-xs leading-4 font-medium tracking-wide text-muted-foreground uppercase">{col.heading}</Heading>
              <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
                {col.links.map(link => (
                  <li key={link.href + link.label} className="min-w-0">
                    <a
                      href={link.href}
                      aria-current={link.current ? 'page' : undefined}
                      data-slot="mega-menu-link"
                      className={cn(
                        'group/link flex min-w-0 items-start gap-3 rounded-md px-2 py-2 text-sm leading-5 transition-colors duration-[var(--duration-fast)] hover:bg-accent hover:text-accent-foreground',
                        focusRing,
                        link.current && 'bg-accent text-accent-foreground',
                      )}
                    >
                      {link.icon ? (
                        <span aria-hidden="true" className="mt-0.5 flex size-5 shrink-0 items-center justify-center text-muted-foreground [&_svg]:size-4">
                          {link.icon}
                        </span>
                      ) : null}
                      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <span className="flex min-w-0 items-center gap-2">
                          <span className="min-w-0 truncate font-medium">{link.label}</span>
                          {link.badge ? (
                            <span className="shrink-0 rounded-full bg-primary px-1.5 text-[10px] leading-4 font-semibold text-primary-foreground">{link.badge}</span>
                          ) : null}
                        </span>
                        {link.description ? <span className={cn('line-clamp-2 text-xs leading-4 group-hover/link:text-accent-foreground', link.current ? 'text-accent-foreground' : 'text-muted-foreground')}>{link.description}</span> : null}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        {featured ? (
          <a
            href={featured.href}
            data-slot="mega-menu-featured"
            className={cn(
              'group/featured flex min-w-0 flex-col gap-3 self-start rounded-lg border border-border bg-muted/50 p-3 transition-colors duration-[var(--duration-fast)] hover:bg-muted @3xl:w-64 @3xl:shrink-0',
              focusRing,
            )}
          >
            {featured.media ? <AspectRatio ratio="16:9">{featured.media}</AspectRatio> : null}
            <span className="flex min-w-0 flex-col gap-1">
              {featured.eyebrow ? <span className="text-xs leading-4 font-medium text-muted-foreground">{featured.eyebrow}</span> : null}
              <span className="text-sm leading-5 font-semibold text-foreground">{featured.title}</span>
              {featured.description ? <span className="line-clamp-3 text-xs leading-4 text-muted-foreground">{featured.description}</span> : null}
            </span>
            <span className="inline-flex items-center gap-1 text-sm leading-5 font-medium text-brand">
              {featured.cta}
              <ArrowRight aria-hidden="true" className="size-4 shrink-0 transition-transform duration-[var(--duration-fast)] motion-reduce:transition-none group-hover/featured:translate-x-0.5" />
            </span>
          </a>
        ) : null}
      </div>
      {footer ? <div data-slot="mega-menu-footer" className="min-w-0 border-t border-border px-4 py-3 text-sm text-muted-foreground @md:px-6">{footer}</div> : null}
    </nav>
  );
}

export interface MegaMenuProps extends Omit<MegaMenuPanelProps, 'bare' | 'aria-label'> {
  /** The navbar item text ("Products"). Also names the panel. */
  label: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/** A navbar item: a button that opens the panel in a Popover. */
function MegaMenu({ label, open, defaultOpen, onOpenChange, className, ...panel }: MegaMenuProps) {
  return (
    <Popover open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="ghost" data-slot="mega-menu-trigger" className="group/trigger">
          {label}
          <ChevronDown aria-hidden="true" className="transition-transform duration-[var(--duration-fast)] group-data-[state=open]/trigger:rotate-180 motion-reduce:transition-none" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        aria-label={label}
        align="start"
        sideOffset={8}
        collisionPadding={8}
        className={cn('w-[min(60rem,calc(100vw-1rem))] max-w-none p-0', className)}
      >
        <MegaMenuPanel bare aria-label={`${label} menu`} {...panel} />
      </PopoverContent>
    </Popover>
  );
}

export { MegaMenuPanel, MegaMenu };
