// EGG UI Entity Card. Figma: Entity Card (Card page, "Entity Card / Component", 248:2600). State
// (default, hover, focus, selected), Show actions, Show menu, Show tags, Show details, Show footer,
// Show people. A summary of one object (customer, project, vendor, asset) in a grid or board: card
// surface, border, radius xl, 16 padding and gap, 320 wide. Top: a Leading slot (40 avatar, icon or
// 1:1 image), title (ui/label) over subtitle (body/small muted), both truncating, an Actions slot
// for the one direct action and a ghost "More actions" menu. Then a Tags slot (status + tags),
// Details (2-4 label / value rows, 8 apart) and a footer (Separator, Avatar Group sm, "Updated 2 h
// ago" ui/caption muted on the right). Selected: ring-colored border.
// A11y: with `href` the whole card is one link (the title, stretched); the menu and actions sit
// above it and stay separate controls. Details are a dl.
import * as React from 'react';
import { Ellipsis } from '@/components/icons';
import { cn } from '@/lib/utils';
import { ButtonIcon } from './button-icon';
import { Separator } from './separator';

export interface EntityCardProps extends Omit<React.ComponentProps<'article'>, 'title'> {
  title: string;
  description?: string;
  /** Figma Leading slot: an Avatar lg, an Icon Tile or a 40 image. */
  leading?: React.ReactNode;
  /** The whole card opens this object. */
  href?: string;
  /** Figma Actions slot: one ButtonIcon (add, remove, pin). */
  actions?: React.ReactNode;
  /** Figma Show menu: DropdownMenu trigger is up to the app; pass onMenu to show the button. */
  menu?: React.ReactNode;
  /** Figma Tags slot: Badges. */
  tags?: React.ReactNode;
  /** Figma Details slot: 2-4 rows. */
  details?: { label: string; value: React.ReactNode }[];
  /** Figma Show people: an AvatarGroup sm. */
  people?: React.ReactNode;
  /** Footer text: "Updated 2 h ago". */
  footer?: React.ReactNode;
  /** Figma State=selected. */
  selected?: boolean;
  headingLevel?: 2 | 3 | 4;
}

function EntityCard({ title, description, leading, href, actions, menu, tags, details, people, footer, selected = false, headingLevel = 3, className, ...props }: EntityCardProps) {
  const Heading = `h${headingLevel}` as 'h3';
  return (
    <article
      data-slot="entity-card"
      data-selected={selected || undefined}
      className={cn(
        'relative flex w-full min-w-0 flex-col gap-[var(--card-gap-sm)] rounded-xl border bg-card p-[var(--card-padding-sm)] text-card-foreground transition-[box-shadow,border-color] duration-[var(--duration-fast)]',
        selected ? 'border-ring' : 'border-border',
        href && 'hover:border-foreground/20 hover:shadow-md has-[a[data-slot=entity-card-link]:focus-visible]:ring-[3px] has-[a[data-slot=entity-card-link]:focus-visible]:ring-ring/50',
        className,
      )}
      {...props}
    >
      <div className="flex w-full min-w-0 items-start gap-3">
        {leading ? <div className="flex shrink-0">{leading}</div> : null}
        <div className="flex min-w-0 flex-1 flex-col gap-0.5 text-sm leading-5">
          <Heading title={title} className="m-0 truncate text-sm leading-5 font-medium text-card-foreground">
            {href ? <a data-slot="entity-card-link" href={href} className="outline-none after:absolute after:inset-0 after:content-['']">{title}</a> : title}
          </Heading>
          {description ? <p title={description} className="m-0 truncate text-muted-foreground">{description}</p> : null}
        </div>
        {actions ? <div className="relative z-10 flex shrink-0 items-center gap-1">{actions}</div> : null}
        {menu ? <div className="relative z-10 flex shrink-0">{menu}</div> : null}
      </div>
      {tags ? <div className="relative flex w-full flex-wrap gap-2">{tags}</div> : null}
      {details?.length ? (
        <dl className="m-0 flex w-full flex-col gap-2 text-sm leading-5">
          {details.map(d => (
            <div key={d.label} className="flex min-w-0 items-start gap-3">
              <dt className="min-w-0 flex-1 text-muted-foreground">{d.label}</dt>
              <dd className="m-0 shrink-0 text-right whitespace-nowrap text-card-foreground">{d.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
      {people || footer ? (
        <div className="flex w-full flex-col gap-3">
          <Separator />
          <div className="flex min-w-0 items-center gap-2">
            {people ? <div className="relative z-10 flex shrink-0">{people}</div> : null}
            {footer ? <p className="m-0 min-w-0 flex-1 text-right text-xs leading-4 text-muted-foreground">{footer}</p> : null}
          </div>
        </div>
      ) : null}
    </article>
  );
}

/** The Figma menu button: a ghost Button Icon named after the object. Wrap it in a DropdownMenuTrigger. */
function EntityCardMenuButton({ title, ...props }: { title: string } & Omit<React.ComponentProps<typeof ButtonIcon>, 'icon' | 'label'>) {
  return <ButtonIcon variant="ghost" icon={<Ellipsis />} label={`More actions for ${title}`} {...props} />;
}

export { EntityCard, EntityCardMenuButton };
