// EGG UI Chip Group. Figma: Chip Group (Chip page, "Chip Group / Component"). Layout (wrap,
// scroll), Chips slot, Show more + exposed more Chip ("+3 more"). Chips of one Size that wrap (8 px
// gaps, +N stays at the end of the first row) or scroll sideways on one line (cut at the edge so
// people see there is more). Selection: type="single" is a radiogroup (arrow keys move and select,
// one Tab stop), type="multiple" a group of toggle buttons (aria-pressed), type="none" leaves the
// chips alone. Fills its container, min width 160.
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Chip, ChipGroupContext, type ChipProps, type ChipSize } from './chip';

export type ChipGroupLayout = 'wrap' | 'scroll';

export interface ChipGroupProps extends Omit<React.ComponentProps<'div'>, 'defaultValue' | 'onChange'> {
  /** Selection: single (radiogroup), multiple (toggle buttons) or none (chips handle themselves). */
  type?: 'single' | 'multiple' | 'none';
  /** Selected value(s), controlled. */
  value?: string | string[];
  /** Selected value(s), uncontrolled. */
  defaultValue?: string | string[];
  /** The selected values after a change (one value for type="single"). */
  onValueChange?: (value: string[]) => void;
  /** Figma Layout. */
  layout?: ChipGroupLayout;
  /** One Size for every chip in the group. */
  size?: ChipSize;
  /** Figma Chips slot: Chip elements with a `value`. */
  children?: React.ReactNode;
  /** Name of the group ("Industries"); the label above says single or multi select. */
  'aria-label'?: string;
  /** Figma Show more: the "+N more" chip at the end. */
  showMore?: boolean;
  /** Text of the more chip. */
  moreLabel?: string;
  /** Accessible name of the more chip: what it opens ("Show 3 more industries"). */
  moreAccessibleLabel?: string;
  onMoreClick?: ChipProps['onClick'];
}

const toArray = (v: string | string[] | undefined) => (v === undefined ? undefined : Array.isArray(v) ? v : v ? [v] : []);

function ChipGroup(props: ChipGroupProps) {
  const {
    type = 'none',
    value,
    defaultValue,
    onValueChange,
    layout = 'wrap',
    size = 'default',
    children,
    showMore = false,
    moreLabel = '+3 more',
    moreAccessibleLabel,
    onMoreClick,
    className,
    'aria-label': ariaLabel,
    ...rest
  } = props;
  const [inner, setInner] = React.useState<string[]>(toArray(defaultValue) ?? []);
  const selected = toArray(value) ?? inner;
  const groupRef = React.useRef<HTMLDivElement>(null);

  const toggle = React.useCallback(
    (v: string) => {
      const next = type === 'single' ? [v] : selected.includes(v) ? selected.filter(x => x !== v) : [...selected, v];
      if (value === undefined) setInner(next);
      onValueChange?.(next);
    },
    [type, selected, value, onValueChange],
  );
  const ctx = React.useMemo(() => ({ type, value: selected, toggle, size }), [type, selected, toggle, size]);

  // Radiogroup: one Tab stop, on the checked radio or the first enabled one.
  React.useLayoutEffect(() => {
    if (type !== 'single' || !groupRef.current) return;
    const radios = [...groupRef.current.querySelectorAll<HTMLButtonElement>('[role="radio"]')];
    const current = radios.find(r => r.getAttribute('aria-checked') === 'true' && !r.disabled) ?? radios.find(r => !r.disabled);
    for (const r of radios) r.tabIndex = r === current ? 0 : -1;
  });

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (type !== 'single') return;
    const keys: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    if (!(e.key in keys) && e.key !== 'Home' && e.key !== 'End') return;
    const radios = [...groupRef.current!.querySelectorAll<HTMLButtonElement>('[role="radio"]:not(:disabled)')];
    const i = radios.indexOf(document.activeElement as HTMLButtonElement);
    if (i < 0) return;
    e.preventDefault();
    const n = radios.length;
    const target = e.key === 'Home' ? radios[0] : e.key === 'End' ? radios[n - 1] : radios[(i + keys[e.key]! + n) % n];
    target!.focus();
    target!.scrollIntoView?.({ block: 'nearest', inline: 'nearest' });
    target!.click();
  };

  const role = type === 'single' ? 'radiogroup' : 'group';

  return (
    <div data-slot="chip-group" data-layout={layout} className={cn('flex w-full min-w-40 items-start gap-2', className)} {...rest}>
      <ChipGroupContext.Provider value={ctx}>
        <div
          ref={groupRef}
          role={role}
          aria-label={ariaLabel}
          data-slot="chip-group-chips"
          onKeyDown={onKeyDown}
          className={cn(
            'min-w-0 flex-1',
            layout === 'wrap'
              ? 'flex flex-wrap gap-2'
              : 'flex gap-2 overflow-x-auto [&>*]:shrink-0 overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
          )}
        >
          {children}
        </div>
      </ChipGroupContext.Provider>
      {showMore ? (
        <Chip
          size={size}
          label={moreLabel}
          aria-label={moreAccessibleLabel}
          onClick={onMoreClick ?? (() => {})}
          className="shrink-0" data-more=""
        />
      ) : null}
    </div>
  );
}

export { ChipGroup };
