import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Team, TeamCardsSocial, TeamGrid, TeamList } from './section-team';

const meta = {
  title: 'Blocks/Sections/Team',
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'Who works here. Team: Bylines for a compact team row. Team Grid: square photos for the company page. Team List: leadership and investors with one line of bio. Team Cards Social: 4 or 8 photo Person Cards with LinkedIn, X, GitHub and mail links, for about and careers pages. Real photos or initials, name and role. Figma: BLOCKS / Sections (Team). Guide: eggux build-ui/patterns/marketing-pages.md' } },
  },
} satisfies Meta;
export default meta;

const cat = (category: string) => ({ table: { category } });
const text = (name: string, description: string, category = 'Content') => ({ name, control: 'text' as const, description, ...cat(category) });
const bool = (name: string, description: string, category = 'Content') => ({ name, control: 'boolean' as const, description, ...cat(category) });

type HeaderArgs = { overline: string; title: string; description: string };
const headerArgTypes = {
  overline: text('Overline', 'Section Header overline.', 'Section Header'),
  title: text('Title', 'Section Header title: says the answer, not the topic.', 'Section Header'),
  description: text('Description', 'Section Header description.', 'Section Header'),
};

export const Default: StoryObj<HeaderArgs> = {
  name: 'Team',
  args: { overline: 'Team', title: 'The people behind Acme', description: 'Designers, engineers and support, spread across six countries.' },
  argTypes: headerArgTypes,
  render: a => <Team header={a} />,
};

export const Grid: StoryObj<HeaderArgs> = {
  name: 'Team Grid',
  args: { overline: 'Team', title: 'The people behind Acme', description: 'Engineers, designers and finance experts in Bucharest, Berlin and London.' },
  argTypes: headerArgTypes,
  render: a => <TeamGrid header={a} />,
};

type ListArgs = HeaderArgs & { showAction: boolean; actionLabel: string };
export const List: StoryObj<ListArgs> = {
  name: 'Team List',
  args: { overline: 'Leadership', title: 'Who runs Acme', description: 'Our leadership team brings experience from finance, enterprise software and security.', showAction: true, actionLabel: 'Join the team' },
  argTypes: {
    overline: text('Overline', 'Short label above the title.'),
    title: text('Title', 'Section title (h2).'),
    description: text('Description', 'One or two sentences.'),
    showAction: bool('Show action', 'The outline button under the intro.'),
    actionLabel: text('Action label', 'Where it goes.'),
  },
  render: a => <TeamList overline={a.overline} title={a.title} description={a.description} action={a.showAction ? { label: a.actionLabel, href: '#careers' } : undefined} />,
};

type SocialArgs = HeaderArgs & { showHiring: boolean; hiringText: string; hiringLabel: string };
export const CardsSocial: StoryObj<SocialArgs> = {
  name: 'Team Cards Social',
  args: {
    overline: 'Our team',
    title: 'The people behind Acme',
    description: 'A team of 140 across Bucharest, Berlin and London. Say hello on LinkedIn or follow what we ship.',
    showHiring: true,
    hiringText: 'We are hiring in Bucharest, Berlin and London.',
    hiringLabel: 'See 6 open roles',
  },
  argTypes: {
    ...headerArgTypes,
    showHiring: bool('Show hiring line', 'The line under the cards with a link to open roles.'),
    hiringText: text('Hiring text', 'Where you hire.'),
    hiringLabel: text('Hiring link', 'How many roles are open.'),
  },
  render: a => (
    <TeamCardsSocial
      header={{ overline: a.overline, title: a.title, description: a.description }}
      hiring={a.showHiring ? { text: a.hiringText, label: a.hiringLabel, href: '#careers' } : undefined}
    />
  ),
};

/* Hidden checks */

const box = (el: Element) => el.getBoundingClientRect();
const r = (n: number) => Math.round(n);
const tops = (els: Element[]) => new Set(els.map(e => r(box(e).top))).size;
const slot = (root: Element, name: string) => root.querySelector(`[data-slot="${name}"]`)!;
const items = (root: Element, sel: string) => [...root.querySelectorAll(sel)];

const All = ({ width }: { width: number }) => (
  <div className="flex flex-col" style={{ width }}>
    <Team />
    <TeamGrid header={{ overline: 'Team', title: 'Our leadership and leads', description: 'Engineers, designers and finance experts in Bucharest, Berlin and London.' }} />
    <TeamList />
    <TeamCardsSocial header={{ overline: 'Our team', title: 'Say hello to the team', description: 'A team of 140 across Bucharest, Berlin and London.' }} />
  </div>
);

async function common(root: HTMLElement, width: number) {
  const c = within(root);
  await expect(root.querySelectorAll('h1')).toHaveLength(0);
  const regions = c.getAllByRole('region');
  await expect(regions).toHaveLength(4);
  for (const s of regions) {
    await expect(s).toHaveAccessibleName();
    await expect(s.scrollWidth).toBeLessThanOrEqual(width);
  }
  await expect(c.getAllByRole('heading', { level: 2 })).toHaveLength(4);
  for (const el of [...c.queryAllByRole('link'), ...c.queryAllByRole('button')]) await expect(el).toHaveAccessibleName();
  for (const img of root.querySelectorAll('img')) await expect(img).toHaveAttribute('alt');
  await expect((root.firstElementChild as HTMLElement).scrollWidth).toBeLessThanOrEqual(width);
}

