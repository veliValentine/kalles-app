module.exports = {
  env: {
    node: true,
    es6: true,
    es2021: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'linebreak-style': 'off',
  },
};
