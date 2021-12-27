const express = require('express');
const router = new express.Router();
const passport = require('passport');
const {registerVaildate} = require('../controllers/user');
const {
  logout,
  loginFail,
  reSendEmail,
  editUserPass,
  editUserName,
  postApiLogin,
  loginValidate,
  getUserProfile,
  postApiRegister,
  apiAuthlization,
  getStatisticsData,
} = require('../controllers/api');

router.get('/login/fail', loginFail);
router.get('/resend/email/verification', apiAuthlization, reSendEmail);
router.get('/logout', logout);
router.get('/user/profile', apiAuthlization, getUserProfile);
router.get('/statistics/data', apiAuthlization, getStatisticsData);

router.post('/register', registerVaildate, postApiRegister);
router.post(
  '/login',
  loginValidate,
  passport.authenticate('local', {
    failureRedirect: '/api/login/fail',
    failureFlash: false,
  }),
  postApiLogin,
);
router.post('/user/profile', apiAuthlization, editUserName);
router.post('/reset/password', apiAuthlization, editUserPass);

module.exports = router;
