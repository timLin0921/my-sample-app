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

router.post(
  '/login',
  loginValidate,
  passport.authenticate('local', {
    failureRedirect: '/api/login/fail',
    failureFlash: false,
  }),
  postApiLogin,
);

router.get('/logout', logout);
router.get('/login/fail', loginFail);
router.post('/user/profile', apiAuthlization, editUserName);
router.post('/register', registerVaildate, postApiRegister);
router.get('/user/profile', apiAuthlization, getUserProfile);
router.post('/reset/password', apiAuthlization, editUserPass);
router.get('/statistics/data', apiAuthlization, getStatisticsData);
router.get('/resend/email/verification', apiAuthlization, reSendEmail);

module.exports = router;
