// EGG UI Show More. Figma: Show More (Accordion page). State (collapsed, expanded). A long text
// cut to 3 lines with a Button link toggle. The full text stays in the DOM (line-clamp), so
// screen readers reach it; the toggle shows only when the text is longer than 3 lines.
import * as React from 'react';
import { ChevronDown } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button } from './button';

export interface ShowMoreProps extends React.ComponentProps<'div'> {
  /** Figma State=expanded when true (controlled). */
  expanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  /** Toggle labels. */
  moreLabel?: string;
  lessLabel?: string;
}

function ShowMore({ expanded: expandedProp, defaultExpanded = false, onExpandedChange, moreLabel = 'Show more', lessLabel = 'Show less', className, children, ...props }: ShowMoreProps) {
  const [inner, setInner] = React.useState(defaultExpanded);
  const expanded = expandedProp ?? inner;
  const textId = React.useId();
  const textRef = React.useRef<HTMLDivElement>(null);
  const toggleRef = React.useRef<HTMLButtonElement>(null);
  const [overflows, setOverflows] = React.useState(true);

  // Show the toggle only when the text is longer than 3 lines (measured with the clamp on).
  React.useLayoutEffect(() => {
    const el = textRef.current;
    if (!el) return;
    const measure = () => {
      if (expanded) return;
      setOverflows(el.scrollHeight > el.clientHeight + 1);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [expanded, children]);

  const toggle = () => {
    const next = !expanded;
    if (expandedProp === undefined) setInner(next);
    onExpandedChange?.(next);
    // Show less: keep the toggle where the reader is instead of jumping down the page.
    if (!next) requestAnimationFrame(() => toggleRef.current?.scrollIntoView({ block: 'nearest' }));
  };

  return (
    <div data-slot="show-more" data-state={expanded ? 'expanded' : 'collapsed'} className={cn('flex w-full flex-col items-start gap-2', className)} {...props}>
      <div ref={textRef} id={textId} className={cn('w-full text-base leading-7 text-foreground [overflow-wrap:break-word]', !expanded && 'line-clamp-3')}>
        {children}
      </div>
      {overflows || expanded ? (
        <Button
          ref={toggleRef}
          variant="link"
          size="sm"
          className="h-8"
          aria-expanded={expanded}
          aria-controls={textId}
          trailingIcon={<ChevronDown aria-hidden="true" className={cn('transition-transform duration-[var(--duration-fast)] motion-reduce:transition-none', expanded && 'rotate-180')} />}
          onClick={toggle}
        >
          {expanded ? lessLabel : moreLabel}
        </Button>
      ) : null}
    </div>
  );
}

export { ShowMore };
