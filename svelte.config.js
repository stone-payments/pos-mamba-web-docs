const preprocess = require('svelte-preprocess');
const { IS_DEV } = require('quickenv');

module.exports = {
  dev: IS_DEV(),
  legacy: true,
  preprocess: preprocess({
    transformers: {
      postcss: true,
    },
  }),
}
