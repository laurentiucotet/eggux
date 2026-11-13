import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { SecurityCompliance, TrustStrip } from './section-trust';

const meta = {
  title: 'Blocks/Sections/Trust',
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'Reassurance sections. Security and Compliance: enterprise and finance pages, before Pricing: the controls (Feature Items) and the certificates you hold (Trust Badges with what backs them). Trust Strip: one row of promises under a store hero or above the footer. Figma: BLOCKS / Sections (Trust). Guide: eggux build-ui/patterns/marketing-pages.md' } },
  },
} satisfies Meta;
export default meta;

const cat = (category: string) => ({ table: { category } });
const text = (name: string, description: string, category = 'Content') => ({ name, control: 'text' as const, description, ...cat(category) });
const bool = (name: string, description: string, category = 'Content') => ({ name, control: 'boolean' as const, description, ...cat(category) });

type SecurityArgs = { overline: string; title: string; description: string; showActions: boolean; showCertifications: boolean };
export const Security: StoryObj<SecurityArgs> = {
  name: 'Security and Compliance',
  args: {
    overline: 'Security and compliance',
    title: 'Built to pass your audit and your security review',
    description: 'We hold the controls your auditors test and the certifications your security team asks for, with the reports ready to share under NDA.',
    showActions: true,
    showCertifications: true,
  },
  argTypes: {
    overline: text('Overline', 'Section Header overline.', 'Section Header'),
    title: text('Title', 'Section Header title (h2): says the answer.', 'Section Header'),
    description: text('Description', 'Section Header description.', 'Section Header'),
    showActions: bool('Show actions', 'Request the security pack and the trust center link.'),
    showCertifications: bool('Show certifications', 'The Trust Badges row under the controls.'),
  },
  render: a => (
    <SecurityCompliance
      overline={a.overline}
      title={a.title}
      description={a.description}
      primaryAction={a.showActions ? undefined : null}
      secondaryAction={a.showActions ? undefined : null}
      certifications={a.showCertifications ? undefined : []}
    />
  ),
};

type StripArgs = { label: string };
export const Strip: StoryObj<StripArgs> = {
  name: 'Trust Strip',
  args: { label: 'Why shop with Acme' },
  argTypes: { label: text('Label', 'Name of the section for screen readers (no visible title).') },
  render: a => <TrustStrip label={a.label} />,
};

/* Hidden checks */

const box = (el: Element) => el.getBoundingClientRect();
const r = (n: number) => Math.round(n);
const slot = (root: Element, name: string) => root.querySelector(`[data-slot="${name}"]`)!;
const items = (root: Element, name: string) => [...root.querySelectorAll(`[data-slot="${name}"]`)];
const tops = (els: Element[]) => new Set(els.map(e => r(box(e).top))).size;
const lefts = (els: Element[]) => new Set(els.map(e => r(box(e).left))).size;

const All = ({ width }: { width: number }) => (
  <div className="flex flex-col" style={{ width }}>
    <SecurityCompliance />
    <TrustStrip />
  </div>
);

async function common(root: HTMLElement, width: number) {
  const c = within(root);
  await expect(root.querySelectorAll('h1')).toHaveLength(0);
  const regions = c.getAllByRole('region');
  await expect(regions).toHaveLength(2);
  for (const s of regions) {
    await expect(s).toHaveAccessibleName();
    await expect(s.scrollWidth).toBeLessThanOrEqual(width);
  }
  await expect(c.getAllByRole('heading', { level: 2 })).toHaveLength(1);
  // Control titles are h3 under the section h2.
  await expect(c.getAllByRole('heading', { level: 3 })).toHaveLength(6);
  for (const el of [...c.queryAllByRole('link'), ...c.queryAllByRole('button')]) await expect(el).toHaveAccessibleName();
  await expect(c.getByRole('link', { name: 'Request the security pack' })).toHaveAttribute('href', '#security-pack');
  await expect(c.getByRole('link', { name: 'Visit the trust center' })).toHaveAttribute('href', '#trust-center');
  await expect(c.getByRole('list', { name: 'Certifications' }).children).toHaveLength(4);
  await expect(c.getByRole('list', { name: 'Why shop with Acme' }).children).toHaveLength(4);
  await expect((root.firstElementChild as HTMLElement).scrollWidth).toBeLessThanOrEqual(width);
}

