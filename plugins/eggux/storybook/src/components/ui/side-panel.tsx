// EGG UI Side Panel. Figma: Side Panel (Drawer page, "Side Panel / Component"), State (expanded,
// collapsed), Title, Collapsible, Show footer, slots Actions, Content, Footer. An <aside> in the
// page grid labelled by its title, not an overlay. Expanded: 320 wide (min 240), radius lg,
// border; header 8/8/8/16 padding with the title (ui/label, one line, ellipsis), the Actions slot
// and a ghost collapse Button Icon (chevron-right); Content 16 padding, 16 gap; optional Footer
// 12/16 padding with a top border. Collapsed: a 48 rail with the expand button (chevron-left)
// and the title written vertically (bottom to top), capped at 200. The content stays mounted while
// collapsed, so its state survives. Toggling keeps focus on the toggle button.
import * as React from 'react';
import { ChevronLeft, ChevronRight } from '@/components/icons';
import { cn } from '@/lib/utils';
import { ButtonIcon } from './button-icon';

export interface SidePanelProps extends Omit<React.ComponentProps<'aside'>, 'title'> {
  /** Figma Title: names what the panel shows ("Showcase info", "Properties"). Default "Details". */
  title?: string;
  /** Heading level of the title. Default h2. */
  titleAs?: 'h2' | 'h3' | 'h4';
  /** Figma Actions slot: a menu or one Button Icon (ghost). Hidden while collapsed. */
  actions?: React.ReactNode;
  /** Figma Collapsible: show the collapse button. Default true. */
  collapsible?: boolean;
  /** Figma State=collapsed (controlled). */
  collapsed?: boolean;
  /** Initial State when uncontrolled. Default false (expanded). */
  defaultCollapsed?: boolean;
  /** Called with the new collapsed state; store it per user and page. */
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Figma Footer slot (Show footer): one full-width action. */
  footer?: React.ReactNode;
  /** Figma Content slot: Description List Items, previews, short lists. */
  children?: React.ReactNode;
}

function SidePanel({
  title = 'Details',
  titleAs: Title = 'h2',
  actions,
  collapsible = true,
  collapsed: collapsedProp,
  defaultCollapsed = false,
  onCollapsedChange,
  footer,
  className,
  children,
  ...props
}: SidePanelProps) {
  const [inner, setInner] = React.useState(defaultCollapsed);
  const collapsed = collapsible && (collapsedProp ?? inner);
  const id = React.useId();
  const titleId = `${id}-title`;
  const bodyId = `${id}-body`;
  const toggleRef = React.useRef<HTMLButtonElement>(null);
  const refocus = React.useRef(false);

  const toggle = () => {
    const next = !collapsed;
    refocus.current = toggleRef.current === document.activeElement;
    if (collapsedProp === undefined) setInner(next);
    onCollapsedChange?.(next);
  };

  // The collapse and expand buttons are different elements: keep focus on the toggle.
  React.useEffect(() => {
    if (refocus.current) {
      refocus.current = false;
      toggleRef.current?.focus();
    }
  }, [collapsed]);

  const toggleButton = collapsible ? (
    <ButtonIcon
      ref={toggleRef}
      variant="ghost"
      icon={collapsed ? <ChevronLeft aria-hidden="true" /> : <ChevronRight aria-hidden="true" />}
      label={`${collapsed ? 'Expand' : 'Collapse'} ${title}`}
      tooltipSide={collapsed ? 'left' : 'top'}
      aria-expanded={!collapsed}
      aria-controls={bodyId}
      onClick={toggle}
      data-slot="side-panel-toggle"
    />
  ) : null;

  return (
    <aside
      data-slot="side-panel"
      data-state={collapsed ? 'collapsed' : 'expanded'}
      aria-labelledby={titleId}
      className={cn(
        'flex shrink-0 flex-col rounded-lg border bg-background text-foreground',
        collapsed ? 'w-12 items-center gap-4 px-1 py-2' : 'w-80 min-w-60',
        className,
      )}
      {...props}
    >
      {collapsed ? (
        <>
          {toggleButton}
          <Title
            id={titleId}
            className="max-h-[200px] truncate text-sm leading-5 font-medium text-muted-foreground [writing-mode:vertical-rl] rotate-180"
          >
            {title}
          </Title>
        </>
      ) : (
        <div data-slot="side-panel-header" className="flex min-w-0 items-center gap-1 border-b py-2 pr-2 pl-4">
          <Title id={titleId} className="min-w-0 flex-1 truncate text-sm leading-5 font-medium">
            {title}
          </Title>
          {actions ? (
            <div data-slot="side-panel-actions" className="flex shrink-0 items-center gap-1">
              {actions}
            </div>
          ) : null}
          {toggleButton}
        </div>
      )}
      <div id={bodyId} data-slot="side-panel-body" hidden={collapsed} className="flex min-w-0 flex-col">
        <div data-slot="side-panel-content" className="flex min-w-0 flex-col gap-4 p-4">
          {children}
        </div>
        {footer ? (
          <div data-slot="side-panel-footer" className="flex min-w-0 gap-2 border-t px-4 py-3 [&>*]:min-w-0 [&>*]:flex-1">
            {footer}
          </div>
        ) : null}
      </div>
    </aside>
  );
}

export { SidePanel };
