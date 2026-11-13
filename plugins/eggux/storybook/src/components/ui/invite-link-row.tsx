// EGG UI Invite Link Row. Code only (no Figma component yet); family Access.
// The link people use to join or open something: a read-only field with the link and a Copy button,
// and under it the settings of the link: an expiry Select ("Never", "1 day", "7 days", "30 days"),
// Reset link (asks first in an Alert Dialog: the old link stops working at once) and a Switch that
// turns the link on or off. Off dims and disables the field, Copy, expiry and Reset; the link is
// kept. After a reset the parent gives a new `url`; the row says so in a live region. Under about
// 400 px the settings wrap to their own lines; the link scrolls inside its field, never the page.
// Built from Input look (readonly text field), Copy Button, Select, Alert Dialog, Switch.
// A11y: the field is labelled ("Invite link"), readonly and selectable; Copy is named "Copy invite
// link"; the expiry Select is named "Link expires"; the Switch is named by its text; the dialog
// focuses Cancel first and Escape cancels.
import * as React from 'react';
import { RefreshCw } from '@/components/icons';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from './alert-dialog';
import { Button } from './button';
import { CopyButton } from './copy-button';
import { Select, SelectContent, SelectItem, SelectTrigger } from './select';
import { Switch } from './switch';

export interface ExpiryOption { value: string; label: string }

export const defaultExpiryOptions: ExpiryOption[] = [
  { value: 'never', label: 'Never expires' },
  { value: '1d', label: 'Expires in 1 day' },
  { value: '7d', label: 'Expires in 7 days' },
  { value: '30d', label: 'Expires in 30 days' },
];

export interface InviteLinkRowProps extends Omit<React.ComponentProps<'div'>, 'children' | 'onChange'> {
  url: string;
  /** Link on or off. */
  enabled?: boolean;
  /** Start state when not controlled. Default on. */
  defaultEnabled?: boolean;
  onEnabledChange?: (enabled: boolean) => void;
  expiry?: string;
  onExpiryChange?: (expiry: string) => void;
  expiryOptions?: ExpiryOption[];
  /** Runs after the person confirms. Give the row a new `url` here. */
  onReset?: () => void;
  /** What the link opens, for the field label and the dialog ("Acme workspace"). */
  subject?: string;
  /** Hide the Reset action (a link that cannot be reset). */
  showReset?: boolean;
}

function InviteLinkRow({
  url,
  enabled: enabledProp,
  defaultEnabled = true,
  onEnabledChange,
  expiry: expiryProp,
  onExpiryChange,
  expiryOptions = defaultExpiryOptions,
  onReset,
  subject = 'this workspace',
  showReset = true,
  className,
  ...props
}: InviteLinkRowProps) {
  const [enabledInner, setEnabled] = React.useState(defaultEnabled);
  const [expiryInner, setExpiry] = React.useState('never');
  const [announce, setAnnounce] = React.useState('');
  const enabled = enabledProp ?? enabledInner;
  const expiry = expiryProp ?? expiryInner;
  const fieldId = React.useId();
  const switchId = React.useId();

  return (
    <div data-slot="invite-link-row" data-enabled={enabled} className={cn('flex min-w-0 max-w-xl flex-col gap-3', className)} {...props}>
      <div className="flex min-w-0 flex-col gap-1.5">
        <label htmlFor={fieldId} className="text-sm leading-5 font-medium text-foreground">Invite link</label>
        <div className="flex min-w-0 items-center gap-2">
          <input
            id={fieldId}
            type="text"
            readOnly
            disabled={!enabled}
            value={url}
            onFocus={e => e.currentTarget.select()}
            className="h-[var(--control-height)] min-w-0 flex-1 truncate rounded-input border border-input bg-muted px-3 text-sm text-foreground shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <CopyButton value={url} label="Copy invite link" variant="outline" disabled={!enabled} />
        </div>
      </div>

      <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2">
        <Select
          value={expiry}
          onValueChange={v => {
            if (expiryProp === undefined) setExpiry(v);
            onExpiryChange?.(v);
          }}
          size="sm"
          disabled={!enabled}
        >
          <SelectTrigger aria-label="Link expires" className="w-[168px]" />
          <SelectContent>
            {expiryOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
          </SelectContent>
        </Select>

        {showReset ? (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" leadingIcon={<RefreshCw aria-hidden="true" />} disabled={!enabled}>Reset link</Button>
            </AlertDialogTrigger>
            <AlertDialogContent type="destructive">
              <AlertDialogHeader
                title="Reset the invite link?"
                description={`People who have the current link for ${subject} will no longer be able to use it. You will get a new link to share.`}
              />
              <AlertDialogFooter>
                <AlertDialogCancel />
                <AlertDialogAction
                  onClick={() => {
                    onReset?.();
                    setAnnounce('Link reset. The old link no longer works.');
                  }}
                >
                  Reset link
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : null}

        <div className="ml-auto flex shrink-0 items-center">
          <Switch id={switchId} size="default" label="Link enabled" checked={enabled} onCheckedChange={v => {
            if (enabledProp === undefined) setEnabled(v);
            setAnnounce(v ? 'Invite link turned on' : 'Invite link turned off');
            onEnabledChange?.(v);
          }} />
        </div>
      </div>
      <span role="status" aria-live="polite" className="sr-only">{announce}</span>
    </div>
  );
}

export { InviteLinkRow };
