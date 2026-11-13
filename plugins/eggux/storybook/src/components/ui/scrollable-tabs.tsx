// EGG UI Scrollable Tabs. Code only (no Figma component yet); the tabs themselves are Tabs and Tab
// (Tabs page). ScrollableTabsList replaces TabsList when there are too many tabs for the width and
// a "More" menu is not wanted (a category strip, a long settings list): the tabs stay on one line
// and scroll sideways. Fade edges show that more is hidden, Previous and Next buttons appear only
// on the side that has more, the active tab is scrolled into view whenever it changes, and the
// arrow keys, Home and End move between tabs like in Tabs (roving focus, Radix). Scrolling is
// smooth, instant under prefers-reduced-motion. Use inside <Tabs variant="line"> or "pills";
// ScrollableTabs is Tabs with variant line as the default. The list needs an aria-label.
import * as React from 'react';
import { Tabs as TabsPrimitive } from 'radix-ui';
import { ChevronLeft, ChevronRight } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Tabs, type TabsProps } from './tabs';

function ScrollableTabs({ variant = 'line', ...props }: TabsProps) {
  return <Tabs variant={variant} {...props} />;
}

export interface ScrollableTabsListProps extends React.ComponentProps<typeof TabsPrimitive.List> {
  /** Accessible name of the Previous button. */
  previousLabel?: string;
  /** Accessible name of the Next button. */
  nextLabel?: string;
  /** Gap between tabs, in the same steps as Tabs: sm 8 px, md 16 px. */
  gap?: 'sm' | 'md';
  /** A baseline under the tabs (variant line). */
  bordered?: boolean;
}

const EDGE = 2;

function ScrollableTabsList({ previousLabel = 'Scroll tabs left', nextLabel = 'Scroll tabs right', gap = 'sm', bordered = false, className, children, ...props }: ScrollableTabsListProps) {
  const scroller = React.useRef<HTMLDivElement>(null);
  const [edges, setEdges] = React.useState({ start: false, end: false });

  const motion = (): ScrollBehavior => (window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth');

  const measure = React.useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    const start = el.scrollLeft > EDGE;
    const end = el.scrollLeft + el.clientWidth < el.scrollWidth - EDGE;
    setEdges(prev => (prev.start === start && prev.end === end ? prev : { start, end }));
  }, []);

  const reveal = React.useCallback(
    (behavior: ScrollBehavior) => {
      const el = scroller.current;
      const active = el?.querySelector<HTMLElement>('[role="tab"][data-state="active"]');
      if (!el || !active) return;
      const box = el.getBoundingClientRect();
      const tab = active.getBoundingClientRect();
      // Keep a little of the next tab in view, behind the fade.
      const pad = 40;
      if (tab.left < box.left + pad) el.scrollTo({ left: el.scrollLeft + tab.left - box.left - pad, behavior });
      else if (tab.right > box.right - pad) el.scrollTo({ left: el.scrollLeft + tab.right - box.right + pad, behavior });
    },
    [],
  );

  React.useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    measure();
    reveal('auto');
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    if (el.firstElementChild) ro.observe(el.firstElementChild);
    // The active tab changes by click, arrow key or from outside: follow it.
    const mo = new MutationObserver(() => reveal(motion()));
    mo.observe(el, { attributes: true, attributeFilter: ['data-state'], subtree: true });
    return () => {
      ro.disconnect();
      mo.disconnect();
    };
  }, [measure, reveal]);

  const page = (dir: -1 | 1) => {
    const el = scroller.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.75, behavior: motion() });
  };

  const arrow =
    'absolute top-1/2 z-10 inline-flex size-7 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm outline-none transition-colors hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50 [&_svg]:size-4 [&_svg]:shrink-0';

  return (
    <div data-slot="scrollable-tabs" data-start={edges.start} data-end={edges.end} className={cn('relative min-w-0 max-w-full', bordered && 'border-b border-border', className)}>
      {edges.start ? (
        <button type="button" data-slot="scrollable-tabs-previous" aria-label={previousLabel} onClick={() => page(-1)} className={cn(arrow, 'left-0')}>
          <ChevronLeft aria-hidden="true" />
        </button>
      ) : null}
      <div
        ref={scroller}
        onScroll={measure}
        data-slot="scrollable-tabs-scroller"
        className={cn(
          'min-w-0 overflow-x-auto overflow-y-hidden px-1 pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
          bordered ? 'pb-0' : 'pb-1',
          edges.start && edges.end && '[mask-image:linear-gradient(to_right,transparent,black_44px,black_calc(100%-44px),transparent)]',
          edges.start && !edges.end && '[mask-image:linear-gradient(to_right,transparent,black_44px)]',
          !edges.start && edges.end && '[mask-image:linear-gradient(to_left,transparent,black_44px)]',
        )}
      >
        <TabsPrimitive.List
          data-slot="scrollable-tabs-list"
          className={cn('flex w-max min-w-full items-center', gap === 'sm' ? 'gap-2' : 'gap-4')}
          {...props}
        >
          {children}
        </TabsPrimitive.List>
      </div>
      {edges.end ? (
        <button type="button" data-slot="scrollable-tabs-next" aria-label={nextLabel} onClick={() => page(1)} className={cn(arrow, 'right-0')}>
          <ChevronRight aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}

export { ScrollableTabs, ScrollableTabsList };
