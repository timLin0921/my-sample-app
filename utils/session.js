const sessionModel = require('../models/session');

/**
 *
 * @param {Object} params
 * @param {Object} option
 * @return {Object}
 */
async function getSessionByParams(params, option = {}) {
  try {
    return await sessionModel.findOne(params, option);
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
async function getSessionsByParams(params, option = {}) {
  try {
    return await sessionModel.find(params, option);
  } catch (e) {
    return new Error(`has error: ${err}`);
  }
}

module.exports = {getSessionByParams, getSessionsByParams};
