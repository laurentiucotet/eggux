// EGG UI Tabs and Tab. Figma: Tabs, Tab (Tabs page, "Tabs / Component").
// shadcn Tabs (Tabs, TabsList, TabsTrigger, TabsContent) on the radix-ui primitive. Tabs Variant
// (default pill track, line, vertical, pills, boxed) and Size (default, sm) are set once on Tabs,
// since every Tab of one list must match. Automatic activation; arrows move (Left/Right, Up/Down
// when vertical), Home/End jump, disabled tabs are skipped, Tab moves into the panel.
// Show overflow (default, line, pills, boxed): TabsList measures its width and moves the tabs
// that do not fit into a "More" menu (aria-label "More tabs"); the active tab always stays visible.
// Hidden tabs are display:none, so the arrow keys skip them and reach them through the menu.
// Show count: `count` on TabsTrigger renders a Badge Count after the label.
import * as React from 'react';
import { Tabs as TabsPrimitive } from 'radix-ui';
import { Ellipsis } from '@/components/icons';
import { cn } from '@/lib/utils';
import { BadgeCount } from './badge-count';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './dropdown-menu';

export type TabsVariant = 'default' | 'line' | 'vertical' | 'pills' | 'boxed';
export type TabsSize = 'default' | 'sm';

type TabsContextValue = {
  variant: TabsVariant;
  size: TabsSize;
  value: string | undefined;
  setValue: (value: string) => void;
};
const TabsContext = React.createContext<TabsContextValue>({ variant: 'default', size: 'default', value: undefined, setValue: () => {} });

export interface TabsProps extends Omit<React.ComponentProps<typeof TabsPrimitive.Root>, 'orientation'> {
  /** Figma Variant: default (pill track in a card), line (page sections), vertical (settings), pills (list filters), boxed (folder tabs on a bordered panel). */
  variant?: TabsVariant;
  /** Figma Tab Size: default, or sm for card headers, side panels and toolbars. */
  size?: TabsSize;
}

function Tabs({ variant = 'default', size = 'default', value, defaultValue, onValueChange, className, ...props }: TabsProps) {
  const [inner, setInner] = React.useState<string | undefined>(defaultValue);
  const current = value ?? inner;
  const setValue = React.useCallback(
    (next: string) => {
      if (value === undefined) setInner(next);
      onValueChange?.(next);
    },
    [value, onValueChange],
  );
  const ctx = React.useMemo(() => ({ variant, size, value: current, setValue }), [variant, size, current, setValue]);
  const vertical = variant === 'vertical';
  return (
    <TabsContext.Provider value={ctx}>
      <TabsPrimitive.Root
        data-slot="tabs"
        data-variant={variant}
        orientation={vertical ? 'vertical' : 'horizontal'}
        value={current}
        onValueChange={setValue}
        className={cn('flex', vertical ? 'flex-row gap-12' : 'flex-col', className)}
        {...props}
      />
    </TabsContext.Provider>
  );
}

// The track, line or header row around the tab list.
const listClass: Record<TabsVariant, string> = {
  default: 'relative inline-flex w-fit max-w-full items-center gap-1 rounded-button bg-muted p-1',
  line: 'relative flex w-full items-end gap-4 border-b border-border',
  vertical: 'flex w-[200px] shrink-0 flex-col gap-1',
  pills: 'relative flex items-center gap-2',
  boxed: 'relative flex w-full items-end',
};
const innerClass: Record<TabsVariant, string> = {
  default: 'flex items-start gap-1',
  line: 'flex items-start gap-4',
  vertical: 'flex w-full flex-col gap-1',
  pills: 'flex items-start gap-2',
  boxed: 'flex items-start',
};
const gapPx: Record<TabsVariant, number> = { default: 4, line: 16, vertical: 4, pills: 8, boxed: 0 };

const triggerBase =
  "relative inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap text-sm font-medium outline-none transition-[color,background-color,box-shadow] duration-[var(--duration-fast)] focus-visible:shadow-[0_0_0_2px_var(--background),0_0_0_4px_var(--ring)] disabled:pointer-events-none disabled:opacity-50 data-[overflowed=true]:hidden [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4";

