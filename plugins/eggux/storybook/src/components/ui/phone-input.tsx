// EGG UI Phone Input. Figma: Phone Input (Input page, "Phone Input / Component", set 430:2348).
// State (default, focus, error via aria-invalid, disabled), Country ("RO +40"), Number
// ("712 345 678"). The Input Group box (pill radius, density height, focus ring around the whole
// field) with the country picker at the start (ISO code and dial code in ui/label + chevron-down,
// 12 px sides, 4 px gap, hugs up to 112 and truncates, 1 px border/input divider, no fill) and the
// number in body/small 12 px after it, one line with an ellipsis.
// Behavior: defaults to the account country (`defaultCountry`); the number is grouped for the
// country as people type; the value is E.164 (+40712345678) through onValueChange. A number typed
// or pasted with the + prefix sets the country from its dial code. A trunk 0 ("0712...") is dropped.
// The country list is a searchable listbox (by country name, ISO code or dial code) in a Popover:
// arrows move, Enter picks, Escape closes and returns focus to the trigger; after a pick focus goes
// to the number. It is built on Popover for now; it can switch to Select / Combobox once Select is in
// code. No libphonenumber: the country table below holds dial codes and grouping only, so the
// number is not validated for length per country (the app validates and sets the Field error).
// The input props go to the number input (type="tel", autocomplete="tel"), so Field labels it.
import * as React from 'react';
import { Check, ChevronDown } from '@/components/icons';
import { cn } from '@/lib/utils';
import { DEFAULT_LOCALE } from './calendar-date';
import { InputGroup } from './input-group';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

export interface PhoneCountry {
  /** ISO 3166-1 alpha-2 code: "RO". */
  code: string;
  /** Dial code without +: "40". */
  dial: string;
  /** Digit groups of the national number: [3, 3, 3] -> "712 345 678". The rest is one group. */
  groups: number[];
  /** Keep a leading 0 (Italy); otherwise a trunk 0 is dropped. */
  keepZero?: boolean;
}

export const PHONE_COUNTRIES: PhoneCountry[] = [
  { code: 'AT', dial: '43', groups: [3, 3, 4] },
  { code: 'BE', dial: '32', groups: [3, 2, 2, 2] },
  { code: 'BG', dial: '359', groups: [2, 3, 4] },
  { code: 'CA', dial: '1', groups: [3, 3, 4] },
  { code: 'CH', dial: '41', groups: [2, 3, 2, 2] },
  { code: 'CZ', dial: '420', groups: [3, 3, 3] },
  { code: 'DE', dial: '49', groups: [3, 4, 4] },
  { code: 'DK', dial: '45', groups: [2, 2, 2, 2] },
  { code: 'ES', dial: '34', groups: [3, 3, 3] },
  { code: 'FR', dial: '33', groups: [1, 2, 2, 2, 2] },
  { code: 'GB', dial: '44', groups: [4, 6] },
  { code: 'GR', dial: '30', groups: [3, 3, 4] },
  { code: 'HU', dial: '36', groups: [2, 3, 4] },
  { code: 'IE', dial: '353', groups: [2, 3, 4] },
  { code: 'IT', dial: '39', groups: [3, 3, 4], keepZero: true },
  { code: 'MD', dial: '373', groups: [3, 2, 3] },
  { code: 'NL', dial: '31', groups: [1, 4, 4] },
  { code: 'PL', dial: '48', groups: [3, 3, 3] },
  { code: 'PT', dial: '351', groups: [3, 3, 3] },
  { code: 'RO', dial: '40', groups: [3, 3, 3] },
  { code: 'SE', dial: '46', groups: [2, 3, 2, 2] },
  { code: 'US', dial: '1', groups: [3, 3, 4] },
];

/** "712345678" for RO -> "712 345 678". */
export function formatNational(digits: string, country: PhoneCountry) {
  const parts: string[] = [];
  let i = 0;
  for (const g of country.groups) {
    if (i >= digits.length) break;
    parts.push(digits.slice(i, i + g));
    i += g;
  }
  if (i < digits.length) parts.push(digits.slice(i));
  return parts.join(' ');
}

const nationalDigits = (text: string, country: PhoneCountry) => {
  const d = text.replace(/\D/g, '');
  return country.keepZero ? d : d.replace(/^0+/, '');
};

