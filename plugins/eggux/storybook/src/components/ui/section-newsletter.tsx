// EGG UI blocks, BLOCKS / Sections page (73:2), Newsletter family: Block / Newsletter (139:498),
// Newsletter Split (693:109100), Newsletter Card (693:109139). Guide: build-ui/patterns/
// marketing-pages.md: the strip in content pages; Split with benefits and a photo; Card as the
// closing band of a blog. Every block is a <section> named by its title (h2), inside a 1152
// container (layout/container/6xl) with 24 / 32 px gutters below 1152; layout follows the block's
// own width (container queries). The sign-up is the library Inline Form: it checks the address,
// keeps it on error and says what happens next on success.
// Newsletter: 64 padding; a muted card (card/muted-background, radius 12, 48 padding) with the
// title (heading/h3) and body next to a 420 Inline Form with hint, 48 apart; stacked below 1024.
// Newsletter Split: 96 padding; overline, h2 (heading/h1), lead, three Check Items and a 480
// Inline Form, 24 apart, next to a 4:3 Image Placeholder (radius 12), 64 apart; image under the
// text below 1024.
// Newsletter Card: 96 padding; a primary card (radius 12, 64 padding, 24 gap, shadow) with a
// secondary pill Badge, centered h2 (heading/h2), lead (max 640), an Inline Form Tone=on-primary and
// a proof row (Avatar Group and reader count).
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Avatar } from './avatar';
import { AvatarGroup } from './avatar-group';
import { Badge } from './badge';
import { Card } from './card';
import { CheckItem } from './form-layout';
import { ImagePlaceholder } from './image-placeholder';
import { InlineForm } from './inline-form';

/* Shared parts */

const shell = '@container w-full bg-background text-foreground';
const inner = 'mx-auto flex w-full max-w-6xl min-w-0 flex-col px-6 @3xl:px-8 @6xl:px-0';

export interface NewsletterFormProps {
  /** Input placeholder: an example address. */
  placeholder?: string;
  buttonLabel?: string;
  /** Under the field: privacy or reader count. */
  hint?: React.ReactNode;
  /** What happens after subscribing. */
  successText?: string;
  /** Called with a valid address. */
  onSubscribe?: (email: string) => void;
}

const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

function SignUp({
  placeholder = 'name@company.com',
  buttonLabel = 'Subscribe',
  hint,
  successText = 'You are subscribed. Check your inbox to confirm.',
  onSubscribe,
  tone,
  className,
}: NewsletterFormProps & { tone?: 'default' | 'on-primary'; className?: string }) {
  const [error, setError] = React.useState<string>();
  const [success, setSuccess] = React.useState<string>();
  return (
    <InlineForm
      label="Email address"
      placeholder={placeholder}
      buttonLabel={buttonLabel}
      hint={hint}
      error={error}
      success={success}
      tone={tone}
      inputProps={{ type: 'email', name: 'email', autoComplete: 'email' }}
      onValueChange={() => setError(undefined)}
      onSubmit={value => {
        if (!emailOk(value)) {
          setError('Enter an email address like name@company.com.');
          return;
        }
        setError(undefined);
        setSuccess(successText);
        onSubscribe?.(value.trim());
      }}
      className={className}
    />
  );
}

/* Newsletter */

export interface NewsletterProps extends Omit<React.ComponentProps<'section'>, 'title'>, NewsletterFormProps {
  title?: string;
  description?: string;
}

function Newsletter({
  title = 'Get one useful email a month',
  description = 'Product updates and guides from the team. No spam, unsubscribe in one click.',
  placeholder = 'name@example.com',
  buttonLabel,
  hint = 'We care about your data: read the privacy policy.',
  successText,
  onSubscribe,
  className,
  ...props
}: NewsletterProps) {
  const titleId = React.useId();
  return (
    <section data-slot="newsletter" aria-labelledby={titleId} className={cn(shell, className)} {...props}>
      <div className={cn(inner, 'py-16')}>
        <Card data-slot="newsletter-card" variant="muted" className="gap-12 p-8 @5xl:flex-row @5xl:items-center @5xl:p-12">
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <h2 id={titleId} className="m-0 text-2xl leading-8 font-semibold tracking-tight">{title}</h2>
            {description ? <p className="m-0 text-base leading-7 text-muted-foreground">{description}</p> : null}
          </div>
          <SignUp placeholder={placeholder} buttonLabel={buttonLabel} hint={hint} successText={successText} onSubscribe={onSubscribe} className="w-full @5xl:w-[420px] @5xl:shrink-0" />
        </Card>
      </div>
    </section>
  );
}

/* Newsletter Split */

