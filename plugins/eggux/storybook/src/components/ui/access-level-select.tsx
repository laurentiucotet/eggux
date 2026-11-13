// EGG UI Access Level Select. Code only (no Figma component yet); family Access.
// A Select for how much someone can do with a shared thing: Viewer, Commenter, Editor, Owner. Every
// level has a one-line description under its name in the open list. A level can be disabled with a
// reason ("Only the current owner can transfer ownership"): it stays in the list, dimmed, and the
// reason replaces its description so people learn why. Built on Select (trigger, list, keyboard:
// arrows move, Enter picks, Escape closes, a letter jumps to its level). Show description adds the
// description of the chosen level under the trigger, tied to it with aria-describedby.
// A11y: the trigger is a combobox named by `label` (always give one: "Access for Maria Ilie"); the
// disabled reasons are part of each option's text, so they are read with the option.
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, type SelectSize, type SelectStyle } from './select';

export interface AccessLevel {
  value: string;
  label: string;
  description: string;
  disabled?: boolean;
  /** Why the level cannot be picked; shown instead of the description. */
  disabledReason?: string;
}

export const defaultAccessLevels: AccessLevel[] = [
  { value: 'viewer', label: 'Viewer', description: 'Can open and read, nothing else' },
  { value: 'commenter', label: 'Commenter', description: 'Can read and leave comments' },
  { value: 'editor', label: 'Editor', description: 'Can change content and share it' },
  { value: 'owner', label: 'Owner', description: 'Full control, including deleting' },
];

export interface AccessLevelSelectProps {
  /** Accessible name of the control ("Access for Maria Ilie"). */
  label: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  levels?: AccessLevel[];
  size?: SelectSize;
  selectStyle?: SelectStyle;
  disabled?: boolean;
  readOnly?: boolean;
  /** Width of the trigger in px; default 100 % of the parent. */
  width?: number;
  /** The description of the chosen level under the control. */
  showDescription?: boolean;
  className?: string;
}

function AccessLevelSelect({
  label,
  value: valueProp,
  defaultValue = 'viewer',
  onValueChange,
  levels = defaultAccessLevels,
  size = 'default',
  selectStyle = 'default',
  disabled,
  readOnly,
  width,
  showDescription = false,
  className,
}: AccessLevelSelectProps) {
  const [inner, setInner] = React.useState(defaultValue);
  const value = valueProp ?? inner;
  const descId = React.useId();
  const chosen = levels.find(l => l.value === value);
  return (
    <div data-slot="access-level-select" className={cn('flex min-w-0 max-w-full flex-col gap-1', className)} style={width ? { width } : undefined}>
      <Select
        value={value}
        onValueChange={v => {
          if (valueProp === undefined) setInner(v);
          onValueChange?.(v);
        }}
        size={size}
        selectStyle={selectStyle}
        disabled={disabled}
        readOnly={readOnly}
        aria-describedby={showDescription && chosen ? descId : undefined}
      >
        <SelectTrigger aria-label={label} />
        <SelectContent align="end" className="min-w-64">
          {levels.map(l => (
            <SelectItem key={l.value} value={l.value} disabled={l.disabled} description={l.disabled && l.disabledReason ? l.disabledReason : l.description}>
              {l.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {showDescription && chosen ? (
        <p id={descId} data-slot="access-level-description" className="text-xs leading-4 text-muted-foreground">{chosen.description}</p>
      ) : null}
    </div>
  );
}

export { AccessLevelSelect };
