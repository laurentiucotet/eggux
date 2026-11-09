// EGG UI blocks, Navigation page, Banner section: Block / Announcement Banner (200:1241), Block /
// Banner Floating (693:108807), Block / Banner Countdown (693:108871), Block / Banner with Action
// (693:108906), and the Countdown they use (436:899, Style=default).
// Each banner is a region named by its label with a dismiss button (Button Icon sm, 20 from the
// right, centered); dismissing hides it and calls onDismiss so the page can remember it.
// Announcement: background/primary, 4 px padding (40 high), optional secondary Badge (pill), message
// ui/label, a link with an arrow. with Action: section-muted background with a bottom border, 8 px
// padding (49 high), soft-info Badge, foreground message, brand link. Countdown: primary bar, 12
// padding (90 high), Badge, title and terms line, Countdown tiles, a secondary Button; at zero the
// bar removes itself. Floating: an elevated Card (radius xl, shadow lg, 24 padding, 1040 wide) with
// a brand Icon Tile, title and line, secondary and primary buttons and dismiss; `floating` pins it
// 24 above the bottom of the viewport.
// Countdown: days, hours, min (and sec) on 64 wide card-muted tiles; screen readers get the end
// time in words, never the ticking digits.
import * as React from 'react';
import { ArrowRight, Sparkles, X } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Badge } from './badge';
import { Button } from './button';
import { ButtonIcon } from './button-icon';
import { IconTile } from './icon-tile';

type Link = { label: string; href: string };

function useDismiss(onDismiss?: () => void) {
  const [hidden, setHidden] = React.useState(false);
  return { hidden, dismiss: () => { setHidden(true); onDismiss?.(); } };
}

interface BannerBase extends Omit<React.ComponentProps<'section'>, 'children'> {
  /** Region name for screen readers. Default "Announcement". */
  label?: string;
  /** Shows the dismiss button. */
  onDismiss?: () => void;
  dismissLabel?: string;
}

const onPrimaryIcon = 'text-primary-foreground hover:bg-white/15 hover:text-primary-foreground';

/* Countdown */

export interface CountdownProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  /** The deadline. */
  endsAt: Date | string | number;
  /** Start clock (tests and previews); the countdown ticks from here. Default: now. */
  now?: Date | string | number;
  /** Figma Show seconds. Default: only in the last hour. */
  showSeconds?: boolean;
  /** Read instead of the digits: "Offer ends Fri 31 Oct 2026 at 23:59 CET". */
  label?: string;
  /** Called once when the time is up. */
  onEnd?: () => void;
}

const pad = (n: number) => String(n).padStart(2, '0');

function useRemaining(endsAt: CountdownProps['endsAt'], now?: CountdownProps['now'], onEnd?: () => void) {
  const end = new Date(endsAt).getTime();
  const offset = React.useRef(now === undefined ? 0 : new Date(now).getTime() - Date.now());
  const [left, setLeft] = React.useState(() => Math.max(0, end - (Date.now() + offset.current)));
  const ended = React.useRef(false);
  React.useEffect(() => {
    const tick = () => {
      const l = Math.max(0, end - (Date.now() + offset.current));
      setLeft(l);
      if (l === 0 && !ended.current) { ended.current = true; onEnd?.(); }
    };
    tick();
    const t = window.setInterval(tick, 1000);
    return () => window.clearInterval(t);
  }, [end, onEnd]);
  return left;
}

