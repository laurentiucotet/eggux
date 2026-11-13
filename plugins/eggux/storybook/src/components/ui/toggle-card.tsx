// EGG UI Toggle Card. Code only (no Figma component yet). A setting as a card: an icon, a title and a
// description, with a switch at the end, where the WHOLE card is the hit area ("Email alerts",
// "Two-step sign in"). It is one Switch (role="switch", Space toggles) inside a label for the card,
// so a click anywhere flips it. The switch is named by the title and described by the description
// (not named by both, which would read the whole paragraph). On: the border takes the primary color,
// so the state is in the track, the border and aria-checked, not in color alone. Off and disabled
// keep the text colors readable (disabled fades the card, the description keeps its muted color).
// For a list of settings stack cards 12 px apart; for one choice among several use Option Card.
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Switch } from './switch';

export interface ToggleCardProps extends Omit<React.ComponentProps<'label'>, 'onChange' | 'title' | 'defaultValue'> {
  /** The setting's name, not the action: "Email alerts". */
  title: string;
  /** What it does when on. */
  description?: React.ReactNode;
  /** An icon from `@/components/icons`, shown in a 40 px tile. */
  icon?: React.ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  value?: string;
  /** Id of the switch (a Field's label points at it). */
  id?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: React.AriaAttributes['aria-invalid'];
}

function ToggleCard({
  title,
  description,
  icon,
  checked,
  defaultChecked,
  onCheckedChange,
  disabled = false,
  required,
  name,
  value,
  id: idProp,
  'aria-describedby': describedByProp,
  'aria-invalid': ariaInvalid,
  className,
  ...props
}: ToggleCardProps) {
  const autoId = React.useId();
  const id = idProp ?? autoId;
  const titleId = `${id}-title`;
  const descId = `${id}-description`;
  const describedBy = [description ? descId : null, describedByProp].filter(Boolean).join(' ') || undefined;

  return (
    <label
      htmlFor={id}
      data-slot="toggle-card"
      data-disabled={disabled ? '' : undefined}
      className={cn(
        'flex w-full min-w-0 items-start gap-3 rounded-lg border border-border bg-card p-4 text-card-foreground transition-[border-color,box-shadow] duration-[var(--duration-fast)] motion-reduce:transition-none',
        'has-[[role=switch][data-state=checked]]:border-primary has-[[role=switch]:focus-visible]:shadow-[0_0_0_2px_var(--background),0_0_0_4px_var(--ring)]',
        'has-[[role=switch][aria-invalid=true]]:border-destructive',
        disabled ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-accent/40',
        className,
      )}
      {...props}
    >
      {icon ? (
        <span aria-hidden="true" className={cn('flex size-10 shrink-0 items-center justify-center rounded-md bg-muted text-foreground [&_svg]:size-5', disabled && 'opacity-50')}>
          {icon}
        </span>
      ) : null}
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span id={titleId} className={cn('break-words text-sm leading-5 font-medium text-foreground', disabled && 'opacity-50')}>
          {title}
        </span>
        {description ? (
          <span id={descId} className="break-words text-sm leading-5 text-muted-foreground">
            {description}
          </span>
        ) : null}
      </span>
      <Switch
        id={id}
        name={name}
        value={value}
        checked={checked}
        defaultChecked={defaultChecked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        required={required}
        aria-labelledby={titleId}
        aria-describedby={describedBy}
        aria-invalid={ariaInvalid}
        className={cn('mt-0.5', disabled && 'opacity-50')}
      />
    </label>
  );
}

export { ToggleCard };
