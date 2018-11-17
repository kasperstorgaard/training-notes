const express = require('express');

const {routerHelper} = require('./services/router-helper');

const router = express.Router();

router.get('/', routerHelper('pages/home/home', {}));
router.get('/calendar', routerHelper('pages/calendar/calendar', {}));
router.get('/exercises', routerHelper('pages/exercises/exercises', {}));

module.exports = router;