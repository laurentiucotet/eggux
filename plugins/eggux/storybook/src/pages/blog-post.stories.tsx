import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { BlogPostPage } from './blog-post';

const meta = {
  title: 'Pages/Marketing/Blog post',
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
    docs: { description: { component: 'An article page: category, date and reading time, the title, a one-or-two sentence lead and the author; a cover; a 44 rem reading column with a table of contents beside it from 1024 px; share, the author, related posts and a newsletter strip. Guide: eggux build-ui/patterns/content-and-docs.md' } },
  },
  render: () => <BlogPostPage />,
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/* Hidden checks */

export const ContentCheck: Story = {
  tags: ['!dev'],
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    await expect(c.getByRole('heading', { level: 1 })).toHaveTextContent('How we cut month-end close from nine days to five');
    await expect(c.getByRole('navigation', { name: 'Breadcrumb' })).toBeVisible();
    await expect(c.getByRole('time')).toHaveAttribute('datetime', '2026-10-12');
    // The reading column holds the headings the contents list links to.
    await expect(canvasElement.querySelector('#approvals')).not.toBeNull();
    await expect(c.getByRole('heading', { level: 2, name: 'Keep reading' })).toBeVisible();
    await expect(c.getByRole('form', { name: 'Newsletter' })).toBeVisible();
  },
};
export const DefaultDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultBackOffice: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' } };
