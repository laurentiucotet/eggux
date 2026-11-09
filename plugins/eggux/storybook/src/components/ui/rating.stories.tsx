import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';
import { Rating, RatingInput, RatingSummary, ReviewItem } from './rating';

const meta = {
  title: 'Components/Rating/Rating',
  component: Rating,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Star rating for display (reviews, products) or as input (feedback), always with the number. Size sm in cards and lists, default on detail pages, lg as the input of a review form; Style badge for tight places (display only). Review Item shows one review; Rating Summary the average and the split across 1-5 stars, each row filtering the list. Figma: Rating page / Rating, Review Item, Rating Summary. Guide: eggux build-ui/components/rating.md' } },
  },
  args: { value: 4.7, showValue: true, count: 128 },
} satisfies Meta<typeof Rating>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();

// Figma sizes: default 5 × 20 stars 4 apart (116 without text), sm 78, lg 184; badge; the name carries the number.
export const Default: Story = {
  render: args => (
    <div className="flex flex-col items-start gap-4">
      <Rating {...args} />
      <Rating value={4} data-testid="default" />
      <Rating value={4} size="sm" data-testid="sm" />
      <Rating value={3} size="lg" data-testid="lg" />
      <Rating value={4.8} ratingStyle="badge" count={128} />
      <Rating value={4.8} ratingStyle="badge" size="sm" />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('img', { name: 'Rated 4.7 out of 5, 128 reviews' })).toHaveTextContent('4.7(128)');
    await expect(Math.round(box(canvas.getByTestId('default')).width)).toBe(116);
    await expect(Math.round(box(canvas.getByTestId('sm')).width)).toBe(78);
    await expect(Math.round(box(canvas.getByTestId('lg')).width)).toBe(184);
    await expect(canvas.getByRole('img', { name: 'Rated 4.8 out of 5, 128 reviews' })).toHaveAttribute('data-style', 'badge');
  },
};

// Input: a radio group of five; click sets, arrows change, the checked radio is the tab stop.
export const Input: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const [v, setV] = React.useState(0);
    return (
      <div className="flex flex-col gap-2">
        <span id="rate-label" className="text-sm font-medium">Your rating</span>
        <RatingInput aria-labelledby="rate-label" value={v} onValueChange={setV} />
        <span className="text-sm">Value: {v}</span>
      </div>
    );
  },
  play: async ({ canvas }) => {
    const group = canvas.getByRole('radiogroup', { name: 'Your rating' });
    await expect(group).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('radio', { name: '4 of 5 stars' }));
    await expect(canvas.getByText('Value: 4')).toBeInTheDocument();
    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('radio', { name: '5 of 5 stars' })).toHaveAttribute('aria-checked', 'true');
    await expect(canvas.getByRole('radio', { name: '5 of 5 stars' })).toHaveFocus();
    await userEvent.keyboard('{ArrowLeft}{ArrowLeft}');
    await expect(canvas.getByText('Value: 3')).toBeInTheDocument();
  },
};

// Review Item (560) and Rating Summary (480): helpful votes toggle, rows filter.
export const Reviews: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const [vote, setVote] = React.useState<'yes' | 'no' | null>(null);
    const [filter, setFilter] = React.useState<number | null>(null);
    return (
      <div className="flex flex-col gap-6">
        <div className="w-[480px]"><RatingSummary counts={[92, 23, 8, 3, 2]} filter={filter} onFilterChange={setFilter} /></div>
        <div className="w-[560px]">
          <ReviewItem
            name="Mark Schulz"
            initials="MS"
            verified
            date="3 Oct 2026"
            rating={4}
            title="Good fit, thin fabric"
            text="Fits true to size and the color is exactly as in the photos. The linen is thinner than I expected, so it creases quickly. Washed twice without shrinking."
            helpful={{ yes: 12, no: 1, vote, onVote: setVote }}
          />
        </div>
      </div>
    );
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('img', { name: '4.6 out of 5, 128 reviews' })).toBeInTheDocument();
    const five = canvas.getByRole('button', { name: /^5 stars,\s*92 reviews$/ });
    await userEvent.click(five);
    await expect(five).toHaveAttribute('aria-pressed', 'true');
    await expect(canvas.getByRole('heading', { name: 'Good fit, thin fabric' })).toBeInTheDocument();
    const yes = canvas.getByRole('button', { name: /Yes, helpful, 12 votes/ });
    await userEvent.click(yes);
    await expect(canvas.getByRole('button', { name: /Yes, helpful, 13 votes/ })).toHaveAttribute('aria-pressed', 'true');
  },
};

// Stress: long review text clamps to 4 lines with Show more; under 5 reviews the summary shows the count only. Tests only.
export const Stress: Story = {
  parameters: { controls: { disable: true } },
  tags: ['!dev'],
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="w-[276px]">
        <ReviewItem name="Alexandra-Maria Constantinescu" initials="AC" verified date="13 September 2026" rating={2.5} title="Thin fabric, creases quickly, but the color is right and the fit is good" text={'Fits true to size and the color is exactly as in the photos. '.repeat(6)} />
      </div>
      <div className="w-[276px]"><RatingSummary counts={[2, 1, 0, 0, 0]} /></div>
    </div>
  ),
  play: async ({ canvas }) => {
    const more = canvas.getByRole('button', { name: 'Show more' });
    await expect(more).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(more);
    await expect(canvas.getByRole('button', { name: 'Show less' })).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByText('3 reviews')).toBeInTheDocument();
    await expect(canvas.queryByRole('button', { name: /stars,/ })).toBeNull();
  },
};

export const DefaultDark: Story = { parameters: { controls: { disable: true } }, tags: ['!dev'], globals: { theme: 'Dark' }, render: Reviews.render };
export const DefaultCorporate: Story = { parameters: { controls: { disable: true } }, tags: ['!dev'], globals: { theme: 'Corporate Light' }, render: Reviews.render };
