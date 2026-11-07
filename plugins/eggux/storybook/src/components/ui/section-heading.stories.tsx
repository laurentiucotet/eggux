import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { FileText, Plus } from '@/components/icons';
import { Button } from './button';
import { SectionHeading } from './section-heading';

const meta = {
  title: 'Components/Section Heading/Section Heading',
  component: SectionHeading,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Title and description that open a section of an app or content page, or a group inside a card or form, with an optional overline and one row of actions (View all, Add, a search Input). lg (h2) for content page sections, default (h3) for app page sections, sm (h4) inside a card or panel. Icon on all sections of a page or none. Centered marketing sections use the Section Header block; card titles use Card Header. Figma: Section Heading page / Section Heading. Guide: eggux build-ui/components/content.md' } },
  },
  args: {
    title: 'Reports',
    description: 'Monthly exports of invoices, payments and taxes.',
    actions: <Button variant="outline">View all</Button>,
  },
  render: args => <div className="w-[720px]"><SectionHeading {...args} /></div>,
} satisfies Meta<typeof SectionHeading>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();

// Figma Size=default: 720 × 56, h3 32 high, description 20, the action centered on the right.
export const Default: Story = {
  play: async ({ canvas, canvasElement }) => {
    const root = canvasElement.querySelector('[data-slot="section-heading"]')!;
    await expect(Math.round(box(root).height)).toBe(56);
    await expect(canvas.getByRole('heading', { level: 3, name: 'Reports' })).toBeInTheDocument();
    const action = canvas.getByRole('button', { name: 'View all' });
    await expect(Math.round(box(action).right)).toBe(Math.round(box(root).right));
  },
};

// Sizes: lg (h2, 76 with the lead description), sm (h4, 52); all options with overline and icon (96).
export const Sizes: Story = {
  render: args => (
    <div className="flex w-[720px] flex-col gap-10">
      <SectionHeading {...args} size="lg" title="Customer stories" description="How teams get paid faster with Acme." />
      <SectionHeading {...args} title="Reports" overline="Finance" icon={<FileText />} description="Monthly exports of invoices, payments and taxes, ready for your accountant every first day of the month." actions={<><Button variant="outline">View all</Button><Button><Plus aria-hidden="true" />New report</Button></>} />
      <SectionHeading size="sm" title="Billing contact" description="Who gets invoices and payment reminders." />
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    const [lg, all, sm] = canvasElement.querySelectorAll('[data-slot="section-heading"]');
    await expect(Math.round(box(lg!).height)).toBe(76);
    await expect(Math.round(box(all!).height)).toBe(96);
    await expect(Math.round(box(sm!).height)).toBe(52);
    await expect(canvas.getByRole('heading', { level: 2 })).toHaveTextContent('Customer stories');
    await expect(canvas.getByRole('heading', { level: 4 })).toHaveTextContent('Billing contact');
  },
};

// Stress: at 276 the actions drop under the text (176 high); a long title clamps to 2 lines. Tests only.
export const Stress: Story = {
  tags: ['!dev'],
  args: {
    title: 'Integrations, webhooks and connected accounting tools for every region',
    description: 'Connect the tools your finance team already uses and keep invoices, payments and taxes in sync without exports or copy and paste.',
  },
  render: args => <div className="w-[276px]"><SectionHeading {...args} /></div>,
  play: async ({ canvas, canvasElement }) => {
    const root = canvasElement.querySelector('[data-slot="section-heading"]')!;
    const heading = canvas.getByRole('heading');
    await expect(Math.round(box(heading).height)).toBe(64);
    const action = canvas.getByRole('button', { name: 'View all' });
    await expect(box(action).top).toBeGreaterThan(box(heading).bottom);
    await expect(Math.round(box(root).height)).toBe(176);
  },
};

export const DefaultDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' } };
