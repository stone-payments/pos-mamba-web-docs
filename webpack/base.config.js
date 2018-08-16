const loaders = require('./helpers/loaders');
const { fromWorkspace, fromProject } = require('./helpers/paths');
const pkg = require('../package.json');

const mode = process.env.NODE_ENV;

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
      symlinks: true,
      mainFields: ['svelte', 'browser', 'module', 'main'],
      extensions: ['.js', '.json', '.css', '.html'],
      modules: [
        fromWorkspace('./'),
        fromWorkspace('node_modules'),
        fromProject('node_modules'),
      ],
    },
    externals: new RegExp(`^${Object.keys(pkg.dependencies).filter(d => d.startsWith('@mambasdk')).join('|')}`),
    module: {
      rules: [
        {
          test: /NAV_COMPONENTS$/,
          loader: require.resolve('./navigation-loader'),
          options: {
            path: 'packages/components',
          },
        },
        {
          test: /\.js?$/,
          exclude: [/assets/],
          include: [],
          use: [loaders.babel, loaders.eslint],
        },
        {
          test: /\.html$/,
          exclude: [/node_modules/],
          use: [loaders.svelte(type)],
        },
        {
          test: /\.css$/,
          /** When importing from a style file, let's use package.json's 'style' field before the actual 'main' one */
          resolve: { mainFields: ['style', 'main'] },
          use: [loaders.styleLoader, loaders.css, loaders.postcss],
        },
        /** Handle font imports */
        { test: /\.(eot|woff2?|otf|ttf)$/, exclude: [/assets/], use: [loaders.fonts] },
        /** Handle image imports */
        { test: /\.(gif|jpe?g|png|ico|svg)$/, exclude: [/assets/],  use: [loaders.images] },
      ],
    },
    mode,
  }
}
