// EGG UI Email page. Figma: Email page. The parts of a 600 wide email, drawn as web components so
// the design can be reviewed and reused in Storybook. For sending, rebuild the same parts with an
// email toolkit (tables, inline styles, bulletproof button); sizes, tokens and copy rules stay.
// Every part has 40 side padding and needs at least 320 (the narrowest mail client).
// - Header (logo, optional "View in browser") and Footer (social marks, address, reason, links)
//   sit outside the card on section/muted-background.
// - Hero (eyebrow, title, text, optional 16:9 image), Button (one primary pill, 44 high, left or
//   center), Content (heading and paragraph), Code (one-time code in mono 36), Details + Details Row
//   (label and value box), Line Items + Line Item + Total Row, Callout (5 tones), Divider, Stats +
//   Stat, Article (4:3 thumbnail, title, text, link).
import * as React from 'react';
import { CircleAlert, CircleCheck, Info, TriangleAlert } from '@/components/icons';
import { cn } from '@/lib/utils';
import github from '@/assets/brands/github.svg';
import linkedin from '@/assets/brands/linkedin.svg';
import x from '@/assets/brands/x.svg';
import youtube from '@/assets/brands/youtube.svg';
import { ImagePlaceholder } from './image-placeholder';
import { Logo } from './logo';
import { Separator } from './separator';

const block = 'w-150 max-w-full min-w-80 px-10';

/* Layout (story helper and app preview) */

/** The email canvas: muted page with the 600 card between Header and Footer. */
function EmailLayout({ header, footer, className, children, ...props }: React.ComponentProps<'div'> & { header?: React.ReactNode; footer?: React.ReactNode }) {
  return (
    <div data-slot="email-layout" className={cn('flex w-full flex-col items-center bg-[var(--section-muted-background)]', className)} {...props}>
      {header}
      <div data-slot="email-card" className="flex w-150 max-w-full min-w-80 flex-col gap-8 rounded-xl border border-border bg-card py-10 text-card-foreground">{children}</div>
      {footer}
    </div>
  );
}

/* Header */

export interface EmailHeaderProps extends React.ComponentProps<'div'> {
  /** Figma Logo: the client's logo, 32 high. */
  logo?: React.ReactNode;
  /** Figma Show preheader link: newsletters and long emails. */
  browserHref?: string;
  browserLabel?: string;
}

function EmailHeader({ logo, browserHref, browserLabel = 'View in browser', className, ...props }: EmailHeaderProps) {
  return (
    <div data-slot="email-header" className={cn('flex items-center justify-between gap-4 pt-8 pb-6', block, className)} {...props}>
      {logo ?? <Logo type="full" />}
      {browserHref ? (
        <a href={browserHref} className="text-xs leading-4 whitespace-nowrap text-muted-foreground underline-offset-4 hover:underline">
          {browserLabel}
        </a>
      ) : null}
    </div>
  );
}

/* Hero */

export interface EmailHeroProps extends Omit<React.ComponentProps<'div'>, 'title'> {
  title: string;
  text?: React.ReactNode;
  /** Figma Show eyebrow: product area or date range. */
  eyebrow?: string;
  /** Figma Show image: a 16:9 picture for announcements and newsletters. */
  image?: string;
  imageAlt?: string;
  /** Show the image area even without a picture (placeholder). */
  showImage?: boolean;
}

function EmailHero({ title, text, eyebrow, image, imageAlt = '', showImage = false, className, ...props }: EmailHeroProps) {
  return (
    <div data-slot="email-hero" className={cn('flex flex-col gap-4', block, className)} {...props}>
      {image || showImage ? <ImagePlaceholder ratio="16:9" src={image} alt={imageAlt} className="rounded-lg" /> : null}
      {eyebrow ? <p className="m-0 truncate text-xs leading-4 font-semibold tracking-[1.6px] text-brand uppercase">{eyebrow}</p> : null}
      <h1 className="m-0 text-3xl leading-9 font-semibold tracking-[-0.4px] text-foreground">{title}</h1>
      {text ? <p className="m-0 text-base leading-7 text-muted-foreground">{text}</p> : null}
    </div>
  );
}

/* Button */

export interface EmailButtonProps extends React.ComponentProps<'div'> {
  label: string;
  href: string;
  /** Figma Align: left (follows the text) or center (short welcome or announcement emails). */
  align?: 'left' | 'center';
}