/** "+40 712 345 678" -> { country: RO, national: "712345678" }. Prefers `current` on a shared dial code (+1). */
export function parseInternational(text: string, countries: PhoneCountry[], current?: PhoneCountry) {
  const digits = text.replace(/\D/g, '');
  const matches = countries.filter(c => digits.startsWith(c.dial)).sort((a, b) => b.dial.length - a.dial.length);
  if (!matches.length) return undefined;
  const longest = matches.filter(c => c.dial.length === matches[0].dial.length);
  const country = longest.find(c => c.code === current?.code) ?? longest[0];
  return { country, national: nationalDigits(digits.slice(country.dial.length), country) };
}

export const toE164 = (national: string, country: PhoneCountry) => (national ? `+${country.dial}${national}` : '');

export interface PhoneInputProps
  extends Omit<React.ComponentProps<'input'>, 'value' | 'defaultValue' | 'onChange' | 'size' | 'type'> {
  /** The number in E.164 ("+40712345678"). Controlled when given; "" = empty. */
  value?: string;
  /** The number in E.164 (uncontrolled). */
  defaultValue?: string;
  /** Every change, in E.164 ("" when empty), with the country it belongs to. */
  onValueChange?: (e164: string, country: string) => void;
  /** Figma Country: ISO code (controlled). */
  country?: string;
  /** Figma Country (uncontrolled): the country of the account. Default "RO". */
  defaultCountry?: string;
  /** A new country was picked, or set from a pasted + number. */
  onCountryChange?: (country: string) => void;
  /** The countries in the list. Default PHONE_COUNTRIES. */
  countries?: PhoneCountry[];
  /** Locale of the country names. */
  locale?: string;
  /** Name of the country trigger and list: "Country code" -> "Country code, Romania +40". */
  countryLabel?: string;
  /** Placeholder of the search box in the list. */
  searchPlaceholder?: string;
  /** Text when no country matches the search. */
  emptyText?: string;
  /** Class of the number input (className goes to the box). */
  inputClassName?: string;
}

function countryName(code: string, locale: string) {
  try {
    return new Intl.DisplayNames([locale], { type: 'region' }).of(code) ?? code;
  } catch {
    return code;
  }
}

