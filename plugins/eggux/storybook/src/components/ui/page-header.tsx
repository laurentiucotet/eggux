// EGG UI Page Header. Figma: Page Header (Navigation page, "Page Header / Component", 71:66).
// Title of a page inside the app shell: title (heading/h3 look: 24/32 semibold, tight) and one
// sentence of description (body/small, muted), the page actions on the right (primary last).
// Record pages add a Back Link above the title (names the list, never "Back"), a meta line under
// the description (a status Badge first, then Meta Items, wrapping 4 / 16 px) and a pager ("3 of 24"
// + previous / next outline sm Button Icons) before the actions.
// Layout: flex-wrap, 12 / 16 px gaps, aligned to the bottom; the text column fills (min 240), the
// pager and actions move under it in narrow columns; title and description up to 2 lines.
// A div, not <header>: the banner landmark is the Top Bar or App Header.
// The title is the page heading: h1 by default (the Figma style is heading/h3), `as` changes the level.
import * as React from 'react';
import { ChevronLeft, ChevronRight } from '@/components/icons';
import { cn } from '@/lib/utils';
import { ButtonIcon } from './button-icon';

export interface PageHeaderPager {
  /** Figma Pager label: "3 of 24". */
  label: string;
  /** Names of the buttons: "Previous invoice", "Next invoice". */
  previousLabel: string;
  nextLabel: string;
  onPrevious?: () => void;
  onNext?: () => void;
  /** Disable at the ends of the list. */
  hasPrevious?: boolean;
  hasNext?: boolean;
}

export interface PageHeaderProps extends Omit<React.ComponentProps<'div'>, 'title'> {
  /** Figma Title: matches the last Breadcrumb item. */
  title: React.ReactNode;
  /** Figma Description (Show description): one sentence. */
  description?: React.ReactNode;
  /** Heading level of the title. Default h1. */
  as?: 'h1' | 'h2' | 'h3';
  /** Figma Actions slot (Show actions): page actions, primary last. Leave out when there are none. */
  actions?: React.ReactNode;
  /** Figma Show back link: a BackLink ("All invoices") that names the list. */
  backLink?: React.ReactNode;
  /** Figma Show badge: one status Badge at the start of the meta line. */
  badge?: React.ReactNode;
  /** Figma Meta slot (Show meta): 2 to 4 Meta Items. */
  meta?: React.ReactNode;
  /** Figma Show pager. */
  pager?: PageHeaderPager;
}

function PageHeader({ title, description, as: Heading = 'h1', actions, backLink, badge, meta, pager, className, ...props }: PageHeaderProps) {
  const badgeId = React.useId();
  const showMeta = badge != null || meta != null;
  return (
    <div data-slot="page-header" className={cn('flex w-full min-w-0 flex-wrap items-end gap-x-4 gap-y-3', className)} {...props}>
      <div data-slot="page-header-text" className="flex min-w-60 flex-1 flex-col items-start gap-1">
        {backLink ?? null}
        <Heading
          data-slot="page-header-title"
          aria-describedby={badge != null ? badgeId : undefined}
          className="m-0 line-clamp-2 w-full text-2xl leading-8 font-semibold tracking-tight text-foreground [overflow-wrap:anywhere]"
        >
          {title}
        </Heading>
        {description ? (
          <p data-slot="page-header-description" className="m-0 line-clamp-2 w-full text-sm leading-5 text-muted-foreground">{description}</p>
        ) : null}
        {showMeta ? (
          <div data-slot="page-header-meta" className="flex w-full min-w-0 items-center gap-3">
            {badge != null ? <span id={badgeId} className="flex shrink-0">{badge}</span> : null}
            {meta != null ? <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-4 gap-y-1">{meta}</div> : null}
          </div>
        ) : null}
      </div>
      {pager ? (
        <div data-slot="page-header-pager" className="flex h-[var(--control-height)] shrink-0 items-center gap-2">
          <span className="text-sm leading-5 whitespace-nowrap text-muted-foreground">{pager.label}</span>
          <div className="flex items-center gap-1">
            <ButtonIcon variant="outline" size="sm" icon={<ChevronLeft />} label={pager.previousLabel} disabled={pager.hasPrevious === false} onClick={pager.onPrevious} />
            <ButtonIcon variant="outline" size="sm" icon={<ChevronRight />} label={pager.nextLabel} disabled={pager.hasNext === false} onClick={pager.onNext} />
          </div>
        </div>
      ) : null}
      {actions ? <div data-slot="page-header-actions" className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export { PageHeader };