const triggerVariant: Record<TabsVariant, string> = {
  // Inactive text is foreground, not muted: muted on the muted track fails contrast.
  default: 'rounded-button text-foreground data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:focus-visible:shadow-[0_0_0_2px_var(--background),0_0_0_4px_var(--ring)]',
  line: 'rounded-md border-b-2 border-transparent px-1 text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-foreground',
  vertical: 'w-full justify-start rounded-md text-foreground data-[state=active]:bg-muted',
  pills: 'rounded-button text-muted-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground',
  boxed:
    'rounded-t-md border-x border-t border-b border-x-transparent border-t-transparent border-b-border text-muted-foreground data-[state=active]:border-x-border data-[state=active]:border-t-border data-[state=active]:border-b-0 data-[state=active]:bg-background data-[state=active]:text-foreground',
};
// The "More" tab looks like an inactive Tab of the same variant.
const moreVariant: Record<TabsVariant, string> = {
  default: 'rounded-button text-foreground',
  line: 'rounded-md border-b-2 border-transparent px-1 text-muted-foreground',
  vertical: '',
  pills: 'rounded-button text-muted-foreground',
  boxed: 'rounded-t-md border-b border-border text-muted-foreground',
};
const triggerSize: Record<TabsVariant, Record<TabsSize, string>> = {
  default: { default: 'h-7 px-3', sm: 'h-6 px-2.5' },
  line: { default: 'h-9', sm: 'h-8' },
  vertical: { default: 'h-8 px-3', sm: 'h-7 px-2.5' },
  pills: { default: 'h-8 px-3', sm: 'h-7 px-2.5' },
  boxed: { default: 'h-9 px-4', sm: 'h-8 px-3' },
};

export interface TabsTriggerProps extends Omit<React.ComponentProps<typeof TabsPrimitive.Trigger>, 'children'> {
  /** Figma Label: one or two words, a noun. Also the name shown in the More menu. */
  children: React.ReactNode;
  /** Figma Show icon + Icon: a 16 px icon before the label (icons on all tabs or none). */
  icon?: React.ReactNode;
  /** Figma Show count: a Badge Count after the label. Write the number here, never in the label. */
  count?: number | string;
  /** Text equivalent of the count for assistive technology: "3 unpaid". */
  countLabel?: string;
}

function TabsTrigger({ icon, count, countLabel, className, children, ...props }: TabsTriggerProps) {
  const { variant, size } = React.useContext(TabsContext);
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(triggerBase, triggerVariant[variant], triggerSize[variant][size], className)}
      {...props}
    >
      {icon}
      <span className={cn(variant === 'vertical' && 'min-w-0 flex-1 truncate text-left')}>{children}</span>
      {count !== undefined && <BadgeCount variant="secondary" count={count} label={countLabel} />}
    </TabsPrimitive.Trigger>
  );
}

type TriggerElement = React.ReactElement<TabsTriggerProps>;

function isTrigger(node: React.ReactNode): node is TriggerElement {
  return React.isValidElement(node) && typeof (node.props as TabsTriggerProps).value === 'string';
}

type Layout = { key: string; widths: number[]; avail: number; moreWidth: number; gap: number };

export interface TabsListProps extends Omit<React.ComponentProps<typeof TabsPrimitive.List>, 'children'> {
  children: React.ReactNode;
  /** Figma Show overflow: tabs that do not fit move into a "More" menu. Not for variant vertical. */
  overflow?: boolean;
  /** Accessible name of the "More" button. */
  moreLabel?: string;
}

