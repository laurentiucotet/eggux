import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, userEvent, waitFor, within } from 'storybook/test';
import { BadgeList } from './badge-list';

const meta = {
  title: 'Components/Badge/Badge List',
  component: BadgeList,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'A few tags on one line with "+N" for the rest: category, status, region, format. Outline Badges for neutral labels, a status variant only when it means something; "+N" opens the rest in a Popover. Show 2-4, one or two words each. Filters people remove use Chip; a single status uses Badge or Status Dot. Figma: Badge page / Badge List. Guide: eggux build-ui/components/badge.md' } },
  },
  args: { items: ['Finance', 'Q4 2026', 'Internal', 'Ops', 'Legal'], max: 3 },
  render: args => <div className="w-[243px]"><BadgeList {...args} /></div>,
} satisfies Meta<typeof BadgeList>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();

// Figma default: 3 outline tags 20 high, 6 apart, "+2" opens Ops and Legal; Escape returns focus.
export const Default: Story = {
  play: async ({ canvas }) => {
    const list = canvas.getByRole('list', { name: 'Tags' });
    const items = within(list).getAllByRole('listitem');
    await expect(items).toHaveLength(3);
    await expect(Math.round(box(items[0]!).height)).toBe(20);
    await expect(Math.round(box(items[1]!).left - box(items[0]!).right)).toBe(6);
    const more = canvas.getByRole('button', { name: '+2 more' });
    await userEvent.click(more);
    const dialog = await screen.findByRole('dialog', { name: 'Tags' });
    await expect(within(dialog).getByText('Legal')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(more).toHaveFocus());
  },
};

// Status variants only where the label means a status; no "+N" when everything fits.
export const WithStatus: Story = {
  args: { items: [{ label: 'Overdue', variant: 'soft-destructive' }, 'Finance', 'EU'] },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('button')).toBeNull();
    await expect(canvas.getAllByRole('listitem')).toHaveLength(3);
  },
};

// Stress: at 122 wide the tags wrap; a long label truncates at 256. Tests only.
export const Stress: Story = {
  tags: ['!dev'],
  args: { items: ['Finance', 'Q4 2026', 'Internal', 'Customer success and onboarding programs worldwide', 'Ops'], max: 4 },
  render: args => (
    <div className="flex flex-col gap-4">
      <div className="w-[122px]" data-testid="narrow"><BadgeList {...args} /></div>
      <div className="w-[600px]" data-testid="wide"><BadgeList {...args} /></div>
    </div>
  ),
  play: async ({ canvas }) => {
    const narrow = within(canvas.getByTestId('narrow')).getByRole('list');
    await expect(box(narrow).height).toBeGreaterThan(40);
    const long = within(canvas.getByTestId('wide')).getByTitle(/Customer success/);
    await expect(Math.round(box(long).width)).toBeLessThanOrEqual(256);
  },
};

export const DefaultDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' } };
