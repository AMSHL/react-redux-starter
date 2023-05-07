const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconWebpackPlugin = require('favicons-webpack-plugin');
const { pathOr } = require('ramda');

const dateFnsSupportedLang = require('../config/date-fns.config');
const packageJSON = require('../../package.json');
const getConfig = require('../config');
const commomConfig = require('../common');

const getPackageConfig = (path, defaultValue = '') =>
  pathOr(defaultValue, path, packageJSON);

module.exports = merge(commomConfig, {
  entry: [getConfig('appIndex')],
  mode: 'production',
  output: {
    path: getConfig('appDist'),
    filename: '[name]-[fullhash].js',
    publicPath: '/',
  },
  optimization: {
    runtimeChunk: true,
    minimize: true,
    splitChunks: {
      chunks: 'async',
      minSize: 20000,
      minRemainingSize: 0,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
  plugins: [
    new webpack.ContextReplacementPlugin(
      /date\-fns[\/\\]/,
      new RegExp(
        `[/\\\\\](${dateFnsSupportedLang.join('|')})[/\\\\\]index\.js$`,
      ),
    ),
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 5,
    }),
    new webpack.optimize.MinChunkSizePlugin({
      minChunkSize: 1000,
    }),
    new HtmlWebpackPlugin({
      template: getConfig('appHTMLTemplate'),
      title: getConfig('appName'),
      inject: true,
    }),
    new FaviconWebpackPlugin({
      logo: getConfig('appFavicon'),
      mode: 'webapp',
      favicons: {
        appName: getPackageConfig(['name']),
        appDescription: getPackageConfig(['description']),
        developerName: getPackageConfig(['author']),
        developerURL: getPackageConfig(['repository'], ['url']),
        background: '#ddd',
        theme_color: '#333',
        icons: {
          coast: false,
          yandex: false,
        },
      },
    }),
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
    }),
  ],
});
