// EGG UI Segmented Control. Code only (no Figma component yet). Mobile page. An iOS-style control
// of 2 to 5 short options in one muted track with a thumb that slides to the chosen one. It is a
// radio group (role radiogroup, role radio, aria-checked), so exactly one option is always chosen:
// Left/Up and Right/Down move AND choose (wrapping), Home and End jump, and only the chosen option is
// in the tab order. 44 high (touch target), options share the width equally and truncate. The thumb
// only slides when motion is allowed. Not for turning a setting on or off (use a Switch) and not
// for more than 5 options (use a Select). The Toggle Group "segmented" variant is for toolbars with
// several values on at once and has no thumb.
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SegmentedOption {
  value: string;
  label: string;
  /** An icon from `@/components/icons`, shown before the label. */
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface SegmentedControlProps extends Omit<React.ComponentProps<'div'>, 'onChange' | 'defaultValue'> {
  /** 2 to 5 options. */
  options: SegmentedOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Accessible name of the group: what is being chosen ("Billing period"). */
  label: string;
  /** Fill the width (default) or hug the options. */
  fullWidth?: boolean;
  disabled?: boolean;
}

function SegmentedControl({ options, value, defaultValue, onValueChange, label, fullWidth = true, disabled = false, className, onKeyDown, ...props }: SegmentedControlProps) {
  const [inner, setInner] = React.useState(defaultValue ?? options.find(o => !o.disabled)?.value);
  const current = value ?? inner;
  const refs = React.useRef<Record<string, HTMLButtonElement | null>>({});
  const count = options.length;
  const index = Math.max(0, options.findIndex(o => o.value === current));

  const choose = (next: string, focus = false) => {
    setInner(next);
    onValueChange?.(next);
    if (focus) refs.current[next]?.focus();
  };

  const move = (from: number, step: 1 | -1) => {
    for (let i = 1; i <= count; i++) {
      const o = options[(from + step * i + count * i) % count];
      if (!o.disabled) return choose(o.value, true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented || disabled) return;
    const at = options.findIndex(o => refs.current[o.value] === document.activeElement);
    if (at < 0) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); move(at, 1); }
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); move(at, -1); }
    else if (e.key === 'Home') { e.preventDefault(); const o = options.find(x => !x.disabled); if (o) choose(o.value, true); }
    else if (e.key === 'End') { e.preventDefault(); const o = [...options].reverse().find(x => !x.disabled); if (o) choose(o.value, true); }
  };

  return (
    <div
      role="radiogroup"
      aria-label={label}
      aria-disabled={disabled || undefined}
      data-slot="segmented-control"
      onKeyDown={handleKeyDown}
      className={cn('relative min-w-0 rounded-lg bg-muted', fullWidth ? 'w-full' : 'w-fit max-w-full', disabled && 'opacity-50', className)}
      {...props}
    >
      <div className="relative grid min-w-0" style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}>
        <span
          aria-hidden="true"
          data-slot="segmented-control-thumb"
          className="pointer-events-none absolute inset-y-0 left-0 p-1 motion-safe:transition-transform motion-safe:duration-[var(--duration-fast)]"
          style={{ width: `${100 / count}%`, transform: `translateX(${index * 100}%)` }}
        >
          <span className="block size-full rounded-md bg-background shadow-xs" />
        </span>
        {options.map(o => {
          const checked = o.value === current;
          return (
            <button
              key={o.value}
              ref={el => { refs.current[o.value] = el; }}
              type="button"
              role="radio"
              aria-checked={checked}
              disabled={disabled || o.disabled}
              tabIndex={checked ? 0 : -1}
              onClick={() => choose(o.value)}
              className={cn(
                'relative flex h-11 min-w-0 items-center justify-center gap-1.5 rounded-md px-3 text-sm leading-5 text-foreground outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0',
                checked ? 'font-semibold' : 'font-medium',
              )}
            >
              {o.icon}
              <span className="min-w-0 truncate">{o.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export { SegmentedControl };
