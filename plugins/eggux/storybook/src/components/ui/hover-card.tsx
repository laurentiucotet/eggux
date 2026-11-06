// EGG UI Hover Card. Figma: Hover Card (Popover page, "Hover Card / Component", symbol 120:133).
// shadcn HoverCard on Radix: a read-only preview of a person, record or link that opens after
// ~500 ms on hover or keyboard focus of a real link, and never on touch (Radix ignores touch
// pointers, so a tap goes to the page). Panel: 320 wide (spacing/80), popover surface, 1 px
// border, radius md, shadow md, 16 px padding, 4 px from the trigger. Content slot default:
// Avatar lg, then name (ui/label), handle (ui/caption muted), a short detail (body/small) and a
// meta line with a 14 px calendar icon and a date (ui/caption muted), 16 px between avatar and
// text, 4 px between lines (HoverCardPerson). Anything in the card must also be on the target page.
import * as React from 'react';
import { HoverCard as HoverCardPrimitive } from 'radix-ui';
import { Calendar } from '@/components/icons';
import { cn } from '@/lib/utils';

function HoverCard({ openDelay = 500, closeDelay = 200, ...props }: React.ComponentProps<typeof HoverCardPrimitive.Root>) {
  return <HoverCardPrimitive.Root data-slot="hover-card" openDelay={openDelay} closeDelay={closeDelay} {...props} />;
}

/** The trigger must be a real link (asChild on an <a href>), so the target works without the card. */
function HoverCardTrigger(props: React.ComponentProps<typeof HoverCardPrimitive.Trigger>) {
  return <HoverCardPrimitive.Trigger data-slot="hover-card-trigger" {...props} />;
}

function HoverCardContent({ className, align = 'start', sideOffset = 4, collisionPadding = 8, ...props }: React.ComponentProps<typeof HoverCardPrimitive.Content>) {
  return (
    <HoverCardPrimitive.Portal>
      <HoverCardPrimitive.Content
        data-slot="hover-card-content"
        align={align}
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        className={cn(
          'z-50 w-80 max-w-[calc(100vw-16px)] rounded-md border border-border bg-popover p-4 text-popover-foreground shadow-md outline-none',
          className,
        )}
        {...props}
      />
    </HoverCardPrimitive.Portal>
  );
}

export interface HoverCardPersonProps extends Omit<React.ComponentProps<'div'>, 'title'> {
  /** Figma Avatar instance (Avatar size lg). */
  avatar?: React.ReactNode;
  name: React.ReactNode;
  /** Handle and role: "@maria · Product designer". */
  handle?: React.ReactNode;
  /** One or two lines about the person or record. */
  detail?: React.ReactNode;
  /** Meta line with the calendar icon: "Joined March 2024". */
  meta?: React.ReactNode;
  /** Icon of the meta line. Default calendar. */
  metaIcon?: React.ReactNode;
}

/** Figma Content slot default: the person preview. Any other read-only content works too. */
function HoverCardPerson({ avatar, name, handle, detail, meta, metaIcon, className, ...props }: HoverCardPersonProps) {
  return (
    <div data-slot="hover-card-person" className={cn('flex min-w-0 items-start gap-4', className)} {...props}>
      {avatar ? <div className="flex shrink-0">{avatar}</div> : null}
      <div className="flex min-w-0 flex-1 flex-col gap-1 break-words">
        <p className="truncate text-sm leading-5 font-medium text-foreground">{name}</p>
        {handle != null ? <p className="truncate text-xs leading-4 text-muted-foreground">{handle}</p> : null}
        {detail != null ? <p className="line-clamp-3 text-sm leading-5 text-foreground">{detail}</p> : null}
        {meta != null ? (
          <p data-slot="hover-card-meta" className="flex items-center gap-1.5 pt-1 text-xs leading-4 text-muted-foreground [&_svg]:size-3.5 [&_svg]:shrink-0">
            {metaIcon ?? <Calendar aria-hidden="true" />}
            <span className="min-w-0 truncate">{meta}</span>
          </p>
        ) : null}
      </div>
    </div>
  );
}

export { HoverCard, HoverCardTrigger, HoverCardContent, HoverCardPerson };
