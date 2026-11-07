// EGG UI Quote, Testimonial Card and Footnote. Figma: Quote page: Quote (381:5030), Testimonial Card
// (695:146305), Footnote (449:2147).
// Quote: default (2 px left rule, 24 px in, body/large semibold quote, attribution: 24 avatar, name
// ui/label up to 192, role muted filling the rest of the line, 12 gap); pull (centered, a 48 muted
// quote mark, heading/h3 quote, 32 avatar with name over role, 16 gap); large (centered, a 72 mark,
// display 48 quote, 24 gap). The component adds the quote mark; the text has none.
// Testimonial Card: default (card, radius xl, 24 padding, 16 gap: optional Rating sm, the quote in
// body/default, Byline lg); minimal (no card, body/large semibold quote); logo (card with the
// customer's logo, 32 high, above the quote); featured (720 wide card: a 3:4 photo on the left,
// then 32 padding with the logo, a heading/h3 quote and the Byline, 24 gap).
// Footnote: the number (ui/caption muted), the note (body/small muted) and "Back to text" with an
// up arrow (ui/caption), 8 gap.
// A11y: quotes are <figure> with <blockquote> and <figcaption>; the mark is decorative; footnotes
// are list items with an id the superscript links to, and the back link returns to the reference.
import * as React from 'react';
import { ArrowUp } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Avatar } from './avatar';
import { Byline } from './byline';
import { ImagePlaceholder } from './image-placeholder';
import { Rating } from './rating';

export interface QuotePerson { name: string; role?: string; initials?: string; avatar?: string }

export interface QuoteProps extends Omit<React.ComponentProps<'figure'>, 'children'> {
  quote: React.ReactNode;
  variant?: 'default' | 'pull' | 'large';
  /** Figma Show attribution. */
  by?: QuotePerson;
  /** Figma Show avatar. */
  showAvatar?: boolean;
  cite?: string;
}

function Quote({ quote, variant = 'default', by, showAvatar = true, cite, className, ...props }: QuoteProps) {
  if (variant === 'default') {
    return (
      <figure data-slot="quote" data-variant="default" className={cn('m-0 flex w-full flex-col items-start gap-3 border-l-2 border-border pl-6', className)} {...props}>
        <blockquote cite={cite} className="m-0 w-full text-lg leading-7 font-semibold text-foreground [overflow-wrap:anywhere]">{quote}</blockquote>
        {by ? (
          <figcaption className="flex w-full min-w-0 items-center gap-3">
            {showAvatar ? <Avatar size="sm" initials={by.initials} src={by.avatar} /> : null}
            <span className="flex min-w-0 flex-1 flex-wrap gap-x-1 text-sm leading-5">
              <span title={by.name} className="max-w-48 truncate font-medium text-foreground">{by.name}</span>
              {by.role ? <span className="min-w-40 flex-1 text-muted-foreground">{by.role}</span> : null}
            </span>
          </figcaption>
        ) : null}
      </figure>
    );
  }
  const large = variant === 'large';
  return (
    <figure data-slot="quote" data-variant={variant} className={cn('m-0 flex w-full flex-col items-center text-center', large ? 'gap-6' : 'gap-4', className)} {...props}>
      <span aria-hidden="true" className={cn('font-extrabold tracking-tight text-muted-foreground', large ? 'h-[72px] text-7xl leading-[72px]' : 'h-12 text-5xl leading-12')}>“</span>
      <blockquote cite={cite} className={cn('m-0 w-full text-foreground [overflow-wrap:anywhere]', large ? 'text-5xl leading-12 font-extrabold tracking-tight' : 'text-2xl leading-8 font-semibold tracking-tight')}>{quote}</blockquote>
      {by ? (
        <figcaption className="flex max-w-[280px] items-center gap-3 text-left">
          {showAvatar ? <Avatar initials={by.initials} src={by.avatar} /> : null}
          <span className="flex min-w-0 flex-col gap-0.5 text-sm leading-5">
            <span title={by.name} className="max-w-48 truncate font-medium text-foreground">{by.name}</span>
            {by.role ? <span className="text-muted-foreground">{by.role}</span> : null}
          </span>
        </figcaption>
      ) : null}
    </figure>
  );
}

