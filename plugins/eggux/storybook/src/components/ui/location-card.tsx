// EGG UI Location Card. Figma: Location Card (Card page, "Location Card / Component"). City with an
// optional tag Badge, full address in an <address>, phone and hours as Meta Items and a Get
// directions link. `map` is the Show map slot: the Map component is not in code yet, so the slot
// takes any element (a static map image) and keeps the card radius on top; keep the written address
// either way. Built on Card, Badge, Meta Item and Button (link).
import * as React from 'react';
import { ExternalLink } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Card } from './card';

export interface LocationCardProps extends Omit<React.ComponentProps<'div'>, 'title'> {
  /** Figma City: the card heading (h3). */
  city: string;
  /** Figma Address, in the format of the country. */
  address: string;
  /** Figma Show tag + tag Badge (Headquarters, Store). */
  tag?: React.ReactNode;
  /** Figma Meta Items: phone and hours (`tel:` link in international format for the phone). */
  meta?: React.ReactNode;
  /** Figma Show map: a map element for the top of the card. Needs a title or alt on the map itself. */
  map?: React.ReactNode;
  /** The maps link of Get directions. */
  directionsHref: string;
  /** The place named in the link ("Berlin office"). */
  directionsLabel?: string;
}

function LocationCard({ city, address, tag, meta, map, directionsHref, directionsLabel, className, ...props }: LocationCardProps) {
  const place = directionsLabel ?? city;
  return (
    <Card data-slot="location-card" className={cn('w-80 max-w-full gap-0 overflow-clip py-0', className)} {...props}>
      {map ? <div data-slot="location-card-map" className="h-[180px] w-full overflow-clip rounded-t-[calc(var(--radius-xl)-1px)] bg-muted">{map}</div> : null}
      <div className="flex min-w-0 flex-col gap-3 p-5">
        <div className="flex min-w-0 items-center gap-2">
          <h3 className="min-w-0 flex-1 text-xl leading-7 font-semibold tracking-tight">{city}</h3>
          {tag}
        </div>
        <address className="text-sm text-muted-foreground not-italic">{address}</address>
        {meta ? <div data-slot="location-card-meta" className="flex min-w-0 flex-col gap-1.5">{meta}</div> : null}
        <Button asChild variant="link" size="sm" className="h-8 self-start">
          <a href={directionsHref} target="_blank" rel="noopener noreferrer">
            Get directions
            <ExternalLink aria-hidden="true" />
            <span className="sr-only"> to {place} (opens in a new tab)</span>
          </a>
        </Button>
      </div>
    </Card>
  );
}

export { LocationCard };
