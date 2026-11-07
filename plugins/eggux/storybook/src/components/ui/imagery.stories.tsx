import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fireEvent, fn, userEvent, within } from 'storybook/test';
import { AvatarUpload, DeviceFrame, ImageCompareSlider, ImageCropper, ImageFigure, MapView, type AvatarUploadState } from './imagery';

const meta = {
  title: 'Components/Image/Image',
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Image tools. Map View: a map placeholder with a centered pin, place and address, zoom controls and attribution (pass `src` for a static map). Image Cropper: square or circle selection, drag or arrow keys to move, slider or +/- to zoom, Rotate. Avatar Upload: circle or square, empty, filled, uploading and error. Image Compare Slider: before and after with a draggable handle (arrow keys too). Device Frame: browser or phone around a screenshot. Image Figure: image, caption and credit. Image Placeholder and Image Thumbnail have their own pages. Figma: Image page. Guide: eggux build-ui/components/file-upload.md, content.md' } },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => el.getBoundingClientRect();
const onSave = fn();
const onFileSelect = fn();
const onRemove = fn();

export const Map: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <MapView label="Acme HQ" address="Strada Exemplu 12, Bucharest" onZoomIn={fn()} onZoomOut={fn()} />
      <MapView className="w-96" showLabel={false} showControls={false} label="Acme HQ, Strada Exemplu 12, Bucharest" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const [map, small] = Array.from(canvasElement.querySelectorAll('[data-slot="map"]'));
    await expect(box(map).width).toBe(720);
    await expect(Math.round(box(map).height)).toBe(405);
    await expect(c.getByText('Acme HQ')).toBeVisible();
    await expect(c.getAllByRole('button', { name: 'Zoom in' })).toHaveLength(1);
    await expect(c.getAllByText('Map data © OpenStreetMap')).toHaveLength(2);
    // The drawing scales with the map; the pin stays centered.
    const pin = small.querySelector('[data-slot="map-pin"]')!;
    await expect(Math.abs(box(pin).left + box(pin).width / 2 - (box(small).left + box(small).width / 2 - 19.5))).toBeLessThan(1);
    await expect(within(small as HTMLElement).getByText('Acme HQ, Strada Exemplu 12, Bucharest')).toHaveClass('sr-only');
  },
};

export const Cropper: Story = {
  render: () => (
    <div className="flex flex-wrap gap-8">
      <ImageCropper onSave={onSave} />
      <ImageCropper shape="circle" label="Crop profile photo" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const [square, circle] = Array.from(canvasElement.querySelectorAll('[data-slot="image-cropper"]'));
    await expect(box(square).width).toBe(480);
    await expect(Math.round(box(square).height)).toBe(420);
    const sel = square.querySelector('[data-slot="image-cropper-selection"]')!;
    await expect(box(sel).width).toBe(220);
    await expect(getComputedStyle(circle.querySelector('[data-slot="image-cropper-selection"]')!).borderRadius).not.toBe('0px');
    const area = within(square as HTMLElement).getByRole('group', { name: /Crop area/ });
    area.focus();
    await userEvent.keyboard('{ArrowRight}{ArrowRight}{ArrowDown}+');
    const image = square.querySelector<HTMLElement>('[data-slot="image-cropper-image"]')!;
    await expect(image.style.transform).toContain('translate(20px, 10px)');
    await expect(within(square as HTMLElement).getByRole('slider', { name: 'Zoom' })).toHaveAttribute('aria-valuenow', '60');
    await userEvent.click(within(square as HTMLElement).getByRole('button', { name: 'Rotate 90°' }));
    await expect(image.style.transform).toContain('rotate(90deg)');
    await userEvent.click(within(square as HTMLElement).getByRole('button', { name: 'Save' }));
    await expect(onSave).toHaveBeenCalledWith({ x: 20, y: 10, zoom: 2.2, rotation: 90 });
    await expect(c.getByRole('group', { name: /Crop profile photo/ })).toBeVisible();
  },
};

const states: AvatarUploadState[] = ['empty', 'filled', 'uploading', 'error'];

