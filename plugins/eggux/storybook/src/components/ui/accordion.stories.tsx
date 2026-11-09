import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Calendar, CircleCheck, Clock, CreditCard, MapPin, Receipt, User, X } from '@/components/icons';
import { Accordion, AccordionItem, type AccordionProps } from './accordion';
import { Badge } from './badge';

// Story-only switches: they set the same thing on every item, since one list matches.
type ItemSwitches = {
  showLeadingIcon: boolean;
  showMeta: boolean;
  showDescription: boolean;
  disabledItem: boolean;
};
type Args = AccordionProps & ItemSwitches;

const faq = [
  { value: 'plan', title: 'Can I change my plan later?', icon: <CreditCard />, meta: 'Plans', description: 'Upgrades, downgrades and proration', answer: 'Yes. Upgrade or downgrade any time; we prorate the difference on your next invoice.' },
  { value: 'trial', title: 'Do you offer a free trial?', icon: <Clock />, meta: 'Trial', description: '14 days, no card needed', answer: 'Every plan starts with 14 days free. No card needed until you choose a plan.' },
  { value: 'billing', title: 'How does billing work?', icon: <Receipt />, meta: 'Billing', description: 'Monthly or yearly invoices in EUR', answer: 'We invoice monthly or yearly in EUR. Invoices arrive by email and stay in Settings › Billing.' },
  { value: 'cancel', title: 'Can I cancel at any time?', icon: <X />, meta: 'Account', description: 'What stays after you cancel', answer: 'Yes. Your workspace stays readable until the end of the paid period.' },
];

const faqItems = ({ showLeadingIcon, showMeta, showDescription, disabledItem }: Partial<ItemSwitches> = {}) =>
  faq.map((f, i) => (
    <AccordionItem
      key={f.value}
      value={f.value}
      title={f.title}
      leadingIcon={showLeadingIcon ? f.icon : undefined}
      meta={showMeta ? <Badge variant="secondary" shape="pill">{f.meta}</Badge> : undefined}
      description={showDescription ? f.description : undefined}
      disabled={disabledItem && i === faq.length - 1}
    >
      <p>{f.answer}</p>
    </AccordionItem>
  ));

// Only the switches a designer needs; value, dir, children and handlers stay out of Controls.
// controls.include matches the shown argType names below, not the arg keys.
const look = ['Style', 'Size', 'Icon', 'Type', 'Collapsible', 'Disabled'];
const switches = ['Show leading icon', 'Show meta', 'Show description', 'Disable last item'];

