import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { CareersBenefits, CareersList, JobHeader } from './section-careers';

const meta = {
  title: 'Blocks/Sections/Careers',
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'Careers pages. Careers List: open roles grouped by department with counts, a department filter and the salary range on every role. Careers Benefits: the benefits as facts, one line each. Job Header: the top of a job page with the title (h1), department, place, contract and salary range, Share and Apply. Figma: BLOCKS / Sections (Careers). Guide: eggux build-ui/patterns/marketing-pages.md' } },
  },
} satisfies Meta;
export default meta;

const cat = (category: string) => ({ table: { category } });
const text = (name: string, description: string, category = 'Content') => ({ name, control: 'text' as const, description, ...cat(category) });

type HeaderArgs = { overline: string; title: string; description: string };
const headerArgTypes = {
  overline: text('Overline', 'Section Header overline.', 'Section Header'),
  title: text('Title', 'Section Header title.', 'Section Header'),
  description: text('Description', 'Section Header description.', 'Section Header'),
};

type ListArgs = HeaderArgs & { department: string };
export const Default: StoryObj<ListArgs> = {
  name: 'Careers List',
  args: { overline: 'Careers', title: 'Open positions', description: '8 roles in Bucharest, Berlin, London, Lisbon and remote within the EU.', department: 'all' },
  argTypes: {
    ...headerArgTypes,
    department: { name: 'Department', control: 'inline-radio', options: ['all', 'Engineering', 'Design', 'Sales'], description: 'The department selected first.', ...cat('Content') },
  },
  render: ({ department, ...h }) => <CareersList key={department} header={h} defaultDepartment={department} />,
};

export const Benefits: StoryObj<HeaderArgs> = {
  name: 'Careers Benefits',
  args: { overline: 'Benefits', title: 'What you get at Acme', description: 'The same benefits in every office, from day one.' },
  argTypes: headerArgTypes,
  render: h => <CareersBenefits header={h} />,
};

type JobArgs = { title: string; backLabel: string; department: string; location: string; contract: string; salary: string };
export const Job: StoryObj<JobArgs> = {
  name: 'Job Header',
  args: { title: 'Senior Backend Engineer, Payments', backLabel: 'All positions', department: 'Engineering', location: 'Bucharest or remote (EU)', contract: 'Full-time', salary: '€70,000 - €90,000 per year' },
  argTypes: {
    title: text('Title', 'The job title (h1).'),
    backLabel: text('Back label', 'Names the list it goes back to.'),
    department: text('Department', 'First badge.', 'Badges'),
    location: text('Location', 'City or remote area.', 'Badges'),
    contract: text('Contract', 'Full-time, part-time with hours.', 'Badges'),
    salary: text('Salary range', 'Always show the range with currency and period.', 'Badges'),
  },
  render: a => <JobHeader title={a.title} backLabel={a.backLabel} tags={[a.department, a.location, a.contract, a.salary]} />,
};

/* Hidden checks */

const box = (el: Element) => el.getBoundingClientRect();
const r = (n: number) => Math.round(n);
const tops = (els: Element[]) => new Set(els.map(e => r(box(e).top))).size;
const slot = (root: Element, name: string) => root.querySelector(`[data-slot="${name}"]`)!;
const items = (root: Element, sel: string) => [...root.querySelectorAll(sel)];

const All = ({ width }: { width: number }) => (
  <div className="flex flex-col" style={{ width }}>
    <JobHeader />
    <CareersList />
    <CareersBenefits />
  </div>
);

async function common(root: HTMLElement, width: number) {
  const c = within(root);
  // One h1 (the job title), sections use h2.
  await expect(c.getAllByRole('heading', { level: 1 })).toHaveLength(1);
  const regions = c.getAllByRole('region');
  await expect(regions).toHaveLength(3);
  for (const s of regions) {
    await expect(s).toHaveAccessibleName();
    await expect(s.scrollWidth).toBeLessThanOrEqual(width);
  }
  await expect(c.getAllByRole('heading', { level: 2 })).toHaveLength(2);
  await expect(c.getAllByRole('heading', { level: 3 })).toHaveLength(3 + 6);
  await expect(c.getAllByRole('heading', { level: 4 })).toHaveLength(8);
  for (const el of [...c.queryAllByRole('link'), ...c.queryAllByRole('button'), ...c.queryAllByRole('radio')]) await expect(el).toHaveAccessibleName();
  await expect((root.firstElementChild as HTMLElement).scrollWidth).toBeLessThanOrEqual(width);
}

