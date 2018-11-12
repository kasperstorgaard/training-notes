const url = require('url');
const path = require('path');

const {getBlocks} = require('./block-loader');

module.exports.routerHelper = (view, config) => async (req, res, _next) => {
  const referrerUrl = req.header('Referrer');
  const referrer = referrerUrl ? url.parse(referrerUrl) : null;

  if (!referrer || referrer.hostname !== req.hostname) {
    res.render(view, config)
  } else {
    const blocks = await getBlocks(view);
    const filePaths = [];

    blocks.forEach(block => {
      const filePath = `/html/${block.name}.html`;
      filePaths.push(filePath);

      if (!req.cookies[filePath] !== block.hash) {
        pushToStream(res, filePath, block);
      }
    });

    res.json({filePaths});
  }
};

function pushToStream(res, filePath, block) {
  res.cookie(filePath, block.hash);

  const stream = res.push(filePath, {
    request: {accept: '*/*'},
    response: {
      'Content-Type': 'text/html; charset=UTF-8',
      // TODO: use proper file hash/versioning here.
      'Etag': block.hash,
      'Cache-Control': 'private, max-age=31536000'
    }
  });

  stream.end(block.content);
}
