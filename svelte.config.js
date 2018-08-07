const postcss = require('postcss');
const { IS_DEV } = require('quickenv');

module.exports = {
  dev: IS_DEV(),
  legacy: true,
  preprocess: { style: ({ content, attributes, filename }) => {
    return postcss([...require('./postcss.config.js').plugins])
      .process(content, { from: filename })
      .then(result => {
        return { code: result.css, map: null }
      })
      .catch(err => {
        console.log('failed to preprocess style', err)
      })
  },
  },
}
