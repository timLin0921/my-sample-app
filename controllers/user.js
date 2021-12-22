// const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

module.exports = {
  getRegister: (req, res) => {
    res.render('register', {userCSS: true});
  },
  getLogin: async (req, res) => {
    res.render('login', {userCSS: true});
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

    User.findOne({email: email}).then((user) => {
      // if account already exist, redirect to log in page
      if (user) {
        return res.render('login', {
          email,
          userCSS: true,
          errors: [{message: 'Email has been registered!'}],
        });
      }
      // otherwise, create new document
      const newUser = new User({name, email, password});
      // encrypt password
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, async (err, hash) => {
          if (err) throw err;
          // replace password with hashed one
          newUser.password = hash;
          // save document to user collection
          try {
            await newUser.save();
            return res.redirect('/');
          } catch (error) {
            return res.status(403).json({status: 'Fail', errorMessage: error});
          }
        });
      });
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

  if (!/^.*[!@#$%^&*_].+$/.test(password)) {
    errors.push({
      message: 'Password contains at least one special character(!@#$%^&*_)',
    });
  }

  // password and confirm password must be the same
  if (password !== rePassword) {
    errors.push({message: 'Confirm Password is different from password'});
  }

  return errors;
}