const meta = {
  title: 'Components/Accordion/Accordion',
  // No `component`: the argTypes below are the whole Controls panel, in this order, without the
  // props docgen would add (value, dir, onValueChange) ahead of them.
  parameters: {
    layout: 'padded',
    controls: { include: [...look, ...switches] },
    docs: { description: { component: 'Stacked sections that open in place: FAQs, settings and filter groups. Style=default in apps and panels, Style=card with Icon=plus on marketing and help pages; one Style per list. Leading icon, Meta and Description are set on each Accordion Item; in Controls they switch on for every item. Description is code only (not in Figma). Figma: Accordion page / Accordion, Accordion Item. Guide: eggux build-ui/components/accordion.md' } },
  },
  argTypes: {
    accordionStyle: { name: 'Style', control: 'inline-radio', options: ['default', 'card'], table: { category: 'Accordion' } },
    size: { name: 'Size', control: 'inline-radio', options: ['default', 'sm'], table: { category: 'Accordion' } },
    icon: { name: 'Icon', control: 'inline-radio', options: ['chevron', 'plus'], table: { category: 'Accordion' } },
    type: { name: 'Type', control: 'inline-radio', options: ['multiple', 'single'], description: 'multiple: several open at once. single: one at a time.', table: { category: 'Accordion' } },
    collapsible: { name: 'Collapsible', control: 'boolean', description: 'single only: the open item can close again.', if: { arg: 'type', eq: 'single' }, table: { category: 'Accordion' } },
    disabled: { name: 'Disabled', control: 'boolean', table: { category: 'Accordion' } },
    showLeadingIcon: { name: 'Show leading icon', control: 'boolean', description: 'AccordionItem `leadingIcon`', table: { category: 'Items' } },
    showMeta: { name: 'Show meta', control: 'boolean', description: 'AccordionItem `meta`: a Badge or a short summary', table: { category: 'Items' } },
    showDescription: { name: 'Show description', control: 'boolean', description: 'AccordionItem `description`: a muted line under the title (code only)', table: { category: 'Items' } },
    disabledItem: { name: 'Disable last item', control: 'boolean', description: 'AccordionItem `disabled`', table: { category: 'Items' } },
  },
  args: {
    accordionStyle: 'default',
    size: 'default',
    icon: 'chevron',
    type: 'multiple',
    collapsible: true,
    disabled: false,
    defaultValue: ['plan'],
    showLeadingIcon: false,
    showMeta: false,
    showDescription: false,
    disabledItem: false,
  },
  render: ({ showLeadingIcon, showMeta, showDescription, disabledItem, children, type, defaultValue, ...args }) => {
    // Single takes a string value; keep the first open item when switching Type in Controls.
    const open = type === 'single' ? (Array.isArray(defaultValue) ? defaultValue[0] : defaultValue) : defaultValue;
    return (
      <Accordion key={type} type={type} defaultValue={open} {...args}>
        {children ?? faqItems({ showLeadingIcon, showMeta, showDescription, disabledItem })}
      </Accordion>
    );
  },
  decorators: [Story => <div className="w-[640px] max-w-full"><Story /></div>],
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

const triggerHeight = (el: HTMLElement) => Math.round(el.closest('[data-slot="accordion-item"]')!.getBoundingClientRect().height);

// Figma Style=default, Icon=chevron, Size=default: collapsed item 53, expanded 89.
export const DefaultCheck: Story = {
  tags: ['!dev'],
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
// Playground: no play function, so changing Controls never shows a failed test. The checks run in DefaultCheck.
export const Default: Story = { ...DefaultCheck, tags: [], play: undefined };

// Every item switch on: leading icon, Meta badge and the description line under the title.
export const WithDetails: Story = {
  args: { showLeadingIcon: true, showMeta: true, showDescription: true, disabledItem: true, defaultValue: [] },
  play: async ({ canvas, canvasElement }) => {
    // The name is the title and Meta; the description is read as the button's description.
    const plan = canvas.getByRole('button', { name: 'Can I change my plan later? Plans' });
    await expect(plan).toHaveAccessibleDescription('Upgrades, downgrades and proration');
    await expect(canvas.getByText('Upgrades, downgrades and proration')).toBeVisible();
    await expect(plan.querySelectorAll('svg')).toHaveLength(2);
    await expect(canvas.getByRole('button', { name: /Can I cancel at any time/ })).toBeDisabled();
    const desc = canvasElement.querySelector('[data-slot="accordion-description"]')!;
    await expect(getComputedStyle(desc).fontWeight).toBe('400');
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

// Figma Size=sm: side panels and dense lists, collapsed 45. Switch Style in Controls for the card.
export const Small: Story = {
  args: { size: 'sm', defaultValue: [] },
  decorators: [Story => <div className="w-[280px]"><Story /></div>],
  play: async ({ canvas }) => {
    await expect(triggerHeight(canvas.getByRole('button', { name: 'Can I change my plan later?' }))).toBe(45);
  },
};

// Figma Example / filter panel: Size=sm, leading icons on all groups, Meta = Badge Count of
// active values; groups with active filters open by default.
const count = (n: number) => (
  <Badge variant="secondary" shape="pill" className="min-w-5 px-1.5" aria-label={`${n} selected`}>{n}</Badge>
);
export const FilterPanel: Story = {
  parameters: { controls: { include: look } },
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

/* Hidden checks (not in the sidebar). */

// Keyboard: Tab reaches the first trigger, arrows move between items, Enter and Space toggle.
export const Keyboard: Story = {
  tags: ['!dev'],
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

// Figma Size=sm, Style=card: collapsed 46.
export const SmallCard: Story = {
  tags: ['!dev'],
  args: { size: 'sm', accordionStyle: 'card', defaultValue: [] },
  decorators: [Story => <div className="w-[280px]"><Story /></div>],
  play: async ({ canvas }) => {
    await expect(triggerHeight(canvas.getByRole('button', { name: 'Can I change my plan later?' }))).toBe(46);
  },
};

// Stress test (Figma "Stress test / Accordion"): long titles wrap, the icon and Meta keep their size.
export const LongTitle: Story = {
  tags: ['!dev'],
  args: {
    size: 'sm',
    defaultValue: [],
    children: [
      <AccordionItem key="a" value="a" title="What happens to invoices that were already sent when the customer moves to another billing entity?" meta={count(12)} description="And a long description under it that wraps onto a second line as well"><p>They stay with the old entity.</p></AccordionItem>,
      <AccordionItem key="b" value="b" title="Short"><p>Fine.</p></AccordionItem>,
    ],
  },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  play: async ({ canvas, canvasElement }) => {
    const trigger = canvas.getAllByRole('button')[0]!;
    const icon = trigger.querySelector('svg:last-of-type') as SVGElement;
    await expect(Math.round(icon.getBoundingClientRect().width)).toBe(16);
    await expect(trigger.getBoundingClientRect().height).toBeGreaterThan(45);
    const root = canvasElement.querySelector('[data-slot="accordion"]') as HTMLElement;
    await expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth);
  },
};

const allOn = { showLeadingIcon: true, showMeta: true, showDescription: true };
export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const CardWithPlusDark: Story = { ...CardWithPlus, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
export const WithDetailsDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' }, args: { ...allOn, defaultValue: ['plan'] } };
export const WithDetailsCorporate: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' }, args: { ...allOn, accordionStyle: 'card', size: 'sm', defaultValue: ['plan'] } };
