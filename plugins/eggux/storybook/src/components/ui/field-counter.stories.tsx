import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { FieldCounter, counterStatus } from './field-counter';

const meta = {
  title: 'Components/Input/Field Counter',
  component: FieldCounter,
  parameters: {
    docs: { description: { component: 'Character counter at the right of a Field label. Near from 90 % of the limit, over past it (the Field then shows an error). Never blocks typing. Figma: Input page / Field Counter. Guide: eggux build-ui/components/input.md' } },
  },
  args: { value: 42, limit: 160 },
} satisfies Meta<typeof FieldCounter>;
export default meta;
type Story = StoryObj<typeof meta>;

// Figma Status=default: 16 high, muted, not announced.
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[data-slot="field-counter"]') as HTMLElement;
    await expect(el).toHaveTextContent('42 / 160 characters');
    await expect(el).toHaveAttribute('data-status', 'default');
    await expect(el).toHaveAttribute('aria-live', 'off');
    await expect(Math.round(el.getBoundingClientRect().height)).toBe(16);
  },
};

// Figma Status: default, near (from 90 %), over (past the limit), announced politely.
export const Statuses: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex items-center gap-6">
      <FieldCounter value={42} limit={160} />
      <FieldCounter value={150} limit={160} />
      <FieldCounter value={172} limit={160} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const els = Array.from(canvasElement.querySelectorAll('[data-slot="field-counter"]'));
    await expect(els.map(e => e.getAttribute('data-status'))).toEqual(['default', 'near', 'over']);
    await expect(els.map(e => e.getAttribute('aria-live'))).toEqual(['off', 'polite', 'polite']);
    await expect([counterStatus(143, 160), counterStatus(144, 160), counterStatus(160, 160), counterStatus(161, 160)]).toEqual(['default', 'near', 'near', 'over']);
  },
};

// Stress: never wraps.
export const LongNumbers: Story = { tags: ['!dev'],
  args: { value: 12480, limit: 10000 },
  render: args => <div className="w-12"><FieldCounter {...args} /></div>,
  play: async ({ canvasElement }) => {
    const el = canvasElement.querySelector('[data-slot="field-counter"]') as HTMLElement;
    await expect(Math.round(el.getBoundingClientRect().height)).toBe(16);
  },
};

export const StatusesDark: Story = { ...Statuses, tags: ['!dev'], globals: { theme: 'Dark' } };
