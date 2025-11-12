import nx from '@nx/eslint-plugin';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  ...nx.configs['flat/angular'],
  ...nx.configs['flat/angular-template'],
  {
    ignores: [
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
              '^(@nestjs)(.*|$)',
              '^(@typeorm)(.*|$)',
              '^(rxjs)(.*|$)',
            ],
            ['^(?!(@angular|rxjs|@next.lanets.ca|@lanets|./|../)).*$'],
            ['^(@next.lanets.ca|@lanets)(.*|$)'],
            ['^(../)(.*|$)', '^(./)(.*|$)'],
          ],
        },
      ],
      'no-alert': 'error',
    },
  },
  {
    files: ['**/*.ts'],
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
    },
  },
  {
    files: ['**/*.html'],
    // Override or add rules here
    rules: {
      '@typescript-eslint/adjacent-overload-signatures': 'off',
      '@angular-eslint/template/eqeqeq': 'error',
      '@angular-eslint/template/alt-text': 'error',
      '@angular-eslint/template/elements-content': 'error',
      '@angular-eslint/template/table-scope': 'error',
      '@angular-eslint/template/banana-in-box': 'error',
      '@angular-eslint/template/use-track-by-function': 'error',
      '@angular-eslint/template/button-has-type': 'error',
      '@angular-eslint/template/no-positive-tabindex': 'error',
      '@angular-eslint/template/click-events-have-key-events': 'error',
      '@angular-eslint/template/mouse-events-have-key-events': 'error',
      '@angular-eslint/template/conditional-complexity': [
        'error',
        {
          maxComplexity: 3,
        },
      ],
      '@angular-eslint/template/no-any': 'error',
      '@angular-eslint/template/no-autofocus': 'error',
      '@angular-eslint/template/no-duplicate-attributes': ['error'],
    },
  },
];
