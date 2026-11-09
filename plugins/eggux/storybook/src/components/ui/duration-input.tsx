// EGG UI Duration Input. Figma: Duration Input (Input page, "Duration Input / Component"). State
// (default, focus, error), Hours ("1"), Minutes ("30"). One 200 x 36 field (min 160) with the hours
// and its "h" unit, 8 px, then the minutes and "min"; values hug up to 24 and units up to 28, all
// truncating with an ellipsis. The value is stored as minutes. "1:30" or "1.5h" in the hours, or
// "90" in the minutes, normalize to 1 h 30 min when focus leaves the field; minutes above 59 roll
// into hours. Arrow keys step by 1 (an hour or a minute). After normalizing, a polite status reads
// the value back ("1 hour 30 minutes"). Above `max` the field turns to State=error and the limit is
// said under it ("Up to 24 h per entry").
// The "h" and "min" units are rendered inside the field here; switch them to Input Addon once that
// exists. Inside a Field: the Field id goes on the hours input, the Field label names the group.
import * as React from 'react';
import { CircleAlert } from '@/components/icons';
import { cn } from '@/lib/utils';
import { formatDuration } from './calendar-date';

export interface DurationInputProps
  extends Omit<React.ComponentProps<'div'>, 'defaultValue' | 'onChange' | 'children'> {
  /** Duration in minutes (Figma Hours and Minutes: 90 = 1 h 30 min). Controlled when given; null is empty. */
  value?: number | null;
  defaultValue?: number | null;
  /** Called with the normalized minutes when focus leaves the field (null when emptied). */
  onValueChange?: (minutes: number | null) => void;
  /** Upper limit in minutes; above it the field shows maxErrorText. */
  max?: number;
  maxErrorText?: string;
  /** Name of the group when no Field label names it ("Time spent"). */
  label?: string;
  /** Figma State=error, set by the app (for example a Field error). */
  invalid?: boolean;
  disabled?: boolean;
  required?: boolean;
  /** Texts translated by the app. */
  labels?: { hours?: string; minutes?: string; hourUnit?: string; minuteUnit?: string };
}

/** The Field label (label[for=id]) names the group: a label cannot name a div by itself. */
function useFieldLabelId(id: string | undefined) {
  const [labelId, setLabelId] = React.useState<string>();
  React.useLayoutEffect(() => {
    if (!id) return;
    const label = document.querySelector<HTMLLabelElement>(`label[for="${CSS.escape(id)}"]`);
    if (!label) return;
    if (!label.id) label.id = `${id}-label`;
    setLabelId(label.id);
  }, [id]);
  return labelId;
}

/**
 * Hours and minutes as typed -> minutes. Hours accept "1", "1:30", "1.5", "1.5h", "1,5 h", "90m";
 * minutes accept a number and roll over 59. Returns null when both are empty, NaN when unreadable.
 */
export function parseDuration(hoursText: string, minutesText: string): number | null {
  const h = hoursText.trim().toLowerCase();
  const m = minutesText.trim().toLowerCase().replace(/\s*(min|m)$/, '');
  if (!h && !m) return null;
  let total = 0;
  if (h) {
    const clock = h.match(/^(\d+)\s*:\s*(\d{1,2})$/);
    const mins = h.match(/^(\d+)\s*(min|m)$/);
    const hours = h.match(/^(\d+(?:[.,]\d+)?)\s*(h|hr|hours?)?$/);
    if (clock) total += Number(clock[1]) * 60 + Number(clock[2]);
    else if (mins) total += Number(mins[1]);
    else if (hours) total += Math.round(Number(hours[1].replace(',', '.')) * 60);
    else return NaN;
  }
  if (m) {
    if (!/^\d+$/.test(m)) return NaN;
    total += Number(m);
  }
  return total;
}

/** "1 hour 30 minutes", "45 minutes", "2 hours", "0 minutes": the read-back after blur. */
export function formatDurationLong(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const parts = [h ? `${h} ${h === 1 ? 'hour' : 'hours'}` : '', m ? `${m} ${m === 1 ? 'minute' : 'minutes'}` : ''];
  return parts.filter(Boolean).join(' ') || '0 minutes';
}

const split = (minutes: number | null | undefined) =>
  minutes == null ? { h: '', m: '' } : { h: String(Math.floor(minutes / 60)), m: String(minutes % 60) };

// Values hug their digits (field-sizing) between 1ch and 24 px; units hug up to 28; both truncate.
const valueClass =
  'field-sizing-content min-w-[1ch] max-w-6 shrink-0 truncate bg-transparent text-sm leading-5 text-foreground outline-none disabled:cursor-not-allowed';
const unitClass = 'max-w-7 shrink-0 truncate text-sm leading-5 text-muted-foreground';

