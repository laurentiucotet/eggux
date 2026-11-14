import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { TeamGrid, type TeamMember } from './team-grid';

type Args = { heading: string; intro: string; showIntro: boolean; layout: 'vertical' | 'horizontal'; count: number; showLinks: boolean; width: number };

const links = (name: string) => [
  { kind: 'email' as const, href: `mailto:${name.split(' ')[0].toLowerCase()}@acme.example` },
  { kind: 'profile' as const, href: `#profile-${name.split(' ')[0].toLowerCase()}` },
  { kind: 'website' as const, href: `#site-${name.split(' ')[0].toLowerCase()}` },
];
const people: Omit<TeamMember, 'links'>[] = [
  { name: 'Maria Ionescu', role: 'Co-founder and CEO' },
  { name: 'Tom Becker', role: 'Head of Engineering' },
  { name: 'Aisha Rahman', role: 'Product Design Lead' },
  { name: 'Jonas Lindqvist', role: 'Customer Success' },
  { name: 'Elena Petrova', role: 'Finance and Operations' },
  { name: 'Diego Alvarez', role: 'Security Engineer' },
];
const members = (count: number, showLinks: boolean): TeamMember[] => people.slice(0, count).map(p => ({ ...p, links: showLinks ? links(p.name) : undefined }));

const meta = {
  title: 'Components/Marketing/Team Grid',
  parameters: {
    docs: {
      description: {
        component:
          'A heading and a grid of Person Cards: avatar, name, role and a row of icon links. Cards share one height per row and the links stay at the bottom. Built on Person Card. Code only (no Figma component yet).',
      },
    },
  },
  args: { heading: 'Meet the team', intro: 'Thirty people in four countries, building the quiet part of finance.', showIntro: true, layout: 'vertical', count: 6, showLinks: true, width: 880 },
  argTypes: {
    heading: { name: 'Heading', control: 'text', description: 'Section heading.', table: { category: 'Team Grid' } },
    intro: { name: 'Intro', control: 'text', description: 'One line under the heading.', table: { category: 'Team Grid' } },
    layout: { name: 'Layout', control: 'inline-radio', options: ['vertical', 'horizontal'], description: 'Card layout: avatar above, or beside the text.', table: { category: 'Team Grid' } },
    count: { name: 'People', control: { type: 'range', min: 1, max: 6, step: 1 }, description: 'How many people.', table: { category: 'Team Grid' } },
    width: { name: 'Width', control: { type: 'range', min: 276, max: 1040, step: 4 }, description: 'Container width in px.', table: { category: 'Team Grid' } },
    showIntro: { name: 'Show intro', control: 'boolean', description: 'The intro line.', table: { category: 'Parts' } },
    showLinks: { name: 'Show links', control: 'boolean', description: 'Email, profile and website icon links.', table: { category: 'Parts' } },
  },
  render: ({ heading, intro, showIntro, layout, count, showLinks, width }) => (
    <div style={{ width, maxWidth: '100%' }}>
      <TeamGrid heading={heading} intro={showIntro ? intro : undefined} layout={layout} members={members(count, showLinks)} />
    </div>
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <TeamGrid members={members(4, true)} />,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('region', { name: 'Meet the team' })).toBeVisible();
    await expect(canvas.getAllByRole('article')).toHaveLength(4);
    await expect(canvas.getByRole('heading', { name: 'Tom Becker', level: 3 })).toBeVisible();
    await expect(canvas.getByText('Head of Engineering')).toBeVisible();
    await expect(canvas.getByRole('link', { name: 'Maria Ionescu: email' })).toHaveAttribute('href', 'mailto:maria@acme.example');
    await expect(canvas.getAllByRole('link')).toHaveLength(12);
    // Equal heights in a row.
    const heights = canvas.getAllByRole('article').map(a => Math.round(a.getBoundingClientRect().height));
    await expect(new Set(heights).size).toBe(1);
    const first = canvas.getByRole('link', { name: 'Aisha Rahman: email' });
    first.focus();
    await expect(first).toHaveFocus();
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => (
    <TeamGrid
      heading="The people behind the quiet part of finance for companies of every size"
      members={[
        { name: 'Alexandra Constantinopolous-Featherstonehaugh', role: 'Senior Vice President of Group Financial Planning and Analysis', links: links('Alexandra Constantinopolous-Featherstonehaugh') },
        { name: 'Li', role: 'CTO', links: links('Li') },
        { name: 'Noor Hassan', role: 'Design', links: [] },
      ]}
    />
  ),
  play: async ({ canvas }) => {
    const region = canvas.getByRole('region');
    await expect(region.scrollWidth).toBeLessThanOrEqual(region.clientWidth + 1);
    await expect(canvas.getAllByRole('article')).toHaveLength(3);
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
