// EGG UI Pricing page: Price (440:779), Plan Card (440:942), Comparison Table (941:1595),
// Plan Option Row (1108:2345), Meter Banner (1108:2429), Paywall Card (1109:2834), Lock Badge
// (1108:2446), Gate Overlay (1108:2712), Usage Limit Banner (1109:2968), Trial Banner (1109:3013),
// Upsell Card (1109:3014).
// Price: old price (struck, "was" for screen readers), amount and period on one baseline. sm 20 /
// default 30 semibold, lg 48 / xl 60 extrabold; xl uses 16 px side text.
// Plan Card: 352, 24 padding, 20 gap: name (heading/h4) with a badge, description, Price, the
// action, a separator, the features title and Check Items. featured: 2 px primary border and
// shadow lg; inverted: foreground surface, background text (70% for secondary text), secondary
// button, inverted Check Items; compact: one row (name and description, Price, action).
// Comparison Table: a real <table>: header cells with name, Price sm and a button (128 high), group
// rows (caption), feature rows 52 with Table Cell Check values in 240 plan columns.
// Plan Option Row: a radio card (16 padding, radius lg): name (body/large), saving Badge, trial
// line, billed price and equivalent on the right; selected has a 2 px primary border. Rows sit in a
// radiogroup (arrows move and select).
// Meter Banner, Usage Limit Banner, Trial Banner: full-width strips (regions) with the message, the
// actions and a dismiss where the rules allow it. Paywall Card: logo, title, benefits, plans, one
// primary action, sign in, fine print. Lock Badge: lock and plan name. Gate Overlay: blurred or
// faded preview (inert) under a centered card. Upsell Card: one dismissible upgrade nudge.
import * as React from 'react';
import { Bookmark, CircleAlert, Clock, Info, Lock, Sparkles, TriangleAlert, X } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Badge } from './badge';
import { Button } from './button';
import { ButtonIcon } from './button-icon';
import { CheckItem } from './form-layout';
import { UsageMeter } from './metrics';
import { Progress } from './progress';
import { Separator } from './separator';
import { TableCellCheck } from './table-cell-check';

/* Price */

export type PriceSize = 'sm' | 'default' | 'lg' | 'xl';
const amountClass: Record<PriceSize, string> = {
  sm: 'text-xl leading-7 font-semibold',
  default: 'text-3xl leading-9 font-semibold',
  lg: 'text-5xl leading-[48px] font-extrabold',
  xl: 'text-6xl leading-[60px] font-extrabold',
};

export interface PriceProps extends React.ComponentProps<'p'> {
  amount: string;
  period?: string;
  oldPrice?: string;
  size?: PriceSize;
  /** Inverted surfaces: text in the background color, side text at 70%. */
  inverted?: boolean;
}

function Price({ amount, period, oldPrice, size = 'default', inverted = false, className, ...props }: PriceProps) {
  const side = cn(size === 'xl' ? 'text-base leading-7' : 'text-sm leading-5', inverted ? 'text-background/70' : 'text-muted-foreground');
  return (
    <p data-slot="price" data-size={size} className={cn('m-0 flex min-w-0 items-baseline whitespace-nowrap', size === 'xl' ? 'gap-2' : 'gap-1.5', className)} {...props}>
      {oldPrice ? <s className={cn('shrink-0', side)}><span className="sr-only">was </span>{oldPrice}</s> : null}
      <span className={cn('shrink-0 tracking-[-0.4px]', amountClass[size], inverted ? 'text-background' : 'text-foreground')}>
        {oldPrice ? <span className="sr-only">now </span> : null}{amount}
      </span>
      {period ? <span className={cn('min-w-0 flex-1 truncate', side)}>{period}</span> : null}
    </p>
  );
}

/* Plan Card */

export type PlanCardVariant = 'default' | 'featured' | 'inverted' | 'compact';

export interface PlanCardProps extends Omit<React.ComponentProps<'article'>, 'title'> {
  variant?: PlanCardVariant;
  title: string;
  description?: string;
  /** "Most popular". */
  badge?: string;
  /** A Price (or "Contact sales" text). */
  price: React.ReactNode;
  /** The main action (a Button or link). */
  action: React.ReactNode;
  featuresTitle?: string;
  /** Check Items. */
  features?: React.ReactNode;
  headingLevel?: 2 | 3;
}

