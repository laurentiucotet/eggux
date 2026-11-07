// EGG UI Color Picker page: Color Picker (149:298), Swatch (441:1462), Swatch Picker (432:4007),
// Color Input (1097:113197).
// Color Picker: 264 popover surface (min 240), 12 padding and gap: a 160 high saturation area
// (white → hue, black at the bottom) with a 14 px knob, a 12 high hue slider with a 16 px knob, an
// Input Group "#" + hex + opacity, and 24 px preset swatches (chart/1..8, selected with a 2 px ring).
// Keyboard: the area is one slider (Left / Right saturation, Up / Down brightness, Shift = 10), the
// hue is a slider (Left / Right, Shift = 10); the hex input is the typing path (3 or 6 digits,
// with or without #).
// Swatch: a color dot (sm 28 / 20, default 36 / 26) or a short label (36 high, 12 sides); selected
// = 2 px foreground ring; unavailable = 40% and "out of stock" in its name, still focusable.
// Swatch Picker: a radio group of sm swatches, 4 apart, the selected name under them.
// Color Input: 240 wide (min 180) field: 20 px swatch button opening Color Picker in a Popover,
// the hex input, optional opacity; an invalid hex shows the error border.
import * as React from 'react';
import { cn } from '@/lib/utils';
import { InputGroup } from './input-group';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

/* Color math */

