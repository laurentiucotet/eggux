import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { StoryViewer, type StoryItem } from './story-viewer';

type Args = { count: number; start: number; startPaused: boolean; showAuthor: boolean; showClose: boolean };

function Slide({ tone, title, text }: { tone: string; title: string; text: string }) {
  return (
    <div className={`flex size-full min-w-0 flex-col items-center justify-center gap-3 px-8 text-center ${tone}`}>
      <p className="m-0 max-w-full text-3xl leading-9 font-semibold break-words">{title}</p>
      <p className="m-0 max-w-full text-base leading-6 break-words">{text}</p>
    </div>
  );
}

const slides: StoryItem[] = [
  { id: 's1', title: 'Spring sale', content: <Slide tone="bg-primary text-primary-foreground" title="Spring sale" text="20% off every plan until Sunday." /> },
  { id: 's2', title: 'New reports', content: <Slide tone="bg-secondary text-secondary-foreground" title="New reports" text="See revenue by week, month or quarter." /> },
  { id: 's3', title: 'Team news', content: <Slide tone="bg-accent text-accent-foreground" title="Welcome, Acme team" text="Three new members joined this month." /> },
  { id: 's4', title: 'Tips', content: <Slide tone="bg-muted text-foreground" title="Tip of the day" text="Press and hold any story to pause it." /> },
  { id: 's5', title: 'See you soon', content: <Slide tone="bg-primary text-primary-foreground" title="That is all" text="Come back tomorrow for more." /> },
];
const author = { name: 'Acme Studio', initials: 'AS', meta: '2 h ago' };

const frame = (Story: React.ComponentType) => (
  <div className="h-[640px] w-[360px] max-w-full overflow-hidden rounded-xl border border-border">
    <Story />
  </div>
);

const meta = {
  title: 'Components/Mobile/Story Viewer',
  decorators: [frame],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A full-screen story with a row of progress bars, the author, Pause and Close, and visible Previous and Next buttons. Tap the left third to go back and the rest to go forward; hold to pause. Arrow keys and Escape work too, every button is 44 x 44, and the progress is announced ("Story 2 of 5"). The playground starts paused so the story stays still; turn Start paused off to watch the timer. The viewer fills its container. Code only (no Figma component yet).',
      },
    },
  },
  args: { count: 4, start: 0, startPaused: true, showAuthor: true, showClose: true },
  argTypes: {
    count: { name: 'Stories', control: { type: 'range', min: 1, max: 5, step: 1 }, description: 'How many stories.', table: { category: 'Viewer' } },
    start: { name: 'Start story', control: { type: 'range', min: 0, max: 4, step: 1 }, description: 'Index of the first story shown.', table: { category: 'Viewer' } },
    startPaused: { name: 'Start paused', control: 'boolean', description: 'The timer waits for Play.', table: { category: 'Viewer' } },
    showAuthor: { name: 'Show author', control: 'boolean', description: 'Avatar, name and time in the header.', table: { category: 'Parts' } },
    showClose: { name: 'Show close', control: 'boolean', description: 'The Close button.', table: { category: 'Parts' } },
  },
  render: ({ count, start, startPaused, showAuthor, showClose }) => (
    <StoryViewer
      key={`${count}-${start}-${startPaused}`}
      stories={slides.slice(0, count)}
      defaultIndex={Math.min(start, count - 1)}
      defaultPaused={startPaused}
      author={showAuthor ? author : undefined}
      onClose={showClose ? () => {} : undefined}
    />
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  render: () => {
    const onClose = fn();
    const onIndexChange = fn();
    const onComplete = fn();
    return <StoryViewer stories={slides.slice(0, 3)} author={author} defaultPaused onClose={onClose} onIndexChange={onIndexChange} onComplete={onComplete} />;
  },
  play: async ({ canvas }) => {
    const viewer = canvas.getByRole('group', { name: 'Stories' });
    const bar = canvas.getByRole('progressbar', { name: 'Story progress' });
    await expect(bar).toHaveAttribute('aria-valuetext', 'Story 1 of 3');
    await expect(viewer).toHaveAttribute('data-state', 'paused');
    // Every control is a 44 x 44 target.
    for (const name of ['Play story', 'Close stories', 'Previous story', 'Next story']) {
      const r = canvas.getByRole('button', { name }).getBoundingClientRect();
      await expect(Math.round(r.width)).toBeGreaterThanOrEqual(44);
      await expect(Math.round(r.height)).toBeGreaterThanOrEqual(44);
    }
    // Buttons.
    await userEvent.click(canvas.getByRole('button', { name: 'Next story' }));
    await waitFor(() => expect(bar).toHaveAttribute('aria-valuetext', 'Story 2 of 3'));
    const parts = viewer.querySelectorAll('[data-slot="story-progress"]');
    await expect(Array.from(parts).map(p => p.getAttribute('data-state'))).toEqual(['done', 'current', 'next']);
    await userEvent.click(canvas.getByRole('button', { name: 'Previous story' }));
    await waitFor(() => expect(bar).toHaveAttribute('aria-valuetext', 'Story 1 of 3'));
    // Tap areas: right goes forward, left goes back.
    await userEvent.click(viewer.querySelector('[data-slot="story-tap-next"]')!);
    await waitFor(() => expect(bar).toHaveAttribute('aria-valuetext', 'Story 2 of 3'));
    await userEvent.click(viewer.querySelector('[data-slot="story-tap-prev"]')!);
    await waitFor(() => expect(bar).toHaveAttribute('aria-valuetext', 'Story 1 of 3'));
    // Keys on the viewer.
    viewer.focus();
    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => expect(bar).toHaveAttribute('aria-valuetext', 'Story 2 of 3'));
    await userEvent.keyboard('{ArrowLeft}');
    await waitFor(() => expect(bar).toHaveAttribute('aria-valuetext', 'Story 1 of 3'));
    // Pause and Play swap.
    await userEvent.click(canvas.getByRole('button', { name: 'Play story' }));
    await waitFor(() => expect(viewer).toHaveAttribute('data-state', 'playing'));
    await userEvent.click(canvas.getByRole('button', { name: 'Pause story' }));
    await waitFor(() => expect(viewer).toHaveAttribute('data-state', 'paused'));
  },
};

