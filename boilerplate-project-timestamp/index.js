// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.get("/api/:date?", (req, res) => {
  let date = req.params.date;
  let timestamp = new Date(date);

  // if date is empty, return current date
  if (!date) {
    timestamp = new Date();
  }
  // Check if date is in unix format
  else if (!isNaN(date) && date.length >= 10){
    var newdate = new Date(parseInt(date));
    res.json({
      unix: parseInt(date),
      utc: newdate.toUTCString()
    });
    return;
  }
  //check if date is valid
  else if (timestamp == "Invalid Date"){
    return res.json({ error: "Invalid Date" });
  }
  res.json({
    unix: timestamp.getTime(),
    utc: timestamp.toUTCString()
  });
})

// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});



// listen for requests :)
var listener = app.listen(process.env.PORT, function () { //process.env.PORT
  console.log('Your app is listening on port ' + listener.address().port);
});
