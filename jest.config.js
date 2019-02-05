module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.js'],
  verbose: true,
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  moduleNameMapper: {
    'srt-validator(.*)$': '<rootDir>/src/$1',
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
};
