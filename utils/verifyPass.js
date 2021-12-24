const bcrypt = require('bcryptjs');
const {getUserByParams} = require('./user');

/**
 *
 * @param {String} email
 * @param {String} pass
 * @return{Boolean} user password is correct
 */
async function verifyPassByMail(email, pass) {
  const user = await getUserByParams({email});
  return bcrypt.compareSync(pass, user.password);
}

/**
 *
 * @param {String} pass
 * @param {String} userPass
 * @return{Boolean}
 */
async function verifyPass(pass, userPass) {
  return bcrypt.compareSync(pass, userPass);
}

module.exports = {verifyPass, verifyPassByMail};
