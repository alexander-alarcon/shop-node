const express = require('express');

const isAuth = require('../middleware/isAuth');
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
  .post(postLogin);

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
  .post(postSignUp);

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
