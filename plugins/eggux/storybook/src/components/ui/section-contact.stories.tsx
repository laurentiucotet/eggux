import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { BookADemo, Contact, ContactCards, ContactWithMap, MapSection, Offices } from './section-contact';

const meta = {
  title: 'Blocks/Sections/Contact',
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'How people reach you. Contact: channels and a short form. Contact Cards: one card per channel. Contact with Map and Map Section: only when people visit, always with the written address, hours and directions. Offices: one Location Card per city. Book a Demo: B2B sales pages, pitch and proof left, a short form right. Forms show an inline success that says what happens next. Figma: BLOCKS / Sections (Contact). Guide: eggux build-ui/patterns/marketing-pages.md' } },
  },
} satisfies Meta;
export default meta;

const cat = (category: string) => ({ table: { category } });
const text = (name: string, description: string, category = 'Content') => ({ name, control: 'text' as const, description, ...cat(category) });

type IntroArgs = { overline: string; title: string; description: string };
const introArgTypes = (category = 'Content') => ({
  overline: text('Overline', 'Short label above the title.', category),
  title: text('Title', 'Section title (h2).', category),
  description: text('Description', 'The reply time or what to expect.', category),
});

export const Default: StoryObj<IntroArgs> = {
  name: 'Contact',
  args: { overline: 'Contact', title: 'Talk to our team', description: 'Questions about plans, security or a migration? We answer within one business day.' },
  argTypes: introArgTypes(),
  render: a => <Contact {...a} />,
};

export const Cards: StoryObj<IntroArgs> = {
  name: 'Contact Cards',
  args: { overline: 'Contact', title: 'Talk to the right team', description: 'Sales, support or a visit: we answer within one business day.' },
  argTypes: introArgTypes('Section Header'),
  render: a => <ContactCards header={a} />,
};

type MapArgs = IntroArgs & { address: string; phone: string; hours: string };
export const WithMap: StoryObj<MapArgs> = {
  name: 'Contact with Map',
  args: {
    overline: 'Contact',
    title: 'Visit or write to us',
    description: 'Tell us what you need and the right person replies within a day.',
    address: 'Strada Exemplu 12, Floor 3, 010101 Bucharest, Romania',
    phone: '+40 21 555 0100',
    hours: 'Monday to Friday, 9:00 to 18:00',
  },
  argTypes: {
    ...introArgTypes('Section Header'),
    address: text('Address', 'The full written address, next to the map.', 'Place'),
    phone: text('Phone', 'International format.', 'Place'),
    hours: text('Hours', 'Opening hours.', 'Place'),
  },
  render: a => <ContactWithMap header={{ overline: a.overline, title: a.title, description: a.description }} address={a.address} phone={a.phone} hours={a.hours} />,
};

export const OfficesStory: StoryObj<IntroArgs> = {
  name: 'Offices',
  args: { overline: 'Offices', title: 'Find us in three cities', description: 'Walk in or book a meeting with the local team.' },
  argTypes: introArgTypes('Section Header'),
  render: a => <Offices header={a} />,
};

type MapSectionArgs = { overline: string; title: string; address: string; hours: string; phone: string };
export const MapSectionStory: StoryObj<MapSectionArgs> = {
  name: 'Map Section',
  args: { overline: 'Headquarters', title: 'Acme HQ', address: 'Strada Exemplu 12, Floor 3, Bucharest', hours: 'Monday to Friday, 9:00 to 18:00', phone: '+40 21 555 0100' },
  argTypes: {
    overline: text('Overline', 'Kind of place.'),
    title: text('Title', 'Place name (h2).'),
    address: text('Address', 'The full written address.'),
    hours: text('Hours', 'Opening hours.'),
    phone: text('Phone', 'International format.'),
  },
  render: a => <MapSection {...a} />,
};

type DemoArgs = IntroArgs & { formTitle: string; formDescription: string };
export const BookADemoStory: StoryObj<DemoArgs> = {
  name: 'Book a Demo',
  args: {
    overline: 'Book a demo',
    title: 'See Acme on your own invoices',
    description: 'A 30-minute call with a product specialist. Bring a real invoice run and we set it up with you, live.',
    formTitle: 'Book a 30-minute demo',
    formDescription: 'Tell us a little about your team. You pick a time on the next step.',
  },
  argTypes: {
    ...introArgTypes('Pitch'),
    formTitle: text('Form title', 'Card title above the form.', 'Form'),
    formDescription: text('Form description', 'What happens after sending.', 'Form'),
  },
  render: a => <BookADemo {...a} />,
};

