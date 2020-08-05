const path = require('path');

module.exports = {
  entry: './src/srtValidator.js',
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'srtValidator.js',
    library: 'srtValidator',
    libraryTarget: 'umd',
    globalObject: 'this'
  },
  resolve: {
    alias: {
      'srt-validator': path.resolve(__dirname, 'src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
};
