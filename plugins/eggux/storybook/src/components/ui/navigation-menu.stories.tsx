import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Calendar, ChartColumn, FileText, Inbox, Users } from '@/components/icons';
import { Button } from './button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuFeatured,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuPanel,
  NavigationMenuTrigger,
} from './navigation-menu';

const meta = {
  title: 'Components/Navigation/Navigation Menu Panel',
  parameters: {
    layout: 'padded',
    // Radix NavigationMenu puts an aria-hidden focus proxy (tabindex 0) after an open trigger, by
    // design: it sends Tab from the trigger into the panel. axe flags it; the rule is off here only.
    a11y: { config: { rules: [{ id: 'aria-hidden-focus', selector: '[data-slot="navigation-menu-item"] > span[aria-hidden="true"]', enabled: false }] } },
    docs: { description: { component: 'A mega menu: a Nav Link with a chevron opens a panel of Navigation Menu Links (columns at least 240 wide) and an optional Featured card. Opens on hover after a short delay and on click or Enter; Escape closes and returns focus to the trigger; Tab and the arrow keys move through the links. Min width 640; on phones put the links in a Sheet. Figma: Navigation page / Navigation Menu Panel. Guide: eggux build-ui/components/navigation.md' } },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const h = (el: Element) => Math.round(el.getBoundingClientRect().height);
const w = (el: Element) => Math.round(el.getBoundingClientRect().width);

function Menu({ featured = true }: { featured?: boolean }) {
  return (
    <div className="min-h-[420px]">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Product</NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuPanel
                featured={
                  featured ? (
                    <NavigationMenuFeatured
                      title="New: AI summaries"
                      description="Every report now starts with a short summary of what changed."
                      action={<NavigationMenuLink asChild><Button variant="link" size="sm" asChild><a href="#ai">Learn more</a></Button></NavigationMenuLink>}
                    />
                  ) : undefined
                }
              >
                <NavigationMenuLink href="#analytics" icon={<ChartColumn />} title="Analytics" description="Dashboards and reports for every team." />
                <NavigationMenuLink href="#inbox" icon={<Inbox />} title="Inbox" description="Every message from every channel in one place." />
                <NavigationMenuLink href="#calendar" icon={<Calendar />} title="Calendar" description="Plan, book and sync with your team." />
                <NavigationMenuLink href="#customers" icon={<Users />} title="Customers" description="Accounts, contacts and their history." />
              </NavigationMenuPanel>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <a href="#pricing" className="inline-flex h-9 items-center px-3 text-sm font-medium">Pricing</a>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}

// Figma default: the panel opens under Product, 834 wide, links in 2 columns, the featured card 240.
type Playground = { featured: boolean };

/** Playground: hover or focus a top item to open its panel. */
export const Default: StoryObj<Playground> = {
  argTypes: { featured: { name: 'Show featured', control: 'boolean', description: 'Navigation Menu Panel `featured`: a highlighted card on the left of the links', table: { category: 'Navigation Menu Panel' } } },
  args: { featured: true },
  render: a => <Menu key={String(a.featured)} featured={a.featured} />,
};

// The checks that used to run on Default (hidden; the playground has no play function).
export const DefaultCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <Menu />,
  play: async ({ canvas }) => {
    const nav = canvas.getByRole('navigation', { name: 'Main' });
    const trigger = within(nav).getByRole('button', { name: 'Product' });
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    const panel = await waitFor(() => canvas.getByText('Analytics').closest('[data-slot="navigation-menu-panel"]') as HTMLElement);
    await expect(w(panel)).toBe(834);
    const links = within(panel).getAllByRole('link');
    await expect(links).toHaveLength(5);
    const [first, second, third] = links;
    await expect(Math.round(first.getBoundingClientRect().top)).toBe(Math.round(second.getBoundingClientRect().top));
    await expect(third.getBoundingClientRect().top).toBeGreaterThan(first.getBoundingClientRect().top);
    await expect(w(panel.querySelector('[data-slot="navigation-menu-featured"]')!)).toBe(240);
    await expect(getComputedStyle(panel).paddingTop).toBe('8px');
  },
};

// Keyboard: Enter opens, Tab moves into the links, Escape closes and returns focus to the trigger.
export const Keyboard: Story = {
  parameters: { controls: { disable: true } },
  render: () => <Menu featured={false} />,
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: 'Product' });
    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await userEvent.tab();
    await expect(canvas.getByRole('link', { name: /^Analytics/ })).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(canvas.getByRole('link', { name: /^Inbox/ })).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'));
    await expect(trigger).toHaveFocus();
  },
};

// The panel alone, without the featured card: links fill the width.
export const PanelOnly: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <NavigationMenu aria-label="Resources">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuPanel className="w-[640px]">
            <NavigationMenuLink href="#docs" icon={<FileText />} title="Documentation" description="Guides and API reference." />
            <NavigationMenuLink href="#changelog" showIcon={false} title="Changelog" description="What shipped this month." />
          </NavigationMenuPanel>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
  play: async ({ canvas }) => {
    const panel = canvas.getByRole('link', { name: /^Documentation/ }).closest('[data-slot="navigation-menu-panel"]')!;
    await expect(w(panel)).toBe(640);
    await expect(panel.querySelector('[data-slot="navigation-menu-featured"]')).toBeNull();
    await expect(h(canvas.getByRole('link', { name: /^Changelog/ }))).toBeGreaterThan(0);
  },
};

// Stress: 9 links at the min width 640 flow into 2 columns; a long featured title clamps. Tests only.
export const Stress: Story = {
  parameters: { controls: { disable: true } },
  tags: ['!dev'],
  render: () => (
    <NavigationMenu aria-label="Stress">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuPanel className="w-[640px]" featured={<NavigationMenuFeatured title="A very long featured title that goes on for more than two lines in this narrow card" description="One sentence." />}>
            {Array.from({ length: 9 }, (_, i) => <NavigationMenuLink key={i} href={`#l${i}`} title={`Link ${i + 1}`} description="Short description." />)}
          </NavigationMenuPanel>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
  play: async ({ canvas }) => {
    const panel = canvas.getByRole('link', { name: /^Link 1 / }).closest('[data-slot="navigation-menu-panel"]') as HTMLElement;
    await expect(panel.scrollWidth).toBeLessThanOrEqual(panel.clientWidth + 2);
    const title = panel.querySelector('[data-slot="navigation-menu-featured"] p') as HTMLElement;
    await expect(h(title)).toBe(40);
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
