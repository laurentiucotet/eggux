import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Calendar, CircleCheck, MapPin, User } from '@/components/icons';
import { Accordion, AccordionItem } from './accordion';
import { Badge } from './badge';

const faq = [
  ['plan', 'Can I change my plan later?', 'Yes. Upgrade or downgrade any time; we prorate the difference on your next invoice.'],
  ['trial', 'Do you offer a free trial?', 'Every plan starts with 14 days free. No card needed until you choose a plan.'],
  ['billing', 'How does billing work?', 'We invoice monthly or yearly in EUR. Invoices arrive by email and stay in Settings › Billing.'],
  ['cancel', 'Can I cancel at any time?', 'Yes. Your workspace stays readable until the end of the paid period.'],
] as const;

const items = faq.map(([value, title, answer]) => (
  <AccordionItem key={value} value={value} title={title}>
    <p>{answer}</p>
  </AccordionItem>
));

const meta = {
  title: 'Components/Accordion/Accordion',
  component: Accordion,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Stacked sections that open in place: FAQs, settings and filter groups. Style=default in apps and panels, Style=card with Icon=plus on marketing and help pages; one Style per list. Figma: Accordion page / Accordion, Accordion Item. Guide: eggux build-ui/components/accordion.md' } },
  },
  args: { defaultValue: ['plan'], children: items },
  decorators: [Story => <div className="w-[640px] max-w-full"><Story /></div>],
} satisfies Meta<typeof Accordion>;
export default meta;
type Story = StoryObj<typeof meta>;

const triggerHeight = (el: HTMLElement) => Math.round(el.closest('[data-slot="accordion-item"]')!.getBoundingClientRect().height);

// Figma Style=default, Icon=chevron, Size=default: collapsed item 53, expanded 89.
export const Default: Story = {
  play: async ({ canvas }) => {
    const first = canvas.getByRole('button', { name: 'Can I change my plan later?' });
    const second = canvas.getByRole('button', { name: 'Do you offer a free trial?' });
    await expect(first).toHaveAttribute('aria-expanded', 'true');
    await expect(triggerHeight(first)).toBe(89);
    await expect(triggerHeight(second)).toBe(53);
    // The whole row toggles; several items may be open at once.
    await userEvent.click(second);
    await expect(second).toHaveAttribute('aria-expanded', 'true');
    await expect(first).toHaveAttribute('aria-expanded', 'true');
    await expect(second).toHaveAttribute('aria-controls', canvas.getByText(/14 days free/).closest('[role="region"]')!.id);
    await userEvent.click(second);
    await expect(second).toHaveAttribute('aria-expanded', 'false');
  },
};

// Keyboard: Tab reaches the first trigger, arrows move between items, Enter and Space toggle.
export const Keyboard: Story = {
  args: { defaultValue: [] },
  play: async ({ canvas }) => {
    const [first, second, , last] = canvas.getAllByRole('button');
    await userEvent.tab();
    await expect(first).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(second).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(second).toHaveAttribute('aria-expanded', 'true');
    await userEvent.keyboard(' ');
    await expect(second).toHaveAttribute('aria-expanded', 'false');
    await userEvent.keyboard('{End}');
    await expect(last).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(first).toHaveFocus();
  },
};

// Figma Style=card, Icon=plus: separate bordered cards 12 apart, plus when closed, minus when open.
export const CardWithPlus: Story = {
  args: { accordionStyle: 'card', icon: 'plus' },
  decorators: [Story => <div className="rounded-xl bg-muted p-6"><Story /></div>],
  play: async ({ canvas, canvasElement }) => {
    const first = canvas.getByRole('button', { name: 'Can I change my plan later?' });
    const second = canvas.getByRole('button', { name: 'Do you offer a free trial?' });
    await expect(triggerHeight(first)).toBe(90);
    await expect(triggerHeight(second)).toBe(54);
    const [a, b] = Array.from(canvasElement.querySelectorAll('[data-slot="accordion-item"]'));
    await expect(Math.round(b.getBoundingClientRect().top - a.getBoundingClientRect().bottom)).toBe(12);
    // Plus/minus are decorative: one visible per state.
    const visibleIcons = (t: HTMLElement) => Array.from(t.querySelectorAll('svg')).filter(s => getComputedStyle(s).display !== 'none');
    await expect(visibleIcons(first)).toHaveLength(1);
    await expect(visibleIcons(second)).toHaveLength(1);
    await expect(visibleIcons(first)[0]).toHaveAttribute('aria-hidden', 'true');
  },
};

