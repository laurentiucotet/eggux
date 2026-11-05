// EGG UI Model Picker and Model Option. Figma: Model Picker and Model Option (AI Chat / Model
// Picker / Component). Model Picker State (default, hover, focus) is CSS (hover, focus-visible);
// its Model text is the name of the selected option. The menu is a Radix DropdownMenu radio group:
// arrows move, Enter or Space selects, Escape closes and focus returns to the trigger. Model Option
// Selected follows the radio value (check + aria-checked), State=hover is the highlighted item.
import * as React from 'react';
import { DropdownMenu } from 'radix-ui';
import { Check, ChevronDown, Sparkles } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Badge } from './badge';

export interface ModelPickerOption {
  /** Figma Name. Also the value of the option. */
  name: string;
  /** Figma Description: the trade-off in one line (quality, speed, cost). */
  description?: string;
  /** Figma Show badge with its Label ("Best quality"). */
  badge?: string;
}

/** 2-4 models described by what they are good for, the default first. */
export const defaultModelOptions: ModelPickerOption[] = [
  { name: 'Acme Pro', description: 'Long reports, analysis and code. Slower.', badge: 'Best quality' },
  { name: 'Acme Fast', description: 'Quick answers and short drafts. Uses fewer credits.' },
  { name: 'Acme Private', description: 'Keeps data in the EU. Best for invoices and contracts.' },
];

export interface ModelOptionProps extends Omit<React.ComponentProps<typeof DropdownMenu.RadioItem>, 'value' | 'children'> {
  /** Figma Name. */
  name?: string;
  /** Radio value; defaults to the name. */
  value?: string;
  /** Figma Description. */
  description?: string;
  /** Figma Show badge. */
  showBadge?: boolean;
  /** Badge Label. */
  badge?: string;
}

/** One model in the Model Picker menu. Must be rendered inside a ModelPicker. */
function ModelOption({
  name = 'Acme Pro',
  value,
  description = 'Long reports, analysis and code. Slower.',
  showBadge = true,
  badge = 'Best quality',
  className,
  ...props
}: ModelOptionProps) {
  return (
    <DropdownMenu.RadioItem
      data-slot="model-option"
      value={value ?? name}
      className={cn(
        'group/option flex w-72 max-w-full cursor-default items-start gap-3 rounded-sm p-2 text-popover-foreground outline-none select-none transition-colors duration-[var(--duration-fast)]',
        'data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className,
      )}
      {...props}
    >
      <Sparkles className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="flex min-w-0 items-center gap-2">
          <span className="min-w-0 truncate text-sm font-medium">{name}</span>
          {showBadge && badge ? <Badge variant="secondary">{badge}</Badge> : null}
        </span>
        {description ? <span className="text-sm text-muted-foreground group-data-[highlighted]/option:text-[var(--input-filled-muted-foreground)]">{description}</span> : null}
      </span>
      {/* Selected=true: the check sits at the top right; aria-checked carries it for screen readers. */}
      <span className="flex size-4 shrink-0 items-center justify-center pt-0.5">
        <DropdownMenu.ItemIndicator>
          <Check className="size-4" aria-hidden="true" />
        </DropdownMenu.ItemIndicator>
      </span>
    </DropdownMenu.RadioItem>
  );
}

export interface ModelPickerProps extends Omit<React.ComponentProps<'button'>, 'value' | 'defaultValue'> {
  /** Figma Model: the selected model name (controlled). */
  model?: string;
  /** Initial model when uncontrolled. */
  defaultModel?: string;
  onModelChange?: (model: string) => void;
  /** The Model Options. Ignored when children (ModelOption elements) are given. */
  options?: ModelPickerOption[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Where the menu opens; "top" above a Prompt Input. */
  side?: 'top' | 'bottom';
  align?: 'start' | 'center' | 'end';
  /** Accessible name prefix: "Model: Acme Pro". */
  label?: string;
  children?: React.ReactNode;
}

function ModelPicker({
  model: modelProp,
  defaultModel = 'Acme Pro',
  onModelChange,
  options = defaultModelOptions,
  open,
  defaultOpen,
  onOpenChange,
  side = 'bottom',
  align = 'start',
  label = 'Model',
  className,
  children,
  ...props
}: ModelPickerProps) {
  const [inner, setInner] = React.useState(defaultModel);
  const model = modelProp ?? inner;
  const select = (next: string) => {
    if (modelProp === undefined) setInner(next);
    onModelChange?.(next);
  };

  return (
    <DropdownMenu.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange} modal={false}>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          data-slot="model-picker"
          aria-label={`${label}: ${model}`}
          className={cn(
            'inline-flex h-8 max-w-full shrink-0 items-center gap-1.5 rounded-md px-2 text-sm font-medium text-foreground outline-none transition-[background-color,box-shadow] duration-[var(--duration-fast)]',
            'hover:bg-accent hover:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
            'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            'disabled:pointer-events-none disabled:opacity-50',
            className,
          )}
          {...props}
        >
          <Sparkles className="size-3.5 shrink-0" aria-hidden="true" />
          <span className="min-w-0 truncate">{model}</span>
          <ChevronDown className="size-3.5 shrink-0" aria-hidden="true" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          data-slot="model-picker-menu"
          aria-label={`Choose a ${label.toLowerCase()}`}
          side={side}
          align={align}
          sideOffset={4}
          collisionPadding={8}
          className="z-50 max-w-[calc(100vw-16px)] overflow-hidden rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-md"
        >
          <DropdownMenu.RadioGroup value={model} onValueChange={select} className="flex flex-col gap-0.5">
            {children ??
              options.map(option => (
                <ModelOption key={option.name} name={option.name} description={option.description} badge={option.badge} showBadge={!!option.badge} />
              ))}
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

export { ModelPicker, ModelOption };
