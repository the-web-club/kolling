import js from '@eslint/js';
import astro from 'eslint-plugin-astro';
import tseslint from 'typescript-eslint';

const kernregels = {
  'no-console': ['error', { allow: ['error'] }],
  eqeqeq: ['error', 'always'],
  'prefer-const': 'error',
};

const typeregels = {
  ...kernregels,
  '@typescript-eslint/no-explicit-any': 'error',
  '@typescript-eslint/no-non-null-assertion': 'error',
  '@typescript-eslint/consistent-type-imports': 'error',
};

export default tseslint.config(
  {
    ignores: [
      'dist/**',
      '.astro/**',
      '.vercel/**',
      'src/design/tokens.gegenereerd.ts',
      'src/styles/tokens.css',
    ],
  },
  js.configs.recommended,
  ...astro.configs.recommended,

  // Alleen TypeScript krijgt de typegestuurde regels. In .astro-bestanden leest
  // typescript-eslint de template-expressies niet, wat valse meldingen oplevert.
  {
    files: ['src/**/*.ts'],
    extends: [tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
    rules: typeregels,
  },
  {
    files: ['src/**/*.test.ts'],
    rules: { '@typescript-eslint/require-await': 'off' },
  },
  {
    files: ['src/**/*.astro'],
    rules: kernregels,
  },
  {
    files: ['*.config.{js,ts,mjs}', 'tokens/**/*.mjs', 'scripts/**/*.mjs'],
    languageOptions: {
      globals: {
        process: 'readonly',
        console: 'readonly',
        URL: 'readonly',
        Buffer: 'readonly',
        fetch: 'readonly',
      },
    },
  },
);
