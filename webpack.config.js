const path = require('path');

module.exports = {
    entry: './src/ts/main.js',
    output: {
      path: path.resolve(__dirname, 'test'),
      filename: 'script.js'
    }
  };