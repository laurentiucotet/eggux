// EGG UI Table of Contents Item. Figma: Table of Contents Item (Navigation page, "Table of
// Contents / Component"). Level (1 = h2, 2 = h3) x State (default, hover, active); Label. An
// <li> with a link to a heading: 1 px border/default rule on the left, padding 4 top and bottom
// (spacing/1), 12 (level 1, spacing/3) or 24 (level 2, spacing/6) on the left, body/small
// foreground/muted; hover = foreground; active (the section in view) = 2 px background/primary
// rule, ui/label foreground, aria-current="true". Long labels wrap.
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TableOfContentsItemProps extends Omit<React.ComponentProps<'a'>, 'href'> {
  /** Link to the heading: "#installation". */
  href: string;
  /** Figma Level: 1 for an h2, 2 for an h3. */
  level?: 1 | 2;
  /** Figma State=active: the section in view; sets aria-current="true". */
  active?: boolean;
}

const levelClass = { 1: 'pl-3', 2: 'pl-6' } as const;

function TableOfContentsItem({ href, level = 1, active = false, className, children, ...props }: TableOfContentsItemProps) {
  return (
    <li data-slot="table-of-contents-item" data-level={level} className="flex">
      <a
        href={href}
        aria-current={active ? 'true' : undefined}
        data-active={active || undefined}
        className={cn(
          'block min-w-0 flex-1 border-l border-border py-1 pr-0 text-sm leading-5 text-muted-foreground [overflow-wrap:anywhere] transition-colors duration-[var(--duration-fast)] outline-none hover:text-foreground focus-visible:rounded-sm focus-visible:shadow-[0_0_0_2px_var(--background),0_0_0_4px_var(--ring)]',
          levelClass[level],
          active && 'border-l-2 border-primary font-medium text-foreground',
          className,
        )}
        {...props}
      >
        {children}
      </a>
    </li>
  );
}

export { TableOfContentsItem };
