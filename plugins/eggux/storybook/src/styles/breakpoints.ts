// The widths the product is designed for. One place: the Storybook size selector (preview.tsx), the
// Foundations / Breakpoints page and the checks read this list. Edit it to match the product.
// The names after "sm" are Tailwind's default breakpoints (`sm:`, `md:` ... utilities switch at
// these widths); "base" is a phone, where no prefix applies.
export interface Breakpoint {
  /** Key in the Storybook size selector and in the URL (`viewport.value:md`). */
  key: string;
  /** Tailwind prefix, or "base" for the smallest size. */
  prefix: string;
  /** What the size stands for. */
  label: string;
  width: number;
  /** Height of the preview frame in the selector. */
  height: number;
  type: 'mobile' | 'tablet' | 'desktop';
}

export const breakpoints: Breakpoint[] = [
  { key: 'base', prefix: 'base', label: 'Phone', width: 375, height: 812, type: 'mobile' },
  { key: 'sm', prefix: 'sm', label: 'Large phone', width: 640, height: 900, type: 'mobile' },
  { key: 'md', prefix: 'md', label: 'Tablet', width: 768, height: 1024, type: 'tablet' },
  { key: 'lg', prefix: 'lg', label: 'Small laptop', width: 1024, height: 768, type: 'desktop' },
  { key: 'xl', prefix: 'xl', label: 'Desktop', width: 1280, height: 800, type: 'desktop' },
  { key: '2xl', prefix: '2xl', label: 'Wide desktop', width: 1536, height: 900, type: 'desktop' },
];

/** The shape Storybook's viewport parameter wants. */
export const viewportOptions = Object.fromEntries(
  breakpoints.map(b => [
    b.key,
    { name: `${b.prefix} · ${b.width}`, styles: { width: `${b.width}px`, height: `${b.height}px` }, type: b.type },
  ]),
);