export const Check1440: StoryObj = {
  tags: ['!dev'],
  render: () => <All width={1440} />,
  play: async ({ canvasElement }) => {
    await common(canvasElement, 1440);
    const c = within(canvasElement);
    // Job Header: 96 top padding, text and actions on one row in 1152, separator 32 below.
    const job = c.getByRole('region', { name: 'Senior Backend Engineer, Payments' });
    const row = slot(job, 'job-header-row');
    await expect(r(box(row).width)).toBe(1152);
    await expect(r(box(row).top - box(job).top)).toBe(96);
    const actions = slot(job, 'action-bar');
    await expect(r(box(actions).right)).toBe(r(box(row).right));
    await expect(r(box(actions).bottom)).toBe(r(box(row).bottom));
    await expect(r(box(slot(job, 'separator')).top - box(row).bottom)).toBe(32);
    await expect(within(job).getByRole('link', { name: 'All positions' })).toHaveAttribute('href', '#careers');
    await expect(within(job).getByRole('list', { name: 'About the role' }).querySelectorAll('li')).toHaveLength(4);
    // Careers List: 960 column, three groups, 8 Job Listings with salary and Apply.
    const list = c.getByRole('region', { name: 'Open positions' });
    const header = slot(list, 'section-header');
    await expect(r(box(header).width)).toBe(960);
    await expect(r(box(header).left - box(list).left)).toBe(240);
    const groups = items(list, '[data-slot="careers-group"]');
    await expect(groups).toHaveLength(3);
    await expect(r(box(groups[1]!).top - box(groups[0]!).bottom)).toBe(32);
    const jobs = items(list, '[data-slot="job-listing"]');
    await expect(jobs).toHaveLength(8);
    await expect(r(box(jobs[0]!).width)).toBe(960);
    await expect(within(list).getByRole('link', { name: 'Apply for Site Reliability Engineer' })).toBeVisible();
    await expect(within(list).getAllByText('New')).toHaveLength(2);
    // Careers Benefits: six cards, 3 per row, 368 wide, 24 apart.
    const benefits = c.getByRole('region', { name: 'What you get at Acme' });
    const cards = items(benefits, '[data-slot="feature-item"]');
    await expect(cards).toHaveLength(6);
    await expect(tops(cards)).toBe(2);
    await expect(r(box(cards[0]!).width)).toBe(368);
    await expect(r(box(cards[1]!).left - box(cards[0]!).right)).toBe(24);
    await expect(r(box(cards[0]!).top - box(slot(benefits, 'section-header')).bottom)).toBe(48);
  },
};

export const Check768: StoryObj = {
  tags: ['!dev'],
  render: () => <All width={768} />,
  play: async ({ canvasElement }) => {
    await common(canvasElement, 768);
    const c = within(canvasElement);
    // Benefits 2 per row; list keeps 32 gutters.
    await expect(tops(items(c.getByRole('region', { name: 'What you get at Acme' }), '[data-slot="feature-item"]'))).toBe(3);
    const list = c.getByRole('region', { name: 'Open positions' });
    await expect(r(box(slot(list, 'section-header')).left - box(list).left)).toBe(32);
  },
};

export const Check390: StoryObj = {
  tags: ['!dev'],
  render: () => <All width={390} />,
  play: async ({ canvasElement }) => {
    await common(canvasElement, 390);
    const c = within(canvasElement);
    // Job Header actions go under the text; benefits one per row; 24 gutters.
    const job = c.getByRole('region', { name: 'Senior Backend Engineer, Payments' });
    await expect(box(slot(job, 'action-bar')).top).toBeGreaterThan(box(job.querySelector('h1')!).bottom);
    await expect(tops(items(c.getByRole('region', { name: 'What you get at Acme' }), '[data-slot="feature-item"]'))).toBe(6);
    const list = c.getByRole('region', { name: 'Open positions' });
    await expect(r(box(slot(list, 'section-header')).left - box(list).left)).toBe(24);
  },
};

/** The department chips filter the list; All brings every group back. */
export const FilterCheck: StoryObj = {
  tags: ['!dev'],
  render: () => <CareersList />,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(c.getByRole('radio', { name: /Design \(1\)/ }));
    await waitFor(() => expect(canvasElement.querySelectorAll('[data-slot="job-listing"]')).toHaveLength(1));
    await expect(c.getByRole('radio', { name: /Design \(1\)/ })).toHaveAttribute('aria-checked', 'true');
    await userEvent.click(c.getByRole('radio', { name: /All \(8\)/ }));
    await waitFor(() => expect(canvasElement.querySelectorAll('[data-slot="job-listing"]')).toHaveLength(8));
  },
};

export const AllDark: StoryObj = { tags: ['!dev'], globals: { theme: 'Dark' }, render: () => <All width={1440} /> };
export const AllBackOffice: StoryObj = { tags: ['!dev'], globals: { theme: 'Corporate Light' }, render: () => <All width={1440} /> };
