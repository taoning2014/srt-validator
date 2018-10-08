const path = require('path');

module.exports = {
  entry: './src/srtValidator.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'srtValidator.js',
    library: 'srtValidator',
    libraryTarget: 'amd',
  },
  optimization: {
    mangleWasmImports: false,
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