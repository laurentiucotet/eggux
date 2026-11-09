import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { ResultPage } from './not-found';

const meta = {
  title: 'Pages/System/Not found',
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
    docs: { description: { component: 'A result page inside the site shell. 404 keeps the navigation, says what happened in plain words, reassures about data and offers the home page and search. The server error variant offers a retry, the support contact and an error id to quote. Guide: eggux build-ui/patterns/result-pages.md' } },
  },
  render: () => <ResultPage />,
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ServerError: Story = { render: () => <ResultPage kind="server-error" /> };

/* Hidden checks */

export const ContentCheck: Story = {
  tags: ['!dev'],
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getByRole('heading', { level: 1, name: 'We cannot find that page' })).toBeVisible();
    await expect(c.getByRole('link', { name: 'Go to the home page' })).toHaveAttribute('href', '#home');
    await expect(c.getByRole('banner')).toBeVisible();
    await expect(c.getByRole('contentinfo')).toBeVisible();
  },
};
export const DefaultDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' } };
export const ServerErrorBackOffice: Story = { ...ServerError, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
