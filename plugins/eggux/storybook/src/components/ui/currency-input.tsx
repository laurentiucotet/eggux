// EGG UI Currency Input. Figma: Currency Input (Input page, "Currency Input / Component", set
// 430:2319). State (default, focus, error via aria-invalid, disabled), Amount ("1,250.00"),
// Currency ("EUR"). An amount with its currency: the Input Group box (pill radius, density height,
// focus ring around the whole field, min width 160) with the currency picker at the start (ISO code
// in ui/label + chevron-down, 12 px sides, 4 px gap, hugs up to 96 and truncates, 1 px border/input
// divider, no fill) and the amount right-aligned in body/small, one line with an ellipsis.
// Behavior: the amount is formatted on blur with Intl.NumberFormat in the `locale` (1,250.00 in
// en-GB, 1.250,00 in de-DE) with the currency's decimals; the typed separators of the locale are
// accepted. The value is stored in minor units with the ISO code (onValueChange(1250_00) and
// onCurrencyChange("EUR")). Changing the currency keeps the amount: it never converts silently.
// One currency (a `currencies` list of one) hides the picker: the code is a fixed Input Addon prefix.
// The currency list is a Dropdown Menu radio group for now; it can switch to Select once Select
// exists in code. The input props go to the amount input, so Field labels and describes it.
import * as React from 'react';
import { ChevronDown } from '@/components/icons';
import { cn } from '@/lib/utils';
import { DEFAULT_LOCALE } from './calendar-date';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from './dropdown-menu';
import { InputGroup } from './input-group';
import { parseNumber } from './range-input';

export interface CurrencyInputProps
  extends Omit<React.ComponentProps<'input'>, 'value' | 'defaultValue' | 'onChange' | 'size' | 'type'> {
  /** Figma Amount, in minor units (125000 = 1,250.00 EUR). Controlled when given; null = empty. */
  value?: number | null;
  /** Figma Amount (uncontrolled), in minor units. */
  defaultValue?: number | null;
  /** Every parsed change of the amount, in minor units (undefined when empty or not a number). */
  onValueChange?: (minor: number | undefined) => void;
  /** Figma Currency: ISO 4217 code (controlled). */
  currency?: string;
  /** Figma Currency (uncontrolled). Default "EUR". */
  defaultCurrency?: string;
  /** A new currency was picked; the amount stays as typed (no conversion). */
  onCurrencyChange?: (currency: string) => void;
  /** ISO codes in the picker. One code hides the picker and shows it as a fixed prefix. */
  currencies?: string[];
  /** Locale of the number format and of the currency names. */
  locale?: string;
  /** Accessible name of the currency trigger, before the code: "Currency" -> "Currency, EUR". */
  currencyLabel?: string;
  /** Class of the amount input (className goes to the box). */
  inputClassName?: string;
}

export const DEFAULT_CURRENCIES = ['EUR', 'USD', 'GBP', 'CHF', 'RON', 'PLN', 'SEK', 'JPY'];

/** Decimals of a currency in a locale: 2 for EUR, 0 for JPY. */
export function currencyDigits(currency: string, locale = DEFAULT_LOCALE) {
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).resolvedOptions().maximumFractionDigits ?? 2;
  } catch {
    return 2;
  }
}

/** 125000 minor EUR -> "1,250.00" (en-GB) or "1.250,00" (de-DE). */
export function formatAmount(minor: number | null | undefined, currency: string, locale = DEFAULT_LOCALE) {
  if (minor === null || minor === undefined) return '';
  const digits = currencyDigits(currency, locale);
  return new Intl.NumberFormat(locale, { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(minor / 10 ** digits);
}

/** "1.250,5" (de-DE) -> 125050 minor units; "" -> undefined. */
export function parseAmount(text: string, currency: string, locale = DEFAULT_LOCALE) {
  const n = parseNumber(text, locale);
  if (n === undefined) return undefined;
  return Math.round(n * 10 ** currencyDigits(currency, locale));
}

function currencyName(code: string, locale: string) {
  try {
    return new Intl.DisplayNames([locale], { type: 'currency' }).of(code) ?? code;
  } catch {
    return code;
  }
}

function CurrencyInput({
  value: valueProp,
  defaultValue = null,
  onValueChange,
  currency: currencyProp,
  defaultCurrency = 'EUR',
  onCurrencyChange,
  currencies = DEFAULT_CURRENCIES,
  locale = DEFAULT_LOCALE,
  currencyLabel = 'Currency',
  className,
  inputClassName,
  disabled,
  placeholder,
  onFocus,
  onBlur,
  ...props
}: CurrencyInputProps) {
  const [innerCurrency, setInnerCurrency] = React.useState(defaultCurrency);
  const currency = currencyProp ?? innerCurrency;
  const [inner, setInner] = React.useState<number | null | undefined>(defaultValue);
  const value = valueProp !== undefined ? valueProp : inner;
  const [text, setText] = React.useState(() => formatAmount(value, currency, locale));
  const focused = React.useRef(false);

  // A controlled value, the currency or the locale changed: show the formatted amount, unless typing.
  React.useEffect(() => {
    if (!focused.current) setText(formatAmount(value, currency, locale));
  }, [value, currency, locale]);

  const pickCurrency = (next: string) => {
    if (next === currency) return;
    if (currencyProp === undefined) setInnerCurrency(next);
    onCurrencyChange?.(next);
  };

  const fixed = currencies.length <= 1;
  const picker = fixed ? (
    currencies[0] ?? currency
  ) : (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          data-slot="currency-input-trigger"
          aria-label={`${currencyLabel}, ${currency}`}
          className="flex h-full max-w-24 min-w-0 shrink-0 items-center gap-1 border-r border-input px-3 text-sm font-medium leading-5 text-foreground outline-none hover:bg-muted focus-visible:bg-muted disabled:cursor-not-allowed"
        >
          <span className="min-w-0 truncate">{currency}</span>
          <ChevronDown className="size-4 shrink-0" aria-hidden="true" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="max-h-72 overflow-y-auto">
        <DropdownMenuRadioGroup value={currency} onValueChange={pickCurrency}>
          {currencies.map(code => (
            <DropdownMenuRadioItem key={code} value={code}>
              <span className="font-medium">{code}</span>
              <span className="text-muted-foreground"> {currencyName(code, locale)}</span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <InputGroup
      className={cn('min-w-40', className)}
      start={picker}
      type="text"
      inputMode="decimal"
      autoComplete="off"
      disabled={disabled}
      placeholder={placeholder ?? formatAmount(0, currency, locale)}
      value={text}
      onChange={e => {
        setText(e.target.value);
        const minor = parseAmount(e.target.value, currency, locale);
        if (valueProp === undefined) setInner(minor ?? null);
        onValueChange?.(minor);
      }}
      onFocus={e => {
        focused.current = true;
        onFocus?.(e);
      }}
      onBlur={e => {
        focused.current = false;
        setText(formatAmount(value, currency, locale));
        onBlur?.(e);
      }}
      inputClassName={cn('text-right tabular-nums', inputClassName)}
      {...props}
    />
  );
}

export { CurrencyInput };
