import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, userEvent, within } from 'storybook/test';
import { Package } from '@/components/icons';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table';
import { TableCellAvatars, TableCellBadges, TableCellFile, TableCellMedia, TableCellProgress, TableCellUser } from './table-cells-rich';

const product = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="#d6c3a5"/><rect x="18" y="20" width="28" height="30" rx="4" fill="#8a6f4e"/></svg>');
const team = [
  { name: 'Ana Popescu', initials: 'AP' },
  { name: 'Maria Ilie', initials: 'MI' },
  { name: 'Dan Cristea', initials: 'DC' },
  { name: 'Radu Georgescu', initials: 'RG' },
  { name: 'Elena Dumitru', initials: 'ED' },
];

const meta = {
  title: 'Components/Table/Table Cells Rich',
  component: TableCellUser,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Rich cell contents for a TableCell: User (avatar, name, email), Progress (bar and the number as text), File (type icon, name truncating in the middle, size), Badges (Badge List with +N), Avatars (Avatar Group sm with +N), Media (Thumbnail, title, meta). Every one stays on one line; use a fixed table for the ellipsis. Figma: Table page / Table Cell User, Progress, File, Badges, Avatars, Media. Guide: eggux build-ui/components/table.md' } },
  },
  args: { name: 'Ana Popescu', email: 'ana.popescu@example.com', initials: 'AP' },
  render: () => (
    <Table fixed className="w-[1100px]">
      <TableHeader>
        <TableRow>
          <TableHead className="w-[220px]">Owner</TableHead>
          <TableHead className="w-[150px]">Progress</TableHead>
          <TableHead className="w-[220px]">Contract</TableHead>
          <TableHead className="w-[200px]">Tags</TableHead>
          <TableHead className="w-[120px]">Team</TableHead>
          <TableHead className="w-[240px]">Product</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell><TableCellUser name="Ana Popescu" email="ana.popescu@example.com" initials="AP" /></TableCell>
          <TableCell><TableCellProgress value={75} label="Onboarding for Northwind" /></TableCell>
          <TableCell><TableCellFile name="contract-northwind.pdf" size="240 KB" /></TableCell>
          <TableCell><TableCellBadges items={['Finance', 'Q4 2026', 'Internal', 'EU', 'Legal']} max={2} /></TableCell>
          <TableCell><TableCellAvatars people={team} /></TableCell>
          <TableCell><TableCellMedia title="Linen tote bag" meta="SKU 10482 · 3 variants" src={product} /></TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
} satisfies Meta<typeof TableCellUser>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();

// Figma: User 38 high with a 32 avatar, Progress bar 96 + "75%", File 20, Badges with +3, Avatars 3 + "+2", Media with a 32 thumbnail.
export const Default: Story = {
  play: async ({ canvas, canvasElement }) => {
    const user = canvasElement.querySelector('[data-slot="table-cell-user"]')!;
    await expect(Math.round(box(user).height)).toBe(38);
    await expect(canvas.getByRole('progressbar', { name: 'Onboarding for Northwind' })).toHaveAttribute('aria-valuenow', '75');
    const bar = canvas.getByRole('progressbar');
    await expect(Math.round(box(bar).width)).toBe(96);
    await expect(canvas.getByText('75%')).toBeInTheDocument();
    await expect(Math.round(box(canvasElement.querySelector('[data-slot="table-cell-file"]')!).height)).toBe(20);
    await expect(canvas.getByRole('button', { name: '+3 more' })).toBeInTheDocument();
    const media = canvasElement.querySelector('[data-slot="table-cell-media"]')!;
    await expect(Math.round(box(media.querySelector('[data-slot="thumbnail"]')!).width)).toBe(32);
    await userEvent.click(canvas.getByRole('button', { name: '+3 more' }));
    await expect(within(await screen.findByRole('dialog')).getByText('Legal')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
  },
};

// Stress: narrow cells truncate; the file keeps its extension visible; no thumbnail shows the fallback icon. Tests only.
export const Stress: Story = {
  tags: ['!dev'],
  render: () => (
    <Table fixed className="w-[480px]">
      <TableBody>
        <TableRow>
          <TableCell className="w-[160px]"><TableCellUser name="Alexandra-Maria Constantinescu" email="alexandra.constantinescu@acme-enterprise.com" initials="AC" /></TableCell>
          <TableCell className="w-[160px]"><TableCellFile name="contract-northwind-traders-international-2026-final.pdf" size="12.4 MB" /></TableCell>
          <TableCell className="w-[160px]"><TableCellMedia title="Linen tote bag with leather handles" meta="SKU 10482-XL · 12 variants" icon={<Package />} /></TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
  play: async ({ canvas, canvasElement }) => {
    const name = canvas.getByTitle('Alexandra-Maria Constantinescu');
    await expect(name.scrollWidth).toBeGreaterThan(name.clientWidth);
    await expect(canvas.getByText('2026-final.pdf'.slice(-10))).toBeVisible();
    await expect(canvasElement.querySelector('[data-slot="thumbnail"] img')).toBeNull();
  },
};

export const DefaultDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' } };
