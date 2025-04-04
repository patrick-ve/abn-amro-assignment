/* eslint-disable */
import antfu from '@antfu/eslint-config';

export default antfu(
  {
    formatters: true,
  },
  {
    rules: {
      'vue/no-deprecated-slot-attribute': 'off',
      'eslint-comments/no-unlimited-disable': 'off',
    },
  }
);