export const CloseAndCompleteCheck: Story = {
  tags: ['!dev'],
  render: () => {
    // A tiny viewer so the last Next ends the stories.
    const [log, setLog] = React.useState('');
    return (
      <>
        <StoryViewer stories={slides.slice(0, 2)} defaultPaused onClose={() => setLog(l => `${l} closed`)} onComplete={() => setLog(l => `${l} complete`)} />
        <p role="status" className="sr-only">{log.trim()}</p>
      </>
    );
  },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Next story' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Next story' }));
    await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('complete'));
    await userEvent.click(canvas.getByRole('button', { name: 'Close stories' }));
    await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('complete closed'));
    canvas.getByRole('group', { name: 'Stories' }).focus();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('complete closed closed'));
  },
};

export const HoldCheck: Story = {
  tags: ['!dev'],
  render: () => <StoryViewer stories={slides.slice(0, 3)} duration={60000} />,
  play: async ({ canvas }) => {
    const viewer = canvas.getByRole('group', { name: 'Stories' });
    const next = viewer.querySelector('[data-slot="story-tap-next"]')!;
    await expect(viewer).toHaveAttribute('data-state', 'playing');
    // A long press pauses while held and does not turn the page.
    const user = userEvent.setup();
    await user.pointer({ keys: '[MouseLeft>]', target: next });
    await waitFor(() => expect(viewer).toHaveAttribute('data-state', 'paused'));
    await new Promise(r => setTimeout(r, 400));
    await user.pointer({ keys: '[/MouseLeft]', target: next });
    await waitFor(() => expect(viewer).toHaveAttribute('data-state', 'playing'));
    await expect(canvas.getByRole('progressbar', { name: 'Story progress' })).toHaveAttribute('aria-valuetext', 'Story 1 of 3');
  },
};

export const TimerCheck: Story = {
  tags: ['!dev'],
  render: () => <StoryViewer stories={slides.slice(0, 3)} duration={300} />,
  play: async ({ canvas }) => {
    const bar = canvas.getByRole('progressbar', { name: 'Story progress' });
    // The timer moves to the next story on its own.
    await waitFor(() => expect(bar).toHaveAttribute('aria-valuetext', 'Story 2 of 3'), { timeout: 3000 });
    await userEvent.click(canvas.getByRole('button', { name: 'Pause story' }));
    const frozen = bar.getAttribute('aria-valuetext');
    await new Promise(r => setTimeout(r, 700));
    await expect(bar).toHaveAttribute('aria-valuetext', frozen!);
    // Play again: it finishes the remaining stories.
    await userEvent.click(canvas.getByRole('button', { name: 'Play story' }));
    await waitFor(() => expect(bar).toHaveAttribute('aria-valuetext', 'Story 3 of 3'), { timeout: 3000 });
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="h-[560px] w-[276px] overflow-hidden"><Story /></div>],
  render: () => (
    <StoryViewer
      stories={[
        { id: 'a', title: 'Long', content: <Slide tone="bg-primary text-primary-foreground" title="An extremely long headline that must wrap inside the narrow column" text="Averyveryveryverylongwordwithoutanybreaksatalltotestthatnothingoverflows" /> },
        ...slides.slice(1, 5),
        { id: 'f', title: 'Extra', content: <Slide tone="bg-muted text-foreground" title="Extra" text="Seven bars in a narrow column." /> },
        { id: 'g', title: 'More', content: <Slide tone="bg-muted text-foreground" title="More" text="Still fits." /> },
      ]}
      author={{ name: 'Acme Studio and Friends of the Neighbourhood Association', initials: 'AS', meta: 'Posted a very long time ago in a faraway place' }}
      defaultPaused
      onClose={() => {}}
    />
  ),
  play: async ({ canvas }) => {
    const viewer = canvas.getByRole('group', { name: 'Stories' });
    await expect(viewer.scrollWidth).toBeLessThanOrEqual(viewer.clientWidth + 1);
    await expect(viewer.querySelectorAll('[data-slot="story-progress"]').length).toBe(7);
    for (const name of ['Play story', 'Close stories', 'Previous story', 'Next story']) await expect(canvas.getByRole('button', { name })).toBeVisible();
  },
};

export const DefaultDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' } };
