const {sendMail} = require('../utils/mail');
const {genJwtToken} = require('../utils/jwtVerify');

module.exports = {
  async getHome(req, res, next) {
    return res.render('index');
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
