// EGG UI API Key Field. Code only (no Figma component yet); family Developer.
// One API key in a card: its name, a read-only masked key (all but the last 4 characters, same mask as
// Copy Field) with a Reveal toggle (aria-pressed) and a Copy Button, then Created and Last used in a
// definition list, and a Revoke button. Revoke asks first, in place: a group "Revoke "<name>"?" that
// says what happens, with Cancel and Revoke key; focus moves to Cancel, Escape or Cancel returns it to
// Revoke. Confirming calls `onRevoke`; the key then reads Revoked (badge, key hidden, no actions). The
// full key is only ever copied or revealed on request; sample keys in stories are obviously fake.
import * as React from 'react';
import { Eye, EyeOff, Trash2 } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Badge } from './badge';
import { Button } from './button';
import { ButtonIcon } from './button-icon';
import { CopyButton } from './copy-button';
import { maskSecret } from './copy-field';
import { Input } from './input';

export interface ApiKeyFieldProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  /** What the key is called: "Production server". */
  name: string;
  /** The full key. Masked until Reveal; Copy always copies all of it. */
  keyValue: string;
  /** When it was made, as people read it: "12 Mar 2026". */
  createdAt: string;
  /** When it was last used: "2 hours ago", or null for a key never used. */
  lastUsed: string | null;
  /** Called after the person confirms Revoke. */
  onRevoke?: () => void;
  /** Start already revoked. */
  defaultRevoked?: boolean;
  disabled?: boolean;
}

function ApiKeyField({ name, keyValue, createdAt, lastUsed, onRevoke, defaultRevoked = false, disabled = false, className, id, ...props }: ApiKeyFieldProps) {
  const [revealed, setRevealed] = React.useState(false);
  const [confirming, setConfirming] = React.useState(false);
  const [revoked, setRevoked] = React.useState(defaultRevoked);
  const autoId = React.useId();
  const base = id ?? autoId;
  const revokeRef = React.useRef<HTMLButtonElement>(null);
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const [status, setStatus] = React.useState('');

  React.useEffect(() => {
    if (confirming) cancelRef.current?.focus();
  }, [confirming]);

  const cancel = () => {
    setConfirming(false);
    // Back to where the question came from, after the group is gone.
    requestAnimationFrame(() => revokeRef.current?.focus());
  };

  return (
    <div
      data-slot="api-key-field"
      data-state={revoked ? 'revoked' : 'active'}
      role="group"
      aria-labelledby={`${base}-name`}
      className={cn('flex w-full min-w-0 flex-col gap-3 rounded-lg border border-border bg-card p-4 text-card-foreground', className)}
      {...props}
    >
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
        <h3 id={`${base}-name`} className="m-0 min-w-0 truncate text-sm leading-5 font-semibold" title={name}>{name}</h3>
        {revoked ? <Badge variant="soft-destructive" dot>Revoked</Badge> : <Badge variant="soft-success" dot>Active</Badge>}
      </div>

      {revoked ? (
        <p className="m-0 text-sm text-muted-foreground">This key no longer works. Requests that use it are rejected.</p>
      ) : (
        <div className="flex min-w-0 items-center gap-2">
          <Input
            readOnly
            value={revealed ? keyValue : maskSecret(keyValue)}
            aria-label={`${name} key`}
            spellCheck={false}
            autoComplete="off"
            disabled={disabled}
            className="min-w-0 flex-1 font-mono text-ellipsis md:text-sm"
          />
          <ButtonIcon
            variant="outline"
            icon={revealed ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
            label="Show the full key"
            aria-pressed={revealed}
            disabled={disabled}
            onClick={() => setRevealed(r => !r)}
          />
          <CopyButton value={keyValue} label={`Copy ${name} key`} variant="outline" disabled={disabled} />
        </div>
      )}

      <dl className="m-0 flex min-w-0 flex-wrap gap-x-6 gap-y-1 text-sm leading-5">
        <div className="flex min-w-0 gap-1.5">
          <dt className="text-muted-foreground">Created</dt>
          <dd className="m-0 min-w-0 truncate text-foreground">{createdAt}</dd>
        </div>
        <div className="flex min-w-0 gap-1.5">
          <dt className="text-muted-foreground">Last used</dt>
          <dd className="m-0 min-w-0 truncate text-foreground">{lastUsed ?? 'Never'}</dd>
        </div>
      </dl>

      {!revoked && !confirming ? (
        <div>
          <Button ref={revokeRef as React.Ref<HTMLButtonElement>} type="button" variant="outline" size="sm" disabled={disabled} leadingIcon={<Trash2 aria-hidden="true" />} onClick={() => setConfirming(true)} className="text-destructive">
            Revoke<span className="sr-only"> {name}</span>
          </Button>
        </div>
      ) : null}

      {confirming ? (
        <div
          role="group"
          aria-labelledby={`${base}-confirm`}
          aria-describedby={`${base}-confirm-text`}
          onKeyDown={e => {
            if (e.key === 'Escape') { e.stopPropagation(); cancel(); }
          }}
          className="flex min-w-0 flex-col gap-3 rounded-md border border-destructive bg-background p-3"
        >
          <p id={`${base}-confirm`} className="m-0 text-sm leading-5 font-semibold">Revoke "{name}"?</p>
          <p id={`${base}-confirm-text`} className="m-0 text-sm leading-5 text-muted-foreground">Anything that uses this key stops working right away. This cannot be undone.</p>
          <div className="flex flex-wrap gap-2">
            <Button ref={cancelRef as React.Ref<HTMLButtonElement>} type="button" variant="outline" size="sm" onClick={cancel}>Cancel</Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => {
                setConfirming(false);
                setRevoked(true);
                setRevealed(false);
                setStatus(`${name} was revoked.`);
                onRevoke?.();
              }}
            >
              Revoke key
            </Button>
          </div>
        </div>
      ) : null}
      <span role="status" aria-live="polite" className="sr-only">{status}</span>
    </div>
  );
}

export { ApiKeyField };
