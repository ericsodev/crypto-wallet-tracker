import tseslint from 'typescript-eslint';
import eslint from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';

export default tseslint.config(
  {
    ignores: [
      './database/migrations/*.ts',
      'node_modules/**/*',
      '**/.next',
      '**/next.config.js',
      '**/postcss.config.js',
    ],
  },
  eslint.configs.recommended,
  stylistic.configs.customize({
    semi: true,
    quotes: 'single',
  }),
);
