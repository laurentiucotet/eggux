import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { OrgChart, type OrgNode } from './org-chart';

type Args = { startWith: 'All open' | 'Top level only' | 'All closed'; showControls: boolean; width: number };

const people: OrgNode[] = [
  {
    id: 'elena',
    name: 'Elena Marin',
    role: 'Chief Executive',
    reports: [
      {
        id: 'ion',
        name: 'Ion Vasile',
        role: 'Chief Technology Officer',
        reports: [
          { id: 'ana', name: 'Ana Popescu', role: 'Engineering Manager', reports: [{ id: 'dev1', name: 'Mihai Dumitru', role: 'Software Engineer' }, { id: 'dev2', name: 'Sara Neagu', role: 'Software Engineer' }] },
          { id: 'dan', name: 'Dan Stoica', role: 'Security Lead' },
        ],
      },
      { id: 'maria', name: 'Maria Ionescu', role: 'Chief Financial Officer', reports: [{ id: 'cris', name: 'Cristina Radu', role: 'Accountant' }] },
      { id: 'radu', name: 'Radu Barbu', role: 'Head of Operations' },
    ],
  },
];

const starts: Record<Args['startWith'], string[] | 'all'> = { 'All open': 'all', 'Top level only': ['elena'], 'All closed': [] };

const meta = {
  title: 'Components/Data Structures/Org Chart',
  parameters: {
    docs: {
      description: {
        component:
          'A reporting tree of person cards (avatar, name, role, number of direct reports) joined by lines. Each manager expands and collapses; Expand all and Collapse all sit above. ARIA tree: Up, Down, Left, Right, Home, End and Enter. Vertical, so it works from 276 px. Code only (no Figma component yet).',
      },
    },
  },
  args: { startWith: 'All open', showControls: true, width: 520 },
  argTypes: {
    startWith: { name: 'Start with', control: 'inline-radio', options: ['All open', 'Top level only', 'All closed'], description: 'Which managers start expanded.', table: { category: 'Chart' } },
    showControls: { name: 'Show expand controls', control: 'boolean', description: 'The Expand all and Collapse all buttons.', table: { category: 'Chart' } },
    width: { name: 'Width', control: { type: 'range', min: 240, max: 800, step: 4 }, description: 'Container width in px.', table: { category: 'Chart' } },
  },
  render: ({ startWith, showControls, width }) => (
    <div style={{ width }} className="max-w-full">
      <OrgChart key={startWith} nodes={people} defaultExpanded={starts[startWith]} showControls={showControls} onSelect={fn()} />
    </div>
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Everything closed except the top: the first look at a large company. */
export const TopLevelOnly: Story = { args: { startWith: 'Top level only' }, parameters: { controls: { disable: true } } };

export const DefaultCheck: Story = {
  tags: ['!dev'],
  render: function Render() {
    const [picked, setPicked] = React.useState('none');
    return (
      <>
        <OrgChart nodes={people} onSelect={n => setPicked(n.id)} />
        <p data-testid="picked">{picked}</p>
      </>
    );
  },
  play: async ({ canvas }) => {
    const tree = canvas.getByRole('tree', { name: 'Organization chart' });
    await expect(canvas.getByRole('status')).toHaveTextContent('9 people');
    const ion = canvas.getByRole('treeitem', { name: /Ion Vasile/ });
    await expect(ion).toHaveAttribute('aria-level', '2');
    await expect(ion).toHaveAttribute('aria-expanded', 'true');
    await expect(ion).toHaveAttribute('aria-posinset', '1');
    await expect(ion).toHaveAttribute('aria-setsize', '3');
    await expect(ion).toHaveAccessibleName('Ion Vasile, Chief Technology Officer, 2 reports');
    await expect(tree.querySelectorAll('[role="treeitem"][tabindex="0"]')).toHaveLength(1);
    // Keyboard path. Tab lands on the first person.
    await userEvent.tab(); // Collapse all (Expand all is disabled)
    await userEvent.tab();
    const elena = canvas.getByRole('treeitem', { name: /Elena Marin/ });
    await waitFor(() => expect(elena).toHaveFocus());
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(ion).toHaveFocus());
    await userEvent.keyboard('{ArrowDown}');
    const ana = canvas.getByRole('treeitem', { name: /Ana Popescu/ });
    await waitFor(() => expect(ana).toHaveFocus());
    // Left collapses an open node, Right opens it again, Right again goes to the first report.
    await userEvent.keyboard('{ArrowLeft}');
    await waitFor(() => expect(ana).toHaveAttribute('aria-expanded', 'false'));
    await expect(canvas.queryByRole('treeitem', { name: /Mihai Dumitru/ })).toBeNull();
    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => expect(ana).toHaveAttribute('aria-expanded', 'true'));
    await userEvent.keyboard('{ArrowRight}');
    const mihai = await canvas.findByRole('treeitem', { name: /Mihai Dumitru/ });
    await waitFor(() => expect(mihai).toHaveFocus());
    // Left on a person without reports goes to the manager.
    await userEvent.keyboard('{ArrowLeft}');
    await waitFor(() => expect(ana).toHaveFocus());
    await userEvent.keyboard('{End}');
    await waitFor(() => expect(canvas.getByRole('treeitem', { name: /Radu Barbu/ })).toHaveFocus());
    await userEvent.keyboard('{Home}');
    await waitFor(() => expect(elena).toHaveFocus());
    // Enter toggles and picks.
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(ion).toHaveAttribute('aria-expanded', 'false'));
    await expect(canvas.getByTestId('picked')).toHaveTextContent('ion');
    // The buttons do the same without a pointer on the chevron.
    await userEvent.click(canvas.getByRole('button', { name: 'Collapse all' }));
    await waitFor(() => expect(canvas.getAllByRole('treeitem')).toHaveLength(1));
    await expect(canvas.getByRole('button', { name: 'Collapse all' })).toBeDisabled();
    await userEvent.click(canvas.getByRole('button', { name: 'Expand all' }));
    await waitFor(() => expect(canvas.getAllByRole('treeitem')).toHaveLength(9));
  },
};

