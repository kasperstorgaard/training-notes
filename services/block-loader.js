const lex = require('pug-lexer')
const parse = require('pug-parser')
const load = require('pug-load')
const generateCode = require('pug-code-gen');
const wrap = require('pug-runtime/wrap');
const path = require('path');
const link = require('pug-linker');

const viewDir = path.join(__dirname, '../views');

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

  return link(load.file(filePath, {
    lex,
    parse,
    resolve: function (filename, source, options) {
      return load.resolve(ensurePug(filename), ensurePug(source), options);
    }
  }));
}

module.exports.getBlocks = (view, locals = {}) => {
  const ast = loadAst(view);

  const blockKeys = Object.keys(ast.declaredBlocks);

  return blockKeys.map(blockKey => {
    const block = ast.declaredBlocks[blockKey];
    const name = `${view}/${blockKey}`;
    const templateName = getTemplateName(name);

    const content = block.map(inner =>
      wrap(generateCode(inner, {
        compileDebug: false,
        pretty: true,
        inlineRuntimeFunctions: false,
        templateName,
      }), templateName)(locals)
    ).join('\n');

    return {name, content};
  });
}

function getTemplateName (name) {
  return name
    .replace(/\/[\w\W]/g, m => m[1].toUpperCase());
}