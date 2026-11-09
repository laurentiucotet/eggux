import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { Ellipsis } from '@/components/icons';
import { Button } from './button';
import { ButtonIcon } from './button-icon';
import { SidePanel } from './side-panel';

const meta = {
  title: 'Components/Drawer/Side Panel',
  component: SidePanel,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Inline panel beside the page content (an aside labelled by its title): details, properties or a preview of the object being edited. 320 wide, collapses to a 48 rail with the title written vertically; the page grid column hugs it. Use a Sheet when the panel opens over the page, and below 1024 px. Figma: Drawer page / Side Panel. Guide: eggux build-ui/components/drawer.md',
      },
    },
  },
  args: { title: 'Details' },
} satisfies Meta<typeof SidePanel>;
export default meta;
type Story = StoryObj<typeof meta>;

const Details = () => (
  <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-2 text-sm">
    <dt className="text-muted-foreground">Status</dt>
    <dd className="m-0 truncate">Published</dd>
    <dt className="text-muted-foreground">Code</dt>
    <dd className="m-0 truncate">ACME-2026-114</dd>
    <dt className="text-muted-foreground">Updated</dt>
    <dd className="m-0 truncate">30 Oct 2026</dd>
  </dl>
);

const moreActions = <ButtonIcon variant="ghost" icon={<Ellipsis aria-hidden="true" />} label="More actions for Details" />;

const px = (n: number) => Math.round(n);
const panel = (el: HTMLElement) => el.querySelector<HTMLElement>('[data-slot="side-panel"]')!;

const onCollapsedChange = fn();

// Figma State=expanded: 320 wide, header 53 (8/8/8/16), content 16 padding; an aside named by the title.
export const Default: Story = {
  args: { actions: moreActions, children: <Details />, onCollapsedChange },
  render: (args) => (
    <div className="flex items-start gap-4">
      <main className="min-w-0 flex-1 rounded-lg border p-4 text-sm">Showcase editor</main>
      <SidePanel {...args} />
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    const aside = canvas.getByRole('complementary', { name: 'Details' });
    await expect(px(aside.getBoundingClientRect().width)).toBe(320);
    await expect(getComputedStyle(aside).minWidth).toBe('240px');
    const header = aside.querySelector<HTMLElement>('[data-slot="side-panel-header"]')!;
    await expect(px(header.getBoundingClientRect().height)).toBe(53);
    await expect(getComputedStyle(header).paddingLeft).toBe('16px');
    await expect(getComputedStyle(aside.querySelector('[data-slot="side-panel-content"]')!).paddingTop).toBe('16px');
    await expect(canvas.getByRole('heading', { name: 'Details' })).toBeInTheDocument();
    // Collapse with the mouse: 48 rail, expand button, focus kept on the toggle.
    const collapse = canvas.getByRole('button', { name: 'Collapse Details' });
    await expect(collapse).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(collapse);
    await expect(onCollapsedChange).toHaveBeenLastCalledWith(true);
    const expand = canvas.getByRole('button', { name: 'Expand Details' });
    await expect(expand).toHaveAttribute('aria-expanded', 'false');
    await waitFor(() => expect(expand).toHaveFocus());
    await expect(px(panel(canvasElement).getBoundingClientRect().width)).toBe(48);
    await expect(canvas.getByText('Published')).not.toBeVisible();
    await userEvent.click(expand);
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Collapse Details' })).toHaveFocus());
    await expect(canvas.getByText('Published')).toBeVisible();
  },
};

// Keyboard: Tab reaches the toggle, Enter collapses, Space expands, focus stays on the toggle.
export const Keyboard: Story = {
  args: { children: <Details /> },
  play: async ({ canvas }) => {
    await userEvent.tab();
    const collapse = canvas.getByRole('button', { name: 'Collapse Details' });
    await expect(collapse).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Expand Details' })).toHaveFocus());
    await userEvent.keyboard(' ');
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Collapse Details' })).toHaveFocus());
    const toggle = canvas.getByRole('button', { name: 'Collapse Details' });
    await expect(document.getElementById(toggle.getAttribute('aria-controls')!)).not.toBeNull();
  },
};

