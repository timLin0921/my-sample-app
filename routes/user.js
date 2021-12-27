const express = require('express');
const router = new express.Router();
const passport = require('passport');
const {authenticated} = require('../config/auth');

const {
  getLogout,
  getLogin,
  postLogin,
  getRegister,
  postRegister,
  editUserName,
  userConfirmMail,
  editUserPassword,
  registerVaildate,
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

router.post('/register', registerVaildate, postRegister);

router.get('/logout', getLogout);

router.get('/welcome', (req, res) => {
  return res.render('welcome');
});

router.get('/profile', authenticated, (req, res) => {
  const {name, email} = req.user;
  return res.render('profile', {name, email});
});

router.get('/confirm/:token', userConfirmMail);

router.post('/profile/edit/name', editUserName);

router.post('/profile/edit/password', editUserPassword);

module.exports = router;
