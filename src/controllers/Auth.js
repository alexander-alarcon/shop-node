const debug = require('debug')('shop-sequelize:AuthController');
const bcrypt = require('bcrypt');

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
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.redirect('/auth/login');
    }
    const isRightPassword = await bcrypt.compare(password, user.password);

    if (isRightPassword) {
      req.session.isAuthenticated = true;
      req.session.user = user;
      req.session.save((err) => {
        if (err) {
          next(err);
        }
        return res.redirect('/shop');
      });
    } else {
      return res.redirect('/auth/login');
    }
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

exports.postSignUp = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, confirmPassword } = req.body;
    const user = await User.findOne({ where: { email } });
    if (user) {
      return res.redirect('/auth/login');
    }
    const newUser = await new User({
      firstName,
      lastName,
      email,
      password,
    });
    await newUser.save();
    return res.redirect('/auth/login');
  } catch (error) {
    debug(error);
    next(error);
  }
};
