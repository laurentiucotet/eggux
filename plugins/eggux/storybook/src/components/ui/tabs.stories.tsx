import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { House } from '@/components/icons';
import { Tabs, TabsContent, TabsList, TabsTrigger, type TabsSize, type TabsVariant } from './tabs';

const meta = {
  title: 'Components/Tabs/Tabs',
  component: Tabs,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Tabs switch between panels of one context. Variant default (pill track in a card), line (page sections), vertical (settings), pills (list filters), boxed (folder tabs on a bordered panel). Arrow keys move between tabs, Tab moves into the panel; Show overflow moves tabs that do not fit into a More menu. Not for steps (Stepper) or for setting a value (Toggle Group). Figma: Tabs page / Tabs, Tab. Guide: eggux build-ui/components/tabs.md' } },
  },
} satisfies Meta<typeof Tabs>;
export default meta;
type Story = StoryObj<typeof meta>;

const rect = (el: Element) => el.getBoundingClientRect();
const h = (el: Element) => Math.round(rect(el).height);

const labels = [['overview', 'Overview'], ['projects', 'Projects'], ['invoices', 'Invoices']] as const;
const panels: Record<string, string> = {
  overview: 'Overview of your Acme workspace.',
  projects: 'All projects billed in EUR.',
  invoices: 'Open invoices and payments.',
};

function Sample({ variant = 'default', size = 'default', overflow = false, names = labels, defaultValue = 'overview', ...rest }: { variant?: TabsVariant; size?: TabsSize; overflow?: boolean; names?: ReadonlyArray<readonly [string, string]>; defaultValue?: string } & Partial<React.ComponentProps<typeof Tabs>>) {
  return (
    <Tabs variant={variant} size={size} defaultValue={defaultValue} {...rest}>
      <TabsList overflow={overflow} aria-label="Workspace sections">
        {names.map(([v, l]) => <TabsTrigger key={v} value={v}>{l}</TabsTrigger>)}
      </TabsList>
      {names.map(([v, l]) => <TabsContent key={v} value={v}>{panels[v] ?? `${l} content.`}</TabsContent>)}
    </Tabs>
  );
}

// Figma Variant=default: pill track 36 high, tab 28 high.
export const Default: Story = {
  render: () => <Sample />,
  play: async ({ canvas }) => {
    const list = canvas.getByRole('tablist', { name: 'Workspace sections' }).parentElement as HTMLElement;
    const [overview, projects] = canvas.getAllByRole('tab');
    await expect(overview).toHaveAttribute('aria-selected', 'true');
    await expect(h(list)).toBe(36);
    await expect(h(overview)).toBe(28);
    await expect(canvas.getByRole('tabpanel')).toHaveTextContent('Overview of your Acme workspace.');
    await userEvent.click(projects);
    await expect(projects).toHaveAttribute('aria-selected', 'true');
    await expect(overview).toHaveAttribute('aria-selected', 'false');
    // Each panel is labelled by its tab.
    await expect(canvas.getByRole('tabpanel', { name: 'Projects' })).toHaveTextContent('All projects billed in EUR.');
  },
};

const probe = (cls: string, prop: 'color' | 'backgroundColor' | 'borderTopColor' | 'borderBottomColor') => {
  const el = document.createElement('div');
  el.className = cls;
  (document.getElementById('storybook-root') ?? document.body).appendChild(el);
  const v = getComputedStyle(el)[prop];
  el.remove();
  return v;
};
const style = (el: Element) => getComputedStyle(el);

// Heights per variant and Size, measured from Figma: [list, tab].
const heights: Record<TabsVariant, Record<TabsSize, [number, number]>> = {
  default: { default: [36, 28], sm: [32, 24] },
  line: { default: [37, 36], sm: [33, 32] },
  vertical: { default: [140, 32], sm: [124, 28] },
  pills: { default: [32, 32], sm: [28, 28] },
  boxed: { default: [36, 36], sm: [32, 32] },
};
const variants = Object.keys(heights) as TabsVariant[];

