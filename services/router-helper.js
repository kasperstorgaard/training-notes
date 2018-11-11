const url = require('url');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

const viewDir = path.join(__dirname, '../views');
const publicDir = path.join(__dirname, '../public');

const {getBlocks} = require('./block-loader');

const fakeHash = 'asfsfd';

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

      if (!req.cookies[filePath]) {
        pushToStream(res, filePath, block.content, fakeHash);
      }
    });

    res.json({filePaths});
  }
};

function pushToStream(res, filePath, content, hash) {
  res.cookie(filePath, hash);

  const stream = res.push(filePath, {
    request: {accept: '*/*'},
    response: {
      'Content-Type': 'text/html; charset=UTF-8',
      // TODO: use proper file hash/versioning here.
      'Etag': hash,
      'Cache-Control': 'private, max-age=31536000'
    }
  });

  stream.end(content);
}
