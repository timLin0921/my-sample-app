const express = require('express');
const router = new express.Router();
const passport = require('passport');
const {
  getLogout,
  getLogin,
  getRegister,
  postRegister,
} = require('../controllers/user');

router.get('/login', getLogin);

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/user/login',
    failureFlash: true,
  }),
);

router.get('/register', getRegister);

router.post('/register', postRegister);

router.get('/logout', getLogout);

module.exports = router;
