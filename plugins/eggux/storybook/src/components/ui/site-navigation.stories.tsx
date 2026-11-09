import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { SiteFooter, SiteFooterSimple, SiteNavbar, type FooterColumn, type SiteLink } from './site-navigation';

const links: SiteLink[] = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing', active: true },
  { label: 'Solutions', href: '#solutions', hasMenu: true },
  { label: 'Customers', href: '#customers' },
  { label: 'Docs', href: '#docs' },
];
const navArgs = { links, signIn: { href: '#signin' }, cta: { label: 'Book a demo', href: '#demo' } };

const columns: FooterColumn[] = [
  { title: 'Product', links: ['Features', 'Pricing', 'Integrations', 'Security', 'Changelog', 'Roadmap'].map(l => ({ label: l, href: `#${l.toLowerCase()}` })) },
  { title: 'Resources', links: ['Docs', 'Help center', 'Guides', 'API reference', 'Status'].map(l => ({ label: l, href: `#${l.toLowerCase().replace(' ', '-')}` })) },
  { title: 'Company', links: ['About', 'Customers', 'Careers', 'Press', 'Contact'].map(l => ({ label: l, href: `#${l.toLowerCase()}` })) },
  { title: 'Legal', links: ['Privacy', 'Terms', 'Cookies', 'GDPR', 'DPA'].map(l => ({ label: l, href: `#${l.toLowerCase()}` })) },
];

const meta = {
  title: 'Blocks/Navigation/Navbar',
  component: SiteNavbar,
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'Marketing site navigation. Navbar: logo, five links (current one marked), Sign in and one primary CTA; on-image over a photo or video; under 768 the links move into a full-width menu with the CTAs. Footer: brand and link columns, then the legal line; Footer Simple for small sites. App navigation uses Top Bar or App Header instead. Figma: BLOCKS / Navigation. Guide: eggux build-ui/patterns/marketing-pages.md' } },
  },
  args: navArgs,
  render: args => <div className="w-[1440px]"><SiteNavbar {...args} /></div>,
} satisfies Meta<typeof SiteNavbar>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();

// Figma: 1440 × 61 (12 padding, 36 controls, border), links in a nav "Main" with aria-current.
export const Default: Story = {
  play: async ({ canvas }) => {
    const header = canvas.getByRole('banner');
    await expect(Math.round(box(header).height)).toBe(61);
    const nav = canvas.getByRole('navigation', { name: 'Main' });
    await expect(within(nav).getByRole('link', { name: 'Pricing' })).toHaveAttribute('aria-current', 'page');
    await expect(canvas.getByRole('link', { name: 'Book a demo' })).toHaveAttribute('href', '#demo');
    await expect(canvas.getByRole('link', { name: 'Acme' })).toHaveAttribute('href', '/');
    await expect(canvas.queryByRole('button', { name: 'Menu' })).toBeNull();
  },
};

// On an image, with a cart.
export const OnImageWithCart: Story = {
  render: args => (
    <div className="relative w-[1440px] bg-[linear-gradient(135deg,#1e3a8a,#0f172a)] pb-40">
      <SiteNavbar {...args} variant="on-image" cartCount={2} />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: 'Cart, 2 items' })).toBeInTheDocument();
  },
};

// Under 768: 64 high bar; Menu opens the links and the CTAs full width.
export const Mobile: Story = {
  render: args => <div className="w-[390px]"><SiteNavbar {...args} /></div>,
  play: async ({ canvas }) => {
    await expect(Math.round(box(canvas.getByRole('banner')).height)).toBe(65);
    await userEvent.click(canvas.getByRole('button', { name: 'Menu' }));
    const dialog = await within(document.body).findByRole('dialog', { name: 'Menu' });
    const solutions = within(dialog).getByRole('link', { name: 'Solutions' });
    await expect(Math.round(box(solutions).height)).toBe(48);
    await expect(within(dialog).getByRole('link', { name: 'Book a demo' })).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
  },
};

const footer = (w: number, cols = columns) => (
  <div style={{ width: w }}><SiteFooter tagline="Projects, clients and billing for growing teams." columns={cols} copyright="© 2026 Acme Inc. All rights reserved." end="Made in Europe" /></div>
);

// Footer 1440 × 402: brand and four link columns (each a nav named by its title), legal line.
export const Footer: Story = {
  parameters: { controls: { disable: true } },
  render: () => footer(1440),
  play: async ({ canvas, canvasElement }) => {
    await expect(Math.round(box(canvasElement.querySelector('footer')!).height)).toBe(402);
    await expect(within(canvas.getByRole('navigation', { name: 'Product' })).getByRole('link', { name: 'Changelog' })).toHaveAttribute('href', '#changelog');
  },
};

// Footer Simple 1440 × 214.
export const FooterSimple: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="w-[1440px]">
      <SiteFooterSimple
        links={['Product', 'Pricing', 'Customers', 'Blog', 'Careers', 'Contact'].map(l => ({ label: l, href: `#s-${l.toLowerCase()}` }))}
        legal={['Privacy', 'Terms', 'Cookies', 'Security'].map(l => ({ label: l, href: `#l-${l.toLowerCase()}` }))}
        copyright="© 2026 Acme Inc. All rights reserved."
      />
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    await expect(Math.round(box(canvasElement.querySelector('footer')!).height)).toBe(214);
    await expect(canvas.getByRole('navigation', { name: 'Legal' })).toBeInTheDocument();
  },
};

// Stress: at 390 the columns stack into a 2-column grid. Tests only.
export const FooterNarrow: Story = {
  parameters: { controls: { disable: true } },
  tags: ['!dev'],
  render: () => footer(390),
  play: async ({ canvas }) => {
    const product = canvas.getByRole('navigation', { name: 'Product' });
    const company = canvas.getByRole('navigation', { name: 'Company' });
    await expect(box(company).top).toBeGreaterThan(box(product).top);
  },
};

export const DefaultDark: Story = { parameters: { controls: { disable: true } }, tags: ['!dev'], globals: { theme: 'Dark' }, render: Footer.render };
export const DefaultCorporate: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' } };
