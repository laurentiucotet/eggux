import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import {
  BentoGrid, BentoGrid2, FeatureChecklist, Features, FeaturesSplit, FeaturesTabs, FeaturesWithCode, FeaturesWithScreenshot,
  HowItWorks, IntegrationsGrid, UseCases, UsVsThem,
} from './section-features';

interface Args {
  overline: string;
  title: string;
  description: string;
  showOverline: boolean;
  showDescription: boolean;
  tileStyle?: 'neutral' | 'brand' | 'gradient';
  showHeader?: boolean;
}

const meta: Meta<Args> = {
  title: 'Blocks/Sections/Features',
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'Feature sections, each a region named by its h2 Section Header. Features: a grid of 3-6 short benefits. Features Split: deep-dive rows with a product screen, alternating sides. Bento Grid and Bento Grid 2: a platform overview with real components. Features with Screenshot: one area proved by its screen. Features Tabs: 3-5 areas of one product. How It Works: 3-4 steps. Feature Checklist: what every plan includes. Integrations Grid: the tools it really works with. Features with Code: an SDK sample under 15 lines. Use Cases: 3-4 teams, each linking to its page. Us vs Them: one honest comparison by category of tool, with sources and date. Columns follow the block width: they stack in narrow columns and on phones. Figma: BLOCKS / Sections (Features). Guide: eggux build-ui/patterns/marketing-pages.md' } },
  },
  argTypes: {
    overline: { name: 'Overline', control: 'text', table: { category: 'Section Header' } },
    title: { name: 'Title', control: 'text', description: 'The answer the section gives.', table: { category: 'Section Header' } },
    description: { name: 'Description', control: 'text', table: { category: 'Section Header' } },
    showOverline: { name: 'Show overline', control: 'boolean', table: { category: 'Section Header' } },
    showDescription: { name: 'Show description', control: 'boolean', table: { category: 'Section Header' } },
  },
};
export default meta;
type Story = StoryObj<Args>;

/** Header args → block props. */
const head = (a: Args) => ({ overline: a.showOverline ? a.overline : '', title: a.title, description: a.showDescription ? a.description : '' });
const heading = (overline: string, title: string, description: string) => ({ args: { overline, title, description, showOverline: true, showDescription: true } });

export const FeaturesGrid: Story = {
  name: 'Features',
  ...heading('FEATURES', 'Everything your team runs on', 'From the first lead to the last invoice, in one place your whole team can use.'),
  argTypes: { tileStyle: { name: 'Icon Tile style', control: 'inline-radio', options: ['neutral', 'brand', 'gradient'], description: 'One style for the whole grid.', table: { category: 'Items' } } } ,
  render: a => <Features {...head(a)} tileStyle={a.tileStyle} />,
};

export const Split: Story = {
  name: 'Features Split',
  ...heading('FEATURES', 'Approvals and audit in one place', 'Route every request to the right people and keep proof of every change.'),
  argTypes: { showHeader: { name: 'Show section header', control: 'boolean', description: 'A header over the rows (hidden in Figma); the row titles become h3.', table: { category: 'Section Header' } } } ,
  render: a => <FeaturesSplit {...head(a)} showHeader={a.showHeader} />,
};

export const Bento: Story = {
  name: 'Bento Grid',
  ...heading('PLATFORM', 'Everything finance and operations need', 'One workspace for invoices, approvals, reports and access.'),
  render: a => <BentoGrid {...head(a)} />,
};

export const WithScreenshot: Story = {
  name: 'Features with Screenshot',
  ...heading('APPROVALS', 'Approvals that never stall a payment', 'Every invoice reaches the right person with the context to decide, and nothing gets paid without a record of who said yes.'),
  render: a => <FeaturesWithScreenshot {...head(a)} />,
};

export const Tabbed: Story = {
  name: 'Features Tabs',
  ...heading('ONE WORKSPACE', 'From the first quote to the last payment', 'Pick an area to see how it works. Every screen shares the same clients, projects and numbers, so nothing is typed twice.'),
  render: a => <FeaturesTabs {...head(a)} />,
};

export const Steps: Story = {
  name: 'How It Works',
  ...heading('HOW IT WORKS', 'Paid on time in three steps', 'No setup project and no consultants. Most teams send their first invoice the same afternoon they sign up.'),
  render: a => <HowItWorks {...head(a)} />,
};

export const Bento2: Story = {
  name: 'Bento Grid 2',
  ...heading('PLATFORM', 'Your numbers, your work and your team in one place', 'Every tile below is the real product: charts, boards and AI answers built from the same data your team already keeps.'),
  render: a => <BentoGrid2 {...head(a)} />,
};

export const Checklist: Story = {
  name: 'Feature Checklist',
  ...heading('EVERY PLAN INCLUDES', 'Everything you need to bill clients, nothing you have to bolt on', 'No add-ons and no per-feature pricing. Every workspace gets the full set from day one.'),
  render: a => <FeatureChecklist {...head(a)} />,
};

