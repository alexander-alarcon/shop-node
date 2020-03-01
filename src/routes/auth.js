const express = require('express');

const {
  getLogin,
  postLogin,
  postLogout,
  getSignUp,
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
 */
router.route('/signup').get(getSignUp);

module.exports = router;
