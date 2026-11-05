// EGG UI Sources, Source Item and Citation. Figma: Sources, Source Item, Citation
// (AI Chat / Sources / Component). Sources: Label, Show list (initial open state), Favicon 1-3 and
// the Items slot (children). The header is a Collapsible trigger (radix-ui) named by the count.
// Source Item: Number, Letter, Title, Domain; a link that opens a new tab. Citation: Label, an
// inline marker after a claim that links to its source.
import * as React from 'react';
import { Collapsible } from 'radix-ui';
import { ChevronDown } from '@/components/icons';
import { cn } from '@/lib/utils';

const firstLetter = (text: string) => Array.from(text.trim())[0] ?? '';

/* ------------------------------------------------------------------------------------------ */

export interface SourcesProps extends Omit<React.ComponentProps<'div'>, 'dir'> {
  /** Figma Label: the count ("3 sources"); it names the toggle. */
  label?: string;
  /** Figma Show list: whether the list starts open. `open` controls it. */
  showList?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Figma Favicon 1 to 3: the Letters of the first three Source Items, in the same order. */
  favicon1?: string;
  favicon2?: string;
  favicon3?: string;
  /** Figma Items slot: Source Items. */
  children?: React.ReactNode;
}

function Sources({
  label = '3 sources',
  showList = true,
  open,
  onOpenChange,
  favicon1 = 'B',
  favicon2 = 'D',
  favicon3 = 'C',
  className,
  children,
  ...props
}: SourcesProps) {
  // One letter per tile (the first letter of the site or app), so it always fits its 20 px tile.
  const favicons = [favicon1, favicon2, favicon3].filter(Boolean).map(firstLetter);
  return (
    <Collapsible.Root
      data-slot="sources"
      defaultOpen={showList}
      open={open}
      onOpenChange={onOpenChange}
      className={cn('flex w-full flex-col items-start gap-2', className)}
      {...props}
    >
      <Collapsible.Trigger
        data-slot="sources-trigger"
        className="flex w-full min-w-0 items-center gap-2 rounded-md text-left outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        <span aria-hidden="true" className="isolate flex shrink-0 items-start">
          {favicons.map((letter, i) => (
            <span
              key={i}
              data-slot="sources-favicon"
              className={cn(
                'flex size-5 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-background bg-muted text-center text-xs text-muted-foreground',
                i < favicons.length - 1 && '-mr-1',
                i === 0 ? 'z-3' : i === 1 ? 'z-2' : 'z-1',
              )}
            >
              {letter}
            </span>
          ))}
        </span>
        <span data-slot="sources-label" className="min-w-0 flex-1 truncate text-sm font-medium leading-5 text-muted-foreground">{label}</span>
        <ChevronDown className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      </Collapsible.Trigger>
      <Collapsible.Content data-slot="sources-items" className="w-full">
        {/* Items fill the row between 240 and 384 and wrap: two per row at 720, one under ~500. */}
        <ul className="flex w-full flex-wrap items-start gap-1">{children}</ul>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}

/* ------------------------------------------------------------------------------------------ */

export interface SourceItemProps extends Omit<React.ComponentProps<'a'>, 'title'> {
  /** Figma Number: matches the Citation. */
  number?: string | number;
  /** Figma Letter: first letter of the site or app (decorative). */
  letter?: string;
  /** Figma Title. */
  title?: string;
  /** Figma Domain. */
  domain?: string;
}

function SourceItem({
  number = '1',
  letter = 'B',
  title = 'Invoice INV-1024',
  domain = 'billing.acme.com',
  href = '#',
  className,
  ...props
}: SourceItemProps) {
  return (
    <li data-slot="source-item" className="flex min-w-0 max-w-96 grow basis-60">
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={cn(
          'flex w-full min-w-0 items-center gap-2 rounded-md px-2 py-1.5 outline-none transition-colors duration-[var(--duration-fast)] hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50',
          className,
        )}
        {...props}
      >
        <span aria-hidden="true" className="w-3 shrink-0 text-center text-xs text-muted-foreground">{number}</span>
        <span aria-hidden="true" className="flex size-5 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-center text-xs text-muted-foreground">
          {firstLetter(letter)}
        </span>
        <span className="flex min-w-0 flex-1 flex-col">
          <span data-slot="source-item-title" className="truncate text-sm font-medium leading-5 text-foreground">{title}</span>
          <span data-slot="source-item-domain" className="truncate text-xs text-muted-foreground">{domain}</span>
        </span>
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    </li>
  );
}

/* ------------------------------------------------------------------------------------------ */

export interface CitationProps extends React.ComponentProps<'a'> {
  /** Figma Label: the source number ("1") or a domain ("acme.com +2"). */
  label?: string;
  /** Title of the source, for the accessible name ("Source 1: Invoice INV-1024") and the tooltip. */
  source?: string;
}

function Citation({ label = '1', source, href = '#', className, ...props }: CitationProps) {
  const name = source ? `Source ${label}: ${source}` : `Source ${label}`;
  return (
    <a
      data-slot="citation"
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={`${name} (opens in a new tab)`}
      // TODO: Figma shows a Hover Card with the source on hover; the library has no Hover Card yet.
      title={name}
      // Figma uses foreground/muted on background/muted (4.34:1, under 4.5:1); the label uses
      // foreground until the token pair is fixed in Figma (design finding).
      className={cn(
        'inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-muted px-1.5 align-[-4px] text-xs font-normal whitespace-nowrap text-foreground no-underline outline-none transition-colors duration-[var(--duration-fast)] hover:bg-accent hover:text-accent-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50',
        className,
      )}
      {...props}
    >
      {label}
    </a>
  );
}

export { Sources, SourceItem, Citation };
