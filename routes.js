const express = require('express');

const {routerHelper} = require('./services/router-helper');

const router = express.Router();

router.get('/', routerHelper('home', {}));
router.get('/calendar', routerHelper('calendar', {}));
router.get('/exercises', routerHelper('exercises', {}));

module.exports = router;