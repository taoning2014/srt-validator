const webpackConfig = require('./webpack.config.js');

module.exports = function(config) {
  config.set({
    frameworks: ['qunit'],
    plugins: ['karma-qunit', 'karma-chrome-launcher', 'karma-webpack'],
    browsers: ['Chrome'],
    files: [
      // Test context
      'tests/tests.webpack.js',

      // Watch all JS files, but don't include them in the build
      // (they're already required through tests.webpack.js)
      {
        pattern: '{tests,src}/**/*.spec.js',
        included: false,
        served: false,
        watched: true,
      },
    ],

    preprocessors: {
      'tests/tests.webpack.js': ['webpack'],
    },
    webpack: Object.assign(webpackConfig, {
      entry: undefined,
      output: undefined,
    }),
    singleRun: true,
  });
};
