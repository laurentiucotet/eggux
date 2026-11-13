import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { Bell, Mail, ShieldCheck, Smartphone } from '@/components/icons';
import { ToggleCard } from './toggle-card';

type Args = { title: string; description: string; checked: boolean; disabled: boolean; showIcon: boolean; showDescription: boolean };

const meta = {
  title: 'Components/Forms/Toggle Card',
  parameters: {
    docs: {
      description: {
        component:
          'A setting as a card: icon, title, description and a switch, with the whole card as the hit area ("Email alerts"). One real switch (role="switch", Space toggles) named by the title and described by the description. On shows in the track, the border and aria-checked. For one choice among several use Option Card. Code only (no Figma component yet).',
      },
    },
  },
  args: {
    title: 'Email alerts',
    description: 'Get an email when a payment fails or a teammate mentions you.',
    checked: true,
    disabled: false,
    showIcon: true,
    showDescription: true,
  },
  argTypes: {
    title: { name: 'Title', control: 'text', description: 'The setting\'s name.', table: { category: 'Card' } },
    description: { name: 'Description', control: 'text', description: 'What it does when on.', table: { category: 'Card' } },
    checked: { name: 'On', control: 'boolean', description: 'The setting is on.', table: { category: 'Card' } },
    disabled: { name: 'Disabled', control: 'boolean', description: 'The setting cannot be changed.', table: { category: 'Card' } },
    showIcon: { name: 'Show icon', control: 'boolean', description: 'The icon tile before the title.', table: { category: 'Parts' } },
    showDescription: { name: 'Show description', control: 'boolean', description: 'The line under the title.', table: { category: 'Parts' } },
  },
  decorators: [Story => <div className="w-96 max-w-full"><Story /></div>],
  render: function Render({ title, description, checked, disabled, showIcon, showDescription }) {
    const [on, setOn] = React.useState(checked);
    React.useEffect(() => setOn(checked), [checked]);
    return <ToggleCard title={title} description={showDescription ? description : undefined} icon={showIcon ? <Bell /> : undefined} checked={on} onCheckedChange={setOn} disabled={disabled} />;
  },
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** A list of settings: cards 12 px apart, each flips on its own. */
export const SettingsList: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-3">
      <ToggleCard icon={<Mail />} title="Email alerts" description="Get an email when a payment fails or a teammate mentions you." defaultChecked />
      <ToggleCard icon={<Smartphone />} title="Push notifications" description="Alerts on your phone, even when Acme is closed." />
      <ToggleCard icon={<ShieldCheck />} title="Two-step sign in" description="Ask for a code from your phone each time you sign in on a new device." defaultChecked />
    </div>
  ),
};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  render: () => <ToggleCard icon={<Bell />} title="Email alerts" description="Get an email when a payment fails." onCheckedChange={fn()} />,
  play: async ({ canvas }) => {
    const sw = canvas.getByRole('switch', { name: 'Email alerts' });
    await expect(sw).toHaveAccessibleDescription('Get an email when a payment fails.');
    await expect(sw).toHaveAttribute('aria-checked', 'false');
    const card = sw.closest('label')!;
    const offBorder = getComputedStyle(card).borderTopColor;
    // The whole card is the hit area: clicking the description flips the switch.
    await userEvent.click(canvas.getByText('Get an email when a payment fails.'));
    await waitFor(() => expect(sw).toHaveAttribute('aria-checked', 'true'));
    // The on state is also in the border.
    await waitFor(() => expect(getComputedStyle(card).borderTopColor).not.toBe(offBorder));
    // Keyboard: Space flips the focused switch.
    sw.focus();
    await expect(sw).toHaveFocus();
    await userEvent.keyboard(' ');
    await waitFor(() => expect(sw).toHaveAttribute('aria-checked', 'false'));
  },
};

export const DisabledCheck: Story = {
  tags: ['!dev'],
  args: { disabled: true, checked: true },
  play: async ({ canvas }) => {
    const sw = canvas.getByRole('switch', { name: 'Email alerts' });
    await expect(sw).toBeDisabled();
    await userEvent.click(canvas.getByText('Email alerts'));
    await expect(sw).toHaveAttribute('aria-checked', 'true');
  },
};

export const InvalidCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-2">
      <ToggleCard title="Accept the terms" description="Required to create your Acme account." required aria-invalid aria-describedby="terms-error" />
      <p id="terms-error" className="m-0 text-xs text-destructive">Turn this on to continue.</p>
    </div>
  ),
  play: async ({ canvas }) => {
    const sw = canvas.getByRole('switch', { name: 'Accept the terms' });
    await expect(sw).toHaveAttribute('aria-invalid', 'true');
    await expect(sw).toHaveAccessibleDescription(/Turn this on to continue/);
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => (
    <ToggleCard
      icon={<Bell />}
      title="Weekly summary of everything that happened in every workspace you belong to"
      description="A very long description with an_unbroken_word_that_could_overflow_the_card_if_it_was_not_allowed_to_wrap and more text after it."
      defaultChecked
    />
  ),
  play: async ({ canvas }) => {
    const card = canvas.getByRole('switch').closest('label')!;
    await expect(card.scrollWidth).toBeLessThanOrEqual(card.clientWidth + 1);
    await expect(card.getBoundingClientRect().width).toBeLessThanOrEqual(276);
    // The switch stays visible and full size.
    await expect(Math.round(canvas.getByRole('switch').getBoundingClientRect().width)).toBe(36);
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
