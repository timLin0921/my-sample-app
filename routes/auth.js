const express = require('express');
const router = new express.Router();
const {postLogin} = require('../controllers/user');
const passport = require('../config/passport');

router.get('/facebook', passport.authenticate('facebook', {scope: ['email']}));

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', {
    failureRedirect: '/user/login',
  }),
  postLogin,
);

router.get('/google', passport.authenticate('google'));

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/user/login',
  }),
  postLogin,
);

module.exports = router;
