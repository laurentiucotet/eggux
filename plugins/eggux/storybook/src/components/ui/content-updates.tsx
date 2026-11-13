// EGG UI blocks, BLOCKS / Content page (138:2), updates family: Block / Changelog (214:1288) and
// Status Page (214:1389).
// Changelog: Section Header, then one Release Note Item per release, newest first (version and date
// in the meta line, a title that states the benefit, an optional 16:9 image and one Release Note
// Line per change, New / Improved / Fixed). Content 1152 wide.
// Status Page: Section Heading lg (h1 "Acme status", "Updated N minutes ago", Subscribe), the overall
// state in one Alert, a bordered list of Service Status Rows with 90 Uptime Day bars (uptime as text,
// status in words), and Past incidents as a Timeline. Content 896 wide.
// Both are <section>s named by their title, 96 px top and bottom (64 on narrow screens), 24 px side
// gutters; they follow their own width (container queries).
// Guide: eggux build-ui/patterns/content-and-docs.md (Changelog, Status page).
import * as React from 'react';
import { Bell, Check } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Alert } from './alert';
import { ReleaseNoteItem, ReleaseNoteLine, type ReleaseType } from './audit';
import { Badge } from './badge';
import { Button } from './button';
import { ImagePlaceholder } from './image-placeholder';
import { SectionHeader } from './section-header-block';
import { SectionHeading } from './section-heading';
import { ServiceStatusRow, type ServiceStatus } from './service-status-row';
import { Timeline, TimelineItem } from './timeline';
import type { UptimeState } from './uptime-bars';

type SectionProps = Omit<React.ComponentProps<'section'>, 'title'>;

function Band({ titleId, max, className, children, ...props }: SectionProps & { titleId: string; max: string }) {
  return (
    <section aria-labelledby={titleId} className={cn('@container w-full bg-background text-foreground', className)} {...props}>
      <div data-slot="section-container" className={cn('mx-auto flex w-full flex-col px-6 py-16 @3xl:py-24', max)}>{children}</div>
    </section>
  );
}

/* Changelog */

export interface ChangelogRelease {
  type: ReleaseType;
  /** "v2.4 · Oct 15, 2026". */
  meta: string;
  title: string;
  /** Figma Show text: off when the lines say it all. */
  text?: string;
  /** Figma Show image: a screenshot of the change (URL; the placeholder shows without one). */
  image?: string | true;
  imageAlt?: string;
  changes?: { type: ReleaseType; text: string }[];
  href?: string;
}

export interface ChangelogProps extends SectionProps {
  overline?: string;
  title?: string;
  description?: string;
  releases?: ChangelogRelease[];
}

const changelogReleases: ChangelogRelease[] = [
  {
    type: 'new', meta: 'v2.4 · Oct 15, 2026', title: 'Approvals now support delegation', image: true,
    imageAlt: 'The approval settings with a deputy chosen for 20 to 31 October',
    changes: [
      { type: 'new', text: 'Delegate approvals to a deputy for a date range.' },
      { type: 'improved', text: 'Approval emails show the full amount and cost center.' },
      { type: 'fixed', text: 'Escalation timers no longer reset after an edit.' },
    ],
  },
  {
    type: 'new', meta: 'v2.3 · Oct 1, 2026', title: 'Scheduled reports',
    changes: [
      { type: 'new', text: 'Schedule any report as PDF or CSV, daily, weekly or monthly.' },
      { type: 'improved', text: 'Exports of more than 50,000 rows run in the background.' },
    ],
  },
  {
    type: 'new', meta: 'v2.2 · Sep 16, 2026', title: 'Data residency in the EU',
    changes: [
      { type: 'new', text: 'Choose Frankfurt or Dublin for new workspaces.' },
      { type: 'fixed', text: 'Audit log filters keep their values after a refresh.' },
    ],
  },
];

/** Block / Changelog: Section Header and the releases, newest first, each a Release Note Item (24 top and bottom, divided by lines). */
function Changelog({
  overline = 'Changelog',
  title = 'What is new in Acme',
  description = 'New features, improvements and fixes. Subscribe by email or RSS.',
  releases = changelogReleases,
  ...props
}: ChangelogProps) {
  const id = React.useId();
  return (
    <Band titleId={id} max="max-w-[1200px] gap-12" data-slot="changelog" {...props}>
      <SectionHeader titleId={id} align="left" overline={overline} title={title} description={description} className="max-w-none" />
      <div data-slot="changelog-releases" className="flex w-full flex-col">
        {releases.map(r => (
          <ReleaseNoteItem
            key={r.meta}
            type={r.type}
            meta={r.meta}
            title={r.title}
            text={r.text}
            href={r.href}
            image={r.image ? <ImagePlaceholder ratio="16:9" src={r.image === true ? undefined : r.image} alt={r.imageAlt ?? ''} showCaption={false} /> : undefined}
            changes={r.changes?.length ? r.changes.map(c => <ReleaseNoteLine key={c.text} type={c.type}>{c.text}</ReleaseNoteLine>) : undefined}
          />
        ))}
      </div>
    </Band>
  );
}

