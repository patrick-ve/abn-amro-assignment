import { defineVitestConfig } from '@nuxt/test-utils/config';

export default defineVitestConfig({
  test: {
    include: [
      'app/**/*.spec.ts',
      'vite/**/*.spec.ts',
      'server/**/*.spec.ts',
    ],
    environment: 'nuxt',
    setupFiles: ['./vitest.setup.ts'],
  },
});
