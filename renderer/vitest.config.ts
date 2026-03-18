import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['src/**/*.spec.ts'],
    globals: true,
    reporters: process.env['CI'] ? ['junit', 'default'] : ['default'],
    outputFile: {
      junit: '../test-results/renderer.xml',
    },
  },
});