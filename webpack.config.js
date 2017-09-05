const path = require('path');

module.exports = {
  entry: './index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
      extensions: ['.js', '.jsx']
  },
  module: {
      rules: [
          {
              test: /\.jsx$/,
              include: [
                path.resolve(__dirname, "unserteam")
              ],
              exclude: [
                path.resolve(__dirname, "./node_modules")
              ]
          }
      ]
  }
};
