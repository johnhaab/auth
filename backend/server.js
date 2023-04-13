require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const users = require("./routes/api/users");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const keys = require("./config/keys");

app.use(
  cors({
    origin: "http://localhost:3000", // Replace with your client's origin
    credentials: true,
  })
);

app.use(cookieParser());

// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.use(bodyParser.json());

// parse cookies
app.use(cookieParser());

app.use(
  session({
    name: "sessionToken",
    secret: keys.cookieKey,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      httpOnly: false,
      secure: false,
      sameSite: "none",
    },
  })
);

// deserialize cookie from the browser
app.use(passport.session());
app.use(passport.initialize());

// DB Config
const db = require("./config/keys").mongoURI;
// Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("MongoDB successfully connected"))
  .catch((err) => console.log(err));
// Passport middleware
app.use(passport.initialize());
// Passport config
require("./config/passport")(passport);
// Routes
app.use("/api/users", users);
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server up and running on port ${port} !`));
