const url = require('url');

const {getFragments} = require('./fragment-loader');

module.exports.routerHelper = (view, config) => async (req, res, _next) => {
  const referrerUrl = req.header('Referrer');
  const referrer = referrerUrl ? url.parse(referrerUrl) : null;

  if (!referrer || referrer.hostname !== req.hostname) {
    res.render(view, config)
  } else {
    const fragments = await getFragments(view);
    const filePaths = [];

    fragments.forEach(fragment => {
      const filePath = `/html/${fragment.name}.html`;
      filePaths.push(filePath);

      if (req.cookies[filePath] !== fragment.hash) {
        res.cookie(filePath, fragment.hash);

        const stream = res.push(filePath, {
          request: {accept: '*/*'},
          response: {
            'Content-Type': 'text/html; charset=UTF-8',
            'Etag': fragment.hash,
            'Cache-Control': 'private, max-age=31536000, no-cache'
          }
        });

        stream.end(fragment.content);
      }
    });

    res.setHeader('Cache-Control', 'stale-if-error=31536000');
    res.json({filePaths});
  }
};