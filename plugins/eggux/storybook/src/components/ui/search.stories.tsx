import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';
import { Download, FileText, LayoutGrid } from '@/components/icons';
import { Avatar } from './avatar';
import { Button } from './button';
import { DateTile } from './date-tile';
import { SearchAnswer, SearchMediaThumbnail, SearchResultItem, SearchSuggestions, type SuggestionItemData, type SuggestionSection } from './search';
import { Thumbnail } from './thumbnail';

const allSuggestions = ['invoice templates', 'invoices from last month', 'inventory report', 'invite teammates'];
const records: SuggestionItemData[] = [
  { id: 'r1', type: 'record', label: 'INV-2041 · Acme Inc.', meta: 'Invoice', icon: <FileText /> },
  { id: 'r2', type: 'record', label: 'INV-2038 · Northwind Traders', meta: 'Invoice', icon: <FileText /> },
  { id: 'r3', type: 'record', label: 'Inventory count, October', meta: 'Report', icon: <LayoutGrid /> },
];

function SearchDemo() {
  const listboxId = React.useId();
  const [query, setQuery] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [recent, setRecent] = React.useState<SuggestionItemData[]>([
    { id: 'h1', type: 'recent', label: 'overdue invoices' },
    { id: 'h2', type: 'recent', label: 'acme' },
  ]);
  const [active, setActive] = React.useState<string | null>(null);
  const [picked, setPicked] = React.useState('');
  const q = query.trim().toLowerCase();
  const sections: SuggestionSection[] = q
    ? [
        { id: 'suggestions', label: 'Suggestions', items: allSuggestions.filter(s => s.startsWith(q)).slice(0, 5).map(s => ({ id: `s-${s}`, type: 'suggestion', label: s })) },
        { id: 'records', label: 'Invoices', items: records.filter(r => r.label.toLowerCase().includes(q)).slice(0, 5) },
      ]
    : [{ id: 'recent', label: 'Recent searches', items: recent }];
  const flat = sections.flatMap(s => s.items);
  const optionId = (id: string) => `${listboxId}-${id}`;
  const choose = (item: SuggestionItemData | null) => {
    setPicked(item ? item.label : `search: ${query}`);
    setOpen(false);
    setActive(null);
  };
  return (
    <div className="relative w-[480px]">
      <input
        role="combobox"
        aria-label="Search"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-autocomplete="list"
        aria-activedescendant={active ? optionId(active) : undefined}
        value={query}
        onFocus={() => setOpen(true)}
        onChange={e => { setQuery(e.target.value); setOpen(true); setActive(null); }}
        onKeyDown={e => {
          const i = flat.findIndex(f => f.id === active);
          if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); setActive(flat[(i + 1) % flat.length]?.id ?? null); }
          else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(flat[(i - 1 + flat.length) % flat.length]?.id ?? null); }
          else if (e.key === 'Enter') { e.preventDefault(); choose(flat.find(f => f.id === active) ?? null); }
          else if (e.key === 'Escape') { setOpen(false); setActive(null); }
          else if (e.key === 'Delete' && active?.startsWith('h')) { e.preventDefault(); setRecent(r => r.filter(x => x.id !== active)); setActive(null); }
        }}
        className="h-[var(--control-height)] w-full rounded-input border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
      />
      {open ? (
        <SearchSuggestions
          className="absolute top-full mt-1"
          listboxId={listboxId}
          sections={sections}
          query={q}
          activeId={active}
          optionId={optionId}
          onSelect={choose}
          onRemoveRecent={item => setRecent(r => r.filter(x => x.id !== item.id))}
          emptyText={q ? `No matches for “${query}”` : undefined}
        />
      ) : null}
      <p className="mt-72 text-sm">Picked: {picked}</p>
    </div>
  );
}

const meta = {
  title: 'Components/Search/Search Suggestions',
  component: SearchSuggestions,
  parameters: { controls: { disable: true },
    layout: 'padded',
    docs: { description: { component: 'The panel under a search field while people type: recent searches before typing, suggestions with the typed part in medium, matching records opened directly, and a hint. Up / Down move, Enter opens (or searches all), Escape closes, Delete removes a recent search. Search Result Item shows one result on a search page; Search Answer is the one AI answer at the top. Global search with commands uses Command Dialog. Figma: Search page / Search Suggestions, Search Suggestion Item, Search Result Item. Guide: eggux build-ui/patterns/search-and-filter.md' } },
  },
  args: { listboxId: 'lb', sections: [], optionId: (id: string) => id },
  render: () => <SearchDemo />,
} satisfies Meta<typeof SearchSuggestions>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();