function DurationInput({
  value: valueProp,
  defaultValue = null,
  onValueChange,
  max,
  maxErrorText,
  label,
  invalid: invalidProp,
  disabled,
  required,
  labels,
  id,
  className,
  'aria-describedby': describedByProp,
  'aria-invalid': ariaInvalid,
  'aria-required': ariaRequired,
  ...props
}: DurationInputProps) {
  const autoId = React.useId();
  const baseId = id ?? autoId;
  const errorId = `${baseId}-error`;
  const fieldLabelId = useFieldLabelId(id);
  const hoursRef = React.useRef<HTMLInputElement>(null);
  const minutesRef = React.useRef<HTMLInputElement>(null);
  const t = { hours: 'Hours', minutes: 'Minutes', hourUnit: 'h', minuteUnit: 'min', ...labels };

  const [inner, setInner] = React.useState<number | null>(defaultValue);
  const value = valueProp !== undefined ? valueProp : inner;
  const [text, setText] = React.useState(split(value));
  const [readBack, setReadBack] = React.useState('');
  const [unreadable, setUnreadable] = React.useState(false);
  const editing = React.useRef(false);

  React.useEffect(() => {
    if (valueProp !== undefined && !editing.current) setText(split(valueProp));
  }, [valueProp]);

  const overMax = max !== undefined && value != null && value > max;
  const invalid = Boolean(invalidProp || overMax || unreadable || ariaInvalid === true || ariaInvalid === 'true');
  const message = unreadable
    ? 'Enter a duration like 1:30, 90 or 1.5h'
    : overMax
      ? maxErrorText ?? `Up to ${formatDuration(max!)} per entry`
      : null;
  const describedBy = [describedByProp, message ? errorId : null].filter(Boolean).join(' ') || undefined;

  const commit = (next: number | null) => {
    setInner(next);
    setText(split(next));
    onValueChange?.(next);
  };

  const normalize = () => {
    editing.current = false;
    const parsed = parseDuration(text.h, text.m);
    if (Number.isNaN(parsed)) {
      setUnreadable(true);
      return;
    }
    setUnreadable(false);
    if (parsed !== value || text.h !== split(parsed).h || text.m !== split(parsed).m) commit(parsed);
    setReadBack(parsed == null ? '' : formatDurationLong(parsed));
  };

  const step = (by: number) => {
    const current = parseDuration(text.h, text.m);
    const next = Math.max(0, (Number.isNaN(current) || current == null ? 0 : current) + by);
    setUnreadable(false);
    commit(next);
  };

  const input = (part: 'h' | 'm') => {
    const ref = part === 'h' ? hoursRef : minutesRef;
    return (
      <input
        ref={ref}
        id={part === 'h' ? id : undefined}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        data-slot={part === 'h' ? 'duration-input-hours' : 'duration-input-minutes'}
        aria-label={part === 'h' ? t.hours : t.minutes}
        aria-describedby={describedBy}
        aria-invalid={invalid || undefined}
        aria-required={part === 'h' && (required || ariaRequired) ? true : undefined}
        disabled={disabled}
        placeholder="0"
        value={text[part]}
        onChange={e => {
          editing.current = true;
          setText(prev => ({ ...prev, [part]: e.target.value }));
        }}
        onKeyDown={e => {
          if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault();
            step((e.key === 'ArrowUp' ? 1 : -1) * (part === 'h' ? 60 : 1));
          } else if (e.key === 'Enter') normalize();
        }}
        className={valueClass}
      />
    );
  };

  return (
    <div data-slot="duration-input" data-state={invalid ? 'error' : 'default'} className={cn('flex w-50 min-w-40 flex-col gap-2', className)} {...props}>
      <div
        role="group"
        aria-label={fieldLabelId ? undefined : label}
        aria-labelledby={fieldLabelId}
        data-invalid={invalid ? '' : undefined}
        data-disabled={disabled ? '' : undefined}
        className="flex h-[var(--control-height)] w-full min-w-0 cursor-text items-center gap-1 overflow-hidden rounded-input border border-input bg-background px-3 shadow-xs transition-[color,box-shadow,border-color] duration-[var(--duration-fast)] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50 data-[invalid]:border-destructive data-[invalid]:ring-destructive/20 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50"
        onMouseDown={e => {
          // Units and padding put the caret in the nearest input: the minutes from its unit on.
          const target = e.target as HTMLElement;
          if (target.tagName === 'INPUT') return;
          e.preventDefault();
          const minutesLeft = minutesRef.current?.getBoundingClientRect().left ?? Infinity;
          (e.clientX >= minutesLeft - 8 ? minutesRef : hoursRef).current?.focus();
        }}
        onBlur={e => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) normalize();
        }}
      >
        {input('h')}
        <span aria-hidden="true" data-slot="duration-input-unit" className={unitClass}>{t.hourUnit}</span>
        <span aria-hidden="true" className="w-2 shrink-0" />
        {input('m')}
        <span aria-hidden="true" data-slot="duration-input-unit" className={unitClass}>{t.minuteUnit}</span>
      </div>
      <span role="status" className="sr-only">{readBack}</span>
      {message ? (
        <p id={errorId} data-slot="duration-input-error" className="flex items-start gap-1.5 text-xs text-destructive">
          <span className="flex h-4 shrink-0 items-center"><CircleAlert className="size-3.5" aria-hidden="true" /></span>
          <span className="min-w-0 flex-1">{message}</span>
        </p>
      ) : null}
    </div>
  );
}

export { DurationInput };
