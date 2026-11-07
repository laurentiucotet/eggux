// EGG UI Section Heading. Figma: Section Heading (Section Heading page, "Section Heading /
// Component", 405:841). Size (lg, default, sm), Show overline, Show icon, Show description, Show
// actions. Title and description that open a section of an app or content page, or a group inside
// a card or form, with one row of actions on the right.
// lg: h2 (30/36), body/lead description (20/28), 12 gap, actions aligned to the bottom; default:
// h3 (24/32); sm: h4 (20/28); default and sm use body/small and 4 gap, actions centered. Overline
// ui/overline muted; icon 24 (lg) or 20 before the title. The text column fills (min 192) and the
// row wraps, so in narrow columns the actions drop under the text; title 2 lines, description 3.
// A11y: a real heading at the given level; actions follow it in tab order; the icon is decorative.
// A div, not <header>: a top-level <header> is a banner landmark.
import * as React from 'react';
import { cn } from '@/lib/utils';

export type SectionHeadingSize = 'lg' | 'default' | 'sm';

export interface SectionHeadingProps extends Omit<React.ComponentProps<'div'>, 'title'> {
  title: React.ReactNode;
  description?: React.ReactNode;
  overline?: React.ReactNode;
  icon?: React.ReactNode;
  /** Figma Actions slot: up to two Buttons, a search Input or a Toggle Group. */
  actions?: React.ReactNode;
  size?: SectionHeadingSize;
  /** Heading level; defaults to 2 / 3 / 4 for lg / default / sm. */
  level?: 2 | 3 | 4 | 5 | 6;
}

const levels: Record<SectionHeadingSize, 2 | 3 | 4> = { lg: 2, default: 3, sm: 4 };

function SectionHeading({ title, description, overline, icon, actions, size = 'default', level, className, ...props }: SectionHeadingProps) {
  const Heading = `h${level ?? levels[size]}` as 'h2';
  const lg = size === 'lg';
  return (
    <div
      data-slot="section-heading"
      data-size={size}
      className={cn('flex min-w-0 flex-wrap gap-x-4 gap-y-3', lg ? 'items-end' : 'items-center', className)}
      {...props}
    >
      <div className={cn('flex min-w-48 flex-1 flex-col', lg ? 'gap-3' : 'gap-1')}>
        {overline ? <p className="m-0 text-xs leading-4 font-semibold tracking-widest text-muted-foreground uppercase">{overline}</p> : null}
        <div className={cn('flex min-w-0 items-center', lg ? 'gap-3' : 'gap-2')}>
          {icon ? <span aria-hidden="true" className={cn('flex shrink-0 text-foreground', lg ? '[&_svg]:size-6' : '[&_svg]:size-5')}>{icon}</span> : null}
          <Heading
            className={cn(
              'm-0 line-clamp-2 min-w-0 flex-1 font-semibold tracking-tight text-foreground [overflow-wrap:anywhere]',
              lg ? 'text-3xl leading-9' : size === 'sm' ? 'text-xl leading-7' : 'text-2xl leading-8',
            )}
          >
            {title}
          </Heading>
        </div>
        {description ? (
          <p className={cn('m-0 line-clamp-3 text-muted-foreground [overflow-wrap:anywhere]', lg ? 'text-xl leading-7' : 'text-sm leading-5')}>{description}</p>
        ) : null}
      </div>
      {actions ? <div data-slot="section-heading-actions" className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export { SectionHeading };
