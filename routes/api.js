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

/**
 * @swagger
 * /login:
 *  post:
 *    summary: login & get token
 *    produces:
 *      - application/json
 *    parameters:
 *      - in: formData
 *        name: email
 *        required: true
 *        type: string
 *      - in: formData
 *        name: password
 *        required: true
 *        type: string
 *    responses:
 *      200:
 *        description: login successful
 *        schema:
 *          type: object
 *          required:
 *            - status
 *            - message
 *            - token
 *          properties:
 *            status:
 *              type: boolean
 *            message:
 *              type: string
 *            token:
 *              type: string
 *      401:
 *        description: login fail
 *        schema:
 *          type: object
 *          required:
 *            - status
 *            - message
 *          properties:
 *            status:
 *              type: boolean
 *            message:
 *              type: string
 *
 *
 */
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
