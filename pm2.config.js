module.exports = {
  apps: [
    {
      name: "mambadocs",
      script: "./build/index.js",
      watch: "true",
      env: {
        PORT: 8080,
      },
    },
  ],
};
