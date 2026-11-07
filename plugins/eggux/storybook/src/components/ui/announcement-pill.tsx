// EGG UI Announcement Pill. Figma: Announcement Pill (Badge page, "Announcement Pill / Component",
// 440:1583). A short link above a hero title to the newest launch: a "New" tag (primary pill Badge),
// one line of ui/label that truncates, an arrow (14). Pill, border, background/default, 4 / 12 px
// sides, 2 px vertical, 8 gap, 26 high. One at a time; in-app notices use Alert.
// A11y: one link; its name is the tag plus the label ("New Automations for every team").
import * as React from 'react';
import { ArrowRight } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Badge } from './badge';

export interface AnnouncementPillProps extends React.ComponentProps<'a'> {
  /** Figma Show tag: the short tag before the label; null hides it. */
  tag?: React.ReactNode;
  label: string;
}

function AnnouncementPill({ tag = 'New', label, className, ...props }: AnnouncementPillProps) {
  return (
    <a
      data-slot="announcement-pill"
      className={cn(
        'inline-flex h-[26px] max-w-full min-w-0 items-center gap-2 rounded-full border border-border bg-background py-0.5 pr-3 pl-1 text-foreground no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50',
        !tag && 'pl-3',
        className,
      )}
      {...props}
    >
      {tag ? <Badge shape="pill">{tag}</Badge> : null}
      <span title={label} className="min-w-0 flex-1 truncate text-sm leading-5 font-medium">{label}</span>
      <ArrowRight aria-hidden="true" className="size-3.5 shrink-0" />
    </a>
  );
}

export { AnnouncementPill };
