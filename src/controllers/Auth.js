exports.getLogin = (req, res) => {
  res.render('auth/login', {
    path: '/auth/login',
    docTitle: 'Login',
  });
};
