// Test helpers for the Enterprise block stories (Blocks/Enterprise/*): render a block at 1440, 768
// and 390 and check what every app block must hold. Not a component; only stories import it.
import type { ReactNode } from 'react';
import { expect, within } from 'storybook/test';

export const WIDTHS = [1440, 768, 390] as const;

/** Three copies of one block: the same landmark names repeat on purpose. */
export const multi = { a11y: { config: { rules: [{ id: 'landmark-unique', enabled: false }] } }, controls: { disable: true } };

export const box = (el: Element) => el.getBoundingClientRect();

export function AtWidths({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-8">
      {WIDTHS.map(w => <div key={w} data-width={w} style={{ width: w }}>{children}</div>)}
    </div>
  );
}

export const frames = (root: HTMLElement) => WIDTHS.map(w => root.querySelector<HTMLElement>(`[data-width="${w}"]`)!);

/** The block is a region named by its only h2 (no h1), every link and button is named, images have alt, nothing scrolls sideways. */
export async function appBlock(root: HTMLElement) {
  for (const frame of frames(root)) {
    const section = frame.querySelector('section')!;
    await expect(section.querySelectorAll('h1')).toHaveLength(0);
    const h2s = section.querySelectorAll('h2');
    await expect(h2s).toHaveLength(1);
    await expect(within(frame).getAllByRole('region', { name: h2s[0]!.textContent! })[0]).toBe(section);
    for (const el of section.querySelectorAll('a, button')) {
      const labelFor = el.id ? section.querySelector(`label[for="${CSS.escape(el.id)}"]`)?.textContent : undefined;
      const name = (el.getAttribute('aria-label') ?? el.getAttribute('aria-labelledby') ?? labelFor ?? el.textContent ?? '').trim();
      await expect(name, el.outerHTML.slice(0, 120)).not.toBe('');
    }
    for (const img of section.querySelectorAll('img')) await expect(img.hasAttribute('alt')).toBe(true);
    const edge = box(frame).right + 0.5;
    const over = Array.from(section.querySelectorAll<HTMLElement>('*')).filter(el => box(el).right > edge && !el.closest('[data-slot="table-container"], .overflow-x-auto, .overflow-auto')).slice(-3).map(el => `${el.tagName}.${String(el.className).slice(0, 60)}`);
    await expect(section.scrollWidth, `no sideways scroll at ${frame.dataset.width}: ${over.join(' | ')}`).toBeLessThanOrEqual(frame.offsetWidth);
  }
}

/** At 1440 the content starts 32 from the edge. */
export async function padding1440(root: HTMLElement) {
  const frame = frames(root)[0]!;
  const inner = box(frame.querySelector('[data-slot="enterprise-block"]')!.firstElementChild!);
  await expect(Math.round(inner.left - box(frame).left)).toBe(32);
  await expect(Math.round(inner.width)).toBe(1440 - 64);
}

/** Two columns side by side at 1440 (`gap` apart, the second `second` wide or the first `first` wide), stacked at 768 and 390. */
export async function twoColumns(root: HTMLElement, slot: string, { first, second, gap }: { first?: number; second?: number; gap: number }) {
  const [wide, mid, narrow] = frames(root);
  const cols = (f: HTMLElement) => Array.from(f.querySelector(`[data-slot="${slot}"]`)!.children).filter(c => (c as HTMLElement).offsetParent !== null || getComputedStyle(c).display !== 'none') as HTMLElement[];
  const [a, b] = cols(wide!).filter(c => getComputedStyle(c).display !== 'none');
  if (first) await expect(Math.round(box(a!).width)).toBe(first);
  if (second) await expect(Math.round(box(b!).width)).toBe(second);
  await expect(Math.round(box(b!).left - box(a!).right)).toBe(gap);
  await expect(Math.round(box(b!).top)).toBe(Math.round(box(a!).top));
  for (const f of [mid!, narrow!]) {
    const visible = cols(f).filter(c => getComputedStyle(c).display !== 'none');
    if (visible.length > 1) await expect(box(visible[1]!).top).toBeGreaterThanOrEqual(box(visible[0]!).bottom);
  }
}
