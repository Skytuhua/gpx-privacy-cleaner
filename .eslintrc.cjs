/* ESLint config — enforces no-network and general TS hygiene. */
module.exports = {
  root: true,
  env: { browser: true, es2022: true, node: true },
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  ignorePatterns: ['dist', 'node_modules', '*.config.js', '*.config.ts', 'e2e', 'test'],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'warn',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    // Privacy guardrail: forbid any networking primitive in application source.
    'no-restricted-globals': [
      'error',
      { name: 'fetch', message: 'No network: this app must never make requests.' },
      { name: 'XMLHttpRequest', message: 'No network: this app must never make requests.' },
    ],
    'no-restricted-properties': [
      'error',
      { object: 'navigator', property: 'sendBeacon', message: 'No network allowed.' },
    ],
  },
};
