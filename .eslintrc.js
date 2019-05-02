module.exports = {
  extends: ['algolia', 'algolia/jest', 'algolia/typescript'],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.ts'],
      },
    },
  },
}
