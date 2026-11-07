// EGG UI Background page: Background / Grid (675:779), Dots (675:782), Glow (676:784: top, center,
// bottom-right), Beam (676:785). Decorative layers for the back of a hero, feature or CTA section:
// absolute, inset 0, behind the content (put them first and give the section `relative isolate`),
// aria-hidden, no pointer events, hidden in forced-colors mode. One device per page (Grid + Glow
// count as one hero treatment).
// Grid: 1 px border lines, 40 px cells, 60%. Dots: 1.5 px muted-foreground dots, 24 px pitch, 50%.
// Fade (default on): a radial mask so the pattern fades toward the edges.
// Glow: one ellipse of primary at 35% fading out, blur 3xl; follows the theme.
// Beam: three diagonal primary beams (22%, 16%, 12%) at -35°, blur 2xl, entering from the top right.
import * as React from 'react';
import { cn } from '@/lib/utils';

const layer = 'pointer-events-none absolute inset-0 -z-10 overflow-hidden forced-colors:hidden';
const fadeMask: React.CSSProperties = {
  maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 100%)',
  WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 100%)',
};

export interface BackgroundPatternProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  /** Figma Fade: fade toward the edges. Default true. */
  fade?: boolean;
}

function BackgroundGrid({ fade = true, className, style, ...props }: BackgroundPatternProps) {
  return (
    <div
      aria-hidden="true"
      data-slot="background-grid"
      className={cn(layer, 'bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:40px_40px] bg-center opacity-60', className)}
      style={{ ...(fade ? fadeMask : null), ...style }}
      {...props}
    />
  );
}

function BackgroundDots({ fade = true, className, style, ...props }: BackgroundPatternProps) {
  return (
    <div
      aria-hidden="true"
      data-slot="background-dots"
      className={cn(layer, 'bg-[radial-gradient(var(--muted-foreground)_0.75px,transparent_0.75px)] bg-[size:24px_24px] bg-center opacity-50', className)}
      style={{ ...(fade ? fadeMask : null), ...style }}
      {...props}
    />
  );
}

export type GlowPosition = 'top' | 'center' | 'bottom-right';

const glowPlace: Record<GlowPosition, string> = {
  top: 'top-[-30%] left-1/2 h-[60%] w-[76%] -translate-x-1/2',
  center: 'top-1/2 left-1/2 h-[76%] w-[68%] -translate-x-1/2 -translate-y-1/2',
  'bottom-right': 'right-[-20%] bottom-[-36%] h-[88%] w-[60%]',
};

export interface BackgroundGlowProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  /** Figma Position. Default top (keeps a centered subtitle on the plain page). */
  position?: GlowPosition;
}

function BackgroundGlow({ position = 'top', className, ...props }: BackgroundGlowProps) {
  return (
    <div aria-hidden="true" data-slot="background-glow" data-position={position} className={cn(layer, className)} {...props}>
      <div className={cn('absolute rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--primary)_35%,transparent),transparent)] blur-3xl', glowPlace[position])} />
    </div>
  );
}

const beams = [
  { left: '28%', width: '7%', alpha: 22 },
  { left: '43%', width: '4.5%', alpha: 16 },
  { left: '55%', width: '10%', alpha: 12 },
];

function BackgroundBeam({ className, ...props }: Omit<React.ComponentProps<'div'>, 'children'>) {
  return (
    <div aria-hidden="true" data-slot="background-beam" className={cn(layer, className)} {...props}>
      {beams.map(b => (
        <div
          key={b.left}
          data-slot="beam"
          className="absolute top-[-10%] h-[130%] origin-top -rotate-[35deg] blur-2xl"
          style={{ left: b.left, width: b.width, background: `linear-gradient(to bottom, color-mix(in oklab, var(--primary) ${b.alpha}%, transparent), transparent)` }}
        />
      ))}
    </div>
  );
}

export { BackgroundBeam, BackgroundDots, BackgroundGlow, BackgroundGrid };
