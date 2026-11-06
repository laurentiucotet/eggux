import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';
import { Calendar, Inbox } from '@/components/icons';
import { NavigationMenuLink } from './navigation-menu-link';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from './navigation-menu';

const colors = (className: string) => {
  const el = document.createElement('span');
  el.className = className;
  document.body.append(el);
  const s = getComputedStyle(el);
  const copy = { bg: s.backgroundColor, color: s.color };
  el.remove();
  return copy;
};

/** Navigation Menu Links only work inside a NavigationMenu (Radix focus group). */
function Frame({ children, width = 280 }: { children: React.ReactNode; width?: number }) {
  return (
    <NavigationMenu aria-label="Product" className="max-w-none">
      <NavigationMenuList className="flex-col items-stretch gap-1" style={{ width }}>
        {React.Children.map(children, child => <NavigationMenuItem>{child}</NavigationMenuItem>)}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const meta = {
  title: 'Components/Navigation/Navigation Menu Link',
  component: NavigationMenuLink,
  parameters: {
    docs: {
      description: {
        component:
          'Link inside a mega menu panel: icon, title, one-line description that says what the user gets. The title is the link name; the icon is decorative. Lives in a NavigationMenuPanel. Figma: Navigation page / Navigation Menu Link. Guide: eggux build-ui/components/navigation.md',
      },
    },
  },
  args: { href: '#analytics', title: 'Analytics', description: 'Dashboards and reports for every team.' },
  render: args => (
    <Frame>
      <NavigationMenuLink {...args} />
    </Frame>
  ),
} satisfies Meta<typeof NavigationMenuLink>;
export default meta;
type Story = StoryObj<typeof meta>;

// Figma State=default: 280 x 78, 12 padding and gap, icon box 36 with border, 18 px icon,
// title ui/label, description ui/caption muted, 2 px between them.
export const Default: Story = {
  play: async ({ canvas }) => {
    const link = canvas.getByRole('link', { name: 'Analytics Dashboards and reports for every team.' });
    await expect(link).toHaveAttribute('href', '#analytics');
    const s = getComputedStyle(link);
    await expect(Math.round(link.getBoundingClientRect().width)).toBe(280);
    await expect(Math.round(link.getBoundingClientRect().height)).toBe(78);
    await expect(s.paddingTop).toBe('12px');
    await expect(s.paddingLeft).toBe('12px');
    await expect(s.columnGap).toBe('12px');
    const box = link.querySelector('[data-slot="navigation-menu-link-icon"]') as HTMLElement;
    await expect(box).toHaveAttribute('aria-hidden', 'true');
    await expect(Math.round(box.getBoundingClientRect().width)).toBe(36);
    await expect(getComputedStyle(box).borderTopWidth).toBe('1px');
    await expect(Math.round(box.querySelector('svg')!.getBoundingClientRect().width)).toBe(18);
    const title = link.querySelector('[data-slot="navigation-menu-link-title"]') as HTMLElement;
    await expect(getComputedStyle(title).fontSize).toBe('14px');
    await expect(getComputedStyle(title).fontWeight).toBe('500');
    const description = link.querySelector('[data-slot="navigation-menu-link-description"]') as HTMLElement;
    await expect(getComputedStyle(description).fontSize).toBe('12px');
    await expect(getComputedStyle(description).color).toBe(colors('text-muted-foreground').color);
    // On the accent background (hover, focus, active) the description darkens to keep 4.5:1.
    await expect(description.className).toContain('group-focus-visible/menu-link:text-[var(--input-filled-muted-foreground)]');
    // Figma State=hover: background/accent (CSS :hover is not reachable from userEvent).
    await expect(link.className).toContain('hover:bg-accent');
    await userEvent.tab();
    await expect(link).toHaveFocus();
    await expect(getComputedStyle(link).boxShadow).not.toBe('none');
    await expect(getComputedStyle(link).backgroundColor).toBe(colors('bg-accent').bg);
  },
};

// Show icon off, a swapped icon, and the arrow keys between links (Radix focus group).
export const Options: Story = {
  render: () => (
    <Frame>
      <NavigationMenuLink href="#inbox" icon={<Inbox />} title="Inbox" description="Every message from every channel in one place." />
      <NavigationMenuLink href="#calendar" icon={<Calendar />} title="Calendar" description="Plan, book and sync with your team." />
      <NavigationMenuLink href="#changelog" showIcon={false} title="Changelog" description="What shipped this month." />
    </Frame>
  ),
  play: async ({ canvas }) => {
    const changelog = canvas.getByRole('link', { name: /^Changelog/ });
    await expect(changelog.querySelector('[data-slot="navigation-menu-link-icon"]')).toBeNull();
    canvas.getByRole('link', { name: /^Inbox/ }).focus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(canvas.getByRole('link', { name: /^Calendar/ })).toHaveFocus();
    await userEvent.keyboard('{End}');
    await expect(changelog).toHaveFocus();
  },
};

// Figma "Stress test / Navigation Menu Panel" links: long title stays on one line with an
// ellipsis, long description wraps, the icon keeps 36; min width 240.
export const Stress: Story = {
  tags: ['!dev'],
  render: () => (
    <Frame width={240}>
      <NavigationMenuLink href="#a" title="Analytics with a much longer label than planned" description="Dashboards and reports for every team, with exports, alerts and schedules for everyone." />
      <NavigationMenuLink href="#b" title="A" />
    </Frame>
  ),
  play: async ({ canvas }) => {
    const long = canvas.getByRole('link', { name: /much longer/ });
    const title = long.querySelector('[data-slot="navigation-menu-link-title"]') as HTMLElement;
    await expect(Math.round(title.getBoundingClientRect().height)).toBe(20);
    await expect(title.scrollWidth).toBeGreaterThan(title.clientWidth);
    const description = long.querySelector('[data-slot="navigation-menu-link-description"]') as HTMLElement;
    await expect(description.getBoundingClientRect().height).toBeGreaterThan(16);
    await expect(Math.round(long.querySelector('[data-slot="navigation-menu-link-icon"]')!.getBoundingClientRect().width)).toBe(36);
    await expect(Math.round(long.getBoundingClientRect().width)).toBe(240);
    const short = canvas.getByRole('link', { name: 'A' });
    await expect(short.querySelector('[data-slot="navigation-menu-link-description"]')).toBeNull();
  },
};

export const OptionsDark: Story = { ...Options, tags: ['!dev'], globals: { theme: 'Dark' } };
export const OptionsCorporate: Story = { ...Options, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
