// EGG UI Form Section Progress. Code only (no Figma component yet); family Wizard.
// A sticky side list of the sections of a long form. Each row is a jump link with the section title and a
// completion count ("3 of 5"); a section that is finished says "Complete". The row of the section that is in
// view has aria-current="location". Pass `activeId` to control it, or set `track` to follow the page with an
// IntersectionObserver on the elements whose id is the section id.
// A11y: a nav named "Form sections" with a list of real links (href="#id", so middle click and copy link
// work); a click scrolls to the section and moves focus to it; the count is text, the check icon is
// decorative; no motion when the person prefers reduced motion. Long titles wrap.
import * as React from 'react';
import { Check } from '@/components/icons';
import { cn } from '@/lib/utils';

export interface FormSectionProgressItem {
  id: string;
  title: string;
  /** Fields answered in this section. */
  completed: number;
  /** Fields in this section. */
  total: number;
}

export interface FormSectionProgressProps extends Omit<React.ComponentProps<'nav'>, 'children'> {
  sections: FormSectionProgressItem[];
  /** The section in view. Controlled; leave out to let the component keep it. */
  activeId?: string;
  defaultActiveId?: string;
  onActiveChange?: (id: string) => void;
  /** Called after a jump link is used. */
  onJump?: (id: string) => void;
  /** Follow the page: the section nearest the top of the viewport becomes active. */
  track?: boolean;
  /** Sticks to the top of its scroll parent while the form scrolls. */
  sticky?: boolean;
  heading?: string;
}

function FormSectionProgress({
  sections,
  activeId: activeProp,
  defaultActiveId,
  onActiveChange,
  onJump,
  track = false,
  sticky = true,
  heading = 'Form sections',
  className,
  ...props
}: FormSectionProgressProps) {
  const [inner, setInner] = React.useState(defaultActiveId ?? sections[0]?.id);
  const active = activeProp ?? inner;
  const headingId = React.useId();
  const setActive = React.useCallback(
    (id: string) => {
      if (activeProp === undefined) setInner(id);
      onActiveChange?.(id);
    },
    [activeProp, onActiveChange],
  );

  React.useEffect(() => {
    if (!track || typeof IntersectionObserver === 'undefined') return;
    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      entries => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target.id);
          else visible.delete(e.target.id);
        }
        const first = sections.find(s => visible.has(s.id));
        if (first) setActive(first.id);
      },
      { rootMargin: '0px 0px -60% 0px' },
    );
    for (const s of sections) {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [track, sections, setActive]);

  const jump = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const target = document.getElementById(id);
    if (target) {
      event.preventDefault();
      const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      target.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' });
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
    setActive(id);
    onJump?.(id);
  };

  return (
    <nav
      data-slot="form-section-progress"
      aria-labelledby={headingId}
      className={cn('w-full min-w-0 max-w-[280px]', sticky && 'sticky top-4 self-start', className)}
      {...props}
    >
      <p id={headingId} className="m-0 px-2 pb-2 text-xs font-medium uppercase leading-4 tracking-wide text-muted-foreground">{heading}</p>
      <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
        {sections.map(section => {
          const complete = section.total > 0 && section.completed >= section.total;
          const isActive = section.id === active;
          return (
            <li key={section.id} data-complete={complete || undefined}>
              <a
                href={`#${section.id}`}
                aria-current={isActive ? 'location' : undefined}
                onClick={e => jump(e, section.id)}
                className={cn(
                  'flex min-w-0 items-start justify-between gap-3 rounded-md px-2 py-2 text-sm leading-5 no-underline outline-none transition-colors duration-[var(--duration-fast)] hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none',
                  isActive ? 'bg-accent font-medium text-accent-foreground' : 'text-foreground',
                )}
              >
                <span className="min-w-0 flex-1 [overflow-wrap:anywhere]">
                  {section.title}
                  {isActive ? <span className="sr-only"> (you are here)</span> : null}
                </span>
                <span className={cn('flex shrink-0 items-center gap-1 text-xs leading-5 tabular-nums', isActive ? 'text-accent-foreground' : 'text-muted-foreground')}>
                  {complete ? <Check aria-hidden="true" className="size-3.5 text-success" /> : null}
                  {complete ? 'Complete' : `${section.completed} of ${section.total}`}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export { FormSectionProgress };
