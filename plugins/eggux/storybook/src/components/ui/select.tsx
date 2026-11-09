// EGG UI Select. Figma: Select (Select page, "Select / Component"). Style (default, filled, ghost) x
// Size (default 36, sm 32, lg 40) x State (default, focus, error, disabled, read-only) x Content
// (placeholder, filled); Value, Show clear, Label + Show label (ghost), Show leading icon + Leading
// icon (globe), Show avatar (Avatar xs), Show status dot. shadcn Select on the radix-ui primitive:
// the trigger is a role="combobox" button; Enter, Space or the arrows open, arrows move, Enter
// picks, Escape closes and returns focus, typing a letter jumps to the matching option (Radix).
// The open list is the Menu surface (4 px below, trigger width) with Menu Item rows and a check on
// the selected one. Leading parts set on SelectItem (icon, avatar, status) show in the trigger too.
// Field passes id, aria-describedby, aria-invalid, required and disabled to <Select>, which hands
// them to its trigger. State=read-only keeps the value readable and focusable but never opens.
import * as React from 'react';
import { Select as SelectPrimitive } from 'radix-ui';
import { cva, type VariantProps } from 'class-variance-authority';
import { Check, ChevronDown, ChevronUp, X } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Avatar, type AvatarProps } from './avatar';
import { statusDotVariants } from './status-dot';

export type SelectStyle = 'default' | 'filled' | 'ghost';
export type SelectSize = 'sm' | 'default' | 'lg';

// Trigger look, shared with Combobox. Figma: 1 px border/input, input radius, shadow xs, 12 px
// sides and 8 gap (lg 16 sides, body/default); focus = border/ring + 2 px ring outside a 2 px
// background gap; error = destructive border; disabled 50 %; filled = muted fill, no border or
// shadow; ghost = no border or fill, hugs its text, 8 px sides (lg 12); read-only = muted fill.
const selectTriggerVariants = cva(
  "group/trigger flex min-w-0 items-center gap-2 rounded-input border text-left text-foreground outline-none transition-[color,box-shadow,border-color,background-color] duration-[var(--duration-fast)] focus-visible:border-ring focus-visible:shadow-[0_0_0_2px_var(--background),0_0_0_4px_var(--ring)] aria-invalid:border-destructive data-[state=open]:border-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      selectStyle: {
        default: 'w-full border-input bg-background shadow-xs data-[placeholder]:text-muted-foreground',
        filled: 'w-full border-transparent bg-muted data-[placeholder]:text-[var(--input-filled-muted-foreground)]',
        ghost: 'w-auto max-w-full border-transparent bg-transparent hover:bg-accent data-[placeholder]:text-muted-foreground',
      },
      size: {
        sm: 'h-8 px-3 text-sm leading-5',
        default: 'h-[var(--control-height)] px-3 text-sm leading-5',
        lg: 'h-10 px-4 text-base leading-7',
      },
      readOnly: {
        true: 'cursor-default border-input bg-muted shadow-none hover:bg-muted data-[placeholder]:text-[var(--input-filled-muted-foreground)]',
        false: '',
      },
    },
    compoundVariants: [
      { selectStyle: 'ghost', size: 'sm', className: 'px-2' },
      { selectStyle: 'ghost', size: 'default', className: 'px-2' },
      { selectStyle: 'ghost', size: 'lg', className: 'px-3' },
    ],
    defaultVariants: { selectStyle: 'default', size: 'default', readOnly: false },
  },
);

interface SelectContextValue {
  selectStyle: SelectStyle;
  size: SelectSize;
  readOnly: boolean;
  value: string;
  clear: () => void;
  /** Props Field passes to the control, handed on to the trigger. */
  fieldProps: { id?: string; 'aria-describedby'?: string; 'aria-invalid'?: React.AriaAttributes['aria-invalid'] };
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}
const SelectContext = React.createContext<SelectContextValue | null>(null);

export interface SelectProps extends Omit<React.ComponentProps<typeof SelectPrimitive.Root>, 'dir'> {
  /** Figma Style: default (outlined), filled (muted fill) or ghost (toolbars, never in a form). */
  selectStyle?: SelectStyle;
  /** Figma Size: default 36, sm 32 (filter bars, tables), lg 40 (hero and mobile forms). */
  size?: SelectSize;
  /** Figma State=read-only: a value people may see but not change here. */
  readOnly?: boolean;
  /** From Field: handed to the trigger. */
  id?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: React.AriaAttributes['aria-invalid'];
  /** Field passes a ref through its Slot: it gets the trigger. */
  ref?: React.Ref<HTMLButtonElement>;
}

