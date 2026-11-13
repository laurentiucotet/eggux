import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';
import { Button } from './button';
import { MapFrame, type MapFramePin } from './map-frame';

const allPins: MapFramePin[] = [
  { id: 'central', name: 'Acme Central', address: '12 Market Street', x: 48, y: 42 },
  { id: 'riverside', name: 'Acme Riverside', address: '88 Quay Road', x: 30, y: 70 },
  { id: 'park', name: 'Acme Park', address: '5 Garden Walk', x: 72, y: 18 },
  { id: 'north', name: 'Acme North', address: '240 Ridge Road', x: 20, y: 14 },
  { id: 'station', name: 'Acme Station', address: 'Platform Hall, Station Square', x: 82, y: 60 },
  { id: 'mill', name: 'Acme Mill', address: '3 Old Mill Lane', x: 58, y: 80 },
  { id: 'harbour', name: 'Acme Harbour', address: '1 Pier Street', x: 90, y: 88 },
  { id: 'airport', name: 'Acme Airport', address: 'Terminal 2, Arrivals Hall', x: 8, y: 90 },
];

type Args = { pinCount: number; selected: string; view: 'map' | 'list'; zoom: number; showViewToggle: boolean; showCardActions: boolean; width: number };

const actions = (pin: MapFramePin) => (
  <Button size="sm" variant="soft">
    Choose {pin.name}
  </Button>
);

const meta = {
  title: 'Components/Location/Map Frame',
  parameters: {
    docs: {
      description: {
        component:
          'A drawn placeholder map for store and place pickers: grid, river, park and roads as SVG in theme tokens, numbered pins as buttons, zoom buttons, a card for the selected pin and a "List view" toggle with the same places as rows. Tab goes through the pins; with the map focused arrows pan and + / - zoom. No tiles and no network. Code only (no Figma component yet).',
      },
    },
  },
  args: { pinCount: 6, selected: 'none', view: 'map', zoom: 1, showViewToggle: true, showCardActions: true, width: 560 },
  argTypes: {
    pinCount: { name: 'Pins', control: { type: 'range', min: 1, max: 8, step: 1 }, description: 'How many places.', table: { category: 'Map' } },
    selected: { name: 'Selected pin', control: 'select', options: ['none', ...allPins.map(p => p.id)], description: 'The pin with its card open.', table: { category: 'Map' } },
    view: { name: 'View', control: 'inline-radio', options: ['map', 'list'], description: 'The map or the list fallback.', table: { category: 'Map' } },
    zoom: { name: 'Zoom', control: { type: 'range', min: 1, max: 4, step: 1 }, description: 'Start zoom.', table: { category: 'Map' } },
    showViewToggle: { name: 'Show view toggle', control: 'boolean', description: 'The Map and List view switch.', table: { category: 'Parts' } },
    showCardActions: { name: 'Show card actions', control: 'boolean', description: 'A button in the selected card.', table: { category: 'Parts' } },
    width: { name: 'Width', control: { type: 'range', min: 240, max: 760, step: 4 }, description: 'Width in px.', table: { category: 'Layout' } },
  },
  render: ({ pinCount, selected, view, zoom, showViewToggle, showCardActions, width }) => (
    <div style={{ width }} className="max-w-full">
      <MapFrame
        key={`${pinCount}-${selected}-${view}-${zoom}`}
        pins={allPins.slice(0, pinCount)}
        defaultSelectedId={selected === 'none' ? null : selected}
        defaultView={view}
        defaultZoom={zoom}
        showViewToggle={showViewToggle}
        cardActions={showCardActions ? actions : undefined}
      />
    </div>
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** The list fallback: the same places as rows. Choosing one selects it and shows its actions. */
export const ListView: Story = { args: { view: 'list', selected: 'riverside' } };

/** Zoomed in with a place selected: its card sits over the map. */
export const ZoomedWithCard: Story = { args: { zoom: 2, selected: 'central' } };

export const DefaultCheck: Story = {
  tags: ['!dev'],
  render: () => <MapFrame pins={allPins.slice(0, 6)} cardActions={actions} />,
  play: async ({ canvas, canvasElement }) => {
    const map = canvas.getByRole('group', { name: /^Store map\./ });
    await expect(map).toHaveAttribute('data-zoom', '1');
    await expect(canvas.getByRole('status')).toHaveTextContent('Showing 6 of 6 places');
    // Pins are buttons, in the tab order.
    const pin = canvas.getByRole('button', { name: '1, Acme Central' });
    await expect(pin).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(pin);
    await waitFor(() => expect(canvas.getByRole('group', { name: 'Selected place' })).toHaveTextContent('Acme Central'));
    await expect(pin).toHaveAttribute('aria-pressed', 'true');
    await expect(canvas.getByRole('button', { name: 'Choose Acme Central' })).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Close place card' }));
    await waitFor(() => expect(canvas.queryByRole('group', { name: 'Selected place' })).toBeNull());
    // Zoom with the buttons.
    await userEvent.click(canvas.getByRole('button', { name: 'Zoom in' }));
    await waitFor(() => expect(map).toHaveAttribute('data-zoom', '2'));
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Recenter map' })).toBeVisible());
    // The map is 72 high (h-72).
    await expect(Math.round(map.getBoundingClientRect().height)).toBe(288);
    await expect(canvasElement.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  },
};

export const KeyboardCheck: Story = {
  tags: ['!dev'],
  render: () => <MapFrame pins={allPins} />,
  play: async ({ canvas }) => {
    const map = canvas.getByRole('group', { name: /^Store map\./ });
    map.focus();
    await userEvent.keyboard('+');
    await waitFor(() => expect(map).toHaveAttribute('data-zoom', '2'));
    // At zoom 2 the visible window is half the map, so some places are out of view.
    await expect(canvas.getByRole('status')).not.toHaveTextContent('Showing 8 of 8');
    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => expect(map).toHaveAttribute('data-center', '62.5,50'));
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(map).toHaveAttribute('data-center', '62.5,62.5'));
    await userEvent.keyboard('-');
    await waitFor(() => expect(map).toHaveAttribute('data-zoom', '1'));
    await waitFor(() => expect(map).toHaveAttribute('data-center', '50,50'));
    await expect(canvas.getByRole('status')).toHaveTextContent('Showing 8 of 8');
    // Tab goes to the zoom buttons and the pins, never out of order.
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: '1, Acme Central' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(canvas.getByRole('group', { name: 'Selected place' })).toBeVisible());
  },
};

