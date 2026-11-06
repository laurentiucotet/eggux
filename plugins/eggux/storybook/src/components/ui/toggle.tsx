// EGG UI Toggle. Figma: Toggle (Toggle Group page, "Toggle / Component"). One on/off button with a
// pressed state (shadcn Toggle on the radix-ui primitive): Variant (default, outline), Size (sm 32,
// default 36 density, lg 40), State (default, hover background/muted, pressed background/accent +
// foreground/accent = data-state="on" with aria-pressed, focus ring, disabled 50 %), Label, Show
// label (off by default), Show icon, Icon (default Icon/bold). Icon-only toggles are square, take the
// label as aria-label and show it in a Tooltip (with the shortcut when given). The name never changes
// with the state. Hugs, never stretches, one line.
import * as React from 'react';
import { Toggle as TogglePrimitive } from 'radix-ui';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

// Shared with Toggle Group Item (variant default). Every class name in full so Tailwind sees it.
const toggleVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-button text-sm font-medium leading-5 text-foreground outline-none transition-[color,background-color,box-shadow] duration-[var(--duration-fast)] hover:bg-muted data-[state=on]:bg-accent data-[state=on]:hover:bg-accent data-[state=on]:text-accent-foreground focus-visible:shadow-[0_0_0_2px_var(--background),0_0_0_4px_var(--ring)] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        // Figma outline: border/input inside the box, shadow/xs.
        outline: 'border border-input bg-transparent shadow-xs',
      },
      size: {
        // Figma: sm 32 (8 px sides), default 36 density (10 px sides), lg 40 (12 px sides); min width = height.
        sm: 'h-8 min-w-8 px-2',
        default: 'h-[var(--control-height)] min-w-[var(--control-height)] px-2.5',
        lg: 'h-10 min-w-10 px-3',
      },
      iconOnly: { true: 'px-0', false: '' },
    },
    compoundVariants: [
      // Icon only: square.
      { iconOnly: true, size: 'sm', className: 'w-8' },
      { iconOnly: true, size: 'default', className: 'w-[var(--control-height)]' },
      { iconOnly: true, size: 'lg', className: 'w-10' },
      // Outline with a label: the 1 px border sits inside the Figma padding.
      { iconOnly: false, variant: 'outline', size: 'sm', className: 'px-[7px]' },
      { iconOnly: false, variant: 'outline', size: 'default', className: 'px-[9px]' },
      { iconOnly: false, variant: 'outline', size: 'lg', className: 'px-[11px]' },
    ],
    defaultVariants: { variant: 'default', size: 'default', iconOnly: false },
  },
);

export type ToggleVariant = NonNullable<VariantProps<typeof toggleVariants>['variant']>;
export type ToggleSize = NonNullable<VariantProps<typeof toggleVariants>['size']>;

export interface ToggleProps extends Omit<React.ComponentProps<typeof TogglePrimitive.Root>, 'children'> {
  /** Figma Variant: default (no border, toolbars and players) or outline (plain surfaces, next to outline Buttons). */
  variant?: ToggleVariant;
  /** Figma Size: sm 32 (Toolbar), default 36, lg 40. */
  size?: ToggleSize;
  /** Figma Label: the accessible name; also the tooltip of icon-only toggles. Keep it the same in both states. */
  label: string;
  /** Figma Show label. Off (default) makes an icon-only, square toggle. */
  showLabel?: boolean;
  /** Figma Icon (Show icon): an icon from `@/components/icons`. The icon does not change with the state. */
  icon?: React.ReactNode;
  /** Shortcut shown in the tooltip of an icon-only toggle (a Kbd). */
  shortcut?: React.ReactNode;
}

function Toggle({ variant = 'default', size = 'default', label, showLabel = false, icon, shortcut, className, ...props }: ToggleProps) {
  const iconOnly = !showLabel;
  const content = (
    <>
      {icon}
      {showLabel ? <span className="min-w-0 truncate">{label}</span> : null}
    </>
  );
  const rootProps = {
    'data-slot': 'toggle',
    'data-variant': variant,
    'data-size': size,
    'aria-label': iconOnly ? label : undefined,
    className: cn(toggleVariants({ variant, size, iconOnly }), className),
    ...props,
  };
  if (!iconOnly) return <TogglePrimitive.Root {...rootProps}>{content}</TogglePrimitive.Root>;
  // The Toggle wraps the tooltip trigger (not the other way round), so its data-state (on/off)
  // wins over the tooltip's (closed/delayed-open).
  return (
    <TooltipProvider>
      <Tooltip>
        <TogglePrimitive.Root asChild {...rootProps}>
          <TooltipTrigger>{content}</TooltipTrigger>
        </TogglePrimitive.Root>
        <TooltipContent shortcut={shortcut}>{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export { Toggle, toggleVariants };
