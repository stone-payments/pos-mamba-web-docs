const NodeGit = require("nodegit");
const path = require("path");

// Using the `clone` method from the `Git.Clone` module, bring down the NodeGit
// test repository from GitHub.
var cloneURL = "https://github.com/stone-payments/pos-mamba-sdk";
var localPath = path.join(__dirname, "tmp");

// Simple object to store clone options.
var cloneOptions = {};

// This is a required callback for OS X machines.  There is a known issue
// with libgit2 being able to verify certificates from GitHub.
cloneOptions.fetchOpts = {
  callbacks: {
    certificateCheck: function() { return 1; }
  }
};

// Invoke the clone operation and store the returned Promise.
var cloneRepository = NodeGit.Clone(cloneURL, localPath, cloneOptions);

// If the repository already exists, the clone above will fail.  You can simply
// open the repository in this case to continue execution.
var errorAndAttemptOpen = function() {
  return NodeGit.Repository.open(localPath);
};

// Once the repository has been cloned or opened, you can work with a returned
// `Git.Repository` instance.
cloneRepository.catch(errorAndAttemptOpen)
  .then(function(repository) {
    // Access any repository methods here.
    console.log("Is the repository bare? %s", Boolean(repository.isBare()));
  });