const express = require('express');

const { getLogin, postLogin, postLogout } = require('../controllers/Auth');

const router = express.Router();

/* GET /login */
router
  .route('/login')
  .get(getLogin)
  .post(postLogin);

router.post('/logout', postLogout);

module.exports = router;
