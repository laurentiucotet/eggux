// EGG UI Time Slot. Figma: Time Slot (booking and Date Time Picker; used on the Calendar page in
// "Date Time Picker / Component" through the Times slot). One time as an outline button, 96 x 32:
// default, selected (primary fill) and disabled (unavailable times stay in the list). shadcn
// ToggleGroup of outline Buttons in the code mapping: here a toggle button (aria-pressed); the
// parent groups them with role="group" and a label.
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TimeSlotProps extends Omit<React.ComponentProps<'button'>, 'children'> {
  /** The time shown ("14:30"). */
  time: string;
  /** Selected slot (aria-pressed). */
  selected?: boolean;
  /** Unavailable time: stays visible, announced as unavailable, cannot be picked. */
  unavailable?: boolean;
}

function TimeSlot({ time, selected = false, unavailable = false, className, type = 'button', onClick, ...props }: TimeSlotProps) {
  return (
    <button
      type={type}
      data-slot="time-slot"
      data-state={unavailable ? 'disabled' : selected ? 'selected' : 'default'}
      aria-pressed={selected}
      aria-disabled={unavailable || undefined}
      onClick={unavailable ? e => e.preventDefault() : onClick}
      className={cn(
        'flex h-8 w-full shrink-0 items-center justify-center rounded-md border px-3 text-sm outline-none transition-[color,background-color,box-shadow] duration-[var(--duration-fast)] focus-visible:ring-[3px] focus-visible:ring-ring/50',
        unavailable
          ? 'cursor-not-allowed border-border bg-background font-normal text-muted-foreground opacity-50'
          : selected
            ? 'border-primary bg-primary font-medium text-primary-foreground'
            : 'border-border bg-background font-normal text-foreground hover:bg-accent hover:text-accent-foreground',
        className,
      )}
      {...props}
    >
      {time}
    </button>
  );
}

export { TimeSlot };
