// EGG UI Menubar and Menubar Trigger. Figma: Menu page, "Menubar / Component" (Menubar, Menubar
// Trigger State default, hover, open). shadcn Menubar on the radix-ui primitive. Menubar: hugs its
// triggers, control-height (density) high, 4 px sides, 4 px gap, 1 px border, radius md,
// background. Menubar Trigger: 12 px sides, 4 px top and bottom, radius sm, ui/label in foreground;
// hover, keyboard focus and open fill background/accent. The menus reuse the Menu (Dropdown Menu)
// surface and Menu Item styles: 224 wide, popover, radius md, shadow md; items 32 high.
// Role menubar with menuitem triggers; left and right arrows move between menus, while one is open
// hovering another trigger opens it, Escape closes and returns focus to the trigger (Radix).
import * as React from 'react';
import { Menubar as MenubarPrimitive } from 'radix-ui';
import { Check, ChevronRight } from '@/components/icons';
import { cn } from '@/lib/utils';

/** Figma Menubar: the Menus slot holds Menubar Triggers, one MenubarMenu each. */
function Menubar({ className, ...props }: React.ComponentProps<typeof MenubarPrimitive.Root>) {
  return (
    <MenubarPrimitive.Root
      data-slot="menubar"
      className={cn(
        'flex h-[var(--control-height)] w-fit max-w-full items-center gap-1 rounded-md border border-border bg-background px-1',
        className,
      )}
      {...props}
    />
  );
}

function MenubarMenu(props: React.ComponentProps<typeof MenubarPrimitive.Menu>) {
  return <MenubarPrimitive.Menu data-slot="menubar-menu" {...props} />;
}

function MenubarGroup(props: React.ComponentProps<typeof MenubarPrimitive.Group>) {
  return <MenubarPrimitive.Group data-slot="menubar-group" {...props} />;
}

function MenubarPortal(props: React.ComponentProps<typeof MenubarPrimitive.Portal>) {
  return <MenubarPrimitive.Portal data-slot="menubar-portal" {...props} />;
}

function MenubarRadioGroup(props: React.ComponentProps<typeof MenubarPrimitive.RadioGroup>) {
  return <MenubarPrimitive.RadioGroup data-slot="menubar-radio-group" {...props} />;
}

/** Figma Menubar Trigger: Label; State default, hover (accent), open (accent). */
function MenubarTrigger({ className, ...props }: React.ComponentProps<typeof MenubarPrimitive.Trigger>) {
  return (
    <MenubarPrimitive.Trigger
      data-slot="menubar-trigger"
      className={cn(
        'flex shrink-0 cursor-default select-none items-center whitespace-nowrap rounded-sm px-3 py-1 text-sm font-medium leading-5 text-foreground outline-none',
        'hover:bg-accent focus-visible:bg-accent data-[highlighted]:bg-accent data-[state=open]:bg-accent',
        'focus-visible:ring-2 focus-visible:ring-ring',
        className,
      )}
      {...props}
    />
  );
}

// Same Menu surface and Menu Item styles as dropdown-menu.tsx (Figma Menu, Menu Item, Menu Label).
const surface = 'z-50 w-56 max-w-[calc(100vw-16px)] rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md outline-none';
const itemBase =
  "relative flex w-full min-w-0 cursor-default select-none items-center gap-2 rounded-sm px-2 py-[var(--menu-padding-y)] text-left text-sm leading-5 outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4";
const itemTone = {
  default: 'text-popover-foreground data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground',
  destructive: 'text-destructive data-[highlighted]:bg-destructive data-[highlighted]:text-destructive-foreground',
} as const;

function MenubarContent({ className, align = 'start', sideOffset = 8, collisionPadding = 8, ...props }: React.ComponentProps<typeof MenubarPrimitive.Content>) {
  return (
    <MenubarPortal>
      <MenubarPrimitive.Content
        data-slot="menubar-content"
        align={align}
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        className={cn(surface, className)}
        {...props}
      />
    </MenubarPortal>
  );
}

export interface MenubarItemProps extends React.ComponentProps<typeof MenubarPrimitive.Item> {
  /** Figma Menu Item Variant: default or destructive (last, after a separator). */
  variant?: keyof typeof itemTone;
  /** Figma Show leading icon. */
  icon?: React.ReactNode;
  /** Figma Shortcut text (Show shortcut). */
  shortcut?: React.ReactNode;
  /** Figma Show description: a muted second line. */
  description?: React.ReactNode;
}

function ItemBody({ icon, children, description, shortcut }: Pick<MenubarItemProps, 'icon' | 'children' | 'description' | 'shortcut'>) {
  return (
    <>
      {icon}
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate">{children}</span>
        {description ? (
          <span data-slot="menubar-description" className="text-xs leading-4 text-muted-foreground group-data-[highlighted]/item:text-current">
            {description}
          </span>
        ) : null}
      </span>
      {shortcut ? <MenubarShortcut>{shortcut}</MenubarShortcut> : null}
    </>
  );
}

