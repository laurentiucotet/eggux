// EGG UI Feature Item. Figma: Feature Item (Feature Item page, "Feature Item / Component", 405:884).
// Layout (stacked, inline, centered, card), Marker (icon, number), Show description, Show link.
// One benefit, capability or step: an Icon Tile (40, neutral by default) or a step number (40
// circle, primary), a title (body/large 18/28 semibold, a heading one level below the section),
// one or two lines of body/small muted, an optional link Button. Stacked: 12 gap; inline: marker
// left, 16 gap; centered: centered text; card: bg-card, border, radius xl, 24 padding, 16 gap.
// Text block gap 4. Same Layout and tile Style across a grid; cards in a row share height.
import * as React from 'react';
import { Sparkles } from '@/components/icons';
import { cn } from '@/lib/utils';
import { IconTile, type IconTileProps } from './icon-tile';

export type FeatureItemLayout = 'stacked' | 'inline' | 'centered' | 'card';

export interface FeatureItemProps extends Omit<React.ComponentProps<'div'>, 'title'> {
  title: string;
  description?: React.ReactNode;
  layout?: FeatureItemLayout;
  /** Figma Marker=icon: the tile icon. Ignored when `number` is set. */
  icon?: React.ReactNode;
  tileStyle?: IconTileProps['tileStyle'];
  /** Figma Marker=number: the step number. */
  number?: number | string;
  /** Figma Show link: a Button variant="link" or an <a>. */
  link?: React.ReactNode;
  /** The title's heading level, one below the section title. */
  headingLevel?: 2 | 3 | 4 | 5;
}

function FeatureItem({ title, description, layout = 'stacked', icon, tileStyle, number, link, headingLevel = 3, className, ...props }: FeatureItemProps) {
  const Heading = `h${headingLevel}` as 'h3';
  const centered = layout === 'centered';
  const marker =
    number !== undefined ? (
      <span data-slot="feature-item-number" className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm leading-5 font-medium text-primary-foreground">
        <span className="sr-only">Step </span>
        {number}
      </span>
    ) : (
      <IconTile icon={icon ?? <Sparkles />} tileStyle={tileStyle} />
    );
  return (
    <div
      data-slot="feature-item"
      data-layout={layout}
      className={cn(
        'flex min-w-0',
        layout === 'stacked' && 'flex-col items-start gap-3',
        layout === 'inline' && 'items-start gap-4',
        centered && 'flex-col items-center gap-3 text-center',
        layout === 'card' && 'flex-col items-start gap-4 rounded-xl border border-border bg-card p-6 text-card-foreground',
        className,
      )}
      {...props}
    >
      {marker}
      <div className={cn('flex min-w-0 flex-col gap-1', centered ? 'w-full items-center' : layout === 'inline' ? 'flex-1 items-start' : 'w-full items-start')}>
        <Heading className="m-0 text-lg leading-7 font-semibold text-foreground [overflow-wrap:anywhere]">{title}</Heading>
        {description ? <p className="m-0 text-sm leading-5 text-muted-foreground [overflow-wrap:anywhere]">{description}</p> : null}
        {link ? <div className="flex">{link}</div> : null}
      </div>
    </div>
  );
}

export { FeatureItem };