function PlanCard({ variant = 'default', title, description, badge, price, action, featuresTitle, features, headingLevel = 3, className, ...props }: PlanCardProps) {
  const id = React.useId();
  const Heading = `h${headingLevel}` as 'h3';
  const inverted = variant === 'inverted';
  const head = (
    <div className="flex min-w-0 flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <Heading id={id} className={cn('m-0 min-w-0 flex-1 text-xl leading-7 font-semibold tracking-[-0.4px]', inverted ? 'text-background' : 'text-card-foreground')}>{title}</Heading>
        {badge && variant !== 'compact' ? <Badge className="shrink-0">{badge}</Badge> : null}
      </div>
      {description ? <p className={cn('m-0 text-sm leading-5', inverted ? 'text-background/70' : 'text-muted-foreground')}>{description}</p> : null}
    </div>
  );
  if (variant === 'compact') {
    return (
      <article data-slot="plan-card" data-variant={variant} aria-labelledby={id} className={cn('flex w-full min-w-0 flex-wrap items-center gap-x-6 gap-y-3 rounded-xl border border-border bg-card px-6 py-4', className)} {...props}>
        <div className="min-w-48 flex-1">{head}</div>
        <div className="shrink-0">{price}</div>
        <div className="shrink-0">{action}</div>
      </article>
    );
  }
  return (
    <article
      data-slot="plan-card"
      data-variant={variant}
      aria-labelledby={id}
      className={cn(
        'flex w-full min-w-0 flex-col gap-5 rounded-xl p-6',
        variant === 'default' && 'border border-border bg-card',
        variant === 'featured' && 'border-2 border-primary bg-card shadow-lg',
        inverted && 'border-2 border-foreground bg-foreground text-background shadow-lg',
        className,
      )}
      {...props}
    >
      {head}
      {price}
      <div className="flex w-full [&>*]:w-full">{action}</div>
      <Separator className={inverted ? 'bg-background/30' : undefined} />
      {featuresTitle ? <p className={cn('m-0 truncate text-sm leading-5 font-medium', inverted ? 'text-background' : 'text-card-foreground')}>{featuresTitle}</p> : null}
      {features ? <ul className="m-0 flex flex-col gap-2 p-0">{features}</ul> : null}
    </article>
  );
}

/* Comparison Table */

export interface ComparisonPlan { id: string; name: string; badge?: string; price: React.ReactNode; action: React.ReactNode }
export type ComparisonValue = boolean | string;
export interface ComparisonGroup { label: string; rows: { feature: string; values: ComparisonValue[] }[] }

export interface ComparisonTableProps extends React.ComponentProps<'table'> {
  plans: ComparisonPlan[];
  groups: ComparisonGroup[];
  caption?: string;
}

