// EGG UI Toggle Group and Toggle Group Item. Figma: Toggle Group, Toggle Group Item (Toggle Group
// page, "Toggle Group / Component"). A group of items that sets a value (shadcn ToggleGroup on the
// radix-ui primitive): view mode, period, formatting. Group Variant: default (items 4 px apart, the
// selected one background/accent), outline (the same in a border/input pill with shadow/xs),
// segmented (one background/muted track with 4 px padding, the selected item a raised
// background/default pill with shadow/xs). Item: Label, Show label, Show icon + Icon; Size lives on
// the items and is set once on the group: sm (32; segmented 24), default (36 density; 28),
// lg (40; 32). Icon-only items are square, take the label as aria-label and a Tooltip.
// type="single": items are radios (aria-checked), one stays selected; type="multiple": toggle
// buttons (aria-pressed). Arrow keys move between items (one Tab stop), Space or Enter selects.
// fullWidth: the group fills its container and the items share it equally.
import * as React from 'react';
import { ToggleGroup as ToggleGroupPrimitive } from 'radix-ui';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { toggleVariants, type ToggleSize } from './toggle';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

export type ToggleGroupVariant = 'default' | 'outline' | 'segmented';
export type ToggleGroupSize = ToggleSize;

type ToggleGroupContextValue = { variant: ToggleGroupVariant; size: ToggleGroupSize; fullWidth: boolean };
const ToggleGroupContext = React.createContext<ToggleGroupContextValue>({ variant: 'default', size: 'default', fullWidth: false });

// Every class name in full so Tailwind can generate it.
const groupClass: Record<ToggleGroupVariant, string> = {
  default: 'gap-1',
  // The border is drawn by ::after above the items so the group stays as high as its items (Figma
  // stroke inside). Not an outline: Radix sets an inline outline: none on the group.
  outline: "relative gap-1 rounded-button shadow-xs after:pointer-events-none after:absolute after:inset-0 after:rounded-button after:border after:border-input after:content-['']",
  segmented: 'gap-1 rounded-button bg-muted p-1',
};

interface ToggleGroupBaseProps extends Omit<React.ComponentProps<'div'>, 'defaultValue' | 'dir' | 'onChange'> {
  /** Figma Variant: default, outline (bordered group) or segmented (one muted track, 2-4 short options). */
  variant?: ToggleGroupVariant;
  /** Figma Toggle Group Item Size, one for every item: sm (toolbars, Chart Card headers), default, lg (billing period, theme). */
  size?: ToggleGroupSize;
  /** Figma FILL: the group fills its container and the items share it equally. */
  fullWidth?: boolean;
  /** Disables every item. */
  disabled?: boolean;
  orientation?: 'horizontal' | 'vertical';
  /** Accessible name of the group ("View", "Billing period"). */
  'aria-label'?: string;
}
interface ToggleGroupSingleProps extends ToggleGroupBaseProps {
  /** single: one value, the items are radios and one always stays selected. */
  type: 'single';
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}
interface ToggleGroupMultipleProps extends ToggleGroupBaseProps {
  /** multiple: any number of values (formatting), the items are toggle buttons. */
  type: 'multiple';
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
}
export type ToggleGroupProps = ToggleGroupSingleProps | ToggleGroupMultipleProps;

