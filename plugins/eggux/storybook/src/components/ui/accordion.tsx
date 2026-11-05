// EGG UI Accordion and Accordion Item. Figma: Accordion, Accordion Item (Accordion page).
// Accordion Style (default, card) and the item's Size (default, sm) and Icon (chevron, plus) are
// set once on the Accordion, since every item of one list must match. State comes from Radix.
// shadcn Accordion with the EGG changes from references/code-mapping.md (card style, plus icon).
import * as React from 'react';
import { Accordion as AccordionPrimitive } from 'radix-ui';
import { ChevronDown, Minus, Plus } from '@/components/icons';
import { cn } from '@/lib/utils';

type AccordionLook = {
  /** Figma Style: default (divider under each item) or card (separate bordered cards, gap 12). */
  accordionStyle: 'default' | 'card';
  /** Figma Size: default, or sm for side panels and filter groups. */
  size: 'default' | 'sm';
  /** Figma Icon: chevron (apps) or plus/minus (marketing FAQs). */
  icon: 'chevron' | 'plus';
};

const LookContext = React.createContext<AccordionLook>({ accordionStyle: 'default', size: 'default', icon: 'chevron' });

type AccordionRootProps = React.ComponentProps<typeof AccordionPrimitive.Root>;

export interface AccordionProps extends Partial<AccordionLook>, Omit<React.ComponentProps<'div'>, 'defaultValue' | 'dir'> {
  /** multiple (default): several items open at once. single: one at a time, for exclusive content. */
  type?: 'multiple' | 'single';
  /** Open item values: an array for multiple, a string for single. */
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  /** single only: the open item can be closed again. */
  collapsible?: boolean;
  disabled?: boolean;
  dir?: 'ltr' | 'rtl';
}

function Accordion({ accordionStyle = 'default', size = 'default', icon = 'chevron', type = 'multiple', className, ...props }: AccordionProps) {
  const look = React.useMemo(() => ({ accordionStyle, size, icon }), [accordionStyle, size, icon]);
  // Several items may be open at once unless the content is mutually exclusive (type="single").
  const rootProps = { type, ...props } as AccordionRootProps;
  return (
    <LookContext.Provider value={look}>
      <AccordionPrimitive.Root
        data-slot="accordion"
        data-style={accordionStyle}
        className={cn('flex w-full flex-col', accordionStyle === 'card' && 'gap-3', className)}
        {...rootProps}
      />
    </LookContext.Provider>
  );
}

export interface AccordionItemProps extends Omit<React.ComponentProps<typeof AccordionPrimitive.Item>, 'title'> {
  /** Figma Title: a question or a group name. */
  title: React.ReactNode;
  /** Figma Show leading icon + Leading icon: an icon from `@/components/icons`. */
  leadingIcon?: React.ReactNode;
  /** Figma Meta slot (Show meta): a Badge Count of active filters or a short summary. */
  meta?: React.ReactNode;
}

function AccordionItem({ title, leadingIcon, meta, className, children, ...props }: AccordionItemProps) {
  const { accordionStyle, size, icon } = React.useContext(LookContext);
  const card = accordionStyle === 'card';
  const sm = size === 'sm';
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn(
        card ? 'rounded-[var(--radius)] border border-border bg-background' : 'border-b border-border',
        card && (sm ? 'px-3' : 'px-4'),
        className,
      )}
      {...props}
    >
      <AccordionPrimitive.Header className="flex">
        <AccordionPrimitive.Trigger
          data-slot="accordion-trigger"
          className={cn(
            'group/trigger flex min-w-0 flex-1 items-center gap-2 rounded-md text-left text-sm font-medium text-foreground outline-none transition-[box-shadow] duration-[var(--duration-fast)] focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50',
            sm ? 'py-3' : 'py-4',
          )}
        >
          {leadingIcon ? <span aria-hidden="true" className="flex shrink-0 [&_svg:not([class*='size-'])]:size-4">{leadingIcon}</span> : null}
          <span className="min-w-0 flex-1">{title}</span>
          {meta ? <span data-slot="accordion-meta" className="flex shrink-0 items-center gap-2">{meta}</span> : null}
          {icon === 'plus' ? (
            <>
              <Plus aria-hidden="true" className="size-4 shrink-0 group-data-[state=open]/trigger:hidden" />
              <Minus aria-hidden="true" className="hidden size-4 shrink-0 group-data-[state=open]/trigger:block" />
            </>
          ) : (
            <ChevronDown aria-hidden="true" className="size-4 shrink-0 transition-transform duration-[var(--duration-fast)] group-data-[state=open]/trigger:rotate-180 motion-reduce:transition-none" />
          )}
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
      <AccordionPrimitive.Content data-slot="accordion-content" className="text-sm text-foreground">
        <div className={cn('flex flex-col gap-2', sm ? 'pb-3' : 'pb-4')}>{children}</div>
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  );
}

export { Accordion, AccordionItem };
