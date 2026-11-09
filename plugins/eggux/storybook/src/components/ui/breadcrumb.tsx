// EGG UI Breadcrumb. Figma: Breadcrumb (Navigation page, "Breadcrumb / Component"), built from
// Breadcrumb Item. shadcn Breadcrumb: <nav aria-label="Breadcrumb"> > <ol> of items; every item
// but the last is a link, the last is the current page (aria-current="page", no separator).
// Style=default: plain items, for app top bars and page headers. Style=background: the list sits
// in a pill track (card/muted-background = --card-muted, button/radius, 12 x 6 padding) for
// marketing, docs and help pages, on background/default only. Items gap 6 (spacing/1_5); when the
// space is narrower they wrap with a 4 px row gap (spacing/1). Deep paths (past `maxItems`, 4)
// collapse the middle levels into an ellipsis button "Show path" that opens a DropdownMenu.
import * as React from 'react';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './dropdown-menu';
import { BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from './breadcrumb-item';

export type BreadcrumbStyle = 'default' | 'background';

export interface BreadcrumbEntry {
  /** Label of the level; the last one matches the page title. */
  label: React.ReactNode;
  /** URL of the level. The last entry is the current page and needs none. */
  href?: string;
}

export interface BreadcrumbProps extends React.ComponentProps<'nav'> {
  /** Figma Style: default (no surface) or background (muted pill track, marketing and docs). */
  breadcrumbStyle?: BreadcrumbStyle;
  /**
   * The path as data, root first, current page last. Renders the list for you, with the middle
   * collapsed past `maxItems`. Leave it out to compose BreadcrumbList and items as children.
   */
  items?: BreadcrumbEntry[];
  /** Levels shown before the middle collapses into an ellipsis: the root, the ellipsis and the last ones. Default 4. */
  maxItems?: number;
  /**
   * Called when a collapsed level is chosen in the "Show path" menu. Use your router here; by
   * default the browser goes to the href.
   */
  onNavigate?: (href: string) => void;
  /** Renders each link, for router links: `(entry, props) => <Link to={entry.href} {...props} />`. */
  renderLink?: (entry: BreadcrumbEntry, props: { className?: string; children: React.ReactNode }) => React.ReactElement;
}

const styleClass: Record<BreadcrumbStyle, string> = {
  default: '',
  background: 'w-fit max-w-full rounded-button bg-[var(--card-muted)] px-3 py-1.5',
};

function Breadcrumb({ breadcrumbStyle = 'default', items, maxItems = 4, onNavigate, renderLink, className, children, 'aria-label': ariaLabel = 'Breadcrumb', ...props }: BreadcrumbProps) {
  return (
    <nav data-slot="breadcrumb" data-style={breadcrumbStyle} aria-label={ariaLabel} className={cn('min-w-0', styleClass[breadcrumbStyle], className)} {...props}>
      {items ? <BreadcrumbPath items={items} maxItems={maxItems} onNavigate={onNavigate} renderLink={renderLink} /> : children}
    </nav>
  );
}

/** Figma Items slot: an <ol> that wraps, gap 6, row gap 4. */
function BreadcrumbList({ className, ...props }: React.ComponentProps<'ol'>) {
  return <ol data-slot="breadcrumb-list" className={cn('m-0 flex min-w-0 list-none flex-wrap items-center gap-x-1.5 gap-y-1 p-0 text-sm leading-5 text-muted-foreground', className)} {...props} />;
}

function goTo(href: string) {
  window.location.assign(href);
}

function BreadcrumbPath({ items, maxItems, onNavigate = goTo, renderLink }: Required<Pick<BreadcrumbProps, 'items' | 'maxItems'>> & Pick<BreadcrumbProps, 'onNavigate' | 'renderLink'>) {
  const keep = Math.max(maxItems, 3);
  const collapse = items.length > keep;
  // Root, then the ellipsis, then the last (keep - 2) levels.
  const head = collapse ? items.slice(0, 1) : items;
  const hidden = collapse ? items.slice(1, items.length - (keep - 2)) : [];
  const tail = collapse ? items.slice(items.length - (keep - 2)) : [];

  const level = (entry: BreadcrumbEntry, index: number, isLast: boolean) => (
    <BreadcrumbItem key={index}>
      {isLast ? (
        <BreadcrumbPage>{entry.label}</BreadcrumbPage>
      ) : renderLink ? (
        <BreadcrumbLink asChild>{renderLink(entry, { children: entry.label })}</BreadcrumbLink>
      ) : (
        <BreadcrumbLink href={entry.href}>{entry.label}</BreadcrumbLink>
      )}
      {isLast ? null : <BreadcrumbSeparator />}
    </BreadcrumbItem>
  );

  return (
    <BreadcrumbList>
      {head.map((entry, i) => level(entry, i, !collapse && i === items.length - 1))}
      {collapse ? (
        <BreadcrumbItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <BreadcrumbEllipsis />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {hidden.map((entry, i) => (
                <DropdownMenuItem key={i} onSelect={() => entry.href && onNavigate(entry.href)}>
                  {entry.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <BreadcrumbSeparator />
        </BreadcrumbItem>
      ) : null}
      {tail.map((entry, i) => level(entry, items.length - tail.length + i, i === tail.length - 1))}
    </BreadcrumbList>
  );
}

export { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis };
