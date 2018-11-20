const glob = require('glob');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const {promisify} = require('util');
const {argv} = require('yargs')
const chokidar = require('chokidar');
const uglifycss = require('uglifycss');

const copyFileAsync = promisify(fs.copyFile);
const unlinkAsync = promisify(fs.unlink);
const existsAsync = promisify(fs.exists);
const globAsync = promisify(glob);
const mkdirpAsync = promisify(mkdirp)

const baseDir = path.join(__dirname, 'public');
const isWatch = argv.w || argv.watch;
const isProd = process.env.NODE_ENV === 'production';

const pattern = './app/**/*.@(woff|woff2|png|jpg|jpeg|css)';

(async function run() {
  const filePaths = await globAsync(pattern);
  filePaths.forEach(filePath => processFile(filePath));

  if (isWatch) {
    const watcher = chokidar.watch(pattern, {ignoreInitial: true});

    watcher
      .on('add', filePath => {
        console.log(`resource added: ${filePath}`);
        processFile(filePath);
      })
      .on('change', filePath => {
        console.log(`resource changed: ${filePath}`);
        processFile(filePath);
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

function processFile(src) {
  const type = getType(src);
  switch (type) {
    case 'woff':
    case 'woff2':
      return copyFile(src);
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'svg':
      return copyFile(src);
    case 'css':
      return isProd ? uglifyStyles(src) : copyFile(src);
    default:
      return copyFile(src);
  }
}

function getDest(src) {
  const type = getType(src);
  const basePath = path.join(baseDir, src);
  return basePath.replace(/\/app\//, () => {
    switch (type) {
      case 'woff':
      case 'woff2':
        return '/fonts/';
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'svg':
        return '/images/';
      case 'css':
        return '/css/'
      default:
        return '/resources/';
    }
  })
}

function getType(src) {
  return src.match(/\.([^\.]+)$/)[1];
}

async function copyFile(src) {
  const dest = getDest(src);
  if (!(await existsAsync(dest))) {
    await mkdirpAsync(path.dirname(dest));
  }
  return copyFileAsync(src, getDest(src));
}

async function uglifyStyles(src) {
  const dest = getDest(src);
  const content = await readFileAsync(src, 'utf8');
  const output = uglifycss.processString(content);
  if (!(await existsAsync(dest))) {
    await mkdirpAsync(path.dirname(dest));
  }
  return writeFileAsync(getDest(src), output, 'utf8');
}
