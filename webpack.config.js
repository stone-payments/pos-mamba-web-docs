const webpack = require('webpack');
const merge = require('webpack-merge');
const webpackConfig = require('sapper/config/webpack.js');
const clientConfig = require('./webpack/base.config.js')('client');
const serverConfig = require('./webpack/base.config.js')('server');
const pkg = require('./package.json');
const { IS_DEV } = require('quickenv');


const client = merge([clientConfig, {
  stats: "verbose",
  entry: webpackConfig.client.entry(),
  output: Object.assign(webpackConfig.client.output(), {
    globalObject: 'this',
  }),
  target: 'web',
  plugins: [
    IS_DEV && new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.browser': true,
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
  ].filter(Boolean),
  devtool: IS_DEV && 'inline-source-map',
}]);

const server = merge([serverConfig, {
  entry: webpackConfig.server.entry(),
  output: webpackConfig.server.output(),
  target: 'node',
  externals: new RegExp(`^${Object.keys(pkg.dependencies).filter(d => d !== 'svelte').join('|')}`),
  performance: {
    hints: false, // it doesn't matter if server.js is large
  },
}]);

const serviceworker = {
  entry: webpackConfig.serviceworker.entry(),
  output: webpackConfig.serviceworker.output(),
  mode: process.env.NODE_ENV,
};

module.exports = { client, server, serviceworker }