export const AvatarUploads: Story = {
  render: () => {
    return (
      <div className="grid grid-cols-[repeat(2,max-content)] gap-x-12 gap-y-6">
        {states.map((s) => (
          <React.Fragment key={s}>
            <AvatarUpload state={s} progress={60} error="File is larger than 5 MB. Choose a smaller image." onFileSelect={onFileSelect} onRemove={onRemove} showRemove={s === 'filled'} label="Profile photo" />
            <AvatarUpload state={s} shape="square" initials="AC" progress={60} label="Workspace logo" error="Use a PNG or SVG file." />
          </React.Fragment>
        ))}
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const groups = c.getAllByRole('group');
    await expect(groups).toHaveLength(8);
    await expect(box(groups[0]).width).toBe(344);
    await expect(Math.round(box(groups[0]).height)).toBe(100);
    // Empty says Upload; filled says Change and offers Remove.
    await expect(within(groups[0]).getByRole('button', { name: 'Upload' })).toBeVisible();
    await expect(within(groups[2]).getByRole('button', { name: 'Change' })).toBeVisible();
    await userEvent.click(within(groups[2]).getByRole('button', { name: 'Remove' }));
    await expect(onRemove).toHaveBeenCalled();
    // The square filled logo is drawn on the brand color.
    const logo = groups[3].querySelector('[data-slot="avatar-surface"]')!;
    await expect(getComputedStyle(logo).backgroundColor).toBe('rgb(37, 99, 235)');
    await expect(within(groups[4]).getByRole('status')).toHaveTextContent('Uploading… 60%');
    await expect(within(groups[4]).getByRole('button', { name: 'Cancel upload of profile photo' })).toBeVisible();
    await expect(within(groups[6]).getByRole('alert')).toHaveTextContent('File is larger than 5 MB');
    // Picking a file calls back with it.
    const input = groups[0].querySelector<HTMLInputElement>('input[type=file]')!;
    const file = new File(['x'], 'me.png', { type: 'image/png' });
    await fireEvent.change(input, { target: { files: [file] } });
    await expect(onFileSelect).toHaveBeenCalledWith(file);
  },
};

export const CompareSlider: Story = {
  render: () => <ImageCompareSlider />,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const root = canvasElement.querySelector('[data-slot="image-compare-slider"]')!;
    await expect(box(root).width).toBe(640);
    await expect(Math.round(box(root).height)).toBe(360);
    const handle = c.getByRole('slider', { name: 'Compare before and after' });
    await expect(handle).toHaveAttribute('aria-valuenow', '50');
    handle.focus();
    await userEvent.keyboard('{ArrowRight}{ArrowRight}');
    await expect(handle).toHaveAttribute('aria-valuenow', '54');
    await userEvent.keyboard('{Home}');
    await expect(handle).toHaveAttribute('aria-valuetext', '0% before, 100% after');
    // Clicking moves the handle there.
    fireEvent.pointerDown(root, { clientX: box(root).left + box(root).width * 0.75, pointerId: 1 });
    fireEvent.pointerUp(root, { pointerId: 1 });
    await expect(handle).toHaveAttribute('aria-valuenow', '75');
    await expect(c.getByText('Before')).toBeVisible();
    await expect(c.getByText('After')).toBeVisible();
  },
};

export const DeviceFrames: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-10">
      <DeviceFrame />
      <DeviceFrame device="phone" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [browser, phone] = Array.from(canvasElement.querySelectorAll('[data-slot="device-frame"]'));
    await expect(box(browser).width).toBe(960);
    await expect(Math.abs(box(browser).height - 581.875)).toBeLessThan(1);
    await expect(within(browser as HTMLElement).getByText('app.acme.com/invoices')).toBeVisible();
    await expect(box(phone).width).toBe(390);
    await expect(Math.round(box(phone).height)).toBe(844);
  },
};

export const Figure: Story = {
  render: () => (
    <div className="flex flex-wrap gap-8">
      <ImageFigure className="w-120" caption="The Bucharest office kitchen, where the team meets for lunch." />
      <ImageFigure className="w-120" ratio="16:9" caption="The Bucharest office kitchen, where the team meets for lunch." credit="Photo: Acme" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [plain, credited] = Array.from(canvasElement.querySelectorAll('figure'));
    await expect(Math.round(box(plain).height)).toBe(388);
    await expect(within(credited as HTMLElement).getByText('Photo: Acme').closest('figcaption')).not.toBeNull();
  },
};

function Edge() {
  const long = 'Acme Holdings International Headquarters and Visitor Centre';
  return (
    <div className="flex flex-col gap-8">
      <MapView className="w-80" label={long} address="Strada Exemplu 12, Sector 1, Bucharest, Romania, 010101" />
      <ImageCropper className="w-80" />
      <AvatarUpload state="error" label={long} error="File is larger than 5 MB, and its sides are under 256 px. Choose a bigger, lighter image." />
      <ImageCompareSlider className="w-80" beforeLabel="Before the redesign of the invoices list" afterLabel="After the redesign of the invoices list" />
      <DeviceFrame className="w-96" address="app.acme.com/invoices/INV-2026-000123/payments/history?tab=reminders" />
      <ImageFigure className="w-64" caption="A very long caption that wraps onto several lines without overflowing the figure width." credit="Photo: Ana Popescu for Acme, used with permission" />
    </div>
  );
}

export const EdgeCases: Story = {
  tags: ['!dev'],
  render: () => <Edge />,
  play: async ({ canvasElement }) => {
    for (const sel of ['image-cropper', 'device-frame']) {
      const el = canvasElement.querySelector(`[data-slot="${sel}"]`)!;
      await expect(el.scrollWidth).toBeLessThanOrEqual(el.clientWidth + 1);
    }
    // Long compare labels stay in their half.
    const compare = canvasElement.querySelector('[data-slot="image-compare-slider"]')!;
    for (const badge of Array.from(compare.querySelectorAll('[data-slot="badge"]'))) await expect(box(badge).width).toBeLessThanOrEqual(box(compare).width / 2 - 18);
    const cropper = canvasElement.querySelector('[data-slot="image-cropper"]')!;
    await expect(box(cropper).width).toBe(320);
    const map = canvasElement.querySelector('[data-slot="map"]')!;
    const label = map.querySelector('[data-slot="map-pin"] p')!;
    await expect(label.scrollWidth).toBeGreaterThan(label.clientWidth);
  },
};

const All = () => (
  <div className="flex flex-col gap-8 bg-background p-6">
    <MapView address="Strada Exemplu 12, Bucharest" />
    <ImageCropper />
    <div className="flex flex-col gap-4">
      {states.map((s) => (
        <AvatarUpload key={s} state={s} progress={60} showRemove={s === 'filled'} error="File is larger than 5 MB. Choose a smaller image." />
      ))}
      <AvatarUpload state="filled" shape="square" initials="AC" label="Workspace logo" />
    </div>
    <ImageCompareSlider />
    <DeviceFrame />
    <ImageFigure className="w-120" caption="The Bucharest office kitchen." credit="Photo: Acme" />
  </div>
);
export const AllDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' }, render: () => <All /> };
export const AllCorporate: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' }, render: () => <All /> };