/** Root: value state (an empty string shows the placeholder, so Show clear can empty it). */
function Select({
  selectStyle = 'default',
  size = 'default',
  readOnly = false,
  value: valueProp,
  defaultValue,
  onValueChange,
  id,
  'aria-describedby': describedBy,
  'aria-invalid': invalid,
  ref,
  ...props
}: SelectProps) {
  const [inner, setInner] = React.useState(defaultValue ?? '');
  const value = valueProp ?? inner;
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  React.useImperativeHandle(ref, () => triggerRef.current as HTMLButtonElement, []);
  const change = React.useCallback((v: string) => {
    setInner(v);
    onValueChange?.(v);
  }, [onValueChange]);
  const ctx = React.useMemo<SelectContextValue>(() => ({
    selectStyle,
    size,
    readOnly,
    value,
    clear: () => {
      change('');
      triggerRef.current?.focus();
    },
    fieldProps: { id, 'aria-describedby': describedBy, 'aria-invalid': invalid },
    triggerRef,
  }), [selectStyle, size, readOnly, value, change, id, describedBy, invalid]);
  return (
    <SelectContext.Provider value={ctx}>
      <SelectPrimitive.Root data-slot="select" value={value} onValueChange={change} {...props} />
    </SelectContext.Provider>
  );
}

function SelectGroup(props: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />;
}

