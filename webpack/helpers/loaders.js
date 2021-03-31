const { fromProject } = require('./paths');
const path = require('path');
const IS_DEV = process.env.NODE_ENV === 'development';

/** Read the project's .babelrc.js to enforce it in 'babel-loader' */
const babelrc = require(fromProject('.babelrc.js'));
/** 'babel-loader' already appends 'sourceMap: true'. Cannot have both. */
delete babelrc.sourceMaps;

module.exports = {
  babel: {
    loader: 'babel-loader',
    options: {
      sourceMaps: IS_DEV,
      compact: false,
      cacheDirectory: IS_DEV,
      babelrc: false,
      ...babelrc,
    },
  },
  eslint: {
    loader: 'eslint-loader',
    options: { emitWarning: IS_DEV },
  },
  /**
   * MiniCssExtractPlugin doesn't support HMR.
   * For developing, use 'style-loader' instead.
   * */
  styleLoader: 'style-loader',
  css: {
    loader: 'css-loader',
    options: {
      sourceMap: IS_DEV,
      minimize: !IS_DEV,
      /** Apply the two last loaders */
      importLoaders: 2,
    },
  },
  postcss: {
    loader: 'postcss-loader',
    options: {
      // ident: 'postcss',
      // plugins: [...require('../../postcss.config.js').plugins],
      sourceMap: true,
    },
  },
  fonts: {
    loader: 'url-loader',
    options: {
      // TODO: Test if an inline font works on the POS
      limit: 1, // Copy font files instead of inserting them on the css
      outputPath: 'assets/',
      name: './fonts/[name].[ext]',
    },
  },
  images: {
    loader: 'url-loader',
    options: {
      fallback: 'file-loader',
      limit: 1,
      outputPath: 'assets/',
      name: './images/[name].[ext]',
    },
  },
  icons: {
    loader: 'file-loader',
    options: {
      context: path.resolve(__dirname, '../..'),
      publicPath: '../assets/',
      outputPath: '../',
      name: '[name].[ext]',
      useRelativePath: true,
    },
  },
  svg: {
    loader: 'svg-url-loader',
    options: {
      limit: 2048,
    },
  },
  resolveUrl: {
    loader: 'resolve-url-loader',
    options: {
      sourceMap: IS_DEV,
      keepQuery: true,
      debug: false, // IS_DEV,
    },
  },
  html: {
    loader: 'html-loader',
  },
  svelte: type => {
    const [server, client] = ['server', 'client'];

    if (type !== client && type !== server) {
      throw new Error(`Unknown svelte type: ${type}`);
    }

    let loader = { loader: 'svelte-loader' };

    switch (type) {
      case 'server':
        loader.options = {
          css: false,
          generate: 'ssr',
          ...require(fromProject('svelte.config.js')),
        };
        break;
      default:
        loader.options = {
          emitCss: true,
          hydratable: true,
          hotReload: IS_DEV,
          css: false,
          ...require(fromProject('svelte.config.js')),
        };
    }

    return loader;
  },
};
