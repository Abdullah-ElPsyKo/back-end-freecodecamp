const e = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
// Establishing connection with database
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create schema in db
const urlSchema = new mongoose.Schema({
  original_url: String,
  short_url: Number,
});

const counterSchema = new mongoose.Schema({
  _id: String,
  seq: Number,
});
const Counter = mongoose.model("Counter", counterSchema);

// Create model
const Url = mongoose.model("Url", urlSchema);

const createAndSaveUrl = async (url) => {
  // if no counter exists, create one
  let counter = await Counter.findOne({ _id: "url_count" });

  if (!counter) {
    counter = await Counter.create({ _id: "url_count", seq: 0 });
  }

  // check if url already exists
  let checkUrl = await Url.findOne({ original_url: url });
  if (!checkUrl) {
    // increment counter
    counter.seq++;
    await counter.save();
    // create and save url
    await Url.create({ original_url: url, short_url: counter.seq });
    return { original_url: url, short_url: counter.seq };
  }
  // if url already exists, return it
  else {
    return {
      original_url: checkUrl.original_url,
      short_url: checkUrl.short_url,
    };
  }
};

const findUrlByShortUrl = async (shortUrl) => {
  // if url exists, return it
  try {
    let url = await Url.findOne({ short_url: shortUrl });
    if (url) {
      return url.original_url;
    }
    // if url doesn't exist, return error
    else {
      return "error";
    }
  } catch (err) {
    console.error(err);
  }
};

//-----------**exports**-----------

exports.UrlModel = Url;
exports.createAndSaveUrl = createAndSaveUrl;
exports.findUrlByShortUrl = findUrlByShortUrl;
