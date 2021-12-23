module.exports = {
  authenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      if (!req.user.emailVerified && !/confirmEmail/.test(req.path)) {
        return res.redirect('/confirmEmail');
      }

      if (req.user.emailVerified && /confirmEmail/.test(req.path)) {
        return res.redirect('/');
      }
      return next();
    }
    return res.redirect('/user/login');
  },
};
