module.exports = {
  root: true,
  parserOptions: {
    // Required for certain syntax usages
    ecmaVersion: 2020,
  },
  env: {
    es6: true,
    node: true,
  },
  extends: ['eslint:recommended', 'google'],
  rules: {
    // quotes: ['error', 'single'],
    'quote-props': ['error', 'as-needed'],
    'array-bracket-spacing': ['error', 'never'],
    'object-curly-spacing': 'off',
    'linebreak-style': 0,
    'no-undef': 0,
    indent: ['off'],
    'require-jsdoc': 0,
    camelcase: 'off',
    'prefer-template': 'off',
  },
};
