// EGG UI Segmented Input. Code only (no Figma component yet). One code split into groups of boxes: an
// IBAN (4 4 4 4 4 2), a license key (5 5 5 5), a card or order number. Each group is a real text input
// in the Input look, so the screen reader says "Part 2 of 5" and the browser handles caret, selection
// and autofill. Typing fills a box and moves on to the next one when it is full; Backspace in an
// empty box moves back and deletes the last character there; ArrowLeft at the start and ArrowRight at
// the end cross into the neighbor box; focusing a box selects its text. Paste splits across the
// boxes from where the caret is, and spaces, dashes and other characters outside the charset are
// dropped, so "DE89 3704-0044" and "DE893704 0044" paste the same way. The value is the boxes joined
// with a space ("DE89 3704"), so a half filled code can be saved and restored; `onComplete` gets the
// compact code ("DE893704...") when every box is full. `name` adds a hidden input with the compact
// code. Works in a Field: id goes to the first box; aria-describedby, aria-invalid, required and
// disabled go to every box. For a single short code of one box each use Input OTP; for free text use
// Input.
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Input } from './input';

export type SegmentedCharset = 'alphanumeric' | 'digits' | 'letters' | 'hex';

const notAllowed: Record<SegmentedCharset, RegExp> = {
  alphanumeric: /[^a-z0-9]/gi,
  digits: /\D/g,
  letters: /[^a-z]/gi,
  hex: /[^0-9a-f]/gi,
};

export interface SegmentedInputProps extends Omit<React.ComponentProps<'div'>, 'defaultValue' | 'onChange' | 'role' | 'id'> {
  /** Characters in each box: [4, 4, 4, 4, 4, 2] for an IBAN. Default [4, 4, 4, 4]. */
  groups?: number[];
  /** The boxes joined with a space: "DE89 3704". */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Runs once every box is full, with the compact code. */
  onComplete?: (code: string) => void;
  /** Which characters a box accepts. */
  charset?: SegmentedCharset;
  /** Show and store capital letters. Default true. */
  uppercase?: boolean;
  /** Drawn between the boxes, hidden from screen readers. '' for a gap only. Default "-". */
  separator?: string;
  /** Box size, from Input. */
  size?: 'sm' | 'default' | 'lg';
  /** Template for each box's accessible name; {n} and {total} are replaced. */
  partLabel?: string;
  /** Hidden input with the compact code, for native forms. */
  name?: string;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  invalid?: boolean;
  /** Id of the first box (a Field's label points at it). */
  id?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: React.AriaAttributes['aria-invalid'];
}

