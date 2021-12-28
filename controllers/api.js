const {sendMail} = require('../utils/mail');
const {createUserData} = require('../utils/getData');
const {genJwtToken, verifyJwtToken} = require('../utils/jwtVerify');
const {getUserByParams, encryPassword} = require('../utils/user');
const {verifyPassByMail, passValidator} = require('../utils/verifyPass');

module.exports = {
  postApiRegister: (req, res, next) => {
    if (res.locals.success) {
      return res.status(200).json({status: true, message: res.locals.success});
    }
    return res.status(406).json({status: false, errors: res.locals.errors});
  },
  apiAuthlization: (req, res, next) => {
    verification(req, res);

    const {apiCode, apiStatus, apiErrors} = res.locals;
    if (apiCode === 401) {
      return res.status(apiCode).json({status: apiStatus, errors: apiErrors});
    }
    next();
  },
  loginValidate: (req, res, next) => {
    const {email, password} = req.body;
    if (!email | !password) {
      return res.status(401).json({
        status: false,
        errors: [
          {message: 'not found email/password datas, please help to check!'},
        ],
      });
    }
    next();
  },
  loginFail: (req, res) => {
    return res.status(401).json({
      statue: false,
      errors: [{message: 'Email/Password is incorrect!!'}],
    });
  },
  postApiLogin: async (req, res) => {
    const email = req.body.email || req.user.email;
    const user = await getUserByParams({email});
    user.lastLoginDate = new Date();
    user.loginTimes = user.loginTimes + 1;
    user.session = {
      createDate: req.session.createDate,
      sessionId: req.sessionID,
    };
    await user.save();

    const jwtToken = genJwtToken(user._id);
    return res
      .status(200)
      .json({status: true, message: 'Login Successful!!', token: jwtToken});
  },
  getUserProfile: async (req, res) => {
    try {
      const {email} = res.locals.user;
      const user = await getUserByParams({email});
      const data = {name: user.name, email: user.email};

      return res
        .status(200)
        .json({status: true, message: 'Successful!', data: data});
    } catch (err) {
      return res
        .status(500)
        .json({status: false, errors: [{message: `has error: ${err}`}]});
    }
  },
  editUserName: async (req, res) => {
    const {name: newName} = req.body;
    const {email} = res.locals.user;

    if (!newName) {
      return res.status(406).json({
        status: false,
        errors: [{message: 'User new name is required!!'}],
      });
    }
    try {
      const user = await getUserByParams({email});

      if (user.name === newName) {
        return res.status(406).json({
          status: false,
          errors: [{message: 'User new name must different with old name'}],
        });
      }
      user.name = newName;
      await user.save();
      return res
        .status(200)
        .json({status: true, message: 'Change user name successful!!'});
    } catch (err) {
      return res.status(500).json({
        status: false,
        errors: [{message: 'Change user name successful!!'}],
      });
    }
  },
  editUserPass: async (req, res) => {
    const {pass, newPass, confirmNewPass} = req.body;
    const {email} = res.locals.user;

    if (!pass || !newPass || !confirmNewPass) {
      return res.status(406).json({
        status: false,
        errors: [{message: 'Please input password/new password'}],
      });
    }

    const isPassMatch = await verifyPassByMail(email, pass);
    const passErrors = passValidator(newPass, confirmNewPass);

    if (!isPassMatch) {
      return res.status(406).json({
        status: false,
        errors: [{message: 'password is incorrect!!'}],
      });
    }

    if (pass === newPass) {
      return res.status(406).json({
        status: false,
        errors: [{message: 'New password must different with old password!!'}],
      });
    }

    if (passErrors.length > 0) {
      return res.status(406).json({
        status: false,
        errors: passErrors,
      });
    }

    try {
      const user = await getUserByParams({email});
      user.password = encryPassword(false, newPass);
      await user.save();
      return res.status(200).json({
        status: true,
        message: 'Change Successful!!',
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        errors: [{message: `has error: ${err}`}],
      });
    }
  },
  getStatisticsData: async (req, res) => {
    try {
      const option = {
        name: 1,
        email: 1,
        loginTimes: 1,
        createDate: 1,
        'session.createDate': 1,
      };
      const userData = await createUserData(option);

      const data = {
        users: userData.users,
        signUpNums: userData.signUpNum,
        sessionMA: userData.getActiveSessionMA(7, (n) => n.toFixed(2)),
        sessActiveNumToday: userData.activeSessNumByDate(0),
      };
      return res.status(200).json({status: true, ...data});
    } catch (err) {
      return res
        .status(500)
        .json({status: false, errors: [{message: `has error occur: ${err}`}]});
    }
  },
  reSendEmail: async (req, res) => {
    const {apiCode, apiStatus, apiSuccess} = res.locals;

    if (apiStatus) {
      try {
        const {email, name} = res.locals.user;
        const token = genJwtToken(email, '30m');
        await sendMail(name, email, token);
      } catch (err) {
        return res.status(500).json({
          status: false,
          errors: [{message: `has error occur: ${err}`}],
        });
      }
    }
    return res.status(apiCode).json({status: apiStatus, message: apiSuccess});
  },
  logout: (req, res) => {
    try {
      req.logout();
      return res
        .status(200)
        .json({status: true, message: 'Logout Successful!!'});
    } catch (e) {
      return res
        .status(500)
        .json({status: true, errors: [{message: 'Logout Successful!!'}]});
    }
  },
};

const verification = (req, res) => {
  const token = req.header('Authorization');

  res.locals.apiSuccess = '';
  res.locals.apiCode = 401;
  res.locals.apiStatus = false;
  res.locals.apiErrors = [{message: 'Please login first!!'}];

  if (!token) {
    res.locals.apiErrors = [{message: 'Unauthorization header'}];
    return;
  }

  const jwtData = verifyJwtToken(token.replace('Bearer ', ''));

  if (jwtData.error) {
    res.locals.apiErrors = [{message: 'Authorization token is expired!!'}];
    return;
  }

  if (
    res.locals.user &&
    jwtData._id.toString() !== res.locals.user._id.toString()
  ) {
    res.locals.apiErrors = [{message: 'Authorization token is invaild!!'}];
    return;
  }

  const isResendRoute = /resend/.test(req.path);
  if (!isResendRoute && res.locals.user && !res.locals.user.emailVerified) {
    res.locals.apiErrors = [{message: 'Please verify mailbox!!'}];
    return;
  }

  if (res.locals.user && res.locals.user.emailVerified) {
    res.locals.apiCode = 200;
    res.locals.apiSuccess = 'Email has been verified!!';
    return;
  }
  if (res.locals.isAuthenticated) {
    res.locals.apiStatus = true;
    res.locals.apiCode = 200;
    res.locals.apiSuccess = 'Resend Email Successful!!';
    return;
  }

  return;
};