function ToggleGroup(props: ToggleGroupProps) {
  const { variant = 'default', size = 'default', fullWidth = false, className, children, ...rest } = props;
  const ctx = React.useMemo(() => ({ variant, size, fullWidth }), [variant, size, fullWidth]);
  const classes = cn('inline-flex w-fit max-w-full items-center', groupClass[variant], fullWidth && 'flex w-full', className);

  // single: a radio group never ends up empty, so a click on the selected item keeps it.
  const [inner, setInner] = React.useState(rest.type === 'single' ? (rest.defaultValue ?? '') : '');
  const common = { 'data-slot': 'toggle-group', 'data-variant': variant, 'data-size': size, className: classes };

  let root: React.ReactNode;
  if (rest.type === 'single') {
    const { type: _type, value, defaultValue: _default, onValueChange, ...other } = rest;
    const onChange = (next: string) => {
      if (!next) return;
      if (value === undefined) setInner(next);
      onValueChange?.(next);
    };
    root = (
      <ToggleGroupPrimitive.Root {...common} {...other} type="single" value={value ?? inner} onValueChange={onChange}>
        {children}
      </ToggleGroupPrimitive.Root>
    );
  } else {
    root = (
      <ToggleGroupPrimitive.Root {...common} {...rest}>
        {children}
      </ToggleGroupPrimitive.Root>
    );
  }
  return <ToggleGroupContext.Provider value={ctx}>{root}</ToggleGroupContext.Provider>;
}

// Toggle Group Item Variant=segmented: transparent, hover toggle-group/segmented-hover, selected
// background/default with shadow/xs. sm 24 (10 px sides), default 28 (12), lg 32 (16).
const segmentedItem = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-button text-sm font-medium leading-5 text-foreground outline-none transition-[color,background-color,box-shadow] duration-[var(--duration-fast)] hover:bg-[var(--toggle-group-segmented-hover)] data-[state=on]:bg-background data-[state=on]:shadow-xs data-[state=on]:hover:bg-background focus-visible:shadow-[0_0_0_2px_var(--background),0_0_0_4px_var(--ring)] data-[state=on]:focus-visible:shadow-[0_0_0_2px_var(--background),0_0_0_4px_var(--ring)] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      size: { sm: 'h-6 min-w-6 px-2.5', default: 'h-7 min-w-7 px-3', lg: 'h-8 min-w-8 px-4' },
      iconOnly: { true: 'px-0', false: '' },
    },
    compoundVariants: [
      { iconOnly: true, size: 'sm', className: 'w-6' },
      { iconOnly: true, size: 'default', className: 'w-7' },
      { iconOnly: true, size: 'lg', className: 'w-8' },
    ],
    defaultVariants: { size: 'default', iconOnly: false },
  },
);

export interface ToggleGroupItemProps extends Omit<React.ComponentProps<typeof ToggleGroupPrimitive.Item>, 'children'> {
  /** Figma Label: one or two words. Also the aria-label and tooltip of icon-only items. */
  label: string;
  /** Figma Show label. Off makes an icon-only, square item (needs `icon`). Default true. */
  showLabel?: boolean;
  /** Figma Icon (Show icon): an icon from `@/components/icons`. */
  icon?: React.ReactNode;
}

function ToggleGroupItem({ label, showLabel = true, icon, className, ...props }: ToggleGroupItemProps) {
  const { variant, size, fullWidth } = React.useContext(ToggleGroupContext);
  const iconOnly = !showLabel;
  const itemClass =
    variant === 'segmented'
      ? segmentedItem({ size, iconOnly })
      : cn(toggleVariants({ variant: 'default', size, iconOnly }), 'data-[state=on]:hover:bg-accent focus-visible:z-10');
  const content = (
    <>
      {icon}
      {showLabel ? <span className="min-w-0 truncate">{label}</span> : null}
    </>
  );
  const itemProps = {
    'data-slot': 'toggle-group-item',
    'data-variant': variant === 'segmented' ? 'segmented' : 'default',
    'aria-label': iconOnly ? label : undefined,
    className: cn(itemClass, fullWidth && 'min-w-0 flex-1', className),
    ...props,
  };
  if (!iconOnly) return <ToggleGroupPrimitive.Item {...itemProps}>{content}</ToggleGroupPrimitive.Item>;
  // The item wraps the tooltip trigger so its data-state (on/off) wins over the tooltip's.
  return (
    <TooltipProvider>
      <Tooltip>
        <ToggleGroupPrimitive.Item asChild {...itemProps}>
          <TooltipTrigger>{content}</TooltipTrigger>
        </ToggleGroupPrimitive.Item>
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export { ToggleGroup, ToggleGroupItem };
