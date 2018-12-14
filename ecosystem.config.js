module.exports = {
  apps: [
    {
      name: 'mambadocs',
      script: './__sapper__/build/index.js',
      watch: 'true',
      env: {
        NODE_ENV: 'production',
        PORT: 443,
      },
    },
  ],
  deploy: {
    // "production" is the environment name
    production: {
      // SSH key path, default to $HOME/.ssh
      key: "$HOME/.ssh",
      // SSH user
      user: "deployusr",
      // SSH host
      host: ["191.239.252.1"],
      // SSH options with no command-line flag, see 'man ssh'
      // can be either a single string or an array of strings
      ssh_options: "StrictHostKeyChecking=no",
      // GIT remote/branch
      ref: "origin/master",
      // GIT remote
      repo: "git@github.com:stone-payments/pos-mamba-sdk-docs.git",
      // path in the server
      path: "/home/deployusr/site/pos-mamba-sdk-docs",
      // Pre-setup command or path to a script on your local machine
      pre-setup: "sudo sh /home/deployusr/site/pos-mamba-sdk-docs/deploy/work.sh",
      // Post-setup commands or path to a script on the host machine
      // eg: placing configurations in the shared dir etc
      post-setup: "ls -la"
    },
  }
};
