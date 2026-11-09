import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { ChartColumn, ShieldCheck, Users } from '@/components/icons';
import { Button } from './button';
import { FeatureItem } from './feature-item';

const meta = {
  title: 'Components/Feature Item/Feature Item',
  component: FeatureItem,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'One benefit, capability or step: Icon Tile or step number, a short title, one or two lines of text, an optional link. Layout stacked in grids of 3 or 4, inline in two-column lists, centered under a centered Section Heading, card on muted sections or when each item links to its own page. Same Layout and tile Style across a grid. Plan feature lists use Check Item; numbers use Figure. Figma: Feature Item page / Feature Item. Guide: eggux build-ui/patterns/marketing-pages.md' } },
  },
  args: { title: 'Approvals in one place', description: 'Route each invoice to the right person and see who approved what, and when.' },
  render: args => <div className="w-[352px]"><FeatureItem {...args} /></div>,
} satisfies Meta<typeof FeatureItem>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();

// Figma Layout=stacked, Marker=icon: 352 × 124, tile 40, title an h3.
export const Default: Story = {
  play: async ({ canvas, canvasElement }) => {
    const item = canvasElement.querySelector('[data-slot="feature-item"]')!;
    await expect(Math.round(box(item).height)).toBe(124);
    await expect(Math.round(box(item.querySelector('[data-slot="icon-tile"]')!).width)).toBe(40);
    await expect(canvas.getByRole('heading', { level: 3, name: 'Approvals in one place' })).toBeInTheDocument();
  },
};

// All four layouts with icons; the card has a link.
export const Layouts: Story = {
  render: args => (
    <div className="grid w-[736px] grid-cols-2 items-start gap-8">
      <FeatureItem {...args} layout="stacked" />
      <FeatureItem {...args} layout="inline" icon={<Users />} />
      <FeatureItem {...args} layout="centered" icon={<ChartColumn />} />
      <FeatureItem {...args} layout="card" icon={<ShieldCheck />} link={<Button variant="link" className="px-0" asChild><a href="#approvals">Learn about approvals</a></Button>} />
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    const [, inline, centered, card] = canvasElement.querySelectorAll<HTMLElement>('[data-slot="feature-item"]');
    await expect(Math.round(box(inline!).height)).toBe(72);
    await expect(getComputedStyle(centered!).textAlign).toBe('center');
    await expect(getComputedStyle(card!).paddingTop).toBe('24px');
    await expect(canvas.getByRole('link', { name: 'Learn about approvals' })).toBeInTheDocument();
  },
};

// Marker=number for "How it works": 3 steps; the number reads as "Step 1".
export const Steps: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <ol className="m-0 grid w-[1088px] list-none grid-cols-3 gap-8 p-0">
      <li><FeatureItem number={1} title="Connect your bank" description="Link accounts in a few clicks; we read payments every hour." /></li>
      <li><FeatureItem number={2} title="Send invoices" description="Create, send and track invoices from one list." /></li>
      <li><FeatureItem number={3} title="Get paid" description="Reminders go out on their own until the invoice is paid." /></li>
    </ol>
  ),
  play: async ({ canvasElement }) => {
    const marker = canvasElement.querySelector('[data-slot="feature-item-number"]')!;
    await expect(Math.round(box(marker).width)).toBe(40);
    await expect(marker).toHaveTextContent('Step 1');
  },
};

// Stress: at 276 (1/4 column) long text wraps; title and description never overflow. Tests only.
export const Stress: Story = {
  tags: ['!dev'],
  args: { title: 'Approvals, audit trails and reminders in one place', description: 'Route each invoice to the right person, see who approved what and when, and send reminders automatically.' },
  render: args => <div className="w-[276px]"><FeatureItem {...args} layout="card" /></div>,
  play: async ({ canvasElement }) => {
    const item = canvasElement.querySelector<HTMLElement>('[data-slot="feature-item"]')!;
    await expect(Math.round(box(item).width)).toBe(276);
    await expect(item.scrollWidth).toBeLessThanOrEqual(item.clientWidth);
  },
};

export const DefaultDark: Story = { parameters: { controls: { disable: true } }, tags: ['!dev'], globals: { theme: 'Dark' }, render: Layouts.render };
export const DefaultCorporate: Story = { parameters: { controls: { disable: true } }, tags: ['!dev'], globals: { theme: 'Corporate Light' }, render: Layouts.render };