// Combobox: recents on focus (44 rows), typing shows suggestions and invoices, arrows and Enter pick, Delete removes a recent.
export const Default: Story = {
  play: async ({ canvas, canvasElement }) => {
    const input = canvas.getByRole('combobox', { name: 'Search' });
    await userEvent.click(input);
    await expect(canvas.getByRole('group', { name: 'Recent searches' })).toBeInTheDocument();
    const firstRow = canvasElement.querySelector('[data-slot="search-suggestion-item"]')!;
    // Figma Type=recent is 44 (the 28 remove x); suggestions and records are 36.
    await expect(Math.round(box(firstRow).height)).toBe(44);
    await userEvent.keyboard('{ArrowDown}{Delete}');
    await expect(canvas.queryByRole('option', { name: 'overdue invoices' })).toBeNull();
    await userEvent.type(input, 'inv');
    await expect(canvas.getByRole('group', { name: 'Invoices' })).toBeInTheDocument();
    await userEvent.keyboard('{ArrowDown}');
    const first = canvas.getByRole('option', { name: 'invoice templates' });
    await expect(first).toHaveAttribute('aria-selected', 'true');
    await expect(input).toHaveAttribute('aria-activedescendant', first.id);
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(canvas.getByText('Picked: invoice templates')).toBeInTheDocument());
  },
};

const docLeading = <span aria-hidden="true" className="flex size-10 items-center justify-center rounded-md bg-muted [&_svg]:size-5"><FileText /></span>;

// Search Result Item types and the AI answer.
export const Results: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const [fb, setFb] = React.useState<'up' | 'down' | null>(null);
    return (
      <div className="flex w-[640px] flex-col">
        <SearchAnswer question="How do I remind a client about an overdue invoice?" answer="Open the invoice and choose Send reminder. Acme emails the client the amount due with a payment link and logs it in the activity." feedback={fb} onFeedback={setFb} />
        <SearchResultItem path={['Help center', 'Invoices']} href="#a1" title={<>Send a payment <mark>reminder</mark> for an overdue invoice</>} snippet={<>Open the invoice and choose <mark>Send reminder</mark>. Acme emails the client with the amount due and a payment link, and logs it in the activity.</>} badge={{ label: 'Article' }} details="Updated 12 Oct 2026" />
        <SearchResultItem type="record" href="#inv" leading={docLeading} title="INV-1041 · Northwind Traders" badge={{ label: 'Overdue', variant: 'soft-warning' }} details="Invoice · €1,240.00 · Due 30 Oct 2026 · Updated 12 Oct" />
        <SearchResultItem type="person" href="#maria" leading={<Avatar size="lg" initials="MI" />} title="Maria Ilie" details="Head of Finance Operations · maria@acme.com" actions={<Button variant="outline" size="sm">Message</Button>} />
        <SearchResultItem type="file" href="#file" leading={docLeading} title="Q4 forecast.pdf" details="PDF · 2.4 MB · Updated 12 Oct · Maria Ilie" actions={<Button variant="ghost" size="sm" aria-label="Download Q4 forecast.pdf"><Download aria-hidden="true" /></Button>} />
        <SearchResultItem type="media" href="#video" leading={<SearchMediaThumbnail duration="12:40" />} title="Send your first invoice in three minutes" snippet={<>A short walkthrough: add a client, add line items, then send the <mark>invoice</mark> with a payment link.</>} details="Video · Acme Academy · Updated 12 Oct 2026" />
        <SearchResultItem type="product" href="#tote" leading={<Thumbnail size="xl" />} title="Linen tote bag" snippet="Washed linen, leather handles, inside pocket." details="€39.00" />
        <SearchResultItem type="event" href="#ev" leading={<DateTile month="Nov" day="14" dateTime="2026-11-14" label="14 November 2026" />} title="Year-end close workshop" badge={{ label: 'Online', variant: 'outline' }} details="Thu 14 Nov, 15:00-16:00 · Zoom" />
      </div>
    );
  },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole('region', { name: /How do I remind a client/ })).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: 'Helpful' }));
    await expect(canvas.getByRole('button', { name: 'Helpful' })).toHaveAttribute('aria-pressed', 'true');
    await expect(canvas.getByRole('link', { name: 'Send a payment reminder for an overdue invoice' })).toHaveAttribute('href', '#a1');
    const record = canvasElement.querySelector('[data-type="record"]')!;
    await expect(Math.round(box(record).height)).toBe(72);
    await expect(canvas.getByRole('button', { name: 'Message' })).toBeInTheDocument();
    // Media: 160 × 90 poster with play and duration; Figma row 116.
    const media = canvasElement.querySelector('[data-type="media"]')!;
    await expect(Math.round(box(media).height)).toBe(116);
    await expect(Math.round(box(media.querySelector('[data-slot="search-media-thumbnail"]')!).width)).toBe(160);
  },
};

export const DefaultDark: Story = { parameters: { controls: { disable: true } }, tags: ['!dev'], globals: { theme: 'Dark' }, render: Results.render };
export const DefaultCorporate: Story = { parameters: { controls: { disable: true } }, tags: ['!dev'], globals: { theme: 'Corporate Light' }, render: Results.render };
