import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Faq, FaqCentered, FaqGrid, FaqWithCategories } from './section-faq';

const meta = {
  title: 'Blocks/Sections/FAQ',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Answers before people ask sales. FAQ: a left Section Header next to an Accordion on the muted band. FAQ Grid: when answers are one or two sentences. FAQ Centered: one column with a contact card at the end. FAQ with Categories: past ten questions, topics on the left and card accordions on the right. Figma: BLOCKS / Sections (FAQ). Guide: eggux build-ui/patterns/marketing-pages.md',
      },
    },
  },
} satisfies Meta;
export default meta;

const cat = (category: string) => ({ table: { category } });
const text = (name: string, description: string, category = 'Content') => ({ name, control: 'text' as const, description, ...cat(category) });
const bool = (name: string, description: string, category = 'Content') => ({ name, control: 'boolean' as const, description, ...cat(category) });

type HeaderArgs = { overline: string; title: string; description: string };
const headerArgTypes = {
  overline: text('Overline', 'Section Header overline.', 'Section Header'),
  title: text('Title', 'Section Header title.', 'Section Header'),
  description: text('Description', 'Section Header description: where to ask if the answer is missing.', 'Section Header'),
};
const header = (a: HeaderArgs) => ({ overline: a.overline, title: a.title, description: a.description });

export const Default: StoryObj<HeaderArgs> = {
  name: 'FAQ',
  args: { overline: 'FAQ', title: 'Questions teams ask', description: 'Can’t find the answer? Write to support@acme.com.' },
  argTypes: headerArgTypes,
  render: a => <Faq header={header(a)} />,
};

export const Grid: StoryObj<HeaderArgs> = {
  name: 'FAQ Grid',
  args: { overline: 'FAQ', title: 'Questions we hear often', description: 'Can’t find an answer? Our team replies within one business day.' },
  argTypes: headerArgTypes,
  render: a => <FaqGrid header={header(a)} />,
};

type CenteredArgs = HeaderArgs & { showContact: boolean; contactTitle: string; contactDescription: string };
export const Centered: StoryObj<CenteredArgs> = {
  name: 'FAQ Centered',
  args: {
    overline: 'FAQ',
    title: 'Frequently asked questions',
    description: 'Everything about plans, data and security.',
    showContact: true,
    contactTitle: 'Still have questions?',
    contactDescription: 'Talk to a person, not a bot. We reply within one business day.',
  },
  argTypes: {
    ...headerArgTypes,
    showContact: bool('Show contact', 'The contact card at the end.', 'Contact'),
    contactTitle: text('Contact title', 'Card title.', 'Contact'),
    contactDescription: text('Contact description', 'Who answers and how fast.', 'Contact'),
  },
  render: a => (
    <FaqCentered header={header(a)} contact={a.showContact ? { title: a.contactTitle, description: a.contactDescription, action: { label: 'Contact us', href: '#contact' } } : null} />
  ),
};

type CategoriesArgs = HeaderArgs & { showHelp: boolean };
export const WithCategories: StoryObj<CategoriesArgs> = {
  name: 'FAQ with Categories',
  args: { overline: 'FAQ', title: 'Questions, sorted by topic', description: 'Pick a topic. If your question is not here, our team answers within four hours on weekdays.', showHelp: true },
  argTypes: { ...headerArgTypes, showHelp: bool('Show help card', 'The help card under the topics.') },
  render: a => <FaqWithCategories header={header(a)} help={a.showHelp ? undefined : null} />,
};

/* Hidden checks */

const box = (el: Element) => el.getBoundingClientRect();
const r = (n: number) => Math.round(n);
const slot = (root: Element, name: string) => root.querySelector(`[data-slot="${name}"]`)!;
const items = (root: Element, name: string) => [...root.querySelectorAll(`[data-slot="${name}"]`)];
const lefts = (els: Element[]) => new Set(els.map(e => r(box(e).left))).size;

const All = ({ width }: { width: number }) => (
  <div className="flex flex-col" style={{ width }}>
    <Faq />
    <FaqGrid />
    <FaqCentered />
    <FaqWithCategories />
  </div>
);

const names = { faq: 'Questions teams ask', grid: 'Questions we hear often', centered: 'Frequently asked questions', categories: 'Questions, sorted by topic' };

async function common(root: HTMLElement, width: number) {
  const c = within(root);
  await expect(root.querySelectorAll('h1')).toHaveLength(0);
  // Open accordion panels are regions too: count the blocks' own sections.
  const regions = [...root.querySelectorAll(':scope > div > section')];
  await expect(regions).toHaveLength(4);
  for (const s of regions) {
    await expect(s).toHaveAccessibleName();
    await expect(s.scrollWidth).toBeLessThanOrEqual(width);
  }
  await expect(c.getAllByRole('heading', { level: 2 })).toHaveLength(4);
  for (const el of [...c.queryAllByRole('link'), ...c.queryAllByRole('button')]) await expect(el).toHaveAccessibleName();
  await expect((root.firstElementChild as HTMLElement).scrollWidth).toBeLessThanOrEqual(width);
}

