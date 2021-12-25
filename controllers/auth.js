const {sendMail} = require('../utils/mail');
const {genJwtToken} = require('../utils/jwtVerify');
const {createUserData} = require('../utils/getData');

module.exports = {
  async getHome(req, res, next) {
    let data;
    try {
      const option = {
        name: 1,
        email: 1,
        loginTimes: 1,
        createDate: 1,
        'session.createDate': 1,
      };

      const userData = await createUserData(option);

      data = {
        users: userData.users,
        signUpNums: userData.signUpNum,
        sessionMA: userData.getActiveSessionMA(7, (n) => n.toFixed(2)),
        sessActiveNumToday: userData.activeSessNumByDate(0),
      };
    } catch (err) {
      data = {};
      console.log(err);
    }

    return res.render('index', {data});
  },

  confirmEmail(req, res, next) {
    return res.render('confirmEmail');
  },

  async resendEmail(req, res, next) {
    const {name, email} = req.user;
    try {
      const token = genJwtToken(email, '30m');
      await sendMail(name, email, token);
      req.flash(
        'success_msg',
        'Already send confirm email, please help to check!',
      );
    } catch (err) {
      req.flash('fail_msg', `some error occur:${err}`);
    }

    return res.redirect('/confirmEmail');
  },
};