const Styles = ({ size }: { size: TabsSize }) => (
  <div className="flex flex-col gap-8">
    {variants.map(v => (
      <div key={v} data-variant-case={v}>
        <Sample variant={v} size={size} names={v === 'vertical' ? [...labels, ['team', 'Team']] : labels} />
      </div>
    ))}
  </div>
);

// One tab per Variant: sizes and the active look of each (colors compared with token probes).
export const Styles_: Story = {
  name: 'Variants',
  render: () => <Styles size="default" />,
  play: async ({ canvasElement }) => {
    for (const v of variants) {
      const scope = within(canvasElement.querySelector(`[data-variant-case="${v}"]`) as HTMLElement);
      const list = scope.getByRole('tablist').parentElement as HTMLElement;
      const [active, other] = scope.getAllByRole('tab');
      await expect([v, h(list), h(active)]).toEqual([v, ...heights[v].default]);
      if (v === 'vertical') await expect(Math.round(rect(active).width)).toBe(200);
      if (v === 'default') {
        await waitFor(() => expect(style(list.closest('[data-slot="tabs-list"]')!).backgroundColor).toBe(probe('bg-muted', 'backgroundColor')));
        await waitFor(() => expect(style(active).backgroundColor).toBe(probe('bg-background', 'backgroundColor')));
        // Inactive text is foreground, not muted (contrast on the muted track).
        await waitFor(() => expect(style(other).color).toBe(probe('text-foreground', 'color')));
      }
      if (v === 'line') {
        await waitFor(() => expect(style(active).borderBottomColor).toBe(probe('border-b border-primary', 'borderBottomColor')));
        await expect(style(active).borderBottomWidth).toBe('2px');
        await waitFor(() => expect(style(other).color).toBe(probe('text-muted-foreground', 'color')));
      }
      if (v === 'vertical') await expect(style(active).backgroundColor).toBe(probe('bg-muted', 'backgroundColor'));
      if (v === 'pills') {
        await waitFor(() => expect(style(active).backgroundColor).toBe(probe('bg-primary', 'backgroundColor')));
        await waitFor(() => expect(style(active).color).toBe(probe('text-primary-foreground', 'color')));
        await waitFor(() => expect(style(other).color).toBe(probe('text-muted-foreground', 'color')));
        await expect(style(other).backgroundColor).toBe('rgba(0, 0, 0, 0)');
      }
      if (v === 'boxed') {
        await waitFor(() => expect(style(active).borderTopColor).toBe(probe('border-t border-border', 'borderTopColor')));
        await expect(style(active).borderBottomWidth).toBe('0px');
        await expect(style(other).borderBottomWidth).toBe('1px');
        await waitFor(() => expect(style(active).backgroundColor).toBe(probe('bg-background', 'backgroundColor')));
      }
    }
  },
};

export const Sizes: Story = {
  render: () => <Styles size="sm" />,
  play: async ({ canvasElement }) => {
    for (const v of variants) {
      const scope = within(canvasElement.querySelector(`[data-variant-case="${v}"]`) as HTMLElement);
      const list = scope.getByRole('tablist').parentElement as HTMLElement;
      const [active] = scope.getAllByRole('tab');
      await expect([v, h(list), h(active)]).toEqual([v, ...heights[v].sm]);
    }
  },
};

// Boxed: header row with a rest line, and the panel carrying the border on three sides.
export const Boxed: Story = {
  render: () => (
    <div className="w-[480px] max-w-full">
      <Sample variant="boxed" />
    </div>
  ),
  play: async ({ canvas }) => {
    const panel = canvas.getByRole('tabpanel');
    await expect(Math.round(rect(panel).width)).toBe(480);
    await expect(style(panel).borderTopWidth).toBe('0px');
    await expect(style(panel).borderLeftWidth).toBe('1px');
    await expect(parseFloat(style(panel).paddingTop)).toBeGreaterThan(0);
    // The panel starts right under the 36 px header.
    const header = canvas.getByRole('tablist').parentElement as HTMLElement;
    await expect(h(header)).toBe(36);
    await expect(Math.round(rect(panel).top - rect(header).bottom)).toBe(0);
  },
};

