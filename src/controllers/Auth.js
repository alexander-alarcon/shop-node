const debug = require('debug')('shop-sequelize:AuthController');
const bcrypt = require('bcrypt');

const User = require('../models/User');

exports.getLogin = (req, res) => {
  const error = req.flash('error');
  return res.render('auth/login', {
    path: '/auth/login',
    docTitle: 'Login',
    error,
  });
};

exports.postLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      req.flash('error', 'Invalid email or password');
      return await req.session.save((err) => {
        return res.redirect('/auth/login');
      });
    }
    const isRightPassword = await bcrypt.compare(password, user.password);

    if (isRightPassword) {
      req.session.isAuthenticated = true;
      req.session.user = user;
      req.session.save((err) => {
        if (err) {
          req.flash('error', 'Something went wrong, please try again');
          return next(err);
        }
        return res.redirect('/shop');
      });
    }
    req.flash('error', 'Invalid email or password');
    return await req.session.save((err) => {
      return res.redirect('/auth/login');
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
  const error = req.flash('error');
  return res.render('auth/signup', {
    path: '/auth/signup',
    docTitle: 'Sign Up',
    error,
  });
};

exports.postSignUp = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, confirmPassword } = req.body;
    const user = await User.findOne({ where: { email } });
    if (user) {
      req.flash('error', 'Email already taken');
      return req.session.save((err) => {
        return res.redirect('/auth/login');
      });
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
