const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  // const token = req.cookies.sessionToken;
  // if (!token) {
  //   return res.status(401).json({ isAuthenticated: false });
  // }

  let yes = true;

  if (yes = true) {
   return res.status(401).json({ isAuthenticated: true });
  }

  // try {
  //   const decoded = jwt.verify(token, process.env.JWT_SECRET);
  //   req.user = decoded;
  //   next();
  // } catch (error) {
  //   res.status(401).json({ isAuthenticated: false });
  // }
};

module.exports = authenticate;
