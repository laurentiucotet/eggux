import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Globe, Mail, MessageSquare } from '@/components/icons';
import { SiteFooterCentered, SiteFooterCorporate, SiteFooterNewsletter, type FooterColumn } from './site-navigation';

const col = (title: string, labels: string[]): FooterColumn => ({ title, links: labels.map(l => ({ label: l, href: `#${title.toLowerCase()}-${l.toLowerCase().replace(/ /g, '-')}` })) });
const newsletterColumns = [
  col('Product', ['Invoicing', 'Approvals', 'Reports', 'Integrations', 'Pricing']),
  col('Solutions', ['Finance teams', 'Operations', 'Agencies', 'Procurement', 'Enterprise']),
  col('Resources', ['Docs', 'Help center', 'API reference', 'Changelog', 'Status', 'Webinars']),
  col('Company', ['About', 'Customers', 'Careers', 'Press', 'Contact']),
];
const corporateColumns = [
  col('Product', ['Invoicing', 'Approvals', 'Reports', 'Audit log', 'Integrations']),
  col('Solutions', ['Finance', 'Operations', 'Procurement', 'Public sector', 'Enterprise']),
  col('Resources', ['Docs', 'Help center', 'Webinars', 'Changelog', 'Status']),
  col('Company', ['About', 'Customers', 'Partners', 'Careers', 'Contact']),
  col('Legal', ['Privacy', 'Terms', 'DPA', 'Subprocessors', 'Security']),
];
const legal = ['Privacy', 'Terms', 'Cookies'].map(l => ({ label: l, href: `#${l.toLowerCase()}` }));
const onSubscribe = fn();

const Newsletter = ({ width = 1440 }: { width?: number }) => (
  <div style={{ width }}>
    <SiteFooterNewsletter
      tagline="Invoicing, approvals and reporting for finance teams."
      newsletter={{ buttonLabel: 'Subscribe', hint: 'No spam. Unsubscribe from any email.', onSubmit: onSubscribe }}
      columns={newsletterColumns}
      copyright="© 2026 Acme Inc. All rights reserved."
      legal={legal}
    />
  </div>
);
const Corporate = ({ width = 1440 }: { width?: number }) => (
  <div style={{ width }}>
    <SiteFooterCorporate
      address={['Acme Inc.', 'Strada Exemplu 10, Bucharest', 'Registered in Romania']}
      certifications={['ISO 27001', 'SOC 2 Type II', 'GDPR']}
      columns={corporateColumns}
      copyright="© 2026 Acme Inc. All rights reserved."
      status={{ label: 'All systems operational', href: '#status' }}
      social={['LinkedIn', 'YouTube', 'GitHub'].map(l => ({ label: l, href: `#${l.toLowerCase()}` }))}
      language={{ value: 'en-eu', options: [{ value: 'en-eu', label: 'English (EU)' }, { value: 'ro', label: 'Română' }, { value: 'de', label: 'Deutsch' }] }}
    />
  </div>
);
const Centered = ({ width = 1440 }: { width?: number }) => (
  <div style={{ width }}>
    <SiteFooterCentered
      links={['Product', 'Pricing', 'Customers', 'Docs', 'Careers', 'Contact'].map(l => ({ label: l, href: `#c-${l.toLowerCase()}` }))}
      social={[
        { label: 'Choose language', href: '#language', icon: <Globe aria-hidden="true" /> },
        { label: 'Email us', href: 'mailto:hello@acme.example', icon: <Mail aria-hidden="true" /> },
        { label: 'Chat with us', href: '#chat', icon: <MessageSquare aria-hidden="true" /> },
      ]}
      copyright="© 2026 Acme Inc."
      legal={[{ label: 'Privacy', href: '#privacy' }, { label: 'Terms', href: '#terms' }]}
    />
  </div>
);

const meta = {
  title: 'Blocks/Navigation/Footer Variants',
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'Footer Newsletter: brand, a monthly-updates sign-up (Inline Form) and link columns. Footer Corporate: company details, certifications, five columns, live status, social links and language. Footer Centered: logo, one row of links, contact icon buttons with labels, copyright and legal. Columns stack under 768. Figma: BLOCKS / Navigation (Footer Newsletter, Corporate, Centered).' } },
  },
  render: () => <Newsletter />,
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();