function PhoneInput({
  value: valueProp,
  defaultValue = '',
  onValueChange,
  country: countryProp,
  defaultCountry = 'RO',
  onCountryChange,
  countries = PHONE_COUNTRIES,
  locale = DEFAULT_LOCALE,
  countryLabel = 'Country code',
  searchPlaceholder = 'Search country',
  emptyText = 'No country found',
  className,
  inputClassName,
  disabled,
  onBlur,
  ref,
  ...props
}: PhoneInputProps) {
  const byCode = (code?: string) => countries.find(c => c.code === code);
  const [innerCountry, setInnerCountry] = React.useState(() => {
    const fromValue = (valueProp ?? defaultValue) ? parseInternational(valueProp ?? defaultValue, countries, byCode(defaultCountry)) : undefined;
    return fromValue?.country.code ?? defaultCountry;
  });
  const country = byCode(countryProp ?? innerCountry) ?? countries[0];

  const [inner, setInner] = React.useState(defaultValue);
  const value = valueProp ?? inner;
  const national = React.useMemo(() => {
    if (!value) return '';
    const p = parseInternational(value, countries, country);
    return p && p.country.dial === country.dial ? p.national : value.replace(/\D/g, '');
  }, [value, countries, country]);

  const inputRef = React.useRef<HTMLInputElement>(null);
  React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement, []);

  const setCountry = (next: PhoneCountry) => {
    if (next.code === country.code) return;
    if (countryProp === undefined) setInnerCountry(next.code);
    onCountryChange?.(next.code);
  };
  const setNumber = (nat: string, c: PhoneCountry) => {
    const e164 = toE164(nat, c);
    if (valueProp === undefined) setInner(e164);
    onValueChange?.(e164, c.code);
  };

  // While people type a number with the + prefix it stays as typed; blur shows it formatted.
  const [draft, setDraft] = React.useState<string | null>(null);
  const handleText = (text: string) => {
    if (text.trim().startsWith('+')) {
      setDraft(text);
      const p = parseInternational(text, countries, country);
      if (p) {
        setCountry(p.country);
        setNumber(p.national, p.country);
        return;
      }
    }
    setDraft(null);
    setNumber(nationalDigits(text, country), country);
  };

  // Country list (searchable listbox in a Popover).
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [active, setActive] = React.useState(0);
  const picked = React.useRef(false);
  const listId = React.useId();
  const named = React.useMemo(() => countries.map(c => ({ ...c, name: countryName(c.code, locale) })), [countries, locale]);
  const q = query.trim().toLowerCase().replace(/^\+/, '');
  const filtered = q
    ? named.filter(c => c.name.toLowerCase().includes(q) || c.code.toLowerCase() === q || c.dial.startsWith(q))
    : named;

  React.useEffect(() => {
    if (!open) return;
    setQuery('');
    setActive(Math.max(0, named.findIndex(c => c.code === country.code)));
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const pick = (c: PhoneCountry) => {
    picked.current = true;
    setCountry(c);
    if (national) setNumber(national, c);
    setOpen(false);
  };

  const onSearchKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const last = filtered.length - 1;
    const moves: Record<string, () => number> = {
      ArrowDown: () => Math.min(last, active + 1),
      ArrowUp: () => Math.max(0, active - 1),
      Home: () => 0,
      End: () => last,
    };
    if (moves[e.key]) {
      e.preventDefault();
      setActive(moves[e.key]());
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[active]) pick(filtered[active]);
    }
  };

  React.useEffect(() => {
    if (open) document.getElementById(`${listId}-${active}`)?.scrollIntoView({ block: 'nearest' });
  }, [active, open, listId]);

  const name = countryName(country.code, locale);
  const picker = (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          data-slot="phone-input-trigger"
          aria-label={`${countryLabel}, ${name}, ${country.code} +${country.dial}`}
          className="flex h-full max-w-28 min-w-0 shrink-0 items-center gap-1 border-r border-input px-3 text-sm font-medium leading-5 text-foreground outline-none hover:bg-muted focus-visible:bg-muted disabled:cursor-not-allowed"
        >
          <span className="min-w-0 truncate">{`${country.code} +${country.dial}`}</span>
          <ChevronDown className="size-4 shrink-0" aria-hidden="true" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        aria-label={countryLabel}
        className="w-64 max-w-[calc(100vw-16px)] p-1"
        onCloseAutoFocus={e => {
          if (picked.current) {
            e.preventDefault();
            picked.current = false;
            inputRef.current?.focus();
          }
        }}
      >
        <input
          data-slot="phone-input-search"
          role="combobox"
          aria-label={searchPlaceholder}
          aria-expanded="true"
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={filtered[active] ? `${listId}-${active}` : undefined}
          placeholder={searchPlaceholder}
          value={query}
          onChange={e => { setQuery(e.target.value); setActive(0); }}
          onKeyDown={onSearchKey}
          className="mb-1 h-8 w-full rounded-sm border-b border-border bg-transparent px-2 text-sm leading-5 text-popover-foreground outline-none placeholder:text-muted-foreground"
        />
        <ul id={listId} role="listbox" aria-label={countryLabel} className="max-h-60 overflow-y-auto">
          {filtered.map((c, i) => (
            <li
              key={c.code}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === active}
              data-current={c.code === country.code ? '' : undefined}
              onMouseMove={() => setActive(i)}
              onMouseDown={e => e.preventDefault()}
              onClick={() => pick(c)}
              className={cn(
                'flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-[var(--menu-padding-y)] text-sm leading-5 text-popover-foreground',
                i === active && 'bg-accent text-accent-foreground',
              )}
            >
              <span className="min-w-0 flex-1 truncate">{c.name}</span>
              <span className={cn('shrink-0 tabular-nums', i === active ? 'text-current' : 'text-muted-foreground')}>+{c.dial}</span>
              <Check className={cn('size-4 shrink-0', c.code === country.code ? 'opacity-100' : 'opacity-0')} aria-hidden="true" />
            </li>
          ))}
        </ul>
        {filtered.length === 0 ? <p role="status" className="px-2 py-1.5 text-sm text-muted-foreground">{emptyText}</p> : null}
      </PopoverContent>
    </Popover>
  );

  return (
    <InputGroup
      ref={inputRef}
      className={cn('min-w-40', className)}
      start={picker}
      type="tel"
      autoComplete="tel"
      inputMode="tel"
      disabled={disabled}
      value={draft ?? formatNational(national, country)}
      onChange={e => handleText(e.target.value)}
      onBlur={e => { setDraft(null); onBlur?.(e); }}
      inputClassName={inputClassName}
      {...props}
    />
  );
}

export { PhoneInput };
