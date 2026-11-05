// EGG UI Button Icon. Figma: Button Icon (Button page, "Button Icon / Component").
// Variant (default, secondary, outline, ghost, destructive, soft) x Size (xs 28, sm 32, default 36,
// lg 40) x State (default, hover, focus, disabled, loading), Icon (default ellipsis). shadcn
// `Button size="icon"` with an aria-label and a Tooltip with the same text. Loading: a spinner
// replaces the icon, aria-busy, repeat clicks blocked; the tooltip says the action in progress.
import * as React from 'react';
import { Button, type ButtonProps } from './button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

export type ButtonIconVariant = 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'soft';
export type ButtonIconSize = 'xs' | 'sm' | 'default' | 'lg';

const sizeMap = { xs: 'icon-xs', sm: 'icon-sm', default: 'icon', lg: 'icon-lg' } as const;

export interface ButtonIconProps extends Omit<ButtonProps, 'variant' | 'size' | 'children' | 'leadingIcon' | 'trailingIcon' | 'aria-label'> {
  /** Figma Variant. Default `default`, as in Figma; use ghost in toolbars and dense UI. */
  variant?: ButtonIconVariant;
  /** Figma Size: xs 28 (14 px icon), sm 32, default 36, lg 40. */
  size?: ButtonIconSize;
  /** Figma Icon (instance swap): an icon from `@/components/icons`. */
  icon: React.ReactNode;
  /** Accessible name and tooltip text: the action ("More actions for Invoice INV-1041"). */
  label: string;
  /** Figma State=loading: tooltip and accessible name while the action runs ("Refreshing"). */
  loadingLabel?: string;
  /** Hide the tooltip (when a parent already shows one, as Copy Button does). Default true. */
  showTooltip?: boolean;
  /** Tooltip side. Default top. */
  tooltipSide?: 'top' | 'bottom' | 'left' | 'right';
}

function ButtonIcon({ variant = 'default', size = 'default', icon, label, loading = false, loadingLabel, showTooltip = true, tooltipSide = 'top', ...props }: ButtonIconProps) {
  const name = loading && loadingLabel ? loadingLabel : label;
  const button = (
    <Button data-slot="button-icon" variant={variant} size={sizeMap[size]} loading={loading} aria-label={name} {...props}>
      {icon}
    </Button>
  );
  if (!showTooltip) return button;
  return (
    // Its own provider so a Button Icon works anywhere; an outer provider still sets the delay.
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent side={tooltipSide}>{name}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export { ButtonIcon };
