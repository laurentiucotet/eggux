// EGG UI Option Card. Figma: Option Card (Card page, "Option Card / Component"). State (default,
// hover, focus, selected, disabled) x Control (radio, checkbox) x Layout (default, media, compact).
// A selectable card: the whole card is the click target (a <label> around the control). Hover,
// focus (the real focus-visible ring), selected (2 px primary border + checked control) and disabled
// come from the control's state. Control=radio goes inside a RadioGroup (`OptionCardGroup`, a
// radiogroup you label with `aria-label`); Control=checkbox takes `checked` / `onCheckedChange`
// and several cards go in a <fieldset>. Built on Radio and Checkbox.
import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Checkbox } from './checkbox';
import { RadioGroup, RadioGroupItem } from './radio';

export type OptionCardLayout = 'default' | 'media' | 'compact';

const optionCardVariants = cva(
  [
    'relative flex min-w-0 cursor-pointer rounded-lg border border-border bg-card text-card-foreground shadow-xs',
    'transition-[background-color,border-color,box-shadow] duration-[var(--duration-fast)]',
    'hover:bg-accent',
    'has-[[data-state=checked]]:border-2 has-[[data-state=checked]]:border-primary',
    'has-[:focus-visible]:shadow-[0_0_0_2px_var(--background),0_0_0_4px_var(--ring)]',
    'has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50 has-[:disabled]:hover:bg-card',
  ],
  {
    variants: {
      layout: {
        default: 'w-96 max-w-full items-start gap-3 p-[var(--card-padding-sm)]',
        media: 'w-70 max-w-full flex-col items-start gap-3 p-[var(--card-padding-sm)]',
        compact: 'w-96 max-w-full items-center gap-3 p-3',
      },
    },
    defaultVariants: { layout: 'default' },
  },
);

export interface OptionCardProps extends Omit<React.ComponentProps<'label'>, 'title' | 'onChange'> {
  /** Figma Control: radio (one choice) or checkbox (several). */
  control?: 'radio' | 'checkbox';
  /** Figma Layout: default (icon, text, control), media (280 wide, a 16:9 preview on top), compact (12 padding, 32 tile). */
  layout?: OptionCardLayout;
  /** Figma Title. */
  title: React.ReactNode;
  /** Figma Description (Show description). */
  description?: React.ReactNode;
  /** Figma Icon (Show icon): an icon from `@/components/icons`. Not in the media layout. */
  icon?: React.ReactNode;
  /** Figma Media: the exposed Image Placeholder of Layout=media. */
  media?: React.ReactNode;
  /** Control=radio: the value inside the RadioGroup. */
  value?: string;
  /** Control=checkbox: controlled state. */
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  /** Figma State=disabled: blocks the control and fades the card. */
  disabled?: boolean;
}

function OptionCard({
  control = 'radio',
  layout = 'default',
  title,
  description,
  icon,
  media,
  value,
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  className,
  ...props
}: OptionCardProps) {
  const id = React.useId();
  const titleId = `${id}-title`;
  const descId = `${id}-description`;
  const compact = layout === 'compact';
  const controlProps = {
    'aria-labelledby': titleId,
    'aria-describedby': description ? descId : undefined,
    disabled,
    className: 'shrink-0',
  };
  const controlEl =
    control === 'radio' ? (
      <RadioGroupItem value={value ?? ''} {...controlProps} />
    ) : (
      <Checkbox checked={checked} defaultChecked={defaultChecked} onCheckedChange={v => onCheckedChange?.(v === true)} {...controlProps} />
    );
  const text = (
    <div data-slot="option-card-text" className={cn('flex min-w-0 flex-1 flex-col text-sm', compact ? 'gap-0.5' : 'gap-1.5')}>
      <span id={titleId} className="font-medium">{title}</span>
      {description ? (
        <span id={descId} className={cn('text-muted-foreground', compact && 'truncate')}>{description}</span>
      ) : null}
    </div>
  );
  return (
    <label data-slot="option-card" data-layout={layout} data-control={control} className={cn(optionCardVariants({ layout }), className)} {...props}>
      {layout === 'media' ? (
        <>
          {media ? <div data-slot="option-card-media" className="w-full overflow-clip rounded-md">{media}</div> : null}
          <div className="flex w-full min-w-0 items-start gap-3">
            {text}
            {controlEl}
          </div>
        </>
      ) : (
        <>
          {icon ? (
            <span
              aria-hidden="true"
              data-slot="option-card-icon"
              className={cn('flex shrink-0 items-center justify-center rounded-md bg-muted', compact ? 'size-8 [&_svg]:size-4' : 'size-10 [&_svg]:size-5')}
            >
              {icon}
            </span>
          ) : null}
          {text}
          {controlEl}
        </>
      )}
    </label>
  );
}

/** A radiogroup of Option Cards: arrow keys move between options. Give it an `aria-label`. */
function OptionCardGroup({ className, ...props }: React.ComponentProps<typeof RadioGroup>) {
  return <RadioGroup data-slot="option-card-group" className={cn('gap-3', className)} {...props} />;
}

export { OptionCard, OptionCardGroup };
