const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var currentdate = new Date();

// Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    default: null,
  },
  oauth_provider: {
    type: String,
    default: null,
  },
  access_token: {
    type: String,
    default: null,
  },
  oauth_provider_id: {
    type: String,
    default: null,
  },
  joinedDate: {
    type: String,
    default: currentdate,
  },
  bio: {
    type: String,
    default: null,
  },
  profilePicture: {
    type: String,
    default:
      "https://thumbs.dreamstime.com/b/default-profile-picture-avatar-photo-placeholder-vector-illustration-default-profile-picture-avatar-photo-placeholder-vector-189495158.jpg",
  },
});

// eslint-disable-next-line no-undef
module.exports = User = mongoose.model("users", UserSchema);
