// @ts-check

import tseslint from 'typescript-eslint';
import nextPlugin from 'eslint-config-next';

export default tseslint.config(
  ...nextPlugin,
  {
    ignores: ["build/"],
  },
);
