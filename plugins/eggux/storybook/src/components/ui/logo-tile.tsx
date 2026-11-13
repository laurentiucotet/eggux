// EGG UI Logo Tile. Figma: Logo Tile (Brand page, 440:2959). A customer or partner logo in a tile for
// logo clouds, integration grids and case study lists. Style: bordered (default) = background/card,
// 1 px border/default, radius lg, logo at full strength; plain = no fill or border, logo dimmed to 70%
// so a cloud reads as one muted row. Both: 72 high, min width 160, 24 px side padding (spacing/6),
// content centered, the logo 32 high in foreground/default (hugs its width).
// Logo (instance swap in Figma): one of the sample `Logo / *` marks by name, or the client's own logo
// as `children` (an inline SVG in currentColor, or an <img> with alt). Use a different logo in every
// tile of a row.
// Accessibility: the logo is named by `title` (default the brand name); pass `title=""` when the name
// is already in text nearby. Render tiles of a cloud as a list (`as="li"` inside a <ul>).
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { BrandLogo, type BrandLogoName } from './brand-logos';

const logoTileVariants = cva('inline-flex h-18 min-w-40 shrink-0 items-center justify-center gap-2 rounded-lg px-6 text-foreground', {
  variants: {
    tileStyle: {
      bordered: 'border border-border bg-card',
      plain: '[&>[data-slot=logo-tile-logo]]:opacity-70',
    },
  },
  defaultVariants: { tileStyle: 'bordered' },
});

type LogoTileElement = 'div' | 'li';

export interface LogoTileProps extends Omit<React.ComponentProps<'div'>, 'style' | 'title'>, VariantProps<typeof logoTileVariants> {
  /** Figma Logo: a sample mark by name. Ignored when `children` holds the client's own logo. */
  logo?: BrandLogoName;
  /** The accessible name of the logo. Default the brand name; "" makes the mark decorative. */
  title?: string;
  /** The element: `li` inside a <ul> for a logo cloud, `div` otherwise. */
  as?: LogoTileElement;
  /** A client's own logo instead of a sample mark (inline SVG in currentColor, 32 high, or an <img> with alt). */
  children?: React.ReactNode;
}

// The prop for Figma "Style" is `tileStyle`, because `style` is the React inline-style prop.
function LogoTile({ logo = 'Northwind', title, tileStyle, as = 'div', className, children, ...props }: LogoTileProps) {
  const Comp = as as React.ElementType;
  return (
    <Comp data-slot="logo-tile" data-style={tileStyle ?? 'bordered'} className={cn(logoTileVariants({ tileStyle }), className)} {...props}>
      <span data-slot="logo-tile-logo" className="inline-flex h-8 shrink-0 items-center [&_img]:h-8 [&_img]:w-auto">
        {children != null ? children : <BrandLogo name={logo} title={title ?? logo} />}
      </span>
    </Comp>
  );
}

export { LogoTile, logoTileVariants };
