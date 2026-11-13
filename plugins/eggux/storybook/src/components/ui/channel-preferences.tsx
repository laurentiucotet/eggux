// EGG UI Channel Preferences. Code only (no Figma component yet); family Notifications.
// A matrix of events (rows) by channels (columns, default Email / Push / In app) with one Switch in
// every cell. A real table: caption (sr-only, or visible with `caption`), column headers
// (`th scope=col`), row headers (`th scope=row` with the event name, an optional description and a
// one-line summary of where it arrives: "Email, In app" or "Off"). The column header holds a switch
// that turns the channel on or off for every event ("All Email"); it is on only when every event
// is on. Each cell switch is named by its row and column ("Invoice paid by Email"), so it is
// understood out of its cell. The header switch result is announced in one polite status ("Email
// on for 4 events"); single switches are announced by the switch itself. Controlled with
// `value` or uncontrolled with `defaultValue` (event id -> channel key -> on). The channel columns
// are 56 px wide, so the table fits 276 px; names wrap, the summary truncates.
// Not for a single setting (that is Setting Row).
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Switch } from './switch';

export interface PreferenceEvent {
  id: string;
  label: string;
  description?: string;
}
export interface PreferenceChannel {
  key: string;
  label: string;
}
export type PreferenceMatrix = Record<string, Record<string, boolean>>;

export const defaultChannels: PreferenceChannel[] = [
  { key: 'email', label: 'Email' },
  { key: 'push', label: 'Push' },
  { key: 'inapp', label: 'In app' },
];

export interface ChannelPreferencesProps extends Omit<React.ComponentProps<'div'>, 'defaultValue' | 'onChange'> {
  events: PreferenceEvent[];
  channels?: PreferenceChannel[];
  value?: PreferenceMatrix;
  defaultValue?: PreferenceMatrix;
  onValueChange?: (value: PreferenceMatrix) => void;
  /** Text of the table caption. Default "Notification channels by event". */
  caption?: string;
  /** Show the caption instead of hiding it for screen readers only. */
  showCaption?: boolean;
  /** Show the one-line summary under each event. Default true. */
  showSummary?: boolean;
  disabled?: boolean;
}

function ChannelPreferences({
  events,
  channels = defaultChannels,
  value: valueProp,
  defaultValue,
  onValueChange,
  caption = 'Notification channels by event',
  showCaption = false,
  showSummary = true,
  disabled = false,
  className,
  ...props
}: ChannelPreferencesProps) {
  const [inner, setInner] = React.useState<PreferenceMatrix>(defaultValue ?? {});
  const [announce, setAnnounce] = React.useState('');
  const value = valueProp ?? inner;
  const isOn = (eventId: string, key: string) => Boolean(value[eventId]?.[key]);
  const commit = (next: PreferenceMatrix) => {
    if (valueProp === undefined) setInner(next);
    onValueChange?.(next);
  };
  const setCell = (eventId: string, key: string, on: boolean) => {
    commit({ ...value, [eventId]: { ...value[eventId], [key]: on } });
  };
  const setColumn = (channel: PreferenceChannel, on: boolean) => {
    const next: PreferenceMatrix = {};
    for (const e of events) next[e.id] = { ...value[e.id], [channel.key]: on };
    commit({ ...value, ...next });
    setAnnounce(`${channel.label} ${on ? 'on' : 'off'} for ${events.length} ${events.length === 1 ? 'event' : 'events'}`);
  };
  const where = (eventId: string) => {
    const on = channels.filter(c => isOn(eventId, c.key)).map(c => c.label);
    return on.length ? on.join(', ') : 'Off';
  };

  return (
    <div data-slot="channel-preferences" className={cn('w-full min-w-0 max-w-160 overflow-hidden rounded-lg border border-border bg-card text-card-foreground', className)} {...props}>
      <table className="w-full table-fixed border-collapse text-left">
        <caption className={cn(showCaption ? 'px-3 py-3 text-left text-sm leading-5 font-medium text-foreground' : 'sr-only')}>{caption}</caption>
        <colgroup>
          <col />
          {channels.map(c => <col key={c.key} className="w-14" />)}
        </colgroup>
        <thead>
          <tr className="border-b border-border">
            <th scope="col" className="px-3 py-2 text-xs leading-4 font-medium text-foreground">Event</th>
            {channels.map(c => {
              const all = events.length > 0 && events.every(e => isOn(e.id, c.key));
              return (
                <th key={c.key} scope="col" className="px-1 py-2 text-center align-bottom text-xs leading-4 font-medium text-foreground">
                  <span className="flex min-w-0 flex-col items-center gap-1.5">
                    <span className="max-w-full truncate">{c.label}</span>
                    <Switch size="sm" aria-label={`All ${c.label}`} checked={all} disabled={disabled} onCheckedChange={on => setColumn(c, on)} />
                  </span>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {events.map(e => (
            <tr key={e.id} className="border-b border-border last:border-b-0">
              <th scope="row" className="min-w-0 px-3 py-3 align-middle font-normal">
                <span className="block break-words text-sm leading-5 font-medium text-foreground">{e.label}</span>
                {e.description ? <span className="block break-words text-xs leading-4 text-muted-foreground">{e.description}</span> : null}
                {showSummary ? <span data-slot="channel-summary" className="block truncate text-xs leading-4 text-muted-foreground">{where(e.id)}</span> : null}
              </th>
              {channels.map(c => (
                <td key={c.key} className="px-1 py-3 text-center align-middle">
                  <Switch
                    size="sm"
                    aria-label={`${e.label} by ${c.label}`}
                    checked={isOn(e.id, c.key)}
                    disabled={disabled}
                    onCheckedChange={on => setCell(e.id, c.key, on)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <span role="status" className="sr-only">{announce}</span>
    </div>
  );
}

export { ChannelPreferences };