/* Status Page */

export interface StatusService {
  name: string;
  status?: ServiceStatus;
  uptime: string;
  /** Days that were not fully operational, counted back from today (0 = today). */
  incidents?: { daysAgo: number; state: UptimeState; title?: string; href?: string }[];
  incident?: { title: string; href: string };
}

export interface StatusIncident {
  title: string;
  description: string;
  date: string;
  dateTime: string;
  /** Badge text: "Resolved". */
  state?: string;
}

export interface StatusPageProps extends SectionProps {
  title?: string;
  updated?: string;
  /** The overall state in one sentence (Alert title) and its detail. */
  summary?: { variant: 'success' | 'warning' | 'destructive' | 'info'; title: string; description?: string };
  services?: StatusService[];
  incidents?: StatusIncident[];
  /** The last day of the 90 (today). */
  today?: Date;
  onSubscribe?: () => void;
}

const statusServices: StatusService[] = [
  { name: 'Web app', uptime: '99.99% uptime' },
  { name: 'API', uptime: '99.97% uptime', incidents: [{ daysAgo: 84, state: 'degraded', title: 'API: elevated error rates', href: '#incident-api' }] },
  { name: 'Payments', uptime: '99.94% uptime', incidents: [{ daysAgo: 41, state: 'outage', title: 'Payments: delayed card confirmations', href: '#incident-payments' }, { daysAgo: 40, state: 'degraded' }] },
  { name: 'Email delivery', uptime: '100% uptime' },
  { name: 'Reports and exports', uptime: '99.98% uptime', incidents: [{ daysAgo: 9, state: 'degraded' }] },
];

const statusIncidents: StatusIncident[] = [
  { title: 'Payments: delayed card confirmations', description: 'Card confirmations were delayed by up to 20 minutes for 1 hour 40 minutes. No payments were lost.', date: 'Oct 3, 2026', dateTime: '2026-10-03', state: 'Resolved' },
  { title: 'API: elevated error rates', description: 'About 2% of API requests failed for 25 minutes after a configuration change, which we rolled back.', date: 'Aug 21, 2026', dateTime: '2026-08-21', state: 'Resolved' },
];

const dayLabel = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

/** 90 days, oldest first, from `today` back. */
function ninetyDays(service: StatusService, today: Date) {
  return Array.from({ length: 90 }, (_, i) => {
    const daysAgo = 89 - i;
    const d = new Date(today.getTime() - daysAgo * 86_400_000);
    const hit = service.incidents?.find(x => x.daysAgo === daysAgo);
    return {
      date: dayLabel.format(d),
      state: hit?.state ?? ('operational' as UptimeState),
      incident: hit?.title && hit.href ? { title: hit.title, href: hit.href } : undefined,
    };
  });
}

/** Block / Status Page: overall state, one row per service with 90 daily bars, past incidents. 896 wide. */
function StatusPage({
  title = 'Acme status',
  updated = 'Updated 2 minutes ago',
  summary = { variant: 'success', title: 'All systems operational', description: 'No incidents in the last 7 days. Uptime over the last 90 days: 99.98%.' },
  services = statusServices,
  incidents = statusIncidents,
  today = new Date(Date.UTC(2026, 10, 13)),
  onSubscribe,
  ...props
}: StatusPageProps) {
  const id = React.useId();
  const incidentsId = React.useId();
  return (
    <Band titleId={id} max="max-w-[944px] gap-8" data-slot="status-page" {...props}>
      <SectionHeading
        size="lg"
        title={<span id={id}>{title}</span>}
        description={updated}
        actions={<Button variant="outline" leadingIcon={<Bell />} onClick={onSubscribe}>Subscribe to updates</Button>}
      />
      <Alert variant={summary.variant} title={summary.title} description={summary.description} />
      <ul aria-label="Services" data-slot="status-services" className="m-0 flex list-none flex-col rounded-xl border border-border px-4 py-2 @3xl:px-6">
        {services.map(s => (
          <ServiceStatusRow
            key={s.name}
            name={s.name}
            status={s.status}
            uptime={s.uptime}
            incident={s.incident}
            showBars
            days={ninetyDays(s, today)}
            barsProps={{ label: `${s.name} uptime, last 90 days` }}
            className="last:border-b-0"
          />
        ))}
      </ul>
      {incidents.length ? (
        <div data-slot="status-incidents" className="flex flex-col gap-4">
          <h2 id={incidentsId} className="m-0 text-xl leading-7 font-semibold tracking-[-0.4px] text-foreground">Past incidents</h2>
          <Timeline aria-labelledby={incidentsId}>
            {incidents.map((inc, i) => (
              <TimelineItem
                key={inc.title}
                tone="success"
                icon={<Check />}
                title={inc.title}
                description={inc.description}
                time={inc.date}
                dateTime={inc.dateTime}
                connector={i < incidents.length - 1}
              >
                {inc.state ? <Badge variant="success">{inc.state}</Badge> : null}
              </TimelineItem>
            ))}
          </Timeline>
        </div>
      ) : null}
    </Band>
  );
}

export { Changelog, StatusPage };
