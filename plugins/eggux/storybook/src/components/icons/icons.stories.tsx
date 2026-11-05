import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { icons, type IconName } from './index';

// EGG UI icons: the Figma Icon/<name> components, drawn by IconMCP (MIT). Outline, sharp
// corners, a 1 px line at every size.
const names = Object.keys(icons) as IconName[];

function Gallery({ size }: { size: number }) {
  return (
    <ul className="grid list-none grid-cols-[repeat(auto-fill,minmax(112px,1fr))] gap-2 p-0">
      {names.map((name) => {
        const Icon = icons[name];
        return (
          <li key={name} className="flex flex-col items-center gap-2 rounded-md border border-border p-3 text-xs text-muted-foreground">
            <Icon size={size} className="text-foreground" />
            <span>{name}</span>
          </li>
        );
      })}
    </ul>
  );
}

const meta = {
  title: 'Foundations/Icons',
  component: Gallery,
  args: { size: 24 },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Gallery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const All: Story = {
  play: async ({ canvasElement }) => {
    const svgs = canvasElement.querySelectorAll('svg.egg-icon');
    await expect(svgs.length).toBe(names.length);
    // The line stays 1 px whatever the size: every shape uses a non-scaling stroke.
    const shape = svgs[0].querySelector('path, line, rect, circle') as SVGElement;
    await expect(getComputedStyle(shape).vectorEffect).toBe('non-scaling-stroke');
    await expect(svgs[0].getAttribute('aria-hidden')).toBe('true');
  },
};

export const Small: Story = { args: { size: 16 } };
