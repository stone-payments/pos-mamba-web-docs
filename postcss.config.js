module.exports = {
  plugins: [
    require('postcss-easy-import'),
    require('postcss-extend-rule'),
    require('postcss-advanced-variables'),
    require('postcss-preset-env')({
      stage: 0,
      features: {
        'nesting-rules': true,
      },
    }),
    require('postcss-atroot'),
    require('postcss-property-lookup'),
    require('postcss-nested'),
    require('postcss-reporter')({ clearReportedMessages: true }),
  ],
}
