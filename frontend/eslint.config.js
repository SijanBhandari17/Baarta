import js from '@eslint/js';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import nodePlugin from 'eslint-plugin-node';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    ignores: ['node_modules/**', 'dist/**', 'build/**'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        // Existing globals
        document: 'readonly',
        navigator: 'readonly',
        window: 'readonly',
        console: 'readonly',
        process: 'readonly',
        // Add these web API globals
        FormData: 'readonly',
        fetch: 'readonly',
        Response: 'readonly',
        Request: 'readonly',
        Headers: 'readonly',
        URL: 'readonly',
        URLSearchParams: 'readonly',
        // You may need more depending on what you're using
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      node: nodePlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // JavaScript
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
      'no-unused-vars': 'warn',
      'no-console': 'warn',

      // React
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      'react/react-in-jsx-scope': 'off', // Not needed in React 17+
      'react/prop-types': 'off',
      'react/jsx-closing-bracket-location': ['warn', 'line-aligned'],

      // React Hooks
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // Node.js
      'node/no-unpublished-require': 'off',
      'node/no-unsupported-features/es-syntax': 'off', // Allow ES modules
    },
  },
  // Node-specific rules for backend files
  {
    files: ['server/**/*.js'],
    rules: {
      'no-console': 'off', // Allow console in server code
    },
  },
];
