import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';
import { Field } from './field';
import { LanguageSwitcher, type LanguageOption } from './language-switcher';

type Args = { compact: boolean; value: string; disabled: boolean };

const languages: LanguageOption[] = [
  { code: 'en', name: 'English' },
  { code: 'de', name: 'Deutsch', englishName: 'German' },
  { code: 'fr', name: 'Français', englishName: 'French' },
  { code: 'es', name: 'Español', englishName: 'Spanish' },
  { code: 'it', name: 'Italiano', englishName: 'Italian' },
  { code: 'pt-BR', name: 'Português (Brasil)', englishName: 'Portuguese (Brazil)', short: 'PT' },
  { code: 'nl', name: 'Nederlands', englishName: 'Dutch' },
  { code: 'ro', name: 'Română', englishName: 'Romanian' },
  { code: 'pl', name: 'Polski', englishName: 'Polish' },
  { code: 'ja', name: '日本語', englishName: 'Japanese' },
];

const meta = {
  title: 'Components/Forms/Language Switcher',
  parameters: {
    docs: {
      description: {
        component:
          'A select-like popover for the language of the interface or a document. Each option shows the native name first and the English name muted, so people find their language even when the page is in the wrong one; the current language has a check. No flags (a flag is a country). Type to search by either name. The compact variant is the globe and a short code for headers and footers. Code only (no Figma component yet).',
      },
    },
  },
  args: { compact: false, value: 'en', disabled: false },
  argTypes: {
    compact: { name: 'Compact', control: 'boolean', description: 'Globe and short code only.', table: { category: 'Switcher' } },
    value: { name: 'Language', control: 'select', options: languages.map(l => l.code), description: 'The current language (code).', table: { category: 'Switcher' } },
    disabled: { name: 'Disabled', control: 'boolean', description: 'Cannot be opened.', table: { category: 'Switcher' } },
  },
  decorators: [Story => <div className="flex min-h-72 w-72 max-w-full items-start"><Story /></div>],
  render: function Render({ compact, value, disabled }) {
    const [lang, setLang] = React.useState(value);
    React.useEffect(() => setLang(value), [value]);
    return <LanguageSwitcher languages={languages} value={lang} onValueChange={setLang} compact={compact} disabled={disabled} />;
  },
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** The two looks side by side: the form control, and the compact one for a header or footer. */
export const Variants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex w-full items-center justify-between gap-4">
      <LanguageSwitcher languages={languages} defaultValue="de" />
      <LanguageSwitcher languages={languages} defaultValue="de" compact />
    </div>
  ),
};

/** In a Field: the label names the control, the hint says what changes. */
export const InField: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Field label="Language" hint="Used for menus and emails from Acme.">
      <LanguageSwitcher languages={languages} defaultValue="fr" label="Language" />
    </Field>
  ),
};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  render: () => <LanguageSwitcher languages={languages} defaultValue="en" onValueChange={fn()} />,
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: 'Language: English' });
    await expect(trigger).toHaveTextContent('English');
    await userEvent.click(trigger);
    const dialog = await screen.findByRole('dialog', { name: 'Language' });
    const list = within(dialog).getByRole('listbox');
    await expect(within(list).getAllByRole('option')).toHaveLength(10);
    // The current language has the check; native name first, English name muted.
    await expect(within(list).getByRole('option', { name: 'English' })).toHaveAttribute('aria-checked', 'true');
    await expect(within(list).getByRole('option', { name: 'Deutsch German' })).toHaveAttribute('aria-checked', 'false');
    await expect(within(list).getByText('日本語')).toHaveAttribute('lang', 'ja');
    // Search by the English name.
    await userEvent.type(within(dialog).getByRole('combobox'), 'ger');
    await waitFor(() => expect(within(list).getAllByRole('option')).toHaveLength(1));
    await userEvent.click(within(list).getByRole('option', { name: 'Deutsch German' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await expect(canvas.getByRole('button', { name: 'Language: Deutsch' })).toHaveFocus();
  },
};

export const KeyboardCheck: Story = {
  tags: ['!dev'],
  render: () => <LanguageSwitcher languages={languages} defaultValue="en" />,
  play: async ({ canvas }) => {
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Language: English' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    const search = await screen.findByRole('combobox');
    await waitFor(() => expect(search).toHaveFocus());
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await expect(canvas.getByRole('button', { name: 'Language: Deutsch' })).toHaveFocus();
    // Escape closes without changing the language and returns focus.
    await userEvent.keyboard('{Enter}');
    await screen.findByRole('dialog');
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await expect(canvas.getByRole('button', { name: 'Language: Deutsch' })).toHaveFocus();
  },
};

export const CompactCheck: Story = {
  tags: ['!dev'],
  args: { compact: true },
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: 'Language: English, EN' });
    // Visible: the short code only. Screen readers get the full name first.
    await expect(trigger.querySelector('[data-slot="language-switcher-value"]')).toHaveTextContent(/^EN$/);
    await expect(trigger.getBoundingClientRect().width).toBeLessThan(80);
    await expect(trigger.querySelector('svg')).not.toBeNull();
  },
};

export const DisabledCheck: Story = {
  tags: ['!dev'],
  args: { disabled: true },
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: 'Language: English' });
    await expect(trigger).toBeDisabled();
    await userEvent.click(trigger, { pointerEventsCheck: 0 });
    await expect(screen.queryByRole('dialog')).toBeNull();
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => (
    <LanguageSwitcher
      languages={[{ code: 'eo', name: 'A language whose own name is much too long to fit in this narrow column', englishName: 'Long' }, ...languages]}
      defaultValue="eo"
    />
  ),
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button');
    await expect(trigger.scrollWidth).toBeLessThanOrEqual(trigger.clientWidth + 1);
    await expect(trigger.getBoundingClientRect().width).toBeLessThanOrEqual(276);
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
