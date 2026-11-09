// Shared layout of the Foundations pages: a title, an intro, the current theme, and sections.
import * as React from 'react';
import { themeName, useThemeVersion } from './tokens';

export function Page({ title, intro, themed = true, children }: { title: string; intro: React.ReactNode; themed?: boolean; children: React.ReactNode }) {
  useThemeVersion();
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 bg-background p-8 text-foreground">
      <header className="flex flex-col gap-2">
        <h2 className="m-0 text-3xl leading-9 font-semibold">{title}</h2>
        <p className="m-0 max-w-3xl text-base leading-6">{intro}</p>
        {themed ? (
          <p className="m-0 text-sm leading-5">
            Showing: <strong data-testid="theme-name">{themeName()}</strong>. Change Scheme or Look in the toolbar and the values below follow.
          </p>
        ) : null}
      </header>
      {children}
    </div>
  );
}

export function Section({ title, note, children }: { title: string; note?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="m-0 text-xl leading-7 font-semibold">{title}</h3>
      {note ? <p className="m-0 max-w-3xl text-sm leading-5">{note}</p> : null}
      {children}
    </section>
  );
}

/** A token name or technical value. */
export const Mono = ({ children }: { children: React.ReactNode }) => <code className="font-mono text-xs leading-4">{children}</code>;
