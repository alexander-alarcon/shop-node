const express = require('express');

const isAuth = require('../middleware/isAuth');
const {
  getLogin,
  getReset,
  getSignUp,
  postSignUp,
  postLogout,
  postLogin,
  postReset,
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

module.exports = router;
