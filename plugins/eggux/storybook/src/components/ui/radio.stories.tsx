import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor } from 'storybook/test';
import { RadioGroup, RadioGroupItem } from './radio';

const meta = {
  title: 'Components/Selection Controls/Radio',
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Single choice from 2 to 5 options worth seeing: 16 px control, label, optional description under the label. Arrow keys move and select, Space picks. The error state is not built. Built for Option Card. Figma: Radio (Selection controls page). Guide: eggux build-ui/components/select.md' } },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const Group = ({ disabled }: { disabled?: boolean }) => (
  <RadioGroup defaultValue="office" aria-label="Meeting type">
    <RadioGroupItem value="office" label="In person" description="Meet at our office. We send the address with the invite." disabled={disabled} />
    <RadioGroupItem value="video" label="Video call" disabled={disabled} />
    <RadioGroupItem value="phone" label="Phone" disabled={disabled} />
  </RadioGroup>
);

type Playground = {
  options: number;
  value: string;
  orientation: 'vertical' | 'horizontal';
  showDescriptions: boolean;
  disabled: boolean;
  disableLast: boolean;
};

const meetingTypes = [
  { value: 'office', label: 'In person', description: 'Meet at our office. We send the address with the invite.' },
  { value: 'video', label: 'Video call', description: 'A link arrives with the invite.' },
  { value: 'phone', label: 'Phone', description: 'We call the number on your profile.' },
  { value: 'chat', label: 'Chat', description: 'Write to us in the app.' },
  { value: 'email', label: 'Email', description: 'Answer within one working day.' },
];

/** Playground: every Radio option in Controls. */
export const Default: StoryObj<Playground> = {
  argTypes: {
    options: { name: 'Number of options', control: { type: 'range', min: 2, max: 5, step: 1 }, description: '2 to 5 options worth seeing; more: use Select', table: { category: 'Radio Group' } },
    value: { name: 'Value', control: 'select', options: ['', ...meetingTypes.map(m => m.value)], description: 'Empty: nothing picked yet', table: { category: 'Radio Group' } },
    orientation: { name: 'Orientation', control: 'inline-radio', options: ['vertical', 'horizontal'], table: { category: 'Radio Group' } },
    disabled: { name: 'Disabled', control: 'boolean', description: 'The whole group', table: { category: 'Radio Group' } },
    showDescriptions: { name: 'Show descriptions', control: 'boolean', description: 'Radio Group Item `description` under the label', table: { category: 'Radio Group Item' } },
    disableLast: { name: 'Disable last option', control: 'boolean', description: 'Radio Group Item `disabled`', table: { category: 'Radio Group Item' } },
  },
  args: { options: 3, value: 'office', orientation: 'vertical', showDescriptions: true, disabled: false, disableLast: false },
  render: a => (
    <RadioGroup
      key={a.value}
      defaultValue={a.value || undefined}
      orientation={a.orientation}
      disabled={a.disabled}
      aria-label="Meeting type"
      className={a.orientation === 'horizontal' ? 'flex flex-row flex-wrap gap-6' : undefined}
    >
      {meetingTypes.slice(0, a.options).map((m, i) => (
        <RadioGroupItem key={m.value} value={m.value} label={m.label} description={a.showDescriptions ? m.description : undefined} disabled={a.disableLast && i === a.options - 1} />
      ))}
    </RadioGroup>
  ),
};

// The checks that used to run on Default (hidden; the playground has no play function).
export const DefaultCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
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
  parameters: { controls: { disable: true } },
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
  parameters: { controls: { disable: true } },
  render: () => <Group disabled />,
  play: async ({ canvas }) => {
    for (const r of canvas.getAllByRole('radio')) await expect(r).toBeDisabled();
    await userEvent.click(canvas.getByText('Phone'));
    await expect(canvas.getByRole('radio', { name: 'Phone' })).not.toBeChecked();
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
