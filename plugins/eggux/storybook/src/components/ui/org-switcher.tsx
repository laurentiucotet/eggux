// EGG UI Org Switcher. Figma: Org Switcher (Sidebar page, "Org Switcher / Component", 180:1253).
// Switch between organizations, tenants or workspaces, opened from the Sidebar Workspace. Popover
// surface 288 wide (min 192), radius md, shadow md, 4 px bottom padding: a Command Input search
// (36, border-b) when there are more than 5, an "Organizations" caption, rows (6 / 8 px, 8 gap,
// radius sm; a 28 logo square on primary with initials, name ui/label, "Role · Plan" ui/caption
// muted, a check on the current one), a Separator, then "Create organization" (plus) and "Manage
// organizations" (settings), body/small. Names, roles and actions truncate to one line.
// WAI-ARIA: the search (or the list itself) drives a listbox with aria-activedescendant; the two
// actions are the last options, so the arrows reach them. Arrows move, Enter switches, Escape
// closes and returns focus to the trigger; the current organization is aria-selected. Switching
// reloads the app data and keeps the same kind of page (the app's job); no toast.
import * as React from 'react';
import { Check, Plus, Search, Settings } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Listbox, ListboxContext, ListboxStatus, useListbox } from './select-option';

export interface Organization {
  id: string;
  name: string;
  /** "Owner", "Admin", "Member". */
  role?: string;
  /** "Enterprise", "Business". */
  plan?: string;
  /** Two letters for the logo square; default from the name. */
  initials?: string;
  /** A logo image URL instead of initials. */
  logo?: string;
}

export interface OrgSwitcherProps {
  organizations: Organization[];
  /** The current organization id. */
  value: string;
  onSwitch?: (id: string) => void;
  /** "Create organization"; hidden when not given. */
  onCreate?: () => void;
  /** "Manage organizations"; hidden when not given. */
  onManage?: () => void;
  /** The trigger: a SidebarWorkspace. */
  children: React.ReactElement;
  /** Show the search from this many organizations on. */
  searchFrom?: number;
  labels?: Partial<{ search: string; heading: string; create: string; manage: string; empty: (q: string) => string; list: string }>;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'right' | 'bottom' | 'left';
}

const CREATE = '\u0000create';
const MANAGE = '\u0000manage';
const initialsOf = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map(p => p[0]!.toLocaleUpperCase()).join('');

function OrgRow({ org, current }: { org: Organization; current: boolean }) {
  const ctx = React.useContext(ListboxContext)!;
  const highlighted = ctx.activeValue === org.id;
  const detail = [org.role, org.plan].filter(Boolean).join(' · ');
  return (
    <div
      id={ctx.optionId(org.id)}
      role="option"
      aria-selected={current}
      data-slot="org-switcher-org"
      data-highlighted={highlighted || undefined}
      onMouseDown={e => e.preventDefault()}
      onMouseMove={() => { if (!highlighted) ctx.setActiveValue(org.id); }}
      onClick={() => ctx.select(org.id)}
      className="group/org flex min-w-0 cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-popover-foreground select-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground"
    >
      <span aria-hidden="true" className="flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-md bg-primary text-xs leading-4 text-primary-foreground">
        {org.logo ? <img src={org.logo} alt="" className="size-full object-cover" /> : (org.initials ?? initialsOf(org.name))}
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span title={org.name} className="truncate text-sm leading-5 font-medium">{org.name}</span>
        {detail ? <span className="truncate text-xs leading-4 text-muted-foreground group-data-[highlighted]/org:text-[var(--input-filled-muted-foreground)]">{detail}</span> : null}
      </span>
      {current ? <Check aria-hidden="true" className="size-4 shrink-0" /> : null}
    </div>
  );
}

function ActionRow({ value, icon, children }: { value: string; icon: React.ReactNode; children: React.ReactNode }) {
  const ctx = React.useContext(ListboxContext)!;
  const highlighted = ctx.activeValue === value;
  return (
    <div
      id={ctx.optionId(value)}
      role="option"
      aria-selected={false}
      data-slot="org-switcher-action"
      data-highlighted={highlighted || undefined}
      onMouseDown={e => e.preventDefault()}
      onMouseMove={() => { if (!highlighted) ctx.setActiveValue(value); }}
      onClick={() => ctx.select(value)}
      className="flex min-w-0 cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm leading-5 text-popover-foreground select-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground [&_svg]:size-4 [&_svg]:shrink-0"
    >
      {icon}
      <span className="min-w-0 flex-1 truncate">{children}</span>
    </div>
  );
}

