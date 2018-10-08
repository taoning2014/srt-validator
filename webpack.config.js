const path = require('path');

module.exports = {
  entry: './src/srtValidator.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'srtValidator.js',
    library: 'srtValidator',
    libraryTarget: 'amd',
  },
  resolve: {
    alias: {
      'srt-validator': path.resolve(__dirname, 'src'),
    },
  },
};
