// EGG UI more Avatar types, built on Avatar and Avatar Group (same sizes, ring and tokens):
// - Avatar Label: an avatar with the name and a second line (email, role), sm / default / lg, with
//   an optional link and an action at the end. Use it in lists of people and menus.
// - Avatar Group Popover: a group of the first N avatars where "+N" opens a Popover with everyone
//   (Avatar Labels); for long lists that a Tooltip cannot hold.
// - Avatar Group Add: a dashed "+" circle at the end of a group to invite or assign someone.
// - Avatar Ring: a 2 px ring with a 2 px gap around an avatar: brand (new story, unread), success
//   (in a call), muted (seen).
// - Avatar Count: an avatar with a Badge Count on its corner (notifications for that account).
import * as React from 'react';
import { Plus } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Avatar, AvatarGroupContext, type AvatarProps } from './avatar';
import { AvatarGroup, type AvatarGroupSize } from './avatar-group';
import { BadgeCount } from './badge-count';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

const initialsOf = (name: string) => name.split(/\s+/).slice(0, 2).map((p) => p[0]?.toLocaleUpperCase()).join('');

/* Avatar Label */

export type AvatarLabelSize = 'sm' | 'default' | 'lg';

const labelAvatar: Record<AvatarLabelSize, AvatarProps['size']> = { sm: 'sm', default: 'default', lg: 'lg' };
const labelGap: Record<AvatarLabelSize, string> = { sm: 'gap-2', default: 'gap-2.5', lg: 'gap-3' };
const labelName: Record<AvatarLabelSize, string> = { sm: 'text-xs leading-4 font-medium', default: 'text-sm leading-5 font-medium', lg: 'text-base leading-6 font-semibold' };
const labelDesc: Record<AvatarLabelSize, string> = { sm: 'text-xs leading-4', default: 'text-xs leading-4', lg: 'text-sm leading-5' };

export interface AvatarLabelProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  name: string;
  description?: string;
  size?: AvatarLabelSize;
  avatar?: Omit<AvatarProps, 'size' | 'name'>;
  /** Makes the name a link (profile page). */
  href?: string;
  /** A control at the end (role Select, Remove). */
  action?: React.ReactNode;
}

function AvatarLabel({ name, description, size = 'default', avatar, href, action, className, ...props }: AvatarLabelProps) {
  return (
    <div data-slot="avatar-label" data-size={size} className={cn('flex min-w-0 items-center', labelGap[size], className)} {...props}>
      <Avatar size={labelAvatar[size]} initials={initialsOf(name)} {...avatar} />
      <div className="flex min-w-0 flex-1 flex-col">
        <span className={cn('truncate text-foreground', labelName[size])}>
          {href ? (
            <a href={href} className="rounded-sm underline-offset-4 outline-none hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/50">
              {name}
            </a>
          ) : (
            name
          )}
        </span>
        {description ? <span className={cn('truncate text-muted-foreground', labelDesc[size])}>{description}</span> : null}
      </div>
      {action ? <div className="flex shrink-0 items-center">{action}</div> : null}
    </div>
  );
}

/* Avatar Group Add */

const addSize: Record<AvatarGroupSize, string> = { sm: 'size-6 [&_svg]:size-3', default: 'size-8 [&_svg]:size-4', lg: 'size-10 [&_svg]:size-4' };

function AvatarGroupAdd({ label = 'Add people', className, ...props }: Omit<React.ComponentProps<'button'>, 'children'> & { label?: string }) {
  const group = React.useContext(AvatarGroupContext);
  const size = (group?.size ?? 'default') as AvatarGroupSize;
  return (
    <button
      type="button"
      data-slot="avatar-group-add"
      aria-label={label}
      title={label}
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center rounded-full border border-dashed border-muted-foreground bg-background text-muted-foreground outline-none hover:border-foreground hover:text-foreground focus-visible:z-10 focus-visible:shadow-[0_0_0_2px_var(--background),0_0_0_4px_var(--ring)]',
        addSize[size],
        className,
      )}
      {...props}
    >
      <Plus aria-hidden="true" />
    </button>
  );
}

