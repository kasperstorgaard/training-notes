const express = require('express');

const {routerHelper} = require('./services/router-helper');

const router = express.Router();

router.get('/', routerHelper('pages/home/home', {name: 'home'}));
router.get('/calendar', routerHelper('pages/calendar/calendar', {name: 'calendar'}));
router.get('/exercises', routerHelper('pages/exercises/exercises', {name: 'exercises'}));

if (process.env.NODE_ENV !== 'production') {
  router.get('/components', routerHelper('pages/components/components', {name: 'components'}));
}

module.exports = router;