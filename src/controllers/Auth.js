const debug = require('debug')('shop-mongoose:AuthController');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const fullUrl = require('../utils/getUrl');
const sgMail = require('../utils/emails');
const User = require('../models/User');

exports.getLogin = (req, res) => {
  const error = req.flash('error');
  const success = req.flash('success');
  return res.render('auth/login', {
    path: '/auth/login',
    docTitle: 'Login',
    error,
    success,
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
        req.flash('success', 'Login successfully');
        return res.redirect('/shop');
      });
    } else {
      req.flash('error', 'Invalid email or password');
      return await req.session.save((err) => {
        return res.redirect('/auth/login');
      });
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
    sgMail.send({
      from: 'shop@node.com',
      to: email,
      subject: 'Successful registration!',
      html: `
        <h1>Done!!</h1>
      `,
    });
    req.flash('success', 'Sign up successfully');
    return res.redirect('/auth/login');
  } catch (error) {
    debug(error);
    next(error);
  }
};

exports.getReset = (req, res) => {
  const error = req.flash('error');
  const success = req.flash('success');
  return res.render('auth/reset', {
    path: '/auth/reset',
    docTitle: 'Reset Password',
    error,
    success,
  });
};

exports.postReset = (req, res) => {
  const { email } = req.body;
  crypto.randomBytes(32, async (err, buffer) => {
    if (err) {
      req.flash('error', 'Something went wrong, please try again!');
      console.log(err);
      return res.redirect('/auth/reset');
    }

    try {
      const token = buffer.toString('hex');
      const user = await User.findOne({ email });
      if (!user) {
        req.flash('error', 'Email not found!');
        return req.session.save((err) => {
          return res.redirect('/auth/reset');
        });
      }
      const now = new Date();
      now.setHours(now.getHours() + 1);
      user.resetToken = token;
      user.resetTokenExpiration = now;
      await user.save();
      const url = fullUrl(req);
      sgMail.send({
        from: 'shop@node.com',
        to: email,
        subject: 'Password reset',
        html: `
          <p>You requested a password reset</p>
          <p>Click this <a href="${url}/${token}">link</a> to set a new password.</p>
        `,
      });
      req.flash(
        'success',
        `An email was sent to ${email}, please follow the instructions given`,
      );
      return res.redirect('/');
    } catch (error) {
      debug(error);
      return res.redirect('/auth/reset');
    }
  });
};

exports.getNewPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: {
        $gt: Date.now(),
      },
    });
    if (!user) {
      console.log('not user found');
      return res.redirect('/');
    }
    const error = req.flash('error');
    const success = req.flash('success');
    res.render('auth/new-password', {
      path: '/auth/new-password',
      docTitle: 'New password',
      error,
      success,
      userId: user.id,
      passwordToken: token,
    });
  } catch (error) {
    debug(error);
    next(error);
  }
};

exports.postNewPassword = async (req, res, next) => {
  try {
    const { password, userId, passwordToken } = req.body;
    const user = await User.findOne({
      _id: userId,
      resetToken: passwordToken,
      resetTokenExpiration: {
        $gt: new Date(),
      },
    });
    if (!user) {
      console.log('not user found');
      req.flash('error', 'Something went wrong, please try again!');
      return res.redirect('/');
    }
    user.password = password;
    user.resetToken = null;
    user.resetTokenExpiration = null;
    await user.save();
    req.flash('success', 'Password changed successfully!');
    return res.redirect('/auth/login');
  } catch (error) {
    debug(error);
    next(error);
  }
};
