const express = require("express");
const app = express();
const cors = require("cors");
const db = require("./db.js");
const bodyParser = require("body-parser");
require("dotenv").config();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app
  .post("/api/users", async (req, res) => {
    const username = req.body.username;
    let user = await db.createUser(username);
    res.json({ username: user.username, _id: user._id });
  })
  .get("/api/users", async (req, res) => {
    // return all users
    res.json(await db.returnUsers());
  });

app
  .post("/api/users/:_id/exercises", async (req, res) => {
    // check if user exists
    try {
      let userExists = await db.findUser(req.params._id);
      // if user doesn't exist or if description or duration is empty
      if (!userExists || req.body.description === "" || req.body.duration === "") {
        res.send("Error");
        return;
      }
      // create exercise
      let exercise = await db.addExercise(
        req.params._id,
        req.body.description,
        req.body.duration,
        req.body.date
      );
      res.json({
        _id: exercise.userId,
        username: userExists.username,
        date: exercise.date,
        duration: exercise.duration,
        description: exercise.description
      });
    } catch (err) {
      console.error(err);
    }
  })
  .get("/api/users/:_id/logs", async (req, res) => {
    // return logs of user
    let logs = await db.returnLogs(
      req.params._id,
      req.query.from,
      req.query.to,
      req.query.limit
    );
    res.json(logs);
  });

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