// Figma Size=sm: side panels and dense lists, collapsed 45 (card 46).
export const Small: Story = {
  args: { size: 'sm', defaultValue: [] },
  decorators: [Story => <div className="w-[280px]"><Story /></div>],
  play: async ({ canvas }) => {
    await expect(triggerHeight(canvas.getByRole('button', { name: 'Can I change my plan later?' }))).toBe(45);
  },
};

export const SmallCard: Story = {
  args: { size: 'sm', accordionStyle: 'card', defaultValue: [] },
  decorators: [Story => <div className="w-[280px]"><Story /></div>],
  play: async ({ canvas }) => {
    await expect(triggerHeight(canvas.getByRole('button', { name: 'Can I change my plan later?' }))).toBe(46);
  },
};

// Figma "Example / filter panel": Size=sm, leading icons on all groups, Meta = Badge Count of
// active values; groups with active filters open by default.
const count = (n: number) => (
  <Badge variant="secondary" shape="pill" className="min-w-5 px-1.5" aria-label={`${n} selected`}>{n}</Badge>
);
export const FilterPanel: Story = {
  args: {
    size: 'sm',
    defaultValue: ['status'],
    children: [
      <AccordionItem key="status" value="status" title="Status" leadingIcon={<CircleCheck />} meta={count(2)}>
        {['Open', 'Overdue', 'Paid'].map(s => (
          <label key={s} className="flex items-center gap-2"><input type="checkbox" defaultChecked={s !== 'Paid'} className="size-4 accent-[var(--primary)]" />{s}</label>
        ))}
      </AccordionItem>,
      <AccordionItem key="owner" value="owner" title="Owner" leadingIcon={<User />}><p>Anyone</p></AccordionItem>,
      <AccordionItem key="location" value="location" title="Location" leadingIcon={<MapPin />}><p>All offices</p></AccordionItem>,
      <AccordionItem key="date" value="date" title="Due date" leadingIcon={<Calendar />} meta={<span className="text-xs text-muted-foreground">Last 7 days</span>}><p>Last 7 days</p></AccordionItem>,
    ],
  },
  decorators: [Story => <div className="w-[280px]"><Story /></div>],
  play: async ({ canvas }) => {
    const status = canvas.getByRole('button', { name: /^Status/ });
    await expect(status).toHaveAttribute('aria-expanded', 'true');
    await expect(within(status).getByLabelText('2 selected')).toBeVisible();
    await expect(canvas.getByRole('checkbox', { name: 'Open' })).toBeChecked();
  },
};

// Single: only one open at a time, for mutually exclusive content.
export const Single: Story = {
  args: { type: 'single', collapsible: true, defaultValue: 'plan' },
  play: async ({ canvas }) => {
    const first = canvas.getByRole('button', { name: 'Can I change my plan later?' });
    await userEvent.click(canvas.getByRole('button', { name: 'How does billing work?' }));
    await expect(first).toHaveAttribute('aria-expanded', 'false');
  },
};

// Stress test (Figma "Stress test / Accordion"): long titles wrap, the icon and Meta keep their size.
export const LongTitle: Story = { tags: ['!dev'],
  args: {
    size: 'sm',
    defaultValue: [],
    children: [
      <AccordionItem key="a" value="a" title="What happens to invoices that were already sent when the customer moves to another billing entity?" meta={count(12)}><p>They stay with the old entity.</p></AccordionItem>,
      <AccordionItem key="b" value="b" title="Short"><p>Fine.</p></AccordionItem>,
    ],
  },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  play: async ({ canvas, canvasElement }) => {
    const trigger = canvas.getAllByRole('button')[0];
    const icon = trigger.querySelector('svg:last-of-type') as SVGElement;
    await expect(Math.round(icon.getBoundingClientRect().width)).toBe(16);
    await expect(trigger.getBoundingClientRect().height).toBeGreaterThan(45);
    const root = canvasElement.querySelector('[data-slot="accordion"]') as HTMLElement;
    await expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth);
  },
};

export const DefaultDark: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Dark' } };
export const CardWithPlusDark: Story = { ...CardWithPlus, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