function EmailButton({ label, href, align = 'left', className, ...props }: EmailButtonProps) {
  return (
    <div data-slot="email-button" data-align={align} className={cn('flex', align === 'center' ? 'justify-center' : 'justify-start', block, className)} {...props}>
      <a
        href={href}
        title={label}
        className="flex h-11 max-w-60 min-w-0 items-center justify-center rounded-button bg-primary px-6 text-sm leading-5 font-medium text-primary-foreground outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        <span className="truncate">{label}</span>
      </a>
    </div>
  );
}

/* Content */

function EmailContent({ heading, className, children, ...props }: React.ComponentProps<'div'> & { heading?: string }) {
  return (
    <div data-slot="email-content" className={cn('flex flex-col gap-2 text-foreground', block, className)} {...props}>
      {heading ? <h2 className="m-0 text-xl leading-7 font-semibold tracking-[-0.4px]">{heading}</h2> : null}
      <div className="text-base leading-7 break-words [&_a]:text-brand [&_a]:underline [&_a]:underline-offset-4 [&_p]:m-0">{children}</div>
    </div>
  );
}

/* Code */

export interface EmailCodeProps extends React.ComponentProps<'div'> {
  code: string;
  label?: string;
  /** Figma Show hint: when it expires and what to do if the reader did not ask for it. */
  hint?: React.ReactNode;
}