function Countdown({ endsAt, now, showSeconds, label, onEnd, className, ...props }: CountdownProps) {
  const left = useRemaining(endsAt, now, onEnd);
  const s = Math.floor(left / 1000);
  const units = [
    { key: 'days', value: Math.floor(s / 86400), unit: 'days' },
    { key: 'hours', value: Math.floor((s % 86400) / 3600), unit: 'hours' },
    { key: 'minutes', value: Math.floor((s % 3600) / 60), unit: 'min' },
    { key: 'seconds', value: s % 60, unit: 'sec' },
  ];
  const withSeconds = showSeconds ?? s < 3600;
  return (
    <div data-slot="countdown" className={cn('flex shrink-0 items-start gap-2 text-center whitespace-nowrap', className)} {...props}>
      {units.filter(u => withSeconds || u.key !== 'seconds').map(u => (
        <span key={u.key} aria-hidden="true" data-slot="countdown-tile" data-unit={u.key} className="flex w-16 flex-col items-center gap-0.5 rounded-md bg-[var(--card-muted)] px-3 py-2">
          <span className="w-full text-2xl leading-8 font-semibold tracking-[-0.4px] text-foreground tabular-nums">{pad(u.value)}</span>
          <span className="w-full text-xs leading-4 text-muted-foreground">{u.unit}</span>
        </span>
      ))}
      <span className="sr-only">{label ?? `Ends ${new Date(endsAt).toLocaleString('en-GB', { dateStyle: 'full', timeStyle: 'short' })}`}</span>
    </div>
  );
}

/* Announcement Banner */

export interface AnnouncementBannerProps extends BannerBase {
  message: string;
  badge?: string;
  link?: Link;
}

function AnnouncementBanner({ message, badge, link, label = 'Announcement', onDismiss, dismissLabel = 'Dismiss announcement', className, ...props }: AnnouncementBannerProps) {
  const { hidden, dismiss } = useDismiss(onDismiss);
  if (hidden) return null;
  return (
    <section data-slot="announcement-banner" aria-label={label} className={cn('relative flex w-full flex-wrap items-center justify-center gap-x-3 gap-y-1 bg-primary py-1 pr-14 pl-4 text-primary-foreground sm:px-12', className)} {...props}>
      {badge ? <Badge variant="secondary" className="rounded-full">{badge}</Badge> : null}
      <p className="m-0 text-sm leading-5 font-medium">{message}</p>
      {link ? (
        <a href={link.href} className="inline-flex h-8 items-center gap-1.5 rounded-full text-sm leading-5 font-medium text-primary-foreground outline-none hover:underline focus-visible:ring-[3px] focus-visible:ring-primary-foreground/60">
          {link.label}<ArrowRight aria-hidden="true" className="size-4" />
        </a>
      ) : null}
      {onDismiss ? <ButtonIcon variant="ghost" size="sm" icon={<X aria-hidden="true" />} label={dismissLabel} onClick={dismiss} className={cn('absolute top-1/2 right-5 -translate-y-1/2', onPrimaryIcon)} /> : null}
    </section>
  );
}

/* Banner with Action */

export interface BannerWithActionProps extends BannerBase {
  message: string;
  badge?: string;
  link: Link;
}

function BannerWithAction({ message, badge, link, label = 'Announcement', onDismiss, dismissLabel = 'Dismiss announcement', className, ...props }: BannerWithActionProps) {
  const { hidden, dismiss } = useDismiss(onDismiss);
  if (hidden) return null;
  return (
    <section data-slot="banner-with-action" aria-label={label} className={cn('relative flex w-full flex-wrap items-center justify-center gap-x-3 gap-y-1 border-b border-border bg-[var(--section-muted-background)] py-2 pr-14 pl-4 sm:px-12', className)} {...props}>
      {badge ? <Badge variant="soft-info" className="rounded-full">{badge}</Badge> : null}
      <p className="m-0 text-sm leading-5 font-medium text-foreground">{message}</p>
      <a href={link.href} className="inline-flex h-8 items-center gap-1.5 rounded-full text-sm leading-5 font-medium text-brand outline-none hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/50">
        {link.label}<ArrowRight aria-hidden="true" className="size-4" />
      </a>
      {onDismiss ? <ButtonIcon variant="ghost" size="sm" icon={<X aria-hidden="true" />} label={dismissLabel} onClick={dismiss} className="absolute top-1/2 right-5 -translate-y-1/2" /> : null}
    </section>
  );
}

/* Banner Countdown */

