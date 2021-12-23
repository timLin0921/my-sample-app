const bcrypt = require('bcryptjs');
const config = require('./config');
const passport = require('passport');
const User = require('../models/user');
const LocalStrategy = require('passport-local');
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const {oauthCallback} = require('../utils/user');
const {FACEBOOK_APP_ID, FACEBOOK_APP_SECRET, FACEBOOK_APP_CALLBACK} = config;
const {GOOGLE_APP_ID, GOOGLE_APP_SECRET, GOOGLE_APP_CALLBACK} = config;

// Local Strategy
passport.use(
  new LocalStrategy(
    {usernameField: 'email', passReqToCallback: true},
    async (req, email, password, done) => {
      const user = await User.findOne({email: email});

      if (!user) {
        return done(
          null,
          false,
          req.flash('fail_msg', 'Email / Password is incorrect!'),
        );
      }
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;
        return isMatch
          ? done(null, user)
          : done(
              null,
              false,
              req.flash('fail_msg', 'Email / Password is incorrect!'),
            );
      });
    },
  ),
);

// facebook Strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: FACEBOOK_APP_ID,
      clientSecret: FACEBOOK_APP_SECRET,
      callbackURL: FACEBOOK_APP_CALLBACK,
      profileFields: ['id', 'displayName', 'photos', 'email'],
      passReqToCallback: true,
    },
    oauthCallback('Facebook'),
  ),
);

// facebook Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_APP_ID,
      clientSecret: GOOGLE_APP_SECRET,
      callbackURL: GOOGLE_APP_CALLBACK,
      passReqToCallback: true,
      scope: ['profile', 'email'],
    },
    oauthCallback('Google'),
  ),
);

// serialize user instance to the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// deserialize user instance from the session
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

module.exports = passport;
