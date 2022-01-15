module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.js'],
  verbose: true,
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  moduleNameMapper: {
    'srt-validator(.*)$': '<rootDir>/src/$1',
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
};