// Figma 1440 × 410: brand 400 with the sign-up, four columns, legal line.
export const NewsletterFooter: Story = {
  name: 'Newsletter',
  play: async ({ canvas, canvasElement }) => {
    await expect(Math.round(box(canvasElement.querySelector('footer')!).height)).toBe(410);
    const email = canvas.getByRole('textbox', { name: 'Email address' });
    await userEvent.type(email, 'ana@company.com');
    await userEvent.click(canvas.getByRole('button', { name: 'Subscribe' }));
    await expect(onSubscribe).toHaveBeenCalledWith('ana@company.com', expect.anything());
    await expect(canvas.getByRole('form', { name: 'Product updates, once a month' })).toBeInTheDocument();
    await expect(within(canvas.getByRole('navigation', { name: 'Resources' })).getAllByRole('link')).toHaveLength(6);
  },
};

// Figma 1440 × 394: muted background, address, certifications, five columns, status, language.
export const CorporateFooter: Story = {
  name: 'Corporate',
  render: () => <Corporate />,
  play: async ({ canvas, canvasElement }) => {
    await expect(Math.abs(Math.round(box(canvasElement.querySelector('footer')!).height) - 394)).toBeLessThanOrEqual(2);
    await expect(canvasElement.querySelector('address')).toHaveTextContent('Strada Exemplu 10, Bucharest');
    await expect(canvas.getByRole('list', { name: 'Certifications' })).toHaveTextContent('SOC 2 Type II');
    await expect(canvas.getByRole('link', { name: 'All systems operational' })).toHaveAttribute('href', '#status');
    await expect(canvas.getByRole('navigation', { name: 'Legal' })).toHaveTextContent('Subprocessors');
    await expect(canvas.getByRole('combobox', { name: 'Language and region' })).toHaveTextContent('English (EU)');
  },
};

// Figma 1440 × 301: centered logo, links, three labelled icon buttons, copyright with legal links.
export const CenteredFooter: Story = {
  name: 'Centered',
  render: () => <Centered />,
  play: async ({ canvas, canvasElement }) => {
    await expect(Math.round(box(canvasElement.querySelector('footer')!).height)).toBe(301);
    await expect(canvas.getByRole('link', { name: 'Email us' })).toHaveAttribute('href', 'mailto:hello@acme.example');
    await expect(canvas.getByRole('list', { name: 'Contact' }).querySelectorAll('a')).toHaveLength(3);
    await expect(canvas.getByRole('link', { name: 'Terms' })).toHaveAttribute('href', '#terms');
  },
};

// Stress: 390 wide, columns stack in two and the bottom row wraps. Tests only.
export const Narrow: Story = {
  tags: ['!dev'],
  parameters: { a11y: { config: { rules: [{ id: 'landmark-no-duplicate-contentinfo', enabled: false }, { id: 'landmark-unique', enabled: false }] } } },
  render: () => (
    <div className="flex flex-col gap-8">
      <Newsletter width={390} />
      <Corporate width={390} />
      <Centered width={390} />
    </div>
  ),
  play: async ({ canvas }) => {
    const [product] = canvas.getAllByRole('navigation', { name: 'Product' });
    const [company] = canvas.getAllByRole('navigation', { name: 'Company' });
    await expect(box(company!).top).toBeGreaterThan(box(product!).top);
    for (const f of canvas.getAllByRole('contentinfo')) await expect(f.scrollWidth).toBeLessThanOrEqual(390);
  },
};

// Several footers on one test page: a real page has one contentinfo, so the duplicate-landmark rules are off here.
const many = { a11y: { config: { rules: [{ id: 'landmark-no-duplicate-contentinfo', enabled: false }, { id: 'landmark-unique', enabled: false }] } } };
const All = () => <div className="flex flex-col gap-8"><Newsletter /><Corporate /><Centered /></div>;
export const AllDark: Story = { tags: ['!dev'], parameters: many, globals: { theme: 'Dark' }, render: () => <All /> };
export const AllCorporate: Story = { tags: ['!dev'], parameters: many, globals: { theme: 'Corporate Light' }, render: () => <All /> };
