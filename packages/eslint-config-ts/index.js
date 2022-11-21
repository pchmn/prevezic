module.exports = {
  env: {
    browser: true,
    node: true
  },
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'prettier'
  ],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': ['error']
  }
};
