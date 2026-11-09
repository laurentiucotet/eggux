// EGG UI Person Card. Figma: Person Card (Card page, "Person Card / Component", 371:4023). Layout
// (vertical, horizontal, photo), Show organization, Show tags, Show contact, Show actions. One
// person: author, expert, speaker, contact or team member.
// vertical: card surface, border, radius xl, 16 padding and gap, 280 wide; a 48 avatar over the
// name (h4), role (body/small) and organization (body/small muted), 12 apart. horizontal: 400 wide,
// a 40 avatar beside the text. photo: no surface, a 4:5 portrait (radius xl) then the same text,
// for team and speaker pages. Then expertise tags (outline Badges, 6 apart), contact Meta Items
// (mail, phone, 6 apart) and actions (an outline sm Button "View profile").
// A11y: the name is a heading; contact items are links (mailto:, tel:); the portrait's alt is the
// person's name only when the name is not right below it (it is, so it is decorative here).
import * as React from 'react';
import { Mail, Phone } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Avatar } from './avatar';
import { Badge } from './badge';
import { ImagePlaceholder } from './image-placeholder';
import { MetaItem } from './meta-item';

export interface PersonCardProps extends Omit<React.ComponentProps<'article'>, 'role'> {
  name: string;
  /** Job title: "Head of Finance Operations". */
  role?: string;
  organization?: string;
  layout?: 'vertical' | 'horizontal' | 'photo';
  initials?: string;
  /** Avatar photo (vertical, horizontal) or portrait (photo). */
  photo?: string;
  tags?: string[];
  email?: string;
  phone?: string;
  /** Figma Actions slot. */
  actions?: React.ReactNode;
  headingLevel?: 2 | 3 | 4;
}

function PersonCard({ name, role, organization, layout = 'vertical', initials, photo, tags, email, phone, actions, headingLevel = 3, className, ...props }: PersonCardProps) {
  const Heading = `h${headingLevel}` as 'h3';
  const isPhoto = layout === 'photo';
  const text = (
    <div className="flex min-w-0 flex-1 flex-col gap-0.5 text-sm leading-5">
      <Heading className="m-0 text-xl leading-7 font-semibold tracking-tight text-card-foreground [overflow-wrap:anywhere]">{name}</Heading>
      {role ? <p className="m-0 text-foreground [overflow-wrap:anywhere]">{role}</p> : null}
      {organization ? <p className="m-0 text-muted-foreground [overflow-wrap:anywhere]">{organization}</p> : null}
    </div>
  );
  return (
    <article
      data-slot="person-card"
      data-layout={layout}
      className={cn(
        'flex w-full min-w-0 flex-col items-start',
        isPhoto ? 'gap-4' : 'gap-[var(--card-gap-sm)] rounded-xl border border-border bg-card p-[var(--card-padding-sm)] text-card-foreground',
        className,
      )}
      {...props}
    >
      {isPhoto ? (
        <>
          <ImagePlaceholder ratio="3:4" src={photo} alt="" showCaption={false} className="aspect-[4/5] w-full rounded-xl" />
          {text}
        </>
      ) : (
        <div className={cn('flex w-full min-w-0 gap-3', layout === 'horizontal' ? 'items-center' : 'flex-col items-start')}>
          <Avatar size={layout === 'horizontal' ? 'lg' : 'xl'} initials={initials} src={photo} />
          {text}
        </div>
      )}
      {tags?.length ? (
        <ul aria-label="Expertise" className="m-0 flex list-none flex-wrap gap-x-1.5 gap-y-1.5 p-0">
          {tags.map(t => <li key={t} className="flex"><Badge variant="outline">{t}</Badge></li>)}
        </ul>
      ) : null}
      {email || phone ? (
        <div className="flex w-full min-w-0 flex-col items-start gap-1.5">
          {email ? <a href={`mailto:${email}`} className="flex min-w-0 max-w-full rounded-sm text-muted-foreground no-underline outline-none hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/50"><MetaItem icon={<Mail />} className="min-w-0 max-w-full">{email}</MetaItem></a> : null}
          {phone ? <a href={`tel:${phone.replace(/\s/g, '')}`} className="flex min-w-0 max-w-full rounded-sm text-muted-foreground no-underline outline-none hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/50"><MetaItem icon={<Phone />} className="min-w-0 max-w-full">{phone}</MetaItem></a> : null}
        </div>
      ) : null}
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </article>
  );
}

export { PersonCard };
