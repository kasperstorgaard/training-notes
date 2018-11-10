const express = require('express');

const {routerHelper} = require('../services/router-helper');

const router = express.Router();

router.get('/', routerHelper('home', {
  page: 'Home',
  menuId: 'home'
}));

module.exports = router;