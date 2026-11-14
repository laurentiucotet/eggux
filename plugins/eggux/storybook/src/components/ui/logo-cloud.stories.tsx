import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { LogoCloud } from './logo-cloud';

type Args = { heading: string; layout: 'grid' | 'row'; tone: 'grayscale' | 'brand'; count: number; linked: boolean; width: number };

const names = ['Acme Ledger', 'Northwind', 'Bluebird Foods', 'Harbor & Co', 'Fieldstone', 'Kestrel Labs', 'Oakline', 'Summit Freight'];
const logos = (count: number, linked = false) => names.slice(0, count).map(name => ({ name, href: linked ? `#story-${name.toLowerCase().replace(/\W+/g, '-')}` : undefined }));

const meta = {
  title: 'Components/Marketing/Logo Cloud',
  parameters: {
    docs: {
      description: {
        component:
          'A "trusted by" strip: a heading and customer logos drawn as text marks in a grid or one wrapping row, in grayscale or the brand color. Logos can link to a customer story. Replace the drawn marks with real SVG logos in a product. Code only (no Figma component yet).',
      },
    },
  },
  args: { heading: 'Trusted by finance teams at', layout: 'grid', tone: 'grayscale', count: 6, linked: false, width: 720 },
  argTypes: {
    heading: { name: 'Heading', control: 'text', description: 'Line above the logos. Empty hides it.', table: { category: 'Logo Cloud' } },
    layout: { name: 'Layout', control: 'inline-radio', options: ['grid', 'row'], description: 'Equal cells, or one centered wrapping row.', table: { category: 'Logo Cloud' } },
    tone: { name: 'Tone', control: 'inline-radio', options: ['grayscale', 'brand'], description: 'Muted marks, or the brand text color.', table: { category: 'Logo Cloud' } },
    width: { name: 'Width', control: { type: 'range', min: 276, max: 960, step: 4 }, description: 'Container width in px.', table: { category: 'Logo Cloud' } },
    count: { name: 'Logos', control: { type: 'range', min: 3, max: 8, step: 1 }, description: 'How many logos.', table: { category: 'Parts' } },
    linked: { name: 'Link to stories', control: 'boolean', description: 'Each logo links to a customer story.', table: { category: 'Parts' } },
  },
  render: ({ heading, layout, tone, count, linked, width }) => (
    <div style={{ width, maxWidth: '100%' }}>
      <LogoCloud heading={heading} layout={layout} tone={tone} logos={logos(count, linked)} />
    </div>
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** One wrapping row in the brand color, each logo a link. */
export const BrandRow: Story = { args: { layout: 'row', tone: 'brand', linked: true } };

export const DefaultCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <LogoCloud logos={logos(5, true)} />,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('region', { name: 'Trusted by finance teams at' })).toBeVisible();
    await expect(canvas.getAllByRole('listitem')).toHaveLength(5);
    const link = canvas.getByRole('link', { name: 'Northwind' });
    await expect(link).toHaveAttribute('href', '#story-northwind');
    await link.focus();
    await expect(link).toHaveFocus();
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => (
    <LogoCloud
      heading="Trusted by finance, operations and procurement teams at companies of every size"
      logos={[{ name: 'The International Association of Municipal Treasury Officers' }, { name: 'Acme' }, { name: 'Northwind Traders of Central Europe' }]}
    />
  ),
  play: async ({ canvas }) => {
    const region = canvas.getByRole('region');
    await expect(region.scrollWidth).toBeLessThanOrEqual(region.clientWidth + 1);
    for (const li of canvas.getAllByRole('listitem')) await expect(li.scrollWidth).toBeLessThanOrEqual(li.clientWidth + 1);
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
