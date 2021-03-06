const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// eslint-disable-next-line no-unused-vars
const warfarin = {
  entry: './chrome_extension/warfarin/popup-react/index.js',
  output: {
    path: path.resolve(
      __dirname,
      'chrome_extension',
      'warfarin',
      'popup-build'
    ),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      { test: /\.(js)$/, use: 'babel-loader' },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      { test: /\.(png|svg|jpg|gif)$/, use: ['file-loader'] },
    ],
  },
  mode: 'development',
  plugins: [
    new HtmlWebpackPlugin({
      template: './chrome_extension/warfarin/popup-react/index.html',
    }),
  ],
  devtool: 'cheap-module-source-map',
  devServer: {
    contentBase: path.resolve(
      __dirname,
      'chrome_extension',
      'warfarin',
      'popup-build'
    ),
  },
};

const closure = {
  entry: './views/index.tsx',
  output: {
    path: path.resolve(__dirname, 'views', 'dist'),
    filename: 'bundle.js',
    publicPath: 'static/',
  },
  mode: 'production',
  module: {
    rules: [
      // { test: /\.(js)$/, use: 'babel-loader' },
      { test: /\.tsx?$/, use: 'ts-loader', exclude: /node_modules/ },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      { test: /\.(png|svg|jpg|gif)$/, use: ['file-loader'] },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  optimization: {
    minimize: true,
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 100000,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            const packageName = module.context.match(
              /[\\/]node_modules[\\/](.*?)([\\/]|$)/
            )[1];
            return `npm.${packageName.replace('@', '')}`;
          },
          // name: 'vendor',
          // chunks: 'initial',
        },
      },
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './views/index.html',
    }),
  ],
  // devtool: 'cheap-module-source-map',
  devServer: {
    contentBase: path.resolve(__dirname, 'views', 'dist'),
  },
};

module.exports = closure;
