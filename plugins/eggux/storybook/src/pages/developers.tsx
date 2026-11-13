import * as React from 'react';
import { Plus } from '@/components/icons';
import { Alert } from '@/components/ui/alert';
import { ApiKeyField } from '@/components/ui/api-key-field';
import { Button } from '@/components/ui/button';
import { Dialog, DialogBody, DialogContent, DialogFooter } from '@/components/ui/dialog';
import { DialogHeader } from '@/components/ui/dialog-header';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { KeyValueEditor, findDuplicateKeys, type KeyValueRow } from '@/components/ui/key-value-editor';
import { PageHeader } from '@/components/ui/page-header';
import { WebhookRow } from '@/components/ui/webhook-row';
import { AppShell } from './app-parts';

interface ApiKey {
  id: string;
  name: string;
  keyValue: string;
  createdAt: string;
  lastUsed: string | null;
}

// Obviously fake keys.
const demoKeys: ApiKey[] = [
  { id: 'k1', name: 'Production server', keyValue: 'sk_live_EXAMPLE_0000000000004f2a', createdAt: '12 Mar 2026', lastUsed: '2 hours ago' },
  { id: 'k2', name: 'Staging', keyValue: 'sk_test_EXAMPLE_0000000000009c1d', createdAt: '2 Jun 2026', lastUsed: '3 days ago' },
  { id: 'k3', name: 'Accounting export', keyValue: 'sk_live_EXAMPLE_000000000000b7e0', createdAt: '28 Oct 2026', lastUsed: null },
];

const demoHooks = [
  { url: 'https://hooks.acme.example/invoices', events: ['invoice.created', 'invoice.paid', 'invoice.overdue', 'customer.updated'], status: 'active' as const, lastDelivery: { code: 200, at: '5 min ago', ok: true } },
  { url: 'https://erp.partner.example/webhooks/acme', events: ['invoice.paid'], status: 'failing' as const, lastDelivery: { code: 502, at: '1 hour ago', ok: false } },
  { url: 'https://old.acme.example/notify', events: ['customer.created', 'customer.updated'], status: 'disabled' as const, lastDelivery: null },
];

const demoHeaders: KeyValueRow[] = [
  { key: 'X-Acme-Source', value: 'billing' },
  { key: 'Content-Type', value: 'application/json' },
];

const fakeKey = (n: number) => `sk_live_EXAMPLE_${String(n).padStart(8, '0')}${(n * 7919).toString(16).padStart(8, '0').slice(-8)}`;

export interface DevelopersPageProps {
  /** Open the Create key dialog first. */
  createOpen?: boolean;
  /** Open the dialog with the name left empty and the message showing. */
  createError?: boolean;
  /** Start with duplicate header names, so the editor shows its message. */
  duplicateHeaders?: boolean;
}

