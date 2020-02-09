const express = require('express');

const { getLogin, postLogin } = require('../controllers/Auth');

const router = express.Router();

/* GET /login */
router
  .route('/login')
  .get(getLogin)
  .post(postLogin);

module.exports = router;
