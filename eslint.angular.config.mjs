import nx from '@nx/eslint-plugin';
import { baseConfig } from './eslint.config.mjs';

export const angularEslintConfig = [
  ...baseConfig,
  ...nx.configs['flat/angular'],
  ...nx.configs['flat/angular-template'],
  {
    files: ['apps/**/*.ts'],
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
    files: ['libs/**/*.ts'],
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'lib',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'lib',
          style: 'kebab-case',
        },
      ],
    },
  },
  {
    files: [`**/*.html`],
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

export default angularEslintConfig;
