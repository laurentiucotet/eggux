// EGG UI Presence Bar. Figma: Presence Bar (Avatar page, "Presence Bar / Component"). Built from
// Status Dot (live) and Avatar Group Size=sm with a label ("Elena and 2 others are here"). Who
// else has this document open right now: up to 4 avatars, then 3 and "+N". Each avatar is a
// button named with the person and place ("Maria Ilie, editing Section 2", the Avatar's text
// equivalent), with the same text in a Tooltip on hover and focus; clicking jumps there. Renders nothing when nobody else is present.
// The label sums up arrivals; it is not a live region (no announcement per person).
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Avatar } from './avatar';
import { AvatarGroup } from './avatar-group';
import { StatusDot } from './status-dot';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

export interface PresencePerson {
  id?: string;
  name: string;
  initials?: string;
  /** Photo URL. */
  src?: string;
  /** Where they are: "editing Section 2". */
  location?: string;
  /** Idle people fade (opacity 70: the initials keep 4.5:1). */
  idle?: boolean;
}

export interface PresenceBarProps extends Omit<React.ComponentProps<'div'>, 'children' | 'onSelect'> {
  /** The other people present (never the reader). */
  people: PresencePerson[];
  /** Short summary after the avatars; default "<first> and N others are here". */
  label?: React.ReactNode;
  /** Most avatars before "+N". Default 4 (3 and +N when there are more). */
  max?: number;
  /** Jump to where the person is. */
  onSelect?: (person: PresencePerson) => void;
  onMoreClick?: React.MouseEventHandler<HTMLButtonElement>;
}

function initialsOf(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]!.toUpperCase()).join('');
}

function summary(people: PresencePerson[]) {
  const first = people[0]!.name.split(/\s+/)[0];
  if (people.length === 1) return `${first} is here`;
  return `${first} and ${people.length - 1} ${people.length === 2 ? 'other is' : 'others are'} here`;
}

function PresenceBar({ people, label, max = 4, onSelect, onMoreClick, className, 'aria-label': ariaLabel = 'People viewing', ...props }: PresenceBarProps) {
  if (people.length === 0) return null;
  const shown = people.length > max ? people.slice(0, max - 1) : people;
  const rest = people.slice(shown.length);
  const name = (p: PresencePerson) => (p.location ? `${p.name}, ${p.location}` : p.name);

  return (
    <div role="group" aria-label={ariaLabel} data-slot="presence-bar" className={cn('flex max-w-full min-w-0 items-center gap-2', className)} {...props}>
      <StatusDot status="success" label="Live" showLabel={false} />
      <TooltipProvider>
        <AvatarGroup
          size="sm"
          aria-label={`${people.length} ${people.length === 1 ? 'person' : 'people'} here`}
          className="min-w-0"
          label={label ?? summary(people)}
          more={rest.length}
          moreLabel={`Show ${rest.length} more people here`}
          moreTooltip={rest.map(name).join('; ')}
          onMoreClick={onMoreClick}
        >
          {shown.map(p => (
            <Tooltip key={p.id ?? p.name}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  data-slot="presence-bar-person"
                  onClick={() => onSelect?.(p)}
                  className={cn(
                    'relative inline-flex shrink-0 rounded-full outline-none transition-opacity duration-[var(--duration-fast)] focus-visible:z-10 focus-visible:shadow-[0_0_0_2px_var(--background),0_0_0_4px_var(--ring)]',
                    p.idle && 'opacity-70',
                  )}
                >
                  <Avatar initials={p.initials ?? initialsOf(p.name)} src={p.src} name={name(p)} />
                </button>
              </TooltipTrigger>
              <TooltipContent>{name(p)}</TooltipContent>
            </Tooltip>
          ))}
        </AvatarGroup>
      </TooltipProvider>
    </div>
  );
}

export { PresenceBar };
