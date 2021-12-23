const express = require('express');
const router = new express.Router();
const {authenticated} = require('../config/auth');
const {getHome, confirmEmail, resendEmail} = require('../controllers/auth');

router.get('/', authenticated, getHome);

router.get('/confirmEmail', authenticated, confirmEmail);

router.get('/confirmEmail/resend', authenticated, resendEmail);

module.exports = router;
