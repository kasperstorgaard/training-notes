const express = require('express');
const url = require('url');

const router = express.Router();

router.get('/', (req, res, _next) => {
  const referrerUrl = req.header('Referrer');
  const referrer = referrerUrl ? url.parse(referrerUrl) : null;

  if (!referrer || referrer.hostname !== req.hostname) {
    res.render('home/home', {
      page: 'Home',
      menuId: 'home'
    });
  } else {
    res.json({
      hello: 'hi :)'
    })
  }
});

module.exports = router;