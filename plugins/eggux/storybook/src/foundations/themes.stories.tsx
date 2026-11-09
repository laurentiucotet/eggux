import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils';
import { Mono, Page, Section } from './page';

const meta = {
  title: 'Foundations/Themes and looks',
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
    docs: { description: { component: 'The same components in every look and scheme at once. A look (Platform, Back office, Showcase) and a scheme (light, dark) are two token sets that combine; components do not know which one is active.' } },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

// Each panel carries the theme classes itself, so six themes show side by side whatever the
// toolbar says. Back office is shown with Compact density, how it is meant to be used.
const panels = [
  { id: 'platform-light', name: 'Platform, light', cls: '' },
  { id: 'back-office-light', name: 'Back office, light', cls: 'theme-corporate density-compact' },
  { id: 'showcase-light', name: 'Showcase, light', cls: 'theme-showcase' },
  { id: 'platform-dark', name: 'Platform, dark', cls: 'dark' },
  { id: 'back-office-dark', name: 'Back office, dark', cls: 'theme-corporate dark density-compact' },
  { id: 'showcase-dark', name: 'Showcase, dark', cls: 'theme-showcase dark' },
];

function Panel({ id, name, cls }: (typeof panels)[number]) {
  return (
    <div data-testid={id} className={cn(cls, 'flex flex-col gap-4 rounded-xl border border-border bg-background p-5 text-foreground shadow-xs')}>
      <h4 className="m-0 text-base leading-6 font-semibold">{name}</h4>
      <div className="flex flex-wrap items-center gap-2">
        <Button>Send invoice</Button>
        <Button variant="outline">Cancel</Button>
        <Badge variant="soft-success">Paid</Badge>
      </div>
      <Input aria-label={`Customer, ${name}`} placeholder="Customer name" />
      <ToggleGroup type="single" defaultValue="list" aria-label={`View, ${name}`}>
        <ToggleGroupItem value="list" label="List" />
        <ToggleGroupItem value="board" label="Board" />
        <ToggleGroupItem value="calendar" label="Calendar" />
      </ToggleGroup>
      <Checkbox defaultChecked label="Remind me before it is due" />
    </div>
  );
}

function Themes() {
  return (
    <Page
      themed={false}
      title="Themes and looks"
      intro="One set of components, many looks. Platform is what customers see (pill controls, soft corners). Back office is for staff (square controls, small corners, denser). Showcase shows how a client brand re-colors the same tokens."
    >
      <Section title="Same components, six looks" note="Every panel is the same code. Only the tokens around it differ.">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {panels.map(p => (
            <Panel key={p.id} {...p} />
          ))}
        </div>
      </Section>
      <Section title="When a component must differ by look" note="Pick the lightest tool that works.">
        <ol className="m-0 flex list-decimal flex-col gap-2 pl-5 text-sm leading-5">
          <li><strong>A token</strong>, when only a value differs: color, radius, spacing, font, border. The component already reads the variable; change it for that look in Figma and export again. Example: <Mono>--button-radius</Mono> is a pill on Platform and 4 px on Back office.</li>
          <li><strong>A prop</strong>, when the structure differs but the behavior is the same: a toggle group with icons only, a compact table cell. The prop sets the structure; tokens set the style.</li>
          <li><strong>A separate component</strong>, only when the behavior differs. Name it for what it does, not for the look.</li>
        </ol>
      </Section>
    </Page>
  );
}

export const Overview: Story = {
  // Pinned: the page shows all six by itself, so the toolbar choice must not change its base.
  globals: { theme: 'Light' },
  render: () => <Themes />,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getByRole('heading', { level: 2, name: 'Themes and looks' })).toBeVisible();
    for (const p of panels) await expect(c.getByTestId(p.id)).toBeVisible();
    // Back office is square: its button radius is smaller than the platform pill.
    const radius = (id: string) => parseFloat(getComputedStyle(within(c.getByTestId(id)).getByRole('button', { name: 'Send invoice' })).borderTopLeftRadius);
    await expect(radius('back-office-light')).toBeLessThan(radius('platform-light'));
  },
};