function SelectValue({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" className={className} {...props} />;
}

export interface SelectTriggerProps extends React.ComponentProps<typeof SelectPrimitive.Trigger> {
  /** Figma Value when empty: an example, not a label ("Select a location"). */
  placeholder?: React.ReactNode;
  /** Figma Label + Show label (Style=ghost): inline muted text before the value ("Sort by:"). Part of the name. */
  label?: string;
  /** Figma Show leading icon (+ Leading icon) when the options have no leading of their own. */
  leading?: React.ReactNode;
  /** Figma Show clear: an x before the chevron that empties the value (filters). */
  showClear?: boolean;
  /** Accessible name of the x. */
  clearLabel?: string;
}

/** The trigger: leading, value (truncates), optional clear x, chevron. */
function SelectTrigger({ className, placeholder, label, leading, showClear = false, clearLabel = 'Clear selection', children, onPointerDown, onKeyDown, onClick, ...props }: SelectTriggerProps) {
  const ctx = React.useContext(SelectContext);
  const style = ctx?.selectStyle ?? 'default';
  const size = ctx?.size ?? 'default';
  const readOnly = ctx?.readOnly ?? false;
  const ghost = style === 'ghost';
  const labelId = React.useId();
  const valueId = React.useId();
  const clearable = showClear && !readOnly && !!ctx?.value;
  // Read-only: the Radix handlers never run, so it cannot open; Tab still moves on.
  const block = <E extends React.SyntheticEvent>(handler?: (e: E) => void) => (e: E) => {
    handler?.(e);
    if (readOnly && !(e.nativeEvent instanceof KeyboardEvent && e.nativeEvent.key === 'Tab')) e.preventDefault();
  };
  const named = props['aria-label'] || props['aria-labelledby'];

  const trigger = (
    <SelectPrimitive.Trigger
      ref={ctx?.triggerRef}
      data-slot="select-trigger"
      data-style={style}
      data-size={size}
      data-read-only={readOnly || undefined}
      aria-readonly={readOnly || undefined}
      aria-labelledby={!named && ghost && label ? `${labelId} ${valueId}` : undefined}
      {...ctx?.fieldProps}
      onPointerDown={block(onPointerDown)}
      onKeyDown={block(onKeyDown)}
      onClick={block(onClick)}
      className={cn(selectTriggerVariants({ selectStyle: style, size, readOnly }), className)}
      {...props}
    >
      {leading ? <span aria-hidden="true" className="flex shrink-0 text-muted-foreground">{leading}</span> : null}
      {ghost && label ? <span id={labelId} data-slot="select-label" className="shrink-0 text-muted-foreground">{label}</span> : null}
      <span
        id={valueId}
        data-slot="select-trigger-value"
        className={cn('min-w-0 truncate', ghost ? 'max-w-[200px] flex-none font-medium group-data-[placeholder]/trigger:font-normal' : 'flex-1')}
      >
        {children ?? <SelectValue placeholder={placeholder ?? 'Select a location'} />}
      </span>
      {/* Room for the clear x, which sits on top as a sibling button (a button cannot hold a button). */}
      {clearable ? <span aria-hidden="true" data-slot="select-clear-space" className="size-5 shrink-0" /> : null}
      {readOnly ? null : (
        <SelectPrimitive.Icon asChild>
          <ChevronDown aria-hidden="true" className="ml-auto text-muted-foreground" />
        </SelectPrimitive.Icon>
      )}
    </SelectPrimitive.Trigger>
  );
  if (!showClear) return trigger;
  return (
    <span data-slot="select-trigger-wrap" className={cn('relative flex min-w-0', ghost ? 'w-auto' : 'w-full')}>
      {trigger}
      {clearable ? (
        <button
          type="button"
          data-slot="select-clear"
          aria-label={clearLabel}
          onClick={() => ctx?.clear()}
          className={cn(
            "absolute top-1/2 inline-flex size-5 -translate-y-1/2 cursor-pointer items-center justify-center rounded-sm text-muted-foreground outline-none hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring [&_svg]:size-4",
            ghost ? (size === 'lg' ? 'right-9' : 'right-8') : size === 'lg' ? 'right-10' : 'right-9',
          )}
        >
          <X aria-hidden="true" />
        </button>
      ) : null}
    </span>
  );
}

function SelectScrollUpButton({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton data-slot="select-scroll-up-button" className={cn('flex cursor-default items-center justify-center py-1 [&_svg]:size-4', className)} {...props}>
      <ChevronUp aria-hidden="true" />
    </SelectPrimitive.ScrollUpButton>
  );
}

function SelectScrollDownButton({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton data-slot="select-scroll-down-button" className={cn('flex cursor-default items-center justify-center py-1 [&_svg]:size-4', className)} {...props}>
      <ChevronDown aria-hidden="true" />
    </SelectPrimitive.ScrollDownButton>
  );
}

/** Figma Menu under the trigger: popover surface, 1 px border, radius md, 4 px padding, shadow md, trigger width. */
function SelectContent({ className, children, position = 'popper', sideOffset = 4, collisionPadding = 8, ...props }: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        position={position}
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        className={cn(
          'relative z-50 min-w-32 overflow-x-hidden overflow-y-auto rounded-md border border-border bg-popover text-popover-foreground shadow-md outline-none',
          position === 'popper' && 'max-h-[min(var(--radix-select-content-available-height),320px)] w-[var(--radix-select-trigger-width)]',
          className,
        )}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport data-slot="select-viewport" className="p-1">{children}</SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

/** Figma Menu Label: group heading. */
function SelectLabel({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return <SelectPrimitive.Label data-slot="select-label" className={cn('px-2 py-1.5 text-sm leading-5 font-medium text-popover-foreground', className)} {...props} />;
}

type StatusDotStatus = 'success' | 'warning' | 'error' | 'info' | 'neutral';

export interface SelectItemProps extends React.ComponentProps<typeof SelectPrimitive.Item> {
  /** Leading icon (16, muted): languages, currencies, categories. Shown in the trigger too. */
  icon?: React.ReactNode;
  /** Leading Avatar xs: assignee, owner. Shown in the trigger too. */
  avatar?: Omit<AvatarProps, 'size'>;
  /** Leading Status Dot: status and priority. The label still names the status. */
  status?: StatusDotStatus;
  /** Muted second line in the list only (not in the trigger). */
  description?: React.ReactNode;
}

/** Figma Menu Item in the open Select: 8 px sides, menu padding, radius sm, highlighted accent, check when selected. */
function SelectItem({ className, children, icon, avatar, status, description, ...props }: SelectItemProps) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "group/item relative flex w-full min-w-0 cursor-default select-none items-center gap-2 rounded-sm py-[var(--menu-padding-y)] pr-8 pl-2 text-sm leading-5 text-popover-foreground outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <SelectPrimitive.ItemText asChild>
          <span className="flex min-w-0 items-center gap-2">
            {icon ? <span aria-hidden="true" className="flex shrink-0 text-muted-foreground group-data-[highlighted]/item:text-current">{icon}</span> : null}
            {avatar ? <Avatar {...avatar} size="xs" aria-hidden="true" className={cn('shrink-0', avatar.className)} /> : null}
            {status ? <span aria-hidden="true" className={statusDotVariants({ status })} /> : null}
            <span className="min-w-0 truncate">{children}</span>
          </span>
        </SelectPrimitive.ItemText>
        {description ? <span className="truncate text-xs leading-4 text-muted-foreground group-data-[highlighted]/item:text-current">{description}</span> : null}
      </span>
      <span className="absolute right-2 flex size-4 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Check aria-hidden="true" />
        </SelectPrimitive.ItemIndicator>
      </span>
    </SelectPrimitive.Item>
  );
}

/** Figma Separator, Spacing=sm. */
function SelectSeparator({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return <SelectPrimitive.Separator data-slot="select-separator" className={cn('-mx-1 my-1 h-px bg-border', className)} {...props} />;
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  selectTriggerVariants,
};
