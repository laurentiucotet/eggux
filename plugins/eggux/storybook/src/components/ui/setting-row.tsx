// EGG UI Setting Row. Figma: Setting Row (Selection controls page, "Setting Row / Component").
// Title, Description (Show description), Control slot (Switch, Select or Button), Divider (Show divider).
// Custom row: text column fills, 24 px gap, control on the right and vertically centered, 16 px top and
// bottom, Separator under the row (off on the last row). The whole row is not a click target, only the control.
// Accessibility: the control gets aria-describedby = Description; a control with no name of its own
// (a Switch without label or aria-label) also gets aria-labelledby = Title. A Button keeps its own text
// ("Change") as its name and is only described.
import * as React from 'react';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

export interface SettingRowProps extends Omit<React.ComponentProps<'div'>, 'title'> {
  /** Figma Title (ui/label): names the setting. */
  title: React.ReactNode;
  /** Figma Description (Show description): says what changes; a disabled row says why here. */
  description?: React.ReactNode;
  /** Figma Show divider: off on the last row of a section. */
  showDivider?: boolean;
  /** Figma Control slot: a Switch (no label), a Select (200 wide) or a Button. */
  children?: React.ReactNode;
}

type ControlProps = { 'aria-label'?: string; 'aria-labelledby'?: string; 'aria-describedby'?: string; label?: React.ReactNode; children?: React.ReactNode };

function SettingRow({ title, description, showDivider = true, className, children, id: idProp, ...props }: SettingRowProps) {
  const autoId = React.useId();
  const id = idProp ?? autoId;
  const titleId = `${id}-title`;
  const descId = `${id}-description`;

  const control = React.Children.map(children, child => {
    if (!React.isValidElement<ControlProps>(child)) return child;
    const p = child.props;
    const named = Boolean(p['aria-label'] || p['aria-labelledby'] || p.label || p.children);
    const describedBy = [p['aria-describedby'], description ? descId : null].filter(Boolean).join(' ') || undefined;
    return React.cloneElement(child, {
      'aria-describedby': describedBy,
      ...(named ? {} : { 'aria-labelledby': titleId }),
    });
  });

  return (
    <div data-slot="setting-row" id={idProp} className={cn('flex w-full min-w-0 flex-col', className)} {...props}>
      <div className="flex w-full min-w-0 items-center gap-6 py-4">
        <div className="flex min-w-0 flex-1 flex-col gap-1 text-sm leading-5">
          <p id={titleId} data-slot="setting-row-title" className="break-words font-medium text-foreground">{title}</p>
          {description ? (
            <p id={descId} data-slot="setting-row-description" className="break-words text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {control != null && React.Children.count(control) > 0 ? (
          <div data-slot="setting-row-control" className="flex shrink-0 items-center gap-2">{control}</div>
        ) : null}
      </div>
      {showDivider ? <Separator /> : null}
    </div>
  );
}

export { SettingRow };
