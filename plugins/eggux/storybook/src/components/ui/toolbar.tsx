// EGG UI Toolbar. Figma: Toolbar (Toolbar page, "Toolbar / Component", 1092:82017). Orientation
// (horizontal, vertical), Style (default, floating), Show overflow. A row or column of related sm
// controls in groups (Toggle sm, Button Icon ghost sm, Button ghost sm, Select sm) with a Separator
// between groups (24 long, 4 px each side) and an overflow Button Icon ("More") that opens a Menu.
// 4 px padding, 2 px gap. default has no surface (the parent draws the border); floating is a
// popover surface (border, radius lg, shadow md) over a canvas.
// WAI-ARIA toolbar: role="toolbar" with a name and aria-orientation; one Tab stop (roving
// tabindex), arrows move between items, Home / End jump.
// Groups (ToolbarGroup) move into the overflow menu from the end when the row runs out of space;
// each group passes the menu items that stand for it (`menu`). `overflow` adds items that always
// live in the menu. Hidden groups are display:none, so arrows and Tab skip them.
import * as React from 'react';
import { Ellipsis } from '@/components/icons';
import { cn } from '@/lib/utils';
import { ButtonIcon } from './button-icon';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from './dropdown-menu';

const ITEMS = 'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), [role="combobox"]';

export interface ToolbarGroupProps extends React.ComponentProps<'div'> {
  /** DropdownMenuItems shown in the overflow menu while the group does not fit. */
  menu?: React.ReactNode;
}

/** A group of related controls; a separator is drawn before every group after the first. */
function ToolbarGroup({ menu: _menu, className, children, ...props }: ToolbarGroupProps) {
  return (
    <div data-slot="toolbar-group" role="group" className={cn('flex shrink-0 items-center gap-0.5 group-data-[orientation=vertical]/toolbar:flex-col', className)} {...props}>
      <span aria-hidden="true" data-slot="toolbar-group-separator" className="flex h-6 shrink-0 px-1 [[data-slot=toolbar-group]:first-child>&]:hidden group-data-[orientation=vertical]/toolbar:h-auto group-data-[orientation=vertical]/toolbar:w-8 group-data-[orientation=vertical]/toolbar:px-0 group-data-[orientation=vertical]/toolbar:py-1"><span className="h-full w-px bg-border group-data-[orientation=vertical]/toolbar:h-px group-data-[orientation=vertical]/toolbar:w-full" /></span>
      {children}
    </div>
  );
}

export interface ToolbarProps extends React.ComponentProps<'div'> {
  'aria-label': string;
  orientation?: 'horizontal' | 'vertical';
  toolbarStyle?: 'default' | 'floating';
  /** Figma Show overflow: DropdownMenuItems for what does not fit. */
  overflow?: React.ReactNode;
  overflowLabel?: string;
}

