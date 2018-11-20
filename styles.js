const uglifycss = require('uglifycss');
const glob = require('glob');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const {promisify} = require('util');
const {argv} = require('yargs')
const chokidar = require('chokidar');

const copyFileAsync = promisify(fs.copyFile);
const writeFileAsync = promisify(fs.writeFile);
const readFileAsync = promisify(fs.readFile);
const unlinkAsync = promisify(fs.unlink);
const existsAsync = promisify(fs.exists);
const globAsync = promisify(glob);
const mkdirpAsync = promisify(mkdirp)

const baseDir = path.join(__dirname, 'public/css');
const isWatch = argv.w || argv.watch;
const isProd = process.env.NODE_ENV === 'production';

const pattern = './app/**/*.css';

(async function run() {
  const filePaths = await globAsync(pattern);
  filePaths.forEach(filePath => isProd ? uglifyFile(filePath) : copyFile(filePath));

  if (isWatch) {
    const watcher = chokidar.watch(pattern, {ignoreInitial: true});

    watcher
      .on('add', filePath => {
        console.log(`file added: ${filePath}`);
        copyFile(filePath);
      })
      .on('change', filePath => {
        console.log(`file changed: ${filePath}`);
        copyFile(filePath);
      })
      .on('unlink', filePath => {
        console.log(`file deleted: ${filePath}`);
        unlinkAsync(getDest(filePath));
      });

    console.log([
      'watching for style changes:',
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

async function uglifyFile(src) {
  const dest = getDest(src);
  const content = await readFileAsync(src, 'utf8');
  const output = uglifycss.processString(content);
  if (!(await existsAsync(dest))) {
    await mkdirpAsync(path.dirname(dest));
  }
  return writeFileAsync(getDest(src), output, 'utf8');
}

function getDest(relativeSrc) {
  return path.join(baseDir, relativeSrc.replace(/\/app\//, '/'));
}