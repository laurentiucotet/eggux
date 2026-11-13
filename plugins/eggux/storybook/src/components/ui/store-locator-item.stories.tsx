import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { StoreLocatorItem, type StoreOpenStatus } from './store-locator-item';

type Args = {
  name: string;
  address: string;
  distanceMeters: number;
  unit: 'metric' | 'imperial';
  status: StoreOpenStatus | 'unknown';
  statusText: string;
  selected: boolean;
  selectable: boolean;
  showDistance: boolean;
  showPhone: boolean;
  showDirections: boolean;
  width: number;
};

const meta = {
  title: 'Components/Location/Store Locator Item',
  parameters: {
    docs: {
      description: {
        component:
          'One result of a store locator: name, address, distance, an open status and the Call and Directions actions. The name is a button that stretches over the card, so a click anywhere selects it; the actions keep their own click. The selected item has a primary border and aria-current. Code only (no Figma component yet).',
      },
    },
  },
  args: {
    name: 'Acme Central',
    address: '12 Market Street, Springfield 10115',
    distanceMeters: 1200,
    unit: 'metric',
    status: 'open',
    statusText: 'Closes at 18:00',
    selected: false,
    selectable: true,
    showDistance: true,
    showPhone: true,
    showDirections: true,
    width: 340,
  },
  argTypes: {
    name: { name: 'Name', control: 'text', description: 'The store name.', table: { category: 'Item' } },
    address: { name: 'Address', control: 'text', description: 'The address.', table: { category: 'Item' } },
    distanceMeters: { name: 'Distance (m)', control: { type: 'range', min: 20, max: 20000, step: 10 }, description: 'Distance from the shopper.', table: { category: 'Item' } },
    unit: { name: 'Unit', control: 'inline-radio', options: ['metric', 'imperial'], description: 'Kilometres or miles.', table: { category: 'Item' } },
    status: { name: 'Status', control: 'select', options: ['open', 'closing-soon', 'closed', 'unknown'], description: 'Open state; unknown hides the badge.', table: { category: 'Item' } },
    statusText: { name: 'Status text', control: 'text', description: 'Beside the badge.', table: { category: 'Item' } },
    selected: { name: 'Selected', control: 'boolean', description: 'The item chosen on the map.', table: { category: 'Item' } },
    selectable: { name: 'Selectable', control: 'boolean', description: 'The name is a button that selects the item.', table: { category: 'Item' } },
    showDistance: { name: 'Show distance', control: 'boolean', description: 'The distance badge.', table: { category: 'Parts' } },
    showPhone: { name: 'Show Call', control: 'boolean', description: 'The Call link.', table: { category: 'Parts' } },
    showDirections: { name: 'Show Directions', control: 'boolean', description: 'The Directions link.', table: { category: 'Parts' } },
    width: { name: 'Width', control: { type: 'range', min: 240, max: 480, step: 4 }, description: 'Width in px.', table: { category: 'Layout' } },
  },
  render: ({ status, selectable, showDistance, showPhone, showDirections, width, distanceMeters, ...args }) => (
    <div style={{ width }} className="max-w-full">
      <StoreLocatorItem
        {...args}
        status={status === 'unknown' ? undefined : status}
        distanceMeters={showDistance ? distanceMeters : undefined}
        phone={showPhone ? '+1 555 0100' : undefined}
        directionsHref={showDirections ? 'https://example.com/directions/acme-central' : undefined}
        onSelect={selectable ? () => {} : undefined}
      />
    </div>
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

const stores = [
  { id: 'central', name: 'Acme Central', address: '12 Market Street, Springfield', meters: 450, status: 'open' as const, text: 'Closes at 18:00' },
  { id: 'riverside', name: 'Acme Riverside', address: '88 Quay Road, Springfield', meters: 1900, status: 'closing-soon' as const, text: 'Closes at 17:30' },
  { id: 'airport', name: 'Acme Airport', address: 'Terminal 2, Arrivals Hall', meters: 14500, status: 'closed' as const, text: 'Opens tomorrow at 06:00' },
];

function ListExample({ onPick }: { onPick?: (id: string) => void }) {
  const [selected, setSelected] = React.useState('riverside');
  return (
    <ul className="m-0 flex w-96 max-w-full list-none flex-col gap-3 p-0">
      {stores.map(s => (
        <li key={s.id}>
          <StoreLocatorItem
            name={s.name}
            address={s.address}
            distanceMeters={s.meters}
            status={s.status}
            statusText={s.text}
            phone="+1 555 0100"
            directionsHref={`https://example.com/directions/${s.id}`}
            selected={selected === s.id}
            onSelect={() => {
              setSelected(s.id);
              onPick?.(s.id);
            }}
          />
        </li>
      ))}
    </ul>
  );
}

/** A results list: choosing an item selects it and the others lose the border. */
export const ResultsList: Story = {
  parameters: { controls: { disable: true } },
  render: () => <ListExample />,
};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  render: () => {
    const onSelect = fn();
    return (
      <StoreLocatorItem name="Acme Central" address="12 Market Street, Springfield" distanceMeters={1200} status="open" statusText="Closes at 18:00" phone="+1 555 0100" directionsHref="https://example.com/directions" onSelect={onSelect} />
    );
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { name: 'Acme Central' })).toBeVisible();
    await expect(canvas.getByText('Open now')).toBeVisible();
    await expect(canvas.getByText('Closes at 18:00')).toBeVisible();
    await expect(canvas.getByText('1.2 km')).toBeVisible();
    await expect(canvas.getByRole('link', { name: /^Call Acme Central/ })).toHaveAttribute('href', 'tel:+15550100');
    await expect(canvas.getByRole('link', { name: 'Directions to Acme Central' })).toHaveAttribute('href', 'https://example.com/directions');
    const select = canvas.getByRole('button', { name: 'Acme Central' });
    await expect(select).not.toHaveAttribute('aria-current');
  },
};

