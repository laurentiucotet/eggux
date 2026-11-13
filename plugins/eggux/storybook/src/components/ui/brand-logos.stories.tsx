import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { BrandLogo, brandLogoNames, brandLogos, customerLogoNames, pressLogoNames, type BrandLogoName } from './brand-logos';

const meta = {
  title: 'Components/Brand/Brand Logos',
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Fictional sample brands for logo clouds, integration grids, testimonials and press rows: 12 customer marks (symbol and wordmark) and 6 press mastheads, exported from Figma and drawn in currentColor, so they follow the theme and the text color around them. 32 high by default; the width follows each mark. Give `title` (the brand name) unless the name is already in text next to it. Dim a whole row with opacity (Logo Tile plain), never recolor one logo. Replace them with real logos (with permission) before launch. Figma: Brand page / Logo / *, Logo / Press / *. Guide: eggux build-ui/patterns/marketing-pages.md' } },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

type Playground = { name: BrandLogoName; size: number; title: string };

/** Playground: pick a mark, its height and its accessible name. */
export const Default: StoryObj<Playground> = {
  argTypes: {
    name: { name: 'Logo', control: 'select', options: brandLogoNames, description: 'The sample mark (Figma Logo / <Name> or Logo / Press / <Name>)', table: { category: 'Brand Logo' } },
    size: { name: 'Height', control: { type: 'range', min: 16, max: 64, step: 4 }, description: 'Height in px; the width follows the mark (Figma 32)', table: { category: 'Brand Logo' } },
    title: { name: 'Accessible name', control: 'text', description: 'Empty makes the mark decorative (aria-hidden)', table: { category: 'Brand Logo' } },
  },
  args: { name: 'Northwind', size: 32, title: 'Northwind' },
  render: a => <BrandLogo name={a.name} size={a.size} title={a.title} className="text-foreground" />,
};

function GalleryView() {
  return (
    <div className="flex flex-col gap-8 bg-background p-6 text-foreground">
      <div className="flex flex-col gap-4">
        <p id="customer-marks" className="m-0 text-sm leading-5 font-medium text-muted-foreground">Customer marks</p>
        <ul aria-labelledby="customer-marks" className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-x-8 gap-y-6 p-0">
          {customerLogoNames.map(n => <li key={n} className="flex h-10 items-center"><BrandLogo name={n} title={n} /></li>)}
        </ul>
      </div>
      <div className="flex flex-col gap-4">
        <p id="press-marks" className="m-0 text-sm leading-5 font-medium text-muted-foreground">Press mastheads</p>
        <ul aria-labelledby="press-marks" className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-x-8 gap-y-6 p-0">
          {pressLogoNames.map(n => <li key={n} className="flex h-10 items-center"><BrandLogo name={n} title={n} /></li>)}
        </ul>
      </div>
    </div>
  );
}

// Relative luminance and contrast (WCAG 2) of rgb() colors, with alpha blended over the backdrop.
const rgb = (c: string) => {
  const m = c.match(/rgba?\(([^)]+)\)/);
  if (!m) throw new Error(`Unexpected color ${c}`);
  const [r, g, b, a = 1] = m[1].split(/[ ,/]+/).filter(Boolean).map(Number);
  return { r, g, b, a };
};
const lum = ({ r, g, b }: { r: number; g: number; b: number }) => {
  const f = (v: number) => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const backdrop = (el: Element) => {
  for (let n: Element | null = el; n; n = n.parentElement) {
    const c = rgb(getComputedStyle(n).backgroundColor);
    if (c.a > 0) return c;
  }
  return rgb(getComputedStyle(document.body).backgroundColor);
};
const contrast = (el: Element) => {
  const fg = rgb(getComputedStyle(el).color);
  let alpha = fg.a;
  for (let n: Element | null = el; n; n = n.parentElement) alpha *= Number(getComputedStyle(n).opacity);
  const bg = backdrop(el);
  const mix = { r: fg.r * alpha + bg.r * (1 - alpha), g: fg.g * alpha + bg.g * (1 - alpha), b: fg.b * alpha + bg.b * (1 - alpha) };
  const [hi, lo] = [lum(mix), lum(bg)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

/** Every sample mark: 12 customers and 6 press mastheads, 32 high. */
export const Gallery: Story = {
  parameters: { controls: { disable: true } },
  render: () => <GalleryView />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByRole('img')).toHaveLength(18);
    for (const n of brandLogoNames) {
      const svg = canvas.getByRole('img', { name: n });
      // Renders: drawn paths in currentColor, no ids that could collide on a page.
      await expect(svg.querySelectorAll('path').length).toBeGreaterThan(0);
      await expect(svg).toHaveAttribute('fill', 'currentColor');
      await expect(svg.querySelector('[id]')).toBeNull();
      // Keeps the Figma aspect ratio: 32 high, the component width.
      const r = svg.getBoundingClientRect();
      await expect(Math.round(r.height)).toBe(32);
      await expect(Math.abs(r.width - brandLogos[n].width)).toBeLessThan(1);
      // Non-text contrast (WCAG 1.4.11) against the page: at least 3:1.
      await expect(contrast(svg)).toBeGreaterThanOrEqual(3);
    }
  },
};

/** Hidden: named or decorative, and any height keeps the ratio. */
export const NamingAndSizes: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-4 text-foreground">
      <p className="m-0 flex items-center gap-2"><BrandLogo name="Lumora" data-testid="decorative" size={24} /><span>Lumora</span></p>
      <BrandLogo name="Kestrel" title="Kestrel" size={48} />
      <BrandLogo name="Tallyline" title="  " size={16} data-testid="blank" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const deco = canvas.getByTestId('decorative');
    await expect(deco).toHaveAttribute('aria-hidden', 'true');
    await expect(deco).not.toHaveAttribute('role');
    await expect(deco.querySelector('title')).toBeNull();
    await expect(canvas.getByTestId('blank')).toHaveAttribute('aria-hidden', 'true');
    const named = canvas.getByRole('img', { name: 'Kestrel' });
    await expect(named.querySelector('title')).toHaveTextContent('Kestrel');
    await expect(canvas.getAllByRole('img')).toHaveLength(1);
    const ratio = (el: Element) => { const r = el.getBoundingClientRect(); return r.width / r.height; };
    await expect(Math.round(named.getBoundingClientRect().height)).toBe(48);
    await expect(Math.abs(ratio(named) - brandLogos.Kestrel.width / 32)).toBeLessThan(0.02);
    await expect(Math.round(deco.getBoundingClientRect().height)).toBe(24);
    await expect(Math.abs(ratio(deco) - brandLogos.Lumora.width / 32)).toBeLessThan(0.02);
  },
};

// Theme copies: the same checks (contrast included) in Dark and Back office.
export const GalleryDark: Story = { ...Gallery, tags: ['!dev'], globals: { theme: 'Dark' } };
export const GalleryCorporate: Story = { ...Gallery, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
