const nodemailer = require('nodemailer');
const config = require('../config/config');

const {GOOGLE_MAIL_AC, GOOGLE_MAIL_PW} = config;

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  secureConnection: true,
  port: 465,
  secure: true,
  auth: {
    user: GOOGLE_MAIL_AC,
    pass: GOOGLE_MAIL_PW,
  },
});
/**
 *
 * @param {String} name
 * @param {String} mail
 * @param {String} code
 * @return {Promise}
 */
function sendMail(name, mail, code) {
  const mailOptions = {
    from: 'Tim <firebellylin@gmail.com>',
    to: mail,
    subject: 'My Sample App Email Confirmation',
    html: `<h1>Email Confirmation</h1>
    <h2>Hello ${name}</h2>
    <p>Thank you for sign up. Please confirm your email by clicking on the following link</p>
    <a href=https://localhost:3000/user/confirm/${code}> Click here</a>`,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}

module.exports = {sendMail};
