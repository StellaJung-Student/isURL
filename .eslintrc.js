module.exports = {
  extends: ['airbnb-base', 'plugin:prettier/recommended', 'plugin:promise/recommended'],

  plugins: ['prettier', 'promise'],

  env: {
    jest: true,
    node: true,
    es2017: true,
  },

  rules: {
    'prettier/prettier': ['error'],
    'no-console': 'off',
    'linebreak-style': 'off',
    'no-plusplus': 'off',
    'no-async-promise-executor': 'off',
    'no-restricted-syntax': 'off',
    'no-unused-vars': 'off',
  },
};