// Figma State=collapsed: 48 wide rail, 8/4 padding, expand button and the title written vertically.
export const Collapsed: Story = {
  args: { defaultCollapsed: true, actions: moreActions, children: <Details /> },
  play: async ({ canvas, canvasElement }) => {
    const aside = canvas.getByRole('complementary', { name: 'Details' });
    await expect(aside).toHaveAttribute('data-state', 'collapsed');
    await expect(px(aside.getBoundingClientRect().width)).toBe(48);
    await expect(canvas.queryByRole('button', { name: 'More actions for Details' })).toBeNull();
    const title = canvas.getByRole('heading', { name: 'Details' });
    await expect(getComputedStyle(title).writingMode).toBe('vertical-rl');
    await expect(title.getBoundingClientRect().height).toBeGreaterThan(title.getBoundingClientRect().width);
    await expect(panel(canvasElement)).toBe(aside);
  },
};

// Figma Show footer: one full-width action under a border.
export const WithFooter: Story = {
  args: { actions: moreActions, children: <Details />, footer: <Button variant="outline">View all details</Button> },
  play: async ({ canvas }) => {
    const aside = canvas.getByRole('complementary', { name: 'Details' });
    const button = canvas.getByRole('button', { name: 'View all details' });
    await expect(px(button.getBoundingClientRect().width)).toBe(320 - 2 - 32);
    const footer = aside.querySelector<HTMLElement>('[data-slot="side-panel-footer"]')!;
    await expect(getComputedStyle(footer).borderTopWidth).toBe('1px');
    await expect(px(footer.getBoundingClientRect().height)).toBe(61);
  },
};

// Figma Collapsible off: no collapse button.
export const NotCollapsible: Story = {
  args: { collapsible: false, title: 'Properties', children: <Details /> },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('button')).toBeNull();
    await expect(canvas.getByRole('complementary', { name: 'Properties' })).toBeInTheDocument();
  },
};

// Controlled: the page stores the collapsed state (per user and page).
export const Controlled: Story = {
  parameters: { controls: { disable: true } },
  tags: ['!dev'],
  render: () => {
    const [collapsed, setCollapsed] = React.useState(true);
    return (
      <div className="flex flex-col items-start gap-2">
        <p className="text-sm">State: {collapsed ? 'collapsed' : 'expanded'}</p>
        <SidePanel collapsed={collapsed} onCollapsedChange={setCollapsed}>
          <Details />
        </SidePanel>
      </div>
    );
  },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Expand Details' }));
    await expect(canvas.getByText('State: expanded')).toBeInTheDocument();
  },
};

// Stress (titles differ: landmarks need unique names): long title one line with ellipsis at 320, 276 and the 240 minimum; short title; the
// collapsed long title capped at 200.
const longTitle = 'Details with a much longer label than the panel can show';
export const Stress: Story = {
  parameters: { controls: { disable: true } },
  tags: ['!dev'],
  render: () => (
    <div className="flex flex-wrap items-start gap-4">
      <SidePanel title={`${longTitle} (320)`} actions={moreActions} data-testid="w320"><Details /></SidePanel>
      <SidePanel title={`${longTitle} (276)`} actions={moreActions} className="w-[276px]" data-testid="w276"><Details /></SidePanel>
      <SidePanel title={`${longTitle} (240)`} actions={moreActions} className="w-[200px]" data-testid="w240"><Details /></SidePanel>
      <SidePanel title="A" data-testid="short"><Details /></SidePanel>
      <SidePanel title={longTitle} defaultCollapsed data-testid="rail"><Details /></SidePanel>
    </div>
  ),
  play: async ({ canvas }) => {
    for (const [id, width] of [['w320', 320], ['w276', 276], ['w240', 240]] as const) {
      const aside = canvas.getByTestId(id);
      await expect(px(aside.getBoundingClientRect().width)).toBe(width);
      const title = aside.querySelector('h2')!;
      await expect(px(title.getBoundingClientRect().height)).toBe(20);
      await expect(title.scrollWidth).toBeGreaterThan(title.clientWidth);
      await expect(aside.scrollWidth).toBeLessThanOrEqual(aside.clientWidth + 2);
    }
    const rail = canvas.getByTestId('rail');
    await expect(px(rail.getBoundingClientRect().width)).toBe(48);
    await expect(rail.querySelector('h2')!.getBoundingClientRect().height).toBeLessThanOrEqual(200);
  },
};

export const DefaultDark: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
export const CollapsedDark: Story = { ...Collapsed, tags: ['!dev'], globals: { theme: 'Dark' } };