function ComparisonTable({ plans, groups, caption = 'Compare plans', className, ...props }: ComparisonTableProps) {
  return (
    <table data-slot="comparison-table" className={cn('w-full min-w-0 table-fixed border-collapse text-sm leading-5', className)} {...props}>
      <caption className="sr-only">{caption}</caption>
      <colgroup>
        <col />
        {plans.map(p => <col key={p.id} className="w-60" />)}
      </colgroup>
      <thead>
        <tr className="border-b border-border">
          <td />
          {plans.map(p => (
            <th key={p.id} scope="col" className="h-32 px-2 py-4 align-top font-normal">
              <div className="flex flex-col items-center gap-2">
                <span className="flex items-center gap-2 font-medium text-foreground">{p.name}{p.badge ? <Badge>{p.badge}</Badge> : null}</span>
                {p.price}
                {p.action}
              </div>
            </th>
          ))}
        </tr>
      </thead>
      {groups.map(g => (
        <tbody key={g.label}>
          <tr data-slot="comparison-group">
            <th scope="colgroup" colSpan={plans.length + 1} className="pt-8 pb-4 text-left text-xs leading-4 font-medium tracking-wide text-muted-foreground uppercase">{g.label}</th>
          </tr>
          {g.rows.map(r => (
            <tr key={r.feature} data-slot="comparison-row" className="border-b border-border">
              <th scope="row" className="h-[52px] py-4 text-left font-normal text-foreground">{r.feature}</th>
              {r.values.map((v, i) => (
                <td key={i} className="py-4">
                  <TableCellCheck className="justify-center" value={typeof v === 'string' ? 'text' : v ? 'included' : 'excluded'} text={typeof v === 'string' ? v : undefined} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      ))}
    </table>
  );
}

/* Plan Option Row */

export interface PlanOption { value: string; name: string; price: string; equivalent?: string; saving?: string; trial?: string }

export interface PlanOptionsProps extends Omit<React.ComponentProps<'div'>, 'onChange'> {
  options: PlanOption[];
  value: string;
  onValueChange: (value: string) => void;
  label?: string;
}

function PlanOptions({ options, value, onValueChange, label = 'Plan', className, ...props }: PlanOptionsProps) {
  const refs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    const n = options.length;
    const next = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? (i + 1) % n : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? (i - 1 + n) % n : null;
    if (next === null) return;
    e.preventDefault();
    onValueChange(options[next]!.value);
    refs.current[next]?.focus();
  };
  return (
    <div role="radiogroup" aria-label={label} data-slot="plan-options" className={cn('flex w-full min-w-0 flex-col gap-3', className)} {...props}>
      {options.map((o, i) => {
        const selected = o.value === value;
        return (
          <button
            key={o.value}
            ref={el => { refs.current[i] = el; }}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            data-slot="plan-option-row"
            onClick={() => onValueChange(o.value)}
            onKeyDown={e => onKeyDown(e, i)}
            className={cn(
              'flex w-full min-w-60 items-center gap-3 rounded-lg bg-card p-4 text-left outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
              selected ? 'border-2 border-primary p-[15px] shadow-xs' : 'border border-border',
            )}
          >
            <span aria-hidden="true" className={cn('flex size-4 shrink-0 items-center justify-center rounded-full border shadow-xs', selected ? 'border-primary' : 'border-input bg-background')}>
              {selected ? <span className="size-2 rounded-full bg-primary" /> : null}
            </span>
            <span className="flex min-w-20 flex-1 flex-col gap-1">
              <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="text-lg leading-7 font-semibold text-card-foreground">{o.name}</span>
                {o.saving ? <Badge variant="soft-success" shape="pill">{o.saving}</Badge> : null}
              </span>
              {o.trial ? <span className="truncate text-sm leading-5 text-muted-foreground">{o.trial}</span> : null}
            </span>
            <span className="flex shrink-0 flex-col items-end gap-0.5 whitespace-nowrap">
              <span className="text-sm leading-5 font-medium text-card-foreground">{o.price}</span>
              {o.equivalent ? <span className="text-xs leading-4 text-muted-foreground">{o.equivalent}</span> : null}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* Lock Badge */

export interface LockBadgeProps extends React.ComponentProps<'span'> {
  /** The plan that unlocks it: "Pro". */
  label: string;
  size?: 'default' | 'sm';
  tone?: 'neutral' | 'brand';
}

function LockBadge({ label, size = 'default', tone = 'neutral', className, ...props }: LockBadgeProps) {
  return (
    <span
      data-slot="lock-badge"
      className={cn(
        'inline-flex shrink-0 items-center rounded-md text-xs leading-4 font-medium',
        size === 'sm' ? 'h-4 gap-0.5 px-1.5 [&_svg]:size-2.5' : 'h-5 gap-1 px-2 [&_svg]:size-3',
        tone === 'brand' ? 'bg-[var(--icon-tile-brand-bg)] text-[var(--icon-tile-brand-fg)]' : 'bg-[var(--badge-soft-neutral-bg)] text-[var(--badge-soft-neutral-fg)]',
        className,
      )}
      {...props}
    >
      <Lock aria-hidden="true" />
      <span className="sr-only">Requires </span>
      {label}
    </span>
  );
}

/* Banners */

export interface MeterBannerProps extends React.ComponentProps<'section'> {
  state?: 'remaining' | 'last' | 'none';
  title: string;
  description?: string;
  onSubscribe?: () => void;
  onSignIn?: () => void;
  onDismiss?: () => void;
}

function MeterBanner({ state = 'remaining', title, description, onSubscribe, onSignIn, onDismiss, className, ...props }: MeterBannerProps) {
  return (
    <section data-slot="meter-banner" data-state={state} aria-label="Free articles" className={cn('flex w-full min-w-80 justify-center border-t border-border bg-card px-6 py-4 shadow-lg', className)} {...props}>
      <div className="flex max-w-[1152px] flex-1 flex-wrap items-center gap-x-4 gap-y-3">
        <div className="flex min-w-60 flex-1 items-center gap-3">
          <span aria-hidden="true" className={cn('flex size-10 shrink-0 items-center justify-center rounded-md [&_svg]:size-5', state === 'last' ? 'bg-[var(--badge-soft-warning-bg)] text-[var(--badge-soft-warning-fg)]' : 'bg-muted')}>
            {state === 'none' ? <Lock /> : <Bookmark />}
          </span>
          <div className="flex min-w-40 flex-1 flex-col gap-0.5 text-sm leading-5">
            <p className="m-0 font-medium text-card-foreground">{title}</p>
            {description ? <p className="m-0 text-muted-foreground">{description}</p> : null}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {onSignIn ? <Button variant="ghost" onClick={onSignIn}>Sign in</Button> : null}
          <Button onClick={onSubscribe}>Subscribe</Button>
          {onDismiss && state !== 'none' ? <ButtonIcon variant="ghost" size="sm" icon={<X />} label="Dismiss" onClick={onDismiss} /> : null}
        </div>
      </div>
    </section>
  );
}

export interface UsageLimitBannerProps extends React.ComponentProps<'section'> {
  status?: 'approaching' | 'reached';
  layout?: 'banner' | 'inline';
  title: string;
  description?: string;
  /** Meter label in the inline layout ("AI credits"). */
  meterLabel?: string;
  used: number;
  limit: number;
  /** "10,000 of 10,000". */
  usage?: string;
  /** "Resets on 1 Dec 2026" (inline). */
  resetText?: string;
  onUpgrade?: () => void;
  onBuyMore?: () => void;
  buyMoreLabel?: string;
  onDismiss?: () => void;
}

function UsageLimitBanner({ status = 'approaching', layout = 'banner', title, description, meterLabel = 'Usage', used, limit, usage, resetText, onUpgrade, onBuyMore, buyMoreLabel = 'Buy more credits', onDismiss, className, ...props }: UsageLimitBannerProps) {
  const reached = status === 'reached';
  const pct = Math.min(100, Math.round((used / limit) * 100));
  const buy = onBuyMore ? <Button variant="outline" size="sm" onClick={onBuyMore}>{buyMoreLabel}</Button> : null;
  const upgrade = <Button size="sm" onClick={onUpgrade}>Upgrade</Button>;
  if (layout === 'inline') {
    return (
      <section data-slot="usage-limit-banner" data-status={status} data-layout={layout} aria-label={title} className={cn('flex w-full min-w-70 flex-col gap-4 rounded-xl border border-border bg-card p-5', className)} {...props}>
        <div className="flex items-start gap-2">
          <span aria-hidden="true" className={cn('flex h-5 shrink-0 items-center [&_svg]:size-4', reached ? 'text-destructive' : 'text-[var(--badge-soft-warning-fg)]')}>{reached ? <CircleAlert /> : <TriangleAlert />}</span>
          <p className="m-0 min-w-0 flex-1 text-sm leading-5 font-medium text-card-foreground">{title}</p>
        </div>
        <UsageMeter label={meterLabel} used={used} limit={limit} usage={usage} hint={resetText} level={reached ? 'over' : 'near'} />
        {description ? <p className="m-0 text-sm leading-5 text-muted-foreground">{description}</p> : null}
        <div className="flex flex-wrap gap-2">{upgrade}{buy}</div>
      </section>
    );
  }
  return (
    <section
      data-slot="usage-limit-banner"
      data-status={status}
      data-layout={layout}
      aria-label={title}
      className={cn('flex w-full min-w-80 flex-wrap items-center gap-x-4 gap-y-3 px-6 py-3', reached ? 'bg-[var(--badge-soft-destructive-bg)]' : 'bg-[var(--badge-soft-warning-bg)]', className)}
      {...props}
    >
      <span aria-hidden="true" className={cn('flex shrink-0 [&_svg]:size-4', reached ? 'text-[var(--badge-soft-destructive-fg)]' : 'text-[var(--badge-soft-warning-fg)]')}>{reached ? <CircleAlert /> : <TriangleAlert />}</span>
      <div className="flex min-w-60 flex-1 flex-col gap-1.5">
        <p className={cn('m-0 text-sm leading-5 font-medium', reached ? 'text-[var(--badge-soft-destructive-fg)]' : 'text-[var(--badge-soft-warning-fg)]')}>{title}</p>
        {description ? <p className="m-0 text-sm leading-5 text-foreground">{description}</p> : null}
        <div className="flex items-center gap-2">
          <Progress className="flex-1" size="sm" tone={reached ? 'error' : 'warning'} value={pct} aria-label={`${pct}% used`} />
          <span aria-hidden="true" className={cn('shrink-0 text-xs leading-4 font-medium', reached ? 'text-[var(--badge-soft-destructive-fg)]' : 'text-[var(--badge-soft-warning-fg)]')}>{pct}% used</span>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">{buy}{upgrade}</div>
      {onDismiss && !reached ? <ButtonIcon variant="ghost" size="xs" icon={<X />} label="Dismiss" onClick={onDismiss} /> : null}
    </section>
  );
}

export interface TrialBannerProps extends React.ComponentProps<'section'> {
  /** Defaults to "active", or follows `endsAt` when that is set (ending in the last 3 days, ended when past). */
  state?: 'active' | 'ending' | 'ended';
  /** Text of the banner. Optional when `endsAt` is set: it then counts itself. */
  message?: string;
  /** End of the trial, ISO string: "3 days left in your trial", "Ends today", "Trial ended". */
  endsAt?: string;
  /** The current time, ISO string. Fix it in stories and tests; defaults to the clock. */
  now?: string;
  detail?: string;
  onChoosePlan?: () => void;
  onDismiss?: () => void;
}

function trialCount(endsAt: string, now?: string): { state: 'active' | 'ending' | 'ended'; message: string } {
  const diff = new Date(endsAt).getTime() - (now ? new Date(now).getTime() : Date.now());
  const day = 86400000;
  if (Number.isNaN(diff)) return { state: 'active', message: '' };
  if (diff <= 0) return { state: 'ended', message: 'Trial ended' };
  if (diff < day) return { state: 'ending', message: 'Ends today' };
  const days = Math.ceil(diff / day);
  return { state: days <= 3 ? 'ending' : 'active', message: `${days} days left in your trial` };
}

function TrialBanner({ state: stateProp, message: messageProp, endsAt, now, detail, onChoosePlan, onDismiss, className, ...props }: TrialBannerProps) {
  const counted = endsAt ? trialCount(endsAt, now) : null;
  const state = stateProp ?? counted?.state ?? 'active';
  const message = messageProp ?? counted?.message ?? '';
  const ended = state === 'ended';
  const tint = state === 'active' ? 'bg-[var(--badge-soft-info-bg)]' : state === 'ending' ? 'bg-[var(--badge-soft-warning-bg)]' : 'bg-primary';
  const lead = state === 'active' ? 'text-[var(--badge-soft-info-fg)]' : state === 'ending' ? 'text-[var(--badge-soft-warning-fg)]' : 'text-primary-foreground';
  return (
    <section data-slot="trial-banner" data-state={state} aria-label="Trial" className={cn('flex w-full min-w-[360px] flex-wrap items-center gap-x-3 gap-y-2 px-6 py-2', tint, className)} {...props}>
      <span aria-hidden="true" className={cn('flex shrink-0 [&_svg]:size-4', lead)}>{ended ? <Info /> : <Clock />}</span>
      <div className="flex min-w-[200px] flex-1 flex-wrap items-center gap-x-2 text-sm leading-5">
        <p className={cn('m-0 font-medium whitespace-nowrap', lead)}>{message}</p>
        {detail ? <p className={cn('m-0 min-w-40 flex-1', ended ? 'text-primary-foreground' : 'text-foreground')}>{detail}</p> : null}
      </div>
      <Button size="sm" variant={ended ? 'secondary' : 'default'} onClick={onChoosePlan}>Choose a plan</Button>
      {onDismiss && !ended ? (
        <button type="button" aria-label="Dismiss for today" onClick={onDismiss} className="flex size-6 shrink-0 items-center justify-center rounded-sm text-foreground outline-none hover:bg-black/5 focus-visible:ring-[3px] focus-visible:ring-ring/50 [&_svg]:size-4">
          <X aria-hidden="true" />
        </button>
      ) : null}
    </section>
  );
}

/* Paywall Card */

export interface PaywallCardProps extends Omit<React.ComponentProps<'section'>, 'title'> {
  type?: 'metered' | 'registration' | 'hard';
  logo?: React.ReactNode;
  title: string;
  description?: string;
  /** Check Items. */
  benefits?: React.ReactNode;
  /** Plan Options, or a form for registration. */
  plans?: React.ReactNode;
  /** The one primary action. */
  action: React.ReactNode;
  signInPrompt?: string;
  onSignIn?: () => void;
  finePrint?: string;
}

function PaywallCard({ type = 'metered', logo, title, description, benefits, plans, action, signInPrompt = 'Already a subscriber?', onSignIn, finePrint, className, ...props }: PaywallCardProps) {
  const id = React.useId();
  return (
    <section data-slot="paywall-card" data-type={type} aria-labelledby={id} className={cn('flex w-full min-w-80 flex-col gap-6 rounded-xl border border-border bg-card p-8 shadow-xl', className)} {...props}>
      <div className="flex flex-col items-center gap-3 text-center">
        {logo}
        <h2 id={id} className="m-0 text-2xl leading-8 font-semibold tracking-[-0.4px] text-card-foreground">{title}</h2>
        {description ? <p className="m-0 text-sm leading-5 text-muted-foreground">{description}</p> : null}
      </div>
      {benefits ? <ul className="m-0 flex flex-col gap-2 p-0">{benefits}</ul> : null}
      {plans}
      <div className="flex w-full [&>*]:w-full">{action}</div>
      {onSignIn ? (
        <p className="m-0 flex flex-wrap items-center justify-center gap-x-1 text-sm leading-5 text-muted-foreground">
          {signInPrompt}
          <Button variant="link" size="sm" className="h-8" onClick={onSignIn}>Sign in</Button>
        </p>
      ) : null}
      {finePrint ? <p className="m-0 text-center text-xs leading-4 text-muted-foreground">{finePrint}</p> : null}
    </section>
  );
}

/* Gate Overlay */

export interface GateOverlayProps extends Omit<React.ComponentProps<'div'>, 'title'> {
  variant?: 'blur' | 'fade';
  /** The locked content, shown blurred or faded; not focusable. */
  preview: React.ReactNode;
  plan: string;
  title: string;
  description?: string;
  upgradeLabel?: string;
  onUpgrade?: () => void;
  onSeePlans?: () => void;
  note?: string;
}

function GateOverlay({ variant = 'blur', preview, plan, title, description, upgradeLabel, onUpgrade, onSeePlans, note, className, ...props }: GateOverlayProps) {
  const id = React.useId();
  return (
    <div data-slot="gate-overlay" data-variant={variant} className={cn('relative flex min-h-80 w-full min-w-80 flex-col items-center justify-center overflow-hidden rounded-xl p-6', className)} {...props}>
      <div aria-hidden="true" inert className={cn('pointer-events-none absolute inset-0 select-none', variant === 'blur' && 'blur-[4px]')}>{preview}</div>
      <div aria-hidden="true" className={cn('absolute inset-0', variant === 'blur' ? 'bg-background/60' : 'bg-gradient-to-b from-transparent via-background/90 to-background')} />
      <section aria-labelledby={id} className={cn('relative flex w-full max-w-[400px] min-w-68 flex-col items-center gap-4 rounded-xl border border-border bg-card p-6 text-center shadow-lg', variant === 'fade' && 'mt-auto')}>
        <LockBadge label={plan} tone="brand" />
        <div className="flex flex-col gap-1.5">
          <h2 id={id} className="m-0 text-xl leading-7 font-semibold tracking-[-0.4px] text-card-foreground">{title}</h2>
          {description ? <p className="m-0 text-sm leading-5 text-muted-foreground">{description}</p> : null}
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          <Button onClick={onUpgrade}>{upgradeLabel ?? `Upgrade to ${plan}`}</Button>
          {onSeePlans ? <Button variant="outline" onClick={onSeePlans}>See plans</Button> : null}
        </div>
        {note ? <p className="m-0 text-xs leading-4 text-muted-foreground">{note}</p> : null}
      </section>
    </div>
  );
}

/* Upsell Card */

export interface UpsellCardProps extends Omit<React.ComponentProps<'section'>, 'title'> {
  title: string;
  description?: string;
  actionLabel: string;
  onUpgrade?: () => void;
  note?: string;
  onDismiss?: () => void;
  icon?: React.ReactNode;
  /** One row: icon, text and the action side by side (a sidebar or a toolbar). */
  compact?: boolean;
  /** Adds a secondary "Learn more" action. */
  onLearnMore?: () => void;
  learnMoreLabel?: string;
}

function UpsellCard({ title, description, actionLabel, onUpgrade, note, onDismiss, icon, compact = false, onLearnMore, learnMoreLabel = 'Learn more', className, ...props }: UpsellCardProps) {
  const id = React.useId();
  if (compact) {
    return (
      <section data-slot="upsell-card" data-compact="true" aria-labelledby={id} className={cn('flex w-full min-w-[200px] flex-wrap items-center gap-x-3 gap-y-2 rounded-lg border border-border bg-card p-3', className)} {...props}>
        <span aria-hidden="true" className="flex size-8 shrink-0 items-center justify-center rounded-md bg-[var(--icon-tile-brand-bg)] text-[var(--icon-tile-brand-fg)] [&_svg]:size-4">{icon ?? <Sparkles />}</span>
        <div className="flex min-w-32 flex-1 flex-col">
          <h3 id={id} className="m-0 line-clamp-2 text-sm leading-5 font-medium text-card-foreground">{title}</h3>
          {description ? <p className="m-0 line-clamp-1 text-xs leading-4 text-muted-foreground">{description}</p> : null}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {onLearnMore ? <Button size="xs" variant="ghost" onClick={onLearnMore}>{learnMoreLabel}</Button> : null}
          <Button size="xs" onClick={onUpgrade}>{actionLabel}</Button>
          {onDismiss ? (
            <button type="button" aria-label={`Dismiss ${title}`} onClick={onDismiss} className="flex size-6 items-center justify-center rounded-sm text-muted-foreground outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 [&_svg]:size-4">
              <X aria-hidden="true" />
            </button>
          ) : null}
        </div>
      </section>
    );
  }
  return (
    <section data-slot="upsell-card" aria-labelledby={id} className={cn('flex w-full max-w-[360px] min-w-[200px] flex-col gap-3 rounded-lg border border-border bg-card p-4', className)} {...props}>
      <div className="flex items-start justify-between">
        <span aria-hidden="true" className="flex size-8 items-center justify-center rounded-md bg-[var(--icon-tile-brand-bg)] text-[var(--icon-tile-brand-fg)] [&_svg]:size-4">{icon ?? <Sparkles />}</span>
        {onDismiss ? (
          <button type="button" aria-label={`Dismiss ${title}`} onClick={onDismiss} className="flex size-6 items-center justify-center rounded-sm text-muted-foreground outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 [&_svg]:size-4">
            <X aria-hidden="true" />
          </button>
        ) : null}
      </div>
      <h3 id={id} className="m-0 line-clamp-2 text-sm leading-5 font-medium text-card-foreground">{title}</h3>
      {description ? <p className="m-0 line-clamp-3 text-sm leading-5 text-muted-foreground">{description}</p> : null}
      <Button size="sm" className="w-full" onClick={onUpgrade}>{actionLabel}</Button>
      {onLearnMore ? <Button size="sm" variant="ghost" className="w-full" onClick={onLearnMore}>{learnMoreLabel}</Button> : null}
      {note ? <p className="m-0 text-xs leading-4 text-muted-foreground">{note}</p> : null}
    </section>
  );
}

export { CheckItem as PlanFeature, ComparisonTable, GateOverlay, LockBadge, MeterBanner, PaywallCard, PlanCard, PlanOptions, Price, TrialBanner, UpsellCard, UsageLimitBanner };
