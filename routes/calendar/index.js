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

const router = express.Router();
const viewDir = path.join(__dirname, '../../views');

router.get('/calendar', async (req, res, _next) => {
  const referrerUrl = req.header('Referrer');
  const referrer = referrerUrl ? url.parse(referrerUrl) : null;

  if (!referrer || referrer.hostname !== req.hostname) {
    res.render('calendar/calendar', {
      page: 'Calendar',
      menuId: 'calendar'
    });
  } else {
    const html = getBlocks('bar.pug')
    res.json({ html });
  }
});

function loadAst(view) {
  const filePath = path.join(__dirname, view);
  return load.file(filePath, {
    lex,
    parse
  });
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