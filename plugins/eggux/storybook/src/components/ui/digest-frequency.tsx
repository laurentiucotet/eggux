// EGG UI Digest Frequency. Code only (no Figma component yet); family Notifications.
// How often email notifications are bundled: three radio cards (Option Cards in a radiogroup),
// Instant (each one as it happens), Daily (one summary a day) and Weekly (one summary a week).
// The chosen one opens its schedule under the cards: Daily asks "Send at" (a time Select), Weekly
// asks "Send on" (a weekday Select) and "at" (a time Select); Instant asks nothing. A polite status
// says the result in a sentence ("You will get one summary every Monday at 09:00"). Arrow keys
// move between the cards, Tab goes on to the schedule. Controlled with `value` or uncontrolled
// with `defaultValue`. Cards stack in one column and the selects wrap under 276 px.
// Not for choosing a channel (that is Channel Preferences).
import * as React from 'react';
import { cn } from '@/lib/utils';
import { OptionCard, OptionCardGroup } from './option-card';
import { Select, SelectContent, SelectItem, SelectTrigger } from './select';

export type DigestMode = 'instant' | 'daily' | 'weekly';
export type DigestDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface DigestValue {
  mode: DigestMode;
  /** "09:00", for daily and weekly. */
  time: string;
  /** For weekly. */
  day: DigestDay;
}

const dayNames: { key: DigestDay; label: string }[] = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' },
];
const times = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);

export function describeDigest(v: DigestValue): string {
  if (v.mode === 'instant') return 'You will get an email for each notification as it happens.';
  const dayLabel = dayNames.find(d => d.key === v.day)!.label;
  if (v.mode === 'daily') return `You will get one summary every day at ${v.time}.`;
  return `You will get one summary every ${dayLabel} at ${v.time}.`;
}

export interface DigestFrequencyProps extends Omit<React.ComponentProps<'div'>, 'defaultValue' | 'onChange'> {
  value?: DigestValue;
  defaultValue?: DigestValue;
  onValueChange?: (value: DigestValue) => void;
  /** Name of the radiogroup. Default "Email digest". */
  label?: string;
}

const initial: DigestValue = { mode: 'daily', time: '09:00', day: 'monday' };

function DigestFrequency({ value: valueProp, defaultValue = initial, onValueChange, label = 'Email digest', className, ...props }: DigestFrequencyProps) {
  const [inner, setInner] = React.useState<DigestValue>(defaultValue);
  const value = valueProp ?? inner;
  const set = (patch: Partial<DigestValue>) => {
    const next = { ...value, ...patch };
    if (valueProp === undefined) setInner(next);
    onValueChange?.(next);
  };
  return (
    <div data-slot="digest-frequency" data-mode={value.mode} className={cn('flex w-full min-w-0 max-w-120 flex-col gap-4', className)} {...props}>
      <OptionCardGroup aria-label={label} value={value.mode} onValueChange={m => set({ mode: m as DigestMode })}>
        <OptionCard value="instant" title="Instant" description="An email for each notification, as it happens." className="w-full" />
        <OptionCard value="daily" title="Daily" description="One summary every day." className="w-full" />
        <OptionCard value="weekly" title="Weekly" description="One summary every week." className="w-full" />
      </OptionCardGroup>
      {value.mode !== 'instant' ? (
        <div data-slot="digest-schedule" className="flex min-w-0 flex-wrap items-center gap-3">
          {value.mode === 'weekly' ? (
            <div className="flex min-w-0 items-center gap-2">
              <span aria-hidden="true" className="text-sm leading-5 text-foreground">Send on</span>
              <Select value={value.day} onValueChange={d => set({ day: d as DigestDay })}>
                <SelectTrigger aria-label="Send on" className="w-36" />
                <SelectContent>{dayNames.map(d => <SelectItem key={d.key} value={d.key}>{d.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          ) : null}
          <div className="flex min-w-0 items-center gap-2">
            <span aria-hidden="true" className="text-sm leading-5 text-foreground">{value.mode === 'weekly' ? 'at' : 'Send at'}</span>
            <Select value={value.time} onValueChange={t => set({ time: t })}>
              <SelectTrigger aria-label="Send at" className="w-28" />
              <SelectContent className="max-h-60">{times.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
      ) : null}
      <p role="status" className="m-0 text-sm leading-5 text-foreground">{describeDigest(value)}</p>
    </div>
  );
}

export { DigestFrequency };
