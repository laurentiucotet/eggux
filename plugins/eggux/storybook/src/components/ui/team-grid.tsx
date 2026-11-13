// EGG UI Team Grid. Code only (no Figma component yet); family Marketing.
// A heading, an optional intro line and a grid of Person Cards (avatar with initials, name, role)
// with a row of icon links (email, website, profile) at the bottom. Cards share one height per row,
// and the links stay on the bottom edge. Layout vertical (cards in columns) or horizontal (wider
// cards, avatar beside the text). Built on Person Card; nothing is redrawn here.
// A11y: a labelled section holding a list; each card is an article with its name as heading;
// link buttons are icon-only links named "<Name>: email" and so on, with a visible focus ring.
// Columns come from auto-fit, so a 276 px column holds one card and nothing overflows.
import * as React from 'react';
import { Globe, Link as LinkIcon, Mail } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { PersonCard } from './person-card';

export type TeamLinkKind = 'email' | 'website' | 'profile';

export interface TeamMember {
  name: string;
  role: string;
  initials?: string;
  links?: { kind: TeamLinkKind; href: string }[];
}

export interface TeamGridProps extends Omit<React.ComponentProps<'section'>, 'title'> {
  heading?: string;
  /** One line under the heading. */
  intro?: string;
  members: TeamMember[];
  layout?: 'vertical' | 'horizontal';
  headingLevel?: 2 | 3;
}

const linkMeta: Record<TeamLinkKind, { label: string; icon: React.ReactNode }> = {
  email: { label: 'email', icon: <Mail aria-hidden="true" /> },
  website: { label: 'website', icon: <Globe aria-hidden="true" /> },
  profile: { label: 'profile', icon: <LinkIcon aria-hidden="true" /> },
};

function TeamGrid({ heading = 'Meet the team', intro, members, layout = 'vertical', headingLevel = 2, className, ...props }: TeamGridProps) {
  const headingId = React.useId();
  const Heading = `h${headingLevel}` as 'h2' | 'h3';
  return (
    <section data-slot="team-grid" aria-labelledby={heading ? headingId : undefined} className={cn('flex w-full min-w-0 flex-col gap-6', className)} {...props}>
      {heading || intro ? (
        <div className="flex min-w-0 flex-col gap-2">
          {heading ? <Heading id={headingId} className="m-0 text-2xl leading-8 font-semibold tracking-tight text-foreground [overflow-wrap:anywhere]">{heading}</Heading> : null}
          {intro ? <p className="m-0 text-base leading-6 text-muted-foreground">{intro}</p> : null}
        </div>
      ) : null}
      <ul
        className={cn(
          'm-0 grid list-none gap-4 p-0',
          layout === 'horizontal' ? 'grid-cols-[repeat(auto-fit,minmax(min(100%,17rem),1fr))]' : 'grid-cols-[repeat(auto-fit,minmax(min(100%,13rem),1fr))]',
        )}
      >
        {members.map(m => (
          <li key={m.name} className="flex min-w-0">
            <PersonCard
              name={m.name}
              role={m.role}
              initials={m.initials}
              layout={layout}
              headingLevel={(headingLevel + 1) as 3 | 4}
              className={cn('h-full', m.links?.length && '[&>:last-child]:mt-auto')}
              actions={
                m.links?.length
                  ? m.links.map(l => (
                      <Button key={l.kind} asChild variant="ghost" size="icon-sm">
                        <a href={l.href} aria-label={`${m.name}: ${linkMeta[l.kind].label}`}>{linkMeta[l.kind].icon}</a>
                      </Button>
                    ))
                  : undefined
              }
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

export { TeamGrid };
