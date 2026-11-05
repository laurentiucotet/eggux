// EGG UI Split Button. Figma: Split Button (Button page, "Split Button / Component").
// Variant (default, outline), Label. One main action + a Dropdown Menu of variants of the same
// action. Two buttons: the action (16 px left, 12 px right) and a 36 px chevron menu button with its
// own label; a 1 px divider between them (primary-foreground at 20 % on default, input on outline).
// The chevron has aria-haspopup and aria-expanded; Enter, Space or ArrowDown opens the menu, Escape
// closes it and returns focus (Radix DropdownMenu).
import * as React from 'react';
import { ChevronDown } from '@/components/icons';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from './dropdown-menu';

export type SplitButtonVariant = 'default' | 'outline';

const root: Record<SplitButtonVariant, string> = {
  default: 'bg-primary text-primary-foreground shadow-xs',
  outline: 'border border-input bg-background text-foreground shadow-xs',
};
const part: Record<SplitButtonVariant, string> = {
  default: 'hover:bg-[var(--button-primary-hover)] data-[state=open]:bg-[var(--button-primary-hover)]',
  outline: 'hover:bg-accent hover:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
};
const divider: Record<SplitButtonVariant, string> = {
  default: 'bg-primary-foreground/20',
  outline: 'bg-input',
};
const partBase =
  'relative inline-flex h-full items-center justify-center outline-none transition-[color,background-color,box-shadow] duration-[var(--duration-fast)] focus-visible:z-10 focus-visible:shadow-[0_0_0_2px_var(--background),0_0_0_4px_var(--ring)] disabled:pointer-events-none';

export interface SplitButtonProps extends Omit<React.ComponentProps<'div'>, 'onClick' | 'children'> {
  /** Figma Variant: default when it is the primary action of the view, outline otherwise. */
  variant?: SplitButtonVariant;
  /** Figma Label: the most common choice ("Save"). */
  label: React.ReactNode;
  /** Runs the main action. */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  /** Accessible name of the chevron menu button ("More save options"). */
  menuLabel: string;
  /** The menu: DropdownMenuItem elements with variants of the same action only. */
  menu: React.ReactNode;
  /** Disables both parts. */
  disabled?: boolean;
  /** Controlled open state of the menu. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function SplitButton({ variant = 'default', label, onClick, menuLabel, menu, disabled, open, onOpenChange, className, ...props }: SplitButtonProps) {
  return (
    <div
      data-slot="split-button"
      data-variant={variant}
      className={cn(
        'inline-flex h-[var(--control-height)] shrink-0 items-stretch rounded-button text-sm font-medium leading-5',
        root[variant],
        disabled && 'opacity-50',
        className,
      )}
      {...props}
    >
      <button type="button" data-slot="split-button-action" className={cn(partBase, part[variant], 'whitespace-nowrap rounded-l-button pr-3 pl-4')} onClick={onClick} disabled={disabled}>
        {label}
      </button>
      <span data-slot="split-button-divider" aria-hidden="true" className={cn('w-px shrink-0', divider[variant])} />
      {/* Non-modal: the page stays readable (and scrollable) behind the menu; Escape and outside clicks still close it. */}
      <DropdownMenu open={open} onOpenChange={onOpenChange} modal={false}>
        <DropdownMenuTrigger asChild disabled={disabled}>
          <button type="button" data-slot="split-button-trigger" aria-label={menuLabel} className={cn(partBase, part[variant], 'w-9 shrink-0 rounded-r-button')}>
            <ChevronDown className="size-4" aria-hidden="true" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">{menu}</DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export { SplitButton };
