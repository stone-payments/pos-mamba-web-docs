const fs = require('fs')
const fspath = require('path')
const degit = require('degit')
const rimraf = require('rimraf')
const globby = require('globby')

const packageRoot = fspath.join(__dirname, '../packages')
const componentsPath = fspath.join(packageRoot, 'components')
const tempFolder = fspath.join(__dirname, '../.temp')

console.log(`Package root folder is: ${packageRoot}`)
console.log(`Components folder is: ${componentsPath}`)
console.log(`Temp folder is: ${tempFolder}`)

function moveDir(path, destination, callback) {
  fs.rename(path, destination, error => {
    if (error) {
      console.log(`ERROR \n${error.message}`)
    } else if (typeof callback === 'function') {
      callback()
    }
  })
}

// clone repo using degit

function cloneRepo() {
  const emmiter = degit('stone-payments/pos-mamba-sdk#update-brands', {
    force: true,
    verbose: true,
  })
  return emmiter.clone(tempFolder)
}

// check if dir exists and create if it doesnt
function createDir(dirName) {
  if (!fs.existsSync(dirName)) {
    fs.mkdirSync(dirName, error => {
      if (error) {
        console.log(`ERROR \n${error.message}`)
      }
    })
  }
}

function removePath(path) {
  console.log(`➖ Removing path: ${path}`)
  rimraf.sync(path)
}

function removePaths(paths) {
  paths.forEach(file => removePath(fspath.join(componentsPath, file)))
}

async function clearTemp() {
  await rimraf(tempFolder, () => {
    console.log('Temporary Files Removed !')
  })

  const paths = globby.sync(
    [
      '*/*.*',
      '*/.*',
      '*/*',
      '!*/libs',
      '!*/includes',
      '!*/**.html',
      '!*/**.js',
      '*/*.test.js',
      '!*/assets',
      '!*/example',
      '!*/README.md',
      '!*/package.json',
    ],
    {
      cwd: componentsPath,
      onlyFiles: false,
      expandDirectories: {
        files: ['*/static'],
        extensions: ['svg', 'png', 'jpg', 'jpeg'],
      },
    },
  )

  // Remove undesired components
  // paths.push('App');

  console.log('paths: ', paths)

  removePaths(paths)
}

// if(process.env.NODE_ENV !== 'production') {
// clears packages
rimraf(packageRoot, () => {
  console.log('Cleaning Packages.')

  // create dirs
  createDir('../packages/')
  createDir('../packages/pos')
  createDir('../packages/components')

  // clone repo
  cloneRepo().then(() => {
    // move to directory and clear temp files
    moveDir(
      `${tempFolder}/packages/components`,
      `${packageRoot}/components`,
      moveDir(`${tempFolder}/packages/pos`, `${packageRoot}/pos`, clearTemp()),
    )
  })
})
// }
