const postcssUniqueImports = require('@mamba/configs/postcss/includes/uniqueImports.js');
const colorsMamba = require('@mamba/configs/postcss/includes/colors.js');

module.exports = {
  plugins: [
    /** Custom plugin to prepend imports */
    postcssUniqueImports.plugin(['@mamba/styles/theme.pcss']),
    require('postcss-easy-import')({
      extensions: ['.css', '.pcss'],
    }),
    require('postcss-extend-rule'),
    require('postcss-advanced-variables')({
      variables: colorsMamba,
    }),
    require('postcss-preset-env')({
      stage: 0,
      features: {
        'nesting-rules': true,
      },
    }),
    require('postcss-color-mod-function')(),
    require('postcss-atroot'),
    require('postcss-property-lookup'),
    require('postcss-nested'),
    require('postcss-reporter')({ clearReportedMessages: true }),
  ],
};
