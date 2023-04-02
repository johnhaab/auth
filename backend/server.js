const express = require("express");
const { connectToDb, getDb } = require("./db.js");
const cors = require("cors");

// init app & middleware
const app = express();
app.use(cors());
const PORT = process.env.PORT || 5000;

//db connection
let db;
connectToDb((err) => {
  if (!err) {
    app.listen(PORT, () => {
      console.log(`app is running on port ${PORT}`);
    });
    db = getDb();
  }
});

// routes
app.get("/user", (req, res) => {
  let user = [];
  db.collection("users")
    .find()
    .sort({ name: 1 })
    .forEach((res) => user.push(res))
    .then(() => {
      res.status(200).json(user);
    })
    .catch(() => {
      res.status(500).json({ err: "Could not fetch the documents." });
    });
});
