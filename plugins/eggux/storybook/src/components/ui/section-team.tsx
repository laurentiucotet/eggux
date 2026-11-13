// EGG UI blocks, BLOCKS / Sections page (73:2), Team family: Block / Team (139:265), Team Grid
// (206:1673), Team List (206:1727), Team Cards Social (812:13220). Real photos or initials, name and
// role; link to bios only if they exist (guide: build-ui/patterns/marketing-pages.md).
// Every block is a <section> named by its title (h2), background/default, 96 padding, inside a 1152
// container (layout/container/6xl) with 24 / 32 px gutters below 1152. Layout follows the block's
// own width (container queries), so it works in any column.
// Team: centered Section Header 48 above Bylines Size=lg (40 avatar, name, role), 4 columns 32 apart
// with 48 between rows; 2 columns from 576, 1 below.
// Team Grid: Section Header 48 above square photos (Image Placeholder 1:1, radius 12) with the name
// (body/large) and role (body/small muted) 12 under it; 4 per row 24 apart, 40 between rows; 2 per
// row from 576, 1 below.
// Team List: intro (overline, h2 in heading/h1, lead, an outline Button with arrow) 360 wide, 64
// next to a list of people (Avatar xl, name, role, one line of bio, 20 padding, divider); stacked
// below 1024.
// Team Cards Social: Section Header 48 above four Person Cards Layout=photo with ghost icon links
// (LinkedIn, X or GitHub, email), 24 apart; then a hiring line with a link Button, 48 under the
// cards. 4 per row from 1024, 2 from 576, 1 below.
import * as React from 'react';
import github from '@/assets/brands/github.svg';
import linkedin from '@/assets/brands/linkedin.svg';
import xMark from '@/assets/brands/x.svg';
import { ArrowRight, Mail } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Avatar } from './avatar';
import { Button } from './button';
import { Byline } from './byline';
import { ImagePlaceholder } from './image-placeholder';
import { PersonCard } from './person-card';
import { SectionHeader } from './section-header-block';

/* Shared parts */

const shell = '@container w-full bg-background text-foreground';
const inner = 'mx-auto flex w-full max-w-6xl min-w-0 flex-col items-center gap-12 px-6 py-24 @3xl:px-8 @6xl:px-0';
const grid4 = 'm-0 grid w-full list-none grid-cols-1 p-0 @xl:grid-cols-2 @5xl:grid-cols-4';

export interface TeamHeader {
  overline?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
}

export interface TeamMember {
  name: string;
  role: string;
  /** Photo URL; without it the Avatar shows initials and the portrait shows the placeholder. */
  photo?: string;
  /** Short bio (Team List). */
  bio?: string;
  /** Social links (Team Cards Social). Only those that exist. */
  linkedin?: string;
  x?: string;
  github?: string;
  email?: string;
}

const initialsOf = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]!.toUpperCase()).join('');

/* Team */

export interface TeamProps extends Omit<React.ComponentProps<'section'>, 'title'> {
  header?: TeamHeader;
  /** 4 to 12 people: name and role. */
  members?: TeamMember[];
}

const teamMembers: TeamMember[] = [
  { name: 'Ana Popescu', role: 'CEO, co-founder' },
  { name: 'Tudor Lazăr', role: 'CTO, co-founder' },
  { name: 'Maria Ilie', role: 'Head of Design' },
  { name: 'Sofia Barbu', role: 'Product manager' },
  { name: 'Victor Pop', role: 'Engineering lead' },
  { name: 'Irina Radu', role: 'Customer success' },
  { name: 'Andreea Matei', role: 'Product designer' },
  { name: 'Radu Constantin', role: 'Support engineer' },
];