function SegmentedInput({
  groups = [4, 4, 4, 4],
  value: valueProp,
  defaultValue = '',
  onValueChange,
  onComplete,
  charset = 'alphanumeric',
  uppercase = true,
  separator = '-',
  size = 'default',
  partLabel = 'Part {n} of {total}',
  name,
  placeholder,
  disabled,
  readOnly,
  required,
  invalid,
  id,
  'aria-describedby': describedBy,
  'aria-invalid': ariaInvalid,
  className,
  ...props
}: SegmentedInputProps) {
  const clean = React.useCallback(
    (text: string) => {
      const t = text.replace(notAllowed[charset], '');
      return uppercase ? t.toUpperCase() : t;
    },
    [charset, uppercase],
  );
  const parse = React.useCallback(
    (v: string) => {
      const raw = v.split(' ');
      return groups.map((n, i) => clean(raw[i] ?? '').slice(0, n));
    },
    [groups, clean],
  );

  const [inner, setInner] = React.useState(defaultValue);
  const parts = React.useMemo(() => parse(valueProp ?? inner), [parse, valueProp, inner]);
  const refs = React.useRef<Array<HTMLInputElement | null>>([]);
  const pending = React.useRef<{ index: number; pos: number } | null>(null);
  const last = groups.length - 1;

  // Move focus after the render that holds the new text (the caret position needs the new value).
  React.useLayoutEffect(() => {
    const p = pending.current;
    if (!p) return;
    pending.current = null;
    const el = refs.current[p.index];
    if (el) {
      el.focus();
      el.setSelectionRange(p.pos, p.pos);
    }
  });

  const focusAt = (index: number, pos: number) => {
    pending.current = { index, pos };
    const el = refs.current[index];
    if (el) {
      el.focus();
      el.setSelectionRange(pos, pos);
    }
  };

  const commit = (next: string[]) => {
    const text = next.join(' ').trimEnd();
    if (valueProp === undefined) setInner(text);
    onValueChange?.(text);
    const wasFull = parts.every((p, i) => p.length === groups[i]);
    if (!wasFull && next.every((p, i) => p.length === groups[i])) onComplete?.(next.join(''));
  };

  const onChange = (i: number, raw: string) => {
    const v = clean(raw).slice(0, groups[i]);
    const next = parts.slice();
    next[i] = v;
    commit(next);
    if (v.length === groups[i] && v.length > parts[i]!.length && i < last) pending.current = { index: i + 1, pos: 0 };
  };

  const onKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    const el = e.currentTarget;
    const noSelection = el.selectionStart === el.selectionEnd;
    if (e.key === 'Backspace' && noSelection && el.selectionStart === 0 && i > 0) {
      e.preventDefault();
      const next = parts.slice();
      next[i - 1] = parts[i - 1]!.slice(0, -1);
      commit(next);
      focusAt(i - 1, next[i - 1]!.length);
    } else if (e.key === 'ArrowLeft' && noSelection && el.selectionStart === 0 && i > 0) {
      e.preventDefault();
      focusAt(i - 1, parts[i - 1]!.length);
    } else if (e.key === 'ArrowRight' && noSelection && el.selectionStart === el.value.length && i < last) {
      e.preventDefault();
      focusAt(i + 1, 0);
    }
  };

  const onPaste = (i: number, e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (readOnly) return;
    const text = clean(e.clipboardData.getData('text'));
    if (!text) return;
    const from = e.currentTarget.selectionStart ?? 0;
    let rest = parts[i]!.slice(0, from) + text;
    const next = parts.slice();
    let j = i;
    for (; j <= last && rest.length > 0; j++) {
      next[j] = rest.slice(0, groups[j]);
      rest = rest.slice(groups[j]);
      if (rest.length === 0) break;
    }
    const end = Math.min(j, last);
    commit(next);
    if (next[end]!.length === groups[end] && end < last) focusAt(end + 1, 0);
    else focusAt(end, next[end]!.length);
  };

  return (
    <div
      data-slot="segmented-input"
      role="group"
      className={cn('flex min-w-0 flex-wrap items-center gap-x-2 gap-y-2', className)}
      {...props}
    >
      {groups.map((n, i) => (
        <React.Fragment key={i}>
          {i > 0 && separator ? (
            <span aria-hidden="true" className="text-muted-foreground select-none">
              {separator}
            </span>
          ) : null}
          <Input
            ref={el => {
              refs.current[i] = el;
            }}
            id={i === 0 ? id : undefined}
            data-slot="segmented-input-box"
            type="text"
            inputMode={charset === 'digits' ? 'numeric' : 'text'}
            autoComplete="off"
            autoCapitalize={uppercase ? 'characters' : 'off'}
            spellCheck={false}
            size={size}
            value={parts[i]}
            placeholder={placeholder ? placeholder.repeat(n).slice(0, n) : undefined}
            maxLength={n}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            aria-label={partLabel.replace('{n}', String(i + 1)).replace('{total}', String(groups.length))}
            aria-describedby={describedBy}
            aria-invalid={invalid || ariaInvalid || undefined}
            style={{ width: `calc(${n}ch + 2rem)` }}
            className="max-w-full shrink-0 px-2 text-center font-mono tracking-widest md:text-sm"
            onFocus={e => e.currentTarget.select()}
            onChange={e => onChange(i, e.target.value)}
            onKeyDown={e => onKeyDown(i, e)}
            onPaste={e => onPaste(i, e)}
          />
        </React.Fragment>
      ))}
      {name ? <input type="hidden" name={name} value={parts.join('')} /> : null}
    </div>
  );
}

export { SegmentedInput };
