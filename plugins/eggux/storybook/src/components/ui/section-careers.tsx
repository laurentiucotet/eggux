// EGG UI blocks, BLOCKS / Sections page (73:2), Careers family: Block / Careers List (206:1783),
// Careers Benefits (206:1905), Job Header (206:1947). Guide: build-ui/patterns/marketing-pages.md:
// the list grouped by department with counts; benefits as facts; the job page header with the
// salary range. Every block is a <section> named by its title, inside a 1152 container
// (layout/container/6xl, Careers List 960) with 24 / 32 px gutters below; 96 padding top and
// bottom; layout follows the block's own width (container queries).
// Careers List: left Section Header, a single-choice Chip Group of departments with counts that
// filters the list, then one group per department: a List Group Header (h3, ui/overline) over Job
// Listings (h4, meta, location, posted, salary, New badge, Apply), 32 apart.
// Careers Benefits: centered Section Header 48 above six Feature Items Layout=card (Icon Tile
// neutral, title, one line), 24 apart; 3 per row from 1024, 2 from 576, 1 below.
// Job Header: Back Link, the job title (h1, heading/h1) and a Badge List (department, place,
// contract, salary range), next to an Action Bar (Share, Apply for this role) at the end; a
// Separator 32 below. The actions go under the text below 768.
import * as React from 'react';
import { Calendar, Clock, Copy, House, ShieldCheck, TrendingUp, Users } from '@/components/icons';
import { cn } from '@/lib/utils';
import { ActionBar } from './action-bar';
import { BackLink } from './back-link';
import { BadgeList } from './badge-list';
import { Button } from './button';
import { Chip } from './chip';
import { ChipGroup } from './chip-group';
import { FeatureItem } from './feature-item';
import { JobListing, ListGroupHeader } from './list';
import { SectionHeader } from './section-header-block';
import { Separator } from './separator';

/* Shared parts */

const shell = '@container w-full bg-background text-foreground';
const inner = 'mx-auto flex w-full min-w-0 flex-col px-6 py-24 @3xl:px-8';

export interface CareersHeader {
  overline?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
}

/* Careers List */

export interface Job {
  title: string;
  department: string;
  /** "Full-time", "Part-time, 30 h". */
  contract: string;
  location: string;
  posted: string;
  /** The range with currency and period. Always show it. */
  salary: string;
  isNew?: boolean;
  href: string;
}

export interface CareersListProps extends Omit<React.ComponentProps<'section'>, 'title'> {
  header?: CareersHeader;
  jobs?: Job[];
  /** Department shown first; "all" for every job. */
  defaultDepartment?: string;
}

const jobList: Job[] = [
  { title: 'Senior Backend Engineer, Payments', department: 'Engineering', contract: 'Full-time', location: 'Bucharest or remote (EU)', posted: 'Posted 2 days ago', salary: 'EUR 5,400-6,600 / month', isNew: true, href: '#jobs/backend-payments' },
  { title: 'Staff Frontend Engineer, Design System', department: 'Engineering', contract: 'Full-time', location: 'Berlin or remote (EU)', posted: 'Posted 5 days ago', salary: 'EUR 6,800-8,000 / month', href: '#jobs/frontend-design-system' },
  { title: 'Site Reliability Engineer', department: 'Engineering', contract: 'Full-time', location: 'London', posted: 'Posted 1 week ago', salary: 'GBP 5,200-6,100 / month', href: '#jobs/sre' },
  { title: 'Data Engineer, Reporting', department: 'Engineering', contract: 'Full-time', location: 'Amsterdam or remote (EU)', posted: 'Posted today', salary: 'EUR 5,000-6,000 / month', isNew: true, href: '#jobs/data-reporting' },
  { title: 'Product Designer, Approvals', department: 'Design', contract: 'Full-time', location: 'Bucharest', posted: 'Posted 4 days ago', salary: 'EUR 3,900-4,700 / month', href: '#jobs/designer-approvals' },
  { title: 'Enterprise Account Executive, DACH', department: 'Sales', contract: 'Full-time', location: 'Berlin', posted: 'Posted 3 weeks ago', salary: 'EUR 5,500-7,000 / month + commission', href: '#jobs/ae-dach' },
  { title: 'Solutions Engineer', department: 'Sales', contract: 'Full-time', location: 'London or remote (UK)', posted: 'Posted 2 weeks ago', salary: 'GBP 4,600-5,500 / month', href: '#jobs/solutions-engineer' },
  { title: 'Customer Success Manager', department: 'Sales', contract: 'Part-time, 30 h', location: 'Lisbon', posted: 'Posted 6 days ago', salary: 'EUR 2,900-3,500 / month', href: '#jobs/csm' },
];