export const ListCheck: Story = {
  tags: ['!dev'],
  render: () => <MapFrame pins={allPins.slice(0, 4)} cardActions={actions} />,
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('radio', { name: 'List view' }));
    const list = await canvas.findByRole('list', { name: /list of places/ });
    await expect(list.querySelectorAll('li').length).toBe(4);
    await userEvent.click(canvas.getByRole('button', { name: /^Acme Riverside/ }));
    await waitFor(() => expect(canvas.getByRole('button', { name: /^Acme Riverside/ })).toHaveAttribute('aria-current', 'true'));
    await expect(canvas.getByRole('button', { name: 'Choose Acme Riverside' })).toBeVisible();
    // Back to the map: the pin stays selected.
    await userEvent.click(canvas.getByRole('radio', { name: 'Map' }));
    await waitFor(() => expect(canvas.getByRole('button', { name: '2, Acme Riverside' })).toHaveAttribute('aria-pressed', 'true'));
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => (
    <MapFrame
      pins={allPins.map(p => ({ ...p, name: `${p.name} Superstore and Garden Centre`, address: `${p.address}, Springfield Heights International Business Park` }))}
      defaultSelectedId="central"
      cardActions={actions}
    />
  ),
  play: async ({ canvas, canvasElement }) => {
    const root = canvasElement.querySelector('[data-slot=map-frame]') as HTMLElement;
    await expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth + 1);
    const card = canvas.getByRole('group', { name: 'Selected place' });
    await expect(card.getBoundingClientRect().right).toBeLessThanOrEqual(root.getBoundingClientRect().right);
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
