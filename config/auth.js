module.exports = {
  authenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('warning_msg', 'please sign in');
    res.redirect('/user/login');
  },
};
