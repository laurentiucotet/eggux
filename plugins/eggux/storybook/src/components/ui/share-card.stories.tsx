import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { ShareCard } from './share-card';

type Args = { title: string; description: string; showDescription: boolean; showNetworks: boolean; width: number };

const url = 'https://acme.example/community/spring-meetup';

const meta = {
  title: 'Components/Community/Share Card',
  parameters: {
    docs: {
      description: {
        component:
          'A panel that offers one public link: heading, one line of help, the link in a read-only field with a Copy Button, and up to three network links that open in a new tab. Social Share is the compact row; this is the panel for a share dialog or sidebar. Code only (no Figma component yet).',
      },
    },
  },
  args: { title: 'Share this page', description: 'Anyone with the link can view it.', showDescription: true, showNetworks: true, width: 400 },
  argTypes: {
    title: { name: 'Title', control: 'text', description: 'The heading.', table: { category: 'Card' } },
    description: { name: 'Description', control: 'text', description: 'The help line.', table: { category: 'Card' } },
    width: { name: 'Width', control: { type: 'range', min: 276, max: 400, step: 4 }, description: 'Column width in px.', table: { category: 'Card' } },
    showDescription: { name: 'Show description', control: 'boolean', description: 'The help line.', table: { category: 'Parts' } },
    showNetworks: { name: 'Show networks', control: 'boolean', description: 'LinkedIn, X and Facebook links.', table: { category: 'Parts' } },
  },
  render: ({ title, description, showDescription, showNetworks, width }) => (
    <div style={{ width }}>
      <ShareCard url={url} title={title} description={showDescription ? description : ''} showNetworks={showNetworks} />
    </div>
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  render: () => <ShareCard url={url} />,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('region', { name: 'Share this page' })).toBeVisible();
    const field = canvas.getByRole('textbox', { name: 'Link' });
    await expect(field).toHaveValue(url);
    await expect(field).toHaveAttribute('readonly');
    await expect(canvas.getByRole('button', { name: 'Copy link' })).toBeVisible();
    const x = canvas.getByRole('link', { name: /X \(opens in a new tab\)/ });
    await expect(x).toHaveAttribute('target', '_blank');
    await expect(x.getAttribute('href')).toContain(encodeURIComponent(url));
    await expect(canvas.getAllByRole('link')).toHaveLength(3);
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => (
    <ShareCard
      url="https://acme.example/community/events/2026/spring-meetup-for-finance-operations-teams?utm_source=newsletter&utm_campaign=march"
      title="Share the spring meetup for finance operations teams in Central Europe"
    />
  ),
  play: async ({ canvas }) => {
    const card = canvas.getByRole('region');
    await expect(card.scrollWidth).toBeLessThanOrEqual(card.clientWidth + 1);
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
