module.exports = {
  apps: [
    {
      name: 'mambadocs',
      script: './__sapper__/build/index.js',
      watch: 'true',
      env: {
        NODE_ENV: 'production',
        PORT: 8080,
      },
    },
  ],
};
