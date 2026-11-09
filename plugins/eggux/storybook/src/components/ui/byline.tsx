// EGG UI Byline. Figma: Byline (Avatar page, "Byline / Component"). Size (sm, default, lg), Name,
// Description (Show description), Show avatar, Avatar exposed (Type, Initials). Who wrote, said or
// owns something: Avatar, name (ui/label) and one muted detail line (ui/caption). The avatar is
// decorative next to the name; the name links to the profile when `href` is set; put dates in a
// <time> inside the description. Hugs its text and truncates both lines in a narrow column.
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Avatar, type AvatarProps, type AvatarSize } from './avatar';

export type BylineSize = 'sm' | 'default' | 'lg';

// Figma: avatar sm 24 + gap 8, default 32 + 12, lg 40 + 12.
const avatarSize: Record<BylineSize, AvatarSize> = { sm: 'sm', default: 'default', lg: 'lg' };
const gap: Record<BylineSize, string> = { sm: 'gap-2', default: 'gap-3', lg: 'gap-3' };

export interface BylineProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  /** Figma Size: sm in dense grids, default under titles and on cards, lg under testimonials. */
  size?: BylineSize;
  /** Figma Name. */
  name?: string;
  /** Figma Description: role and company, or date and reading time (dates in <time>). */
  description?: React.ReactNode;
  /** Figma Show description. */
  showDescription?: boolean;
  /** Figma Show avatar. */
  showAvatar?: boolean;
  /** Figma exposed Avatar: type, initials, src, shape. Size follows the Byline. */
  avatar?: Omit<AvatarProps, 'size' | 'name'>;
  /** Profile link on the name. */
  href?: string;
}

function initialsOf(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]!.toUpperCase()).join('');
}

function Byline({
  size = 'default',
  name = 'Maria Ilie',
  description = 'Product designer, Acme',
  showDescription = true,
  showAvatar = true,
  avatar,
  href,
  className,
  ...props
}: BylineProps) {
  const nameClass = 'block min-w-0 truncate text-sm leading-5 font-medium text-foreground';
  return (
    <div data-slot="byline" data-size={size} className={cn('inline-flex max-w-full min-w-0 items-center', gap[size], className)} {...props}>
      {showAvatar ? <Avatar initials={initialsOf(name)} {...avatar} size={avatarSize[size]} aria-hidden="true" /> : null}
      <div className="flex min-w-0 flex-col">
        {href ? (
          <a href={href} data-slot="byline-name" className={cn(nameClass, 'rounded-sm underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring')}>{name}</a>
        ) : (
          <span data-slot="byline-name" className={nameClass}>{name}</span>
        )}
        {showDescription && description ? (
          <span data-slot="byline-description" className="block min-w-0 truncate text-xs leading-4 text-muted-foreground">{description}</span>
        ) : null}
      </div>
    </div>
  );
}

export { Byline };