export interface NewsletterSplitProps extends NewsletterProps {
  overline?: string;
  /** Two to four things each issue brings. */
  benefits?: string[];
  /** Photo URL of the 4:3 image; the placeholder shows without it. */
  image?: string;
  imageAlt?: string;
  showImage?: boolean;
}

function NewsletterSplit({
  overline = 'Newsletter',
  title = 'The month in finance ops, in five minutes',
  description = 'One email on the first Tuesday of the month: what changed in EU invoicing rules, one workflow worth copying and the numbers behind it.',
  benefits = ['E-invoicing deadlines by country, with dates', 'One approval or reminder workflow you can copy', 'Benchmarks from 1,200 teams: days to pay, write-offs'],
  image,
  imageAlt = '',
  showImage = true,
  placeholder,
  buttonLabel,
  hint = '12,400 readers. Unsubscribe in one click; we never share your email.',
  successText,
  onSubscribe,
  className,
  ...props
}: NewsletterSplitProps) {
  const titleId = React.useId();
  return (
    <section data-slot="newsletter-split" aria-labelledby={titleId} className={cn(shell, className)} {...props}>
      <div className={cn(inner, 'py-24')}>
        <div data-slot="newsletter-split-row" className="flex w-full min-w-0 flex-col gap-12 @5xl:flex-row @5xl:items-center @5xl:gap-16">
          <div className="flex min-w-0 flex-1 flex-col items-start gap-6">
            {overline ? <p className="m-0 text-xs leading-4 font-semibold tracking-widest text-brand uppercase">{overline}</p> : null}
            <h2 id={titleId} className="m-0 text-3xl leading-9 font-extrabold tracking-tight @3xl:text-4xl @3xl:leading-10">{title}</h2>
            {description ? <p className="m-0 text-lg leading-7 text-muted-foreground @3xl:text-xl">{description}</p> : null}
            {benefits.length ? (
              <ul aria-label="In every issue" className="m-0 flex w-full flex-col gap-3 p-0">
                {benefits.map(b => <CheckItem key={b} stateText={{ check: '' }} className="[&>span]:whitespace-normal">{b}</CheckItem>)}
              </ul>
            ) : null}
            <SignUp placeholder={placeholder} buttonLabel={buttonLabel} hint={hint} successText={successText} onSubscribe={onSubscribe} className="w-full max-w-[480px]" />
          </div>
          {showImage ? (
            <div className="min-w-0 flex-1">
              <ImagePlaceholder ratio="4:3" src={image} alt={imageAlt} className="rounded-xl" />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

/* Newsletter Card */

export interface NewsletterCardProps extends NewsletterProps {
  /** Short badge above the title: how often and how long. */
  badge?: string;
  /** Proof under the form; empty hides it. */
  proof?: string;
  /** Initials of the readers in the Avatar Group. */
  readers?: string[];
}

function NewsletterCard({
  badge = 'Monthly, 5-minute read',
  title = 'Get the finance ops brief',
  description = 'What changed in EU invoicing, one workflow worth copying and the benchmarks behind it. First Tuesday of every month.',
  placeholder,
  buttonLabel,
  hint = 'No spam. Unsubscribe in one click.',
  successText,
  onSubscribe,
  proof = 'Join 12,400 finance leads who read it every month',
  readers = ['AP', 'MI', 'RC', 'SB', 'TL'],
  className,
  ...props
}: NewsletterCardProps) {
  const titleId = React.useId();
  return (
    <section data-slot="newsletter-card" aria-labelledby={titleId} className={cn(shell, className)} {...props}>
      <div className={cn(inner, 'py-24')}>
        <div data-slot="newsletter-card-panel" className="flex w-full min-w-0 flex-col items-center gap-6 rounded-xl bg-primary px-6 py-12 text-center text-primary-foreground shadow-md @3xl:p-16">
          {badge ? <Badge variant="secondary" shape="pill">{badge}</Badge> : null}
          <h2 id={titleId} className="m-0 text-3xl leading-9 font-semibold tracking-tight text-balance">{title}</h2>
          {description ? <p className="m-0 max-w-[640px] text-lg leading-7 text-pretty @3xl:text-xl">{description}</p> : null}
          <SignUp tone="on-primary" placeholder={placeholder} buttonLabel={buttonLabel} hint={hint} successText={successText} onSubscribe={onSubscribe} className="w-full max-w-[480px] text-left" />
          {proof ? (
            <div data-slot="newsletter-proof" className="flex flex-wrap items-center justify-center gap-3">
              <AvatarGroup aria-hidden="true">
                {readers.map(i => <Avatar key={i} initials={i} />)}
              </AvatarGroup>
              <p className="m-0 text-sm leading-5 font-medium">{proof}</p>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export { Newsletter, NewsletterCard, NewsletterSplit };
