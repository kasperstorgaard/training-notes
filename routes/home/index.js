const express = require('express');

const router = express.Router();

const partialsConfig = {
  main: 'partials/home'
};

router.get('/', (req, res, _next) => {
  const data = {};
  console.log('req');

  if (req.partialName
    console.log('xhrrrrr....');
    res.json({
      partials: renderPartials(partialsConfig)
    })
  } else {
    res.render('home/home', {
      page: 'Home',
      menuId: 'home',
      partials: partialsConfig
    });
  }
});

function renderPartials(config) {
  const keys = Object.keys(config);
  return keys.reduce((lookup, key) => {
    const partialName = config[key];
    lookup[key] = renderPartial(partialName);
    return lookup;
  }, {});
}


module.exports = router;