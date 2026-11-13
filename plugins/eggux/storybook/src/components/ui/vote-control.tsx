// EGG UI Vote Control. Code only (no Figma component yet); family Community.
// Up and down vote with the score between them, for questions, answers and ideas. Orientation
// vertical (up, score, down; 32 wide) or horizontal (a pill: up, score, down). Each arrow is a toggle
// button (aria-pressed): picking the other one moves the vote, picking the same one removes it. The
// score follows the vote (up adds 1, down subtracts 1, from the score without the viewer). Show down
// off leaves only the up arrow (a "like" style). Compact numbers above 9,999 ("12.4K").
// A11y: a group named "Vote on <subject>"; buttons "Upvote" and "Downvote" with aria-pressed; the
// score is a polite status read as "Score 43"; 32 px touch targets with visible focus.
import * as React from 'react';
import { ChevronDown, ChevronUp } from '@/components/icons';
import { cn } from '@/lib/utils';

export type VoteValue = 'up' | 'down' | null;

function formatScore(n: number): string {
  const a = Math.abs(n);
  if (a >= 10000) return `${n < 0 ? '-' : ''}${(a / 1000).toFixed(1).replace(/\.0$/, '')}K`;
  return n.toLocaleString('en');
}

export interface VoteControlProps extends Omit<React.ComponentProps<'div'>, 'onChange' | 'defaultValue'> {
  /** What is voted on: read in the group name ("Vote on this answer"). */
  subject?: string;
  /** The score without the viewer's own vote. */
  score: number;
  value?: VoteValue;
  defaultValue?: VoteValue;
  orientation?: 'vertical' | 'horizontal';
  showDown?: boolean;
  disabled?: boolean;
  onValueChange?: (value: VoteValue) => void;
}

const arrow =
  'inline-flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors duration-[var(--duration-fast)] hover:bg-accent hover:text-accent-foreground focus-visible:shadow-[0_0_0_2px_var(--background),0_0_0_4px_var(--ring)] disabled:pointer-events-none disabled:opacity-50 aria-pressed:bg-primary aria-pressed:text-primary-foreground [&_svg]:size-5';

function VoteControl({ subject = 'this post', score, value: valueProp, defaultValue = null, orientation = 'vertical', showDown = true, disabled, onValueChange, className, ...props }: VoteControlProps) {
  const [inner, setInner] = React.useState<VoteValue>(defaultValue);
  const value = valueProp !== undefined ? valueProp : inner;
  const total = score + (value === 'up' ? 1 : value === 'down' ? -1 : 0);
  const pick = (v: 'up' | 'down') => {
    const next = value === v ? null : v;
    if (valueProp === undefined) setInner(next);
    onValueChange?.(next);
  };
  return (
    <div
      role="group"
      aria-label={`Vote on ${subject}`}
      data-slot="vote-control"
      data-orientation={orientation}
      className={cn(
        'inline-flex shrink-0 items-center gap-0.5',
        orientation === 'vertical' ? 'flex-col' : 'flex-row rounded-full border border-border px-1 py-0.5',
        className,
      )}
      {...props}
    >
      <button type="button" aria-label="Upvote" aria-pressed={value === 'up'} disabled={disabled} onClick={() => pick('up')} className={arrow}>
        <ChevronUp aria-hidden="true" />
      </button>
      <span role="status" aria-live="polite" className="min-w-8 px-1 text-center text-sm leading-5 font-semibold tabular-nums">
        <span className="sr-only">Score </span>
        {formatScore(total)}
      </span>
      {showDown ? (
        <button type="button" aria-label="Downvote" aria-pressed={value === 'down'} disabled={disabled} onClick={() => pick('down')} className={arrow}>
          <ChevronDown aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}

export { VoteControl };
