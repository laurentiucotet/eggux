import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { WelcomeCard } from './welcome-card';

type Args = { title: string; description: string; eyebrow: string; primaryLabel: string; secondaryLabel: string; showEyebrow: boolean; showSecondary: boolean; showTile: boolean; width: number };

const onPrimary = fn();
const onSecondary = fn();

const meta = {
  title: 'Components/Onboarding/Welcome Card',
  parameters: {
    docs: {
      description: {
        component:
          'First-visit hero card: title, one sentence, a primary and a secondary action and a decorative gradient tile. The tile wraps above the text when the card is narrow. Show it once and let people dismiss it elsewhere; do not put it on every visit. Code only (no Figma component yet). Guide: eggux build-ui/patterns/onboarding.md',
      },
    },
  },
  args: {
    title: 'Welcome to Acme Invoicing',
    description: 'Create your first invoice in under two minutes, or take a short tour to see how everything fits together.',
    eyebrow: 'First visit',
    primaryLabel: 'Create an invoice',
    secondaryLabel: 'Take the tour',
    showEyebrow: true,
    showSecondary: true,
    showTile: true,
    width: 640,
  },
  argTypes: {
    title: { name: 'Title', control: 'text', description: 'Heading of the card.', table: { category: 'Card' } },
    description: { name: 'Description', control: 'text', description: 'One or two sentences.', table: { category: 'Card' } },
    eyebrow: { name: 'Eyebrow', control: 'text', description: 'Small label above the title.', table: { category: 'Card' } },
    primaryLabel: { name: 'Primary label', control: 'text', description: 'Label of the main action.', table: { category: 'Card' } },
    secondaryLabel: { name: 'Secondary label', control: 'text', description: 'Label of the second action.', table: { category: 'Card' } },
    width: { name: 'Width', control: { type: 'range', min: 240, max: 720, step: 4 }, description: 'Container width in px.', table: { category: 'Card' } },
    showEyebrow: { name: 'Show eyebrow', control: 'boolean', description: 'The small badge.', table: { category: 'Parts' } },
    showSecondary: { name: 'Show secondary action', control: 'boolean', description: 'The outline button.', table: { category: 'Parts' } },
    showTile: { name: 'Show tile', control: 'boolean', description: 'The decorative gradient tile.', table: { category: 'Parts' } },
  },
  render: ({ title, description, eyebrow, primaryLabel, secondaryLabel, showEyebrow, showSecondary, showTile, width }) => (
    <div style={{ width }} className="max-w-full">
      <WelcomeCard title={title} description={description} eyebrow={showEyebrow ? eyebrow : ''} primaryLabel={primaryLabel} secondaryLabel={showSecondary ? secondaryLabel : ''} showTile={showTile} />
    </div>
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <WelcomeCard onPrimary={onPrimary} onSecondary={onSecondary} />,
  play: async ({ canvas }) => {
    const region = canvas.getByRole('region', { name: 'Welcome to Acme Invoicing' });
    await expect(canvas.getByRole('heading', { level: 2, name: 'Welcome to Acme Invoicing' })).toBeVisible();
    await expect(region.querySelector('[data-slot="icon-tile"]')).toHaveAttribute('aria-hidden', 'true');
    // Tab order: primary, then secondary.
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Create an invoice' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(onPrimary).toHaveBeenCalled();
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Take the tour' })).toHaveFocus();
    await userEvent.keyboard(' ');
    await expect(onSecondary).toHaveBeenCalled();
  },
};

/** The card at a wide and a phone width: the tile moves above the text. */
export const Widths: Story = {
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="flex flex-col gap-6"><Story /></div>],
  render: () => (
    <>
      <div className="w-[640px] max-w-full"><WelcomeCard /></div>
      <div className="w-[320px] max-w-full"><WelcomeCard title="Welcome back" secondaryLabel="" eyebrow="" /></div>
    </>
  ),
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => (
    <WelcomeCard
      title="Welcome to Supercalifragilisticexpialidocious_Invoicing_Suite"
      description="A long sentence with an unbreakable_token_that_keeps_going_and_going_and_going_without_spaces that must wrap in a narrow column."
      primaryLabel="Create your very first invoice right now"
      secondaryLabel="Take the long guided tour of everything"
    />
  ),
  play: async ({ canvas }) => {
    const region = canvas.getByRole('region');
    await expect(region.scrollWidth).toBeLessThanOrEqual(region.clientWidth + 1);
    for (const b of canvas.getAllByRole('button')) {
      await expect(b.getBoundingClientRect().right).toBeLessThanOrEqual(region.getBoundingClientRect().right + 1);
    }
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
