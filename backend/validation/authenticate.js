// authenticate.js
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");

const authenticate = (req, res, next) => {
  // Retrieve the token from the HttpOnly cookie
  const token = req.cookies.accessToken;

  // Check if the token exist
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  // Verify the token
  try {
    const decoded = jwt.verify(token, keys.secretOrKey);
    req.user = decoded;
    next(); // Continue to the next middleware or route handler
  } catch (error) {
    res.status(401).json({ message: "Invalid token, authorization denied" });
  }
};

module.exports = authenticate;
