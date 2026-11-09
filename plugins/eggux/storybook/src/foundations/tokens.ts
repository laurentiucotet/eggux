// Helpers for the Foundations pages: read the design tokens as they are right now (the values
// follow the Scheme and Look chosen in the toolbar), turn them into numbers, and
// compute contrast. The pages never hold a copy of a value: change a variable in Figma, export,
// and the pages show the new one.
import * as React from 'react';

/** Re-renders when the theme classes on <html> change. */
export function useThemeVersion(): number {
  const [version, setVersion] = React.useState(0);
  React.useEffect(() => {
    const observer = new MutationObserver(() => setVersion(v => v + 1));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);
  return version;
}

/** The value of a CSS variable on an element (default: the page root), as written in tokens.css. */
export const readToken = (name: string, el: Element = document.documentElement): string => getComputedStyle(el).getPropertyValue(name).trim();

export type Rgba = [number, number, number, number];

let ctx: CanvasRenderingContext2D | null | undefined;
/** Any CSS color (hex, rgb, color-mix) as [r, g, b, alpha 0..1], or null when it is not a color. */
export function parseColor(value: string): Rgba | null {
  if (!value) return null;
  if (ctx === undefined) ctx = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;
  ctx.clearRect(0, 0, 1, 1);
  ctx.fillStyle = '#010203';
  ctx.fillStyle = value;
  // An invalid value leaves the marker color: not a color.
  if (ctx.fillStyle === '#010203' && !/^#010203$/i.test(value)) return null;
  ctx.fillRect(0, 0, 1, 1);
  const d = ctx.getImageData(0, 0, 1, 1).data;
  return [d[0]!, d[1]!, d[2]!, d[3]! / 255];
}

/** Lays a color with alpha over an opaque one. */
export const over = (fg: Rgba, bg: Rgba): Rgba => {
  const a = fg[3];
  return [fg[0] * a + bg[0] * (1 - a), fg[1] * a + bg[1] * (1 - a), fg[2] * a + bg[2] * (1 - a), 1];
};

const channel = (c: number) => {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};
const luminance = (c: Rgba) => 0.2126 * channel(c[0]) + 0.7152 * channel(c[1]) + 0.0722 * channel(c[2]);

/** WCAG contrast ratio of two colors (1 to 21); the foreground is laid over the background. */
export function contrast(fg: Rgba, bg: Rgba): number {
  const f = over(fg, bg);
  const l1 = luminance(f);
  const l2 = luminance(bg);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

const hex2 = (n: number) => Math.round(n).toString(16).padStart(2, '0');
/** #rrggbb, or #rrggbbaa when the color is see-through. */
export const toHex = (c: Rgba): string => `#${hex2(c[0])}${hex2(c[1])}${hex2(c[2])}${c[3] < 1 ? hex2(c[3] * 255) : ''}`;

/** The words for a text contrast ratio. */
export const textGrade = (ratio: number): string => (ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : ratio >= 3 ? 'Large text only' : 'Below 3');
/** The words for the contrast of a border, icon or focus ring against its surface. */
export const edgeGrade = (ratio: number): string => (ratio >= 3 ? 'Meets 3:1' : 'Below 3:1');

/** The name of the active look and scheme, from the classes on <html>. */
export function themeName(): string {
  const root = document.documentElement.classList;
  const look = root.contains('theme-corporate') ? 'Back office' : root.contains('theme-showcase') ? 'Showcase' : 'Platform';
  return `${look}, ${root.contains('dark') ? 'dark' : 'light'}`;
}
