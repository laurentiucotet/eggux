// EGG UI Color Swatch Group. Code only (no Figma component yet; the Color Picker page has Swatch and
// Swatch Picker for a product's color, this one is the form control for choosing one color of a fixed
// set: a theme accent, a label color, a tag color). A radio group of round swatches built on native
// radio inputs, so Tab enters the group, the arrows move and select, and form posts work. Each swatch
// is named by its color ("Orange"); the selected one has a check and a 2 px foreground ring with a
// gap, so it never relies on color alone. Sizes sm 24, default 32, lg 40 px. `allowCustom` adds a last
// swatch that opens the browser's color input; its value is any value not in the options. Colors are
// CSS values (`var(--chart-1)` in the library, a hex from the app's own data).
import * as React from 'react';
import { Check, Plus } from '@/components/icons';
import { cn } from '@/lib/utils';

export interface ColorSwatchOption {
  /** Value sent with the form and given to onValueChange. */
  value: string;
  /** Name of the color, read by screen readers and shown as a tooltip. */
  label: string;
  /** CSS color: `var(--chart-1)`, or a hex from the app's data. */
  color: string;
  disabled?: boolean;
}

export type ColorSwatchSize = 'sm' | 'default' | 'lg';

export interface ColorSwatchGroupProps extends Omit<React.ComponentProps<'div'>, 'defaultValue' | 'onChange' | 'role'> {
  options: ColorSwatchOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  size?: ColorSwatchSize;
  /** Name of the control when no Field label is tied to it ("Accent color"). */
  'aria-label'?: string;
  /** Add a last swatch that opens the browser's color input. */
  allowCustom?: boolean;
  /** Name of the custom swatch. */
  customLabel?: string;
  /** Show the name of the selected color under the swatches. */
  showSelectedName?: boolean;
  name?: string;
  disabled?: boolean;
  required?: boolean;
  invalid?: boolean;
}

const box: Record<ColorSwatchSize, string> = { sm: 'size-6', default: 'size-8', lg: 'size-10' };
const icon: Record<ColorSwatchSize, string> = { sm: '[&_svg]:size-3', default: '[&_svg]:size-4', lg: '[&_svg]:size-5' };

const ringBase =
  'rounded-full outline-none ring-offset-2 ring-offset-background transition-shadow duration-[var(--duration-fast)] motion-reduce:transition-none peer-focus-visible:ring-2 peer-focus-visible:ring-ring';
// Selected = a foreground ring; a focused selected swatch shows the focus ring instead.
const ringChecked = 'peer-checked:ring-2 peer-checked:ring-foreground peer-focus-visible:peer-checked:ring-ring peer-checked:[&>span]:flex';

function ColorSwatchGroup({
  options,
  value: valueProp,
  defaultValue,
  onValueChange,
  size = 'default',
  allowCustom = false,
  customLabel = 'Custom color',
  showSelectedName = true,
  name,
  disabled = false,
  required,
  invalid,
  id,
  className,
  'aria-invalid': ariaInvalid,
  ...props
}: ColorSwatchGroupProps) {
  const autoName = React.useId();
  const groupName = name ?? autoName;
  const [inner, setInner] = React.useState(defaultValue ?? '');
  const value = valueProp ?? inner;
  const set = (next: string) => {
    if (valueProp === undefined) setInner(next);
    onValueChange?.(next);
  };
  const selected = options.find(o => o.value === value);
  const isCustom = allowCustom && value !== '' && !selected;
  const [customColor, setCustomColor] = React.useState('');
  const custom = isCustom ? value : customColor;
  const nameId = `${React.useId()}-name`;

  return (
    <div
      data-slot="color-swatch-group"
      role="radiogroup"
      id={id}
      aria-required={required || undefined}
      aria-invalid={invalid || ariaInvalid || undefined}
      aria-disabled={disabled || undefined}
      className={cn('flex min-w-0 flex-col gap-2', className)}
      {...props}
    >
      {/* Room for the 2 px ring and its 2 px gap, so the ring is never clipped by a parent. */}
      <div className="flex min-w-0 flex-wrap gap-3 p-1">
        {options.map(o => (
          <label key={o.value} title={o.label} data-slot="color-swatch" className={cn('relative inline-flex shrink-0', box[size], (disabled || o.disabled) && 'opacity-50')}>
            <input
              type="radio"
              name={groupName}
              value={o.value}
              checked={value === o.value}
              disabled={disabled || o.disabled}
              required={required}
              onChange={() => set(o.value)}
              className="peer absolute inset-0 m-0 size-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
            />
            <span aria-hidden="true" style={{ backgroundColor: o.color }} className={cn('flex size-full items-center justify-center border border-foreground/20', ringBase, ringChecked, icon[size])}>
              <span className="hidden size-[60%] items-center justify-center rounded-full bg-background text-foreground">
                <Check />
              </span>
            </span>
            <span className="sr-only">{o.label}</span>
          </label>
        ))}
        {allowCustom ? (
          <label title={customLabel} data-slot="color-swatch-custom" className={cn('relative inline-flex shrink-0', box[size], disabled && 'opacity-50')}>
            <input
              type="color"
              aria-label={customLabel}
              disabled={disabled}
              value={/^#[0-9a-f]{6}$/i.test(custom) ? custom : '#000000'}
              onChange={e => {
                setCustomColor(e.target.value);
                set(e.target.value);
              }}
              className="peer absolute inset-0 m-0 size-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
            />
            <span
              aria-hidden="true"
              data-selected={isCustom ? '' : undefined}
              style={isCustom ? { backgroundColor: custom } : { backgroundImage: 'conic-gradient(var(--chart-8), var(--chart-4), var(--chart-6), var(--chart-3), var(--chart-1), var(--chart-5), var(--chart-8))' }}
              className={cn('flex size-full items-center justify-center border border-foreground/20', ringBase, icon[size], isCustom && 'ring-2 ring-foreground peer-focus-visible:ring-ring')}
            >
              <span className="flex size-[60%] items-center justify-center rounded-full bg-background text-foreground">{isCustom ? <Check /> : <Plus />}</span>
            </span>
            <span className="sr-only">{isCustom ? `, selected ${custom}` : ''}</span>
          </label>
        ) : null}
      </div>
      {showSelectedName ? (
        <p id={nameId} data-slot="color-swatch-name" className="m-0 min-h-5 truncate px-1 text-sm leading-5 text-muted-foreground">
          {selected ? selected.label : isCustom ? `${customLabel}: ${custom}` : 'No color selected'}
        </p>
      ) : null}
    </div>
  );
}

export { ColorSwatchGroup };
