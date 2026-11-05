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
          browser: {
            enabled: true,
            headless: true,
            // PW_CHROMIUM: path of a preinstalled Chromium (cloud sessions), else Playwright's own.
            provider: playwright(process.env.PW_CHROMIUM ? { launchOptions: { executablePath: process.env.PW_CHROMIUM } } : {}),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
}));
