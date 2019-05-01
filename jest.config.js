/* eslint-disable import/no-commonjs */

module.exports = {
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
}