export const SelectCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <ListExample />,
  play: async ({ canvas }) => {
    const riverside = canvas.getByRole('button', { name: 'Acme Riverside' });
    await expect(riverside).toHaveAttribute('aria-current', 'true');
    // Keyboard: Tab to the first name, Enter selects it.
    const central = canvas.getByRole('button', { name: 'Acme Central' });
    central.focus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(central).toHaveAttribute('aria-current', 'true'));
    await expect(riverside).not.toHaveAttribute('aria-current');
    // The name stretches over the whole card: its overlay is as large as the card.
    const card = riverside.closest('article') as HTMLElement;
    const overlay = getComputedStyle(riverside, '::after');
    await expect(overlay.position).toBe('absolute');
    await expect(card.getBoundingClientRect().width).toBeGreaterThan(riverside.getBoundingClientRect().width);
    await userEvent.click(riverside);
    await waitFor(() => expect(riverside).toHaveAttribute('aria-current', 'true'));
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => (
    <StoreLocatorItem
      name="Acme Superstore International Airport Terminal Two Arrivals"
      address="Terminal 2, Arrivals Hall, Departures Level, Springfield International Airport 10115"
      distanceMeters={19999}
      status="closing-soon"
      statusText="Closes at 18:00 today, then opens again at 06:00 tomorrow"
      phone="+1 555 0100"
      directionsHref="https://example.com/directions"
      selected
      onSelect={() => {}}
    />
  ),
  play: async ({ canvas, canvasElement }) => {
    const card = canvasElement.querySelector('[data-slot=store-locator-item]') as HTMLElement;
    await expect(card.scrollWidth).toBeLessThanOrEqual(card.clientWidth + 1);
    const name = canvas.getByRole('button', { name: /Acme Superstore/ }).firstElementChild as HTMLElement;
    await expect(name.scrollWidth).toBeGreaterThan(name.clientWidth);
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
