exports.getLogin = (req, res) => {
  res.render('auth/login', {
    path: '/auth/login',
    docTitle: 'Login',
    isAuthenticated: req.session.isAuthenticated === true,
  });
};

exports.postLogin = (req, res) => {
  req.session.isAuthenticated = true;
  res.redirect('/shop/');
};

exports.postLogout = (req, res) => {
  req.session.destroy(req.session.sid);
  res.clearCookie('connect.sid');
  res.redirect('/shop/');
};
