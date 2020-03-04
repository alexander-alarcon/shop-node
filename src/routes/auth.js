const express = require('express');

const {
  getLogin,
  getSignUp,
  postSignUp,
  postLogout,
  postLogin,
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
 * POST /auth/login
 */
router.post('/logout', postLogout);

/**
 * GET /auth/login
 * POST /auth/signup
 */
router
  .route('/signup')
  .get(getSignUp)
  .post(postSignUp);

module.exports = router;
