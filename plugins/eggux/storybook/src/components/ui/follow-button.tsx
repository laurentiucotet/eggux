// EGG UI Follow Button. Code only (no Figma component yet); family Community.
// A toggle for following a person, topic or space, with the follower count beside it. Not following =
// the primary Button "Follow" with a plus; following = an outline Button "Following" with a check.
// The count ("1,204 followers", compact above 9,999: "12.4K") follows the state: following adds one.
// Show count off leaves the button alone. Loading keeps the label and sets aria-busy.
// A11y: one button whose name is the visible label plus the subject ("Following Acme Design"), so the
// visible text is part of the name; the pressed state is the text itself; the count is a polite
// status so the change is heard; the whole thing wraps nothing and truncates the count under 276.
import * as React from 'react';
import { Check, Plus } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button } from './button';

function formatCount(n: number): string {
  if (n >= 10000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}K`;
  return n.toLocaleString('en');
}

export interface FollowButtonProps extends Omit<React.ComponentProps<'span'>, 'onChange' | 'defaultValue'> {
  /** Who or what is followed: read after the label ("Follow Acme Design"). */
  name: string;
  following?: boolean;
  defaultFollowing?: boolean;
  /** Followers without the viewer. */
  followers?: number;
  showCount?: boolean;
  size?: 'sm' | 'default';
  loading?: boolean;
  disabled?: boolean;
  onFollowingChange?: (following: boolean) => void;
}

function FollowButton({
  name,
  following: followingProp,
  defaultFollowing = false,
  followers = 0,
  showCount = true,
  size = 'default',
  loading = false,
  disabled,
  onFollowingChange,
  className,
  ...props
}: FollowButtonProps) {
  const [inner, setInner] = React.useState(defaultFollowing);
  const following = followingProp ?? inner;
  const total = followers + (following ? 1 : 0);
  const toggle = () => {
    const next = !following;
    if (followingProp === undefined) setInner(next);
    onFollowingChange?.(next);
  };
  return (
    <span data-slot="follow-button" data-state={following ? 'following' : 'not-following'} className={cn('inline-flex min-w-0 max-w-full items-center gap-3', className)} {...props}>
      <Button
        type="button"
        variant={following ? 'outline' : 'default'}
        size={size}
        disabled={disabled}
        aria-busy={loading || undefined}
        onClick={() => {
          if (!loading) toggle();
        }}
        leadingIcon={following ? <Check aria-hidden="true" /> : <Plus aria-hidden="true" />}
      >
        <span>{following ? 'Following' : 'Follow'}</span>
        <span className="sr-only"> {name}</span>
      </Button>
      {showCount ? (
        <span role="status" aria-live="polite" className="min-w-0 truncate text-sm leading-5 text-muted-foreground">
          <span className="font-medium text-foreground tabular-nums">{formatCount(total)}</span> {total === 1 ? 'follower' : 'followers'}
        </span>
      ) : null}
    </span>
  );
}

export { FollowButton };