export const Check1440: StoryObj = {
  tags: ['!dev'],
  render: () => <All width={1440} />,
  play: async ({ canvasElement }) => {
    await common(canvasElement, 1440);
    const c = within(canvasElement);
    // Security: 96 padding; intro 544 and controls 544, 64 apart; controls 2 × 256, 32 apart.
    const sec = c.getByRole('region', { name: 'Built to pass your audit and your security review' });
    const intro = slot(sec, 'security-compliance-intro');
    const controls = slot(sec, 'security-compliance-controls');
    await expect(r(box(intro).top - box(sec).top)).toBe(96);
    await expect(r(box(intro).width)).toBe(544);
    await expect(r(box(controls).width)).toBe(544);
    await expect(r(box(controls).left - box(intro).right)).toBe(64);
    const feats = items(sec, 'feature-item');
    await expect(lefts(feats)).toBe(2);
    await expect(r(box(feats[0]!).width)).toBe(256);
    await expect(r(box(feats[1]!).left - box(feats[0]!).right)).toBe(32);
    // Certifications: 48 under the controls, border and 48 padding, four 270 badges, 24 apart.
    const certs = slot(sec, 'security-compliance-certifications');
    await expect(r(box(certs).top - box(controls).bottom)).toBe(48);
    const badges = items(certs, 'trust-badge');
    await expect(tops(badges)).toBe(1);
    await expect(r(box(badges[0]!).width)).toBe(270);
    await expect(r(box(badges[0]!).top - box(certs).top)).toBe(49);
    await expect(r(box(badges[1]!).left - box(badges[0]!).right)).toBe(24);
    // Trust Strip: 64 padding, four badges in a row, 182 high.
    const strip = c.getByRole('region', { name: 'Why shop with Acme' });
    await expect(tops(items(strip, 'trust-badge'))).toBe(1);
    await expect(r(box(items(strip, 'trust-badge')[0]!).top - box(strip).top)).toBe(64);
    await expect(r(box(strip).height)).toBe(182);
  },
};

export const Check768: StoryObj = {
  tags: ['!dev'],
  render: () => <All width={768} />,
  play: async ({ canvasElement }) => {
    await common(canvasElement, 768);
    const c = within(canvasElement);
    const sec = c.getByRole('region', { name: 'Built to pass your audit and your security review' });
    // Intro stacks over the controls; controls keep 2 columns; badges 2 per row.
    await expect(box(slot(sec, 'security-compliance-controls')).top).toBeGreaterThan(box(slot(sec, 'security-compliance-intro')).bottom);
    await expect(lefts(items(sec, 'feature-item'))).toBe(2);
    await expect(tops(items(sec, 'trust-badge'))).toBe(2);
    await expect(tops(items(c.getByRole('region', { name: 'Why shop with Acme' }), 'trust-badge'))).toBe(2);
  },
};

export const Check390: StoryObj = {
  tags: ['!dev'],
  render: () => <All width={390} />,
  play: async ({ canvasElement }) => {
    await common(canvasElement, 390);
    const c = within(canvasElement);
    const sec = c.getByRole('region', { name: 'Built to pass your audit and your security review' });
    await expect(lefts(items(sec, 'feature-item'))).toBe(1);
    await expect(tops(items(sec, 'trust-badge'))).toBe(4);
    const strip = c.getByRole('region', { name: 'Why shop with Acme' });
    await expect(tops(items(strip, 'trust-badge'))).toBe(4);
    await expect(r(box(items(strip, 'trust-badge')[0]!).left - box(strip).left)).toBe(24);
  },
};

export const AllDark: StoryObj = { tags: ['!dev'], globals: { theme: 'Dark' }, render: () => <All width={1440} /> };
export const AllBackOffice: StoryObj = { tags: ['!dev'], globals: { theme: 'Corporate Light' }, render: () => <All width={1440} /> };