export const ChevronCheck: Story = {
  tags: ['!dev'],
  render: () => <OrgChart nodes={people} defaultExpanded={['elena']} />,
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getAllByRole('treeitem')).toHaveLength(4);
    const maria = canvas.getByRole('treeitem', { name: /Maria Ionescu/ });
    await expect(maria).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(maria.querySelector('[data-slot="org-chevron"]')!);
    await waitFor(() => expect(maria).toHaveAttribute('aria-expanded', 'true'));
    await expect(canvas.getByRole('treeitem', { name: /Cristina Radu/ })).toHaveAttribute('aria-level', '3');
    // A person without reports has no expanded state and no count.
    const radu = canvas.getByRole('treeitem', { name: /Radu Barbu/ });
    await expect(radu).not.toHaveAttribute('aria-expanded');
    await expect(within(canvasElement).getAllByText(/^\d+ reports?$/)).toHaveLength(3);
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => (
    <OrgChart
      nodes={[
        {
          id: 'a',
          name: 'Alexandra Constantinescu-Popescu',
          role: 'Senior Vice President of Global Customer Success and Partnerships',
          reports: [{ id: 'b', name: 'Bartholomew Wolfeschlegelsteinhausenbergerdorff', role: 'Regional Director', reports: [{ id: 'c', name: 'Cy', role: 'QA' }] }],
        },
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector<HTMLElement>('[data-slot="org-chart"]')!;
    await expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth + 1);
    for (const card of canvasElement.querySelectorAll<HTMLElement>('[data-slot="org-card"]')) {
      await expect(card.scrollWidth).toBeLessThanOrEqual(card.clientWidth + 1);
    }
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
