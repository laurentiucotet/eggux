// EGG UI Share Access List. Code only (no Figma component yet); family Access.
// Who can open something: a list of people and groups, each with an Avatar (a group gets the Users
// icon), name over email or member count, an Access Level Select and a Remove button, then an
// "Anyone with the link" row with a Switch (the level shows only while it is on). The owner row is
// locked: "Owner" as text with a lock, no select and no Remove. Rows are list items, 8 px apart;
// name and detail truncate; under about 400 px the select and Remove wrap below the name.
// Controlled by the parent or on its own: it keeps its own copy of `people` and `link` and reports
// every change (`onLevelChange`, `onRemove`, `onLinkChange`). A removal is announced in a live
// region ("Removed Maria Ilie") and focus moves to the next row's select, or the last one.
// Built from Avatar, Access Level Select, Button Icon, Switch.
// A11y: `<ul>` named by `label`; every select is named "Access for <name>", Remove "Remove <name>".
import * as React from 'react';
import { Globe, Lock, Users, X } from '@/components/icons';
import { cn } from '@/lib/utils';
import { AccessLevelSelect, defaultAccessLevels, type AccessLevel } from './access-level-select';
import { Avatar } from './avatar';
import { ButtonIcon } from './button-icon';
import { Switch } from './switch';

export interface ShareEntry {
  id: string;
  name: string;
  /** Email for a person, "12 members" for a group. */
  detail?: string;
  type?: 'person' | 'group';
  initials?: string;
  /** The level value ("editor"). Ignored for the owner. */
  level?: string;
  /** The owner: locked, first, cannot be removed. */
  owner?: boolean;
}

export interface ShareLinkAccess {
  enabled: boolean;
  level: string;
}

export interface ShareAccessListProps extends Omit<React.ComponentProps<'div'>, 'children' | 'onChange'> {
  /** Accessible name of the list ("People with access to Q3 plan"). */
  label?: string;
  people: ShareEntry[];
  levels?: AccessLevel[];
  /** The "Anyone with the link" row. Leave out to hide it. */
  link?: ShareLinkAccess;
  /** Levels offered to link visitors (default: Viewer and Commenter only). */
  linkLevels?: AccessLevel[];
  /** Everything is shown, nothing can change. */
  readOnly?: boolean;
  onLevelChange?: (id: string, level: string) => void;
  onRemove?: (id: string) => void;
  onLinkChange?: (link: ShareLinkAccess) => void;
}

const selectWidth = 'w-[132px]';

