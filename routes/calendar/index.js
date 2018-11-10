const express = require('express');
const url = require('url');
const lex = require('pug-lexer')
const parse = require('pug-parser')
const load = require('pug-load')
const generateCode = require('pug-code-gen');
const wrap = require('pug-runtime/wrap');
const fs = require('fs');
const path = require('path');
const util = require('util');
const link = require('pug-linker');

const router = express.Router();
const viewDir = path.join(__dirname, '../../views');

const ensurePug = ensureSuffix('.pug');

router.get('/calendar', async (req, res, _next) => {
  const referrerUrl = req.header('Referrer');
  const referrer = referrerUrl ? url.parse(referrerUrl) : null;

  if (!referrer || referrer.hostname !== req.hostname) {
    res.render('calendar/calendar', {
      page: 'Calendar',
      menuId: 'calendar'
    });
  } else {
    const html = getBlocks('../../views/calendar/calendar.pug')
    res.json({ html });
  }
});

function ensureSuffix(suffix) {
  const suffixLength = suffix.length;

  return (str) => {
    const index = str.indexOf(suffix);
    return index === -1 || index !== str.length - suffixLength ?
      str + suffix : str;
  }
}

function loadAst(view) {
  const filePath = path.join(__dirname, view);
  return link(load.file(filePath, {
    lex,
    parse,
    resolve: function (filename, source, options) {
      return load.resolve(ensurePug(filename), ensurePug(source), options);
    }
  }));
}

function getBlocks(view) {
  try {
    const ast = loadAst(view);

    // console.log(JSON.stringify(content));
    const fn = wrap(generateCode(ast, {
      compileDebug: false,
      pretty: true,
      inlineRuntimeFunctions: false,
      templateName: 'helloWorld'
    }), 'helloWorld');
    return fn();
  } catch (err) {
    console.log(err);
  }
}

module.exports = router;