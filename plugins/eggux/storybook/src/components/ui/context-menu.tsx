// EGG UI Context Menu. Code only (no Figma component yet); the menu surface and items copy Dropdown
// Menu (Menu page, "Menu / Component"): 224 wide, popover surface, 1 px border, radius md, 4 px
// padding, shadow md, item = icon + label + shortcut, destructive last. shadcn ContextMenu on the
// radix-ui primitive. Opens at the pointer on right click, on a long press (touch) and from the
// keyboard: the area is focusable and Shift+F10 or the Menu key opens the menu at its top left
// corner. Arrows move, Right opens a sub menu, Left closes it, Enter selects, Escape closes and
// returns focus to the area. A context menu is a shortcut, never the only path: every action in
// it must also exist in the interface (a toolbar button, a row menu). The area needs `label`.
import * as React from 'react';
import { ContextMenu as MenuPrimitive } from 'radix-ui';
import { Check, ChevronRight } from '@/components/icons';
import { cn } from '@/lib/utils';

function ContextMenu(props: React.ComponentProps<typeof MenuPrimitive.Root>) {
  return <MenuPrimitive.Root data-slot="context-menu" {...props} />;
}

export interface ContextMenuTriggerProps extends Omit<React.ComponentProps<'div'>, 'role' | 'aria-label'> {
  /** Accessible name of the area ("Invoice INV-2041"): what the menu acts on. */
  label: string;
  /** Spoken after the name: how to open the menu without a mouse. */
  hint?: string;
  disabled?: boolean;
}

/** The area that opens the menu: focusable, so Shift+F10 and the Menu key work. */
function ContextMenuTrigger({ label, hint = 'Press Shift plus F10 or the Menu key for more actions.', disabled, className, children, onKeyDown, ...props }: ContextMenuTriggerProps) {
  const hintId = React.useId();
  const keyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented || disabled || e.target !== e.currentTarget) return;
    if (e.key === 'ContextMenu' || (e.shiftKey && e.key === 'F10')) {
      e.preventDefault();
      const rect = e.currentTarget.getBoundingClientRect();
      e.currentTarget.dispatchEvent(
        new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: rect.left + 16, clientY: rect.top + 16, button: 2 }),
      );
    }
  };
  return (
    <MenuPrimitive.Trigger asChild disabled={disabled}>
      <div
        data-slot="context-menu-trigger"
        role="group"
        aria-label={label}
        aria-describedby={hintId}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={keyDown}
        className={cn('min-w-0 rounded-md outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 data-[state=open]:ring-2 data-[state=open]:ring-ring/30', className)}
        {...props}
      >
        {children}
        <span id={hintId} className="sr-only">
          {hint}
        </span>
      </div>
    </MenuPrimitive.Trigger>
  );
}

const surface =
  'z-50 w-56 max-w-[calc(100vw-16px)] rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md outline-none';

function ContextMenuContent({ className, collisionPadding = 8, ...props }: React.ComponentProps<typeof MenuPrimitive.Content>) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Content data-slot="context-menu-content" collisionPadding={collisionPadding} className={cn(surface, className)} {...props} />
    </MenuPrimitive.Portal>
  );
}

const itemBase =
  "group/item relative flex w-full min-w-0 cursor-default select-none items-center gap-2 rounded-sm px-2 py-[var(--menu-padding-y)] text-left text-sm leading-5 outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4";
const itemTone = {
  default: 'text-popover-foreground data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground',
  destructive: 'text-destructive data-[highlighted]:bg-destructive data-[highlighted]:text-destructive-foreground',
} as const;

export interface ContextMenuItemProps extends React.ComponentProps<typeof MenuPrimitive.Item> {
  /** default, or destructive (last, after a separator). */
  variant?: keyof typeof itemTone;
  /** A 16 px icon from `@/components/icons`. */
  icon?: React.ReactNode;
  /** Shortcut text ("Ctrl+D"), muted. */
  shortcut?: React.ReactNode;
}

