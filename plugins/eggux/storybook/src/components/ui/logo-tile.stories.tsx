import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { LogoTile } from './logo-tile';
import { brandLogos, customerLogoNames, type BrandLogoName } from './brand-logos';

const meta = {
  title: 'Components/Brand/Logo Tile',
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'A customer or partner logo in a tile, for logo clouds, integration grids and case study lists. Style bordered: card fill, border, radius lg, the logo at full strength (integrations). Style plain: no fill, the logo dimmed to 70% so a cloud reads as one muted row. 72 high, at least 160 wide, 24 px side padding, the logo 32 high. Logo: a sample mark by name, or the client logo as children. Use a different logo in every tile and render a cloud as a list (`as="li"`). Figma: Brand page / Logo Tile. Guide: eggux build-ui/patterns/marketing-pages.md' } },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();
const tiles = (el: HTMLElement) => [...el.querySelectorAll<HTMLElement>('[data-slot="logo-tile"]')];

type Playground = { tileStyle: 'bordered' | 'plain'; logo: BrandLogoName; title: string };

/** Playground: Style, Logo and the accessible name in Controls. */
export const Default: StoryObj<Playground> = {
  argTypes: {
    tileStyle: { name: 'Style', control: 'inline-radio', options: ['bordered', 'plain'], description: 'bordered: card tile, full strength. plain: no tile, logo at 70%.', table: { category: 'Logo Tile' } },
    logo: { name: 'Logo', control: 'select', options: Object.keys(brandLogos), description: 'The sample mark (Figma Logo swap)', table: { category: 'Logo' } },
    title: { name: 'Accessible name', control: 'text', description: 'Empty makes the logo decorative', table: { category: 'Logo' } },
  },
  args: { tileStyle: 'bordered', logo: 'Northwind', title: 'Northwind' },
  render: a => <LogoTile tileStyle={a.tileStyle} logo={a.logo} title={a.title} />,
};

// Hidden twin of the playground: named logo, Figma box.
export const DefaultCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <LogoTile logo="Meridian" />,
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole('img', { name: 'Meridian' })).toBeInTheDocument();
    const [tile] = tiles(canvasElement);
    await expect(tile.tagName).toBe('DIV');
    await expect(Math.round(box(tile).height)).toBe(72);
  },
};

// Figma Style=bordered and Style=plain side by side.
export const Styles: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex items-center gap-6 bg-background p-6">
      <LogoTile tileStyle="bordered" />
      <LogoTile tileStyle="plain" />
      <LogoTile tileStyle="bordered" logo="Vireo" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [bordered, plain, narrow] = tiles(canvasElement);
    // radius/lg: 12 in Platform, smaller in Back office.
    const radius = getComputedStyle(document.documentElement).getPropertyValue('--radius-lg').trim();
    for (const t of [bordered, plain, narrow]) {
      const s = getComputedStyle(t);
      await expect(Math.round(box(t).height)).toBe(72);
      await expect([s.paddingLeft, s.paddingRight, s.borderTopLeftRadius]).toEqual(['24px', '24px', radius]);
      const logo = t.querySelector('svg')!;
      await expect(Math.round(box(logo).height)).toBe(32);
      // Centered in the tile.
      await expect(Math.abs((box(logo).top - box(t).top) - (box(t).bottom - box(logo).bottom))).toBeLessThan(1);
    }
    // Hug: Northwind (134.18) + 48 padding + 2 border; Vireo is narrower than the 160 minimum.
    await expect(Math.abs(box(bordered).width - (brandLogos.Northwind.width + 50))).toBeLessThan(1);
    await expect(Math.round(box(narrow).width)).toBe(160);
    const sb = getComputedStyle(bordered);
    await expect(sb.borderTopWidth).toBe('1px');
    await expect(sb.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
    await expect(getComputedStyle(bordered.querySelector('[data-slot="logo-tile-logo"]')!).opacity).toBe('1');
    const sp = getComputedStyle(plain);
    await expect(sp.borderTopWidth).toBe('0px');
    await expect(sp.backgroundColor).toBe('rgba(0, 0, 0, 0)');
    await expect(getComputedStyle(plain.querySelector('[data-slot="logo-tile-logo"]')!).opacity).toBe('0.7');
  },
};

const CLOUD: BrandLogoName[] = ['Northwind', 'Orbitly', 'Kestrel', 'Quintra', 'Halcyon', 'Meridian'];

/** A logo cloud: plain tiles in a list, one muted row that wraps. */
export const LogoCloud: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <ul aria-label="Customers" className="m-0 flex list-none flex-wrap justify-center gap-4 p-0">
      {CLOUD.map(n => <LogoTile key={n} as="li" tileStyle="plain" logo={n} />)}
    </ul>
  ),
};

// Hidden twin: list semantics, every logo named and different.
export const LogoCloudCheck: Story = {
  ...LogoCloud,
  tags: ['!dev'],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const list = canvas.getByRole('list', { name: 'Customers' });
    const items = within(list).getAllByRole('listitem');
    await expect(items).toHaveLength(CLOUD.length);
    for (const n of CLOUD) await expect(canvas.getByRole('img', { name: n })).toBeInTheDocument();
    await expect(new Set(items.map(i => i.querySelector('svg')!.dataset.logo)).size).toBe(CLOUD.length);
  },
};

// Hidden: the client's own logo as children, decorative when the name is in text.
export const ChildrenAndDecorative: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col items-start gap-4">
      <LogoTile>
        <svg role="img" aria-label="Acme" viewBox="0 0 80 32" width="80" height="32" fill="currentColor"><title>Acme</title><rect x="0" y="4" width="24" height="24" rx="6" /><rect x="32" y="12" width="48" height="8" rx="4" /></svg>
      </LogoTile>
      <figure className="m-0 flex items-center gap-3">
        <LogoTile logo="Corvid" title="" />
        <figcaption>Corvid cut close time by four days.</figcaption>
      </figure>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const [custom, deco] = tiles(canvasElement);
    await expect(within(custom).getByRole('img', { name: 'Acme' })).toBeInTheDocument();
    await expect(custom.querySelector('[data-slot="brand-logo"]')).toBeNull();
    await expect(deco.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    await expect(canvas.getAllByRole('img')).toHaveLength(1);
    await expect(Math.round(box(custom).height)).toBe(72);
  },
};

// Hidden: every sample mark fits a tile at 32 high (no clipping, tile hugs the logo).
export const AllLogos: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap gap-4">
      {Object.keys(brandLogos).map(n => <LogoTile key={n} logo={n as BrandLogoName} />)}
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const t of tiles(canvasElement)) {
      const logo = t.querySelector('svg')!;
      await expect(box(logo).left).toBeGreaterThanOrEqual(box(t).left + 24 - 0.5);
      await expect(box(logo).right).toBeLessThanOrEqual(box(t).right - 24 + 0.5);
    }
    await expect(tiles(canvasElement)).toHaveLength(customerLogoNames.length + 6);
  },
};

// Theme copies (hidden, still run by npm test): axe contrast of both styles in each mode.
export const StylesDark: Story = { ...Styles, tags: ['!dev'], globals: { theme: 'Dark' } };
export const StylesCorporate: Story = { ...Styles, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
