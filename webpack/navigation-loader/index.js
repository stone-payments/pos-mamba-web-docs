const path = require('path');
const fs = require('fs');
const fetch = require('node-fetch');
const loaderUtils = require('loader-utils');

// The motivation of this loader is to keep components navigations up to date.
// We call our repository to read folders which are our packages
// For development we use the FIXTURE to avoid calls to github API.
async function loader (source) {
  this.cacheable && this.cacheable();
  this.value = source;

  const opts = Object.assign(
    { path: '' },
    loaderUtils.getOptions(this) || {},
  );

  if(process.env.NODE_ENV === 'development') {
    console.warn(`⚠️  NO NAVIGATION COMPONENTS GENERATED! USING FIXTURE.\nNODE_ENV: ${process.env.NODE_ENV}`);
    return `module.exports = ${JSON.stringify(require('./NAV_FIXTURE'))};`;
  }
  
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

module.exports = loader