function CareersList({
  header = { overline: 'Careers', title: 'Open positions', description: '8 roles in Bucharest, Berlin, London, Lisbon and remote within the EU.' },
  jobs = jobList,
  defaultDepartment = 'all',
  className,
  ...props
}: CareersListProps) {
  const titleId = React.useId();
  const departments = [...new Set(jobs.map(j => j.department))];
  const [department, setDepartment] = React.useState(defaultDepartment);
  const shown = department === 'all' ? departments : departments.filter(d => d === department);
  return (
    <section data-slot="careers-list" aria-labelledby={titleId} className={cn(shell, className)} {...props}>
      <div className={cn(inner, 'max-w-[960px] gap-8 @5xl:px-0')}>
        <SectionHeader align="left" className="max-w-none" titleId={titleId} overline={header.overline} title={header.title} description={header.description} />
        <ChipGroup
          type="single"
          aria-label="Filter by department"
          value={department}
          onValueChange={v => setDepartment(v[0] ?? 'all')}
        >
          <Chip value="all" label={`All (${jobs.length})`} />
          {departments.map(d => <Chip key={d} value={d} label={`${d} (${jobs.filter(j => j.department === d).length})`} />)}
        </ChipGroup>
        {shown.map(d => (
          <div key={d} data-slot="careers-group" className="flex w-full min-w-0 flex-col gap-2">
            <ListGroupHeader label={d} as="h3" className="min-h-0 px-0 py-0 [&_h3]:font-semibold [&_h3]:tracking-widest [&_h3]:uppercase" />
            <ul className="m-0 flex list-none flex-col p-0">
              {jobs.filter(j => j.department === d).map(j => (
                <li key={j.href} className="flex min-w-0">
                  <JobListing
                    headingLevel={4}
                    title={j.title}
                    href={j.href}
                    meta={`${j.department} · ${j.contract}`}
                    location={j.location}
                    posted={j.posted}
                    salary={j.salary}
                    isNew={j.isNew}
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

/* Careers Benefits */

export interface Benefit {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export interface CareersBenefitsProps extends Omit<React.ComponentProps<'section'>, 'title'> {
  header?: CareersHeader;
  /** Three or six facts, each one line. */
  benefits?: Benefit[];
}

const benefitList: Benefit[] = [
  { icon: <House />, title: 'Remote within the EU', description: 'Work from home, an office, or both; we pay for coworking.' },
  { icon: <Clock />, title: 'Flexible hours', description: 'Core hours 11:00-15:00 in your time zone, the rest is yours.' },
  { icon: <ShieldCheck />, title: 'Private health care', description: 'Full coverage for you and your family.' },
  { icon: <TrendingUp />, title: 'Equity', description: 'Stock options for every employee, reviewed yearly.' },
  { icon: <Calendar />, title: '30 days off', description: 'Plus public holidays and your birthday.' },
  { icon: <Users />, title: 'Team offsites', description: 'Twice a year, with the whole company.' },
];

function CareersBenefits({
  header = { overline: 'Benefits', title: 'What you get at Acme', description: 'The same benefits in every office, from day one.' },
  benefits = benefitList,
  className,
  ...props
}: CareersBenefitsProps) {
  const titleId = React.useId();
  return (
    <section data-slot="careers-benefits" aria-labelledby={titleId} className={cn(shell, className)} {...props}>
      <div className={cn(inner, 'max-w-6xl items-center gap-12 @6xl:px-0')}>
        <SectionHeader titleId={titleId} overline={header.overline} title={header.title} description={header.description} />
        <ul data-slot="careers-benefits-grid" className="m-0 grid w-full list-none grid-cols-1 gap-6 p-0 @xl:grid-cols-2 @5xl:grid-cols-3">
          {benefits.map(b => (
            <li key={b.title} className="flex min-w-0">
              <FeatureItem layout="card" icon={b.icon} title={b.title} description={b.description} className="flex-1" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* Job Header */

export interface JobHeaderProps extends Omit<React.ComponentProps<'section'>, 'title'> {
  title?: string;
  backLabel?: string;
  backHref?: string;
  /** Department, place, contract and the salary range. */
  tags?: string[];
  applyHref?: string;
  /** Share the job; default copies the page link. */
  onShare?: () => void;
}

function JobHeader({
  title = 'Senior Backend Engineer, Payments',
  backLabel = 'All positions',
  backHref = '#careers',
  tags = ['Engineering', 'Bucharest or remote (EU)', 'Full-time', '€70,000 - €90,000 per year'],
  applyHref = '#apply',
  onShare,
  className,
  ...props
}: JobHeaderProps) {
  const titleId = React.useId();
  const share = () => {
    if (onShare) return onShare();
    void navigator.clipboard?.writeText(window.location.href).catch(() => {});
  };
  return (
    <section data-slot="job-header" aria-labelledby={titleId} className={cn(shell, className)} {...props}>
      <div className={cn(inner, 'max-w-6xl gap-8 @6xl:px-0')}>
        <div data-slot="job-header-row" className="flex w-full min-w-0 flex-col gap-6 @3xl:flex-row @3xl:items-end @3xl:gap-8">
          <div className="flex min-w-0 flex-1 flex-col items-start gap-4">
            <BackLink href={backHref}>{backLabel}</BackLink>
            <h1 id={titleId} className="m-0 text-3xl leading-9 font-extrabold tracking-tight [overflow-wrap:anywhere] @3xl:text-4xl @3xl:leading-10">{title}</h1>
            <BadgeList items={tags} max={tags.length} label="About the role" />
          </div>
          <ActionBar align="end" className="@3xl:w-auto @3xl:shrink-0 [&_[data-slot=action-bar-actions]]:justify-start @3xl:[&_[data-slot=action-bar-actions]]:justify-end">
            <Button variant="outline" leadingIcon={<Copy aria-hidden="true" />} onClick={share}>Share</Button>
            <Button asChild>
              <a href={applyHref}>Apply for this role</a>
            </Button>
          </ActionBar>
        </div>
        <Separator />
      </div>
    </section>
  );
}

export { CareersBenefits, CareersList, JobHeader };
