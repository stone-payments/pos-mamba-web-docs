module.exports = {
  apps: [
    {
      name: 'mambadocs',
      script: './__sapper__/build/index.js',
      watch: 'true',
      env: {
        PORT: 443,
      },
    },
  ],
};
