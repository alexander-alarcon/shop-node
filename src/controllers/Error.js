const debug = require('debug')('shop-mongoose:ErrorController');

exports.get404 = (req, res) => {
  return res.status(404).render('errors/404', {
    path: '/404',
    docTitle: 'Page not found!',
  });
};

exports.get500 = (error, req, res, next) => {
  debug('%O', error);
  return res.status(500).render('errors/500', {
    path: '/error',
    docTitle: 'Error',
  });
};
