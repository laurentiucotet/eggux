// EGG UI Store Locator Item. Code only (no Figma component yet). One result in a store locator list:
// name, address, distance, an open status ("Open now. Closes at 18:00") and two actions, Call and
// Directions. When `onSelect` is given the name is a button that stretches over the whole card (so
// a click anywhere selects it, on the map and in the list); the actions stay on top and keep their
// own click. The selected item has a primary border and `aria-current`. Meant for a list (`<ul>`
// of `<li>`), next to a Map Frame. Built on Badge, Button and Distance Badge.
import * as React from 'react';
import { Phone, Send } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Badge } from './badge';
import { Button } from './button';
import { DistanceBadge, type DistanceUnit } from './distance-badge';

export type StoreOpenStatus = 'open' | 'closing-soon' | 'closed';

export interface StoreLocatorItemProps extends Omit<React.ComponentProps<'article'>, 'children' | 'onSelect'> {
  /** The store name (heading). */
  name: string;
  /** The address, one or two lines. */
  address: string;
  /** Distance in metres from the shopper. */
  distanceMeters?: number;
  unit?: DistanceUnit;
  /** Open now, closing soon or closed. Leave out when the hours are unknown. */
  status?: StoreOpenStatus;
  /** Next to the badge: "Closes at 18:00", "Opens tomorrow at 09:00". */
  statusText?: string;
  /** Phone number in international format; makes the Call button a `tel:` link. */
  phone?: string;
  /** Maps link of the Directions button. */
  directionsHref?: string;
  /** The selected item (the pin on the map is selected too). */
  selected?: boolean;
  /** Makes the name a button; runs when the item is chosen. */
  onSelect?: () => void;
  /** Heading level of the name. Default 3. */
  headingLevel?: 2 | 3 | 4;
}

const statusBadge: Record<StoreOpenStatus, { variant: 'soft-success' | 'soft-warning' | 'soft-neutral'; label: string }> = {
  open: { variant: 'soft-success', label: 'Open now' },
  'closing-soon': { variant: 'soft-warning', label: 'Closing soon' },
  closed: { variant: 'soft-neutral', label: 'Closed' },
};

function StoreLocatorItem({ name, address, distanceMeters, unit = 'metric', status, statusText, phone, directionsHref, selected = false, onSelect, headingLevel = 3, className, ...props }: StoreLocatorItemProps) {
  const Heading = `h${headingLevel}` as 'h3';
  const badge = status ? statusBadge[status] : null;
  const title = <span className="min-w-0 truncate">{name}</span>;
  return (
    <article
      data-slot="store-locator-item"
      data-selected={selected || undefined}
      className={cn(
        'relative flex w-full min-w-0 flex-col gap-3 rounded-lg border bg-card p-4 text-card-foreground transition-[border-color,box-shadow] duration-[var(--duration-fast)] has-[[data-slot=store-locator-select]:focus-visible]:ring-[3px] has-[[data-slot=store-locator-select]:focus-visible]:ring-ring/50',
        selected ? 'border-primary ring-1 ring-primary' : 'border-border',
        onSelect && !selected && 'hover:bg-accent/50',
        className,
      )}
      {...props}
    >
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <Heading className="m-0 flex min-w-0 text-base leading-6 font-semibold">
            {onSelect ? (
              <button
                type="button"
                data-slot="store-locator-select"
                aria-current={selected || undefined}
                onClick={onSelect}
                className="flex min-w-0 cursor-pointer items-center text-left outline-none after:absolute after:inset-0 after:rounded-lg after:content-['']"
              >
                {title}
              </button>
            ) : (
              title
            )}
          </Heading>
          <address className="text-sm leading-5 text-muted-foreground not-italic">{address}</address>
        </div>
        {distanceMeters !== undefined ? <DistanceBadge meters={distanceMeters} unit={unit} className="shrink-0" /> : null}
      </div>
      {badge ? (
        <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
          <Badge variant={badge.variant} dot>{badge.label}</Badge>
          {statusText ? <span className="min-w-0 text-xs text-muted-foreground">{statusText}</span> : null}
        </div>
      ) : null}
      {phone || directionsHref ? (
        <div className="relative z-10 flex min-w-0 flex-wrap gap-2">
          {phone ? (
            <Button asChild variant="outline" size="sm">
              <a href={`tel:${phone.replace(/[^+\d]/g, '')}`}>
                <Phone aria-hidden="true" />
                Call<span className="sr-only"> {name}, {phone}</span>
              </a>
            </Button>
          ) : null}
          {directionsHref ? (
            <Button asChild variant="soft" size="sm">
              <a href={directionsHref}>
                <Send aria-hidden="true" />
                Directions<span className="sr-only"> to {name}</span>
              </a>
            </Button>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}

export { StoreLocatorItem };
