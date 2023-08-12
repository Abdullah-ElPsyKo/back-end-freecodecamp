require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const dns = require("dns");

app.use(bodyParser.urlencoded({ extended: false }));

// Basic Configuration
const port = process.env.PORT || 3000;
app.use(cors());
app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

const Url = require("./db").UrlModel;
const createAndSaveUrl = require("./db").createAndSaveUrl;
const findUrlByShortUrl = require("./db").findUrlByShortUrl;

app.post("/api/shorturl", async (req, res) => {
  let url = req.body.url;
  // Check for valid url format with dns lookup
  try {
    check_url = new URL(url);
    // check if url is http or https otherwise error
    if (check_url.protocol !== "http:" && check_url.protocol !== "https:") {
      res.json({ error: "invalid url" });
      return;
    }
  } catch (err) {
    res.json({ error: "invalid url" });
    return;
  }

  let savedURL = await createAndSaveUrl(url);
  res.json(savedURL);
});

app.get("/api/shorturl/:numb", async (req, res) => {
  if (isNaN(req.params.numb)) {
    res.json({ error: "invalid url" });
    return;
  }
  const shorturl = parseInt(req.params.numb);
  let url = await findUrlByShortUrl(shorturl);

  if (url === "error") {
    res.json({ error: "invalid url" });
    return;
  }
  res.redirect(url);
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
