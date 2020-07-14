const { body } = require('express-validator');
const express = require('express');

const isAuth = require('../middleware/isAuth');
const User = require('../models/User');

const {
  getLogin,
  getReset,
  getSignUp,
  getNewPassword,
  postSignUp,
  postLogout,
  postLogin,
  postReset,
  postNewPassword,
} = require('../controllers/Auth');

const router = express.Router();

/**
 * GET /auth/login
 * POST /auth/login
 */
router
  .route('/login')
  .get(getLogin)
  .post(
    [
      body('email', 'E-mail is required')
        .isEmail()
        .notEmpty(),
      body('password', 'Password is required').notEmpty(),
    ],
    postLogin,
  );

/**
 * POST /auth/logout
 */
router.post('/logout', isAuth, postLogout);

/**
 * GET /auth/signup
 * POST /auth/signup
 */
router
  .route('/signup')
  .get(getSignUp)
  .post(
    [
      body('firstName')
        .not()
        .isEmpty()
        .withMessage('First name is required'),
      body('lastName')
        .not()
        .isEmpty()
        .withMessage('Last name is required'),
      body('email', 'Please insert a valid email')
        .isEmail()
        .custom((value) => {
          return User.findOne({ email: value }).then((user) => {
            if (user) return Promise.reject(new Error('E-mail already in use'));
            return true;
          });
        }),
      body('password').custom((value) => {
        if (
          !/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/.test(
            value,
          )
        ) {
          throw new Error('Password is too weak!');
        }
        return true;
      }),
      body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords have to match!');
        }
        return true;
      }),
    ],
    postSignUp,
  );

/**
 * GET /auth/reset
 * POST /auth/reset
 */
router
  .route('/reset')
  .get(getReset)
  .post(postReset);

/**
 * GET /auth/reset/:token
 */
router.get('/reset/:token', getNewPassword);

/**
 * POST /auth/new-password
 */
router.post('/new-password', postNewPassword);

module.exports = router;
