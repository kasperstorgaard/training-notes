const url = require('url');

const {getBlocks} = require('./block-loader');

module.exports.routerHelper = (view, config) => async (req, res, _next) => {
  const referrerUrl = req.header('Referrer');
  const referrer = referrerUrl ? url.parse(referrerUrl) : null;

  if (!referrer || referrer.hostname !== req.hostname) {
    res.render(view, config)
  } else {
    const blocks = getBlocks(view);
    res.json({blocks});
  }
};