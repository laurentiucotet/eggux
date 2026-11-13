// EGG UI Conditional Field Group. Code only (no Figma component yet); family Wizard.
// A question (a Switch, or a Yes / No radio pair) that reveals a group of follow-up fields when it is on.
// The fields stay mounted when the answer goes back to off, only hidden, so what was typed comes back when
// it is turned on again. Hidden fields are display:none and inert: out of the tab order and the
// accessibility tree, and the submitted form still holds their values unless the app drops them.
// A11y: the Switch / radio group has the label and description; the trigger points at the revealed
// region with aria-controls (Switch); a polite live region says "Billing address fields shown" or
// "hidden" after a change (not on first render); the revealed group is role="group" with a name; focus
// stays on the trigger, it is never moved. The reveal has no motion.
import * as React from 'react';
import { cn } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from './radio';
import { Switch } from './switch';

export interface ConditionalFieldGroupProps extends Omit<React.ComponentProps<'div'>, 'children' | 'onChange'> {
  /** The question or setting: "Billing address is different". */
  label: string;
  description?: string;
  /** Switch (one setting) or radio (a Yes / No question). */
  trigger?: 'switch' | 'radio';
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  /** Name of the revealed group, used in the announcement ("Billing address fields shown"). Default: label. */
  fieldsLabel?: string;
  /** Radio labels. */
  yesLabel?: string;
  noLabel?: string;
  /** The follow-up fields, always mounted. */
  children: React.ReactNode;
}

function ConditionalFieldGroup({
  label,
  description,
  trigger = 'switch',
  checked: checkedProp,
  defaultChecked = false,
  onCheckedChange,
  disabled,
  fieldsLabel,
  yesLabel = 'Yes',
  noLabel = 'No',
  className,
  children,
  ...props
}: ConditionalFieldGroupProps) {
  const [inner, setInner] = React.useState(defaultChecked);
  const checked = checkedProp ?? inner;
  const [message, setMessage] = React.useState('');
  const baseId = React.useId();
  const regionId = `${baseId}-fields`;
  const labelId = `${baseId}-label`;
  const name = fieldsLabel ?? label;
  const change = (next: boolean) => {
    if (checkedProp === undefined) setInner(next);
    setMessage(`${name} fields ${next ? 'shown' : 'hidden'}`);
    onCheckedChange?.(next);
  };
  return (
    <div data-slot="conditional-field-group" data-open={checked || undefined} className={cn('flex w-full min-w-0 flex-col gap-3', className)} {...props}>
      {trigger === 'switch' ? (
        <Switch label={label} description={description} checked={checked} disabled={disabled} onCheckedChange={change} aria-controls={regionId} />
      ) : (
        <div role="group" aria-labelledby={labelId} className="flex min-w-0 flex-col gap-2">
          <div className="flex min-w-0 flex-col">
            <span id={labelId} className="text-sm font-medium leading-5 text-foreground [overflow-wrap:anywhere]">{label}</span>
            {description ? <span className="text-sm leading-5 text-muted-foreground">{description}</span> : null}
          </div>
          <RadioGroup value={checked ? 'yes' : 'no'} onValueChange={v => change(v === 'yes')} disabled={disabled} aria-labelledby={labelId} orientation="horizontal" className="flex flex-wrap gap-x-6 gap-y-2">
            <RadioGroupItem value="yes" label={yesLabel} />
            <RadioGroupItem value="no" label={noLabel} />
          </RadioGroup>
        </div>
      )}
      <div
        id={regionId}
        role="group"
        aria-label={name}
        hidden={!checked}
        // inert is a boolean attribute in React 19.
        inert={!checked}
        data-slot="conditional-field-group-fields"
        className="flex min-w-0 flex-col gap-4 border-l-2 border-border pl-4"
      >
        {children}
      </div>
      <span role="status" aria-live="polite" className="sr-only">{message}</span>
    </div>
  );
}

export { ConditionalFieldGroup };
