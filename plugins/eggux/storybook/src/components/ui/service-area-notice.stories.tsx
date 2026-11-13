import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';
import { Button } from './button';
import { ServiceAreaNotice, type ServiceAreaStatus } from './service-area-notice';

type Args = { status: ServiceAreaStatus; address: string; showDescription: boolean; showChange: boolean; showExtraAction: boolean; width: number };

const descriptions: Record<ServiceAreaStatus, string> = {
  inside: 'Delivery in 30 to 45 minutes. Free over 25.00 EUR.',
  near: 'Delivery in 60 to 75 minutes with a 3.00 EUR edge zone fee.',
  outside: 'You can still pick up your order from Acme Central, 1.4 km away.',
};

const meta = {
  title: 'Components/Location/Service Area Notice',
  parameters: {
    docs: {
      description: {
        component:
          'A banner that says whether an address is inside, near or outside the delivery area, with a Change address action. Each state has its own icon and heading, never colour alone. A polite status: it follows the address the shopper just entered. Code only (no Figma component yet).',
      },
    },
  },
  args: { status: 'inside', address: '12 Market Street, Springfield 10115', showDescription: true, showChange: true, showExtraAction: false, width: 560 },
  argTypes: {
    status: { name: 'Status', control: 'inline-radio', options: ['inside', 'near', 'outside'], description: 'Where the address falls.', table: { category: 'Notice' } },
    address: { name: 'Address', control: 'text', description: 'The address that was checked.', table: { category: 'Notice' } },
    showDescription: { name: 'Show description', control: 'boolean', description: 'The line with the delivery time or the fee.', table: { category: 'Parts' } },
    showChange: { name: 'Show Change address', control: 'boolean', description: 'The Change address button.', table: { category: 'Parts' } },
    showExtraAction: { name: 'Show extra action', control: 'boolean', description: 'A second button (Switch to pickup).', table: { category: 'Parts' } },
    width: { name: 'Width', control: { type: 'range', min: 240, max: 720, step: 4 }, description: 'Width in px.', table: { category: 'Layout' } },
  },
  render: ({ status, address, showDescription, showChange, showExtraAction, width }) => (
    <div style={{ width }} className="max-w-full">
      <ServiceAreaNotice
        status={status}
        address={address}
        description={showDescription ? descriptions[status] : undefined}
        onChangeAddress={showChange ? () => {} : undefined}
        actions={showExtraAction ? <Button size="sm" variant="ghost">Switch to pickup</Button> : undefined}
      />
    </div>
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** The three results for the same street. */
export const AllStates: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex w-[560px] max-w-full flex-col gap-3">
      <ServiceAreaNotice status="inside" address="12 Market Street, Springfield" description={descriptions.inside} onChangeAddress={() => {}} />
      <ServiceAreaNotice status="near" address="240 Ridge Road, Springfield" description={descriptions.near} onChangeAddress={() => {}} />
      <ServiceAreaNotice status="outside" address="9 Hill Lane, Shelbyville" description={descriptions.outside} onChangeAddress={() => {}} actions={<Button size="sm" variant="soft">Switch to pickup</Button>} />
    </div>
  ),
};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  render: function Render() {
    const [count, setCount] = React.useState(0);
    return (
      <>
        <ServiceAreaNotice status="outside" address="9 Hill Lane, Shelbyville" description={descriptions.outside} onChangeAddress={() => setCount(c => c + 1)} />
        <p data-testid="count">{count}</p>
      </>
    );
  },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole('status')).toHaveTextContent('We do not deliver to this address yet');
    await expect(canvas.getByRole('status')).toHaveTextContent('9 Hill Lane, Shelbyville');
    const notice = canvasElement.querySelector('[data-slot=service-area-notice]') as HTMLElement;
    await expect(notice.dataset.status).toBe('outside');
    const change = canvas.getByRole('button', { name: 'Change address' });
    await userEvent.click(change);
    await waitFor(() => expect(canvas.getByTestId('count')).toHaveTextContent('1'));
    change.focus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(canvas.getByTestId('count')).toHaveTextContent('2'));
  },
};

export const StatesCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => {
    return (
      <div className="flex flex-col gap-3">
        <ServiceAreaNotice status="inside" address="12 Market Street" onChangeAddress={() => {}} />
        <ServiceAreaNotice status="near" address="240 Ridge Road" onChangeAddress={() => {}} />
        <ServiceAreaNotice status="outside" address="9 Hill Lane" />
      </div>
    );
  },
  play: async ({ canvas }) => {
    const statuses = canvas.getAllByRole('status');
    await expect(statuses[0]).toHaveTextContent('We deliver to this address');
    await expect(statuses[1]).toHaveTextContent('edge of our delivery area');
    await expect(statuses[2]).toHaveTextContent('We do not deliver');
    // Outside without a handler has no Change address button.
    await expect(canvas.getAllByRole('button', { name: 'Change address' }).length).toBe(2);
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => (
    <ServiceAreaNotice
      status="near"
      address="Apartment 4B, Superintendent's Residence, 1234 Extraordinarily Long Boulevard Name, Springfield Heights 10115"
      description="Delivery in 60 to 75 minutes with a 3.00 EUR edge zone fee and a note for the driver."
      onChangeAddress={() => {}}
      actions={<Button size="sm" variant="ghost">Switch to pickup</Button>}
    />
  ),
  play: async ({ canvasElement }) => {
    const notice = canvasElement.querySelector('[data-slot=service-area-notice]') as HTMLElement;
    await expect(notice.scrollWidth).toBeLessThanOrEqual(notice.clientWidth + 1);
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