function ContextMenuItem({ variant = 'default', icon, shortcut, className, children, ...props }: ContextMenuItemProps) {
  return (
    <MenuPrimitive.Item data-slot="context-menu-item" data-variant={variant} className={cn(itemBase, itemTone[variant], className)} {...props}>
      {icon}
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {shortcut ? <ContextMenuShortcut>{shortcut}</ContextMenuShortcut> : null}
    </MenuPrimitive.Item>
  );
}

export interface ContextMenuCheckboxItemProps extends React.ComponentProps<typeof MenuPrimitive.CheckboxItem> {
  shortcut?: React.ReactNode;
}

/** role menuitemcheckbox with aria-checked, a check at the end. */
function ContextMenuCheckboxItem({ className, children, shortcut, ...props }: ContextMenuCheckboxItemProps) {
  return (
    <MenuPrimitive.CheckboxItem data-slot="context-menu-checkbox-item" className={cn(itemBase, itemTone.default, className)} {...props}>
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {shortcut ? <ContextMenuShortcut>{shortcut}</ContextMenuShortcut> : null}
      <MenuPrimitive.ItemIndicator className="flex">
        <Check aria-hidden="true" />
      </MenuPrimitive.ItemIndicator>
    </MenuPrimitive.CheckboxItem>
  );
}

function ContextMenuRadioGroup(props: React.ComponentProps<typeof MenuPrimitive.RadioGroup>) {
  return <MenuPrimitive.RadioGroup data-slot="context-menu-radio-group" {...props} />;
}

function ContextMenuRadioItem({ className, children, ...props }: React.ComponentProps<typeof MenuPrimitive.RadioItem>) {
  return (
    <MenuPrimitive.RadioItem data-slot="context-menu-radio-item" className={cn(itemBase, itemTone.default, className)} {...props}>
      <span className="min-w-0 flex-1 truncate">{children}</span>
      <MenuPrimitive.ItemIndicator className="flex">
        <Check aria-hidden="true" />
      </MenuPrimitive.ItemIndicator>
    </MenuPrimitive.RadioItem>
  );
}

function ContextMenuLabel({ className, ...props }: React.ComponentProps<typeof MenuPrimitive.Label>) {
  return <MenuPrimitive.Label data-slot="context-menu-label" className={cn('px-2 py-1.5 text-sm font-medium leading-5 text-popover-foreground', className)} {...props} />;
}

function ContextMenuSeparator({ className, ...props }: React.ComponentProps<typeof MenuPrimitive.Separator>) {
  return <MenuPrimitive.Separator data-slot="context-menu-separator" className={cn('my-1 h-px bg-border', className)} {...props} />;
}

function ContextMenuShortcut({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="context-menu-shortcut"
      className={cn('ml-auto shrink-0 pl-2 text-xs leading-4 text-muted-foreground group-data-[highlighted]/item:text-current', className)}
      {...props}
    />
  );
}

function ContextMenuSub(props: React.ComponentProps<typeof MenuPrimitive.Sub>) {
  return <MenuPrimitive.Sub data-slot="context-menu-sub" {...props} />;
}

function ContextMenuSubTrigger({ className, icon, children, ...props }: React.ComponentProps<typeof MenuPrimitive.SubTrigger> & { icon?: React.ReactNode }) {
  return (
    <MenuPrimitive.SubTrigger
      data-slot="context-menu-sub-trigger"
      className={cn(itemBase, itemTone.default, 'data-[state=open]:bg-accent data-[state=open]:text-accent-foreground', className)}
      {...props}
    >
      {icon}
      <span className="min-w-0 flex-1 truncate">{children}</span>
      <ChevronRight className="ml-auto text-muted-foreground group-data-[highlighted]/item:text-current" aria-hidden="true" />
    </MenuPrimitive.SubTrigger>
  );
}

function ContextMenuSubContent({ className, ...props }: React.ComponentProps<typeof MenuPrimitive.SubContent>) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.SubContent data-slot="context-menu-sub-content" collisionPadding={8} className={cn(surface, className)} {...props} />
    </MenuPrimitive.Portal>
  );
}

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
};
