const debug = require('debug')('shop-sequelize:AuthController');

const User = require('../models/User');

exports.getLogin = (req, res) => {
  res.render('auth/login', {
    path: '/auth/login',
    docTitle: 'Login',
    isAuthenticated: req.session.isAuthenticated === true,
  });
};

exports.postLogin = async (req, res, next) => {
  try {
    const user = await User.findOne({});
    req.user = user;
    req.session.isAuthenticated = true;
    req.session.save((err) => {
      if (err) {
        next(err);
      }
      return res.redirect('/shop');
    });
  } catch (error) {
    debug(error);
    return next(error);
  }
};

exports.postLogout = (req, res) => {
  req.session.destroy(req.session.sid);
  res.clearCookie('connect.sid');
  res.redirect('/shop/');
};

exports.getSignUp = async (req, res, next) => {
  return res.render('auth/signup', {
    path: '/auth/signup',
    docTitle: 'Sign Up',
    isAuthenticated: req.session.isAuthenticated === true,
  });
};