export const Check1440: StoryObj = {
  tags: ['!dev'],
  render: () => <All width={1440} />,
  play: async ({ canvasElement }) => {
    await common(canvasElement, 1440);
    const c = within(canvasElement);
    // FAQ: header 384, accordion 704, 64 apart; first item open; items open and close.
    const faq = c.getByRole('region', { name: names.faq });
    const row = slot(faq, 'faq-row');
    await expect(r(box(row.children[0]!).width)).toBe(384);
    await expect(r(box(row.children[1]!).width)).toBe(704);
    await expect(r(box(row.children[1]!).left - box(row.children[0]!).right)).toBe(64);
    await expect(r(box(row).top - box(faq).top)).toBe(96);
    const first = within(faq).getByRole('button', { name: 'Can I change my plan later?' });
    await expect(first).toHaveAttribute('aria-expanded', 'true');
    const second = within(faq).getByRole('button', { name: 'Do you integrate with my accounting tool?' });
    await userEvent.click(second);
    await waitFor(() => expect(second).toHaveAttribute('aria-expanded', 'true'));
    // Grid: 2 columns of 552, 48 apart.
    const grid = c.getByRole('region', { name: names.grid });
    const qa = items(grid, 'faq-grid-item');
    await expect(qa).toHaveLength(6);
    await expect(r(box(qa[0]!).width)).toBe(552);
    await expect(r(box(qa[1]!).left - box(qa[0]!).right)).toBe(48);
    await expect(r(box(qa[2]!).top - box(qa[0]!).bottom)).toBe(40);
    // Centered: 768 column, the contact card at the end.
    const centered = c.getByRole('region', { name: names.centered });
    await expect(r(box(slot(centered, 'faq-centered-column')).width)).toBe(768);
    await expect(within(centered).getByRole('link', { name: 'Contact us' })).toBeVisible();
    // Categories: 256 topics, 64 from the answers; picking a topic shows its questions.
    const cats = c.getByRole('region', { name: names.categories });
    const aside = slot(cats, 'faq-categories-aside');
    await expect(r(box(aside).width)).toBe(256);
    await expect(r(box(slot(cats, 'faq-categories-answers')).left - box(aside).right)).toBe(64);
    const nav = within(cats).getByRole('navigation', { name: 'Topics' });
    await expect(within(nav).getByRole('link', { name: 'Billing and plans' })).toHaveAttribute('aria-current', 'true');
    await expect(within(cats).getByRole('heading', { level: 3, name: 'Billing and plans' })).toBeVisible();
    await expect(within(cats).getByText('5 questions')).toBeVisible();
    await userEvent.click(within(nav).getByRole('link', { name: 'Approvals' }));
    await waitFor(() => expect(within(cats).getByRole('heading', { level: 3, name: 'Approvals' })).toBeVisible());
    await expect(within(nav).getByRole('link', { name: 'Approvals' })).toHaveAttribute('aria-current', 'true');
    await expect(within(cats).getByText('2 questions')).toBeVisible();
  },
};

export const Check768: StoryObj = {
  tags: ['!dev'],
  render: () => <All width={768} />,
  play: async ({ canvasElement }) => {
    await common(canvasElement, 768);
    const c = within(canvasElement);
    // Header above the accordion; grid keeps 2 columns; topics above the answers.
    const row = slot(c.getByRole('region', { name: names.faq }), 'faq-row');
    await expect(box(row.children[1]!).top).toBeGreaterThan(box(row.children[0]!).bottom);
    await expect(lefts(items(c.getByRole('region', { name: names.grid }), 'faq-grid-item'))).toBe(2);
    const cats = c.getByRole('region', { name: names.categories });
    await expect(box(slot(cats, 'faq-categories-answers')).top).toBeGreaterThan(box(slot(cats, 'faq-categories-aside')).bottom);
  },
};

export const Check390: StoryObj = {
  tags: ['!dev'],
  render: () => <All width={390} />,
  play: async ({ canvasElement }) => {
    await common(canvasElement, 390);
    const c = within(canvasElement);
    // One column with 24 px gutters.
    const grid = c.getByRole('region', { name: names.grid });
    const qa = items(grid, 'faq-grid-item');
    await expect(lefts(qa)).toBe(1);
    await expect(r(box(qa[0]!).left - box(grid).left)).toBe(24);
    await expect(r(box(qa[0]!).width)).toBe(342);
  },
};

export const AllDark: StoryObj = { tags: ['!dev'], globals: { theme: 'Dark' }, render: () => <All width={1440} /> };
export const AllBackOffice: StoryObj = { tags: ['!dev'], globals: { theme: 'Corporate Light' }, render: () => <All width={1440} /> };
