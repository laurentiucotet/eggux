// EGG UI Dropdown Menu. Figma: Menu, Menu Item, Menu Label (Menu page, "Menu / Component"), with
// Separator. shadcn DropdownMenu on the radix-ui primitive. Menu: 224 wide (spacing/56), popover
// surface, 1 px border, radius md, 4 px padding, shadow md. Menu Item: 8 px sides, menu-padding-y
// (density), radius sm, body/small, 16 px leading icon, shortcut in ui/caption muted; highlighted =
// accent; destructive = destructive text, highlighted destructive = filled destructive row.
// Arrows move, Enter selects, Escape closes and returns focus to the trigger (Radix).
import * as React from 'react';
import { DropdownMenu as MenuPrimitive } from 'radix-ui';
import { Check, ChevronRight } from '@/components/icons';
import { cn } from '@/lib/utils';

function DropdownMenu(props: React.ComponentProps<typeof MenuPrimitive.Root>) {
  return <MenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}

function DropdownMenuTrigger(props: React.ComponentProps<typeof MenuPrimitive.Trigger>) {
  return <MenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />;
}

function DropdownMenuGroup(props: React.ComponentProps<typeof MenuPrimitive.Group>) {
  return <MenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />;
}

const surface = 'z-50 w-56 max-w-[calc(100vw-16px)] rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md outline-none';

function DropdownMenuContent({ className, sideOffset = 4, collisionPadding = 8, ...props }: React.ComponentProps<typeof MenuPrimitive.Content>) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Content data-slot="dropdown-menu-content" sideOffset={sideOffset} collisionPadding={collisionPadding} className={cn(surface, className)} {...props} />
    </MenuPrimitive.Portal>
  );
}

const itemBase =
  "relative flex w-full min-w-0 cursor-default select-none items-center gap-2 rounded-sm px-2 py-[var(--menu-padding-y)] text-left text-sm leading-5 outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4";
const itemTone = {
  default: 'text-popover-foreground data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground',
  destructive: 'text-destructive data-[highlighted]:bg-destructive data-[highlighted]:text-destructive-foreground',
} as const;

export interface DropdownMenuItemProps extends React.ComponentProps<typeof MenuPrimitive.Item> {
  /** Figma Variant: default or destructive (last, after a separator). */
  variant?: keyof typeof itemTone;
  /** Figma Show leading icon: an icon from `@/components/icons`. */
  icon?: React.ReactNode;
  /** Figma Shortcut text (Show shortcut): "⌘E". */
  shortcut?: React.ReactNode;
  /** Figma Show description: a muted second line. */
  description?: React.ReactNode;
}

function ItemBody({ icon, children, description, shortcut }: Pick<DropdownMenuItemProps, 'icon' | 'children' | 'description' | 'shortcut'>) {
  return (
    <>
      {icon}
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate">{children}</span>
        {description ? (
          <span data-slot="dropdown-menu-description" className="text-xs leading-4 text-muted-foreground group-data-[highlighted]/item:text-current">
            {description}
          </span>
        ) : null}
      </span>
      {shortcut ? <DropdownMenuShortcut>{shortcut}</DropdownMenuShortcut> : null}
    </>
  );
}

function DropdownMenuItem({ variant = 'default', icon, shortcut, description, className, children, ...props }: DropdownMenuItemProps) {
  return (
    <MenuPrimitive.Item data-slot="dropdown-menu-item" data-variant={variant} className={cn('group/item', itemBase, itemTone[variant], className)} {...props}>
      <ItemBody icon={icon} description={description} shortcut={shortcut}>{children}</ItemBody>
    </MenuPrimitive.Item>
  );
}

export interface DropdownMenuCheckboxItemProps extends React.ComponentProps<typeof MenuPrimitive.CheckboxItem> {
  shortcut?: React.ReactNode;
  description?: React.ReactNode;
}

/** Figma Menu Item Checked: a check at the end; role menuitemcheckbox with aria-checked. */
function DropdownMenuCheckboxItem({ className, children, shortcut, description, ...props }: DropdownMenuCheckboxItemProps) {
  return (
    <MenuPrimitive.CheckboxItem data-slot="dropdown-menu-checkbox-item" className={cn('group/item', itemBase, itemTone.default, className)} {...props}>
      <ItemBody description={description} shortcut={shortcut}>{children}</ItemBody>
      <MenuPrimitive.ItemIndicator className="ml-auto flex">
        <Check aria-hidden="true" />
      </MenuPrimitive.ItemIndicator>
    </MenuPrimitive.CheckboxItem>
  );
}

function DropdownMenuRadioGroup(props: React.ComponentProps<typeof MenuPrimitive.RadioGroup>) {
  return <MenuPrimitive.RadioGroup data-slot="dropdown-menu-radio-group" {...props} />;
}

function DropdownMenuRadioItem({ className, children, ...props }: React.ComponentProps<typeof MenuPrimitive.RadioItem>) {
  return (
    <MenuPrimitive.RadioItem data-slot="dropdown-menu-radio-item" className={cn('group/item', itemBase, itemTone.default, className)} {...props}>
      <span className="min-w-0 flex-1 truncate">{children}</span>
      <MenuPrimitive.ItemIndicator className="ml-auto flex">
        <Check aria-hidden="true" />
      </MenuPrimitive.ItemIndicator>
    </MenuPrimitive.RadioItem>
  );
}

/** Figma Menu Label: group heading, ui/label, not clickable. */
function DropdownMenuLabel({ className, ...props }: React.ComponentProps<typeof MenuPrimitive.Label>) {
  return <MenuPrimitive.Label data-slot="dropdown-menu-label" className={cn('px-2 py-1.5 text-sm font-medium leading-5 text-popover-foreground', className)} {...props} />;
}

/** Figma Separator, Spacing=sm: 4 px above and below a 1 px border line. */
function DropdownMenuSeparator({ className, ...props }: React.ComponentProps<typeof MenuPrimitive.Separator>) {
  return <MenuPrimitive.Separator data-slot="dropdown-menu-separator" className={cn('my-1 h-px bg-border', className)} {...props} />;
}

/** Figma Shortcut text: ui/caption, muted; follows the item color when highlighted. */
function DropdownMenuShortcut({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn('ml-auto shrink-0 pl-2 text-xs leading-4 text-muted-foreground group-data-[highlighted]/item:text-current', className)}
      {...props}
    />
  );
}

function DropdownMenuSub(props: React.ComponentProps<typeof MenuPrimitive.Sub>) {
  return <MenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />;
}

/** Figma Show submenu: a chevron at the end; opens on hover or arrow right, one level deep. */
function DropdownMenuSubTrigger({ className, icon, children, ...props }: React.ComponentProps<typeof MenuPrimitive.SubTrigger> & { icon?: React.ReactNode }) {
  return (
    <MenuPrimitive.SubTrigger
      data-slot="dropdown-menu-sub-trigger"
      className={cn('group/item', itemBase, itemTone.default, 'data-[state=open]:bg-accent data-[state=open]:text-accent-foreground', className)}
      {...props}
    >
      {icon}
      <span className="min-w-0 flex-1 truncate">{children}</span>
      <ChevronRight className="ml-auto text-muted-foreground group-data-[highlighted]/item:text-current" aria-hidden="true" />
    </MenuPrimitive.SubTrigger>
  );
}

function DropdownMenuSubContent({ className, ...props }: React.ComponentProps<typeof MenuPrimitive.SubContent>) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.SubContent data-slot="dropdown-menu-sub-content" collisionPadding={8} className={cn(surface, className)} {...props} />
    </MenuPrimitive.Portal>
  );
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
};