export const Check1440: StoryObj = {
  tags: ['!dev'],
  render: () => <All width={1440} />,
  play: async ({ canvasElement }) => {
    await common(canvasElement, 1440);
    const c = within(canvasElement);
    // Team: 96 padding, header 48 above, 4 columns of 264 (32 gap), 2 rows 48 apart.
    const team = c.getByRole('region', { name: 'The people behind Acme' });
    const list = slot(team, 'team-members');
    await expect(r(box(slot(team, 'section-header')).top - box(team).top)).toBe(96);
    await expect(r(box(list).top - box(slot(team, 'section-header')).bottom)).toBe(48);
    await expect(r(box(list).width)).toBe(1152);
    const cells = items(list, ':scope > li');
    await expect(r(box(cells[0]!).width)).toBe(264);
    await expect(tops(cells)).toBe(2);
    await expect(r(box(cells[4]!).top - box(cells[0]!).bottom)).toBe(48);
    await expect(items(team, '[data-slot="byline"]')).toHaveLength(8);
    // Team Grid: 270 squares, 24 apart, 4 per row, rows 40 apart, member 332 high.
    const grid = c.getByRole('region', { name: 'Our leadership and leads' });
    const members = items(grid, '[data-slot="team-member"]');
    await expect(tops(members)).toBe(2);
    await expect(r(box(members[0]!).width)).toBe(270);
    await expect(r(box(slot(members[0]!, 'image-placeholder')).height)).toBe(270);
    await expect(r(box(members[1]!).left - box(members[0]!).right)).toBe(24);
    await expect(r(box(members[4]!).top - box(members[0]!).bottom)).toBe(40);
    await expect(c.getAllByRole('heading', { level: 3, name: 'Elena Popa' }).length).toBeGreaterThan(0);
    // Team List: intro 360, people 64 to the right, rows with dividers.
    const tl = c.getByRole('region', { name: 'Who runs Acme' });
    const intro = slot(tl, 'team-list-intro');
    const people = slot(tl, 'team-list-people');
    await expect(r(box(intro).width)).toBe(360);
    await expect(r(box(people).left - box(intro).right)).toBe(64);
    await expect(r(box(people).width)).toBe(728);
    await expect(items(tl, '[data-slot="team-list-person"]')).toHaveLength(4);
    await expect(within(tl).getByRole('link', { name: 'Join the team' })).toHaveAttribute('href', '#careers');
    // Team Cards Social: four 270 cards in a row, social links named, hiring line 48 below.
    const social = c.getByRole('region', { name: 'Say hello to the team' });
    const cards = items(social, '[data-slot="person-card"]');
    await expect(cards).toHaveLength(4);
    await expect(tops(cards)).toBe(1);
    await expect(r(box(cards[0]!).width)).toBe(270);
    await expect(r(box(cards[1]!).left - box(cards[0]!).right)).toBe(24);
    await expect(r(box(slot(cards[0]!, 'image-placeholder')).height)).toBe(338);
    const s = within(social);
    await expect(s.getByRole('link', { name: 'Elena Popa on LinkedIn (opens in a new tab)' })).toHaveAttribute('target', '_blank');
    await expect(s.getByRole('link', { name: 'Email Elena Popa' })).toHaveAttribute('href', 'mailto:elena@acme.example');
    await expect(r(box(slot(social, 'team-hiring')).top - box(slot(social, 'team-members')).bottom)).toBe(48);
    await expect(s.getByRole('link', { name: 'See 6 open roles' })).toBeVisible();
  },
};

export const Check768: StoryObj = {
  tags: ['!dev'],
  render: () => <All width={768} />,
  play: async ({ canvasElement }) => {
    await common(canvasElement, 768);
    const c = within(canvasElement);
    // 2 per row; Team List stacks; 32 px gutters.
    const team = c.getByRole('region', { name: 'The people behind Acme' });
    await expect(tops(items(slot(team, 'team-members'), ':scope > li'))).toBe(4);
    await expect(r(box(slot(team, 'team-members')).left - box(team).left)).toBe(32);
    await expect(tops(items(c.getByRole('region', { name: 'Our leadership and leads' }), '[data-slot="team-member"]'))).toBe(4);
    const tl = c.getByRole('region', { name: 'Who runs Acme' });
    await expect(box(slot(tl, 'team-list-people')).top).toBeGreaterThan(box(slot(tl, 'team-list-intro')).bottom);
    await expect(tops(items(c.getByRole('region', { name: 'Say hello to the team' }), '[data-slot="person-card"]'))).toBe(2);
  },
};

export const Check390: StoryObj = {
  tags: ['!dev'],
  render: () => <All width={390} />,
  play: async ({ canvasElement }) => {
    await common(canvasElement, 390);
    const c = within(canvasElement);
    // One per row with 24 px gutters.
    const team = c.getByRole('region', { name: 'The people behind Acme' });
    await expect(tops(items(slot(team, 'team-members'), ':scope > li'))).toBe(8);
    await expect(r(box(slot(team, 'team-members')).left - box(team).left)).toBe(24);
    await expect(tops(items(c.getByRole('region', { name: 'Our leadership and leads' }), '[data-slot="team-member"]'))).toBe(8);
    await expect(tops(items(c.getByRole('region', { name: 'Say hello to the team' }), '[data-slot="person-card"]'))).toBe(4);
  },
};

export const AllDark: StoryObj = { tags: ['!dev'], globals: { theme: 'Dark' }, render: () => <All width={1440} /> };
export const AllBackOffice: StoryObj = { tags: ['!dev'], globals: { theme: 'Corporate Light' }, render: () => <All width={1440} /> };