function ShareAccessList({
  label = 'People with access',
  people: peopleProp,
  levels = defaultAccessLevels,
  link: linkProp,
  linkLevels,
  readOnly = false,
  onLevelChange,
  onRemove,
  onLinkChange,
  className,
  ...props
}: ShareAccessListProps) {
  const [people, setPeople] = React.useState(peopleProp);
  const [link, setLink] = React.useState(linkProp);
  const [announce, setAnnounce] = React.useState('');
  const listRef = React.useRef<HTMLUListElement>(null);
  const focusAfter = React.useRef<string | null>(null);
  const linkId = React.useId();

  // Owner first, then the order given. The owner level is not offered to anyone else.
  const sorted = React.useMemo(() => [...people].sort((a, b) => Number(!!b.owner) - Number(!!a.owner)), [people]);
  const pickable = levels.map(l => (l.value === 'owner' && !l.disabled ? { ...l, disabled: true, disabledReason: l.disabledReason ?? 'Only the owner can transfer ownership' } : l));
  const forLink = linkLevels ?? levels.filter(l => l.value === 'viewer' || l.value === 'commenter');

  React.useEffect(() => {
    const id = focusAfter.current;
    if (!id) return;
    focusAfter.current = null;
    const el = listRef.current?.querySelector<HTMLElement>(`[data-entry-id="${id}"] [role="combobox"]`);
    (el ?? listRef.current)?.focus();
  }, [people]);

  const remove = (entry: ShareEntry) => {
    const i = sorted.findIndex(p => p.id === entry.id);
    const next = sorted[i + 1] ?? sorted[i - 1];
    focusAfter.current = next?.id ?? null;
    setPeople(list => list.filter(p => p.id !== entry.id));
    setAnnounce(`Removed ${entry.name}`);
    onRemove?.(entry.id);
  };

  return (
    <div data-slot="share-access-list" className={cn('flex min-w-0 flex-col', className)} {...props}>
      <ul ref={listRef} tabIndex={-1} aria-label={label} className="m-0 flex list-none flex-col gap-2 p-0 outline-none">
        {sorted.map(p => (
          <li key={p.id} data-slot="share-access-row" data-entry-id={p.id} data-owner={p.owner || undefined} className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2 py-1">
            <div className="flex min-w-40 flex-1 items-center gap-3">
              {p.type === 'group' ? <Avatar icon={<Users />} type="icon" /> : <Avatar initials={p.initials ?? p.name.slice(0, 2).toUpperCase()} />}
              <div className="flex min-w-0 flex-1 flex-col">
                <span title={p.name} className="truncate text-sm leading-5 font-medium text-foreground">{p.name}</span>
                {p.detail ? <span title={p.detail} className="truncate text-xs leading-4 text-muted-foreground">{p.detail}</span> : null}
              </div>
            </div>
            <div className="ml-auto flex shrink-0 items-center gap-2">
              {p.owner ? (
                <span className="flex h-8 items-center gap-1.5 px-2 text-sm leading-5 text-muted-foreground">
                  <Lock aria-hidden="true" className="size-4" />
                  Owner
                </span>
              ) : (
                <>
                  <AccessLevelSelect
                    label={`Access for ${p.name}`}
                    size="sm"
                    levels={pickable}
                    value={p.level ?? 'viewer'}
                    readOnly={readOnly}
                    className={selectWidth}
                    onValueChange={level => {
                      setPeople(list => list.map(x => (x.id === p.id ? { ...x, level } : x)));
                      onLevelChange?.(p.id, level);
                    }}
                  />
                  {readOnly ? null : <ButtonIcon variant="ghost" size="sm" label={`Remove ${p.name}`} icon={<X aria-hidden="true" />} onClick={() => remove(p)} />}
                </>
              )}
            </div>
          </li>
        ))}
        {link ? (
          <li data-slot="share-access-row" data-kind="link" className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2 border-t border-border pt-3">
            <div className="flex min-w-40 flex-1 items-center gap-3">
              <span aria-hidden="true" className={cn('flex size-8 shrink-0 items-center justify-center rounded-full [&_svg]:size-4', link.enabled ? 'bg-success text-success-foreground' : 'bg-muted text-foreground')}>
                <Globe />
              </span>
              <div className="flex min-w-0 flex-1 flex-col">
                <span id={`${linkId}-name`} className="truncate text-sm leading-5 font-medium text-foreground">Anyone with the link</span>
                <span className="truncate text-xs leading-4 text-muted-foreground">{link.enabled ? 'Anyone on the internet can open it' : 'Off: only people above can open it'}</span>
              </div>
            </div>
            <div className="ml-auto flex shrink-0 items-center gap-2">
              {link.enabled ? (
                <AccessLevelSelect
                  label="Access for anyone with the link"
                  size="sm"
                  levels={forLink}
                  value={link.level}
                  readOnly={readOnly}
                  className={selectWidth}
                  onValueChange={level => {
                    const next = { ...link, level };
                    setLink(next);
                    onLinkChange?.(next);
                  }}
                />
              ) : null}
              <Switch
                aria-labelledby={`${linkId}-name`}
                checked={link.enabled}
                disabled={readOnly}
                onCheckedChange={enabled => {
                  const next = { ...link, enabled };
                  setLink(next);
                  setAnnounce(enabled ? 'Link access turned on' : 'Link access turned off');
                  onLinkChange?.(next);
                }}
              />
            </div>
          </li>
        ) : null}
      </ul>
      <span role="status" aria-live="polite" className="sr-only">{announce}</span>
    </div>
  );
}

export { ShareAccessList };
