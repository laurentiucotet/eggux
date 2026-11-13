// EGG UI Back To Top. Code only (no Figma component yet). A round icon button that appears once the
// page (or a scroll area) has moved more than `threshold` px and scrolls back to the top. Smooth
// scroll, instant when the user prefers reduced motion. Placement: `fixed` pins it to the window
// corner (page level); without it, it sticks to the bottom corner of the scroll area it sits in as
// the last child (a long panel, a table, a drawer). `target` is the scrolling element, the window
// by default. While hidden it is invisible and out of the tab order. After the jump, focus goes to
// the scroll area so the next Tab starts at the top. Not for short pages (under three screens).
import * as React from 'react';
import { ArrowUp } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button } from './button';

export type BackToTopPosition = 'right' | 'left' | 'center';

export interface BackToTopProps extends Omit<React.ComponentProps<'button'>, 'children'> {
  /** Pin to the window corner (position fixed). Off: sticks inside the scroll area it is placed in. */
  fixed?: boolean;
  /** The scrolling element. Default: the window. Pass an element (state, not a ref) for a scroll area. */
  target?: HTMLElement | null;
  /** Scroll distance in px after which the button appears. */
  threshold?: number;
  /** Which bottom corner. */
  position?: BackToTopPosition;
  /** Accessible name and tooltip. */
  label?: string;
  /** Show the label next to the arrow (a pill) instead of the arrow only. */
  showLabel?: boolean;
}

const place: Record<BackToTopPosition, string> = {
  right: 'right-4',
  left: 'left-4',
  center: 'left-1/2 -translate-x-1/2',
};

function BackToTop({ fixed = false, target, threshold = 200, position = 'right', label = 'Back to top', showLabel = false, className, onClick, ...props }: BackToTopProps) {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const scroller: HTMLElement | Window = target ?? window;
    const read = () => setVisible((target ? target.scrollTop : window.scrollY) > threshold);
    read();
    scroller.addEventListener('scroll', read, { passive: true });
    return () => scroller.removeEventListener('scroll', read);
  }, [target, threshold]);

  const toTop = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const behavior: ScrollBehavior = reduced ? 'auto' : 'smooth';
    if (target) {
      target.scrollTo({ top: 0, behavior });
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    } else {
      window.scrollTo({ top: 0, behavior });
    }
  };

  const button = (
    <Button
      type="button"
      data-slot="back-to-top"
      data-visible={visible}
      variant="secondary"
      size={showLabel ? 'default' : 'icon'}
      aria-label={label}
      title={label}
      tabIndex={visible ? undefined : -1}
      onClick={toTop}
      className={cn(
        'max-w-[calc(100%-2rem)] min-w-0 rounded-full border border-border shadow-md transition-[opacity,transform,visibility] duration-[var(--duration-normal)] motion-reduce:transition-none',
        visible ? 'visible translate-y-0 opacity-100' : 'invisible translate-y-2 opacity-0',
        fixed ? cn('fixed bottom-4 z-40', place[position]) : cn('absolute bottom-4 z-10', place[position]),
        className,
      )}
      {...props}
    >
      <ArrowUp aria-hidden="true" />
      {showLabel ? <span className="min-w-0 truncate">{label}</span> : null}
    </Button>
  );

  if (fixed) return button;
  // In a scroll area: a zero-height sticky anchor at the bottom edge carries the button.
  return (
    <div data-slot="back-to-top-anchor" className="pointer-events-none sticky bottom-0 h-0 w-full">
      <div className="pointer-events-auto contents">{button}</div>
    </div>
  );
}

export { BackToTop };
