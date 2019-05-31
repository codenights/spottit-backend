module.exports = {
  extends: ['algolia', 'algolia/jest', 'algolia/typescript'],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.ts'],
      },
    },
  },
  rules: {
    '@typescript-eslint/camelcase': 'off',
    'no-warning-comments': 'off',
    'new-cap': 'off',
    'import/no-unresolved': 'off', // False negatives
    'import/named': 'off', // False negatives
  },
}
