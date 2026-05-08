import prettierConfig from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import'
import prettier from 'eslint-plugin-prettier'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'

import babelParser from '@babel/eslint-parser'
import tsParser from '@typescript-eslint/parser'

const sharedGlobals = {
  window: 'readonly',
  document: 'readonly',
  console: 'readonly',
  process: 'readonly',
  __dirname: 'readonly',
  __filename: 'readonly',
  module: 'readonly',
  require: 'readonly',
  Buffer: 'readonly',
  global: 'readonly',
  describe: 'readonly',
  it: 'readonly',
  test: 'readonly',
  expect: 'readonly',
  vi: 'readonly',
  afterEach: 'readonly',
}

const sharedPlugins = {
  import: importPlugin,
  react,
  'react-hooks': reactHooks,
  prettier,
}

const sharedSettings = {
  react: {
    version: 'detect',
  },
}

const sharedRules = {
  ...react.configs.recommended.rules,
  ...reactHooks.configs.recommended.rules,
  ...prettierConfig.rules,
  semi: ['error', 'never'],
  'no-prototype-builtins': 'off',
  'react/react-in-jsx-scope': 'off',
  'react-hooks/rules-of-hooks': 'error',
  'react-hooks/exhaustive-deps': 'warn',
  'react/prop-types': 'off',
  'prettier/prettier': [
    'error',
    {
      endOfLine: 'auto',
    },
  ],
  // Import ordering rules: react -> namespaced external (@package) -> non-namespaced external -> internal -> local
  'import/order': [
    'error',
    {
      groups: [
        'builtin', // Node.js built-in modules
        'external', // External libraries (non-namespaced)
        'internal', // Internal absolute imports
        ['parent', 'sibling', 'index'], // Relative imports (local)
      ],
      pathGroups: [
        // React imports first
        {
          pattern: 'react',
          group: 'external',
          position: 'before',
        },
        {
          pattern: 'react-dom',
          group: 'external',
          position: 'before',
        },
        {
          pattern: 'react/**',
          group: 'external',
          position: 'before',
        },
        // Namespaced external imports (@package/name) - after React, before non-namespaced externals
        // Create a separate group for namespaced imports to ensure they come before non-namespaced
        {
          pattern: '@*/**',
          group: 'external',
          position: 'after',
        },
      ],
      pathGroupsExcludedImportTypes: ['react'],
      'newlines-between': 'always',
      // Alphabetize imports within each group
      // Note: For external group, pathGroups ordering takes precedence:
      // React -> namespaced (@package) -> non-namespaced
      alphabetize: {
        order: 'asc',
        caseInsensitive: true,
      },
    },
  ],
  'import/newline-after-import': 'error',
  'import/no-duplicates': 'error',
}

export default [
  {
    ignores: ['dist/**', 'types/**', 'node_modules/**', 'coverage/**'],
  },
  // TypeScript files
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: sharedGlobals,
    },
    plugins: sharedPlugins,
    settings: sharedSettings,
    rules: sharedRules,
  },
  // JavaScript files
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        requireConfigFile: false,
        babelOptions: {
          plugins: ['@babel/plugin-syntax-import-assertions'],
        },
      },
      globals: sharedGlobals,
    },
    plugins: sharedPlugins,
    settings: sharedSettings,
    rules: sharedRules,
  },
]
