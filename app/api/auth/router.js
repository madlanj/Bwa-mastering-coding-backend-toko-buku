const express = require('express');
const router = express.Router();
const contoller = require('./controller')
/* GET home page. */
router.post('/auth/signin', contoller.signin);
router.post('/auth/signup', contoller.signup);

module.exports = router;
