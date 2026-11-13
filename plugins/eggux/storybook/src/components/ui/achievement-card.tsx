// EGG UI Achievement Card. Code only (no Figma component yet); family Community.
// A milestone a member can earn: a 48 round icon tile, the title, one line of what it takes, and the
// state. earned = the tile in the success soft tone, a "Earned" badge and the date; in progress = a
// Progress bar with "3 of 5" and the tile in the neutral tone; locked = the whole card muted with a
// "Locked" badge and the lock icon replaces the icon. Optional rarity line ("4% of members").
// A11y: an article whose heading is the title; the state is text (a badge), never color alone; the
// progress is a real progressbar named by the title; the icon is decoration. Text wraps; the badge
// and tile never shrink.
import * as React from 'react';
import { Lock } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Badge } from './badge';
import { Progress } from './progress';

export type AchievementState = 'earned' | 'in-progress' | 'locked';

export interface AchievementCardProps extends Omit<React.ComponentProps<'article'>, 'title'> {
  title: string;
  /** What it takes: "Answer 5 questions from other members". */
  description: string;
  /** An icon from `@/components/icons`. */
  icon: React.ReactNode;
  state?: AchievementState;
  /** in-progress: how far, "current of total". */
  progress?: { current: number; total: number };
  /** earned: "Earned on 4 March 2026". */
  earnedOn?: string;
  /** "Held by 4% of members". */
  rarity?: string;
  headingLevel?: 2 | 3 | 4;
}

function AchievementCard({ title, description, icon, state = 'earned', progress, earnedOn, rarity, headingLevel = 3, className, ...props }: AchievementCardProps) {
  const Heading = `h${headingLevel}` as 'h2' | 'h3' | 'h4';
  const locked = state === 'locked';
  return (
    <article
      data-slot="achievement-card"
      data-state={state}
      className={cn('flex w-full min-w-0 max-w-[400px] items-start gap-4 rounded-xl border border-border bg-card p-4 text-card-foreground', className)}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn(
          'flex size-12 shrink-0 items-center justify-center rounded-full [&_svg]:size-6',
          state === 'earned' ? 'bg-[var(--badge-soft-success-bg)] text-[var(--badge-soft-success-fg)]' : 'bg-muted text-muted-foreground',
        )}
      >
        {locked ? <Lock /> : icon}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex min-w-0 items-start justify-between gap-2">
          <Heading className={cn('m-0 min-w-0 text-base leading-6 font-semibold break-words', locked && 'text-muted-foreground')}>{title}</Heading>
          {state === 'earned' ? <Badge variant="soft-success" shape="pill" className="shrink-0">Earned</Badge> : null}
          {locked ? <Badge variant="soft-neutral" shape="pill" className="shrink-0">Locked</Badge> : null}
        </div>
        <p className="m-0 text-sm leading-5 text-muted-foreground">{description}</p>
        {state === 'in-progress' && progress ? (
          <Progress
            size="sm"
            label="Progress"
            value={Math.round((progress.current / progress.total) * 100)}
            valueText={`${progress.current} of ${progress.total}`}
          />
        ) : null}
        {state === 'earned' && earnedOn ? <p className="m-0 text-xs leading-4 text-muted-foreground">{earnedOn}</p> : null}
        {rarity ? <p className="m-0 text-xs leading-4 text-muted-foreground">{rarity}</p> : null}
      </div>
    </article>
  );
}

export { AchievementCard };
