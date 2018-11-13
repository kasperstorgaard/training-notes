const lex = require('pug-lexer')
const parse = require('pug-parser')
const load = require('pug-load')
const generateCode = require('pug-code-gen');
const wrap = require('pug-runtime/wrap');
const path = require('path');
const link = require('pug-linker');
const fs = require('fs');
const mkdirp = require('mkdirp');
const hasha = require('hasha');
const {promisify} = require('util');

const mkdirpAsync = promisify(mkdirp);
const writeFileAsync = promisify(fs.writeFile);
const existsAsync = promisify(fs.exists);
const readFileAsync = promisify(fs.readFile);

const viewDir = path.join(__dirname, '../views');
const publicDir = path.join(__dirname, '../public');

const ensurePug = ensureSuffix('.pug');

function ensureSuffix(suffix) {
  const suffixLength = suffix.length;

  return (str) => {
    const index = str.indexOf(suffix);
    return index === -1 || index !== str.length - suffixLength ?
      str + suffix : str;
  }
}

function loadAst(view) {
  const filePath = path.join(viewDir, ensurePug(view));

  const ast = load.file(filePath, {
    lex,
    parse,
    resolve: function (filename, source, options) {
      return load.resolve(ensurePug(filename), ensurePug(source), options);
    }
  });

  return link(ast);
}

module.exports.getBlocks = async (view, locals = {}) => {
  const ast = loadAst(view);
  const blockKeys = Object.keys(ast.declaredBlocks);

  return await Promise.all(blockKeys.map(async blockKey => {
    const block = ast.declaredBlocks[blockKey];
    const name = `${view}/${blockKey}`;
    if (block.length && block[0].nodes) {
      block[0].nodes.unshift(...getMixinNodes(ast.nodes));
    }

    const content = await getContent(block, name, {});
    const hash = hasha(content, {algorithm: 'md5'});
    return {name, content, hash};
  }));
}

function getTemplateName (name) {
  return name
    .replace(/\/[\w\W]/g, m => m[1].toUpperCase());
}

async function getContent(block, name, locals) {
  const filePath = `/html/${name}.html`;
  const htmlPath = path.join(publicDir, filePath);

  if (await existsAsync(htmlPath)) {
    return await readFileAsync(htmlPath, 'utf8');
  }

  const templateName = getTemplateName(name);

  const content = block.map(inner =>
    wrap(generateCode(inner, {
      compileDebug: false,
      pretty: true,
      inlineRuntimeFunctions: false,
      templateName,
    }), templateName)(locals)
  ).join('\n');

  const dirPath = path.dirname(htmlPath);
  await mkdirpAsync(dirPath);
  await writeFileAsync(htmlPath, content, 'utf8');
  return content;
}

function getMixinNodes(nodes) {
  return nodes.filter(node => node.type === 'Block' && node.nodes[0].type === 'Mixin');
}