/** Developers: API keys, webhooks and default headers. */
export function DevelopersPage({ createOpen = false, createError = false, duplicateHeaders = false }: DevelopersPageProps) {
  const [keys, setKeys] = React.useState<ApiKey[]>(demoKeys);
  const [creating, setCreating] = React.useState(createOpen || createError);
  const [name, setName] = React.useState('');
  const [nameError, setNameError] = React.useState<string | undefined>(createError ? 'Give the key a name so you can recognise it later.' : undefined);
  const [created, setCreated] = React.useState<ApiKey | null>(null);
  const [revoked, setRevoked] = React.useState<string | null>(null);
  const [headers, setHeaders] = React.useState<KeyValueRow[]>(duplicateHeaders ? [...demoHeaders, { key: 'X-Acme-Source', value: 'erp' }] : demoHeaders);
  const [headersMsg, setHeadersMsg] = React.useState<{ kind: 'success' | 'error'; text: string } | null>(null);

  const closeCreate = (open: boolean) => {
    setCreating(open);
    if (!open) {
      setName('');
      setNameError(undefined);
    }
  };
  const createKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setNameError('Give the key a name so you can recognise it later.');
      return;
    }
    const key: ApiKey = { id: `k${keys.length + 1}`, name: name.trim(), keyValue: fakeKey(keys.length + 1), createdAt: '13 Nov 2026', lastUsed: null };
    setKeys(k => [key, ...k]);
    setCreated(key);
    closeCreate(false);
  };

  const saveHeaders = () => {
    const dup = findDuplicateKeys(headers);
    if (dup.length) {
      setHeadersMsg({ kind: 'error', text: `Header names must be unique. “${dup[0]}” appears more than once.` });
      return;
    }
    const clean = headers.filter(h => h.key.trim() || h.value.trim());
    if (clean.some(h => !h.key.trim())) {
      setHeadersMsg({ kind: 'error', text: 'Every header needs a name.' });
      return;
    }
    setHeaders(clean);
    setHeadersMsg({ kind: 'success', text: `${clean.length} default ${clean.length === 1 ? 'header' : 'headers'} saved.` });
  };

  return (
    <AppShell active="settings" title="Developers" trail={[{ label: 'Settings', href: '#settings' }]}>
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-10">
        <PageHeader title="Developers" description="API keys, webhooks and headers for connecting Acme to your own systems." />

        <section aria-labelledby="keys-title" className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 flex-col gap-1">
              <h2 id="keys-title" className="m-0 text-xl leading-7 font-semibold">API keys</h2>
              <p className="m-0 text-sm leading-5 text-muted-foreground">Keys let a server act for your workspace. Keep them secret.</p>
            </div>
            <Button variant="outline" leadingIcon={<Plus />} onClick={() => setCreating(true)}>Create key</Button>
          </div>
          {created ? (
            <Alert variant="success" title={`Key “${created.name}” created`} description="It is in the list below. Reveal or copy it from there." onDismiss={() => setCreated(null)} />
          ) : null}
          {revoked ? <Alert variant="info" title={`${revoked} was revoked`} onDismiss={() => setRevoked(null)} /> : null}
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            {keys.map(k => (
              <li key={k.id}>
                <ApiKeyField name={k.name} keyValue={k.keyValue} createdAt={k.createdAt} lastUsed={k.lastUsed} onRevoke={() => setRevoked(k.name)} />
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="hooks-title" className="flex flex-col gap-4">
          <div className="flex min-w-0 flex-col gap-1">
            <h2 id="hooks-title" className="m-0 text-xl leading-7 font-semibold">Webhooks</h2>
            <p className="m-0 text-sm leading-5 text-muted-foreground">We send a signed request to these addresses when something happens.</p>
          </div>
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            {demoHooks.map(h => (
              <li key={h.url}>
                <WebhookRow
                  url={h.url}
                  events={h.events}
                  status={h.status}
                  lastDelivery={h.lastDelivery}
                  onTest={() => new Promise<void>((resolve, reject) => window.setTimeout(h.status === 'failing' ? () => reject(new Error('502')) : resolve, 250))}
                />
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="headers-title" className="flex flex-col gap-4">
          <div className="flex min-w-0 flex-col gap-1">
            <h2 id="headers-title" className="m-0 text-xl leading-7 font-semibold">Default headers</h2>
            <p className="m-0 text-sm leading-5 text-muted-foreground">Sent with every webhook request, next to the signature.</p>
          </div>
          <KeyValueEditor aria-label="Default headers" keyLabel="Header" valueLabel="Value" addLabel="Add header" keyPlaceholder="X-Header-Name" valuePlaceholder="value" value={headers} onChange={r => { setHeaders(r); setHeadersMsg(null); }} />
          {headersMsg ? <Alert variant={headersMsg.kind === 'success' ? 'success' : 'destructive'} title={headersMsg.text} /> : null}
          <div><Button onClick={saveHeaders}>Save headers</Button></div>
        </section>
      </div>

      <Dialog open={creating} onOpenChange={closeCreate}>
        <DialogContent size="sm">
          <DialogHeader title="Create API key" description="Name it after the system that will use it." />
          <form noValidate onSubmit={createKey} aria-label="Create API key" className="flex min-h-0 flex-1 flex-col gap-4">
            <DialogBody>
              <Field label="Key name" error={nameError} hint="For example “Production server”." required>
                <Input autoComplete="off" value={name} onChange={e => { setName(e.target.value); setNameError(undefined); }} />
              </Field>
            </DialogBody>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => closeCreate(false)}>Cancel</Button>
              <Button type="submit">Create key</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