export const Integrations: Story = {
  name: 'Integrations Grid',
  ...heading('INTEGRATIONS', 'Works with the tools you already pay for', '40+ connectors for banking, accounting, CRM and messaging, maintained by us, plus an open API and webhooks for the rest.'),
  render: a => <IntegrationsGrid {...head(a)} />,
};

export const WithCode: Story = {
  name: 'Features with Code',
  ...heading('DEVELOPERS', 'Send your first invoice from code in five minutes', 'A typed SDK, a REST API and webhooks for every event. Build invoicing into your product without rebuilding accounting.'),
  render: a => <FeaturesWithCode {...head(a)} />,
};

export const Cases: Story = {
  name: 'Use Cases',
  ...heading('USE CASES', 'Built for every team that touches money', 'From the first quote to the last payment reminder, each team gets the views and approvals it needs.'),
  render: a => <UseCases {...head(a)} />,
};

export const Comparison: Story = {
  name: 'Us vs Them',
  ...heading('WHY ACME', 'Acme compared with spreadsheets and legacy suites', 'What changes when invoices, approvals and payments live in one tool.'),
  render: a => <UsVsThem {...head(a)} />,
};

/* Hidden checks */

const blocks: [string, () => React.ReactElement][] = [
  ['Everything your team runs on', () => <Features />],
  ['Every request, one approval chain', () => <FeaturesSplit />],
  ['Everything finance and operations need', () => <BentoGrid />],
  ['Approvals that never stall a payment', () => <FeaturesWithScreenshot />],
  ['From the first quote to the last payment', () => <FeaturesTabs />],
  ['Paid on time in three steps', () => <HowItWorks />],
  ['Your numbers, your work and your team in one place', () => <BentoGrid2 />],
  ['Everything you need to bill clients, nothing you have to bolt on', () => <FeatureChecklist />],
  ['Works with the tools you already pay for', () => <IntegrationsGrid />],
  ['Send your first invoice from code in five minutes', () => <FeaturesWithCode />],
  ['Built for every team that touches money', () => <UseCases />],
  ['Acme compared with spreadsheets and legacy suites', () => <UsVsThem />],
];

const All = ({ width }: { width?: number }) => (
  <div style={width ? { width } : undefined} className="flex flex-col">
    {blocks.map(([t, B]) => <React.Fragment key={t}>{B()}</React.Fragment>)}
  </div>
);

const box = (el: Element) => el.getBoundingClientRect();
/** Number of distinct column positions among the children of a grid or row. */
const columns = (el: Element | null) => new Set(Array.from(el!.children).map(c => Math.round(box(c).left))).size;
const slot = (root: Element, name: string) => root.querySelector(`[data-slot="${name}"]`);

/** Landmarks, headings, names and overflow, at any width. */
async function common(canvasElement: HTMLElement, width: number) {
  const c = within(canvasElement);
  await expect(c.queryAllByRole('heading', { level: 1 })).toHaveLength(0);
  for (const [title] of blocks) {
    const region = c.getByRole('region', { name: title });
    await expect(within(region).getByRole('heading', { level: 2, name: title })).toBeInTheDocument();
    await expect(region.scrollWidth).toBeLessThanOrEqual(width);
    await expect(Math.round(box(region).width)).toBe(width);
  }
  for (const el of [...c.getAllByRole('link'), ...c.getAllByRole('button'), ...c.getAllByRole('tab')]) await expect(el).toHaveAccessibleName();
  // Product screens are one described image; nothing inside takes focus.
  for (const shot of canvasElement.querySelectorAll('[data-slot="screenshot"]')) {
    await expect(shot).toHaveAttribute('role', 'img');
    await expect(shot).toHaveAccessibleName();
    await expect(shot.querySelector('[inert]')).not.toBeNull();
  }
  for (const img of canvasElement.querySelectorAll('img')) await expect(img.hasAttribute('alt')).toBe(true);
}

