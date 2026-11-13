// EGG UI Logo Cloud. Code only (no Figma component yet); family Marketing.
// "Trusted by" strip: a heading and a grid (or one wrapping row) of customer logos. Logos are drawn
// text marks (a small geometric glyph plus the name in one of five type treatments), so no image is
// loaded; real products replace the marks with their own SVG. Tone grayscale (muted, default) or
// brand (the brand text color). A logo can link to its customer story.
// A11y: a labelled region holding a list; every logo is a list item whose name is the company name
// (the glyph is decorative); linked logos are real links with a visible focus ring. Names truncate
// at 276 px and the grid reflows through auto-fit columns, no horizontal scroll.
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface LogoCloudItem {
  /** Company name, also the accessible name. */
  name: string;
  /** Optional customer story link. */
  href?: string;
}

export interface LogoCloudProps extends Omit<React.ComponentProps<'section'>, 'title'> {
  /** Heading above the logos. */
  heading?: string;
  logos: LogoCloudItem[];
  /** grid: equal cells; row: one centered wrapping row. */
  layout?: 'grid' | 'row';
  /** grayscale: muted marks; brand: the brand text color. */
  tone?: 'grayscale' | 'brand';
  headingLevel?: 2 | 3 | 4;
}

function Glyph({ index }: { index: number }) {
  const shape = index % 5;
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="size-5 shrink-0 fill-current">
      {shape === 0 ? <circle cx="10" cy="10" r="9" /> : null}
      {shape === 1 ? <rect x="2" y="2" width="16" height="16" rx="3" /> : null}
      {shape === 2 ? <path d="M10 1.5 19 18H1z" /> : null}
      {shape === 3 ? <path d="M10 1 19 10 10 19 1 10z" /> : null}
      {shape === 4 ? <path d="M2 3h4v14H2zM8 3h4v14H8zM14 3h4v14h-4z" /> : null}
    </svg>
  );
}

// Five type treatments; class names written out in full so Tailwind generates them.
const treatments = [
  'text-lg font-semibold tracking-tight',
  'text-sm font-bold uppercase tracking-[0.18em]',
  'text-xl font-extrabold tracking-tighter',
  'text-lg font-light tracking-wide',
  'text-lg font-semibold italic',
];

function LogoCloud({ heading = 'Trusted by finance teams at', logos, layout = 'grid', tone = 'grayscale', headingLevel = 2, className, ...props }: LogoCloudProps) {
  const headingId = React.useId();
  const Heading = `h${headingLevel}` as 'h2' | 'h3' | 'h4';
  return (
    <section
      data-slot="logo-cloud"
      data-layout={layout}
      data-tone={tone}
      aria-labelledby={heading ? headingId : undefined}
      className={cn('flex w-full min-w-0 flex-col items-center gap-6', className)}
      {...props}
    >
      {heading ? <Heading id={headingId} className="m-0 text-center text-sm leading-5 font-medium text-muted-foreground">{heading}</Heading> : null}
      <ul
        className={cn(
          'm-0 w-full list-none p-0',
          layout === 'grid'
            ? 'grid grid-cols-[repeat(auto-fit,minmax(min(100%,8.5rem),1fr))] items-center gap-x-6 gap-y-6'
            : 'flex flex-wrap items-center justify-center gap-x-10 gap-y-5',
        )}
      >
        {logos.map((logo, i) => {
          const mark = (
            <>
              <Glyph index={i} />
              <span className={cn('min-w-0 truncate', treatments[i % treatments.length])}>{logo.name}</span>
            </>
          );
          const base = cn('flex h-10 min-w-0 items-center gap-2', layout === 'grid' && 'justify-center', tone === 'brand' ? 'text-brand' : 'text-muted-foreground');
          return (
            <li key={logo.name} className="flex min-w-0 justify-center">
              {logo.href ? (
                <a href={logo.href} className={cn(base, 'max-w-full rounded-md px-2 no-underline outline-none transition-colors duration-[var(--duration-fast)] hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50')}>
                  {mark}
                </a>
              ) : (
                <span className={cn(base, 'max-w-full px-2')}>{mark}</span>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export { LogoCloud };
