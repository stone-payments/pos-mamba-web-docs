const { IS_PROD } = require('quickenv')

module.exports = {
  extends: [
    'standard',
    'prettier',
    'prettier/standard',
    'plugin:jest/recommended',
  ],
  parser: 'babel-eslint',
  plugins: ['standard', 'prettier', 'jest', 'html'],
  settings: {
    'html/html-extensions': ['.html'],
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    indent: [
      2,
      2,
      {
        SwitchCase: 1,
      },
    ],
    camelcase: 'off',
    'prettier/prettier': ['error', prettierOptions],
    'class-methods-use-this': 0,
    'no-console': IS_PROD() ? ['error', { allow: ['warn', 'error'] }] : 'off',
    'no-var': 'error',
    'comma-dangle': [2, 'always-multiline'],
    'no-new': 'off',
    'no-sequences': 'off',
  },
  globals: {
    cy: true,
  },
  overrides: [
    {
      files: ['**/__tests__/**/*.js', '**/*.test.js'],
      env: { jest: true },
    },
  ],
}
