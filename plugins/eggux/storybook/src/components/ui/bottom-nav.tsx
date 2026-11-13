// EGG UI Bottom Nav and Bottom Nav Item. Figma: Bottom Nav (Mobile page, "Bottom Nav / Component").
// Bottom Nav: Style (default, floating); slot Items (3 to 5 Bottom Nav Items). default = a full
// width bar with a top border and the safe-area padding inside; floating = the items sit in a pill with
// a border and shadow-md, inset 16 px from the sides and lifted above the safe area, for apps with
// full-bleed content. Bottom Nav Item: State (default, active); Icon 20 + Label (caption). Active =
// foreground, others muted; the whole cell is the touch target (at least 48 x 48); the active one
// has aria-current="page". Hide it on detail pages and while typing.
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BottomNavItemProps extends Omit<React.ComponentProps<'a'>, 'children'> {
  /** Figma Icon (instance swap): an icon from `@/components/icons`. */
  icon: React.ReactNode;
  /** Figma Label: one or two words, always visible. */
  label: string;
  /** Figma State=active: the current destination (aria-current="page"). */
  active?: boolean;
  /** Optional count shown on the icon (unread). Spoken after the label. */
  badge?: number;
}

function BottomNavItem({ icon, label, active = false, badge, className, href = '#', ...props }: BottomNavItemProps) {
  return (
    <a
      data-slot="bottom-nav-item"
      data-state={active ? 'active' : 'default'}
      href={href}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'relative flex min-h-14 min-w-12 flex-1 flex-col items-center justify-center gap-1 rounded-md px-1 py-1.5 text-xs leading-4 font-medium outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 [&_svg]:size-5 [&_svg]:shrink-0',
        active ? 'text-foreground' : 'text-muted-foreground',
        className,
      )}
      {...props}
    >
      <span aria-hidden="true" className="relative">
        {icon}
        {badge ? (
          <span className="absolute -top-1.5 left-3 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] leading-none font-semibold text-destructive-foreground">
            {badge > 99 ? '99+' : badge}
          </span>
        ) : null}
      </span>
      <span className="max-w-full truncate">{label}</span>
      {badge ? <span className="sr-only">, {badge} new</span> : null}
    </a>
  );
}

export type BottomNavStyle = 'default' | 'floating';

export interface BottomNavProps extends React.ComponentProps<'nav'> {
  /** Figma Style. Default default. */
  navStyle?: BottomNavStyle;
}

function BottomNav({ navStyle = 'default', className, children, 'aria-label': ariaLabel = 'Main', ...props }: BottomNavProps) {
  const items = React.Children.toArray(children);
  return (
    <nav
      data-slot="bottom-nav"
      data-style={navStyle}
      aria-label={ariaLabel}
      className={cn(
        navStyle === 'floating'
          ? 'mx-4 mb-[calc(1rem+env(safe-area-inset-bottom))] rounded-button border border-border bg-background px-2 py-1 shadow-md'
          : 'w-full border-t border-border bg-background px-2 pt-1 pb-[env(safe-area-inset-bottom)]',
        className,
      )}
      {...props}
    >
      <ul className="m-0 flex list-none items-stretch gap-1 p-0">
        {items.map((item, i) => (
          <li key={i} className="flex min-w-0 flex-1">
            {item}
          </li>
        ))}
      </ul>
    </nav>
  );
}

export { BottomNav, BottomNavItem };
