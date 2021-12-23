const express = require('express');
const router = new express.Router();
const passport = require('passport');
const {
  getLogout,
  getLogin,
  postLogin,
  getRegister,
  postRegister,
} = require('../controllers/user');

router.get('/login', getLogin);

router.post(
  '/login',
  (req, res, next) => {
    const {email, password} = req.body;
    if (!email || !password) {
      return res.render('login', {
        email,
        password,
        errors: [{message: 'Please input email / password !!'}],
        userCSS: true,
      });
    }
    next();
  },
  passport.authenticate('local', {
    failureRedirect: '/user/login',
    failureFlash: true,
  }),
  postLogin,
);

router.get('/register', getRegister);

router.post('/register', postRegister);

router.get('/logout', getLogout);

module.exports = router;
