import path from 'node:path';
import { defineConfig, mergeConfig } from 'vitest/config';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import viteConfig from './vite.config';

// Every story is a test: it must render without errors, pass its play function (interaction
// test) and pass the axe accessibility checks (parameters.a11y.test = 'error' in preview.tsx).
export default mergeConfig(viteConfig, defineConfig({
  test: {
    projects: [
      {
        extends: true,
        plugins: [storybookTest({ configDir: path.join(import.meta.dirname, '.storybook') })],
        test: {
          name: 'storybook',
          setupFiles: [path.join(import.meta.dirname, '.storybook/vitest.setup.ts')],
          browser: {
            enabled: true,
            headless: true,
            // PW_CHROMIUM: path of a preinstalled Chromium (cloud sessions), else Playwright's own.
            // Locale and time zone match Chromatic's capture browser (en-US, UTC), so a test that
            // passes here passes there, whatever the machine's own settings are.
            provider: playwright({
              ...(process.env.PW_CHROMIUM ? { launchOptions: { executablePath: process.env.PW_CHROMIUM } } : {}),
              contextOptions: { locale: 'en-US', timezoneId: 'UTC' },
            }),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
}));
