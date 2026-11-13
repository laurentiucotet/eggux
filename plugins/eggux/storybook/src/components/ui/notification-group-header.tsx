// EGG UI Notification Group Header. Code only (no Figma component yet); family Notifications.
// The label above one group of notifications ("Today", "Earlier") with how many it holds and,
// when `collapsible`, a toggle that folds the group. It is a heading with a real button inside:
// the button carries aria-expanded and aria-controls (the id of the list it folds), so the
// state is spoken and the full row is the click target. The count reads "Today 3 notifications"
// (sr-only text next to the visible number). `sticky` pins it to the top of its scroll area
// (inside the group wrapper, so the next group pushes it away); it paints a solid popover
// surface so rows never show through. Chevron down = open, right = folded; no motion.
// Not for a section of a settings page (that is a plain heading).
import * as React from 'react';
import { ChevronDown, ChevronRight } from '@/components/icons';
import { cn } from '@/lib/utils';
import { BadgeCount } from './badge-count';

export interface NotificationGroupHeaderProps extends Omit<React.ComponentProps<'div'>, 'children' | 'onToggle'> {
  /** The group name: "Today", "Earlier", "Last week". */
  label: string;
  /** How many notifications the group holds. */
  count: number;
  /** Controlled folded state. */
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  /** id of the list this header folds (aria-controls). */
  controls?: string;
  /** Show the toggle. Off: a plain heading with the count. Default true. */
  collapsible?: boolean;
  /** Pin to the top of the scroll area. Default true. */
  sticky?: boolean;
  /** Heading level. Default h3. */
  titleAs?: 'h2' | 'h3' | 'h4';
}

function NotificationGroupHeader({
  label,
  count,
  collapsed: collapsedProp,
  defaultCollapsed = false,
  onCollapsedChange,
  controls,
  collapsible = true,
  sticky = true,
  titleAs: Title = 'h3',
  className,
  ...props
}: NotificationGroupHeaderProps) {
  const [inner, setInner] = React.useState(defaultCollapsed);
  const collapsed = collapsedProp ?? inner;
  const toggle = () => {
    if (collapsedProp === undefined) setInner(!collapsed);
    onCollapsedChange?.(!collapsed);
  };
  const noun = count === 1 ? 'notification' : 'notifications';
  const badge = <BadgeCount variant="secondary" count={count} label={`${count.toLocaleString('en')} ${noun}`} />;
  return (
    <div
      data-slot="notification-group-header"
      data-collapsed={collapsed || undefined}
      className={cn('z-10 min-w-0 bg-popover text-popover-foreground', sticky && 'sticky top-0', className)}
      {...props}
    >
      <Title className="m-0 text-xs leading-4 font-medium">
        {collapsible ? (
          <button
            type="button"
            aria-expanded={!collapsed}
            aria-controls={controls}
            onClick={toggle}
            className="flex w-full min-w-0 items-center gap-2 rounded-md px-3 py-2 text-left text-foreground outline-none hover:bg-accent focus-visible:shadow-[0_0_0_2px_var(--background),0_0_0_4px_var(--ring)]"
          >
            <span className="min-w-0 truncate">{label}</span>
            {badge}
            <span className="min-w-0 flex-1" />
            {collapsed ? <ChevronRight aria-hidden="true" className="size-4 shrink-0" /> : <ChevronDown aria-hidden="true" className="size-4 shrink-0" />}
          </button>
        ) : (
          <span className="flex w-full min-w-0 items-center gap-2 px-3 py-2 text-foreground">
            <span className="min-w-0 truncate">{label}</span>
            {badge}
          </span>
        )}
      </Title>
    </div>
  );
}

export { NotificationGroupHeader };
