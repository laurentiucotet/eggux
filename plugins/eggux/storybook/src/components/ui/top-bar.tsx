// EGG UI Top Bar. Figma: Top Bar (Navigation page, "Top Bar / Component", 709:3747). Style (default,
// floating); Show sidebar trigger; slots Breadcrumb and Actions. The app top bar (shadcn site
// header) above the Page Header in the App page shell: sidebar trigger (ghost Button Icon,
// panel-left, "Toggle sidebar") and a vertical Separator (24 high, 4 px sides), the Breadcrumb
// filling the middle (wraps when space is short), global actions on the right (search,
// notifications, help, the user Avatar), 8 px apart.
// default: full width, 56 high (spacing/14), 16 px sides, bottom border, background/default.
// floating: 12 px inset (spacing/3) around a 56 high bar with border, button/radius, shadow/sm and
// 10 px sides; keep it sticky and give the page a top padding of the bar plus the inset.
// The header landmark; min width 320. Mobile under 768 uses Mobile Header.
import * as React from 'react';
import { PanelLeft } from '@/components/icons';
import { cn } from '@/lib/utils';
import { ButtonIcon } from './button-icon';
import { Separator } from './separator';

export type TopBarStyle = 'default' | 'floating';

export interface TopBarProps extends React.ComponentProps<'header'> {
  /** Figma Style. */
  barStyle?: TopBarStyle;
  /** Figma Show sidebar trigger: called by the trigger. Leave out to hide it. */
  onToggleSidebar?: () => void;
  /** Whether the sidebar is open (aria-expanded on the trigger). */
  sidebarOpen?: boolean;
  sidebarLabel?: string;
  /** Figma Breadcrumb slot. */
  breadcrumb?: React.ReactNode;
  /** Figma Actions slot: global actions only. */
  actions?: React.ReactNode;
}

function TopBar({ barStyle = 'default', onToggleSidebar, sidebarOpen, sidebarLabel = 'Toggle sidebar', breadcrumb, actions, className, ...props }: TopBarProps) {
  const floating = barStyle === 'floating';
  const content = (
    <>
      {onToggleSidebar ? (
        <>
          <ButtonIcon variant="ghost" icon={<PanelLeft />} label={sidebarLabel} aria-expanded={sidebarOpen} onClick={onToggleSidebar} tooltipSide="bottom" />
          <Separator orientation="vertical" spacing="sm" className="h-6" />
        </>
      ) : null}
      <div data-slot="top-bar-breadcrumb" className="flex min-w-0 flex-1 items-center">{breadcrumb}</div>
      {actions ? <div data-slot="top-bar-actions" className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </>
  );
  return (
    <header
      data-slot="top-bar"
      data-style={barStyle}
      className={cn(
        'w-full min-w-80 text-foreground',
        floating ? 'p-3' : 'flex min-h-14 items-center gap-2 border-b border-border bg-background px-4 py-1.5',
        className,
      )}
      {...props}
    >
      {floating ? (
        <div data-slot="top-bar-bar" className="flex min-h-14 items-center gap-2 rounded-button border border-border bg-background px-2.5 py-1.5 shadow-sm">{content}</div>
      ) : (
        content
      )}
    </header>
  );
}

export { TopBar };
