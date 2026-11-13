// EGG UI Wheel Picker. Code only (no Figma component yet). The scrolling column picker of phones: pick
// one value by spinning a column under a fixed selection band (a time, a quantity, a duration, a
// country code). Several columns sit side by side in a WheelPicker. Each column is a listbox: scroll
// or swipe snaps to the nearest row, a tap on a row selects it, Up/Down arrows move one row, Home and
// End jump, and the selected row is `aria-selected`. Rows are 44 high. On desktop prefer a Select; use
// this where a thumb is the input.
import * as React from 'react';
import { cn } from '@/lib/utils';

const ROW = 44;
const VISIBLE = 5;

export interface WheelOption {
  value: string;
  label: string;
}

export interface WheelColumnProps extends Omit<React.ComponentProps<'div'>, 'onChange'> {
  /** Accessible name of the column ("Hours"). */
  label: string;
  options: WheelOption[];
  value: string;
  onValueChange: (value: string) => void;
}

function WheelColumn({ label, options, value, onValueChange, className, ...props }: WheelColumnProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const timer = React.useRef<number | undefined>(undefined);
  const programmatic = React.useRef(false);
  const index = Math.max(0, options.findIndex(o => o.value === value));
  const pad = ((VISIBLE - 1) / 2) * ROW;

  // Put the selected row under the band whenever the value changes from outside the scroll.
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (Math.abs(el.scrollTop - index * ROW) < 1) return;
    programmatic.current = true;
    el.scrollTop = index * ROW;
    window.setTimeout(() => {
      programmatic.current = false;
    }, 120);
  }, [index]);

  const settle = () => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      const el = ref.current;
      if (!el || programmatic.current) return;
      const next = Math.min(options.length - 1, Math.max(0, Math.round(el.scrollTop / ROW)));
      const option = options[next];
      if (option && option.value !== value) onValueChange(option.value);
    }, 90);
  };

  const move = (to: number) => {
    const option = options[Math.min(options.length - 1, Math.max(0, to))];
    if (option) onValueChange(option.value);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const keys: Record<string, number> = { ArrowUp: index - 1, ArrowDown: index + 1, Home: 0, End: options.length - 1 };
    if (e.key in keys) {
      e.preventDefault();
      move(keys[e.key]!);
    }
  };

  return (
    <div
      ref={ref}
      data-slot="wheel-column"
      role="listbox"
      aria-label={label}
      aria-activedescendant={`${label}-${index}`.replace(/\s+/g, '-')}
      tabIndex={0}
      onScroll={settle}
      onKeyDown={onKeyDown}
      className={cn('h-full min-w-16 flex-1 snap-y snap-mandatory overflow-y-auto overscroll-contain rounded-md text-center outline-none [scrollbar-width:none] focus-visible:ring-[3px] focus-visible:ring-ring/50 [&::-webkit-scrollbar]:hidden', className)}
      style={{ paddingBlock: pad }}
      {...props}
    >
      {options.map((o, i) => (
        <div
          key={o.value}
          id={`${label}-${i}`.replace(/\s+/g, '-')}
          role="option"
          aria-selected={i === index}
          onClick={() => onValueChange(o.value)}
          className={cn('flex snap-center items-center justify-center truncate px-2 text-lg leading-7', i === index ? 'font-semibold text-foreground' : 'text-muted-foreground')}
          style={{ height: ROW }}
        >
          {o.label}
        </div>
      ))}
    </div>
  );
}

function WheelPicker({ className, children, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="wheel-picker"
      role="group"
      className={cn('relative flex w-full max-w-xs gap-1 overflow-hidden rounded-xl border border-border bg-card text-card-foreground', className)}
      style={{ height: ROW * VISIBLE }}
      {...props}
    >
      {/* The selection band; rows scroll under it. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-2 top-1/2 -translate-y-1/2 rounded-lg bg-muted/60" style={{ height: ROW }} />
      <div className="relative flex w-full">{children}</div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,var(--card),transparent_30%,transparent_70%,var(--card))]" />
    </div>
  );
}

export { WheelColumn, WheelPicker };
