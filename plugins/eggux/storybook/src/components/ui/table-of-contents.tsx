// EGG UI Table of Contents. Figma: Table of Contents (Navigation page, "Table of Contents /
// Component"), built from Table of Contents Item. On-page navigation for long articles and docs:
// <nav> named by its Title ("On this page", ui/overline foreground/muted, up to 2 lines), 12 px
// (spacing/3) above a list of items. Scroll spy: the item of the heading at the top of the
// scrolling area (window or `scrollContainer`) is active (aria-current="true"). Clicking scrolls
// the heading to `offset` px below the top (room for a sticky header) and moves focus to it.
// Sticky on the right from 1280 wide is the page layout's job (`hidden xl:block sticky top-20`).
import * as React from 'react';
import { cn } from '@/lib/utils';
import { TableOfContentsItem } from './table-of-contents-item';

export interface TableOfContentsEntry {
  /** id of the heading the item links to. */
  id: string;
  /** Text of the item; matches the heading. */
  label: React.ReactNode;
  /** Figma Level: 1 for an h2, 2 for an h3. */
  level?: 1 | 2;
}

export interface TableOfContentsProps extends Omit<React.ComponentProps<'nav'>, 'title'> {
  /** Figma Title: "On this page"; another name for lists of other pages ("Other policies"). */
  title?: React.ReactNode;
  /** The headings, in page order. Leave out to compose TableOfContentsItem children yourself. */
  items?: TableOfContentsEntry[];
  /** Active heading id when you track it yourself; leave out to let the scroll spy decide. */
  activeId?: string;
  /** Called when the active heading changes (scroll or click). */
  onActiveChange?: (id: string) => void;
  /** The element that scrolls the headings; the window when left out. */
  scrollContainer?: React.RefObject<HTMLElement | null>;
  /** Space kept above a heading for sticky headers, in px. Default 80. */
  offset?: number;
}

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

function TableOfContents({ title = 'On this page', items, activeId: activeProp, onActiveChange, scrollContainer, offset = 80, className, children, ...props }: TableOfContentsProps) {
  const titleId = React.useId();
  const [spied, setSpied] = React.useState<string | undefined>(items?.[0]?.id);
  const activeId = activeProp ?? spied;
  const onChange = React.useRef(onActiveChange);
  onChange.current = onActiveChange;
  const ids = React.useMemo(() => (items ?? []).map(item => item.id), [items]);
  const idsKey = ids.join('\u0000');

  const setActive = React.useCallback((id: string) => {
    setSpied(prev => {
      if (prev !== id) onChange.current?.(id);
      return id;
    });
  }, []);

  // Scroll spy: the last heading whose top has passed the offset line; the last one at the bottom.
  React.useEffect(() => {
    if (!ids.length) return;
    const container = scrollContainer?.current ?? null;
    const target: HTMLElement | Window = container ?? window;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const top = container ? container.getBoundingClientRect().top : 0;
      const atBottom = container
        ? container.scrollTop + container.clientHeight >= container.scrollHeight - 1
        : window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 1;
      const atTop = container ? container.scrollTop <= 0 : window.scrollY <= 0;
      let current = ids[0];
      if (atBottom && !atTop) current = ids[ids.length - 1];
      else {
        for (const id of ids) {
          const el = document.getElementById(id);
          if (el && el.getBoundingClientRect().top - top <= offset + 1) current = id;
        }
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    target.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      target.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey, offset, scrollContainer, setActive]);

  const jump = (id: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    const heading = document.getElementById(id);
    if (!heading || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    event.preventDefault();
    const container = scrollContainer?.current ?? null;
    const behavior: ScrollBehavior = prefersReducedMotion() ? 'auto' : 'smooth';
    if (container) {
      const y = heading.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop - offset;
      container.scrollTo({ top: y, behavior });
    } else {
      window.scrollTo({ top: heading.getBoundingClientRect().top + window.scrollY - offset, behavior });
    }
    if (!heading.hasAttribute('tabindex')) heading.setAttribute('tabindex', '-1');
    heading.focus({ preventScroll: true });
    try {
      history.replaceState(history.state, '', `${location.pathname}${location.search}#${id}`);
    } catch {
      // Sandboxed frames may refuse; the jump still works.
    }
    setActive(id);
  };

  return (
    <nav data-slot="table-of-contents" aria-labelledby={titleId} className={cn('flex w-full min-w-0 flex-col gap-3', className)} {...props}>
      <p id={titleId} data-slot="table-of-contents-title" className="m-0 line-clamp-2 text-xs leading-4 font-semibold tracking-widest text-muted-foreground uppercase">
        {title}
      </p>
      {items ? (
        <TableOfContentsList>
          {items.map(item => (
            <TableOfContentsItem key={item.id} href={`#${item.id}`} level={item.level ?? 1} active={item.id === activeId} onClick={jump(item.id)}>
              {item.label}
            </TableOfContentsItem>
          ))}
        </TableOfContentsList>
      ) : (
        children
      )}
    </nav>
  );
}

/** Figma Items slot: the list of Table of Contents Items. */
function TableOfContentsList({ className, ...props }: React.ComponentProps<'ul'>) {
  return <ul data-slot="table-of-contents-list" className={cn('m-0 flex list-none flex-col p-0', className)} {...props} />;
}

export { TableOfContents, TableOfContentsList, TableOfContentsItem };
