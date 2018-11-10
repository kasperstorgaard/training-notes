const express = require('express');

const {routerHelper} = require('../services/router-helper');

const router = express.Router();

router.get('/calendar', routerHelper('calendar', {
  page: 'Calendar',
  menuId: 'calendar'
}));

module.exports = router;