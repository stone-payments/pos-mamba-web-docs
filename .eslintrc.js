module.exports = {
  extends: [
    './node_modules/@mamba/configs/eslint/index.js',
    './node_modules/@mamba/configs/eslint/jest.js',
    './node_modules/@mamba/configs/eslint/template.js',
  ],
  rules: {
    semi: [0, 'never'],
    'import/extensions': [0, 'never'],
    'no-return-assign': [0, 'never'],
    'no-sequences': [0, 'never'],
    'global-require': [0, 'never'],
    'no-bitwise': [0, 'never'],
  },
}
