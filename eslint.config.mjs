import nx from '@nx/eslint-plugin';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

export const baseConfig = [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: [
      '.nx/**',
      '**/node_modules/**',
      '**/dist',
      '**/vite.config.*.timestamp*',
      '**/vitest.config.*.timestamp*',
    ],
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
      'comma-dangle': [
        'warn',
        {
          arrays: 'always-multiline',
          imports: 'always-multiline',
          exports: 'always-multiline',
          objects: 'always-multiline',
          functions: 'always-multiline',
        },
      ],
      'simple-import-sort/exports': 'error',
      'no-duplicate-imports': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        {
          overrides: {
            constructors: 'off',
          },
        },
      ],
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            [
              '^(@angular)(.*|$)',
              '^(react)(.*|$)',
              '^(@nestjs)(.*|$)',
              '^(@typeorm)(.*|$)',
              '^(rxjs)(.*|$)',
            ],
            ['^(?!(@angular|rxjs|react|@nestjs|@typeorm|@webapp-template|@nodejs-webapp-template|./|../)).*$'],
            ['^(@webapp-template|@nodejs-webapp-template)(.*|$)'],
            ['^(../)(.*|$)', '^(./)(.*|$)'],
          ],
        },
      ],
      'no-alert': 'error',
    },
  },
];

export default baseConfig;