export interface BannerCountdownProps extends BannerBase {
  title: string;
  /** Terms line: when the offer ends, with date, time and time zone. */
  terms?: string;
  badge?: string;
  endsAt: CountdownProps['endsAt'];
  now?: CountdownProps['now'];
  showSeconds?: boolean;
  action: Link;
  /** Called when the time is up; the bar removes itself. */
  onEnd?: () => void;
}

function BannerCountdown({ title, terms, badge, endsAt, now, showSeconds, action, onEnd, label = 'Offer', onDismiss, dismissLabel = 'Dismiss offer', className, ...props }: BannerCountdownProps) {
  const { hidden, dismiss } = useDismiss(onDismiss);
  const [over, setOver] = React.useState(false);
  const end = React.useCallback(() => { setOver(true); onEnd?.(); }, [onEnd]);
  if (hidden || over) return null;
  return (
    <section data-slot="banner-countdown" aria-label={label} className={cn('relative flex w-full flex-wrap items-center justify-center gap-x-8 gap-y-3 bg-primary py-3 pr-14 pl-4 text-primary-foreground sm:px-12', className)} {...props}>
      <div className="flex min-w-0 items-center gap-3">
        {badge ? <Badge variant="secondary" className="shrink-0 rounded-full">{badge}</Badge> : null}
        <div className="flex min-w-0 flex-col gap-0.5">
          <p className="m-0 text-sm leading-5 font-medium">{title}</p>
          {terms ? <p className="m-0 text-xs leading-4">{terms}</p> : null}
        </div>
      </div>
      <Countdown endsAt={endsAt} now={now} showSeconds={showSeconds} label={terms} onEnd={end} />
      <Button asChild variant="secondary"><a href={action.href}>{action.label}</a></Button>
      {onDismiss ? <ButtonIcon variant="ghost" size="sm" icon={<X aria-hidden="true" />} label={dismissLabel} onClick={dismiss} className={cn('absolute top-1/2 right-5 -translate-y-1/2', onPrimaryIcon)} /> : null}
    </section>
  );
}

/* Banner Floating */

export interface BannerFloatingProps extends BannerBase {
  title: string;
  description?: string;
  /** Icon in the brand Icon Tile; null hides it. Default sparkles. */
  icon?: React.ReactNode | null;
  action: Link;
  secondaryAction?: Link;
  /** Pin 24 above the bottom of the viewport (fixed). Default false: in the flow, as in Figma. */
  floating?: boolean;
}

function BannerFloating({ title, description, icon, action, secondaryAction, floating = false, label = 'Announcement', onDismiss, dismissLabel = 'Dismiss announcement', className, ...props }: BannerFloatingProps) {
  const { hidden, dismiss } = useDismiss(onDismiss);
  if (hidden) return null;
  return (
    <section
      data-slot="banner-floating"
      aria-label={label}
      className={cn('@container flex w-full justify-center px-4 py-6 sm:px-12', floating && 'pointer-events-none fixed inset-x-0 bottom-0 z-40', className)}
      {...props}
    >
      <div className="pointer-events-auto flex w-[1040px] max-w-full items-center gap-4 rounded-xl border border-border bg-card p-6 text-card-foreground shadow-lg @max-2xl:flex-wrap">
        {icon !== null ? <IconTile tileStyle="brand" icon={icon ?? <Sparkles />} /> : null}
        <div className="flex min-w-0 flex-1 basis-60 flex-col gap-1 text-sm leading-5">
          <p className="m-0 font-medium text-foreground">{title}</p>
          {description ? <p className="m-0 text-muted-foreground">{description}</p> : null}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {secondaryAction ? <Button asChild variant="outline"><a href={secondaryAction.href}>{secondaryAction.label}</a></Button> : null}
          <Button asChild><a href={action.href}>{action.label}</a></Button>
          {onDismiss ? <ButtonIcon variant="ghost" icon={<X aria-hidden="true" />} label={dismissLabel} onClick={dismiss} /> : null}
        </div>
      </div>
    </section>
  );
}

export { AnnouncementBanner, BannerCountdown, BannerFloating, BannerWithAction, Countdown };