function TabsList({ overflow = false, moreLabel = 'More tabs', className, children, ...props }: TabsListProps) {
  const { variant, size, value, setValue } = React.useContext(TabsContext);
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);
  const moreRef = React.useRef<HTMLButtonElement>(null);
  const [measured, setLayout] = React.useState<Layout | null>(null);
  const canOverflow = overflow && variant !== 'vertical';

  const nodes = React.Children.toArray(children);
  const triggers = nodes.filter(isTrigger);
  const signature = triggers.map(t => `${t.props.value}:${typeof t.props.children === 'string' ? t.props.children : ''}:${t.props.count ?? ''}`).join('|');
  // A measurement is only valid for the labels, variant and size it was taken with.
  const key = `${signature}/${variant}/${size}`;
  const layout = measured && measured.key === key ? measured : null;

  // Measure with every tab shown (layout === null), before paint.
  React.useLayoutEffect(() => {
    if (!canOverflow || layout) return;
    const wrapper = wrapperRef.current;
    const list = listRef.current;
    const more = moreRef.current;
    const parent = wrapper?.parentElement;
    if (!wrapper || !list || !parent) return;
    const cs = getComputedStyle(wrapper);
    const chrome = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight) + parseFloat(cs.borderLeftWidth) + parseFloat(cs.borderRightWidth);
    const widths = Array.from(list.querySelectorAll<HTMLElement>('[data-slot="tabs-trigger"]')).map(el => el.getBoundingClientRect().width);
    setLayout({
      key,
      widths,
      avail: parent.clientWidth - chrome,
      moreWidth: more ? more.getBoundingClientRect().width : 82,
      gap: gapPx[variant],
    });
  }, [canOverflow, layout, variant, key]);

  // Measure again when the container width changes.
  React.useEffect(() => {
    const parent = wrapperRef.current?.parentElement;
    if (!canOverflow || !parent) return;
    let last = parent.clientWidth;
    const ro = new ResizeObserver(() => {
      if (parent.clientWidth !== last) {
        last = parent.clientWidth;
        setLayout(null);
      }
    });
    ro.observe(parent);
    return () => ro.disconnect();
  }, [canOverflow]);

  // Which tabs stay visible. The active tab always does.
  const visible = React.useMemo(() => {
    const all = triggers.map(() => true);
    if (!canOverflow || !layout) return all;
    const { widths, avail, moreWidth, gap } = layout;
    const total = widths.reduce((s, w) => s + w, 0) + gap * Math.max(0, widths.length - 1);
    if (total <= avail) return all;
    const room = avail - moreWidth - gap;
    const activeIdx = triggers.findIndex(t => t.props.value === value);
    const out = triggers.map(() => false);
    let used = 0;
    if (activeIdx >= 0) { out[activeIdx] = true; used = widths[activeIdx]; }
    for (let i = 0; i < widths.length; i++) {
      if (i === activeIdx) continue;
      const next = used + widths[i] + (used > 0 ? gap : 0);
      if (next > room) break;
      out[i] = true;
      used = next;
    }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canOverflow, layout, value, signature]);

  let index = -1;
  const rendered = nodes.map(node => {
    if (!isTrigger(node)) return node;
    index += 1;
    return visible[index] ? node : React.cloneElement(node, { 'data-overflowed': true } as Partial<TabsTriggerProps>);
  });
  const hidden = triggers.filter((_, i) => !visible[i]);
  const moreShown = canOverflow && hidden.length > 0;

  return (
    <div ref={wrapperRef} data-slot="tabs-list" data-variant={variant} className={cn(listClass[variant], className)}>
      <TabsPrimitive.List ref={listRef} className={innerClass[variant]} {...props}>
        {rendered}
      </TabsPrimitive.List>
      {canOverflow && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              ref={moreRef}
              type="button"
              data-slot="tabs-more"
              aria-label={moreLabel}
              // Kept measurable but out of the layout while every tab fits.
              {...(moreShown ? {} : { 'aria-hidden': true, tabIndex: -1 })}
              className={cn(
                triggerBase,
                moreVariant[variant],
                triggerSize[variant][size],
                'data-[state=open]:text-foreground',
                !moreShown && 'invisible absolute',
              )}
            >
              <Ellipsis aria-hidden="true" />
              More
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {hidden.map(t => (
              <DropdownMenuItem key={t.props.value} disabled={t.props.disabled} onSelect={() => setValue(t.props.value)}>
                {t.props.children}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      {variant === 'boxed' && <div aria-hidden="true" data-slot="tabs-rest" className="min-w-0 flex-1 self-stretch border-b border-border" />}
    </div>
  );
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  const { variant } = React.useContext(TabsContext);
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn(
        'min-w-0 text-sm outline-none focus-visible:shadow-[0_0_0_2px_var(--background),0_0_0_4px_var(--ring)]',
        variant === 'boxed' && 'flex flex-col gap-2 rounded-b-md border border-t-0 border-border bg-background p-[var(--card-padding-sm)]',
        variant === 'vertical' && 'flex-1',
        className,
      )}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
