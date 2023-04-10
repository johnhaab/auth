const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");
// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
// Load User model
const User = require("../../models/User");
const authenticate = require("../../validation/authenticate");

router.get("/auth", authenticate, (req, res) => {
  res.json({ isAuthenticated: true });
});

router.get("/auth/logout", (req, res) => {
  res.clearCookie("sessionToken");
  res.json({ message: "Logged out successfully" });
});

router.post("/login", (req, res) => {
  // Form validation
  const { errors, isValid } = validateLoginInput(req.body);
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const email = req.body.email;
  const password = req.body.password;
  // Find user by email
  User.findOne({ email }).then((user) => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    }
    // Check password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user.id,
          name: user.name,
        };
        // Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926, // 1 year in seconds
          },
          (err, token) => {
            if (err) {
              // Handle the error
              console.log(err + "// : // : // : error signing token");
              return;
            }

            const cookieOptions = {
              httpOnly: false,
              sameSite: "strict",
              secure: process.env.NODE_ENV === "production",
              maxAge: 31556926 * 1000, // 1 year in milliseconds
              path: "/",
            };

            const cookie = `sessionToken=${token}; Path=/; SameSite=Strict; Max-Age=${
              cookieOptions.maxAge
            };${cookieOptions.secure ? "Secure" : ""}`;

            res.setHeader("Set-Cookie", cookie);
            res.setHeader("Access-Control-Allow-Credentials", "true");

            res.json({ success: true, token: `Bearer ${token}`, user: user });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
});

router.post("/register", (req, res) => {
  // Form validation
  const { errors, isValid } = validateRegisterInput(req.body);
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });
      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => res.json(user))
            .catch((err) => console.log(err));
        });
      });
    }
  });
});

// Add a new route for the user profile
router.get("/profile", authenticate, (req, res) => {
  User.findById(req.user.id)
    .then((user) => {
      if (user) {
        res.json({
          id: user.id,
          name: user.name,
          email: user.email,
          bio: user.bio,
          profilePicture: user.profilePicture,
          joinedDate: user.joinedDate,
          phoneNumber: user.phone,
          password: user.password, // Do not send the password back to the client
        });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Error fetching user data" });
    });
});

router.get("/auth", authenticate, (req, res) => {
  res.json({ isAuthenticated: true });
});

module.exports = router;
