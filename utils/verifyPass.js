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

/**
 *
 * @param {String} password
 * @param {String} rePassword
 * @return {Array} error messages. ex: [{message:Password contains at least one lower and uper character}, {message: ....}]
 */
function passValidator(password, rePassword) {
  const errors = [];

  if (!/^(?=.*[a-z])(?=.*[A-Z]).+$/.test(password)) {
    errors.push({
      message: 'Password contains at least one lower and uper character',
    });
  }

  if (!/^(?=.*\d).+$/.test(password)) {
    errors.push({
      message: 'Password contains at least one digit character',
    });
  }

  if (password.length < 8) {
    errors.push({
      message: 'Password contains at least 8 characters',
    });
  }

  if (!/\W+/.test(password)) {
    errors.push({
      message: 'Password contains at least one special character',
    });
  }

  // password and confirm password must be the same
  if (password !== rePassword) {
    errors.push({message: 'Confirm Password is different from password'});
  }

  return errors;
}

module.exports = {verifyPass, verifyPassByMail, passValidator};
