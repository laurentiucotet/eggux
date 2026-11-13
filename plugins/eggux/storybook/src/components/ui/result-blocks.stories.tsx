import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Result, type ResultType } from './result-blocks';

const meta = {
  title: 'Blocks/Results/Result',
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'A full-page result: 404 (not-found), 500 (server-error), 403 (no-access), maintenance and success. Put it centered in the Page slot of the shell the person was in, keep the navigation. Say what happened in plain words, reassure about data, always give a next step (a primary and an outline alternative); a 500 can show an error id to quote. Success only for milestones, otherwise a toast. Figma: BLOCKS / Results, Block / Result. Guide: eggux build-ui/patterns/result-pages.md' } },
  },
} satisfies Meta;
export default meta;

const TYPES: ResultType[] = ['not-found', 'server-error', 'no-access', 'maintenance', 'success'];

type ResultArgs = { type: ResultType; title: string; description: string; showCode: boolean; showActions: boolean; errorId: string };

/** The playground: Type sets the icon, code, texts and actions; empty texts keep the type's defaults. */
export const Default: StoryObj<ResultArgs> = {
  name: 'Result',
  args: { type: 'not-found', title: '', description: '', showCode: true, showActions: true, errorId: '' },
  argTypes: {
    type: { name: 'Type', description: 'What happened: sets icon, code, texts and actions.', control: 'select', options: TYPES, table: { category: 'Result' } },
    title: { name: 'Title', description: 'Empty: the text of the type.', control: 'text', table: { category: 'Content' } },
    description: { name: 'Description', description: 'Empty: the text of the type.', control: 'text', table: { category: 'Content' } },
    showCode: { name: 'Show code', description: 'The code above the title (404, 500...).', control: 'boolean', table: { category: 'Parts' } },
    showActions: { name: 'Show actions', description: 'The primary and outline actions.', control: 'boolean', table: { category: 'Parts' } },
    errorId: { name: 'Error id', description: 'An id people quote to support (server errors).', control: 'text', table: { category: 'Content' } },
  },
  render: a => (
    <div className="flex min-h-[560px] items-center justify-center px-4">
      <Result
        type={a.type}
        title={a.title || undefined}
        description={a.description || undefined}
        showCode={a.showCode}
        primaryAction={a.showActions ? undefined : null}
        secondaryAction={a.showActions ? undefined : null}
        errorId={a.errorId || undefined}
      />
    </div>
  ),
};

/** The five types side by side, as on the Figma page. */
const Gallery = () => (
  <div className="grid grid-cols-1 gap-x-10 px-4 md:grid-cols-2 xl:grid-cols-3">
    {TYPES.map(t => <Result key={t} type={t} headingLevel={2} />)}
  </div>
);
export const Types: StoryObj = { parameters: { controls: { disable: true } }, render: () => <Gallery /> };

/* Hidden checks */

const box = (el: Element) => el.getBoundingClientRect();
const onRetry = fn();

