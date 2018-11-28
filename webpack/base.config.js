const webpack = require('webpack');
const path = require('path');
const loaders = require('./helpers/loaders');
const { fromWorkspace, fromProject } = require('./helpers/paths');
const pkg = require('../package.json');
const mode = process.env.NODE_ENV;

const {
  BUNDLE_NAME,
  IS_POS,
  DEBUG_LVL,
  IS_BROWSER,
  IS_DEV,
  IS_PROD,
  NODE_ENV,
  APP_ENV,
} = require('@mamba/webpack/helpers/consts.js');

module.exports = function createWebpackConfig(type) {
  return {

    // Sapper just ignore this property
    stats: "verbose",
    
    resolve: {
      symlinks: false,
      mainFields: ['svelte', 'browser', 'module', 'main', 'dist'],
      extensions: ['.js', '.json', '.css', '.pcss', '.html'],
      modules: [
        path.resolve(__dirname, '../packages'),
        path.resolve(__dirname, '../node_modules'),
        'node_modules',
      ],
      alias: {
        '@mamba/pos': path.resolve(__dirname, '../packages/pos/'),
        '@mamba/store': path.resolve(__dirname, '../packages/store/src/index.js'),
      },
    },
    node: {
      __dirname: false,
    },
    module: {
      rules: [
        {
          test: /NAV_COMPONENTS$/,
          loader: require.resolve('./navigation-loader'),
          options: {
            localPath: path.join(__dirname, '..', 'packages/components'),
          },
        },
        {
          test: /\.(html|svelte)$/,
          include: [
            /node_modules\/@mamba/,
            /packages\/.+\/src/,
            path.resolve(__dirname, '..'),
          ],
          use: loaders.svelte(type),
        },
        {
          test: /\.(css|pcss)$/,
          resolve: { mainFields: ['style', 'main'] },
          include: [
            path.resolve(__dirname, '../src'),
            path.resolve(__dirname, '../packages'),
            path.resolve(__dirname, '../node_modules/@mamba'),
          ],
          use: [loaders.styleLoader, loaders.css, loaders.postcss],
        },
        { 
          test: /\.(eot|woff2?|otf|ttf)$/, 
          use: loaders.fonts,
        },
        { 
          test: /\.(gif|jpe?g|png|ico)$/,
          exclude: [
            /\static\/icons/,
            /\/Icon\/assets\/icons/,
          ],
          use: loaders.images,
        },
        { 
          test: /\.svg$/,
          include: [
            /node_modules\/@mamba\/icon\/assets\/icons/,
            /\/Icon\/assets\/icons/,
          ],
          use: loaders.icons,
        },
        {
          test: /\.md$/,
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]',
            emitFile: false,
            context: ''
          }
        }
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
        __DEBUG_LVL__: DEBUG_LVL,
      }),
    ],
    mode,
  }
}
