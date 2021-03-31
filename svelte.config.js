const postcss = require('postcss');
const { IS_DEV } = require('quickenv');
const getPreprocessor = require('svelte-preprocess');

module.exports = {
  dev: IS_DEV(),
  legacy: true,
  preprocess: getPreprocessor({
    transformers: {
      postcss: true,
    },
  }),
}