// Layout from Figma at 1440, 768 and 390: a 480 column centered in the page, 16 gaps, 56 icon
// circle, 24/32 title, actions 8 apart with 8 more above; at 390 the column takes the width.
export const LayoutCheck: StoryObj = {
  tags: ['!dev'],
  parameters: { controls: { disable: true }, a11y: { config: { rules: [{ id: 'landmark-unique', enabled: false }] } } },
  render: () => (
    <div className="flex flex-col gap-8">
      {[1440, 768, 390].map(w => (
        <div key={w} data-width={w} style={{ width: w }} className="px-4">
          <Result type="server-error" errorId="ERR-7F3A-2291" primaryAction={{ label: 'Try again', onClick: onRetry }} />
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const w of [1440, 768, 390]) {
      const frame = canvasElement.querySelector<HTMLElement>(`[data-width="${w}"]`)!;
      const c = within(frame);
      const section = c.getByRole('region', { name: 'Something went wrong on our side' });
      const s = box(section);
      const expected = Math.min(480, w - 32);
      await expect(Math.round(s.width)).toBe(expected);
      await expect(Math.round(s.left - box(frame).left)).toBe(Math.round((w - expected) / 2));
      await expect(section.scrollWidth).toBeLessThanOrEqual(Math.ceil(s.width));
      await expect(c.getAllByRole('heading')).toHaveLength(1);
      await expect(c.getByRole('heading', { level: 1 })).toBeInTheDocument();
      for (const el of section.querySelectorAll('a, button')) await expect((el.textContent ?? '').trim()).not.toBe('');
    }
    const frame = canvasElement.querySelector<HTMLElement>('[data-width="1440"]')!;
    const c = within(frame);
    const icon = frame.querySelector('[data-slot="result-icon"]')!;
    await expect(icon).toHaveAttribute('aria-hidden', 'true');
    await expect(Math.round(box(icon).width)).toBe(56);
    const code = frame.querySelector('[data-slot="result-code"]')!;
    await expect(code).toHaveTextContent('500');
    await expect(Math.round(box(code).top - box(icon).bottom)).toBe(16);
    const title = c.getByRole('heading', { level: 1 });
    await expect(Math.round(box(title).height)).toBe(32);
    const actions = frame.querySelector('[data-slot="result-actions"]')!;
    await expect(Math.round(box(actions).top - box(frame.querySelector('[data-slot="result-description"]')!).bottom)).toBe(16);
    const [primary, secondary] = [c.getByRole('button', { name: 'Try again' }), c.getByRole('link', { name: 'Contact support' })];
    await expect(Math.round(box(primary).height)).toBe(36);
    await expect(Math.round(box(secondary).left - box(primary).right)).toBe(8);
    await expect(frame.querySelector('[data-slot="result-error-id"]')).toHaveTextContent('Error id: ERR-7F3A-2291');
    await userEvent.click(primary);
    await expect(onRetry).toHaveBeenCalledTimes(1);
  },
};

// Every type: its code, title, a primary action, and the alternative where Figma has one.
export const TypesCheck: StoryObj = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <Gallery />,
  play: async ({ canvas, canvasElement }) => {
    const expected: [ResultType, string, string, string[]][] = [
      ['not-found', '404', 'Page not found', ['Go to dashboard', 'Go back']],
      ['server-error', '500', 'Something went wrong on our side', ['Try again', 'Contact support']],
      ['no-access', '403', "You don't have access to this page", ['Request access', 'Switch account']],
      ['maintenance', 'Maintenance', "We'll be back shortly", ['View status page']],
      ['success', 'Done', 'Your order is confirmed', ['View order', 'Continue shopping']],
    ];
    for (const [type, code, title, actions] of expected) {
      const section = canvas.getByRole('region', { name: title });
      await expect(section).toHaveAttribute('data-type', type);
      await expect(section.querySelector('[data-slot="result-code"]')).toHaveTextContent(code);
      const names = [...section.querySelectorAll('[data-slot="result-actions"] > *')].map(el => el.textContent);
      await expect(names).toEqual(actions);
    }
    await expect(canvasElement.querySelector('[data-type="server-error"] [data-slot="result-icon"]')).toHaveClass('text-destructive');
    await expect(canvasElement.querySelector('[data-type="success"] [data-slot="result-icon"]')).toHaveClass('text-success');
  },
};

// Without code and actions; long texts wrap inside the column.
export const StressCheck: StoryObj = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="w-[390px] px-4">
      <Result
        type="no-access"
        showCode={false}
        title="You don't have access to the Quarterly Revenue Forecast for Finance and Operations"
        description="Ask a workspace admin of Acme Europe GmbH to give you access to this dataset, or switch to an account that already has it. Requests are usually answered within one working day."
        primaryAction={null}
        secondaryAction={null}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const section = canvasElement.querySelector('section')!;
    await expect(section.querySelector('[data-slot="result-code"]')).toBeNull();
    await expect(section.querySelector('[data-slot="result-actions"]')).toBeNull();
    await expect(section.scrollWidth).toBeLessThanOrEqual(358);
  },
};

export const TypesDark: StoryObj = { tags: ['!dev'], globals: { theme: 'Dark' }, parameters: { controls: { disable: true } }, render: () => <Gallery /> };
export const TypesCorporate: StoryObj = { tags: ['!dev'], globals: { theme: 'Corporate Light' }, parameters: { controls: { disable: true } }, render: () => <Gallery /> };
