const moment = require('moment');
const {sma} = require('../utils/movingAverge');
const sessionModel = require('../models/session');
const {getUsersByParams} = require('./user');
const {getSessionsByParams} = require('./session');

/**
 *
 * @param {Object} option
 * @return {UserData} return instance of UserData
 */
async function createUserData(option = {}) {
  const users = await UserData.getAllUsers(option);
  const sessions = await UserData.getAllSessions();
  const activeSessByDay = await sessionModel
    .aggregate()
    .match({'session.password': {$ne: {}}})
    .group({
      _id: {
        year: {$year: '$session.createDate'},
        month: {$month: '$session.createDate'},
        day: {$dayOfMonth: '$session.createDate'},
      },
      count: {$sum: 1},
    });

  return new UserData(users, sessions, activeSessByDay);
}

/**
 *
 * module description
 * @module UserData
 *
 */
class UserData {
  /**
   *
   * @param {Array} users
   * @param {Array} sessions
   * @param {Array} activeSessByDay
   */
  constructor(users, sessions, activeSessByDay) {
    this.users = users;
    this.sessions = sessions;
    this.activeSessByDay = activeSessByDay;
    this.activeSession = sessions.filter(
      (el) =>
        el.session &&
        el.session.passport &&
        Object.keys(el.session.passport).length > 0, // check session if active (if had user use this session login)
    );
  }

  /**
   * @return {Number} number of members
   */
  get signUpNum() {
    return this.users.length;
  }

  /**
   *
   * @param {Number} range
   * @param {Function|null} fn
   * @return {Array}
   */
  getActiveSessionMA(range, fn = null) {
    const sessionByDayArr = this.activeSessByDay.map((el) => el.count);
    return sma(sessionByDayArr, range, fn);
  }

  /**
   * @param {Number} day
   * @return {Number}
   */
  activeSessNumByDate(day) {
    return Array.from(
      new Set(
        this.activeSession
          .filter((el) =>
            moment(el.session.createDate)
              .add(day, 'days')
              .isAfter(moment().format('YYYY-MM-DD')),
          )
          .map((el) => el.session.passport.user),
      ),
    ).length;
  }

  /**
   * @param {Object} option
   * @return {Array|Object} return array of users | error Object
   */
  static async getAllUsers(option = {}) {
    try {
      return await getUsersByParams({}, option);
    } catch (err) {
      return {errors: `has error: ${err}`};
    }
  }

  /**
   *
   * @return {Array|Object} return array of users | error Object
   */
  static async getAllSessions() {
    try {
      return await getSessionsByParams({});
    } catch (err) {
      return {errors: `has error: ${err}`};
    }
  }
}

module.exports = {UserData, createUserData};
