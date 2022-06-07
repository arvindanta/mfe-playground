const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.esm.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
