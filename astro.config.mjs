// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://danion1.github.io',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
});
