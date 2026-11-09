import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { Bell } from '@/components/icons';
import { Avatar } from './avatar';
import { Breadcrumb } from './breadcrumb';
import { ButtonIcon } from './button-icon';
import { TopBar } from './top-bar';

const path = [{ label: 'Home', href: '#home' }, { label: 'Projects', href: '#projects' }, { label: 'Website redesign' }];

const meta = {
  title: 'Components/Navigation/Top Bar',
  component: TopBar,
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'App top bar (shadcn site header): sidebar trigger, Breadcrumb from the list to the object, and global actions (search, notifications, help, user menu). Style default: full width with a bottom border; floating: an inset bar with border and shadow over a muted canvas (one Style per product). Page actions go in the Page Header; under 768 use Mobile Header. Figma: Navigation page / Top Bar. Guide: eggux build-ui/components/navigation.md' } },
  },
  args: {
    onToggleSidebar: fn(),
    sidebarOpen: true,
    breadcrumb: <Breadcrumb items={path} />,
    actions: (
      <>
        <ButtonIcon variant="ghost" icon={<Bell />} label="Notifications" />
        <Avatar initials="DP" aria-label="Dana Pop" role="img" />
      </>
    ),
  },
} satisfies Meta<typeof TopBar>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();

// Figma Style=default: 56 high, 16 px sides, bottom border; trigger, separator, breadcrumb, actions.
export const Default: Story = {
  play: async ({ canvas, args }) => {
    const bar = canvas.getByRole('banner');
    await expect(Math.round(box(bar).height)).toBe(56);
    const s = getComputedStyle(bar);
    await expect([s.paddingLeft, s.borderBottomWidth]).toEqual(['16px', '1px']);
    const trigger = canvas.getByRole('button', { name: 'Toggle sidebar' });
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(trigger);
    await expect(args.onToggleSidebar).toHaveBeenCalled();
    await expect(canvas.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
    // Tab order: trigger, breadcrumb links, actions.
    trigger.focus();
    await userEvent.tab();
    await expect(canvas.getByRole('link', { name: 'Home' })).toHaveFocus();
    const bell = canvas.getByRole('button', { name: 'Notifications' });
    await expect(Math.round(box(bell).right)).toBeLessThan(Math.round(box(bar).right));
  },
};

// Figma Style=floating: 12 px inset, the bar with border, pill radius and shadow on a muted canvas.
export const Floating: Story = {
  args: { barStyle: 'floating' },
  render: args => <div className="min-h-40 bg-muted"><TopBar {...args} /></div>,
  play: async ({ canvas, canvasElement }) => {
    const header = canvas.getByRole('banner');
    await expect(getComputedStyle(header).paddingTop).toBe('12px');
    const bar = canvasElement.querySelector('[data-slot="top-bar-bar"]')!;
    await expect(Math.round(box(bar).height)).toBe(56);
    await expect(getComputedStyle(bar).boxShadow).not.toBe('none');
    await expect(getComputedStyle(bar).borderTopWidth).toBe('1px');
  },
};

// Show sidebar trigger off: the breadcrumb starts the bar.
export const WithoutTrigger: Story = {
  args: { onToggleSidebar: undefined },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('button', { name: 'Toggle sidebar' })).toBeNull();
    await expect(canvas.queryByRole('separator')).toBeNull();
  },
};

// Stress: at 320 the long breadcrumb wraps, trigger and actions keep 36 / 32. Tests only.
export const Stress: Story = {
  tags: ['!dev'],
  args: { breadcrumb: <Breadcrumb items={[{ label: 'Customers', href: '#c' }, { label: 'Acme International Holdings', href: '#a' }, { label: 'Invoices for the spring campaign' }]} /> },
  render: args => <div className="w-80"><TopBar {...args} /></div>,
  play: async ({ canvas }) => {
    const bar = canvas.getByRole('banner');
    await expect(bar.scrollWidth).toBeLessThanOrEqual(320);
    await expect(Math.round(box(canvas.getByRole('button', { name: 'Toggle sidebar' })).width)).toBe(36);
    await expect(Math.round(box(canvas.getByRole('button', { name: 'Notifications' })).width)).toBe(36);
    await expect(box(canvas.getByRole('navigation', { name: 'Breadcrumb' })).height).toBeGreaterThan(20);
  },
};

export const DefaultDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' } };
export const FloatingDark: Story = { ...Floating, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' } };
