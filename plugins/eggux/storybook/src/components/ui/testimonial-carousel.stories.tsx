import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { TestimonialCarousel, type Testimonial } from './testimonial-carousel';

type Args = { count: number; autoPlay: boolean; width: number };

const all: Testimonial[] = [
  { quote: 'We closed the quarter two days earlier, and nobody had to chase a receipt.', name: 'Maria Ionescu', role: 'Head of Finance', company: 'Northwind' },
  { quote: 'Acme replaced three spreadsheets and a shared inbox. Our auditors noticed the difference.', name: 'Tom Becker', role: 'Controller', company: 'Bluebird Foods' },
  { quote: 'Setup took one afternoon. The first month paid for the whole year.', name: 'Aisha Rahman', role: 'Operations Lead', company: 'Fieldstone' },
  { quote: 'Support answered in under an hour, on a Sunday. That sold the rest of the board.', name: 'Jonas Lindqvist', role: 'CFO', company: 'Kestrel Labs' },
];

const meta = {
  title: 'Components/Marketing/Testimonial Carousel',
  parameters: {
    docs: {
      description: {
        component:
          'One customer quote at a time with the author, Previous and Next arrows, dots and a Play / Pause button. It does not advance on its own unless Play is pressed (or auto play is set), and never under reduced motion, while hovered or while focus is inside. One slide is announced politely. Code only (no Figma component yet).',
      },
    },
  },
  args: { count: 4, autoPlay: false, width: 560 },
  argTypes: {
    count: { name: 'Testimonials', control: { type: 'range', min: 1, max: 4, step: 1 }, description: 'How many slides.', table: { category: 'Carousel' } },
    autoPlay: { name: 'Auto play', control: 'boolean', description: 'Start playing on mount. Off by default.', table: { category: 'Carousel' } },
    width: { name: 'Width', control: { type: 'range', min: 276, max: 720, step: 4 }, description: 'Container width in px.', table: { category: 'Carousel' } },
  },
  render: ({ count, autoPlay, width }) => (
    <div style={{ width, maxWidth: '100%' }}>
      <TestimonialCarousel key={`${count}-${autoPlay}`} testimonials={all.slice(0, count)} autoPlay={autoPlay} />
    </div>
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <TestimonialCarousel testimonials={all} onIndexChange={fn()} />,
  play: async ({ canvas }) => {
    const region = canvas.getByRole('region', { name: 'Customer stories' });
    await expect(region).toHaveAttribute('aria-roledescription', 'carousel');
    await expect(canvas.getByRole('group', { name: '1 of 4' })).toBeVisible();
    await expect(canvas.getByText(/closed the quarter two days earlier/)).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Next slide' }));
    await waitFor(() => expect(canvas.getByRole('group', { name: '2 of 4' })).toBeVisible());
    await expect(canvas.getByText('Tom Becker')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Go to slide 4' }));
    await waitFor(() => expect(canvas.getByRole('group', { name: '4 of 4' })).toBeVisible());
    // Next wraps to the first, Previous wraps back.
    await userEvent.click(canvas.getByRole('button', { name: 'Next slide' }));
    await waitFor(() => expect(canvas.getByRole('group', { name: '1 of 4' })).toBeVisible());
    await userEvent.click(canvas.getByRole('button', { name: 'Previous slide' }));
    await waitFor(() => expect(canvas.getByRole('group', { name: '4 of 4' })).toBeVisible());
    // Arrow keys move while focus is inside.
    canvas.getByRole('button', { name: 'Next slide' }).focus();
    await userEvent.keyboard('{ArrowLeft}');
    await waitFor(() => expect(canvas.getByRole('group', { name: '3 of 4' })).toBeVisible());
    // Pause / Play toggles and the live region goes quiet while playing.
    const live = region.querySelector('[aria-live]');
    await expect(live).toHaveAttribute('aria-live', 'polite');
    await userEvent.click(canvas.getByRole('button', { name: 'Play slides' }));
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Pause slides' })).toBeVisible());
    await expect(live).toHaveAttribute('aria-live', 'off');
    await userEvent.click(canvas.getByRole('button', { name: 'Pause slides' }));
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Play slides' })).toBeVisible());
  },
};

export const NoAutoAdvance: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => <TestimonialCarousel testimonials={all} interval={150} />,
  play: async ({ canvas }) => {
    await new Promise(r => setTimeout(r, 500));
    await expect(canvas.getByRole('group', { name: '1 of 4' })).toBeVisible();
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => (
    <TestimonialCarousel
      testimonials={[
        {
          quote: 'Averyveryveryverylongunbrokenwordinsideaquotetoseeifitwrapswithoutpushingthecardwiderthanitscolumn, and then a sentence that keeps going for much longer than any customer would reasonably write.',
          name: 'Alexandra Constantinopolous-Featherstonehaugh',
          role: 'Senior Vice President of Group Financial Planning and Analysis',
          company: 'The International Association of Municipal Treasury Officers',
        },
        all[1],
      ]}
    />
  ),
  play: async ({ canvas }) => {
    const region = canvas.getByRole('region');
    await expect(region.scrollWidth).toBeLessThanOrEqual(region.clientWidth + 1);
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