/* Hidden checks */

const box = (el: Element) => el.getBoundingClientRect();
const r = (n: number) => Math.round(n);
const tops = (els: Element[]) => new Set(els.map(e => r(box(e).top))).size;
const slot = (root: Element, name: string) => root.querySelector(`[data-slot="${name}"]`)!;
const items = (root: Element, sel: string) => [...root.querySelectorAll(sel)];

const All = ({ width }: { width: number }) => (
  <div className="flex flex-col" style={{ width }}>
    <Contact />
    <ContactCards />
    <ContactWithMap />
    <Offices />
    <MapSection />
    <BookADemo />
  </div>
);

const names = ['Talk to our team', 'Talk to the right team', 'Visit or write to us', 'Find us in three cities', 'Acme HQ', 'See Acme on your own invoices'];

async function common(root: HTMLElement, width: number) {
  const c = within(root);
  await expect(root.querySelectorAll('h1')).toHaveLength(0);
  const regions = c.getAllByRole('region');
  await expect(regions).toHaveLength(6);
  for (const s of regions) {
    await expect(s).toHaveAccessibleName();
    await expect(s.scrollWidth).toBeLessThanOrEqual(width);
  }
  for (const n of names) await expect(c.getByRole('heading', { level: 2, name: n })).toBeVisible();
  await expect(c.getAllByRole('heading', { level: 2 })).toHaveLength(6);
  for (const el of [...c.queryAllByRole('link'), ...c.queryAllByRole('button'), ...c.queryAllByRole('combobox'), ...c.queryAllByRole('textbox'), ...c.queryAllByRole('checkbox')]) await expect(el).toHaveAccessibleName();
  for (const img of root.querySelectorAll('img')) await expect(img).toHaveAttribute('alt');
  await expect((root.firstElementChild as HTMLElement).scrollWidth).toBeLessThanOrEqual(width);
}

export const Check1440: StoryObj = {
  tags: ['!dev'],
  render: () => <All width={1440} />,
  play: async ({ canvasElement }) => {
    await common(canvasElement, 1440);
    const c = within(canvasElement);
    // Contact: info and form card side by side, 64 apart, inside 1152 with 96 padding.
    const contact = c.getByRole('region', { name: 'Talk to our team' });
    const info = slot(contact, 'contact-info');
    const card = slot(contact, 'contact-form-card');
    await expect(r(box(info).top - box(contact).top)).toBe(96);
    await expect(r(box(card).left - box(info).right)).toBe(64);
    await expect(r(box(card).right - box(info).left)).toBe(1152);
    await expect(within(contact).getByRole('link', { name: 'hello@acme.example' })).toHaveAttribute('href', 'mailto:hello@acme.example');
    // Contact Cards: four 270 cards 24 apart, one row, Feature Item titles h3.
    const cards = c.getByRole('region', { name: 'Talk to the right team' });
    const cells = items(slot(cards, 'contact-cards-grid'), ':scope > li');
    await expect(tops(cells)).toBe(1);
    await expect(r(box(cells[0]!).width)).toBe(270);
    await expect(r(box(cells[1]!).left - box(cells[0]!).right)).toBe(24);
    await expect(within(cards).getAllByRole('heading', { level: 3 })).toHaveLength(4);
    // Contact with Map: two 544 columns 64 apart; map 360 high; written address next to it.
    const withMap = c.getByRole('region', { name: 'Visit or write to us' });
    const row = slot(withMap, 'contact-with-map-row');
    await expect(r(box(row.children[0]!).width)).toBe(544);
    await expect(r(box(row.children[1]!).left - box(row.children[0]!).right)).toBe(64);
    await expect(r(box(slot(withMap, 'map')).height)).toBe(360);
    await expect(within(withMap).getByText('Strada Exemplu 12, Floor 3, 010101 Bucharest, Romania', { selector: 'address' })).toBeVisible();
    // Offices: three 368 Location Cards 24 apart, map 180 high, directions open a new tab.
    const offices = c.getByRole('region', { name: 'Find us in three cities' });
    const loc = items(offices, '[data-slot="location-card"]');
    await expect(loc).toHaveLength(3);
    await expect(tops(loc)).toBe(1);
    await expect(r(box(loc[0]!).width)).toBe(368);
    await expect(r(box(slot(loc[0]!, 'location-card-map')).height)).toBe(180);
    await expect(within(offices).getByRole('link', { name: /Get directions to the Berlin office/ })).toHaveAttribute('target', '_blank');
    // Map Section: 560 high map across the page, 360 card at the container start.
    const ms = c.getByRole('region', { name: 'Acme HQ' });
    await expect(r(box(ms).height)).toBe(560);
    await expect(r(box(slot(ms, 'map')).width)).toBe(1440);
    const msCard = slot(ms, 'map-section-card');
    await expect(r(box(msCard).width)).toBe(360);
    await expect(r(box(msCard).left - box(ms).left)).toBe(144);
    await expect(within(ms).getByRole('link', { name: 'Call us' })).toHaveAttribute('href', 'tel:+40215550100');
    // Book a Demo: pitch next to a 480 card, 64 apart, on the muted band.
    const demo = c.getByRole('region', { name: 'See Acme on your own invoices' });
    const pitch = slot(demo, 'book-a-demo-pitch');
    const demoCard = slot(demo, 'book-a-demo-card');
    await expect(r(box(demoCard).width)).toBe(480);
    await expect(r(box(pitch).width)).toBe(608);
    await expect(r(box(demoCard).left - box(pitch).right)).toBe(64);
    await expect(items(demo, '[data-slot="check-item"]')).toHaveLength(4);
    await expect(tops(items(demo, '[data-slot="logo-tile"]'))).toBe(2);
    await expect(within(demo).getByRole('heading', { level: 3, name: 'Book a 30-minute demo' })).toBeVisible();
  },
};

