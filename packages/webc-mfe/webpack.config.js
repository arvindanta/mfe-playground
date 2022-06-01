const path = require('path');

module.exports = {
  entry: './src/root.js',
  output: {
    filename: 'main.esm.js',
    path: path.resolve(__dirname, 'dist'),
    library: {
      type: 'system',
    },
  },
};
