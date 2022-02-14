module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/dist/**/*.js'],
  coveragePathIgnorePatterns: [
    '<rootDir>/dist/srtValidator.js.js',
    '<rootDir>/dist/utils/types.js',
    '<rootDir>/dist/utils/validation-error.js',
  ],
  verbose: true,
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  moduleNameMapper: {
    'srt-validator(.*)$': '<rootDir>/src/$1',
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
};
