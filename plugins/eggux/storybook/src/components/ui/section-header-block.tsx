// EGG UI Section Header. Figma: BLOCKS / Sections, "Section Header" (73:11), Align (center, left),
// Show overline, Show description. The heading that opens every marketing section (Features, Stats,
// CTA, Pricing...): overline ui/overline in foreground/brand, title heading/h2 (30/36, semibold,
// tight), description body/lead (20/28, muted); vertical, 12 apart, 768 wide (layout/container/3xl).
// Center: the column sits in the middle and the text is centered; left: aligned to the start.
// Not the library Section Heading (app sections: muted overline, row with actions, no centering).
// A11y: the title is a real heading, h2 by default (a section inside a page with one h1); pass
// `id` + `titleId` to name the section with aria-labelledby. A div, not <header>.
import * as React from 'react';
import { cn } from '@/lib/utils';

export type SectionHeaderAlign = 'center' | 'left';

export interface SectionHeaderProps extends Omit<React.ComponentProps<'div'>, 'title'> {
  title: React.ReactNode;
  /** Figma Show overline + Overline. Short, upper case by style ("FEATURES"). */
  overline?: React.ReactNode;
  /** Figma Show description + Description. One or two sentences. */
  description?: React.ReactNode;
  /** Figma Align. Default center. */
  align?: SectionHeaderAlign;
  /** Heading level. Default 2. */
  level?: 2 | 3 | 4;
  /** Id for the heading, so the section can use aria-labelledby. */
  titleId?: string;
}

function SectionHeader({ title, overline, description, align = 'center', level = 2, titleId, className, ...props }: SectionHeaderProps) {
  const Heading = `h${level}` as 'h2';
  const center = align === 'center';
  return (
    <div
      data-slot="section-header"
      data-align={align}
      className={cn('flex w-full max-w-3xl min-w-0 flex-col gap-3', center ? 'mx-auto items-center text-center' : 'items-start text-left', className)}
      {...props}
    >
      {overline ? <p className="m-0 text-xs leading-4 font-semibold tracking-widest text-brand uppercase">{overline}</p> : null}
      <Heading id={titleId} className={cn('m-0 w-full text-3xl leading-9 font-semibold tracking-tight text-foreground [overflow-wrap:anywhere]', center && 'text-balance')}>
        {title}
      </Heading>
      {description ? <p className="m-0 w-full text-xl leading-7 text-pretty text-muted-foreground [overflow-wrap:anywhere]">{description}</p> : null}
    </div>
  );
}

export { SectionHeader };
