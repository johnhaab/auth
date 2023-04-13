const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const passport = require("passport");
const TwitterStrategy = require("passport-twitter");
const mongoose = require("mongoose");
const User = mongoose.model("users");
const bcrypt = require("bcryptjs");
const keys = require("./keys");
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;
module.exports = (passport) => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      User.findById(jwt_payload.id)
        .then((user) => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch((err) => console.log(err));
    })
  );
};

// serialize the user.id to save in the cookie session
// so the browser will remember the user when login
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// deserialize the cookieUserId to user in the database
passport.deserializeUser((id, done) => {
  User.findById(id)
    .then((user) => {
      done(null, user);
    })
    .catch((e) => {
      done(new Error("Failed to deserialize an user"));
    });
});

passport.use(
  new TwitterStrategy(
    {
      consumerKey: keys.twitterConsumerKey,
      consumerSecret: keys.twitterConsumerSecret,
      callbackURL: "http://localhost:5000/api/users/auth/twitter/redirect",
    },
    async (token, tokenSecret, profile, done) => {
      // find current user in UserModel
      const currentUser = await User.findOne({
        oauth_provider_id: profile._json.id_str,
      });
      // hash password
      const hashedNewPassword = await bcrypt.hash(profile._json.id_str, 10);
      // create new user if the database doesn't have this user
      if (!currentUser) {
        const newUser = await new User({
          token: token,
          name: profile._json.screen_name,
          email: `${profile._json.screen_name}@example.com`,
          password: hashedNewPassword,
          profilePicture: profile._json.profile_image_url,
          oauth_provider_id: profile._json.id_str,
          oauth_provider: profile.provider,
        }).save();
        done(null, newUser);
      } else {
        done(null, currentUser);
      }
    }
  )
);