export const Check768: StoryObj = {
  tags: ['!dev'],
  render: () => <All width={768} />,
  play: async ({ canvasElement }) => {
    await common(canvasElement, 768);
    const c = within(canvasElement);
    // Splits stack; cards 2 per row; offices 2 per row; map card sits over a 560 map.
    const contact = c.getByRole('region', { name: 'Talk to our team' });
    await expect(box(slot(contact, 'contact-form-card')).top).toBeGreaterThan(box(slot(contact, 'contact-info')).bottom);
    await expect(tops(items(slot(c.getByRole('region', { name: 'Talk to the right team' }), 'contact-cards-grid'), ':scope > li'))).toBe(2);
    const row = slot(c.getByRole('region', { name: 'Visit or write to us' }), 'contact-with-map-row');
    await expect(box(row.children[1]!).top).toBeGreaterThan(box(row.children[0]!).bottom);
    await expect(tops(items(c.getByRole('region', { name: 'Find us in three cities' }), '[data-slot="location-card"]'))).toBe(2);
    const demo = c.getByRole('region', { name: 'See Acme on your own invoices' });
    await expect(box(slot(demo, 'book-a-demo-card')).top).toBeGreaterThan(box(slot(demo, 'book-a-demo-pitch')).bottom);
  },
};

export const Check390: StoryObj = {
  tags: ['!dev'],
  render: () => <All width={390} />,
  play: async ({ canvasElement }) => {
    await common(canvasElement, 390);
    const c = within(canvasElement);
    // One per row, 24 gutters; Map Section card under a 320 map.
    const cards = c.getByRole('region', { name: 'Talk to the right team' });
    await expect(tops(items(slot(cards, 'contact-cards-grid'), ':scope > li'))).toBe(4);
    await expect(r(box(slot(cards, 'contact-cards-grid')).left - box(cards).left)).toBe(24);
    await expect(tops(items(c.getByRole('region', { name: 'Find us in three cities' }), '[data-slot="location-card"]'))).toBe(3);
    const ms = c.getByRole('region', { name: 'Acme HQ' });
    await expect(r(box(slot(ms, 'map')).height)).toBe(320);
    await expect(box(slot(ms, 'map-section-card')).top).toBeGreaterThanOrEqual(box(slot(ms, 'map')).bottom);
  },
};

/** Sending a form shows the inline success with what happens next. */
export const SendCheck: StoryObj = {
  tags: ['!dev'],
  render: () => <ContactWithMap />,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.type(c.getByRole('textbox', { name: 'Full name' }), 'Ana Popescu');
    await userEvent.type(c.getByRole('textbox', { name: 'Work email' }), 'ana@northwind.example');
    await userEvent.type(c.getByRole('textbox', { name: 'How can we help?' }), 'We want to automate approvals.');
    await userEvent.click(c.getByRole('button', { name: 'Send message' }));
    await waitFor(() => expect(c.getByText('Message sent')).toBeVisible());
  },
};

export const AllDark: StoryObj = { tags: ['!dev'], globals: { theme: 'Dark' }, render: () => <All width={1440} /> };
export const AllBackOffice: StoryObj = { tags: ['!dev'], globals: { theme: 'Corporate Light' }, render: () => <All width={1440} /> };
