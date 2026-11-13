// EGG UI Location Picker. Code only (no Figma component yet). A Field-like control for choosing a
// place: a label, a button that looks like an input and opens a Popover with a search box, the
// matching places and a "Use my location" button; the chosen place is shown as a Chip with a
// remove button under the control. The trigger is a button with aria-haspopup="dialog"; the list is
// a Command (combobox with arrow keys and Enter), Escape closes and focus returns to the trigger.
// "Use my location" calls `onLocate` (browser geolocation plus a reverse lookup in the real app),
// shows a loading state and a message when it returns nothing or fails. The component never reads
// the position itself. Built on Popover, Command, Chip and Button.
import * as React from 'react';
import { ChevronsUpDown, MapPin, Send } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Chip } from './chip';
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from './command';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

export interface LocationPlace {
  id: string;
  /** "Springfield Central". */
  name: string;
  /** "Springfield, 10115". */
  detail?: string;
}

export interface LocationPickerProps extends Omit<React.ComponentProps<'div'>, 'defaultValue' | 'onChange'> {
  label?: string;
  /** The places the search can find. */
  places: LocationPlace[];
  /** Controlled place (null = none). */
  value?: LocationPlace | null;
  defaultValue?: LocationPlace | null;
  onValueChange?: (place: LocationPlace | null) => void;
  /** Shown on the trigger while nothing is chosen. */
  placeholder?: string;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  disabled?: boolean;
  /** Adds the "Use my location" button; returns the place found, or null. */
  onLocate?: () => Promise<LocationPlace | null> | LocationPlace | null;
  locateLabel?: string;
  /** Id of the trigger; generated when not given. */
  id?: string;
}

function LocationPicker({
  label = 'Delivery location',
  places,
  value: valueProp,
  defaultValue = null,
  onValueChange,
  placeholder = 'Search for a place',
  hint,
  error,
  disabled = false,
  onLocate,
  locateLabel = 'Use my location',
  id: idProp,
  className,
  ...props
}: LocationPickerProps) {
  const autoId = React.useId();
  const id = idProp ?? autoId;
  const [inner, setInner] = React.useState<LocationPlace | null>(defaultValue);
  const value = valueProp === undefined ? inner : valueProp;
  const [open, setOpen] = React.useState(false);
  const [locating, setLocating] = React.useState(false);
  const [locateError, setLocateError] = React.useState<string | null>(null);

  const choose = (place: LocationPlace | null) => {
    if (valueProp === undefined) setInner(place);
    onValueChange?.(place);
  };
  const locate = async () => {
    if (!onLocate) return;
    setLocating(true);
    setLocateError(null);
    try {
      const place = await onLocate();
      if (place) {
        choose(place);
        setOpen(false);
      } else {
        setLocateError('We could not find your location. Search for a place instead.');
      }
    } catch {
      setLocateError('We could not find your location. Search for a place instead.');
    } finally {
      setLocating(false);
    }
  };

  const messageId = `${id}-message`;
  const message = error ? (
    <p id={messageId} data-slot="location-picker-error" className="m-0 text-xs text-destructive">{error}</p>
  ) : hint ? (
    <p id={messageId} data-slot="location-picker-hint" className="m-0 text-xs text-muted-foreground">{hint}</p>
  ) : null;

  return (
    <div data-slot="location-picker" className={cn('flex w-full min-w-0 flex-col gap-2', className)} {...props}>
      <label id={`${id}-label`} htmlFor={id} className={cn('text-sm font-medium', error ? 'text-destructive' : disabled ? 'text-muted-foreground' : 'text-foreground')}>
        {label}
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            id={id}
            disabled={disabled}
            aria-labelledby={`${id}-label ${id}-action`}
            aria-describedby={message ? messageId : undefined}
            aria-invalid={error ? true : undefined}
            className="flex h-[var(--control-height)] w-full min-w-0 cursor-pointer items-center gap-2 rounded-input border border-input bg-background px-3 text-left text-sm text-muted-foreground shadow-xs outline-none transition-[color,box-shadow,border-color] duration-[var(--duration-fast)] hover:bg-accent focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive"
          >
            <MapPin aria-hidden="true" className="size-4 shrink-0" />
            <span id={`${id}-action`} className="min-w-0 flex-1 truncate">{value ? 'Change place' : placeholder}</span>
            <ChevronsUpDown aria-hidden="true" className="size-4 shrink-0" />
          </button>
        </PopoverTrigger>
        <PopoverContent aria-label="Choose a place" className="w-[var(--radix-popover-trigger-width)] min-w-64 p-0">
          <Command label="Places">
            <CommandInput placeholder="Search by street or city" />
            <CommandList>
              <CommandEmpty>No places match. Try a street or a city.</CommandEmpty>
              {places.map(place => (
                <CommandItem
                  key={place.id}
                  value={`${place.name} ${place.detail ?? ''}`.trim()}
                  icon={<MapPin aria-hidden="true" />}
                  checked={value?.id === place.id}
                  onSelect={() => {
                    choose(place);
                    setOpen(false);
                  }}
                >
                  <span className="block min-w-0 truncate">{place.name}</span>
                  {place.detail ? <span className="block min-w-0 truncate text-xs text-muted-foreground">{place.detail}</span> : null}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
          {onLocate ? (
            <div className="flex flex-col gap-1 border-t border-border p-1">
              <Button type="button" variant="ghost" size="sm" className="w-full justify-start" loading={locating} leadingIcon={<Send aria-hidden="true" />} onClick={locate}>
                {locateLabel}
              </Button>
              {locateError ? <p role="alert" className="m-0 px-2 pb-1 text-xs text-destructive">{locateError}</p> : null}
            </div>
          ) : null}
        </PopoverContent>
      </Popover>
      {message}
      {value ? (
        <div data-slot="location-picker-value" className="flex min-w-0">
          <Chip label={value.name} showLeadingIcon icon={<MapPin aria-hidden="true" />} showRemove removeLabel={`Remove ${value.name}`} onRemove={() => choose(null)} />
        </div>
      ) : null}
    </div>
  );
}

export { LocationPicker };
