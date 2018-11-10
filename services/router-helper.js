const url = require('url');

const {getBlocks} = require('./block-loader');

module.exports.routerHelper = (view, config) => async (req, res, _next) => {
  const referrerUrl = req.header('Referrer');
  const referrer = referrerUrl ? url.parse(referrerUrl) : null;

  if (!referrer || referrer.hostname !== req.hostname) {
    res.render(view, config)
  } else {
    const blocks = getBlocks(view);

    const filePaths = [];

    blocks.forEach(block => {
      console.log(block.content);
      const filePath = `/api/partials/${block.name}.html`;
      filePaths.push(filePath);

      const stream = res.push(filePath, {
        request: {accept: '*/*'},
        response: {'content-type': 'text/html'}
      });
      stream.end(block.content);
    });

    res.json({filePaths});
  }
};