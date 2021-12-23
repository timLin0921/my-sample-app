const User = require('../models/user');

/**
 *
 * @param {String} id
 * @return {UserModel}
 */
async function getUserById(id) {
  try {
    return await User.findById(id);
  } catch (err) {
    return new Error(`has error: ${err}`);
  }
}

/**
 *
 * @param {Object} params
 * @return {Object}
 */
async function getUserByParams(params) {
  try {
    return await User.findOne(params);
  } catch (e) {
    return new Error(`has error: ${err}`);
  }
}

module.exports = {getUserById, getUserByParams};
