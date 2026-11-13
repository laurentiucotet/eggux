// EGG UI Legend. Code only (no Figma component yet); Data Display family.
// A standalone chart legend whose items can switch a series on and off. Each item is a native button
// with aria-pressed (pressed = the series is shown); a hidden series gets a hollow swatch and a
// struck-through label, so the state never rests on color. The legend only reports the visible set:
// the chart it belongs to filters its own data. Controlled (hidden + onHiddenChange) or uncontrolled
// (defaultHidden). At least one series stays visible. Without toggles it is a plain list.
import * as React from 'react';
import { cn } from '@/lib/utils';
import { chartColor } from './charts';

export interface LegendItem {
  id: string;
  label: string;
  /** Optional value after the label ("EUR 42k"). */
  value?: string;
  /** A token color; defaults to the chart/N slot of the position. */
  color?: string;
}

export interface LegendProps extends Omit<React.ComponentProps<'ul'>, 'children' | 'defaultValue' | 'hidden'> {
  items: LegendItem[];
  /** Items can be switched off. Off: a static list. */
  toggleable?: boolean;
  /** Controlled list of hidden ids. */
  hidden?: string[];
  defaultHidden?: string[];
  onHiddenChange?: (hidden: string[]) => void;
}

function Legend({ items, toggleable = true, hidden, defaultHidden = [], onHiddenChange, className, 'aria-label': ariaLabel = 'Chart legend', ...props }: LegendProps) {
  const [inner, setInner] = React.useState<string[]>(defaultHidden);
  const off = hidden ?? inner;
  const toggle = (id: string) => {
    const isOff = off.includes(id);
    // The last visible series cannot be switched off.
    if (!isOff && items.filter(i => !off.includes(i.id)).length <= 1) return;
    const next = isOff ? off.filter(x => x !== id) : [...off, id];
    if (hidden === undefined) setInner(next);
    onHiddenChange?.(next);
  };
  return (
    <ul data-slot="legend" aria-label={ariaLabel} className={cn('m-0 flex w-full min-w-0 list-none flex-wrap items-center gap-x-2 gap-y-1 p-0', className)} {...props}>
      {items.map((item, i) => {
        const isOff = off.includes(item.id);
        const c = item.color ?? chartColor(i);
        const content = (
          <>
            <span
              aria-hidden="true"
              className="size-2.5 shrink-0 rounded-sm border-2"
              style={{ borderColor: c, background: isOff ? 'transparent' : c }}
            />
            <span className={cn('min-w-0 truncate', isOff ? 'text-muted-foreground line-through' : 'text-foreground')}>{item.label}</span>
            {item.value ? <span className="shrink-0 whitespace-nowrap font-medium text-foreground">{item.value}</span> : null}
          </>
        );
        return (
          <li key={item.id} data-slot="legend-item" data-state={isOff ? 'hidden' : 'shown'} className="flex min-w-0 max-w-full">
            {toggleable ? (
              <button
                type="button"
                aria-pressed={!isOff}
                onClick={() => toggle(item.id)}
                className="inline-flex min-h-6 min-w-0 max-w-full items-center gap-1.5 rounded-sm px-1.5 py-0.5 text-xs leading-4 outline-none hover:bg-accent focus-visible:shadow-[0_0_0_2px_var(--background),0_0_0_4px_var(--ring)]"
              >
                {content}
              </button>
            ) : (
              <span className="inline-flex min-w-0 max-w-full items-center gap-1.5 px-1.5 py-0.5 text-xs leading-4">{content}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export { Legend };
