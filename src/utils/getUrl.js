const { format } = require('url');

function fullUrl(req) {
  return format({
    protocol: req.protocol,
    host: req.get('host'),
    pathname: req.originalUrl,
  });
}

module.exports = fullUrl;
