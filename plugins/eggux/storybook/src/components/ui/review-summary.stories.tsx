import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { ReviewSummary, type ReviewSummarySection } from './review-summary';

function build(missing: number, longValues: boolean): ReviewSummarySection[] {
  const long = 'Acme Industrial Supplies and Logistics International Holdings Limited, Registered Office, 14 Long Established Business Park Road';
  const rows = [
    { sectionId: 'company', label: 'Company name', value: longValues ? long : 'Acme Ltd' },
    { sectionId: 'company', label: 'VAT number', value: 'DE123456789' },
    { sectionId: 'bank', label: 'Account holder', value: 'Acme Ltd' },
    { sectionId: 'bank', label: 'IBAN', value: 'DE89 3704 0044 0532 0130 00' },
    { sectionId: 'team', label: 'Accountant email', value: 'ana@acme.example' },
    { sectionId: 'team', label: 'Billing contact', value: 'Sam Rivera' },
  ];
  const blank = ['VAT number', 'Accountant email', 'Billing contact', 'IBAN'];
  return [
    { id: 'company', title: 'Company details' },
    { id: 'bank', title: 'Bank account' },
    { id: 'team', title: 'Team' },
  ].map(s => ({
    ...s,
    rows: rows
      .filter(r => r.sectionId === s.id)
      .map(r => ({ label: r.label, value: blank.slice(0, missing).includes(r.label) ? undefined : r.value })),
  }));
}

type Args = { missing: number; longValues: boolean; showBanner: boolean; width: number };

const meta = {
  title: 'Components/Wizard/Review Summary',
  parameters: {
    docs: {
      description: {
        component:
          'Last step of a flow: every section with its title, an Edit button and the answers as key-value rows. An empty answer reads "Not provided" with a warning icon, and a banner counts how many are missing. Edit buttons name their section. Code only (no Figma component yet). Guide: eggux build-ui/patterns/wizard.md',
      },
    },
  },
  args: { missing: 1, longValues: false, showBanner: true, width: 560 },
  argTypes: {
    missing: { name: 'Missing answers', control: { type: 'range', min: 0, max: 4, step: 1 }, description: 'How many answers are empty.', table: { category: 'Summary' } },
    longValues: { name: 'Long values', control: 'boolean', description: 'A very long company name.', table: { category: 'Summary' } },
    width: { name: 'Width', control: { type: 'range', min: 240, max: 680, step: 4 }, description: 'Container width in px.', table: { category: 'Summary' } },
    showBanner: { name: 'Show missing banner', control: 'boolean', description: 'The warning on top that counts missing answers.', table: { category: 'Parts' } },
  },
  render: ({ missing, longValues, showBanner, width }) => (
    <div style={{ width }} className="max-w-full">
      <ReviewSummary sections={build(missing, longValues)} showMissingBanner={showBanner} onEdit={() => undefined} />
    </div>
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <ReviewSummary sections={build(2, false)} onEdit={fn()} />,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('status')).toHaveTextContent('2 answers are not provided');
    const company = canvas.getByRole('region', { name: 'Company details' });
    await expect(within(company).getByText('Acme Ltd')).toBeVisible();
    // VAT number is empty: warning text, not just colour.
    const vat = within(company).getByText('VAT number');
    await expect(vat.nextElementSibling).toHaveTextContent('Not provided');
    await expect(vat.nextElementSibling).toHaveAttribute('data-empty');
    await expect(canvas.getAllByText('Not provided')).toHaveLength(2);
    // Every Edit button names its section; keyboard works.
    await expect(canvas.getAllByRole('button')).toHaveLength(3);
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Edit Company details' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await userEvent.click(canvas.getByRole('button', { name: 'Edit Team' }));
  },
};

/** Nothing missing: no banner, no warnings. */
export const Complete: Story = {
  parameters: { controls: { disable: true } },
  render: () => <ReviewSummary sections={build(0, false)} onEdit={() => undefined} />,
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => <ReviewSummary sections={build(4, true)} onEdit={() => undefined} />,
  play: async ({ canvas }) => {
    const first = canvas.getAllByRole('region')[0];
    await expect(first.scrollWidth).toBeLessThanOrEqual(first.clientWidth + 1);
    await expect(first.getBoundingClientRect().width).toBeLessThanOrEqual(276);
    await expect(canvas.getAllByText('Not provided').length).toBeGreaterThan(0);
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
