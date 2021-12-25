const bcrypt = require('bcryptjs');
const UserModel = require('../models/user');

/**
 *
 * @param {Object} userData
 * @return {Promise}
 */
function createUser(userData) {
  return new UserModel(userData).save();
}

/**
 *
 * @param {Boolean} isRandom
 * @param {String} password
 * @param {Number} saltLen
 * @return {String}
 */
function encryPassword(isRandom, password = null, saltLen = 10) {
  let pass;

  if (isRandom) {
    pass = Math.random().toString(36).slice(-8);
  }

  if (!isRandom && password) {
    pass = password;
  }

  const salt = bcrypt.genSaltSync(saltLen);
  return bcrypt.hashSync(pass, salt);
}

/**
 *
 * @param {String} provider
 * @return {Function}
 */
function oauthCallback(provider) {
  return async (req, accessToken, refreshToken, profile, done) => {
    try {
      const user = await UserModel.findOne({email: profile._json.email});
      if (user) {
        return done(null, user);
      }
      const randomPassword = encryPassword(true);

      try {
        const newUser = await createUser({
          unque: `${profile._json.email}_${provider}`,
          name: profile._json.name,
          email: profile._json.email,
          password: randomPassword,
          createDate: new Date(),
          provider: provider,
          emailVerified: true,
        });
        done(null, newUser);
      } catch (err) {
        done(null, false, req.flash('fail_msg', `${err}`));
      }
    } catch (err) {
      done(
        err,
        false,
        req.flash('fail_msg', `${provider} verification failed`),
      );
    }
  };
}

/**
 *
 * @param {String} id
 * @return {UserModel}
 */
async function getUserById(id) {
  try {
    return await UserModel.findById(id);
  } catch (err) {
    return new Error(`has error: ${err}`);
  }
}

/**
 *
 * @param {Object} params
 * @param {Object} option
 * @return {Object}
 */
async function getUserByParams(params, option = {}) {
  try {
    return await UserModel.findOne(params, option);
  } catch (e) {
    return new Error(`has error: ${err}`);
  }
}

/**
 *
 * @param {Object} params
 * @param {Object} option
 * @return {Array}
 */
async function getUsersByParams(params, option = {}) {
  try {
    return await UserModel.find(params, option);
  } catch (e) {
    return new Error(`has error: ${err}`);
  }
}

module.exports = {
  createUser,
  getUserById,
  encryPassword,
  oauthCallback,
  getUserByParams,
  getUsersByParams,
};
