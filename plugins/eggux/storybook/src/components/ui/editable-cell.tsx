// EGG UI Editable Cell. Code only (no Figma component yet); family Data Structures.
// A table cell that is edited where it sits, like a spreadsheet. At rest it shows the value and is
// one tab stop. Enter, F2 or a double click turns it into an input. Enter saves, Escape cancels,
// leaving the cell with the pointer or Tab saves a valid change and drops an invalid one. A value
// that fails `validate` stays in the input with a message under it (aria-invalid, aria-describedby,
// the message is announced). `onSave` may return a promise: the input is read-only and busy with a
// "Saving..." line until it settles; a rejection shows its message and keeps the input open. After
// Enter or Escape the focus goes back to the cell.
// Built on TableCell (editing and error states draw the 2 px border). Render it inside a table row.
// A11y: the cell is focusable and described by "Press Enter to edit."; the input is named
// "Edit <label>"; the result is announced in a polite status ("Saved", "Change cancelled").
import * as React from 'react';
import { LoaderCircle, Pencil } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Input } from './input';
import { TableCell } from './table';

export interface EditableCellProps extends Omit<React.ComponentProps<'td'>, 'onChange' | 'children' | 'defaultValue'> {
  /** The saved value. The app updates it after onSave. */
  value: string;
  /** Called with the new value. Return a promise to show the saving state; reject with an Error to show its message. */
  onSave: (next: string) => void | Promise<void>;
  /** Return a message when the value is not allowed; return nothing when it is. */
  validate?: (next: string) => string | undefined;
  /** What the cell holds, for screen readers: "Name of Ana Popescu". */
  label: string;
  inputType?: 'text' | 'number' | 'email';
  /** Shown in the input when it is empty. */
  placeholder?: string;
  /** How the saved value is shown at rest ("1,200 EUR"). Default: the value. */
  format?: (value: string) => React.ReactNode;
  /** Shown at rest when the value is empty. Default "Empty". */
  emptyText?: string;
  readOnly?: boolean;
}

function EditableCell({
  value,
  onSave,
  validate,
  label,
  inputType = 'text',
  placeholder,
  format,
  emptyText = 'Empty',
  readOnly = false,
  className,
  ...props
}: EditableCellProps) {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(value);
  const [error, setError] = React.useState<string | undefined>();
  const [saving, setSaving] = React.useState(false);
  const [announce, setAnnounce] = React.useState('');
  const cellRef = React.useRef<HTMLTableCellElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const returnFocus = React.useRef(false);
  // True once the edit ended, so the blur caused by removing the input cannot save a second time.
  const settled = React.useRef(true);
  const ids = React.useId();
  const hintId = `${ids}-hint`;
  const errorId = `${ids}-error`;

  // Focus follows the render that changed the mode, never a key handler that could run before it.
  React.useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    } else if (returnFocus.current) {
      returnFocus.current = false;
      cellRef.current?.focus();
    }
  }, [editing]);

  // The announcement is read once, then removed so it does not become part of the cell text.
  React.useEffect(() => {
    if (!announce) return;
    const t = setTimeout(() => setAnnounce(''), 1500);
    return () => clearTimeout(t);
  }, [announce]);

  const start = () => {
    if (readOnly || editing) return;
    setDraft(value);
    setError(undefined);
    setAnnounce('');
    settled.current = false;
    setEditing(true);
  };
  const close = (restoreFocus: boolean) => {
    returnFocus.current = restoreFocus;
    settled.current = true;
    setEditing(false);
    setError(undefined);
  };
  const cancel = (restoreFocus: boolean) => {
    close(restoreFocus);
    setAnnounce('Change cancelled.');
  };

  const commit = async (source: 'enter' | 'blur') => {
    if (saving || settled.current) return;
    if (draft === value) {
      close(source === 'enter');
      return;
    }
    const message = validate?.(draft);
    if (message) {
      if (source === 'blur') cancel(false);
      else setError(message);
      return;
    }
    setError(undefined);
    setSaving(true);
    try {
      await onSave(draft);
      setSaving(false);
      close(source === 'enter');
      setAnnounce('Saved.');
    } catch (err) {
      setSaving(false);
      setError(err instanceof Error && err.message ? err.message : 'Could not save. Try again.');
      inputRef.current?.focus();
    }
  };

  const state = editing ? (error ? 'error' : 'editing') : 'default';

  return (
    <TableCell
      ref={cellRef}
      data-slot="editable-cell"
      state={state}
      tabIndex={editing || readOnly ? undefined : 0}
      aria-describedby={editing || readOnly ? undefined : hintId}
      aria-keyshortcuts={editing || readOnly ? undefined : 'Enter F2'}
      onDoubleClick={start}
      onKeyDown={e => {
        if (editing || e.target !== e.currentTarget) return;
        if (e.key === 'Enter' || e.key === 'F2') {
          e.preventDefault();
          start();
        }
      }}
      className={cn('group/editable relative min-w-0 outline-none focus-visible:shadow-[inset_0_0_0_2px_var(--ring)]', !readOnly && !editing && 'cursor-text', className)}
      {...props}
    >
      {editing ? (
        <div className="flex min-w-0 flex-col gap-1">
          <Input
            ref={inputRef}
            type={inputType}
            size="sm"
            value={draft}
            placeholder={placeholder}
            aria-label={`Edit ${label}`}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            aria-busy={saving || undefined}
            readOnly={saving}
            onChange={e => {
              setDraft(e.target.value);
              if (error) setError(undefined);
            }}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                void commit('enter');
              } else if (e.key === 'Escape') {
                e.preventDefault();
                e.stopPropagation();
                if (!saving) cancel(true);
              }
            }}
            onBlur={() => void commit('blur')}
            className="h-8 min-w-0 border-0 bg-transparent px-1 shadow-none focus-visible:shadow-none"
          />
          {saving ? (
            <p className="m-0 flex items-center gap-1 text-xs leading-4 text-foreground">
              <LoaderCircle aria-hidden="true" className="size-3.5 shrink-0 motion-safe:animate-spin" />
              Saving…
            </p>
          ) : null}
          {error ? (
            <p id={errorId} role="alert" className="m-0 min-w-0 text-xs leading-4 font-medium break-words text-destructive">{error}</p>
          ) : null}
        </div>
      ) : (
        <>
          <div className="flex min-w-0 items-center gap-2">
            <span className="block min-w-0 flex-1 truncate" title={value || undefined}>
              {value ? (format ? format(value) : value) : <span className="text-muted-foreground">{emptyText}</span>}
            </span>
            {!readOnly ? <Pencil aria-hidden="true" className="size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover/editable:opacity-100 group-focus-visible/editable:opacity-100 motion-reduce:transition-none" /> : null}
          </div>
          {!readOnly ? <span id={hintId} hidden>Press Enter to edit {label}.</span> : null}
        </>
      )}
      <span role="status" className="sr-only">{announce}</span>
    </TableCell>
  );
}

export { EditableCell };