// Figma example "settings with vertical tabs": 200 wide column, content on the right.
export const Vertical: Story = {
  render: () => (
    <Tabs variant="vertical" defaultValue="profile" className="w-[648px] max-w-full">
      <TabsList aria-label="Settings">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
        <TabsTrigger value="team" disabled>Team</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
      </TabsList>
      <TabsContent value="profile">Profile settings.</TabsContent>
      <TabsContent value="billing">Billing settings.</TabsContent>
      <TabsContent value="team">Team settings.</TabsContent>
      <TabsContent value="security">Security settings.</TabsContent>
    </Tabs>
  ),
  play: async ({ canvas }) => {
    const list = canvas.getByRole('tablist');
    await expect(list).toHaveAttribute('aria-orientation', 'vertical');
    await expect(Math.round(rect(list).width)).toBe(200);
    await expect(h(list)).toBe(140);
    // Content sits on the right of the column.
    await expect(rect(canvas.getByRole('tabpanel')).left).toBeGreaterThan(rect(list).right);
    const [profile, billing, , security] = canvas.getAllByRole('tab');
    // Down and Up move between tabs, the disabled Team tab is skipped.
    profile.focus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(billing).toHaveFocus();
    await expect(billing).toHaveAttribute('aria-selected', 'true');
    await userEvent.keyboard('{ArrowDown}');
    await expect(security).toHaveFocus();
    await userEvent.keyboard('{ArrowUp}');
    await expect(billing).toHaveFocus();
    await userEvent.keyboard('{End}');
    await expect(security).toHaveFocus();
    await userEvent.keyboard('{Home}');
    await expect(profile).toHaveFocus();
  },
};

// Keyboard (WAI-ARIA tabs): arrows, Home/End, automatic activation, Tab into the panel.
export const States: Story = {
  name: 'States (active, disabled, keyboard)',
  render: () => (
    <Tabs defaultValue="overview" onValueChange={fn()}>
      <TabsList aria-label="Account">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="projects" disabled>Projects</TabsTrigger>
        <TabsTrigger value="invoices">Invoices</TabsTrigger>
        <TabsTrigger value="members">Members</TabsTrigger>
      </TabsList>
      <TabsContent value="overview"><button type="button">Edit overview</button></TabsContent>
      <TabsContent value="invoices">Invoices.</TabsContent>
      <TabsContent value="members">Members.</TabsContent>
    </Tabs>
  ),
  play: async ({ canvas }) => {
    const [overview, projects, invoices, members] = canvas.getAllByRole('tab');
    await userEvent.tab();
    await expect(overview).toHaveFocus();
    await expect(projects).toBeDisabled();
    await userEvent.keyboard('{ArrowRight}');
    await expect(invoices).toHaveFocus();
    await expect(invoices).toHaveAttribute('aria-selected', 'true');
    await userEvent.keyboard('{ArrowRight}');
    await expect(members).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(overview).toHaveFocus();
    await userEvent.keyboard('{ArrowLeft}');
    await expect(members).toHaveFocus();
    await userEvent.keyboard('{Home}');
    await expect(overview).toHaveFocus();
    await userEvent.keyboard('{End}');
    await expect(members).toHaveFocus();
    // Tab moves into the panel (focusable, labelled by its tab), then into its content.
    await userEvent.keyboard('{ArrowLeft}{ArrowLeft}');
    await expect(overview).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole('tabpanel', { name: 'Overview' })).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Edit overview' })).toHaveFocus();
  },
};

