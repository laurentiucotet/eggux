// EGG UI Unsaved Changes Prompt. Code only (no Figma component yet); family Wizard.
// An Alert Dialog that asks "Leave without saving?" when someone tries to leave a form with edits. Three
// choices: Stay (the safe one, takes focus and is what Escape does), Discard (leave, edits are lost) and
// Save and leave (primary). Built on Alert Dialog, so focus is trapped, returns to where it came from, and
// the scrim does not close it. Optional `warnOnUnload` adds the browser's own "Leave site?" prompt while
// the form is dirty (the hook `useBeforeUnload` is exported for pages that want it without the dialog).
// A11y: role="alertdialog" named by the title and described by the text; the buttons say what they do;
// while saving, Save and leave reads "Saving..." and every button is disabled.
import * as React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from './alert-dialog';

/** Asks the browser to confirm closing the tab or reloading while `active` is true. */
export function useBeforeUnload(active: boolean) {
  React.useEffect(() => {
    if (!active) return;
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [active]);
}

export interface UnsavedChangesPromptProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Stay on the page (Stay button, Escape). */
  onStay?: () => void;
  /** Leave and drop the edits. */
  onDiscard?: () => void;
  /** Save the edits, then leave. */
  onSaveAndLeave?: () => void;
  /** True while the save runs: the buttons are disabled and the primary reads "Saving...". */
  saving?: boolean;
  /** Keep the dialog open after Save and leave is pressed; the app closes it when the save is done. */
  keepOpenWhileSaving?: boolean;
  /** Also show the browser's own prompt on tab close or reload while the form is dirty. */
  warnOnUnload?: boolean;
  title?: string;
  description?: string;
  stayLabel?: string;
  discardLabel?: string;
  saveLabel?: string;
}

function UnsavedChangesPrompt({
  open,
  onOpenChange,
  onStay,
  onDiscard,
  onSaveAndLeave,
  saving = false,
  keepOpenWhileSaving = false,
  warnOnUnload = false,
  title = 'Leave without saving?',
  description = 'You have changes that are not saved. If you leave now, they will be lost.',
  stayLabel = 'Stay',
  discardLabel = 'Discard',
  saveLabel = 'Save and leave',
}: UnsavedChangesPromptProps) {
  useBeforeUnload(warnOnUnload);
  // The dialog has no trigger of its own, so remember what had focus and give it back on close.
  const opener = React.useRef<HTMLElement | null>(null);
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent
        type="confirm"
        data-slot="unsaved-changes-prompt"
        onEscapeKeyDown={() => onStay?.()}
        onOpenAutoFocus={() => {
          opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        }}
        onCloseAutoFocus={event => {
          if (opener.current?.isConnected) {
            event.preventDefault();
            opener.current.focus();
          }
        }}
      >
        <AlertDialogHeader title={title} description={description} />
        <AlertDialogFooter>
          <AlertDialogCancel disabled={saving} onClick={() => onStay?.()}>{stayLabel}</AlertDialogCancel>
          <AlertDialogAction variant="outline" disabled={saving} onClick={() => onDiscard?.()}>{discardLabel}</AlertDialogAction>
          <AlertDialogAction
            disabled={saving}
            onClick={event => {
              if (keepOpenWhileSaving) event.preventDefault();
              onSaveAndLeave?.();
            }}
          >
            {saving ? 'Saving...' : saveLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export { UnsavedChangesPrompt };
