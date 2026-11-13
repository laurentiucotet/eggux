// Shared frame of the mobile pages. A phone screen is a column that fills the viewport height: the
// header on top, the content scrolling in the middle, the bottom bar (Bottom Nav or Bottom Action Bar)
// on the bottom. Stories open it at the base breakpoint (375 px) through `globals.viewport`; the frame
// also caps its own width at 480 px so it never looks like a desktop page when opened at full size.
import * as React from 'react';

export function PhoneScreen({ header, children, footer, className }: { header?: React.ReactNode; children: React.ReactNode; footer?: React.ReactNode; className?: string }) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[480px] flex-col bg-background text-foreground">
      {header}
      <main className={`min-h-0 flex-1 overflow-y-auto ${className ?? 'px-4 py-4'}`}>{children}</main>
      {footer}
    </div>
  );
}

/** Story parameters for a phone page: fullscreen, controls off, opened at the base (375 px) viewport. */
export const phoneStory = {
  layout: 'fullscreen' as const,
  controls: { disable: true },
};
export const phoneGlobals = { viewport: { value: 'base', isRotated: false } };
