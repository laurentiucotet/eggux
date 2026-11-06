import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';
import { RadioGroup, RadioGroupItem } from './radio';

const meta = {
  title: 'Components/Selection Controls/Radio',
  component: RadioGroup,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Single choice from 2 to 5 options worth seeing: 16 px control, label, optional description under the label. Arrow keys move and select, Space picks. The error state is not built. Built for Option Card. Figma: Radio (Selection controls page). Guide: eggux build-ui/components/select.md' } },
  },
} satisfies Meta<typeof RadioGroup>;
export default meta;
type Story = StoryObj<typeof meta>;

const Group = ({ disabled }: { disabled?: boolean }) => (
  <RadioGroup defaultValue="office" aria-label="Meeting type">
    <RadioGroupItem value="office" label="In person" description="Meet at our office. We send the address with the invite." disabled={disabled} />
    <RadioGroupItem value="video" label="Video call" disabled={disabled} />
    <RadioGroupItem value="phone" label="Phone" disabled={disabled} />
  </RadioGroup>
);

export const Default: Story = {
  render: () => <Group />,
  play: async ({ canvas }) => {
    const radios = canvas.getAllByRole('radio');
    await expect(radios).toHaveLength(3);
    await expect(Math.round(radios[0].getBoundingClientRect().width)).toBe(16);
    await expect(radios[0]).toBeChecked();
    await expect(canvas.getByRole('radio', { name: 'In person' })).toHaveAccessibleDescription(/Meet at our office/);
    await userEvent.click(canvas.getByText('Phone'));
    await expect(canvas.getByRole('radio', { name: 'Phone' })).toBeChecked();
    await expect(radios[0]).not.toBeChecked();
  },
};

export const Keyboard: Story = {
  render: () => <Group />,
  play: async ({ canvas }) => {
    await userEvent.tab();
    await expect(canvas.getByRole('radio', { name: 'In person' })).toHaveFocus();
    // Radix moves focus in a timeout and checks the radio while the arrow key is still down: hold the key.
    await userEvent.keyboard('{ArrowDown>}');
    await waitFor(() => expect(canvas.getByRole('radio', { name: 'Video call' })).toHaveFocus());
    await userEvent.keyboard('{/ArrowDown}');
    await expect(canvas.getByRole('radio', { name: 'Video call' })).toBeChecked();
    await userEvent.keyboard('{ArrowDown>}');
    await waitFor(() => expect(canvas.getByRole('radio', { name: 'Phone' })).toHaveFocus());
    await userEvent.keyboard('{/ArrowDown}');
    await expect(canvas.getByRole('radio', { name: 'Phone' })).toBeChecked();
  },
};

export const Disabled: Story = {
  render: () => <Group disabled />,
  play: async ({ canvas }) => {
    for (const r of canvas.getAllByRole('radio')) await expect(r).toBeDisabled();
    await userEvent.click(canvas.getByText('Phone'));
    await expect(canvas.getByRole('radio', { name: 'Phone' })).not.toBeChecked();
  },
};

export const DefaultDark: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
