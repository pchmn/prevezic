module.exports = {
  root: true,
  extends: ['prevezic-react'],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: ['@lib/*/*', '@app/*/*/*']
      }
    ]
  }
};
