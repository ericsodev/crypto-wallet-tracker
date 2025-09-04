// eslint.config.js
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import eslint from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';

export default defineConfig([
  {
    ignores: ['./database/migrations/*.ts'],
    ...tseslint.configs.recommended,
  },
  eslint.configs.recommended,
  stylistic.configs.customize({
    semi: true,
    quotes: 'single',
  }),
]);
