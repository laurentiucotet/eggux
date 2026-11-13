// EGG UI Date Picker Sheet. Code only (no Figma component yet). Mobile page. A date chosen in a
// bottom sheet (the Drawer): a quick row (Today, Tomorrow, Next week, counted from the `now` prop),
// the Calendar, and Cancel and Done. Picking a day or a quick date only changes a draft; Done
// returns it (onDone) and closes, Cancel, Escape and a tap outside throw it away. The draft starts
// from `value` every time the sheet opens. A quick date that is before `minDate` is disabled. Buttons
// are 44 high. Pass `now` so the quick row and "today" are fixed (tests, docs); it defaults to the
// real date. Not for ranges (Date Range Picker) or on desktop (Date Picker with a popover).
import * as React from 'react';
import { cn } from '@/lib/utils';
import { addDays, formatFullDate, isSameDay, startOfDay } from './calendar-date';
import { Button } from './button';
import { Calendar } from './calendar';
import { Drawer, DrawerBody, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from './drawer';

export interface DatePickerSheetProps {
  /** The element that opens the sheet. Focus returns to it on close. */
  trigger?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** The chosen date (controlled). The sheet starts its draft from it. */
  value?: Date;
  /** Called with the draft when Done is pressed. */
  onDone?: (date: Date) => void;
  title?: string;
  description?: string;
  /** The current moment: the quick row and "today" in the calendar count from it. */
  now?: Date;
  /** Days before this cannot be picked (and a quick date before it is disabled). */
  minDate?: Date;
  /** Show the Today, Tomorrow and Next week row. Default true. */
  showQuickDates?: boolean;
  /** Texts translated by the app. */
  labels?: { cancel?: string; done?: string; today?: string; tomorrow?: string; nextWeek?: string };
  locale?: string;
}

interface BodyProps extends Pick<DatePickerSheetProps, 'value' | 'onDone' | 'minDate' | 'showQuickDates' | 'locale'> {
  now: Date;
  t: Required<NonNullable<DatePickerSheetProps['labels']>>;
  close: () => void;
}

function SheetBody({ value, onDone, now, minDate, showQuickDates = true, locale, t, close }: BodyProps) {
  const today = startOfDay(now);
  const [draft, setDraft] = React.useState<Date | undefined>(value ? startOfDay(value) : undefined);
  const [month, setMonth] = React.useState<Date>(draft ?? today);
  const min = minDate ? startOfDay(minDate) : undefined;
  const quick = [
    { key: 'today', label: t.today, date: today },
    { key: 'tomorrow', label: t.tomorrow, date: addDays(today, 1) },
    { key: 'next-week', label: t.nextWeek, date: addDays(today, 7) },
  ];
  const fmt = (d: Date) => formatFullDate(d, locale);
  const pick = (d: Date) => {
    setDraft(d);
    setMonth(d);
  };

  return (
    <>
      <DrawerBody className="gap-3">
        {showQuickDates ? (
          <div role="group" aria-label="Quick dates" className="flex min-w-0 flex-wrap gap-2">
            {quick.map(q => {
              const off = !!min && q.date.getTime() < min.getTime();
              const on = isSameDay(draft, q.date);
              return (
                <Button
                  key={q.key}
                  type="button"
                  variant={on ? 'default' : 'outline'}
                  size="touch"
                  aria-pressed={on}
                  aria-label={`${q.label}, ${fmt(q.date)}`}
                  disabled={off}
                  onClick={() => pick(q.date)}
                  className="min-w-0 shrink"
                >
                  <span className="truncate">{q.label}</span>
                </Button>
              );
            })}
          </div>
        ) : null}
        <div className="flex w-full min-w-0 justify-center">
          <Calendar
            selected={draft}
            onSelect={d => setDraft(startOfDay(d))}
            month={month}
            onMonthChange={setMonth}
            today={today}
            locale={locale}
            disabled={min ? d => d.getTime() < min.getTime() : undefined}
            className="max-w-full"
          />
        </div>
        <p role="status" className={cn('m-0 min-h-5 truncate text-center text-sm leading-5', draft ? 'text-foreground' : 'text-muted-foreground')}>
          {draft ? fmt(draft) : 'No date chosen'}
        </p>
      </DrawerBody>
      <DrawerFooter className="flex-row [&>*]:w-auto [&>*]:flex-1">
        <Button type="button" variant="outline" size="touch" onClick={close}>{t.cancel}</Button>
        <Button
          type="button"
          size="touch"
          disabled={!draft}
          onClick={() => {
            if (!draft) return;
            onDone?.(draft);
            close();
          }}
        >
          {t.done}
        </Button>
      </DrawerFooter>
    </>
  );
}

function DatePickerSheet({
  trigger,
  open,
  defaultOpen,
  onOpenChange,
  value,
  onDone,
  title = 'Choose a date',
  description = 'Pick a day or use a quick date.',
  now,
  minDate,
  showQuickDates,
  labels,
  locale,
}: DatePickerSheetProps) {
  const [inner, setInner] = React.useState(defaultOpen ?? false);
  const isOpen = open ?? inner;
  const setOpen = (next: boolean) => {
    setInner(next);
    onOpenChange?.(next);
  };
  const t = { cancel: 'Cancel', done: 'Done', today: 'Today', tomorrow: 'Tomorrow', nextWeek: 'Next week', ...labels };
  // One `now` for the life of the sheet unless the app passes a fixed one.
  const [realNow] = React.useState(() => new Date());
  return (
    <Drawer open={isOpen} onOpenChange={setOpen}>
      {trigger ? <DrawerTrigger asChild>{trigger}</DrawerTrigger> : null}
      <DrawerContent data-slot="date-picker-sheet" className="gap-3">
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        <SheetBody value={value} onDone={onDone} now={now ?? realNow} minDate={minDate} showQuickDates={showQuickDates} locale={locale} t={t} close={() => setOpen(false)} />
      </DrawerContent>
    </Drawer>
  );
}

export { DatePickerSheet };
