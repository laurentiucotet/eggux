// EGG UI Tour page: Coachmark (164:115), Hotspot (164:116), Annotation Pin (449:1903).
// Coachmark: one tour step or feature tip anchored to its target (Side top, right, bottom, left;
// the 16 × 8 arrow points at the target). Popover surface, border, radius md, shadow md, 16
// padding, 12 gap, 240-320 wide: optional media, title (body/large) with a 24 close, description
// (body/small muted), footer with the step ("2 of 4", ui/caption muted, truncates), Back (ghost
// sm) and Next / Done (sm). A non-modal dialog named by its title; focus moves into it; Escape
// and the close end the tour.
// Hotspot: a 24 beacon (12 primary dot with a 2 px background ring on a 20% primary halo that
// pulses, still with reduced motion); a button that opens its Coachmark.
// Annotation Pin: a numbered marker whose bottom-left corner is the point; 28 (active 32, shadow
// lg), primary with a 2 px background border; resolved on muted with a check. A button named
// "Comment 3" (", resolved"); active is aria-expanded.
import * as React from 'react';
import { Popover as PopoverPrimitive } from 'radix-ui';
import { Check, X } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button } from './button';

/* Coachmark */

export interface CoachmarkProps {
  /** The target the coachmark points at (rendered as the anchor). */
  children: React.ReactNode;
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  title: string;
  description: React.ReactNode;
  /** "2 of 4". */
  step?: string;
  media?: React.ReactNode;
  onBack?: () => void;
  onNext?: () => void;
  /** "Next", or "Done" on the last step. */
  nextLabel?: string;
  className?: string;
}

function Coachmark({ children, open, onOpenChange, side = 'bottom', align = 'center', title, description, step, media, onBack, onNext, nextLabel = 'Next', className }: CoachmarkProps) {
  const id = React.useId();
  return (
    <PopoverPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <PopoverPrimitive.Anchor asChild>{children}</PopoverPrimitive.Anchor>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          data-slot="coachmark"
          side={side}
          align={align}
          sideOffset={4}
          collisionPadding={8}
          aria-labelledby={`${id}-title`}
          aria-describedby={`${id}-desc`}
          onInteractOutside={e => e.preventDefault()}
          className={cn('z-50 flex w-80 max-w-[min(320px,calc(100vw-16px))] min-w-60 flex-col gap-3 rounded-md border border-border bg-popover p-4 text-popover-foreground shadow-md outline-none', className)}
        >
          {media ? <div className="overflow-hidden rounded-lg">{media}</div> : null}
          <div className="flex items-start gap-2">
            <h2 id={`${id}-title`} className="m-0 min-w-0 flex-1 text-lg leading-7 font-semibold">{title}</h2>
            <PopoverPrimitive.Close
              aria-label="Close tour"
              className="flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 [&_svg]:size-4"
            >
              <X aria-hidden="true" />
            </PopoverPrimitive.Close>
          </div>
          <p id={`${id}-desc`} className="m-0 text-sm leading-5 text-muted-foreground">{description}</p>
          <div className="flex items-center justify-between gap-2">
            <span className="min-w-0 flex-1 truncate text-xs leading-4 text-muted-foreground">{step}</span>
            <div className="flex shrink-0 gap-2">
              {onBack ? <Button variant="ghost" size="sm" onClick={onBack}>Back</Button> : null}
              <Button size="sm" onClick={onNext}>{nextLabel}</Button>
            </div>
          </div>
          <PopoverPrimitive.Arrow width={16} height={8} className="fill-popover stroke-border [stroke-dasharray:0_30_100]" />
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}

/* Hotspot */

export interface HotspotProps extends React.ComponentProps<'button'> {
  /** What it points at: "New: saved views". */
  label: string;
}

function Hotspot({ label, className, ...props }: HotspotProps) {
  return (
    <button type="button" data-slot="hotspot" aria-label={label} className={cn('relative inline-flex size-6 shrink-0 items-center justify-center rounded-full outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50', className)} {...props}>
      <span aria-hidden="true" className="absolute inset-0 rounded-full bg-primary/20 motion-safe:animate-ping [animation-duration:var(--duration-slow,1.5s)]" />
      <span aria-hidden="true" className="absolute inset-0 rounded-full bg-primary/20" />
      <span aria-hidden="true" className="relative size-3.5 rounded-full border-2 border-background bg-primary" />
    </button>
  );
}

/* Annotation Pin */

export interface AnnotationPinProps extends React.ComponentProps<'button'> {
  number: number;
  state?: 'default' | 'active' | 'resolved';
}

function AnnotationPin({ number, state = 'default', className, ...props }: AnnotationPinProps) {
  const active = state === 'active';
  const resolved = state === 'resolved';
  return (
    <button
      type="button"
      data-slot="annotation-pin"
      data-state={state}
      aria-label={`Comment ${number}${resolved ? ', resolved' : ''}`}
      aria-expanded={active}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-t-full rounded-br-full rounded-bl-[2px] border-2 border-background px-1.5 text-xs leading-4 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
        active ? 'h-8 min-w-8 bg-primary text-primary-foreground shadow-lg' : 'h-7 min-w-7 shadow-md',
        state === 'default' && 'bg-primary text-primary-foreground',
        resolved && 'bg-muted text-muted-foreground',
        className,
      )}
      {...props}
    >
      {resolved ? <Check aria-hidden="true" className="size-3.5" /> : number}
    </button>
  );
}

export { AnnotationPin, Coachmark, Hotspot };
