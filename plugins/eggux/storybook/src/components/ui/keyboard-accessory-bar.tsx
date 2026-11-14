// EGG UI Keyboard Accessory Bar. Code only (no Figma component yet). Mobile page. The bar that rides
// above the on-screen keyboard while a form is filled: Previous field, Next field and Done, each
// 44 high. It knows the form by the ids of its fields, in order (`fieldIds`): Previous and Next move
// the focus to the field before or after the one that has it (disabled at the first and last; Next
// with no field focused goes to the first), and Done blurs the field and calls `onDone`. It sticks
// to the bottom edge, `bottom` is the keyboard height in px (0 when there is no keyboard; with 0 the
// safe-area inset is added). Tapping a button never takes the focus from the field, so the keyboard
// stays up. It reads "Field 2 of 3". `position` is fixed on the phone and absolute inside a frame.
// Not for desktop forms (Tab does this).
import * as React from 'react';
import { ChevronDown, ChevronUp } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button } from './button';

export interface KeyboardAccessoryBarProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  /** The ids of the form fields, in order. */
  fieldIds: string[];
  /** Keyboard height in px: the bar sits this far above the bottom edge. */
  bottom?: number;
  onDone?: () => void;
  /** fixed (the phone, default) or absolute (inside a relative frame). */
  position?: 'fixed' | 'absolute';
  /** Texts translated by the app. */
  labels?: { previous?: string; next?: string; done?: string; group?: string; field?: (current: number, total: number) => string };
}

function KeyboardAccessoryBar({ fieldIds, bottom = 0, onDone, position = 'fixed', labels, className, style, ...props }: KeyboardAccessoryBarProps) {
  const t = { previous: 'Previous field', next: 'Next field', done: 'Done', group: 'Form navigation', field: (c: number, n: number) => `Field ${c} of ${n}`, ...labels };
  const root = React.useRef<HTMLDivElement>(null);
  const [index, setIndex] = React.useState(-1);

  // Follow the focus: a field of the form sets the index, a button of the bar keeps it, anything else clears it.
  React.useEffect(() => {
    const read = () => {
      const el = document.activeElement as HTMLElement | null;
      const at = el?.id ? fieldIds.indexOf(el.id) : -1;
      if (at >= 0) setIndex(at);
      else if (!(el && root.current?.contains(el))) setIndex(-1);
    };
    read();
    const out = () => { timer = setTimeout(read, 0); };
    let timer: ReturnType<typeof setTimeout> | undefined;
    document.addEventListener('focusin', read);
    document.addEventListener('focusout', out);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('focusin', read);
      document.removeEventListener('focusout', out);
    };
  }, [fieldIds]);

  const focusAt = (i: number) => {
    const el = document.getElementById(fieldIds[i]);
    if (el) {
      el.focus();
      setIndex(i);
    }
  };
  const done = () => {
    (document.activeElement as HTMLElement | null)?.blur();
    setIndex(-1);
    onDone?.();
  };
  // Keep the focus (and the keyboard) in the field when a button is tapped.
  const keepFocus = (e: React.MouseEvent) => e.preventDefault();
  const btn = 'h-11 min-w-11';

  return (
    <div
      ref={root}
      role="toolbar"
      aria-label={t.group}
      data-slot="keyboard-accessory-bar"
      className={cn(
        'inset-x-0 z-40 flex min-w-0 items-center gap-1 border-t border-border bg-muted px-2 text-foreground',
        position === 'fixed' ? 'fixed' : 'absolute',
        bottom === 0 && 'pb-[env(safe-area-inset-bottom)]',
        className,
      )}
      style={{ bottom, ...style }}
      {...props}
    >
      <Button type="button" variant="ghost" size="touch" aria-label={t.previous} disabled={index <= 0} onMouseDown={keepFocus} onClick={() => focusAt(index - 1)} className={cn(btn, 'px-0')}>
        <ChevronUp />
      </Button>
      <Button type="button" variant="ghost" size="touch" aria-label={t.next} disabled={index >= fieldIds.length - 1} onMouseDown={keepFocus} onClick={() => focusAt(index + 1)} className={cn(btn, 'px-0')}>
        <ChevronDown />
      </Button>
      <span role="status" className="min-w-0 flex-1 truncate px-2 text-center text-xs leading-4 text-foreground">{index >= 0 ? t.field(index + 1, fieldIds.length) : ''}</span>
      <Button type="button" variant="ghost" size="touch" onMouseDown={keepFocus} onClick={done} className="shrink-0 font-semibold">
        {t.done}
      </Button>
    </div>
  );
}

export { KeyboardAccessoryBar };
