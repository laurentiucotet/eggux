// EGG UI Person Option. Figma: Person Option (Select page, "People Picker / Component", set
// 270:962). Selected (false, true) x State (default, hover); Name, Description (Show description).
// One person in a People Picker list: checkbox (multi-select), Avatar 32 (initials or photo), name in
// ui/label and a muted body/small detail (role and email, so two people with the same name differ).
// 288 × 54: 6 / 8 px padding, 12 gap, 2 px between the lines, radius sm; hover / highlighted =
// background/accent. role="option" with aria-selected (the selected state is exposed, not only the
// checkbox color); the checkbox is a picture of the state (aria-hidden), since an option cannot hold
// a control. Inside a Listbox (select-option.tsx) the list drives the highlight, the click and Enter.
import * as React from 'react';
import { Check } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Avatar, type AvatarProps } from './avatar';
import { ListboxContext } from './select-option';

export interface PersonOptionProps extends Omit<React.ComponentProps<'div'>, 'title'> {
  /** The option value (person id). */
  value: string;
  /** Figma Name. */
  name?: string;
  /** Figma Description (Show description): role and email, "Finance manager · ana.popescu@acme.com". */
  description?: string;
  /** Figma Selected: the checkbox is checked and aria-selected is true. */
  selected?: boolean;
  /** Show the checkbox (multi-select lists). Off for a single person (owner, assignee). Default true. */
  showCheckbox?: boolean;
  /** Figma State=hover, for a static option outside a Listbox. Inside one the list decides. */
  highlighted?: boolean;
  disabled?: boolean;
  /** The Avatar (size default, 32). Default: initials from the name. */
  avatar?: Omit<AvatarProps, 'size'>;
}

const initialsOf = (name: string) =>
  name
    .split(/[\s-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(p => p[0]!.toLocaleUpperCase())
    .join('');

/** Figma Person Option: checkbox, avatar, name and detail. Name and detail are read together. */
function PersonOption({
  value,
  name = 'Ana Popescu',
  description,
  selected = false,
  showCheckbox = true,
  highlighted,
  disabled,
  avatar,
  className,
  ...props
}: PersonOptionProps) {
  const ctx = React.useContext(ListboxContext);
  const inList = !!ctx;
  const isHighlighted = highlighted ?? (inList ? ctx.activeValue === value : false);
  const handlers = inList
    ? {
        // Keep focus in the search input that drives the list.
        onMouseDown: (e: React.MouseEvent) => e.preventDefault(),
        onMouseMove: () => { if (!disabled && ctx.activeValue !== value) ctx.setActiveValue(value); },
        onClick: () => { if (!disabled) ctx.select(value); },
      }
    : {};
  return (
    <div
      id={inList ? ctx.optionId(value) : undefined}
      role="option"
      aria-selected={selected}
      aria-disabled={disabled || undefined}
      data-slot="person-option"
      data-value={value}
      data-highlighted={isHighlighted || undefined}
      className={cn(
        'group/person relative flex w-full min-w-0 cursor-default select-none items-center gap-3 rounded-sm px-2 py-1.5 text-left text-popover-foreground outline-none',
        'hover:bg-accent data-[highlighted]:bg-accent aria-disabled:pointer-events-none aria-disabled:opacity-50',
        className,
      )}
      {...handlers}
      {...props}
    >
      {showCheckbox ? (
        <span
          aria-hidden="true"
          data-slot="person-option-checkbox"
          data-state={selected ? 'checked' : 'unchecked'}
          className={cn(
            'flex size-4 shrink-0 items-center justify-center rounded-sm border border-input bg-background text-primary-foreground shadow-xs',
            selected && 'border-primary bg-primary',
          )}
        >
          {selected ? <Check className="size-3.5" /> : null}
        </span>
      ) : null}
      <Avatar initials={initialsOf(name)} {...avatar} size="default" aria-hidden="true" className={cn('shrink-0', avatar?.className)} />
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span data-slot="person-option-name" title={name} className="truncate text-sm leading-5 font-medium text-foreground">{name}</span>
        {description ? (
          <span data-slot="person-option-description" title={description} className="truncate text-sm leading-5 text-muted-foreground">{description}</span>
        ) : null}
      </span>
      {/* Single pick: no checkbox, so the selected person gets the list check at the end. */}
      {!showCheckbox && selected ? <Check aria-hidden="true" className="size-4 shrink-0" /> : null}
    </div>
  );
}

export { PersonOption, initialsOf };
