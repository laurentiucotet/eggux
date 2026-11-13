import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { EndpointBadge, type HttpMethod } from './endpoint-badge';

type Args = { method: HttpMethod; path: string; size: 'sm' | 'default' | 'lg'; wrap: boolean };

const methods: HttpMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

const meta = {
  title: 'Components/Developer/Endpoint Badge',
  parameters: {
    docs: {
      description: {
        component:
          'An HTTP method (GET, POST, PUT, PATCH, DELETE) as a soft badge, then the path in mono. The method word is always shown, so color is never the only signal, and every badge has the same minimum width so a list lines up. A long path is cut on one line with the full value in a title, or wraps with Wrap path. Code only (no Figma component yet).',
      },
    },
  },
  args: { method: 'GET', path: '/v1/invoices/{id}', size: 'default', wrap: false },
  argTypes: {
    method: { name: 'Method', control: 'select', options: methods, description: 'The HTTP method.', table: { category: 'Endpoint' } },
    path: { name: 'Path', control: 'text', description: 'The path, starting with a slash.', table: { category: 'Endpoint' } },
    size: { name: 'Size', control: 'inline-radio', options: ['sm', 'default', 'lg'], description: 'Size of the method badge.', table: { category: 'Endpoint' } },
    wrap: { name: 'Wrap path', control: 'boolean', description: 'Break a long path instead of cutting it.', table: { category: 'Endpoint' } },
  },
  render: ({ method, path, size, wrap }) => (
    <div className="w-80 max-w-full"><EndpointBadge method={method} path={path} size={size} wrap={wrap} /></div>
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  play: async ({ canvas }) => {
    await expect(canvas.getByText('GET')).toBeVisible();
    await expect(canvas.getByText('/v1/invoices/{id}')).toBeVisible();
    // The path is code in the mono family.
    await expect(getComputedStyle(canvas.getByText('/v1/invoices/{id}')).fontFamily).toMatch(/mono/i);
  },
};

const examples: { method: HttpMethod; path: string }[] = [
  { method: 'GET', path: '/v1/invoices' },
  { method: 'POST', path: '/v1/invoices' },
  { method: 'PUT', path: '/v1/customers/{id}' },
  { method: 'PATCH', path: '/v1/customers/{id}/address' },
  { method: 'DELETE', path: '/v1/webhooks/{id}' },
];

/** The five methods in a list: the badges have one width, so the paths line up. */
export const Methods: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <ul className="m-0 flex list-none flex-col gap-2 p-0">
      {examples.map(e => <li key={e.method}><EndpointBadge method={e.method} path={e.path} /></li>)}
    </ul>
  ),
  play: async ({ canvas }) => {
    const widths = canvas.getAllByText(/^(GET|POST|PUT|PATCH|DELETE)$/).map(el => Math.round(el.closest('[data-slot="badge"]')!.getBoundingClientRect().width));
    await expect(Math.min(...widths)).toBeGreaterThanOrEqual(56);
    // The method is a word, not only a color: five different words.
    await expect(new Set(canvas.getAllByText(/^(GET|POST|PUT|PATCH|DELETE)$/).map(el => el.textContent)).size).toBe(5);
  },
};

/* Hidden checks */

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="flex w-[276px] flex-col gap-3"><Story /></div>],
  render: () => (
    <>
      <EndpointBadge method="PATCH" path="/v1/organizations/{organization_id}/projects/{project_id}/environments/{environment_id}/variables" />
      <EndpointBadge wrap method="DELETE" path="/v1/organizations/{organization_id}/projects/{project_id}/environments/{environment_id}/variables" />
    </>
  ),
  play: async ({ canvas }) => {
    const [cut, wrapped] = canvas.getAllByText(/\/v1\/organizations/);
    // Cut: one line, inside 276 px, full path in the title.
    await expect(cut!.scrollWidth).toBeGreaterThan(cut!.clientWidth);
    await expect(cut!).toHaveAttribute('title', expect.stringContaining('environment_id'));
    await expect(cut!.getBoundingClientRect().right).toBeLessThanOrEqual(canvas.getAllByText('PATCH')[0]!.closest('[data-slot="endpoint-badge"]')!.getBoundingClientRect().right + 1);
    // Wrapped: more than one line, no sideways overflow.
    await expect(wrapped!.getBoundingClientRect().height).toBeGreaterThan(24);
    await expect(wrapped!.scrollWidth).toBeLessThanOrEqual(wrapped!.clientWidth + 1);
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const MethodsDark: Story = { ...Methods, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
export const MethodsCorporate: Story = { ...Methods, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
