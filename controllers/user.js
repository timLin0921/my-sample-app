const {sendMail} = require('../utils/mail');
const {getUserByParams} = require('../utils/user');
const {verifyPassByMail} = require('../utils/verifyPass');
const {createUser, encryPassword} = require('../utils/user');
const {genJwtToken, verifyJwtToken} = require('../utils/jwtVerify');

module.exports = {
  getRegister: (req, res) => {
    res.render('register', {userCSS: true});
  },
  getLogin: async (req, res) => {
    if (req.isAuthenticated()) {
      return res.redirect('/');
    }
    return res.render('login', {userCSS: true});
  },
  postLogin: async (req, res) => {
    const email = req.body.email || req.user.email;
    const user = await getUserByParams({email});
    user.lastLoginDate = new Date();
    user.loginTimes = user.loginTimes + 1;
    user.session = {
      createDate: req.session.createDate,
      sessionId: req.sessionID,
    };
    await user.save();
    return res.redirect('/');
  },
  getLogout: (req, res) => {
    req.logout();
    req.flash('success_msg', 'you are already logout!');
    return res.redirect('/user/login');
  },

  postRegister: async (req, res) => {
    const {name, email, password, rePassword} = req.body;
    // error message for flash
    let errors = [];

    // not accepting empty input
    if (!name || !email || !password || !rePassword) {
      errors.push({message: 'Name & Email & Password are required!'});
    }

    errors = errors.concat(passValidator(password, rePassword));

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

    try {
      const user = await getUserByParams({email});

      if (user) {
        return res.render('login', {
          email,
          userCSS: true,
          errors: [{message: 'Email has been registered!'}],
        });
      }

      const pass = encryPassword(false, password);

      await createUser({
        unque: `${email}_Local`,
        name: name,
        email: email,
        password: pass,
        createDate: new Date(),
        provider: 'Local',
      });

      const token = genJwtToken(email, '30m');
      await sendMail(name, email, token);

      req.flash(
        'success_msg',
        'Sign up Sucessfull. Please check mailbox to receive the verification mail to activate account',
      );
      return res.redirect('/user/login');
    } catch (err) {
      return res.render('register', {
        email,
        userCSS: true,
        errors: [{message: `${err}`}],
      });
    }
  },

  userConfirmMail: async (req, res) => {
    try {
      const data = verifyJwtToken(req.params.token);
      const user = await getUserByParams({email: data._id});

      if (!data.error && user && !user.emailVerified) {
        user.emailVerified = true;
        await user.save();
        req.session.destroy();
        return res.redirect('/user/welcome');
      }
      return res.status(404).render('404');
    } catch (err) {
      return res
        .status(404)
        .render('404', {errors: [{message: `has error: ${err}`}]});
    }
  },

  editUserName: async (req, res) => {
    const newName = req.body.name;
    const {email} = req.user;

    if (!newName) {
      req.flash('fail_msg', 'Please input new name!!');
      return res.redirect('/user/profile');
    }

    try {
      const user = await getUserByParams({email});
      user.name = newName;
      await user.save();
      req.flash('success_msg', 'Successful!!');
    } catch (err) {
      req.flash('fail_msg', `has error: ${err}`);
    } finally {
      return res.redirect('/user/profile');
    }
  },
  editUserPassword: async (req, res) => {
    let errors = [];
    const {pass, newPass, confirmNewPass} = req.body;
    const {name, email} = req.user;

    if (!pass || !newPass || !confirmNewPass) {
      req.flash('fail_msg', 'Please input password/new password');
      return res.redirect('/user/profile');
    }

    const isPassMatch = await verifyPassByMail(email, pass);
    const passErrors = passValidator(newPass, confirmNewPass);
    errors = errors.concat(passErrors);

    if (!isPassMatch) {
      req.flash('fail_msg', 'password is incorrect!!');
      return res.redirect('/user/profile');
    }

    if (pass === newPass) {
      req.flash('fail_msg', 'New password must different with old password!!');
      return res.redirect('/user/profile');
    }

    if (errors.length > 0) {
      return res.render('profile', {
        name,
        email,
        errors,
      });
    }

    try {
      const user = await getUserByParams({email});
      user.password = encryPassword(false, newPass);
      await user.save();
      req.flash('success_msg', 'Successful!!');
    } catch (err) {
      req.flash('fail_msg', `has error: ${err}!!`);
    } finally {
      return res.redirect('/user/profile');
    }
  },
};

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
