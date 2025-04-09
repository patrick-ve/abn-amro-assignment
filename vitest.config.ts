/* eslint-disable */
import { defineVitestConfig } from '@nuxt/test-utils/config';

export default defineVitestConfig({
  test: {
    include: [
      'app/components/__tests__/*.spec.ts',
    ],
    environment: 'nuxt',
    setupFiles: ['./vitest.setup.ts'],
  },
});
