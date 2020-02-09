const express = require('express');

const { getLogin } = require('../controllers/Auth');

const router = express.Router();

/* GET /login */
router.route('/login').get(getLogin);

module.exports = router;