function MenubarItem({ variant = 'default', icon, shortcut, description, className, children, ...props }: MenubarItemProps) {
  return (
    <MenubarPrimitive.Item data-slot="menubar-item" data-variant={variant} className={cn('group/item', itemBase, itemTone[variant], className)} {...props}>
      <ItemBody icon={icon} description={description} shortcut={shortcut}>{children}</ItemBody>
    </MenubarPrimitive.Item>
  );
}

export interface MenubarCheckboxItemProps extends React.ComponentProps<typeof MenubarPrimitive.CheckboxItem> {
  shortcut?: React.ReactNode;
}

/** Figma Menu Item Checked: a check at the end; role menuitemcheckbox with aria-checked. */
function MenubarCheckboxItem({ className, children, shortcut, ...props }: MenubarCheckboxItemProps) {
  return (
    <MenubarPrimitive.CheckboxItem data-slot="menubar-checkbox-item" className={cn('group/item', itemBase, itemTone.default, className)} {...props}>
      <ItemBody shortcut={shortcut}>{children}</ItemBody>
      <MenubarPrimitive.ItemIndicator className="ml-auto flex">
        <Check aria-hidden="true" />
      </MenubarPrimitive.ItemIndicator>
    </MenubarPrimitive.CheckboxItem>
  );
}

/** Figma Menu Item Checked in a single-choice group: role menuitemradio. */
function MenubarRadioItem({ className, children, ...props }: React.ComponentProps<typeof MenubarPrimitive.RadioItem>) {
  return (
    <MenubarPrimitive.RadioItem data-slot="menubar-radio-item" className={cn('group/item', itemBase, itemTone.default, className)} {...props}>
      <span className="min-w-0 flex-1 truncate">{children}</span>
      <MenubarPrimitive.ItemIndicator className="ml-auto flex">
        <Check aria-hidden="true" />
      </MenubarPrimitive.ItemIndicator>
    </MenubarPrimitive.RadioItem>
  );
}

/** Figma Menu Label: group heading, ui/label, not focusable. */
function MenubarLabel({ className, ...props }: React.ComponentProps<typeof MenubarPrimitive.Label>) {
  return <MenubarPrimitive.Label data-slot="menubar-label" className={cn('px-2 py-1.5 text-sm font-medium leading-5 text-popover-foreground', className)} {...props} />;
}

/** Figma Separator, Spacing=sm: 4 px above and below a 1 px line, inside the menu padding. */
function MenubarSeparator({ className, ...props }: React.ComponentProps<typeof MenubarPrimitive.Separator>) {
  return <MenubarPrimitive.Separator data-slot="menubar-separator" className={cn('my-1 h-px bg-border', className)} {...props} />;
}

/** Figma Shortcut text: ui/caption, muted; follows the item color when highlighted. */
function MenubarShortcut({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="menubar-shortcut"
      className={cn('ml-auto shrink-0 pl-2 text-xs leading-4 text-muted-foreground group-data-[highlighted]/item:text-current', className)}
      {...props}
    />
  );
}

function MenubarSub(props: React.ComponentProps<typeof MenubarPrimitive.Sub>) {
  return <MenubarPrimitive.Sub data-slot="menubar-sub" {...props} />;
}

/** Figma Show submenu: a muted chevron at the end; opens on hover or arrow right, one level deep. */
function MenubarSubTrigger({ className, icon, children, ...props }: React.ComponentProps<typeof MenubarPrimitive.SubTrigger> & { icon?: React.ReactNode }) {
  return (
    <MenubarPrimitive.SubTrigger
      data-slot="menubar-sub-trigger"
      className={cn('group/item', itemBase, itemTone.default, 'data-[state=open]:bg-accent data-[state=open]:text-accent-foreground', className)}
      {...props}
    >
      {icon}
      <span className="min-w-0 flex-1 truncate">{children}</span>
      <ChevronRight className="ml-auto text-muted-foreground group-data-[highlighted]/item:text-current" aria-hidden="true" />
    </MenubarPrimitive.SubTrigger>
  );
}

function MenubarSubContent({ className, ...props }: React.ComponentProps<typeof MenubarPrimitive.SubContent>) {
  return (
    <MenubarPortal>
      <MenubarPrimitive.SubContent data-slot="menubar-sub-content" collisionPadding={8} className={cn(surface, className)} {...props} />
    </MenubarPortal>
  );
}

export {
  Menubar,
  MenubarPortal,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarGroup,
  MenubarSeparator,
  MenubarLabel,
  MenubarItem,
  MenubarShortcut,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
};