// Figma example "tabs with counts": Badge Count after the label, number never in the label.
export const WithCounts: Story = {
  render: () => (
    <Tabs variant="line" defaultValue="all">
      <TabsList aria-label="Invoices">
        <TabsTrigger value="all" count={12} countLabel="12 invoices">All</TabsTrigger>
        <TabsTrigger value="paid" count={8} countLabel="8 paid">Paid</TabsTrigger>
        <TabsTrigger value="overdue" count={3} countLabel="3 overdue">Overdue</TabsTrigger>
        <TabsTrigger value="drafts" count={1} countLabel="1 draft">Drafts</TabsTrigger>
      </TabsList>
      <TabsContent value="all">All invoices.</TabsContent>
      <TabsContent value="paid">Paid invoices.</TabsContent>
      <TabsContent value="overdue">Overdue invoices.</TabsContent>
      <TabsContent value="drafts">Draft invoices.</TabsContent>
    </Tabs>
  ),
  play: async ({ canvas }) => {
    const overdue = canvas.getByRole('tab', { name: /Overdue/ });
    await expect(overdue).toHaveAccessibleName('Overdue 3 overdue');
    const badge = overdue.querySelector('[data-slot="badge-count"]') as HTMLElement;
    await expect(Math.round(rect(badge).height)).toBe(20);
    await waitFor(() => expect(style(badge).backgroundColor).toBe(probe('bg-secondary', 'backgroundColor')));
    // The label itself has no number.
    await expect(overdue.querySelector('span:not([data-slot])')).toHaveTextContent(/^Overdue$/);
  },
};

export const WithIcons: Story = {
  render: () => (
    <Tabs variant="pills" defaultValue="home">
      <TabsList aria-label="Views">
        <TabsTrigger value="home" icon={<House aria-hidden="true" />}>Home</TabsTrigger>
        <TabsTrigger value="other" icon={<House aria-hidden="true" />}>Archive</TabsTrigger>
      </TabsList>
      <TabsContent value="home">Home.</TabsContent>
      <TabsContent value="other">Archive.</TabsContent>
    </Tabs>
  ),
  play: async ({ canvas }) => {
    const tab = canvas.getByRole('tab', { name: 'Home' });
    const svg = tab.querySelector('svg') as SVGElement;
    await expect(Math.round(rect(svg).width)).toBe(16);
    await expect(svg).toHaveAttribute('aria-hidden', 'true');
  },
};

const many = [
  ['overview', 'Overview'], ['projects', 'Projects'], ['invoices', 'Invoices'], ['members', 'Members'], ['billing', 'Billing'], ['security', 'Security'],
] as const;

// Show overflow in a narrow column: the rest goes into More, the active tab stays visible.
const overflowCheck = async (canvas: ReturnType<typeof within>, body: HTMLElement) => {
  const visibleTabs = () => canvas.getAllByRole('tab').filter((t: HTMLElement) => getComputedStyle(t).display !== 'none');
  await waitFor(() => expect(canvas.getByRole('button', { name: 'More tabs' })).toBeVisible());
  const before = visibleTabs().length;
  await expect(before).toBeLessThan(many.length);
  const more = canvas.getByRole('button', { name: 'More tabs' });
  await expect(more).toHaveAttribute('aria-haspopup', 'menu');
  await userEvent.click(more);
  const menu = within(body).getByRole('menu');
  const items = within(menu).getAllByRole('menuitem');
  await expect(items.length).toBe(many.length - before);
  const pick = items[items.length - 1];
  const name = pick.textContent!;
  await userEvent.click(pick);
  // The picked tab is active and moves into the row.
  await waitFor(() => expect(canvas.getByRole('tab', { name })).toHaveAttribute('aria-selected', 'true'));
  await expect(getComputedStyle(canvas.getByRole('tab', { name })).display).not.toBe('none');
  // Escape returned focus; the row still fits in the column.
  const list = canvas.getByRole('tablist').parentElement as HTMLElement;
  await expect(Math.round(rect(list).width)).toBeLessThanOrEqual(368);
};

export const OverflowLine: Story = {
  name: 'Overflow',
  render: () => <div className="w-[368px]"><Sample variant="line" overflow names={many} /></div>,
  play: async ({ canvas, canvasElement }) => overflowCheck(canvas, canvasElement.ownerDocument.body),
};
