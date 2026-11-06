import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';
import { Field } from './field';
import { Input } from './input';
import { PasswordStrength, passwordStrength, type PasswordStrengthLevel } from './password-strength';

const meta = {
  title: 'Components/Input/Password Strength',
  component: PasswordStrength,
  parameters: {
    docs: { description: { component: 'Strength meter under a new-password Field (sign up, reset, change password). Length is the only rule (8 or more characters): the message asks for a longer password, never for numbers or symbols. The level is in text and bar count, not only color; announced politely as people type. Not for sign in or one-time codes. Figma: Input page / Password Strength. Guide: eggux build-ui/patterns/auth.md' } },
  },
  args: { level: 'empty' },
  decorators: [Story => <div className="w-72"><Story /></div>],
} satisfies Meta<typeof PasswordStrength>;
export default meta;
type Story = StoryObj<typeof meta>;

const bars = (el: HTMLElement) => Array.from(el.querySelectorAll<HTMLElement>('[data-slot="password-strength-bars"] > span'));
const probeBg = (cls: string) => { const p = document.createElement('span'); p.className = cls; document.body.append(p); const c = getComputedStyle(p).backgroundColor; p.remove(); return c; };

// In a new-password Field: the meter follows the length; the message is linked to the input and
// announced politely.
function SignUp() {
  const [value, setValue] = React.useState('');
  return (
    <div className="flex flex-col gap-2">
      <Field id="new-password" label="New password">
        <Input type="password" autoComplete="new-password" value={value} onChange={e => setValue(e.target.value)} aria-describedby="new-password-strength" />
      </Field>
      <PasswordStrength level={passwordStrength(value)} messageId="new-password-strength" />
    </div>
  );
}

export const Default: Story = {
  render: () => <SignUp />,
  play: async ({ canvas, canvasElement }) => {
    const input = canvas.getByLabelText('New password');
    const status = canvas.getByRole('status');
    await expect(input).toHaveAccessibleDescription('Use at least 8 characters. A longer phrase is stronger.');
    await expect(status).toHaveAttribute('aria-live', 'polite');
    await userEvent.type(input, 'acme');
    await expect(status).toHaveTextContent('Weak: make it longer.');
    await expect(bars(canvasElement).filter(b => b.hasAttribute('data-filled'))).toHaveLength(1);
    await userEvent.type(input, '-ledger');
    await expect(status).toHaveTextContent('Fair: a few more characters make it stronger.');
    await userEvent.type(input, '-26');
    await expect(status).toHaveTextContent('Good');
    await userEvent.type(input, '-blue-river');
    await expect(status).toHaveTextContent('Strong');
    await expect(bars(canvasElement).filter(b => b.hasAttribute('data-filled'))).toHaveLength(4);
    // Paste is never blocked.
    await userEvent.clear(input);
    await userEvent.click(input);
    await userEvent.paste('correct horse battery staple');
    await expect(status).toHaveTextContent('Strong');
  },
};

const levels: PasswordStrengthLevel[] = ['empty', 'weak', 'fair', 'good', 'strong'];

// Figma Level: bar count 0-4 and colors (destructive, foreground/muted, info, success); 4 px bars,
// 4 px gap, 6 px to the ui/caption message; 288 wide.
export const Levels: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {levels.map(l => <PasswordStrength key={l} level={l} />)}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const metas = Array.from(canvasElement.querySelectorAll<HTMLElement>('[data-slot="password-strength"]'));
    const color = { empty: '', weak: probeBg('bg-destructive'), fair: probeBg('bg-muted-foreground'), good: probeBg('bg-info'), strong: probeBg('bg-success') };
    const muted = probeBg('bg-muted');
    for (const [i, l] of levels.entries()) {
      const b = bars(metas[i]);
      const count = [0, 1, 2, 3, 4][i];
      await expect(b.filter(x => x.hasAttribute('data-filled'))).toHaveLength(count);
      for (const [j, bar] of b.entries()) {
        await expect(getComputedStyle(bar).backgroundColor).toBe(j < count ? color[l] : muted);
        await expect(Math.round(bar.getBoundingClientRect().height)).toBe(4);
      }
    }
    const first = metas[1];
    await expect(Math.round(first.getBoundingClientRect().width)).toBe(288);
    await expect(Math.round(first.getBoundingClientRect().height)).toBe(26);
    await expect(Math.round(bars(first)[1].getBoundingClientRect().left - bars(first)[0].getBoundingClientRect().right)).toBe(4);
    await expect(Math.round(metas[0].getBoundingClientRect().height)).toBe(42);
  },
};

// The level rule is length only: symbols and digits do not change it.
export const LengthOnly: Story = {
  tags: ['!dev'],
  render: () => <PasswordStrength level="empty" />,
  play: async () => {
    await expect(passwordStrength('')).toBe('empty');
    await expect(passwordStrength('aB3$x!')).toBe('weak');
    await expect(passwordStrength('abcdefgh')).toBe('fair');
    await expect(passwordStrength('abcdefghijkl')).toBe('good');
    await expect(passwordStrength('blue river acme ledger')).toBe('strong');
  },
};

// Stress test: the 276 and 368 columns; translated long messages wrap and stay readable.
export const Stress: Story = {
  tags: ['!dev'],
  decorators: [Story => <div><Story /></div>],
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="w-[276px]"><PasswordStrength level="fair" messages={{ fair: 'Mittel: Mit ein paar weiteren Zeichen wird es deutlich stärker und sicherer.' }} /></div>
      <div className="w-[368px]"><PasswordStrength level="strong" /></div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [narrow, wide] = Array.from(canvasElement.querySelectorAll<HTMLElement>('[data-slot="password-strength"]'));
    await expect(Math.round(narrow.getBoundingClientRect().width)).toBe(276);
    await expect(Math.round(wide.getBoundingClientRect().width)).toBe(368);
    const msg = narrow.querySelector('p')!;
    await expect(msg.scrollWidth).toBeLessThanOrEqual(msg.clientWidth);
  },
};

export const Dark: Story = { tags: ['!dev'], globals: { theme: 'Dark' }, args: { level: 'fair' } };
export const CorporateLight: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' }, args: { level: 'good' } };
