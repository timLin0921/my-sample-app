const jwt = require('jsonwebtoken');
const config = require('../config/config');

const {JWT_SECRET} = config;

/**
 *
 * @param {String} data
 * @param {String} exp ex. 1s/1m
 * @return {String} jwt token
 */
function genJwtToken(data, exp = '30m') {
  return jwt.sign({_id: data.toString()}, JWT_SECRET, {expiresIn: exp});
}

/**
 *
 * @param {String} token
 * @return{Object}
 */
function verifyJwtToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return {error: 'TokenExpiredError: jwt expired'};
  }
}

module.exports = {genJwtToken, verifyJwtToken};
