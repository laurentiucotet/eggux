// EGG UI Toolbar. Figma: Toolbar (Toolbar page, "Toolbar / Component", 1092:82017). Orientation
// (horizontal, vertical), Style (default, floating), Show overflow. A row or column of related sm
// controls in groups (Toggle sm, Button Icon ghost sm, Button ghost sm, Select sm) with a Separator
// between groups (24 long, 4 px each side) and an overflow Button Icon ("More") that opens a Menu.
// 4 px padding, 2 px gap. default has no surface (the parent draws the border); floating is a
// popover surface (border, radius lg, shadow md) over a canvas.
// WAI-ARIA toolbar: role="toolbar" with a name and aria-orientation; one Tab stop (roving
// tabindex), arrows move between items, Home / End jump.
// Not built: moving groups into the overflow when space runs out; the app passes the overflow items.
import * as React from 'react';
import { Ellipsis } from '@/components/icons';
import { cn } from '@/lib/utils';
import { ButtonIcon } from './button-icon';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from './dropdown-menu';

const ITEMS = 'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), [role="combobox"]';

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
  const items = () => Array.from(ref.current?.querySelectorAll<HTMLElement>(ITEMS) ?? []);
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
      role="toolbar"
      aria-orientation={orientation}
      className={cn(
        // No gap between the items and the overflow button (Figma 298 = 4 + 258 + 32 + 4).
        'flex justify-between p-1',
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
      <div data-slot="toolbar-items" className={cn('flex gap-0.5', vertical ? 'flex-col items-center' : 'items-center')}>{children}</div>
      {overflow ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <ButtonIcon variant="ghost" size="sm" icon={<Ellipsis />} label={overflowLabel} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side={vertical ? 'right' : 'bottom'}>{overflow}</DropdownMenuContent>
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

export { Toolbar, ToolbarSeparator };
