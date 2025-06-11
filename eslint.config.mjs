// @ts-check

import js from '@eslint/js';
import globals from 'globals';

// Plugins
import typescript from '@typescript-eslint/eslint-plugin';
import * as tsParser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import * as importPlugin from 'eslint-plugin-import';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

// --- Constants for Clarity ---
const tsProjectPaths = [
  './apps/nest-backend/tsconfig.json',
  './apps/next-frontend/tsconfig.json',
  './packages/**/tsconfig.json',
];

const allSourceFiles = ['apps/**/*.{js,jsx,ts,tsx}', 'packages/**/*.{js,ts,tsx}'];
const tsSourceFiles = ['apps/**/*.{ts,tsx}', 'packages/**/*.{ts,tsx}'];
const reactSourceFiles = ['apps/next-frontend/**/*.{jsx,tsx}']; // Be specific about the React app's location

export default [
  // 1. Global Ignores and Base JavaScript Rules
  // =================================================================
  {
    ignores: ['**/dist/**', '**/node_modules/**', '.turbo/**', '.next/**'],
  },
  js.configs.recommended,

  // 2. TypeScript Configuration
  // =================================================================
  {
    files: tsSourceFiles,
    languageOptions: {
      globals: { ...globals.node, ...globals.browser },
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: tsProjectPaths,
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
    },
    rules: {
      ...typescript.configs.recommended.rules,
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', ignoreRestSiblings: true },
      ],
    },
  },

  // 3. React-Specific Configuration
  // =================================================================
  {
    files: reactSourceFiles,
    languageOptions: {
      globals: { ...globals.browser }, // React apps run in the browser
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off', // Not needed with modern React/Next.js
      'react/prop-types': 'off', // Redundant when using TypeScript
    },
  },

  // 4. Formatting and Import Rules (for ALL files)
  // =================================================================
  {
    files: allSourceFiles,
    plugins: {
      import: importPlugin,
      'simple-import-sort': simpleImportSort,
      prettier: prettierPlugin,
    },
    rules: {
      // Prettier Integration: Runs Prettier as an ESLint rule and reports differences as issues.
      ...prettierConfig.rules, // Disables ESLint rules that conflict with Prettier
      'prettier/prettier': ['warn', { endOfLine: 'auto' }],

      // Import Sorting: Enforces a consistent import order.
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      
      // Import Plugin Rules: Catches common import-related problems.
      // NOTE: 'import/order' is removed as it conflicts with 'simple-import-sort'.
      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',
      'import/no-unresolved': 'error',
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: tsProjectPaths,
        },
      },
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
    },
  },
];