// EGG UI Scope Chip List. Code only (no Figma component yet); family Access.
// The permissions an app asks for (OAuth-style scopes: "contacts.read") as a list of chips. Each chip
// is the scope name, its risk written out in text (Low, Medium, High risk; Medium and High also get
// an icon, and the tone follows, so risk is never color alone) and, when allowed, a remove button.
// The name part is a button that shows the description in a tooltip on hover or focus; the same text
// is read after the chip's name. Removing keeps focus in the list (next chip, else the previous, else
// the list) and says "Removed <scope>" in a live region. Read-only drops the remove buttons. Chips
// wrap to new lines, never overflow; a long scope name truncates at 288 px and shows in full in the
// tooltip. Empty shows `emptyText`.
// A11y: a `<ul>` named by `label`; chip button name = "<scope>, <risk> risk"; description via
// tooltip (aria-describedby while open); remove = "Remove <scope>".
import * as React from 'react';
import { TriangleAlert, X } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

export type ScopeRisk = 'low' | 'medium' | 'high';

export interface Scope {
  id: string;
  /** The scope as the app names it ("contacts.read"). */
  name: string;
  /** What access it gives, in plain words. */
  description: string;
  risk: ScopeRisk;
}

const riskText: Record<ScopeRisk, string> = { low: 'Low risk', medium: 'Medium risk', high: 'High risk' };
// Written out in full so Tailwind can read each class.
const riskTone: Record<ScopeRisk, string> = {
  low: 'border-[var(--badge-soft-neutral-bg)] bg-[var(--badge-soft-neutral-bg)] text-[var(--badge-soft-neutral-fg)]',
  medium: 'border-[var(--badge-soft-warning-bg)] bg-[var(--badge-soft-warning-bg)] text-[var(--badge-soft-warning-fg)]',
  high: 'border-[var(--badge-soft-destructive-bg)] bg-[var(--badge-soft-destructive-bg)] text-[var(--badge-soft-destructive-fg)]',
};

export interface ScopeChipListProps extends Omit<React.ComponentProps<'div'>, 'children' | 'onChange'> {
  /** Accessible name of the list ("Permissions requested by Acme Sync"). */
  label?: string;
  scopes: Scope[];
  /** No remove buttons. */
  readOnly?: boolean;
  /** Shown when no scope is left. */
  emptyText?: string;
  onRemove?: (id: string) => void;
}

function ScopeChipList({
  label = 'Requested permissions',
  scopes: scopesProp,
  readOnly = false,
  emptyText = 'No permissions requested.',
  onRemove,
  className,
  ...props
}: ScopeChipListProps) {
  const [scopes, setScopes] = React.useState(scopesProp);
  const [announce, setAnnounce] = React.useState('');
  const listRef = React.useRef<HTMLUListElement>(null);
  const emptyRef = React.useRef<HTMLParagraphElement>(null);
  const focusAfter = React.useRef<string | null | undefined>(undefined);

  React.useEffect(() => {
    if (focusAfter.current === undefined) return;
    const id = focusAfter.current;
    focusAfter.current = undefined;
    const el = id ? listRef.current?.querySelector<HTMLElement>(`[data-scope-id="${id}"] [data-slot="scope-remove"]`) : null;
    (el ?? listRef.current ?? emptyRef.current)?.focus();
  }, [scopes]);

  const remove = (s: Scope) => {
    const i = scopes.findIndex(x => x.id === s.id);
    const next = scopes[i + 1] ?? scopes[i - 1];
    focusAfter.current = next?.id ?? null;
    setScopes(list => list.filter(x => x.id !== s.id));
    setAnnounce(`Removed ${s.name}`);
    onRemove?.(s.id);
  };

  return (
    <div data-slot="scope-chip-list" className={cn('min-w-0', className)} {...props}>
      {scopes.length ? (
        <TooltipProvider>
          <ul ref={listRef} tabIndex={-1} aria-label={label} className="m-0 flex list-none flex-wrap gap-2 p-0 outline-none">
            {scopes.map(s => (
              <li
                key={s.id}
                data-slot="scope-chip"
                data-scope-id={s.id}
                data-risk={s.risk}
                className={cn(
                  'inline-flex h-8 max-w-72 min-w-0 items-center rounded-full border text-sm leading-5 font-medium',
                  'has-[[data-slot=scope-button]:focus-visible]:shadow-[0_0_0_2px_var(--background),0_0_0_4px_var(--ring)]',
                  riskTone[s.risk],
                )}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      data-slot="scope-button"
                      aria-label={`${s.name}, ${riskText[s.risk].toLowerCase()}`}
                      className={cn('inline-flex h-full min-w-0 cursor-help items-center gap-1.5 rounded-full outline-none', readOnly ? 'px-3' : 'pr-1 pl-3')}
                    >
                      <span className="min-w-0 truncate">{s.name}</span>
                      <span className="flex shrink-0 items-center gap-1 text-xs leading-4 font-normal">
                        <span aria-hidden="true">·</span>
                        {s.risk === 'low' ? null : <TriangleAlert aria-hidden="true" className="size-3" />}
                        {riskText[s.risk]}
                      </span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent title={s.name}>{s.description}</TooltipContent>
                </Tooltip>
                {readOnly ? null : (
                  <button
                    type="button"
                    data-slot="scope-remove"
                    aria-label={`Remove ${s.name}`}
                    onClick={() => remove(s)}
                    className="mr-1 inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-full outline-none hover:bg-background/50 focus-visible:ring-2 focus-visible:ring-ring [&_svg]:size-3.5"
                  >
                    <X aria-hidden="true" />
                  </button>
                )}
              </li>
            ))}
          </ul>
        </TooltipProvider>
      ) : (
        <p ref={emptyRef} tabIndex={-1} className="text-sm leading-5 text-muted-foreground outline-none">{emptyText}</p>
      )}
      <span role="status" aria-live="polite" className="sr-only">{announce}</span>
    </div>
  );
}

export { ScopeChipList };
