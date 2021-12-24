const bcrypt = require('bcryptjs');
const {getUserByParams} = require('./user');

/**
 *
 * @param {String} email
 * @param {String} pass
 * @return{Boolean} user password is correct
 */
async function verifyPass(email, pass) {
  const user = await getUserByParams({email});
  return bcrypt.compareSync(pass, user.password);
}

module.exports = {verifyPass};
