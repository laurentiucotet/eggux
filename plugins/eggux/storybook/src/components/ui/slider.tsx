// EGG UI Slider. Figma: Slider (Slider page, "Slider / Component", 98:42). Type (single, range),
// State (default, focus, disabled), Value, Show value, Show marks. shadcn Slider on the radix-ui
// primitive: a 16 high box with a 6 px muted track, the range in primary and 16 px round thumbs
// (background, 1 px primary border, shadow sm); range thumbs cannot cross. Show value puts a primary
// bubble (ui/caption, 12 / 6 padding, radius md, 10 × 5 arrow) 4 px above each thumb; Show marks puts
// min, mid and max labels (ui/caption muted) 8 px under the box, the ends anchored to the edges.
// Leave 40 px above and 24 below when either is on. Disabled at 50%.
// A11y: each thumb is a slider with a name ("Minimum price") and a value text with the unit
// ("150 EUR"); arrows move one step, Page Up / Down ten.
import * as React from 'react';
import { Slider as SliderPrimitive } from 'radix-ui';
import { cn } from '@/lib/utils';

export interface SliderProps extends Omit<React.ComponentProps<typeof SliderPrimitive.Root>, 'children'> {
  /** One name per thumb: ['Minimum price', 'Maximum price']. */
  thumbLabels?: string[];
  /** Value text with the unit, for screen readers and the bubble: v => `${v} EUR`. */
  formatValue?: (value: number) => string;
  /** Figma Show value: a bubble over each thumb. */
  showValue?: boolean;
  /** Figma Show marks: [min, mid, max] labels under the track. */
  marks?: [React.ReactNode, React.ReactNode, React.ReactNode];
}

function Slider({ value, defaultValue, min = 0, max = 100, thumbLabels, formatValue = v => String(v), showValue = false, marks, className, onValueChange, ...props }: SliderProps) {
  const [inner, setInner] = React.useState<number[]>(defaultValue ?? [min]);
  const values = value ?? inner;
  return (
    <div data-slot="slider-field" className={cn('relative w-full', className)}>
      <SliderPrimitive.Root
        data-slot="slider"
        value={value}
        defaultValue={defaultValue}
        min={min}
        max={max}
        onValueChange={v => {
          setInner(v);
          onValueChange?.(v);
        }}
        className="relative flex h-4 w-full touch-none items-center select-none data-[disabled]:opacity-50"
        {...props}
      >
        <SliderPrimitive.Track data-slot="slider-track" className="relative h-1.5 grow overflow-hidden rounded-full bg-muted">
          <SliderPrimitive.Range data-slot="slider-range" className="absolute h-full rounded-full bg-primary" />
        </SliderPrimitive.Track>
        {values.map((v, i) => (
          <SliderPrimitive.Thumb
            key={i}
            data-slot="slider-thumb"
            aria-label={thumbLabels?.[i]}
            aria-valuetext={formatValue(v)}
            className="relative block size-4 rounded-full border border-primary bg-background shadow-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 data-[disabled]:pointer-events-none"
          >
            {showValue ? (
              <span data-slot="slider-value" aria-hidden="true" className="pointer-events-none absolute bottom-full left-1/2 mb-1 flex -translate-x-1/2 flex-col items-center">
                <span className="rounded-md bg-primary px-3 py-1.5 text-xs leading-4 whitespace-nowrap text-primary-foreground">{formatValue(v)}</span>
                <svg width="10" height="5" viewBox="0 0 10 5" aria-hidden="true" className="block fill-primary"><path d="M0 0h10L5 5z" /></svg>
              </span>
            ) : null}
          </SliderPrimitive.Thumb>
        ))}
      </SliderPrimitive.Root>
      {marks ? (
        <div data-slot="slider-marks" aria-hidden="true" className="relative mt-2 h-4 text-xs leading-4 whitespace-nowrap text-muted-foreground">
          <span className="absolute left-0">{marks[0]}</span>
          <span className="absolute left-1/2 -translate-x-1/2">{marks[1]}</span>
          <span className="absolute right-0">{marks[2]}</span>
        </div>
      ) : null}
    </div>
  );
}

export { Slider };
