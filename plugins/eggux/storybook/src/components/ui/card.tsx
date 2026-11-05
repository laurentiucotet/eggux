// EGG UI Card. Figma: Card, Card Header and Card Footer (Card page, "Card / Component"). Card:
// Variant (default, outline, muted, inverted) x Size (default, sm) x Elevation (`elevated`),
// State hover/focus (`interactive`, for a card that is one link as a whole), Media=top (`media`).
// shadcn Card with the EGG changes from references/code-mapping.md. Padding and gap come from
// density/card-* (--card-padding, --card-gap and the -sm pair); Header, Content and Footer have
// their own side padding, so a slot with `className="px-0"` runs edge to edge.
import * as React from 'react';
import { Slot } from 'radix-ui';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export type CardVariant = 'default' | 'outline' | 'muted' | 'inverted';
export type CardSize = 'default' | 'sm';

// Every class name is written in full so Tailwind can generate it.
const cardVariants = cva('group/card relative flex min-w-0 flex-col rounded-xl', {
  variants: {
    variant: {
      default: 'border border-border bg-card text-card-foreground',
      outline: 'border border-border bg-transparent text-card-foreground',
      muted: 'border-0 bg-[var(--card-muted)] text-card-foreground',
      inverted: 'border border-foreground bg-foreground text-background',
    },
    size: {
      default: 'gap-[var(--card-gap)] py-[var(--card-padding)]',
      sm: 'gap-[var(--card-gap-sm)] py-[var(--card-padding-sm)]',
    },
    elevated: { true: 'shadow-md', false: '' },
    interactive: {
      true: 'cursor-pointer outline-none transition-[box-shadow,border-color] duration-[var(--duration-fast)] hover:border-foreground/20 hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring',
      false: '',
    },
    media: { true: 'pt-0', false: '' },
  },
  compoundVariants: [
    // An outline card gets the card background when it floats, so the shadow has a surface.
    { variant: 'outline', elevated: true, className: 'bg-card' },
    { variant: 'outline', interactive: true, className: 'bg-card' },
  ],
  defaultVariants: { variant: 'default', size: 'default', elevated: false, interactive: false, media: false },
});

export interface CardProps extends Omit<React.ComponentProps<'div'>, 'media'> {
  /** Figma Variant: default, outline (inside panels and long lists), muted (secondary information), inverted (the one card that must stand out). */
  variant?: CardVariant;
  /** Figma Size: default (padding and gap 24) or sm (16). */
  size?: CardSize;
  /** Figma Elevation: shadow md. For one card that must stand out or floats over content. */
  elevated?: boolean;
  /** Figma State=hover and focus: for a card that is one link or button as a whole (put it on the link with `asChild`). */
  interactive?: boolean;
  /** Figma Media=top: a full-bleed 16:9 Image Placeholder at the top, Header and Content below. */
  media?: React.ReactNode;
  /** Render the child element (a link) as the card. */
  asChild?: boolean;
}

function Card({ variant, size, elevated = false, interactive = false, media, asChild = false, className, children, ...props }: CardProps) {
  const Comp = asChild ? Slot.Root : 'div';
  const classes = cn(cardVariants({ variant, size, elevated, interactive, media: Boolean(media) }), className);
  const attrs = { 'data-slot': 'card', 'data-variant': variant ?? 'default', 'data-size': size ?? 'default' };
  if (asChild) {
    return <Comp {...attrs} className={classes} {...props}>{children}</Comp>;
  }
  return (
    <Comp {...attrs} className={classes} {...props}>
      {media ? <div data-slot="card-media" className="overflow-clip rounded-t-[calc(var(--radius-xl)-1px)] [&>*]:rounded-none">{media}</div> : null}
      {children}
    </Comp>
  );
}

const slotPadding = 'px-[var(--card-padding)] group-data-[size=sm]/card:px-[var(--card-padding-sm)]';

export interface CardHeaderProps extends Omit<React.ComponentProps<'div'>, 'title'> {
  /** Figma Show icon + Icon: a 20 px icon before the title. It names the card type; decorative (aria-hidden). */
  icon?: React.ReactNode;
  /** Figma Title: rendered as a heading (`titleAs`, h3 by default). */
  title?: React.ReactNode;
  titleAs?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  /** Figma Show description + Description. */
  description?: React.ReactNode;
  /** Figma Action slot, top right: a Button Icon with a label, a Badge or a Select. */
  action?: React.ReactNode;
}

function CardHeader({ icon, title, titleAs = 'h3', description, action, className, children, ...props }: CardHeaderProps) {
  const Heading = titleAs;
  return (
    <div data-slot="card-header" className={cn('flex min-w-0 items-start gap-2', slotPadding, className)} {...props}>
      {title || description || icon ? (
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <div className="flex min-w-0 items-center gap-2">
            {icon ? <span aria-hidden="true" data-slot="card-header-icon" className="flex size-5 shrink-0 items-center justify-center [&_svg]:size-5">{icon}</span> : null}
            {title ? <Heading data-slot="card-title" className="min-w-0 flex-1 text-lg font-semibold leading-7">{title}</Heading> : null}
          </div>
          {description ? (
            <p data-slot="card-description" className="text-sm text-muted-foreground group-data-[variant=inverted]/card:text-background/70">{description}</p>
          ) : null}
        </div>
      ) : null}
      {children}
      {action ? <div data-slot="card-action" className="-my-0 flex shrink-0 items-start gap-2 group-data-[variant=inverted]/card:text-background">{action}</div> : null}
    </div>
  );
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="card-content" className={cn('flex min-w-0 flex-col gap-4', slotPadding, className)} {...props} />;
}

/** Figma Card Footer: the Actions slot, right aligned. One primary action at most. */
function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="card-footer" className={cn('flex min-w-0 flex-wrap items-center justify-end gap-2', slotPadding, className)} {...props} />;
}

export { Card, CardHeader, CardContent, CardFooter, cardVariants };