// Figma at 1440: 96 top padding, 1152 content, Section Header 768, columns as drawn.
export const Desktop: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <All width={1440} />,
  play: async ({ canvasElement }) => {
    await common(canvasElement, 1440);
    const sections = Array.from(canvasElement.querySelectorAll<HTMLElement>('section[data-tone]'));
    await expect(sections).toHaveLength(12);
    for (const s of sections) {
      const inner = slot(s, 'section-container')!;
      await expect(getComputedStyle(inner).paddingTop).toBe('96px');
      await expect(Math.round(box(inner).width - 48)).toBe(1152);
      const header = slot(s, 'section-header');
      if (header && header.getAttribute('data-align') === 'center') await expect(Math.round(box(header).width)).toBe(768);
    }
    const [features, split, bento, shot, tabs, how, bento2, checklist, integrations, code, cases, vs] = sections as [HTMLElement, ...HTMLElement[]];
    // Features: 3 columns, 48 apart, items 352 wide.
    const grid = slot(features, 'features-grid')!;
    await expect(columns(grid)).toBe(3);
    await expect(Math.round(box(grid.children[0]!).width)).toBe(352);
    // Split and with Screenshot / Code: text 448, screen 640, 64 apart.
    for (const s of [split, shot, code]) {
      await expect(Math.round(box(slot(s!, 'features-split-text')!).width)).toBe(448);
      await expect(Math.round(box(slot(s!, 'features-split-media')!).width)).toBe(640);
    }
    const rows = split!.querySelectorAll('[data-slot="features-split-row"]');
    await expect(box(rows[1]!.querySelector('[data-slot="features-split-media"]')!).left).toBeLessThan(box(rows[1]!.querySelector('[data-slot="features-split-text"]')!).left);
    // Bento rows: 2 then 3 tiles; Bento 2 the same.
    for (const b of [bento, bento2]) {
      const r = b!.querySelectorAll('[data-slot="bento-row"]');
      await expect(columns(r[0]!)).toBe(2);
      await expect(columns(r[1]!)).toBe(3);
    }
    // Tabs: the screen fills 1152.
    await expect(Math.round(box(tabs!.querySelector('[role="tabpanel"] [data-slot="screenshot"]')!).width)).toBe(1152);
    // How It Works on the muted band, 3 step cards.
    await expect(how).toHaveAttribute('data-tone', 'muted');
    await expect(columns(slot(how!, 'how-it-works-steps'))).toBe(3);
    // Checklist: image and content side by side, checks in 2 columns.
    await expect(columns(checklist!.querySelector('ul'))).toBe(2);
    // Integrations: 4 columns of 72 high tiles.
    await expect(integrations).toHaveAttribute('data-tone', 'muted');
    await expect(columns(integrations!.querySelector('ul'))).toBe(4);
    await expect(Math.round(box(slot(integrations!, 'logo-tile')!).height)).toBe(72);
    // Use Cases: 4 cards; Us vs Them: 1024 card, a real table.
    await expect(columns(cases!.querySelector('ul'))).toBe(4);
    await expect(Math.round(box(slot(vs!, 'comparison')!).width)).toBe(1024);
    await expect(within(vs!).getAllByRole('rowheader')).toHaveLength(8);
    await expect(within(vs!).getAllByRole('columnheader')).toHaveLength(4);
  },
};

// 768: grids drop to 2 columns, splits stack; nothing scrolls sideways.
export const Tablet: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <All width={768} />,
  play: async ({ canvasElement }) => {
    await common(canvasElement, 768);
    const sections = Array.from(canvasElement.querySelectorAll<HTMLElement>('section[data-tone]'));
    const [features, split, bento, , , how, , , integrations, , cases] = sections;
    await expect(columns(slot(features!, 'features-grid'))).toBe(2);
    await expect(columns(split!.querySelector('[data-slot="features-split-row"]'))).toBe(1);
    await expect(columns(bento!.querySelectorAll('[data-slot="bento-row"]')[0]!)).toBe(1);
    await expect(columns(bento!.querySelectorAll('[data-slot="bento-row"]')[1]!)).toBe(2);
    await expect(columns(slot(how!, 'how-it-works-steps'))).toBe(1);
    await expect(columns(integrations!.querySelector('ul'))).toBe(3);
    await expect(columns(cases!.querySelector('ul'))).toBe(2);
    await expect(getComputedStyle(slot(features!, 'section-container')!).paddingTop).toBe('96px');
  },
};

// 390: one column everywhere (two for logo tiles), 64 padding, nothing scrolls sideways.
export const Phone: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <All width={390} />,
  play: async ({ canvasElement }) => {
    await common(canvasElement, 390);
    const sections = Array.from(canvasElement.querySelectorAll<HTMLElement>('section[data-tone]'));
    const [features, , , , , , , checklist, integrations, , cases] = sections;
    await expect(columns(slot(features!, 'features-grid'))).toBe(1);
    await expect(columns(checklist!.querySelector('ul'))).toBe(1);
    await expect(columns(integrations!.querySelector('ul'))).toBe(2);
    await expect(columns(cases!.querySelector('ul'))).toBe(1);
    await expect(getComputedStyle(slot(features!, 'section-container')!).paddingTop).toBe('64px');
  },
};

// Tabs: arrows move between areas, the panel changes; the period Toggle Group keeps one choice.
export const Interactions: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <div className="w-[1440px]"><FeaturesTabs /><BentoGrid2 /></div>,
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('tab', { name: 'Approvals' }));
    await waitFor(() => expect(canvas.getByRole('tab', { name: 'Approvals' })).toHaveAttribute('aria-selected', 'true'));
    await expect(canvas.getByRole('heading', { level: 3, name: 'Approvals with the context to decide' })).toBeVisible();
    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => expect(canvas.getByRole('tab', { name: 'Reports' })).toHaveFocus());
    await waitFor(() => expect(canvas.getByRole('tabpanel')).toHaveTextContent('Reports that are ready every morning'));
    const days = canvas.getByRole('radio', { name: '30 days' });
    await userEvent.click(days);
    await waitFor(() => expect(days).toHaveAttribute('aria-checked', 'true'));
  },
};

export const AllDark: Story = { tags: ['!dev'], parameters: { controls: { disable: true } }, globals: { theme: 'Dark' }, render: () => <All width={1440} /> };
export const AllCorporate: Story = { tags: ['!dev'], parameters: { controls: { disable: true } }, globals: { theme: 'Corporate Light' }, render: () => <All width={1440} /> };
