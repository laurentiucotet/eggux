// EGG UI Language Switcher. Code only (no Figma component yet). A select-like control for the language
// of the interface or of a document: a button showing the current language in its own name ("Deutsch")
// that opens a popover list. Every option shows the native name first, with the English name muted
// next to it, so people find their language even when the page is in the wrong one; the current one
// has a check. No flags: a flag is a country, not a language. The list is a Command (a search field
// over a listbox: type to filter by either name, arrows move, Enter picks, Escape closes and focus
// returns to the button). `compact` shows only the globe and the short code ("EN") for headers and
// footers; its accessible name still says "Language: English". Each native name carries `lang`, so
// screen readers pronounce it correctly. Works in a Field: id, aria-describedby, aria-invalid,
// disabled.
import * as React from 'react';
import { ChevronDown, Globe, Languages } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from './command';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

export interface LanguageOption {
  /** BCP 47 code: "en", "de", "pt-BR". Also the value. */
  code: string;
  /** The language's name in itself: "Deutsch", "Español". */
  name: string;
  /** The English name, shown muted and searched: "German". */
  englishName?: string;
  /** Short label for the compact trigger; default the code in capitals ("EN"). */
  short?: string;
}

export interface LanguageSwitcherProps extends Omit<React.ComponentProps<'button'>, 'value' | 'defaultValue' | 'onChange' | 'type'> {
  languages: LanguageOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (code: string) => void;
  /** Compact: the globe and the short code only. */
  compact?: boolean;
  /** Name of the control ("Language"); the trigger reads "Language: English". */
  label?: string;
  /** Text of the search field. */
  searchPlaceholder?: string;
  emptyText?: string;
  invalid?: boolean;
}

function LanguageSwitcher({
  languages,
  value: valueProp,
  defaultValue,
  onValueChange,
  compact = false,
  label = 'Language',
  searchPlaceholder = 'Search languages…',
  emptyText = 'No language found.',
  invalid,
  disabled,
  className,
  'aria-invalid': ariaInvalid,
  ...props
}: LanguageSwitcherProps) {
  const [open, setOpen] = React.useState(false);
  const [inner, setInner] = React.useState(defaultValue ?? languages[0]?.code ?? '');
  const value = valueProp ?? inner;
  const current = languages.find(l => l.code === value);
  const currentShort = current ? (current.short ?? current.code.split('-')[0]!.toUpperCase()) : '';
  const spoken = current ? (compact ? (current.englishName ?? current.name) : current.name) : 'none';

  const pick = (code: string) => {
    if (valueProp === undefined) setInner(code);
    onValueChange?.(code);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant={compact ? 'ghost' : 'outline'}
          size={compact ? 'sm' : 'default'}
          data-slot="language-switcher"
          data-compact={compact ? '' : undefined}
          disabled={disabled}
          aria-invalid={invalid || ariaInvalid || undefined}
          className={cn('min-w-0 justify-between', compact ? 'gap-1.5 px-2' : 'w-full max-w-xs justify-between gap-2 font-normal aria-invalid:border-destructive', className)}
          {...props}
        >
          {compact ? <Globe aria-hidden="true" /> : <Languages aria-hidden="true" className="text-muted-foreground" />}
          <span className="sr-only">{compact ? `${label}: ${spoken}, ` : `${label}: `}</span>
          <span data-slot="language-switcher-value" lang={compact ? undefined : current?.code} className={cn('min-w-0 truncate', compact ? 'font-medium' : 'flex-1 text-left')}>
            {compact ? currentShort : (current?.name ?? 'Choose a language')}
          </span>
          {compact ? null : <ChevronDown aria-hidden="true" className="text-muted-foreground" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        aria-label={label}
        align={compact ? 'end' : 'start'}
        className="w-64 max-w-[calc(100vw-1rem)] overflow-hidden p-0"
        onOpenAutoFocus={e => {
          e.preventDefault();
          (e.currentTarget as HTMLElement).querySelector<HTMLInputElement>('[role="combobox"]')?.focus({ preventScroll: true });
        }}
      >
        <Command label={label}>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            {languages.map(l => (
              <CommandItem key={l.code} value={l.code} keywords={[l.name, l.englishName ?? '']} checked={l.code === value} onSelect={pick}>
                <span lang={l.code}>{l.name}</span>
                {l.englishName && l.englishName !== l.name ? <>{' '}<span className="ml-1 text-muted-foreground">{l.englishName}</span></> : null}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export { LanguageSwitcher };
