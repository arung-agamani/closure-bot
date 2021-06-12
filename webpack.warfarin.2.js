/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// eslint-disable-next-line no-unused-vars
const popup = {
  entry: './crx/src/popup/index.tsx',
  output: {
    path: path.resolve(__dirname, 'crx', 'dist', 'popup'),
    filename: '[name].bundle.js',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      { test: /\.tsx?$/, use: 'ts-loader', exclude: /node_modules/ },
      { test: /\.css$/, use: ['style-loader', 'css-loader', 'postcss-loader'] },
      { test: /\.(png|svg|jpg|gif)$/, use: ['file-loader'] },
    ],
  },
  mode: 'development',
  plugins: [
    new HtmlWebpackPlugin({
      template: './crx/src/popup/index.html',
    }),
  ],
  devtool: 'cheap-module-source-map',
  devServer: {
    contentBase: path.resolve(__dirname, 'crx', 'dist', 'popup'),
  },
};

const manifest = {
  entry: './crx/src/background.ts',
  output: {
    path: path.resolve(__dirname, 'crx', 'dist'),
    filename: 'background.js',
  },
  module: {
    rules: [
      { test: /\.tsx?$/, use: 'ts-loader', exclude: /node_modules/ },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      { test: /\.(png|svg|jpg|gif|json)$/, use: ['file-loader'] },
    ],
  },
  mode: 'development',
};

module.exports = (env) => {
  if (env === 'popup') {
    return popup;
    // eslint-disable-next-line no-else-return
  } else {
    return manifest;
  }
};
