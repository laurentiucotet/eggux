// EGG UI Save Bar. Figma: Save Bar (Save Bar page, "Save Bar / Component", 180:659). State
// (default, saving, error). Sticky bar at the bottom of a long form or settings page while there
// are unsaved changes: popover surface, border, radius md, shadow md, 16 / 10 px padding, 54 high.
// Message (ui/label, 16 icon, min 160): circle-alert + "3 unsaved changes"; saving: a Spinner and
// "Saving…" with Save disabled; error: icon and text in destructive, saying what to fix. Actions:
// Discard (ghost sm) and Save changes (sm). The row wraps, so on narrow screens the actions drop
// under the message. Discard asks first when changes are large (the app's job); Save validates and
// scrolls to the first error.
// A11y: a region named "Unsaved changes"; the message is a polite live region so saving and errors
// are announced.
import * as React from 'react';
import { CircleAlert } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Spinner } from './spinner';

export type SaveBarState = 'default' | 'saving' | 'error';

export interface SaveBarProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  state?: SaveBarState;
  /** default: what is unsaved ("3 unsaved changes"); error: what to fix. */
  message?: React.ReactNode;
  onSave?: () => void;
  onDiscard?: () => void;
  labels?: Partial<{ region: string; saving: string; save: string; discard: string }>;
}

function SaveBar({ state = 'default', message, onSave, onDiscard, labels, className, ...props }: SaveBarProps) {
  const L = { region: 'Unsaved changes', saving: 'Saving…', save: 'Save changes', discard: 'Discard', ...labels };
  const error = state === 'error';
  return (
    <div
      data-slot="save-bar"
      data-state={state}
      role="region"
      aria-label={L.region}
      className={cn('flex min-w-0 flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-md border border-border bg-popover px-4 py-2.5 text-popover-foreground shadow-md', className)}
      {...props}
    >
      <div aria-live="polite" className={cn('flex min-w-40 flex-1 items-center gap-2', error && 'text-destructive')}>
        {state === 'saving' ? <Spinner size="sm" /> : <CircleAlert aria-hidden="true" className="size-4 shrink-0" />}
        <p className="m-0 min-w-0 flex-1 text-sm leading-5 font-medium [overflow-wrap:anywhere]">
          {state === 'saving' ? L.saving : (message ?? L.region)}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onDiscard}>{L.discard}</Button>
        <Button size="sm" onClick={onSave} disabled={state === 'saving'}>{L.save}</Button>
      </div>
    </div>
  );
}

export { SaveBar };
