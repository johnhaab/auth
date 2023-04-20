const dotenv = require("dotenv");

module.exports = {
  mongoURI: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_URL}?retryWrites=true&w=majority`,
  secretOrKey: process.env.SECRET_OR_KEY,
  twitterConsumerKey: process.env.TWITTER_CONSUMER_KEY,
  twitterConsumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  twitterAccessToken: process.env.TWITTER_ACCESS_TOKEN,
  twitterAccessSecret: process.env.TWITTER_ACCESS_SECRET,
  cookieKey: process.env.COOKIE_KEY,
};
