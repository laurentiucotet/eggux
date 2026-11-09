// EGG UI Inline Edit. Figma: Inline Edit (Input page, "Inline Edit / Component", set 272:906).
// State (view, hover, editing, saving, error), Value ("Q3 vendor review"), Error ("Enter a name.").
// View: the value in body/default, 8 / 4 px padding, radius/md; hover (and keyboard focus) adds the
// background/muted fill and a 14 px pencil in foreground/muted. Editing: Input (default size) +
// save Button Icon (default, check) + cancel Button Icon (ghost, x), 6 px apart. Saving: a Spinner
// sm muted replaces the buttons. Error: the input stays open with the typed value, aria-invalid and
// the ui/caption message in destructive under it (4 px).
// Behavior: click or Enter on the value opens the input with the text selected; Enter or the check
// saves, Escape or x cancels, blur saves; an unchanged value just closes. onSave may return a
// promise: it shows Saving, and a rejection keeps the input open with its message. Focus returns to
// the value after save or cancel. The value is a button named "Edit <label>: <value>".
import * as React from 'react';
import { Check, Pencil, X } from '@/components/icons';
import { cn } from '@/lib/utils';
import { ButtonIcon } from './button-icon';
import { Input } from './input';
import { Spinner } from './spinner';

export type InlineEditState = 'view' | 'editing' | 'saving' | 'error';

export interface InlineEditProps extends Omit<React.ComponentProps<'div'>, 'defaultValue' | 'onChange'> {
  /** What the value is, for the button name "Edit <label>" and the input label ("title"). */
  label: string;
  /** Figma Value (controlled). */
  value?: string;
  /** Figma Value (uncontrolled). */
  defaultValue?: string;
  /** Save the new value. Return a promise to show Saving; reject with an Error to show its message. */
  onSave?: (value: string) => void | Promise<void>;
  /** Check before saving; return the message (Figma Error) to keep the input open. */
  validate?: (value: string) => string | undefined;
  /** Shown in the view when the value is empty. */
  placeholder?: string;
  /** Message when onSave rejects without a message. */
  saveErrorMessage?: string;
  saveLabel?: string;
  cancelLabel?: string;
  /** Announced while saving. */
  savingLabel?: string;
  /** Input attributes (maxLength, autoComplete...). */
  inputProps?: Omit<React.ComponentProps<'input'>, 'value' | 'defaultValue' | 'onChange' | 'onKeyDown' | 'size'>;
}

function InlineEdit({
  label,
  value: valueProp,
  defaultValue = '',
  onSave,
  validate,
  placeholder,
  saveErrorMessage = 'Could not save. Try again.',
  saveLabel = 'Save',
  cancelLabel = 'Cancel',
  savingLabel = 'Saving',
  inputProps,
  className,
  ...props
}: InlineEditProps) {
  const [inner, setInner] = React.useState(defaultValue);
  const value = valueProp ?? inner;
  const [state, setStateRaw] = React.useState<InlineEditState>('view');
  // The latest state for event handlers that run after a re-render (blur on unmount, double submit).
  const stateRef = React.useRef<InlineEditState>('view');
  const setState = (s: InlineEditState) => { stateRef.current = s; setStateRaw(s); };
  const [draft, setDraft] = React.useState(value);
  const [error, setError] = React.useState<string | undefined>(undefined);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const viewRef = React.useRef<HTMLButtonElement>(null);
  const returnFocus = React.useRef(false);
  const id = React.useId();
  const errorId = `${id}-error`;
  const open = state !== 'view';

  React.useEffect(() => {
    if (state === 'editing' && document.activeElement !== inputRef.current) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
    if (state === 'error') inputRef.current?.focus();
    if (state === 'view' && returnFocus.current) {
      returnFocus.current = false;
      viewRef.current?.focus();
    }
  }, [state]);

  const start = () => { setDraft(value); setError(undefined); setState('editing'); };

  const close = (focusValue: boolean) => {
    returnFocus.current = focusValue;
    setError(undefined);
    setState('view');
  };

  const cancel = () => { setDraft(value); close(true); };

  const save = async (focusValue: boolean) => {
    if (stateRef.current === 'saving' || stateRef.current === 'view') return;
    if (draft === value) { close(focusValue); return; }
    const invalid = validate?.(draft);
    if (invalid) { setError(invalid); setState('error'); return; }
    setError(undefined);
    setState('saving');
    try {
      await onSave?.(draft);
      if (valueProp === undefined) setInner(draft);
      close(focusValue);
    } catch (e) {
      setError(e instanceof Error && e.message ? e.message : saveErrorMessage);
      setState('error');
    }
  };

  // Blur saves, unless focus moved to the save or cancel button inside.
  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (stateRef.current === 'view' || stateRef.current === 'saving') return;
    if (e.relatedTarget && rootRef.current?.contains(e.relatedTarget as Node)) return;
    void save(false);
  };

  return (
    <div
      ref={rootRef}
      data-slot="inline-edit"
      data-state={state}
      className={cn('flex w-full min-w-0 flex-col gap-1', className)}
      onBlur={handleBlur}
      {...props}
    >
      {open ? (
        <div data-slot="inline-edit-editor" className="flex min-w-0 items-center gap-1.5">
          <Input
            ref={inputRef}
            aria-label={label}
            aria-invalid={state === 'error' || undefined}
            aria-describedby={state === 'error' && error ? errorId : undefined}
            aria-busy={state === 'saving' || undefined}
            {...inputProps}
            value={draft}
            onChange={e => { if (state !== 'saving') setDraft(e.target.value); }}
            onKeyDown={e => {
              if (state === 'saving') return;
              if (e.key === 'Enter') { e.preventDefault(); void save(true); }
              if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); cancel(); }
            }}
            className={cn('min-w-0 flex-1', inputProps?.className)}
          />
          {state === 'saving' ? (
            <Spinner size="sm" tone="muted" />
          ) : (
            <>
              <ButtonIcon icon={<Check aria-hidden="true" />} label={saveLabel} onClick={() => void save(true)} />
              <ButtonIcon variant="ghost" icon={<X aria-hidden="true" />} label={cancelLabel} onClick={cancel} />
            </>
          )}
        </div>
      ) : (
        <button
          ref={viewRef}
          type="button"
          data-slot="inline-edit-value"
          onClick={start}
          className={cn(
            'group/inline-edit flex h-9 w-full min-w-0 items-center gap-2 rounded-md px-2 py-1 text-left text-base leading-7 text-foreground outline-none',
            'transition-colors duration-[var(--duration-fast)] hover:bg-muted focus-visible:bg-muted focus-visible:shadow-[0_0_0_2px_var(--ring)]',
          )}
        >
          <span className="sr-only">Edit {label}: </span>
          <span className={cn('min-w-0 flex-1 truncate', !value && 'text-muted-foreground')}>{value || placeholder}</span>
          <Pencil
            aria-hidden="true"
            data-slot="inline-edit-pencil"
            className="size-3.5 shrink-0 text-muted-foreground opacity-0 group-hover/inline-edit:opacity-100 group-focus-visible/inline-edit:opacity-100"
          />
        </button>
      )}
      {state === 'error' && error ? (
        <p id={errorId} role="alert" data-slot="inline-edit-error" className="text-xs text-destructive">{error}</p>
      ) : null}
      <span role="status" aria-live="polite" className="sr-only">{state === 'saving' ? savingLabel : ''}</span>
    </div>
  );
}

export { InlineEdit };
