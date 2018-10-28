const path = require('path');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');

module.exports = function (env) {
  return {
    mode: 'production',
    entry: './src/api.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'api.js'
    },
    module: {
      rules: [
        {
          test: /\.js/, exclude: /node_modules/, use: {
            loader: 'babel-loader',
            options: {
              presets: ["@babel/preset-env"]
            }
          }
        }
      ]
    },
    plugins: [
      new Dotenv({
        path: '.env.' + env,
        systemvars: true
      })
    ]
  }
}
