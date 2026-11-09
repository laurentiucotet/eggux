// EGG UI Account Menu. Figma: Menu page, "Account Menu / Component" (Name, Email). The menu behind
// the signed-in person's avatar in the Top Bar or Sidebar User. Built from DropdownMenu (Menu, Menu
// Item, Separator) and Avatar. 260 wide, popover surface, 4 px padding, 2 px between rows. Header:
// Avatar default (32, initials), 8 px gap and padding, name in ui/label, email in ui/caption muted;
// the header is not focusable and names the menu (aria-labelledby). Long names wrap; long emails
// truncate and show in full in a Tooltip. Items: Profile, Settings (⌘,), Theme (submenu Light,
// Dark, System with a check on the current one), Keyboard shortcuts (?), then a Separator and
// Log out, last. Log out never asks for confirmation (the product handles unsaved changes).
import * as React from 'react';
import { Lightbulb, LogOut, Settings, Sun, User } from '@/components/icons';
import { Avatar } from './avatar';
import { Button } from './button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from './dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';
import { cn } from '@/lib/utils';

export type AccountTheme = 'light' | 'dark' | 'system';

const themes: { value: AccountTheme; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
];

/** Two initials from the name: "Daniel Pop" → "DP", "Ana" → "A". */
function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  const first = parts[0][0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] ?? '' : '';
  return (first + last).toUpperCase();
}

export interface AccountMenuProps extends Omit<React.ComponentProps<typeof DropdownMenu>, 'children'> {
  /** Figma Name: the signed-in person. */
  name: string;
  /** Figma Email. */
  email: string;
  /** Photo URL for the Avatar; initials from the name show until it loads. */
  avatarSrc?: string;
  /** Custom trigger (Sidebar User). Default: a round button with the Avatar, aria-label "Account menu". */
  trigger?: React.ReactElement;
  /** Accessible name of the default trigger. */
  triggerLabel?: string;
  /** Current theme: gets the check in the Theme submenu. */
  theme?: AccountTheme;
  onThemeChange?: (theme: AccountTheme) => void;
  onProfile?: () => void;
  onSettings?: () => void;
  onKeyboardShortcuts?: () => void;
  onLogOut?: () => void;
  /** Extra personal items, placed after Keyboard shortcuts and before the Log out separator. */
  children?: React.ReactNode;
  /** Menu alignment to the trigger (end in the Top Bar, start in the Sidebar). */
  align?: React.ComponentProps<typeof DropdownMenuContent>['align'];
  side?: React.ComponentProps<typeof DropdownMenuContent>['side'];
  contentClassName?: string;
}

function AccountMenu({
  name,
  email,
  avatarSrc,
  trigger,
  triggerLabel = 'Account menu',
  theme = 'system',
  onThemeChange,
  onProfile,
  onSettings,
  onKeyboardShortcuts,
  onLogOut,
  children,
  align = 'end',
  side,
  contentClassName,
  ...props
}: AccountMenuProps) {
  const headerId = React.useId();
  const initials = initialsOf(name);
  return (
    <DropdownMenu modal={false} {...props}>
      <DropdownMenuTrigger asChild>
        {trigger ?? (
          <Button variant="ghost" size="icon" className="rounded-full">
            {/* The Avatar's text equivalent names the button (an aria-label would hide the initials from it). */}
            <Avatar size="default" initials={initials} src={avatarSrc} name={triggerLabel} />
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        data-slot="account-menu"
        align={align}
        side={side}
        aria-labelledby={headerId}
        className={cn('flex w-65 flex-col gap-0.5', contentClassName)}
      >
        <div data-slot="account-menu-header" className="flex min-w-0 items-center gap-2 p-2">
          <Avatar size="default" initials={initials} src={avatarSrc} aria-hidden="true" />
          <div id={headerId} className="flex min-w-0 flex-1 flex-col">
            <span data-slot="account-menu-name" className="text-sm font-medium leading-5 break-words text-popover-foreground">{name}</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span data-slot="account-menu-email" className="truncate text-xs leading-4 text-muted-foreground">{email}</span>
                </TooltipTrigger>
                <TooltipContent>{email}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="flex flex-col gap-0.5">
          <DropdownMenuItem icon={<User aria-hidden="true" />} onSelect={onProfile}>Profile</DropdownMenuItem>
          <DropdownMenuItem icon={<Settings aria-hidden="true" />} shortcut="⌘," onSelect={onSettings}>Settings</DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger icon={<Sun aria-hidden="true" />}>Theme</DropdownMenuSubTrigger>
            <DropdownMenuSubContent aria-label="Theme" className="w-40">
              <DropdownMenuRadioGroup value={theme} onValueChange={v => onThemeChange?.(v as AccountTheme)}>
                {themes.map(t => (
                  <DropdownMenuRadioItem key={t.value} value={t.value}>{t.label}</DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuItem icon={<Lightbulb aria-hidden="true" />} shortcut="?" onSelect={onKeyboardShortcuts}>Keyboard shortcuts</DropdownMenuItem>
          {children}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem icon={<LogOut aria-hidden="true" />} onSelect={onLogOut}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { AccountMenu };
