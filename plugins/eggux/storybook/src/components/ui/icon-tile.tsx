// EGG UI Icon Tile. Figma: Icon Tile (Card page dependency of Stat Card and Callout Card). A rounded
// square holding one icon. Style: neutral (muted, default), brand (icon-tile/brand tint), gradient
// (icon-tile/gradient-start to -end with a primary-foreground icon), outline (border ring, muted
// icon). Size: default 40 (icon 20), sm 32 (icon 16), lg 48 (icon 24). The icon is decorative.
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const iconTileVariants = cva('inline-flex shrink-0 items-center justify-center rounded-md', {
  variants: {
    tileStyle: {
      neutral: 'bg-muted text-foreground',
      brand: 'bg-[var(--icon-tile-brand-bg)] text-[var(--icon-tile-brand-fg)]',
      gradient: 'bg-gradient-to-br from-[var(--icon-tile-gradient-start)] to-[var(--icon-tile-gradient-end)] text-primary-foreground',
      outline: 'border border-border text-muted-foreground',
    },
    size: {
      sm: "size-8 [&_svg:not([class*='size-'])]:size-4",
      default: "size-10 [&_svg:not([class*='size-'])]:size-5",
      lg: "size-12 [&_svg:not([class*='size-'])]:size-6",
    },
  },
  defaultVariants: { tileStyle: 'neutral', size: 'default' },
});

export interface IconTileProps extends Omit<React.ComponentProps<'span'>, 'style'>, VariantProps<typeof iconTileVariants> {
  /** Figma Icon: an icon element from `@/components/icons`. Rendered aria-hidden. */
  icon: React.ReactNode;
}

// The prop for Figma "Style" is `tileStyle`, because `style` is the React inline-style prop.
function IconTile({ icon, tileStyle, size, className, ...props }: IconTileProps) {
  return (
    <span data-slot="icon-tile" data-style={tileStyle ?? 'neutral'} aria-hidden="true" className={cn(iconTileVariants({ tileStyle, size }), className)} {...props}>
      {icon}
    </span>
  );
}

export { IconTile, iconTileVariants };
