// EGG UI Month Picker Cell. Figma: Month Picker Cell (Calendar page, "Month Picker / Component").
// State (default, hover, focus, current, selected, disabled), Label. One month, quarter or year
// in Month Picker, 72 x 40 on its own; it fills its column in the grid. Same tokens as Calendar
// Day: current = accent, selected = primary. Disabled periods (outside the data) cannot be picked.
import * as React from 'react';
import { cn } from '@/lib/utils';

export type MonthPickerCellState = 'default' | 'hover' | 'focus' | 'current' | 'selected' | 'disabled';

// Every class name is written in full so Tailwind can generate it.
const states: Record<MonthPickerCellState, string> = {
  default: 'font-normal text-foreground hover:bg-accent hover:text-accent-foreground',
  hover: 'bg-accent font-normal text-accent-foreground',
  focus: 'font-normal text-foreground ring-[3px] ring-ring/50',
  current: 'bg-accent font-medium text-accent-foreground',
  selected: 'bg-primary font-medium text-primary-foreground',
  disabled: 'cursor-not-allowed font-normal text-muted-foreground opacity-50',
};

export interface MonthPickerCellProps extends Omit<React.ComponentProps<'button'>, 'children'> {
  /** Figma State. In code, current and disabled come from the parent; selected also sets aria-selected on its gridcell. */
  state?: MonthPickerCellState;
  /** Figma Label: "Oct", "Q3" or "2026". */
  label?: React.ReactNode;
}

function MonthPickerCell({ state = 'default', label = 'Oct', className, type = 'button', ...props }: MonthPickerCellProps) {
  return (
    <button
      type={type}
      data-slot="month-picker-cell"
      data-state={state}
      aria-disabled={state === 'disabled' || undefined}
      aria-current={state === 'current' ? 'date' : undefined}
      className={cn(
        'flex h-10 w-full min-w-0 items-center justify-center rounded-md px-2 text-sm outline-none transition-[color,background-color,box-shadow] duration-[var(--duration-fast)] focus-visible:ring-[3px] focus-visible:ring-ring/50',
        states[state],
        className,
      )}
      {...props}
    >
      <span className="truncate leading-5">{label}</span>
    </button>
  );
}

export { MonthPickerCell };