/* Avatar Group Popover */

export interface AvatarPerson {
  name: string;
  description?: string;
  src?: string;
  initials?: string;
}

export interface AvatarGroupPopoverProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  people: AvatarPerson[];
  /** How many avatars show before "+N". */
  max?: number;
  size?: AvatarGroupSize;
  /** Popover title ("Shared with"). */
  title?: string;
  /** Names or label next to the avatars. */
  label?: React.ReactNode;
  /** Extra content under the list (Invite button). */
  footer?: React.ReactNode;
}

function AvatarGroupPopover({ people, max = 3, size = 'default', title = 'People', label, footer, className, ...props }: AvatarGroupPopoverProps) {
  const shown = people.slice(0, max);
  const rest = people.length - shown.length;
  return (
    <AvatarGroup size={size} label={label} className={className} {...props}>
      {shown.map((p) => (
        <Avatar key={p.name} name={p.name} src={p.src} initials={p.initials ?? initialsOf(p.name)} />
      ))}
      {rest > 0 ? (
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              data-slot="avatar-group-more"
              aria-label={`+${rest} more, show all ${people.length} people`}
              className="relative inline-flex shrink-0 rounded-full outline-none focus-visible:z-10 focus-visible:shadow-[0_0_0_2px_var(--background),0_0_0_4px_var(--ring)]"
            >
              <Avatar initials={`+${rest}`} />
            </button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-72 p-0">
            <p className="m-0 border-b border-border px-3 py-2 text-sm leading-5 font-medium">
              {title} <span className="text-muted-foreground">· {people.length}</span>
            </p>
            <ul className="m-0 flex max-h-72 list-none flex-col gap-1 overflow-y-auto p-2">
              {people.map((p) => (
                <li key={p.name} className="rounded-md px-1 py-1">
                  <AvatarLabel name={p.name} description={p.description} avatar={{ src: p.src, initials: p.initials ?? initialsOf(p.name) }} />
                </li>
              ))}
            </ul>
            {footer ? <div className="border-t border-border p-2">{footer}</div> : null}
          </PopoverContent>
        </Popover>
      ) : null}
    </AvatarGroup>
  );
}

/* Avatar Ring */

export type AvatarRingTone = 'brand' | 'success' | 'muted';

const ringColor: Record<AvatarRingTone, string> = { brand: 'var(--primary)', success: 'var(--success)', muted: 'var(--border)' };

export interface AvatarRingProps extends React.ComponentProps<'span'> {
  tone?: AvatarRingTone;
  /** What the ring means, read after the avatar ("new update"). */
  ringLabel?: string;
  shape?: 'circle' | 'square';
}

function AvatarRing({ tone = 'brand', ringLabel, shape = 'circle', className, children, ...props }: AvatarRingProps) {
  return (
    <span
      data-slot="avatar-ring"
      data-tone={tone}
      className={cn('relative inline-flex shrink-0', shape === 'circle' ? 'rounded-full' : 'rounded-lg', className)}
      style={{ boxShadow: `0 0 0 2px var(--background), 0 0 0 4px ${ringColor[tone]}` }}
      {...props}
    >
      {children}
      {ringLabel ? <span className="sr-only">, {ringLabel}</span> : null}
    </span>
  );
}

/* Avatar Count */

export interface AvatarCountProps extends React.ComponentProps<'span'> {
  count: number;
  /** Text read with the count ("3 notifications"). */
  countLabel?: string;
}

function AvatarCount({ count, countLabel, className, children, ...props }: AvatarCountProps) {
  return (
    <span data-slot="avatar-count" className={cn('relative inline-flex shrink-0', className)} {...props}>
      {children}
      {count > 0 ? (
        <BadgeCount variant="destructive" count={count} label={countLabel ?? `${count} new`} className="absolute -top-1.5 -right-2 ring-2 ring-background" />
      ) : null}
    </span>
  );
}

export { AvatarCount, AvatarGroupAdd, AvatarGroupPopover, AvatarLabel, AvatarRing };