function Toolbar({ orientation = 'horizontal', toolbarStyle = 'default', overflow, overflowLabel = 'More', className, children, onKeyDown, onFocus, ...props }: ToolbarProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const activeRef = React.useRef(0);
  const vertical = orientation === 'vertical';
  const items = () => Array.from(ref.current?.querySelectorAll<HTMLElement>(ITEMS) ?? []).filter(el => el.getClientRects().length > 0);
  // Collapsing groups: measure each group once while visible, then hide from the end.
  const groups = React.Children.toArray(children).filter((c): c is React.ReactElement<ToolbarGroupProps> => React.isValidElement(c) && c.type === ToolbarGroup);
  const [hidden, setHidden] = React.useState(0);
  const widths = React.useRef<number[]>([]);
  React.useLayoutEffect(() => {
    const root = ref.current;
    if (!root || !groups.length || vertical) return;
    const measure = () => {
      const els = Array.from(root.querySelectorAll<HTMLElement>('[data-slot="toolbar-items"] > [data-slot="toolbar-group"]'));
      els.forEach((el, i) => { if (el.style.display !== 'none') widths.current[i] = el.offsetWidth; });
      const other = Array.from(root.querySelectorAll<HTMLElement>('[data-slot="toolbar-items"] > :not([data-slot="toolbar-group"])')).reduce((w, el) => w + el.offsetWidth, 0);
      const avail = root.clientWidth - 8 - 32 - other; // padding and the More button
      const total = widths.current.reduce((a, b) => a + b, 0);
      let n = 0;
      if (total > root.clientWidth - 8 - other) {
        let w = total;
        while (n < els.length && w > avail) { w -= widths.current[els.length - 1 - n] ?? 0; n++; }
      }
      setHidden(h => (h === n ? h : n));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    return () => ro.disconnect();
  }, [groups.length, vertical]);
  const hiddenMenus = groups.slice(groups.length - hidden).map((g, i) => <React.Fragment key={i}>{g.props.menu}</React.Fragment>);
  const menu = hidden || overflow ? <>{hiddenMenus}{overflow}</> : null;
  let gi = 0;
  const content = React.Children.map(children, c => {
    if (!(React.isValidElement(c) && c.type === ToolbarGroup)) return c;
    const i = gi++;
    return i >= groups.length - hidden ? React.cloneElement(c as React.ReactElement<ToolbarGroupProps>, { style: { ...(c.props as ToolbarGroupProps).style, display: 'none' }, 'aria-hidden': true } as Partial<ToolbarGroupProps>) : c;
  });
  React.useLayoutEffect(() => {
    const list = items();
    if (activeRef.current >= list.length) activeRef.current = 0;
    list.forEach((el, i) => { el.tabIndex = i === activeRef.current ? 0 : -1; });
  });
  const focusAt = (i: number) => {
    const list = items();
    if (!list.length) return;
    const n = (i + list.length) % list.length;
    activeRef.current = n;
    list.forEach((el, j) => { el.tabIndex = j === n ? 0 : -1; });
    list[n]!.focus();
  };
  return (
    <div
      ref={ref}
      data-slot="toolbar"
      data-style={toolbarStyle}
      data-orientation={orientation}
      role="toolbar"
      aria-orientation={orientation}
      className={cn(
        // No gap between the items and the overflow button (Figma 298 = 4 + 258 + 32 + 4).
        'group/toolbar flex min-w-0 justify-between p-1',
        vertical ? 'w-max flex-col items-center' : 'items-center',
        toolbarStyle === 'floating' && 'rounded-lg border border-border bg-popover text-popover-foreground shadow-md',
        className,
      )}
      onFocus={e => {
        const i = items().indexOf(e.target as HTMLElement);
        if (i >= 0) activeRef.current = i;
        onFocus?.(e);
      }}
      onKeyDown={e => {
        onKeyDown?.(e);
        if (e.defaultPrevented) return;
        const next = vertical ? 'ArrowDown' : 'ArrowRight';
        const prev = vertical ? 'ArrowUp' : 'ArrowLeft';
        const i = items().indexOf(document.activeElement as HTMLElement);
        if (i < 0) return;
        if (e.key === next) focusAt(i + 1);
        else if (e.key === prev) focusAt(i - 1);
        else if (e.key === 'Home') focusAt(0);
        else if (e.key === 'End') focusAt(-1);
        else return;
        e.preventDefault();
      }}
      {...props}
    >
      <div data-slot="toolbar-items" className={cn('flex min-w-0 gap-0.5', vertical ? 'flex-col items-center' : 'items-center')}>{content}</div>
      {menu ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <ButtonIcon variant="ghost" size="sm" icon={<Ellipsis />} label={overflowLabel} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side={vertical ? 'right' : 'bottom'}>{menu}</DropdownMenuContent>
        </DropdownMenu>
      ) : null}
    </div>
  );
}

/** A group separator: 24 long, 4 px on each side; horizontal inside a vertical Toolbar. */
function ToolbarSeparator({ orientation = 'vertical', className, ...props }: React.ComponentProps<'div'> & { orientation?: 'vertical' | 'horizontal' }) {
  return (
    <div data-slot="toolbar-separator" role="separator" aria-orientation={orientation} className={cn('flex shrink-0', orientation === 'vertical' ? 'h-6 px-1' : 'w-8 py-1', className)} {...props}>
      <span className={cn('bg-border', orientation === 'vertical' ? 'h-full w-px' : 'h-px w-full')} />
    </div>
  );
}

export { Toolbar, ToolbarGroup, ToolbarSeparator };
