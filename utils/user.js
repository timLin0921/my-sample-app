const bcrypt = require('bcryptjs');
const User = require('../models/user');

/**
 *
 * @param {Object} userData
 * @return {Promise}
 */
function createUser(userData) {
  return new User(userData).save();
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
      const user = await User.findOne({email: profile._json.email});
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

module.exports = {
  createUser,
  encryPassword,
  oauthCallback,
  getUserByParams,
  getUserById,
};
