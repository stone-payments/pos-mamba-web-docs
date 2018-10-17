const fs = require('fs');
const path = require('path');
const degit = require('degit');
const rimraf =  require('rimraf');
const globby = require('globby');

const packageRoot = path.join(process.cwd(), 'packages');
const componentsPath = path.join(packageRoot, 'components');

// degit to temp folder

function moveDir(path, destination, callback) {
  fs.rename(path, destination, (error) => {
    if(error) {
      console.log("ERROR \n" + error.message);
    }
    else {
      if (typeof callback === 'function') {
        callback();
      }
    }
  });
}

// clone repo using degit

function cloneRepo(callback) {
  const emmiter = degit('stone-payments/pos-mamba-sdk#develop', {
    force: true,
    verbose: true,
  });
  return emmiter.clone('.temp/');
}

// check if dir exists and create if it doesnt
function createDir(dirName) {
  if (!fs.existsSync(dirName)) {
    fs.mkdirSync(dirName, (error) => {
      if(error) {
        console.log('ERROR \n'+error.message);
      }
    });
  }
}

function removePath(path) {
  console.log(`➖ Removing path: ${path}`);
  rimraf.sync(path);
}

function removePaths(paths) {
  paths.forEach((file, idx) => removePath(path.join(componentsPath, file)));
}

async function clearTemp() {
  await rimraf('.temp/', () => {
    console.log('Temporary Files Removed !');
  });

  const paths = globby.sync(['*/*.*', '*/.*', '*/*', '!*/example', '!*/README.md', '!*/package.json'], {
    cwd: componentsPath,
    onlyFiles: false,
    expandDirectories: {
      files: ['*/assets'],
      extensions: ['svg', 'png', 'jpg', 'jpeg'],
    },
  });
  
  // Remove undesired components
  // paths.push('App');
  
  removePaths(paths)
}

// clears packages
rimraf('./packages', () =>{
  console.log('Cleaning Packages.');

  // create dirs
  createDir('packages/');
  createDir('packages/pos');
  createDir('packages/components');

  // clone repo
  cloneRepo().then(() => {

    // move to directory and clear temp files
    moveDir('./.temp/packages/components', './packages/components',
      moveDir('./.temp/packages/pos', './packages/pos',
        moveDir('./.temp/packages/store','./packages/store',
          clearTemp())));
  });
})
