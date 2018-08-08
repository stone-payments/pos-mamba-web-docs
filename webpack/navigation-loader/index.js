const fetch = require('node-fetch');
const path = require('path');
const loaderUtils = require('loader-utils');
module.exports = async function githubNavLoader(source) {
  const opts = Object.assign(
    { path: '' },
    loaderUtils.getOptions(this) || {},
  );
  let packages = [];
  await fetch(`https://api.github.com/repos/stone-payments/pos-mamba-sdk/contents/${opts.path}`)
    .then(res => res.json())
    .then(body => (packages = body));
  packages = packages.reduce((
    root, 
    current
  ) => {
    root.push({ title: current.name, to: `/${current.name.toLowerCase()}` });
    return root
  }, []);
  return `module.exports = ${JSON.stringify(packages)};`;
};