export interface TestimonialCardProps extends Omit<React.ComponentProps<'figure'>, 'children'> {
  quote: string;
  by: QuotePerson;
  variant?: 'default' | 'minimal' | 'logo' | 'featured';
  /** Figma Show rating (default). */
  rating?: number;
  /** The customer's logo (logo, featured), 32 high. */
  logo?: React.ReactNode;
  /** Figma Show image (featured): the person or the customer's photo. */
  image?: string;
}

function TestimonialCard({ quote, by, variant = 'default', rating, logo, image, className, ...props }: TestimonialCardProps) {
  const byline = <Byline size="lg" name={by.name} description={by.role} avatar={{ initials: by.initials, src: by.avatar }} />;
  if (variant === 'featured') {
    return (
      <figure data-slot="testimonial-card" data-variant="featured" className={cn('m-0 flex w-full min-w-0 items-stretch overflow-hidden rounded-xl border border-border bg-card text-card-foreground', className)} {...props}>
        {image !== undefined ? <ImagePlaceholder ratio="3:4" src={image} alt="" showCaption={false} className="w-[215px] shrink-0 self-stretch" /> : null}
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-6 p-8">
          {logo ? <div className="flex h-8 items-center">{logo}</div> : null}
          <blockquote className="m-0 text-2xl leading-8 font-semibold tracking-tight [overflow-wrap:anywhere]">{quote}</blockquote>
          <figcaption>{byline}</figcaption>
        </div>
      </figure>
    );
  }
  const minimal = variant === 'minimal';
  return (
    <figure
      data-slot="testimonial-card"
      data-variant={variant}
      className={cn('m-0 flex w-full min-w-0 flex-col items-start gap-4', !minimal && 'rounded-xl border border-border bg-card p-6 text-card-foreground', className)}
      {...props}
    >
      {variant === 'default' && rating != null ? <Rating value={rating} size="sm" /> : null}
      {variant === 'logo' && logo ? <div className="flex h-8 items-center">{logo}</div> : null}
      <blockquote className={cn('m-0 w-full [overflow-wrap:anywhere]', minimal ? 'text-lg leading-7 font-semibold' : 'text-base leading-7')}>{quote}</blockquote>
      <figcaption>{byline}</figcaption>
    </figure>
  );
}

function Footnotes({ className, ...props }: React.ComponentProps<'ol'>) {
  return <ol data-slot="footnotes" className={cn('m-0 flex list-none flex-col gap-3 p-0', className)} {...props} />;
}

export interface FootnoteProps extends Omit<React.ComponentProps<'li'>, 'id'> {
  number: number | string;
  /** The note's id (the superscript links to #id). */
  id: string;
  /** The id of the reference in the text: shows "Back to text". */
  refId?: string;
  backLabel?: string;
}

function Footnote({ number, id, refId, backLabel = 'Back to text', className, children, ...props }: FootnoteProps) {
  return (
    <li id={id} data-slot="footnote" className={cn('flex w-full min-w-0 items-start gap-2 scroll-mt-4', className)} {...props}>
      <span className="text-xs leading-4 whitespace-nowrap text-muted-foreground">{number}</span>
      <div className="flex min-w-0 flex-1 flex-col items-start gap-1">
        <p className="m-0 text-sm leading-5 text-muted-foreground [overflow-wrap:anywhere]">{children}</p>
        {refId ? (
          <a href={`#${refId}`} className="flex items-center gap-1 rounded-sm text-xs leading-4 text-foreground no-underline outline-none hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/50">
            <ArrowUp aria-hidden="true" className="size-3" />
            {backLabel}
            <span className="sr-only"> {number}</span>
          </a>
        ) : null}
      </div>
    </li>
  );
}

/** The superscript reference in the text: links to the footnote. */
function FootnoteRef({ number, id, noteId, className, ...props }: { number: number | string; id: string; noteId: string } & Omit<React.ComponentProps<'a'>, 'id'>) {
  return (
    <sup data-slot="footnote-ref" className={cn('text-xs', className)}>
      <a id={id} href={`#${noteId}`} className="rounded-sm text-foreground underline underline-offset-2 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50" {...props}>
        {number}
        <span className="sr-only"> (footnote)</span>
      </a>
    </sup>
  );
}

export { Footnote, FootnoteRef, Footnotes, Quote, TestimonialCard };
