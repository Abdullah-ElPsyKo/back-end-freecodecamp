const e = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
// Establishing connection with database
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  username: String,
});
const exerciseSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: String,
});

const logSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  username: { type: String, required: true },
  count: { type: Number, required: true },
  log: [
    {
      description: { type: String, required: true },
      duration: { type: Number, required: true },
      date: String,
    },
  ],
});

// create model
const User = mongoose.model("User", userSchema);
const Exercise = mongoose.model("Exercise", exerciseSchema);

//-------------------functions-------------------

async function createUser(username) {
  try {
    let newUser = await User.create({ username: username });
    return newUser;
  } catch (err) {
    console.error(err);
  }
}

async function findUser(id) {
  try {
    const user = await User.findById(id);
    if (user) {
      return user;
    }
    return "";
  } catch (err) {
    console.error(err);
  }
}

async function returnUsers() {
  try {
    let users = await User.find({});
    return users;
  } catch (err) {
    console.error(err);
  }
}

async function addExercise(id, description, duration, date) {
  try {
    const user = (await User.findById(id)).username;

    // if date is empty, set it to current date
    if (!date) {
      date = new Date().toDateString();
    } else {
      date = new Date(date).toDateString();
    }
    // create exercise
    let exercise = await Exercise.create({
      userId: id,
      description: description,
      duration: duration,
      date: date,
    });
    return exercise;
  } catch (err) {
    console.error(err);
  }
}

async function returnLogs(id, from, to, limit) {
  try {
    // get users username
    const user = (await User.findById(id)).username;
    // get all exercises
    let logs = await Exercise.find({ userId: id });
    // return only description, duration and date
    var mappedLogs = logs.map((log) => {
      return {
        description: log.description,
        duration: log.duration,
        date: log.date,
      };
    });

    if (from) {
      from = new Date(from).getTime();
      mappedLogs = mappedLogs.filter((log) => new Date(log.date).getTime() > from);
    }
    if (to) {
        to = new Date(to).getTime();
        mappedLogs = mappedLogs.filter((log) => new Date(log.date).getTime() < to);
    }
    if (limit) {
        mappedLogs = mappedLogs.slice(0, limit);
    }

    return {
      _id: id,
      username: user,
      count: logs.length,
      log: mappedLogs,
    };
  } catch (err) {
    console.error(err);
  }
}
//-------------------exports-------------------
exports.User = User;
exports.Exercise = Exercise;

exports.createUser = createUser;
exports.returnUsers = returnUsers;
exports.addExercise = addExercise;
exports.returnLogs = returnLogs;
exports.findUser = findUser;
