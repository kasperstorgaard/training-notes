const express = require('express');

const router = express.Router();

router.get('/', (_req, res, _next) => {
  res.render('index', {
    page: 'Home',
    menuId: 'home',
    partials: {
      main: 'partials/home'
    }
  });
});

module.exports = router;