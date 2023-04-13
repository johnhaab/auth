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
  res.clearCookie("accessToken");
  req.logout((err) => {
    if (err) {
      // Handle the error
      console.error(err);
      return;
    }
  });
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

            const expiresIn = 24 * 60 * 60 * 1000; // 24 hours in milliseconds.
            const expirationTime = Date.now() + expiresIn;

            const cookie = `accessToken=${token}; Path=/; expires=${expirationTime}; SameSite=Strict; Max-Age=${
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
          phone: user.phone,
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

// routes/users.js
router.put("/update", authenticate, async (req, res) => {
  User.findById(req.user.id)
    .then(async (user) => {
      if (user) {
        let hasChanges = false;

        if (req.body.newName && req.body.newName !== user.name) {
          user.name = req.body.newName;
          hasChanges = true;
        }
        if (req.body.newEmail && req.body.newEmail !== user.email) {
          user.email = req.body.newEmail;
          hasChanges = true;
        }
        if (req.body.newBio && req.body.newBio !== user.bio) {
          user.bio = req.body.newBio;
          hasChanges = true;
        }
        if (
          req.body.newProfilePicture &&
          req.body.newProfilePicture !== user.profilePicture
        ) {
          user.profilePicture = req.body.newProfilePicture;
          hasChanges = true;
        }
        if (req.body.newPhone && req.body.newPhone !== user.phone) {
          user.phone = req.body.newPhone;
          hasChanges = true;
        }
        if (req.body.newPassword) {
          const isMatch = await bcrypt.compare(
            req.body.newPassword,
            user.password
          );
          if (!isMatch) {
            hasChanges = true;
            const hashedNewPassword = await bcrypt.hash(
              req.body.newPassword,
              10
            );
            user.password = hashedNewPassword;
          }
        }

        if (hasChanges) {
          user
            .save()
            .then((user) => {
              res.json({
                success: true,
                message: "User data updated",
                user: {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  bio: user.bio,
                  profilePicture: user.profilePicture,
                  joinedDate: user.joinedDate,
                  phone: user.phone,
                },
              });
            })
            .catch((err) => {
              res.status(500).json({ message: "Error updating user data" });
            });
        } else {
          res.status(400).json({ message: "No changes detected" });
        }
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

// auth with twitter
router.get("/auth/twitter", passport.authenticate("twitter"));

// redirect to home page after successfully login via twitter
router.get(
  "/auth/twitter/redirect",
  passport.authenticate("twitter", {
    failureRedirect: "/auth/login/failed",
  }),
  (req, res) => {
    // Get the token parameter from the URL and assign it to the id property of the payload object
    const payload = {
      id: req.user._id,
      name: req.user.name,
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

        const expiresIn = 24 * 60 * 60 * 1000; // 24 hours in milliseconds.
        const expirationTime = Date.now() + expiresIn;

        const cookie = `accessToken=${token}; Path=/; expires=${expirationTime}; SameSite=Strict; Max-Age=${
          cookieOptions.maxAge
        };${cookieOptions.secure ? "Secure" : ""}`;

        res.setHeader("Set-Cookie", cookie);
        res.setHeader("Access-Control-Allow-Credentials", "true");

        res.redirect("http://localhost:3000/profile");
      }
    );
  }
);

module.exports = router;