function OrgSwitcher({
  organizations,
  value,
  onSwitch,
  onCreate,
  onManage,
  children,
  searchFrom = 6,
  labels,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  align = 'start',
  side = 'bottom',
}: OrgSwitcherProps) {
  const L = {
    search: 'Find organization',
    heading: 'Organizations',
    create: 'Create organization',
    manage: 'Manage organizations',
    empty: (q: string) => `No organization matches “${q}”`,
    list: 'Organizations',
    ...labels,
  };
  const [openInner, setOpenInner] = React.useState(defaultOpen);
  const open = openProp ?? openInner;
  const [query, setQuery] = React.useState('');
  const setOpen = (o: boolean) => {
    setOpenInner(o);
    onOpenChange?.(o);
    if (!o) setQuery('');
  };
  const showSearch = organizations.length >= searchFrom;
  const q = query.trim().toLocaleLowerCase();
  const shown = q ? organizations.filter(o => o.name.toLocaleLowerCase().includes(q)) : organizations;
  const actions = [...(onCreate ? [CREATE] : []), ...(onManage ? [MANAGE] : [])];
  const pick = (v: string) => {
    setOpen(false);
    if (v === CREATE) onCreate?.();
    else if (v === MANAGE) onManage?.();
    else if (v !== value) onSwitch?.(v);
  };
  const lb = useListbox({ items: [...shown.map(o => ({ value: o.id })), ...actions.map(a => ({ value: a }))], onSelect: pick, initialActive: value });
  React.useEffect(() => {
    if (open) lb.setActiveValue(shown.some(o => o.id === value) ? value : shown[0]?.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const keyHost = (e: React.KeyboardEvent) => {
    lb.onKeyDown(e);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        align={align}
        side={side}
        aria-label={L.list}
        className="w-72 max-w-[calc(100vw-1rem)] min-w-48 overflow-hidden p-0 pb-1"
        onOpenAutoFocus={e => {
          e.preventDefault();
          (e.currentTarget as HTMLElement).querySelector<HTMLElement>('[data-slot="org-switcher-focus"]')?.focus({ preventScroll: true });
        }}
      >
        {showSearch ? (
          <div className="flex h-[var(--control-height)] items-center gap-2 border-b border-border px-3">
            <Search aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
            <input
              data-slot="org-switcher-focus"
              role="combobox"
              aria-expanded="true"
              aria-controls={lb.listboxId}
              aria-activedescendant={lb.activeId}
              aria-autocomplete="list"
              aria-label={L.search}
              placeholder={L.search}
              autoComplete="off"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={keyHost}
              className="h-full min-w-0 flex-1 bg-transparent text-sm text-popover-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>
        ) : null}
        <Listbox
          state={lb}
          aria-label={L.list}
          data-slot={showSearch ? 'listbox' : 'org-switcher-focus'}
          tabIndex={showSearch ? undefined : 0}
          aria-activedescendant={showSearch ? undefined : lb.activeId}
          onKeyDown={showSearch ? undefined : keyHost}
          className="max-h-none overflow-visible p-0"
        >
          <div className="p-1">
            <div aria-hidden="true" className="px-2 py-0.5 text-xs leading-4 text-muted-foreground">{L.heading}</div>
            {shown.map(o => <OrgRow key={o.id} org={o} current={o.id === value} />)}
          </div>
          {actions.length ? (
            <>
              <div aria-hidden="true" className="my-1 h-px bg-border" />
              <div className="px-1">
                {onCreate ? <ActionRow value={CREATE} icon={<Plus aria-hidden="true" />}>{L.create}</ActionRow> : null}
                {onManage ? <ActionRow value={MANAGE} icon={<Settings aria-hidden="true" />}>{L.manage}</ActionRow> : null}
              </div>
            </>
          ) : null}
        </Listbox>
        {shown.length === 0 ? <ListboxStatus className="py-3">{L.empty(query.trim())}</ListboxStatus> : null}
      </PopoverContent>
    </Popover>
  );
}

export { OrgSwitcher };
