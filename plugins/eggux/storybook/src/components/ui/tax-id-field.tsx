// EGG UI Tax ID Field. Code only (no Figma component yet); Billing family.
// A VAT number input for invoices: a country Select and an Input inside Fields. The number is kept
// with its country prefix ("DE123456789"), upper case, with spaces, dots and dashes removed as you
// type. The format is checked when the field loses focus (never while typing) against the
// country's pattern and the error says what to type with an example. A valid format is said in
// words: it only means the shape is right, the number is checked with the tax authority when saved.
// Needs a Field label, so the error is linked with aria-describedby and aria-invalid.
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Field } from './field';
import { Input } from './input';
import { Select, SelectContent, SelectItem, SelectTrigger } from './select';

interface Rule {
  name: string;
  pattern: RegExp;
  example: string;
  shape: string;
}

const rules: Record<string, Rule> = {
  DE: { name: 'Germany', pattern: /^DE\d{9}$/, example: 'DE123456789', shape: 'DE followed by 9 digits' },
  FR: { name: 'France', pattern: /^FR[A-Z0-9]{2}\d{9}$/, example: 'FR12345678901', shape: 'FR followed by 2 characters and 9 digits' },
  IE: { name: 'Ireland', pattern: /^IE\d{7}[A-Z]{1,2}$/, example: 'IE1234567T', shape: 'IE followed by 7 digits and 1 or 2 letters' },
  IT: { name: 'Italy', pattern: /^IT\d{11}$/, example: 'IT12345678901', shape: 'IT followed by 11 digits' },
  NL: { name: 'Netherlands', pattern: /^NL\d{9}B\d{2}$/, example: 'NL123456789B01', shape: 'NL, 9 digits, the letter B and 2 digits' },
  RO: { name: 'Romania', pattern: /^RO\d{2,10}$/, example: 'RO1234567890', shape: 'RO followed by 2 to 10 digits' },
};

export const taxIdCountries = Object.keys(rules);

/** Returns an error sentence, or undefined when the format is right. */
export function validateTaxId(country: string, value: string): string | undefined {
  const rule = rules[country];
  if (!rule) return undefined;
  if (!value) return 'Enter your VAT number.';
  if (!rule.pattern.test(value)) return `This is not a ${rule.name} VAT number. Use ${rule.shape}, for example ${rule.example}.`;
  return undefined;
}

const clean = (s: string) => s.toUpperCase().replace(/[\s.\-]/g, '');

export interface TaxIdFieldProps extends Omit<React.ComponentProps<'div'>, 'onChange' | 'defaultValue'> {
  label?: string;
  defaultCountry?: string;
  defaultValue?: string;
  /** Runs on every change with the full number and whether its format is valid. */
  onValueChange?: (value: string, valid: boolean) => void;
  /** Countries offered, by code. Default all. */
  countries?: string[];
  disabled?: boolean;
  /** Show the error for an empty field too, after a failed save. */
  required?: boolean;
}

function TaxIdField({ label = 'VAT number', defaultCountry = 'DE', defaultValue = '', onValueChange, countries = taxIdCountries, disabled, required, className, ...props }: TaxIdFieldProps) {
  const [country, setCountry] = React.useState(defaultCountry);
  const [value, setValue] = React.useState(clean(defaultValue));
  const [touched, setTouched] = React.useState(false);
  const rule = rules[country];
  const raw = validateTaxId(country, value);
  const error = touched && (value || required) ? raw : undefined;
  const valid = touched && value !== '' && !raw;

  const update = (next: string, c = country) => {
    setValue(next);
    onValueChange?.(next, !validateTaxId(c, next));
  };

  return (
    <div data-slot="tax-id-field" data-state={error ? 'invalid' : valid ? 'valid' : 'idle'} className={cn('flex w-full max-w-lg min-w-0 flex-wrap items-start gap-x-3 gap-y-4', className)} {...props}>
      <Field label="Country" disabled={disabled} className="w-full sm:w-44 sm:shrink-0">
        <Select
          value={country}
          onValueChange={c => {
            const old = rules[country];
            const next = value.startsWith(old.example.slice(0, 2)) ? c + value.slice(2) : value;
            setCountry(c);
            update(next, c);
          }}
        >
          <SelectTrigger />
          <SelectContent>
            {countries.map(c => (
              <SelectItem key={c} value={c}>
                {rules[c].name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <Field
        label={label}
        disabled={disabled}
        required={required}
        error={error}
        hint={valid ? `The format is right for ${rule.name}. We check the number with the tax authority when you save.` : `${rule.shape}, for example ${rule.example}.`}
        className="min-w-40 flex-1"
      >
        <Input
          autoComplete="off"
          spellCheck={false}
          placeholder={rule.example}
          value={value}
          onChange={e => update(clean(e.target.value))}
          onBlur={() => setTouched(true)}
        />
      </Field>
    </div>
  );
}

export { TaxIdField };
