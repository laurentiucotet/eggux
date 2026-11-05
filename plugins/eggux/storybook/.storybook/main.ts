import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y', '@storybook/addon-themes', '@storybook/addon-vitest'],
  framework: { name: '@storybook/react-vite', options: {} },
  // Remote or cloud sessions open Storybook through a forwarded host, which the dev server
  // refuses by default. STORYBOOK_ALLOW_ALL_HOSTS=1 accepts it; keep it off on shared networks.
  core: process.env.STORYBOOK_ALLOW_ALL_HOSTS ? { allowedHosts: true } : {},
};
export default config;
