// EGG UI App Launcher. Figma: App Launcher (Popover page, "App Launcher / Component", symbol
// 434:4510). The products of a suite, opened from a layout-grid Button Icon (aria-label "Apps") in
// the Top Bar: a Popover 320 wide, radius lg, 12 px padding and gap; the title (ui/label); a grid
// of apps, 3 per row, 4 px apart: each a link 76 high, radius md, with a 36 px muted icon tile
// (radius md, 18 px icon) over the name (ui/caption, never truncated), 6 px apart. The current app
// is highlighted (background/accent, aria-current="page"), never moved. An app that opens in a new
// tab shows an external-link icon. Only for suites with 4 or more apps; apps the person cannot
// open are left out by the caller.
// Keyboard: the grid is one tab stop (roving tabindex): arrows move (Left / Right one app, Up /
// Down one row), Home / End jump; Escape closes and returns focus to the trigger (Radix).
import * as React from 'react';
import { ExternalLink, LayoutGrid } from '@/components/icons';
import { cn } from '@/lib/utils';
import { ButtonIcon } from './button-icon';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

export interface AppLauncherApp {
  id: string;
  /** One or two words: "Invoices", "Payroll". */
  name: string;
  href: string;
  /** An icon from `@/components/icons`. */
  icon: React.ReactNode;
  /** Opens in a new tab: shows the external-link icon. */
  external?: boolean;
}

export interface AppLauncherProps {
  apps: AppLauncherApp[];
  /** Id of the app the person is in. */
  currentAppId?: string;
  /** Figma title: "Acme apps". */
  title?: React.ReactNode;
  /** Accessible name and tooltip of the trigger. */
  label?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Called when an app is opened. The link navigates unless the handler calls
   *  event.preventDefault() (a client-side router does that and routes itself). */
  onNavigate?: (app: AppLauncherApp, event: React.MouseEvent<HTMLAnchorElement>) => void;
  className?: string;
}

const COLUMNS = 3;

function AppLauncher({
  apps,
  currentAppId,
  title = 'Apps',
  label = 'Apps',
  open,
  defaultOpen,
  onOpenChange,
  onNavigate,
  className,
}: AppLauncherProps) {
  const titleId = `${React.useId()}-title`;
  const currentIndex = Math.max(apps.findIndex(app => app.id === currentAppId), 0);
  const [focusIndex, setFocusIndex] = React.useState(currentIndex);
  const links = React.useRef<(HTMLAnchorElement | null)[]>([]);

  const move = (to: number) => {
    const next = Math.min(Math.max(to, 0), apps.length - 1);
    setFocusIndex(next);
    links.current[next]?.focus();
  };

  return (
    <Popover open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <ButtonIcon variant="ghost" icon={<LayoutGrid />} label={label} tooltipSide="bottom" />
      </PopoverTrigger>
      <PopoverContent
        data-slot="app-launcher"
        aria-labelledby={titleId}
        align="end"
        className={cn('flex w-80 flex-col gap-3 rounded-lg p-3', className)}
        onOpenAutoFocus={event => {
          event.preventDefault();
          setFocusIndex(currentIndex);
          links.current[currentIndex]?.focus();
        }}
      >
        <h2 id={titleId} className="text-sm leading-5 font-medium text-popover-foreground">{title}</h2>
        <ul
          className="grid grid-cols-3 gap-1"
          onKeyDown={event => {
            const keys: Record<string, number> = {
              ArrowRight: focusIndex + 1,
              ArrowLeft: focusIndex - 1,
              ArrowDown: focusIndex + COLUMNS,
              ArrowUp: focusIndex - COLUMNS,
              Home: 0,
              End: apps.length - 1,
            };
            if (event.key in keys) {
              event.preventDefault();
              move(keys[event.key]);
            }
          }}
        >
          {apps.map((app, i) => {
            const current = app.id === currentAppId;
            return (
              <li key={app.id} className="flex min-w-0">
                <a
                  ref={el => {
                    links.current[i] = el;
                  }}
                  href={app.href}
                  data-slot="app-launcher-app"
                  aria-current={current ? 'page' : undefined}
                  tabIndex={i === focusIndex ? 0 : -1}
                  target={app.external ? '_blank' : undefined}
                  rel={app.external ? 'noopener noreferrer' : undefined}
                  onFocus={() => setFocusIndex(i)}
                  onClick={event => onNavigate?.(app, event)}
                  className="flex min-h-[76px] w-full min-w-0 flex-col items-center justify-center gap-1.5 rounded-md px-1 py-2 text-center text-xs leading-4 text-popover-foreground outline-none hover:bg-accent hover:text-accent-foreground focus-visible:shadow-[0_0_0_2px_var(--background),0_0_0_4px_var(--ring)] aria-[current=page]:bg-accent aria-[current=page]:text-accent-foreground"
                >
                  <span aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-foreground [&_svg]:size-[18px]">
                    {app.icon}
                  </span>
                  <span className="flex max-w-full items-center gap-1 break-words">
                    {app.name}
                    {app.external ? (
                      <>
                        <ExternalLink aria-hidden="true" className="size-3 shrink-0 text-muted-foreground" />
                        <span className="sr-only">(opens in a new tab)</span>
                      </>
                    ) : null}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </PopoverContent>
    </Popover>
  );
}

export { AppLauncher };
