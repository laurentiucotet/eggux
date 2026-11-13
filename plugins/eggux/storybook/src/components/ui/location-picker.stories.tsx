import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, userEvent, waitFor } from 'storybook/test';
import { LocationPicker, type LocationPlace } from './location-picker';

const places: LocationPlace[] = [
  { id: 'central', name: 'Acme Central', detail: '12 Market Street, Springfield 10115' },
  { id: 'riverside', name: 'Acme Riverside', detail: '88 Quay Road, Springfield 10117' },
  { id: 'park', name: 'Acme Park', detail: '5 Garden Walk, Shelbyville 20311' },
  { id: 'station', name: 'Acme Station', detail: 'Station Square, Shelbyville 20310' },
  { id: 'harbour', name: 'Acme Harbour', detail: '1 Pier Street, Capital City 30112' },
];
const here: LocationPlace = { id: 'here', name: 'Current location', detail: '44 Elm Avenue, Springfield' };

type Args = { label: string; placeholder: string; startWith: string; showHint: boolean; showError: boolean; showLocate: boolean; disabled: boolean; width: number };

const meta = {
  title: 'Components/Location/Location Picker',
  parameters: {
    docs: {
      description: {
        component:
          'A Field-like control for choosing a place: a label, a button that looks like an input and opens a Popover with a search box, the matching places and a "Use my location" button. The chosen place is a Chip with a remove button. The list is a combobox (arrows and Enter), Escape closes and focus returns to the trigger. Code only (no Figma component yet).',
      },
    },
  },
  args: { label: 'Delivery location', placeholder: 'Search for a place', startWith: 'none', showHint: false, showError: false, showLocate: true, disabled: false, width: 360 },
  argTypes: {
    label: { name: 'Label', control: 'text', description: 'Always visible.', table: { category: 'Field' } },
    placeholder: { name: 'Placeholder', control: 'text', description: 'On the trigger while nothing is chosen.', table: { category: 'Field' } },
    startWith: { name: 'Chosen place', control: 'select', options: ['none', ...places.map(p => p.id)], description: 'The place chosen at the start.', table: { category: 'Field' } },
    disabled: { name: 'Disabled', control: 'boolean', description: 'Blocks the control.', table: { category: 'Field' } },
    showHint: { name: 'Show hint', control: 'boolean', description: 'Help text under the control.', table: { category: 'Parts' } },
    showError: { name: 'Show error', control: 'boolean', description: 'An error under the control.', table: { category: 'Parts' } },
    showLocate: { name: 'Show Use my location', control: 'boolean', description: 'The geolocation button in the popover.', table: { category: 'Parts' } },
    width: { name: 'Width', control: { type: 'range', min: 240, max: 560, step: 4 }, description: 'Width in px.', table: { category: 'Layout' } },
  },
  render: ({ label, placeholder, startWith, showHint, showError, showLocate, disabled, width }) => (
    <div style={{ width }} className="max-w-full">
      <LocationPicker
        key={startWith}
        label={label}
        placeholder={placeholder}
        places={places}
        defaultValue={places.find(p => p.id === startWith) ?? null}
        hint={showHint ? 'We use it to show the stores that deliver to you.' : undefined}
        error={showError ? 'Choose a place to see delivery options.' : undefined}
        disabled={disabled}
        onLocate={showLocate ? () => new Promise(resolve => setTimeout(() => resolve(here), 400)) : undefined}
      />
    </div>
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** A place already chosen: the chip shows it and its x clears it. */
export const WithPlace: Story = { args: { startWith: 'riverside', showHint: true } };

export const DefaultCheck: Story = {
  tags: ['!dev'],
  render: () => <LocationPicker places={places} onLocate={async () => here} />,
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: 'Delivery location Search for a place' });
    await expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
    await expect(Math.round(trigger.getBoundingClientRect().height)).toBe(36);
    await userEvent.click(trigger);
    const dialog = await screen.findByRole('dialog', { name: 'Choose a place' });
    await expect(dialog).toBeVisible();
    const search = screen.getByRole('combobox', { name: 'Places' });
    await userEvent.type(search, 'quay');
    await waitFor(() => expect(screen.getAllByRole('option').length).toBe(1));
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    // The chosen place is a chip; focus is back on the trigger.
    await expect(canvas.getByText('Acme Riverside')).toBeVisible();
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Delivery location Change place' })).toHaveFocus());
    // Remove it.
    await userEvent.click(canvas.getByRole('button', { name: 'Remove Acme Riverside' }));
    await waitFor(() => expect(canvas.queryByText('Acme Riverside')).toBeNull());
    await expect(canvas.getByRole('button', { name: 'Delivery location Search for a place' })).toBeVisible();
  },
};

export const KeyboardCheck: Story = {
  tags: ['!dev'],
  render: () => <LocationPicker places={places} />,
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: /Delivery location/ });
    trigger.focus();
    await userEvent.keyboard('{Enter}');
    await screen.findByRole('dialog', { name: 'Choose a place' });
    await userEvent.keyboard('{ArrowDown}{Enter}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await waitFor(() => expect(canvas.getByText('Acme Riverside')).toBeVisible());
    // Escape closes without changing the place and returns focus.
    await userEvent.click(canvas.getByRole('button', { name: /Delivery location/ }));
    await screen.findByRole('dialog', { name: 'Choose a place' });
    await userEvent.type(screen.getByRole('combobox', { name: 'Places' }), 'zzz');
    await expect(await screen.findByText('No places match. Try a street or a city.')).toBeVisible();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await expect(canvas.getByText('Acme Riverside')).toBeVisible();
    await waitFor(() => expect(canvas.getByRole('button', { name: /Delivery location/ })).toHaveFocus());
  },
};

export const LocateCheck: Story = {
  tags: ['!dev'],
  render: () => (
    <div className="flex flex-col gap-6">
      <LocationPicker label="Found" places={places} onLocate={async () => here} />
      <LocationPicker label="Not found" places={places} onLocate={async () => null} />
    </div>
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: /^Found/ }));
    await userEvent.click(await screen.findByRole('button', { name: 'Use my location' }));
    await waitFor(() => expect(canvas.getByText('Current location')).toBeVisible());
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await userEvent.click(canvas.getByRole('button', { name: /^Not found/ }));
    await userEvent.click(await screen.findByRole('button', { name: 'Use my location' }));
    await expect(await screen.findByRole('alert')).toHaveTextContent('We could not find your location');
    await expect(screen.getByRole('dialog')).toBeVisible();
    await userEvent.keyboard('{Escape}');
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => (
    <LocationPicker
      label="Delivery location for your weekly grocery order"
      places={places}
      defaultValue={{ id: 'long', name: 'Acme Superstore International Airport Terminal Two Arrivals Hall' }}
      hint="We use it to show the stores that deliver to you and how long each delivery takes."
    />
  ),
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('[data-slot=location-picker]') as HTMLElement;
    await expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth + 1);
    const chip = canvasElement.querySelector('[data-slot=chip]') as HTMLElement;
    await expect(chip.getBoundingClientRect().right).toBeLessThanOrEqual(root.getBoundingClientRect().right + 1);
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
