import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { Chip } from './chip';
import { ChipGroup } from './chip-group';

const industries = ['All', 'Retail', 'Manufacturing', 'Healthcare', 'Logistics'];
const chips = industries.map(i => <Chip key={i} value={i} label={i} />);

const meta = {
  title: 'Components/Chip/Chip Group',
  component: ChipGroup,
  parameters: {
    docs: { description: { component: 'A set of Chips of one Size that wraps (8 px gaps) or scrolls sideways on one line, with "+N more" at the end. Single select is a radiogroup (arrow keys), multi select a group of toggle buttons. Show 4 to 8 chips, All first. Figma: Chip page / Chip Group. Guide: eggux build-ui/components/badge.md, patterns/search-and-filter.md' } },
  },
  argTypes: { layout: { control: 'inline-radio', options: ['wrap', 'scroll'] } },
  args: {
    'aria-label': 'Industries',
    type: 'single',
    defaultValue: 'All',
    onValueChange: fn(),
    showMore: true,
    moreLabel: '+3 more',
    moreAccessibleLabel: 'Show 3 more industries',
    onMoreClick: fn(),
    children: chips,
  },
  decorators: [Story => <div className="w-[480px]"><Story /></div>],
} satisfies Meta<typeof ChipGroup>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();

// Figma Layout=wrap, single select: a radiogroup, 8 px gaps, +N at the end of the first row.
export const Default: Story = {
  play: async ({ canvas, args }) => {
    const group = canvas.getByRole('radiogroup', { name: 'Industries' });
    const radios = canvas.getAllByRole('radio');
    await expect(radios).toHaveLength(5);
    await expect(radios[0]).toHaveAttribute('aria-checked', 'true');
    await expect(Math.round(box(radios[1]!.parentElement!).left - box(radios[0]!.parentElement!).right)).toBe(8);
    await userEvent.click(canvas.getByRole('radio', { name: 'Healthcare' }));
    await expect(canvas.getByRole('radio', { name: 'Healthcare' })).toHaveAttribute('aria-checked', 'true');
    await expect(radios[0]).toHaveAttribute('aria-checked', 'false');
    await expect(args.onValueChange).toHaveBeenCalledWith(['Healthcare']);
    // Clicking the checked chip keeps it checked (radio behavior).
    await userEvent.click(canvas.getByRole('radio', { name: 'Healthcare' }));
    await expect(canvas.getByRole('radio', { name: 'Healthcare' })).toHaveAttribute('aria-checked', 'true');
    const more = canvas.getByRole('button', { name: 'Show 3 more industries' });
    await expect(Math.round(box(more.closest('[data-slot="chip"]')!).top)).toBe(Math.round(box(group).top));
    await userEvent.click(more);
    await expect(args.onMoreClick).toHaveBeenCalledTimes(1);
  },
};

// Keyboard: one Tab stop on the checked radio, arrows move and select, Tab leaves to +N.
export const Keyboard: Story = {
  play: async ({ canvas }) => {
    await userEvent.tab();
    await expect(canvas.getByRole('radio', { name: 'All' })).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('radio', { name: 'Retail' })).toHaveFocus();
    await expect(canvas.getByRole('radio', { name: 'Retail' })).toHaveAttribute('aria-checked', 'true');
    await userEvent.keyboard('{ArrowLeft}{ArrowLeft}');
    await expect(canvas.getByRole('radio', { name: 'Logistics' })).toHaveFocus();
    await userEvent.keyboard('{Home}');
    await expect(canvas.getByRole('radio', { name: 'All' })).toHaveAttribute('aria-checked', 'true');
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Show 3 more industries' })).toHaveFocus();
    await userEvent.tab({ shift: true });
    await expect(canvas.getByRole('radio', { name: 'All' })).toHaveFocus();
  },
};

// Multi select: a group of toggle buttons with aria-pressed, each its own Tab stop.
export const MultiSelect: Story = {
  args: { type: 'multiple', defaultValue: ['Retail'], 'aria-label': 'Industries (any)' },
  play: async ({ canvas, args }) => {
    await expect(canvas.getByRole('group', { name: 'Industries (any)' })).toBeVisible();
    await expect(canvas.queryAllByRole('radio')).toHaveLength(0);
    await expect(canvas.getByRole('button', { name: 'Retail' })).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(canvas.getByRole('button', { name: 'Logistics' }));
    await expect(args.onValueChange).toHaveBeenLastCalledWith(['Retail', 'Logistics']);
    await userEvent.click(canvas.getByRole('button', { name: 'Retail' }));
    await expect(canvas.getByRole('button', { name: 'Retail' })).toHaveAttribute('aria-pressed', 'false');
    await expect(args.onValueChange).toHaveBeenLastCalledWith(['Logistics']);
    // Each chip is its own Tab stop.
    (document.activeElement as HTMLElement).blur();
    await userEvent.tab();
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Retail' })).toHaveFocus();
  },
};

// Layout=scroll: one 32 px line that scrolls sideways; a chip past the edge is cut; focus scrolls it in.
export const Scroll: Story = {
  args: { layout: 'scroll', children: [...chips, <Chip key="e" value="Education" label="Education" />, <Chip key="f" value="Finance" label="Finance" />] },
  play: async ({ canvas, canvasElement }) => {
    const row = canvasElement.querySelector('[data-slot="chip-group-chips"]')!;
    await expect(Math.round(box(row).height)).toBe(32);
    await expect(row.scrollWidth).toBeGreaterThan(row.clientWidth);
    await expect(Math.round(box(canvasElement.querySelector('[data-slot="chip-group"]')!).width)).toBe(480);
    canvas.getByRole('radio', { name: 'All' }).focus();
    await userEvent.keyboard('{End}');
    await expect(canvas.getByRole('radio', { name: 'Finance' })).toHaveFocus();
    await expect(row.scrollLeft).toBeGreaterThan(0);
  },
};

// Stress: narrow (276 and the 160 minimum), many chips wrap and keep one Size; long labels truncate.
export const Stress: Story = {
  tags: ['!dev'],
  decorators: [Story => <div className="flex flex-col gap-6"><Story /></div>],
  render: args => (
    <>
      <div className="w-[276px]"><ChipGroup {...args} data-testid="narrow" /></div>
      <div className="w-[160px]">
        <ChipGroup {...args} type="multiple" defaultValue={[]} size="sm" showMore={false} data-testid="min" aria-label="Regions">
          <Chip value="emea" label="Europe, the Middle East and Africa" />
          <Chip value="apac" label="Asia Pacific" />
        </ChipGroup>
      </div>
    </>
  ),
  play: async ({ canvas }) => {
    const narrow = canvas.getByTestId('narrow');
    await expect(Math.round(box(narrow).width)).toBe(276);
    const rows = new Set([...narrow.querySelectorAll('[data-slot="chip"]')].map(c => Math.round(box(c).top)));
    await expect(rows.size).toBeGreaterThan(1);
    for (const c of narrow.querySelectorAll('[data-slot="chip"]')) await expect(box(c).right).toBeLessThanOrEqual(box(narrow).right + 0.5);
    const min = canvas.getByTestId('min');
    for (const c of min.querySelectorAll('[data-slot="chip"]')) {
      await expect(Math.round(box(c).height)).toBe(24);
      await expect(box(c).right).toBeLessThanOrEqual(box(min).right + 0.5);
    }
    const label = min.querySelector('[data-slot="chip-label"]')!;
    await expect(label.scrollWidth).toBeGreaterThan(label.clientWidth);
  },
};

export const DefaultDark: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
