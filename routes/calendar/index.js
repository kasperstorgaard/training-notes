const express = require('express');
const url = require('url');
const lex = require('pug-lexer')
const parser = require('pug-parser')
const fs = require('fs');
const path = require('path');
const util = require('util');

const router = express.Router();

router.get('/calendar', async (req, res, _next) => {
  const referrerUrl = req.header('Referrer');
  const referrer = referrerUrl ? url.parse(referrerUrl) : null;

  if (!referrer || referrer.hostname !== req.hostname) {
    res.render('calendar/calendar', {
      page: 'Calendar',
      menuId: 'calendar'
    });
  } else {
    const filePath = path.join(__dirname, '../../views/calendar/calendar.pug');
    const parsed = await getBlocks(filePath);
    res.json({ parsed });
  }
});

async function getBlocks(filePath) {
  const filename = path.basename(filePath);
  const content = await util.promisify(fs.readFile)(filePath, 'utf8');
  const lexed = lex(content, {filename});
  const parsed = parser(lexed, {filename, src: content});
  return parsed;
}

module.exports = router;