export interface Hsv { h: number; s: number; v: number }

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/** "#2563eb", "2563EB", "#abc" → "#2563EB", or null. */
function normalizeHex(input: string): string | null {
  const s = input.trim().replace(/^#/, '');
  if (/^[0-9a-f]{3}$/i.test(s)) return `#${s.split('').map(c => c + c).join('')}`.toUpperCase();
  if (/^[0-9a-f]{6}$/i.test(s)) return `#${s}`.toUpperCase();
  return null;
}

function hexToHsv(hex: string): Hsv {
  const n = normalizeHex(hex) ?? '#000000';
  const r = parseInt(n.slice(1, 3), 16) / 255, g = parseInt(n.slice(3, 5), 16) / 255, b = parseInt(n.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), d = max - Math.min(r, g, b);
  let h = 0;
  if (d) h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return { h: ((h * 60) + 360) % 360, s: max ? d / max : 0, v: max };
}

function hsvToHex({ h, s, v }: Hsv): string {
  const f = (n: number) => {
    const k = (n + h / 60) % 6;
    return Math.round((v - v * s * Math.max(0, Math.min(k, 4 - k, 1))) * 255).toString(16).padStart(2, '0');
  };
  return `#${f(5)}${f(3)}${f(1)}`.toUpperCase();
}

/* Color Picker */

export interface ColorPreset { value: string; name: string }

/** The chart/1..8 hues (Light values): the picker stores hex, so presets are hex. */
export const chartPresets: ColorPreset[] = [
  { value: '#2563EB', name: 'Blue' },
  { value: '#C2410C', name: 'Orange' },
  { value: '#0891B2', name: 'Cyan' },
  { value: '#B45309', name: 'Amber' },
  { value: '#D946EF', name: 'Fuchsia' },
  { value: '#16A34A', name: 'Green' },
  { value: '#8B5CF6', name: 'Violet' },
  { value: '#F43F5E', name: 'Rose' },
];

export interface ColorPickerProps extends Omit<React.ComponentProps<'div'>, 'onChange' | 'defaultValue'> {
  /** Hex, "#2563EB". */
  value?: string;
  defaultValue?: string;
  onValueChange?: (hex: string) => void;
  /** Opacity in percent; shown after the hex. */
  opacity?: number;
  /** Preset swatches: hex values with names. */
  presets?: ColorPreset[];
}

const knob = 'absolute rounded-full border-2 border-white shadow-[0_0_0_1px_rgb(0_0_0/0.3),0_1px_3px_rgb(0_0_0/0.3)] outline-none';

function useDrag(onMove: (x: number, y: number) => void) {
  return (e: React.PointerEvent<HTMLElement>) => {
    const el = e.currentTarget;
    el.focus();
    const at = (ev: { clientX: number; clientY: number }) => {
      const r = el.getBoundingClientRect();
      onMove(clamp((ev.clientX - r.left) / r.width, 0, 1), clamp((ev.clientY - r.top) / r.height, 0, 1));
    };
    at(e);
    el.setPointerCapture?.(e.pointerId);
    const move = (ev: PointerEvent) => at(ev);
    const up = () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerup', up); };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
  };
}

function ColorPicker({ value, defaultValue = '#2563EB', onValueChange, opacity = 100, presets, className, ...props }: ColorPickerProps) {
  const [inner, setInner] = React.useState(normalizeHex(defaultValue) ?? '#2563EB');
  const hex = normalizeHex(value ?? inner) ?? inner;
  const [hsv, setHsv] = React.useState<Hsv>(() => hexToHsv(hex));
  const [draft, setDraft] = React.useState(hex.slice(1));
  // Follow outside changes without losing the hue on greys.
  React.useEffect(() => {
    if (hsvToHex(hsv) !== hex) setHsv(prev => { const n = hexToHsv(hex); return n.s === 0 ? { ...n, h: prev.h } : n; });
    setDraft(hex.slice(1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hex]);
  const commit = (next: Hsv) => {
    setHsv(next);
    const h = hsvToHex(next);
    setInner(h);
    setDraft(h.slice(1));
    onValueChange?.(h);
  };
  const areaDown = useDrag((x, y) => commit({ ...hsv, s: x, v: 1 - y }));
  const hueDown = useDrag(x => commit({ ...hsv, h: Math.round(x * 360) % 360 }));
  const step = (e: React.KeyboardEvent) => (e.shiftKey ? 10 : 1);
  const hueColor = hsvToHex({ h: hsv.h, s: 1, v: 1 });
  const s = Math.round(hsv.s * 100), v = Math.round(hsv.v * 100);
  const items = presets ?? [];
  return (
    <div data-slot="color-picker" className={cn('flex w-[264px] min-w-60 flex-col gap-3 rounded-md border border-border bg-popover p-3 text-popover-foreground shadow-md', className)} {...props}>
      <div
        role="slider"
        tabIndex={0}
        aria-label="Saturation and brightness"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={s}
        aria-valuetext={`Saturation ${s}%, brightness ${v}%`}
        data-slot="color-area"
        onPointerDown={areaDown}
        onKeyDown={e => {
          const d = step(e) / 100;
          const map: Record<string, Partial<Hsv>> = { ArrowRight: { s: clamp(hsv.s + d, 0, 1) }, ArrowLeft: { s: clamp(hsv.s - d, 0, 1) }, ArrowUp: { v: clamp(hsv.v + d, 0, 1) }, ArrowDown: { v: clamp(hsv.v - d, 0, 1) } };
          if (map[e.key]) { e.preventDefault(); commit({ ...hsv, ...map[e.key] }); }
        }}
        className="relative h-40 w-full cursor-crosshair touch-none rounded-md outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        style={{ background: `linear-gradient(to bottom, transparent, #000), linear-gradient(to right, #fff, transparent), ${hueColor}` }}
      >
        <span className={cn(knob, 'size-3.5 -translate-x-1/2 -translate-y-1/2')} style={{ left: `${hsv.s * 100}%`, top: `${(1 - hsv.v) * 100}%`, background: hex }} />
      </div>
      <div
        role="slider"
        tabIndex={0}
        aria-label="Hue"
        aria-valuemin={0}
        aria-valuemax={359}
        aria-valuenow={Math.round(hsv.h)}
        aria-valuetext={`${Math.round(hsv.h)} degrees`}
        data-slot="color-hue"
        onPointerDown={hueDown}
        onKeyDown={e => {
          const d = step(e);
          if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); commit({ ...hsv, h: (hsv.h + d) % 360 }); }
          else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); commit({ ...hsv, h: (hsv.h - d + 360) % 360 }); }
        }}
        className="relative h-3 w-full cursor-pointer touch-none rounded-full outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        style={{ background: 'linear-gradient(to right, #f00 0%, #ff0 16.667%, #0f0 33.333%, #0ff 50%, #00f 66.667%, #f0f 83.333%, #f00 100%)' }}
      >
        <span className={cn(knob, 'top-1/2 size-4 -translate-x-1/2 -translate-y-1/2')} style={{ left: `${(hsv.h / 360) * 100}%`, background: hueColor }} />
      </div>
      <InputGroup
        aria-label="Hex color"
        start="#"
        end={`${opacity}%`}
        value={draft}
        maxLength={7}
        spellCheck={false}
        aria-invalid={normalizeHex(draft) ? undefined : true}
        onChange={e => {
          setDraft(e.target.value.replace(/^#/, ''));
          const n = normalizeHex(e.target.value);
          if (n && (e.target.value.replace(/^#/, '').length === 6)) commit(hexToHsv(n));
        }}
        onBlur={() => { const n = normalizeHex(draft); if (n) commit(hexToHsv(n)); else setDraft(hex.slice(1)); }}
        onKeyDown={e => { if (e.key === 'Enter') { const n = normalizeHex(draft); if (n) commit(hexToHsv(n)); } }}
        inputClassName="uppercase"
      />
      {items.length ? (
        <div role="group" aria-label="Presets" className="flex flex-wrap gap-1.5">
          {items.map(p => {
            const selected = normalizeHex(p.value) === hex;
            return (
              <button
                key={p.value}
                type="button"
                aria-label={p.name}
                aria-pressed={selected}
                onClick={() => { const n = normalizeHex(p.value); if (n) commit(hexToHsv(n)); }}
                className={cn('size-6 cursor-pointer rounded-md outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50', selected && 'ring-2 ring-ring ring-inset')}
                style={{ background: p.value }}
              />
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

/* Swatch */

export interface SwatchProps extends Omit<React.ComponentProps<'button'>, 'children' | 'color'> {
  /** Type=color: a CSS color or token ("var(--chart-1)"). */
  color?: string;
  /** Type=label: a short text ("M"). */
  label?: string;
  /** Accessible name and the caption under it ("Blue", "Medium"). */
  name: string;
  size?: 'sm' | 'default';
  selected?: boolean;
  /** Faded, still focusable; "out of stock" is added to the name. */
  unavailable?: boolean;
  /** Figma Show name: the name under the swatch. */
  showName?: boolean;
  /** Inside Swatch Picker the swatch is a radio. */
  asRadio?: boolean;
}

function Swatch({ color, label, name, size = 'default', selected = false, unavailable = false, showName = false, asRadio = false, className, onClick, ...props }: SwatchProps) {
  const isLabel = label !== undefined;
  const sm = size === 'sm';
  return (
    <span data-slot="swatch-item" className="inline-flex flex-col items-center gap-1.5">
      <button
        type="button"
        data-slot="swatch"
        data-state={selected ? 'selected' : unavailable ? 'unavailable' : 'default'}
        role={asRadio ? 'radio' : undefined}
        aria-checked={asRadio ? selected : undefined}
        aria-pressed={asRadio ? undefined : selected}
        // The visible label is part of the name (S, M, L); the full name and stock follow.
        aria-label={`${isLabel && label !== name ? `${label}, ${name}` : name}${unavailable ? ', out of stock' : ''}`}
        aria-disabled={unavailable || undefined}
        onClick={e => { if (!unavailable) onClick?.(e); }}
        className={cn(
          'flex shrink-0 cursor-pointer items-center justify-center bg-background outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
          selected ? 'border-2 border-foreground' : 'border border-border',
          isLabel ? 'h-9 rounded-md px-3 text-sm leading-5 font-medium text-foreground' : cn('rounded-full', sm ? 'size-7' : 'size-9'),
          unavailable && 'cursor-not-allowed opacity-40',
          className,
        )}
        {...props}
      >
        {isLabel ? label : <span aria-hidden="true" className={cn('rounded-full', sm ? 'size-5' : 'size-[26px]')} style={{ background: color }} />}
      </button>
      {showName ? <span aria-hidden="true" className="text-xs leading-4 whitespace-nowrap text-muted-foreground">{name}</span> : null}
    </span>
  );
}

/* Swatch Picker */

export interface SwatchPickerProps extends Omit<React.ComponentProps<'div'>, 'onChange' | 'defaultValue'> {
  /** Group name for screen readers: "Label color". */
  label: string;
  colors: { value: string; name: string }[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Figma Show label: the selected name under the swatches. Default true. */
  showLabel?: boolean;
}

function SwatchPicker({ label, colors, value, defaultValue, onValueChange, showLabel = true, className, ...props }: SwatchPickerProps) {
  const [inner, setInner] = React.useState(defaultValue ?? colors[0]?.value ?? '');
  const current = value ?? inner;
  const refs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const index = Math.max(0, colors.findIndex(c => c.value === current));
  const pick = (i: number) => {
    const c = colors[(i + colors.length) % colors.length]!;
    setInner(c.value);
    onValueChange?.(c.value);
    refs.current[(i + colors.length) % colors.length]?.focus();
  };
  return (
    <div data-slot="swatch-picker" className={cn('flex w-[252px] max-w-full flex-col gap-2', className)} {...props}>
      <div
        role="radiogroup"
        aria-label={label}
        className="flex flex-wrap items-center gap-1"
        onKeyDown={e => {
          if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); pick(index + 1); }
          else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); pick(index - 1); }
        }}
      >
        {colors.map((c, i) => (
          <Swatch
            key={c.value}
            ref={el => { refs.current[i] = el; }}
            asRadio
            size="sm"
            color={c.value}
            name={c.name}
            selected={i === index}
            tabIndex={i === index ? 0 : -1}
            onClick={() => pick(i)}
          />
        ))}
      </div>
      {showLabel ? <p aria-hidden="true" className="m-0 truncate text-xs leading-4 text-muted-foreground">{colors[index]?.name}</p> : null}
    </div>
  );
}

/* Color Input */

export interface ColorInputProps extends Omit<React.ComponentProps<'div'>, 'onChange' | 'defaultValue'> {
  /** Accessible name when not inside a Field ("Brand color"). */
  label?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (hex: string) => void;
  /** Figma Show opacity. */
  opacity?: number;
  presets?: ColorPreset[];
  disabled?: boolean;
  /** From Field. */
  id?: string;
  'aria-describedby'?: string;
}

function ColorInput({ label = 'Color', value, defaultValue = '#2563EB', onValueChange, opacity, presets = [], disabled, id, 'aria-describedby': describedBy, className, ...props }: ColorInputProps) {
  const [inner, setInner] = React.useState(normalizeHex(defaultValue) ?? '#2563EB');
  const hex = normalizeHex(value ?? inner) ?? inner;
  const [text, setText] = React.useState(hex);
  React.useEffect(() => setText(hex), [hex]);
  const valid = normalizeHex(text) !== null;
  const set = (h: string) => { setInner(h); setText(h); onValueChange?.(h); };
  return (
    <div data-slot="color-input" className={cn('w-60 min-w-[180px]', className)} {...props}>
      <Popover>
        <InputGroup
          id={id}
          aria-label={label}
          aria-describedby={describedBy}
          aria-invalid={valid ? undefined : true}
          disabled={disabled}
          value={text}
          spellCheck={false}
          maxLength={7}
          onChange={e => {
            setText(e.target.value);
            const n = normalizeHex(e.target.value);
            if (n && e.target.value.replace(/^#/, '').length === 6) { setInner(n); onValueChange?.(n); }
          }}
          onBlur={() => { const n = normalizeHex(text); if (n) set(n); }}
          inputClassName="pl-2 uppercase"
          start={
            <PopoverTrigger asChild>
              <button
                type="button"
                aria-label={`Pick ${label.toLowerCase()}, ${hex}`}
                data-slot="color-input-swatch"
                className="ml-3 size-5 shrink-0 cursor-pointer self-center rounded-sm border border-border outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                style={{ background: hex }}
              />
            </PopoverTrigger>
          }
          end={opacity !== undefined ? <span className="flex items-center pr-3 text-sm leading-5 text-muted-foreground">{opacity}%</span> : undefined}
        />
        <PopoverContent className="w-auto border-0 bg-transparent p-0 shadow-none">
          <ColorPicker value={hex} onValueChange={set} opacity={opacity ?? 100} presets={presets} />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export { ColorInput, ColorPicker, Swatch, SwatchPicker, hexToHsv, hsvToHex, normalizeHex };