function Team({
  header = { overline: 'Team', title: 'The people behind Acme', description: 'Designers, engineers and support, spread across six countries.' },
  members = teamMembers,
  className,
  ...props
}: TeamProps) {
  const titleId = React.useId();
  return (
    <section data-slot="team" aria-labelledby={titleId} className={cn(shell, className)} {...props}>
      <div className={inner}>
        <SectionHeader titleId={titleId} overline={header.overline} title={header.title} description={header.description} />
        <ul data-slot="team-members" className={cn(grid4, 'gap-x-8 gap-y-12')}>
          {members.map(m => (
            <li key={m.name} className="flex min-w-0 justify-center">
              <Byline size="lg" name={m.name} description={m.role} avatar={{ src: m.photo, initials: initialsOf(m.name) }} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* Team Grid */

const gridMembers: TeamMember[] = [
  { name: 'Elena Popa', role: 'CEO and co-founder' },
  { name: 'Mark Schulz', role: 'CTO and co-founder' },
  { name: 'Aisha Khan', role: 'VP Engineering' },
  { name: 'Tom Reyes', role: 'VP Sales' },
  { name: 'Laura Becker', role: 'Head of Design' },
  { name: 'Dan Ionescu', role: 'Head of Customer Success' },
  { name: 'Ana Popescu', role: 'Finance Director' },
  { name: 'Mihai Ionescu', role: 'Head of Security' },
];

function TeamGrid({
  header = { overline: 'Team', title: 'The people behind Acme', description: 'Engineers, designers and finance experts in Bucharest, Berlin and London.' },
  members = gridMembers,
  className,
  ...props
}: TeamProps) {
  const titleId = React.useId();
  return (
    <section data-slot="team-grid" aria-labelledby={titleId} className={cn(shell, className)} {...props}>
      <div className={inner}>
        <SectionHeader titleId={titleId} overline={header.overline} title={header.title} description={header.description} />
        <ul data-slot="team-members" className={cn(grid4, 'gap-x-6 gap-y-10')}>
          {members.map(m => (
            <li key={m.name} data-slot="team-member" className="flex min-w-0 flex-col gap-3">
              <ImagePlaceholder ratio="1:1" src={m.photo} alt="" showCaption={false} className="rounded-xl" />
              <div className="flex min-w-0 flex-col gap-0.5">
                <h3 className="m-0 text-lg leading-7 font-medium text-foreground [overflow-wrap:anywhere]">{m.name}</h3>
                <p className="m-0 text-sm leading-5 text-muted-foreground [overflow-wrap:anywhere]">{m.role}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* Team List */

export interface TeamListProps extends Omit<React.ComponentProps<'section'>, 'title'> {
  overline?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** The outline button under the intro; empty hides it. */
  action?: { label: string; href: string };
  /** 3 to 6 leaders: name, role, one line of bio. */
  members?: TeamMember[];
}

const listMembers: TeamMember[] = [
  { name: 'Elena Popa', role: 'CEO and co-founder', bio: 'Former CFO at a 2,000-person logistics company; started Acme to fix month-end.' },
  { name: 'Mark Schulz', role: 'CTO and co-founder', bio: 'Built payment infrastructure at two European fintechs.' },
  { name: 'Aisha Khan', role: 'VP Engineering', bio: 'Leads 60 engineers across three offices; previously at a cloud provider.' },
  { name: 'Tom Reyes', role: 'VP Sales', bio: 'Grew enterprise sales from 0 to 400 customers in four years.' },
];

function TeamList({
  overline = 'Leadership',
  title = 'Who runs Acme',
  description = 'Our leadership team brings experience from finance, enterprise software and security.',
  action = { label: 'Join the team', href: '#careers' },
  members = listMembers,
  className,
  ...props
}: TeamListProps) {
  const titleId = React.useId();
  return (
    <section data-slot="team-list" aria-labelledby={titleId} className={cn(shell, className)} {...props}>
      <div className={cn(inner, 'items-stretch')}>
        <div data-slot="team-list-row" className="flex w-full min-w-0 flex-col gap-12 @5xl:flex-row @5xl:gap-16">
          <div data-slot="team-list-intro" className="flex min-w-0 flex-col items-start gap-4 @5xl:w-[360px] @5xl:shrink-0">
            {overline ? <p className="m-0 text-xs leading-4 font-semibold tracking-widest text-brand uppercase">{overline}</p> : null}
            <h2 id={titleId} className="m-0 text-3xl leading-9 font-extrabold tracking-tight @3xl:text-4xl @3xl:leading-10">{title}</h2>
            {description ? <p className="m-0 text-base leading-7 text-muted-foreground">{description}</p> : null}
            {action ? (
              <Button asChild variant="outline">
                <a href={action.href}>{action.label}<ArrowRight aria-hidden="true" /></a>
              </Button>
            ) : null}
          </div>
          <ul data-slot="team-list-people" className="m-0 flex min-w-0 flex-1 list-none flex-col p-0">
            {members.map(m => (
              <li key={m.name} data-slot="team-list-person" className="flex min-w-0 items-start gap-4 border-b border-border py-5">
                <Avatar size="xl" src={m.photo} initials={initialsOf(m.name)} />
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <p className="m-0 flex min-w-0 flex-wrap items-baseline gap-x-2">
                    <span className="text-lg leading-7 font-medium text-foreground">{m.name}</span>
                    <span className="text-sm leading-5 text-muted-foreground">· {m.role}</span>
                  </p>
                  {m.bio ? <p className="m-0 text-sm leading-5 text-muted-foreground">{m.bio}</p> : null}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* Team Cards Social */

const mark = (src: string) =>
  ({ maskImage: `url("${src}")`, WebkitMaskImage: `url("${src}")`, maskSize: 'contain', WebkitMaskSize: 'contain', maskRepeat: 'no-repeat', WebkitMaskRepeat: 'no-repeat', maskPosition: 'center', WebkitMaskPosition: 'center' }) as React.CSSProperties;
const Brand = ({ src }: { src: string }) => <span aria-hidden="true" className="block size-4 bg-current" style={mark(src)} />;

function SocialLinks({ member }: { member: TeamMember }) {
  const links = [
    member.linkedin ? { label: `${member.name} on LinkedIn`, href: member.linkedin, icon: <Brand src={linkedin} />, external: true } : null,
    member.x ? { label: `${member.name} on X`, href: member.x, icon: <Brand src={xMark} />, external: true } : null,
    member.github ? { label: `${member.name} on GitHub`, href: member.github, icon: <Brand src={github} />, external: true } : null,
    member.email ? { label: `Email ${member.name}`, href: `mailto:${member.email}`, icon: <Mail aria-hidden="true" />, external: false } : null,
  ].filter(Boolean) as { label: string; href: string; icon: React.ReactNode; external: boolean }[];
  if (!links.length) return null;
  return (
    <>
      {links.map(l => (
        <Button key={l.href} asChild variant="ghost" size="icon-sm">
          <a href={l.href} aria-label={l.external ? `${l.label} (opens in a new tab)` : l.label} target={l.external ? '_blank' : undefined} rel={l.external ? 'noreferrer' : undefined}>
            {l.icon}
          </a>
        </Button>
      ))}
    </>
  );
}

export interface TeamCardsSocialProps extends TeamProps {
  /** The hiring line under the cards; empty hides it. */
  hiring?: { text: string; label: string; href: string };
}

const socialMembers: TeamMember[] = [
  { name: 'Elena Popa', role: 'CEO and co-founder', linkedin: 'https://www.linkedin.com/', x: 'https://x.com/', email: 'elena@acme.example' },
  { name: 'Mark Schulz', role: 'CTO and co-founder', linkedin: 'https://www.linkedin.com/', github: 'https://github.com/', email: 'mark@acme.example' },
  { name: 'Aisha Khan', role: 'VP Engineering', linkedin: 'https://www.linkedin.com/', github: 'https://github.com/', email: 'aisha@acme.example' },
  { name: 'Tom Reyes', role: 'VP Sales', linkedin: 'https://www.linkedin.com/', x: 'https://x.com/', email: 'tom@acme.example' },
];

function TeamCardsSocial({
  header = { overline: 'Our team', title: 'The people behind Acme', description: 'A team of 140 across Bucharest, Berlin and London. Say hello on LinkedIn or follow what we ship.' },
  members = socialMembers,
  hiring = { text: 'We are hiring in Bucharest, Berlin and London.', label: 'See 6 open roles', href: '#careers' },
  className,
  ...props
}: TeamCardsSocialProps) {
  const titleId = React.useId();
  return (
    <section data-slot="team-cards-social" aria-labelledby={titleId} className={cn(shell, className)} {...props}>
      <div className={inner}>
        <SectionHeader titleId={titleId} overline={header.overline} title={header.title} description={header.description} />
        <div className="flex w-full min-w-0 flex-col items-center gap-12">
          <ul data-slot="team-members" className={cn(grid4, 'gap-6')}>
            {members.map(m => (
              <li key={m.name} className="flex min-w-0">
                <PersonCard layout="photo" name={m.name} role={m.role} photo={m.photo} actions={<SocialLinks member={m} />} />
              </li>
            ))}
          </ul>
          {hiring ? (
            <p data-slot="team-hiring" className="m-0 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-center text-base leading-7 text-muted-foreground">
              {hiring.text}
              <Button asChild variant="link">
                <a href={hiring.href}>{hiring.label}<ArrowRight aria-hidden="true" /></a>
              </Button>
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export { Team, TeamCardsSocial, TeamGrid, TeamList };