function EmailCode({ code, label = 'Your verification code', hint, className, ...props }: EmailCodeProps) {
  return (
    <div data-slot="email-code" className={cn('flex flex-col gap-3', block, className)} {...props}>
      <div className="flex w-full flex-col items-center gap-2 overflow-clip rounded-lg bg-muted p-6 text-center text-foreground">
        <p className="m-0 w-full truncate text-sm leading-5 font-medium">{label}</p>
        <p className="m-0 w-full truncate font-mono text-4xl leading-[44px] font-semibold tracking-[10px]">{code}</p>
      </div>
      {hint ? <p className="m-0 text-sm leading-5 text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

/* Details */

function EmailDetailsRow({ label, value, className, ...props }: React.ComponentProps<'div'> & { label: string; value: string }) {
  return (
    <div data-slot="email-details-row" className={cn('flex w-full flex-wrap items-start gap-x-4 gap-y-1 py-2 text-sm leading-5', className)} {...props}>
      <dt className="min-w-28 flex-1 text-muted-foreground">{label}</dt>
      <dd className="m-0 max-w-48 truncate text-right font-medium text-foreground" title={value}>
        {value}
      </dd>
    </div>
  );
}

function EmailDetails({ title, className, children, ...props }: React.ComponentProps<'div'> & { title?: string }) {
  return (
    <div data-slot="email-details" className={cn('flex flex-col gap-3', block, className)} {...props}>
      {title ? <h2 className="m-0 text-xl leading-7 font-semibold tracking-[-0.4px] text-foreground">{title}</h2> : null}
      <dl className="m-0 flex w-full flex-col rounded-md border border-border bg-[var(--card-muted)] px-5 py-3">{children}</dl>
    </div>
  );
}

/* Line Items */

export interface EmailLineItemProps extends React.ComponentProps<'li'> {
  name: string;
  /** Quantity, size or period. */
  meta?: string;
  amount: string;
  /** Figma Show image: a 64 product photo (1:1). */
  image?: string;
  showImage?: boolean;
}

function EmailLineItem({ name, meta, amount, image, showImage = false, className, ...props }: EmailLineItemProps) {
  return (
    <li data-slot="email-line-item" className={cn('flex w-full items-center gap-4 border-b border-border py-3', className)} {...props}>
      {image || showImage ? <ImagePlaceholder ratio="1:1" src={image} showCaption={false} className="w-16 shrink-0 rounded-lg" /> : null}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5 text-sm leading-5 break-words">
        <p className="m-0 font-medium text-foreground">{name}</p>
        {meta ? <p className="m-0 text-muted-foreground">{meta}</p> : null}
      </div>
      <p className="m-0 shrink-0 text-right text-sm leading-5 font-medium whitespace-nowrap text-foreground">{amount}</p>
    </li>
  );
}

function EmailTotalRow({ label, amount, type = 'default', className, ...props }: React.ComponentProps<'div'> & { label: string; amount: string; type?: 'default' | 'total' }) {
  const total = type === 'total';
  return (
    <div
      data-slot="email-total-row"
      data-type={type}
      className={cn('flex w-full items-start gap-4', total ? 'border-t border-border pt-3 pb-1 text-lg leading-7 font-semibold text-foreground' : 'py-1 text-sm leading-5', className)}
      {...props}
    >
      <dt className={cn('min-w-0 flex-1', !total && 'text-muted-foreground')}>{label}</dt>
      <dd className={cn('m-0 shrink-0 text-right whitespace-nowrap', !total && 'text-foreground')}>{amount}</dd>
    </div>
  );
}

function EmailLineItems({ title, items, totals, className, ...props }: React.ComponentProps<'div'> & { title?: string; items: React.ReactNode; totals?: React.ReactNode }) {
  return (
    <div data-slot="email-line-items" className={cn('flex flex-col gap-3', block, className)} {...props}>
      {title ? <h2 className="m-0 text-xl leading-7 font-semibold tracking-[-0.4px] text-foreground">{title}</h2> : null}
      <ul className="m-0 flex w-full list-none flex-col border-t border-border p-0">{items}</ul>
      {totals ? <dl className="m-0 flex w-full flex-col">{totals}</dl> : null}
    </div>
  );
}

/* Callout */

export type EmailCalloutTone = 'default' | 'info' | 'success' | 'warning' | 'destructive';

const calloutBg: Record<EmailCalloutTone, string> = {
  default: 'bg-muted',
  info: 'bg-[var(--badge-soft-info-bg)]',
  success: 'bg-[var(--badge-soft-success-bg)]',
  warning: 'bg-[var(--badge-soft-warning-bg)]',
  destructive: 'bg-[var(--badge-soft-destructive-bg)]',
};
const calloutIcon: Record<EmailCalloutTone, { icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' }>; color: string }> = {
  default: { icon: Info, color: 'text-foreground' },
  info: { icon: Info, color: 'text-[var(--badge-soft-info-fg)]' },
  success: { icon: CircleCheck, color: 'text-[var(--badge-soft-success-fg)]' },
  warning: { icon: TriangleAlert, color: 'text-[var(--badge-soft-warning-fg)]' },
  destructive: { icon: CircleAlert, color: 'text-[var(--badge-soft-destructive-fg)]' },
};

export interface EmailCalloutProps extends Omit<React.ComponentProps<'div'>, 'title'> {
  tone?: EmailCalloutTone;
  title?: string;
  /** Figma Show icon. */
  showIcon?: boolean;
}

function EmailCallout({ tone = 'default', title, showIcon = true, className, children, ...props }: EmailCalloutProps) {
  const { icon: Icon, color } = calloutIcon[tone];
  return (
    <div data-slot="email-callout" data-tone={tone} className={cn('flex flex-col', block, className)} {...props}>
      <div className={cn('flex w-full items-start gap-3 overflow-clip rounded-md p-4', calloutBg[tone])}>
        {showIcon ? <Icon aria-hidden="true" className={cn('size-5 shrink-0', color)} /> : null}
        <div className="flex min-w-0 flex-1 flex-col gap-1 text-sm leading-5 break-words text-foreground">
          {title ? <p className="m-0 font-medium">{title}</p> : null}
          <div className="[&_p]:m-0">{children}</div>
        </div>
      </div>
    </div>
  );
}

/* Divider */

function EmailDivider({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div data-slot="email-divider" className={cn('flex flex-col', block, className)} {...props}>
      <Separator />
    </div>
  );
}

/* Stats */

export interface EmailStatProps extends React.ComponentProps<'div'> {
  value: string;
  label: string;
  /** Change with its period ("+3 this week"). */
  change?: string;
  /** good (green), bad (red) or neutral (muted). */
  trend?: 'good' | 'bad' | 'neutral';
}

function EmailStat({ value, label, change, trend = 'good', className, ...props }: EmailStatProps) {
  return (
    <div data-slot="email-stat" className={cn('flex min-w-28 flex-1 flex-col gap-1 rounded-md border border-border bg-[var(--card-muted)] p-4 break-words', className)} {...props}>
      <p className="m-0 text-2xl leading-8 font-semibold tracking-[-0.4px] text-foreground">{value}</p>
      <p className="m-0 text-sm leading-5 text-muted-foreground">{label}</p>
      {change ? (
        <p
          className={cn(
            'm-0 text-xs leading-4 font-medium',
            trend === 'good' ? 'text-[var(--badge-soft-success-fg)]' : trend === 'bad' ? 'text-[var(--badge-soft-destructive-fg)]' : 'text-muted-foreground',
          )}
        >
          {change}
        </p>
      ) : null}
    </div>
  );
}

function EmailStats({ className, children, ...props }: React.ComponentProps<'div'>) {
  return (
    <div data-slot="email-stats" className={cn('flex flex-col', block, className)} {...props}>
      <div className="flex w-full flex-wrap items-start gap-3">{children}</div>
    </div>
  );
}

/* Article */

export interface EmailArticleProps extends Omit<React.ComponentProps<'div'>, 'title'> {
  title: string;
  text?: string;
  href: string;
  /** Link text that names the destination. */
  linkLabel?: string;
  /** Figma Show image: a 4:3 thumbnail. */
  image?: string;
  showImage?: boolean;
  /** Heading level of the title: 2 under the Hero, 3 inside a titled section. */
  headingLevel?: 2 | 3;
}

function EmailArticle({ title, text, href, linkLabel = 'Read the article', image, showImage = true, headingLevel = 2, className, ...props }: EmailArticleProps) {
  const H = `h${headingLevel}` as 'h2' | 'h3';
  return (
    <div data-slot="email-article" className={cn('flex flex-wrap items-start gap-5', block, className)} {...props}>
      {image || showImage ? <ImagePlaceholder ratio="4:3" src={image} showCaption={false} className="w-40 shrink-0 rounded-lg" /> : null}
      <div className="flex min-w-48 flex-1 flex-col gap-1 break-words">
        <H className="m-0 text-lg leading-7 font-semibold text-foreground">{title}</H>
        {text ? <p className="m-0 text-sm leading-5 text-muted-foreground">{text}</p> : null}
        <a href={href} className="truncate text-sm leading-5 font-medium text-brand underline-offset-4 hover:underline">
          {linkLabel}
          <span className="sr-only">: {title}</span>
        </a>
      </div>
    </div>
  );
}

/* Footer */

const marks = { LinkedIn: linkedin, X: x, YouTube: youtube, GitHub: github } as const;
export type EmailSocial = keyof typeof marks;

export interface EmailFooterProps extends React.ComponentProps<'div'> {
  /** Postal address of the sender (required by anti-spam law). */
  address: string;
  /** Why the reader got this email. */
  reason: string;
  /** Figma Show social: links to the company's profiles. */
  social?: { network: EmailSocial; href: string }[];
  /** Figma Show preferences. */
  preferencesHref?: string;
  /** Figma Show unsubscribe: marketing and digests only. */
  unsubscribeHref?: string;
}

function EmailFooter({ address, reason, social, preferencesHref, unsubscribeHref, className, ...props }: EmailFooterProps) {
  return (
    <div data-slot="email-footer" className={cn('flex flex-col items-center gap-4 pt-8 pb-10 text-center text-sm leading-5 text-muted-foreground', block, className)} {...props}>
      {social?.length ? (
        <ul aria-label="Follow us" className="m-0 flex list-none gap-4 p-0">
          {social.map((s) => {
            const mask = `url("${marks[s.network]}")`;
            return (
              <li key={s.network}>
                <a href={s.href} aria-label={s.network} className="block rounded-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50">
                  <span aria-hidden="true" className="block size-5 bg-current" style={{ maskImage: mask, WebkitMaskImage: mask, maskSize: 'contain', WebkitMaskSize: 'contain', maskRepeat: 'no-repeat', WebkitMaskRepeat: 'no-repeat' }} />
                </a>
              </li>
            );
          })}
        </ul>
      ) : null}
      <p className="m-0 w-full">{address}</p>
      <p className="m-0 w-full">{reason}</p>
      {preferencesHref || unsubscribeHref ? (
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 whitespace-nowrap">
          {preferencesHref ? <a href={preferencesHref} className="underline underline-offset-2">Email preferences</a> : null}
          {unsubscribeHref ? <a href={unsubscribeHref} className="underline underline-offset-2">Unsubscribe</a> : null}
        </div>
      ) : null}
    </div>
  );
}

export {
  EmailArticle,
  EmailButton,
  EmailCallout,
  EmailCode,
  EmailContent,
  EmailDetails,
  EmailDetailsRow,
  EmailDivider,
  EmailFooter,
  EmailHeader,
  EmailHero,
  EmailLayout,
  EmailLineItem,
  EmailLineItems,
  EmailStat,
  EmailStats,
  EmailTotalRow,
};
