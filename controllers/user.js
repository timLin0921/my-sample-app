// const mongoose = require('mongoose');
const User = require('../models/user');
const {createUser, encryPassword} = require('../utils/user');

module.exports = {
  getRegister: (req, res) => {
    res.render('register', {userCSS: true});
  },
  getLogin: async (req, res) => {
    res.render('login', {userCSS: true});
  },
  postLogin: async (req, res) => {
    const {email} = req.body;
    const user = await User.findOne({email: email});
    user.lastLoginDate = new Date();
    user.loginTimes = user.loginTimes + 1;
    await user.save();
    res.redirect('/');
  },
  getLogout: (req, res) => {
    req.logout();
    req.flash('success_msg', 'you are already logout!');
    res.redirect('/user/login');
  },

  postRegister: (req, res) => {
    const {name, email, password, rePassword} = req.body;
    // error message for flash
    let errors = [];

    if (!name) {
      errors.push({message: 'Name is required!'});
    }

    // not accepting empty input
    if (!email || !password || !rePassword) {
      errors.push({message: 'Email & Password are required!'});
    }
    const passErrors = passValidator(password, rePassword);

    errors = errors.concat(passErrors);

    // show signup page again with inputted data when invalid
    if (errors.length > 0) {
      return res.render('register', {
        name,
        email,
        password,
        rePassword,
        errors,
        userCSS: true,
      });
    }

    User.findOne({email: email}).then(async (user) => {
      // if account already exist, redirect to log in page
      if (user) {
        return res.render('login', {
          email,
          userCSS: true,
          errors: [{message: 'Email has been registered!'}],
        });
      }
      // encrypt password
      const pass = encryPassword(false, password);

      try {
        await createUser({
          unque: `${email}_Local`,
          name: name,
          email: email,
          password: pass,
          createDate: new Date(),
          provider: 'Local',
        });
        req.flash('success_msg', 'Sign up Sucessfull, please sign in!');
        return res.redirect('/user/login');
      } catch (err) {
        return res.render('register', {
          email,
          userCSS: true,
          errors: [{message: `${err}`}],
        });
      }
    });
  },
};

/**
 *
 * @param {String} password
 * @param {String} rePassword
 * @return {Array}
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
