const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user exists
      let user = await User.findOne({ email: profile.emails[0].value });
      
      if (!user) {
        // Create new user if doesn't exist
        user = new User({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          username: profile.emails[0].value.split('@')[0],
          isVerified: true
        });
        await user.save();
      } else if (!user.googleId) {
        // Update existing user with Google ID if not set
        user.googleId = profile.id;
        await user.save();
      }
      
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

// Serialize user into the sessions
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from the sessions
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
