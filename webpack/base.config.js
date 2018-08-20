const webpack = require('webpack');
const path = require('path');
const loaders = require('./helpers/loaders');
const { fromWorkspace, fromProject } = require('./helpers/paths');
const pkg = require('../package.json');
const mode = process.env.NODE_ENV;

const {
  BUNDLE_NAME,
  IS_POS,
  IS_BROWSER,
  IS_DEV,
  IS_PROD,
  NODE_ENV,
  APP_ENV,
} = require('@mamba/webpack/helpers/consts.js');

module.exports = function createWebpackConfig(type) {
  return {
    /** Minimal useful output log */
    stats: {
      modules: false,
      chunks: false,
      colors: true,
      children: false,
    },
    resolve: {
      symlinks: false,
      mainFields: ['svelte', 'browser', 'module', 'main', 'dist'],
      extensions: ['.js', '.json', '.css', '.pcss', '.html'],
      modules: [
       path.resolve(__dirname, '../packages'),
       path.resolve(__dirname, '../node_modules'),
      ],
      alias: {
        '@mamba/pos': path.resolve(__dirname, '../packages/pos/'),
        '@mamba/store': path.resolve(__dirname, '../packages/store/src/index.js'),
      }
    },
    module: {
      rules: [
        {
          test: /NAV_COMPONENTS$/,
          loader: require.resolve('./navigation-loader'),
          options: {
            githubPath: 'packages/components',
            localPath: path.join(__dirname, '..', 'packages'),
            mode: 'local'
          },
        },
        // {
        //   test: /\.js?$/,
        //   exclude: [/assets/],
        //   include: [],
        //   use: [loaders.babel, loaders.eslint],
        // },
        {
          test: /\.(html|svelte)$/,
          
          include: [
            /node_modules\/@mamba/,
            /packages\/.+\/src/,
            path.resolve(__dirname, '..')
          ],
          use: [loaders.svelte(type)],
        },
        {
          test: /\.(css|pcss)$/,
          resolve: { mainFields: ['style', 'main'] },
          include: [
            path.resolve(__dirname, '..'),
          ],
          use: [loaders.styleLoader, loaders.css, loaders.postcss],
        },
        /** Handle font imports */
        { test: /\.(eot|woff2?|otf|ttf)$/, use: [loaders.fonts] },
        /** Handle image imports */
        { test: /\.(gif|jpe?g|png|ico|svg)$/, use: [loaders.images] },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        __NODE_ENV__: JSON.stringify(NODE_ENV),
        __APP_ENV__: JSON.stringify(APP_ENV),
        __PROD__: IS_PROD,
        __TEST__: NODE_ENV === 'test',
        __DEV__: IS_DEV,
        __POS__: IS_POS,
        __BROWSER__: IS_BROWSER,
      }),
    ],
    mode,
  }
}
