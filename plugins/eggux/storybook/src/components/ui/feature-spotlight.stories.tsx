import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { Button } from './button';
import { FeatureSpotlight } from './feature-spotlight';

type Args = { title: string; description: string; showBadge: boolean; tryLabel: string; width: number };

const onTry = fn();
const onDismiss = fn();

const meta = {
  title: 'Components/Onboarding/Feature Spotlight',
  parameters: {
    docs: {
      description: {
        component:
          'An inline highlight for one new feature: "New" badge, title, short description, a primary Try it and a Dismiss. Dismiss removes the card and moves focus to the next control (or a ref you give); a polite status says it is gone. Show one spotlight at a time. Code only (no Figma component yet). Guide: eggux build-ui/patterns/onboarding.md',
      },
    },
  },
  args: { title: 'Recurring invoices', description: 'Set a schedule once and Acme sends the invoice for you every month, week or quarter.', showBadge: true, tryLabel: 'Try it', width: 480 },
  argTypes: {
    title: { name: 'Title', control: 'text', description: 'Feature name.', table: { category: 'Card' } },
    description: { name: 'Description', control: 'text', description: 'One short sentence.', table: { category: 'Card' } },
    tryLabel: { name: 'Try label', control: 'text', description: 'Label of the primary action.', table: { category: 'Card' } },
    width: { name: 'Width', control: { type: 'range', min: 240, max: 560, step: 4 }, description: 'Container width in px.', table: { category: 'Card' } },
    showBadge: { name: 'Show New badge', control: 'boolean', description: 'The New badge above the title.', table: { category: 'Parts' } },
  },
  render: ({ title, description, showBadge, tryLabel, width }) => (
    <div style={{ width }} className="flex max-w-full flex-col items-start gap-3">
      <FeatureSpotlight title={title} description={description} badgeLabel={showBadge ? 'New' : ''} tryLabel={tryLabel} />
      <Button variant="outline" size="sm">Create invoice</Button>
    </div>
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex w-[480px] max-w-full flex-col items-start gap-3">
      <Button variant="outline" size="sm">Before</Button>
      <FeatureSpotlight onTry={onTry} onDismiss={onDismiss} />
      <Button variant="outline" size="sm">After</Button>
    </div>
  ),
  play: async ({ canvas }) => {
    const region = canvas.getByRole('region', { name: 'Recurring invoices' });
    await expect(region).toBeVisible();
    await expect(canvas.getByText('New')).toBeVisible();
    canvas.getByRole('button', { name: 'Before' }).focus();
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Try it' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(onTry).toHaveBeenCalled();
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Dismiss Recurring invoices' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(canvas.queryByRole('region')).toBeNull());
    // Focus moved on to the next control, not to the page.
    await expect(canvas.getByRole('button', { name: 'After' })).toHaveFocus();
    await expect(canvas.getByRole('status')).toHaveTextContent('Recurring invoices dismissed.');
    await expect(onDismiss).toHaveBeenCalled();
  },
};

/** With and without the New badge, with another feature and icon. */
export const Variants: Story = {
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="flex w-[480px] max-w-full flex-col gap-4"><Story /></div>],
  render: () => (
    <>
      <FeatureSpotlight />
      <FeatureSpotlight badgeLabel="Beta" title="Payment links" description="Send a link and get paid by card or bank transfer." tryLabel="Create a link" />
      <FeatureSpotlight badgeLabel="" title="Shortcuts" description="Press N to start a new invoice from anywhere." tryLabel="See shortcuts" />
    </>
  ),
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => (
    <FeatureSpotlight
      title="Supercalifragilisticexpialidocious_recurring_invoices_with_a_very_long_name"
      description="A long sentence with an unbreakable_token_that_keeps_going_and_going_and_going_without_spaces that must wrap."
      tryLabel="Try the very long feature right now"
      dismissLabel="Dismiss this announcement"
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
