// EGG UI QR Code. Figma: QR Code (Mobile page, "QR Code / Component"). Size (sm 96, default 128, lg
// 160). A real, scannable QR code (qrcode.react) on a tile with radius lg; the tile padding is the
// quiet zone (sm 8, default 12, lg 16). Many scanners read inverted codes badly, so the code stays
// dark on a light tile in every theme (the Figma sample art follows the card tokens). Always put the
// action in text next to it ("Scan to get the app") plus a link or store badges for people who cannot
// scan. The image has alt text that says where it leads.
import * as React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { cn } from '@/lib/utils';

export type QrCodeSize = 'sm' | 'default' | 'lg';

const sizes = { sm: { box: 96, pad: 8 }, default: { box: 128, pad: 12 }, lg: { box: 160, pad: 16 } } as const;

export interface QrCodeProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  /** What the code opens: a URL or text. */
  value: string;
  /** Figma Size. Default default (128). */
  size?: QrCodeSize;
  /** Alt text: where it leads ("QR code to the Acme app in the App Store"). */
  alt: string;
}

function QrCode({ value, size = 'default', alt, className, ...props }: QrCodeProps) {
  const { box, pad } = sizes[size];
  return (
    <div
      data-slot="qr-code"
      data-size={size}
      role="img"
      aria-label={alt}
      style={{ width: box, height: box, padding: pad }}
      className={cn('inline-flex shrink-0 rounded-lg border border-border bg-white', className)}
      {...props}
    >
      {/* Keywords, not tokens: the code must be dark on light in every theme. */}
      <QRCodeSVG value={value} size={box - pad * 2} marginSize={0} fgColor="black" bgColor="white" level="M" aria-hidden="true" />
    </div>
  );
}

export { QrCode };
