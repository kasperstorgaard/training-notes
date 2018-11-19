const glob = require('glob');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const {promisify} = require('util');
const {argv} = require('yargs')
const chokidar = require('chokidar');

const copyFileAsync = promisify(fs.copyFile);
const unlinkAsync = promisify(fs.unlink);
const existsAsync = promisify(fs.exists);
const globAsync = promisify(glob);
const mkdirpAsync = promisify(mkdirp)

const baseDir = path.join(__dirname, 'public');
const isWatch = argv.w || argv.watch;

const pattern = './views/**/*.@(woff|woff2|png|jpg|jpeg)';

(async function run() {
  const filePaths = await globAsync(pattern);
  filePaths.forEach(filePath => copyFile(filePath));

  if (isWatch) {
    const watcher = chokidar.watch(pattern, {ignoreInitial: true});

    watcher
      .on('add', filePath => {
        console.log(`resource added: ${filePath}`);
        copyFile(filePath);
      })
      .on('change', filePath => {
        console.log(`resource changed: ${filePath}`);
        copyFile(filePath);
      })
      .on('unlink', filePath => {
        console.log(`resource deleted: ${filePath}`);
        unlinkAsync(getDest(filePath));
      });

    console.log([
      'watching for resource changes:',
      `pattern: ${pattern}`
    ].join('\n'));
  }
}());

async function copyFile(src) {
  const dest = getDest(src);
  if (!(await existsAsync(dest))) {
    await mkdirpAsync(path.dirname(dest));
  }
  return copyFileAsync(src, getDest(src));
}

function getDest(relativeSrc) {
  const type = relativeSrc.match(/\.([^\.]+)$/)[1];
  const basePath = path.join(baseDir, relativeSrc);
  return basePath.replace(/\/views\//, () => {
    switch (type) {
      case 'woff':
      case 'woff2':
        return '/fonts/';
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'svg':
        return '/images/';
      default:
        return '/resources/';
    }
  })
}